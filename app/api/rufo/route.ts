import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { siteKnowledge } from '../../lib/rufo/knowledge';
import { RUFO_INSTRUCTIONS, RUFO_PAGE_NOTE } from '../../lib/rufo/prompt';
import { deliverRufoLead, parseLead } from '../../lib/rufo/lead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Rufo's chat. The browser sends the conversation so far (text only); the
 * reply streams back as one JSON object per line:
 *   {"t":"text","v":"..."}   a piece of Rufo's answer
 *   {"t":"lead","ok":true}   a demo request was sent to the team
 *   {"t":"done"} | {"t":"error","code":"..."}
 * Off (503) until ANTHROPIC_API_KEY is set on the server.
 */

const MODEL = 'claude-opus-5-5';
const MAX_TURNS = 30;
const MAX_USER_CHARS = 1200;
const MAX_ASSISTANT_CHARS = 4000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_DAY = 150;
const MAX_LEADS_PER_DAY = 3;
const SALT = randomBytes(32);

const REQUEST_DEMO: Anthropic.Beta.BetaTool = {
  name: 'request_demo',
  description:
    'Send a demo request to the Whagons team, who will reply to the visitor by email. Call it only after the visitor has asked for a demo, given these details and confirmed them when you read them back. Never call it twice for the same person.',
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: "The visitor's full name." },
      email: { type: 'string', description: "The visitor's work email." },
      company: { type: 'string', description: 'Company or hotel name.' },
      industry: { type: 'string', description: 'Their industry, e.g. hospitality, manufacturing, facilities.' },
      team_size: { type: 'string', description: 'Roughly how many people work in the operation, as they said it.' },
      phone: { type: 'string', description: 'Phone number, only if the visitor offered it.' },
      summary: {
        type: 'string',
        description:
          'Two to four sentences for the sales team: what the operation is, how they work today, what they want to solve, anything they asked about. In English.',
      },
    },
    required: ['name', 'email', 'company', 'industry', 'team_size', 'summary'],
    additionalProperties: false,
  },
};

// ---- rate limits (per address, in memory; one container) ----
const buckets = new Map<string, { windowStart: number; inWindow: number; dayStart: number; inDay: number; leads: number }>();

function addressOf(request: NextRequest) {
  return (
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    null
  );
}

function bucketFor(request: NextRequest) {
  const address = addressOf(request) || 'unknown';
  const key = createHash('sha256').update(SALT).update(address).digest('hex').slice(0, 32);
  const now = Date.now();
  if (buckets.size > 20000) buckets.clear();
  let b = buckets.get(key);
  if (!b) {
    b = { windowStart: now, inWindow: 0, dayStart: now, inDay: 0, leads: 0 };
    buckets.set(key, b);
  }
  if (now - b.windowStart > WINDOW_MS) {
    b.windowStart = now;
    b.inWindow = 0;
  }
  if (now - b.dayStart > DAY_MS) {
    b.dayStart = now;
    b.inDay = 0;
    b.leads = 0;
  }
  return b;
}

// ---- input ----
interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

function parseBody(body: unknown):
  | { lang: 'es' | 'en'; page: string; turns: ChatTurn[] }
  | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const lang = b.lang === 'en' ? 'en' : b.lang === 'es' ? 'es' : null;
  if (!lang || !Array.isArray(b.messages)) return null;
  const page = typeof b.page === 'string' && /^\/[\w\-/.%]*$/.test(b.page) ? b.page.slice(0, 200) : '/';
  const turns: ChatTurn[] = [];
  for (const m of b.messages.slice(-MAX_TURNS)) {
    if (!m || typeof m !== 'object') return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const text = content.trim().slice(0, role === 'user' ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS);
    if (!text) continue;
    const last = turns[turns.length - 1];
    if (last && last.role === role) last.content += `\n\n${text}`;
    else turns.push({ role, content: text });
  }
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') return null;
  return { lang, page, turns };
}

// After a refusal hands over to the fallback model mid-answer, thinking and
// tool calls before the hand-over are not sent back (the API's rule).
function contentToSendBack(content: Anthropic.Beta.BetaContentBlock[]): Anthropic.Beta.BetaContentBlockParam[] {
  const lastFallback = content.map((b) => b.type).lastIndexOf('fallback');
  return content.filter(
    (b, i) =>
      i >= lastFallback ||
      (b.type !== 'thinking' && b.type !== 'redacted_thinking' && b.type !== 'tool_use')
  ) as Anthropic.Beta.BetaContentBlockParam[];
}

const encoder = new TextEncoder();
const line = (o: unknown) => encoder.encode(`${JSON.stringify(o)}\n`);

const SORRY = {
  es: 'Uy, se me enredaron las antenas. ¿Me lo preguntas otra vez? Si es urgente, escríbenos a hello@whagons.com.',
  en: 'Oops, my antlers got tangled. Could you ask me again? If it’s urgent, write to hello@whagons.com.',
};

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    return Response.json({ error: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
  let parsed: ReturnType<typeof parseBody>;
  try {
    parsed = parseBody(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) return Response.json({ error: 'bad_request' }, { status: 400 });

  const bucket = bucketFor(request);
  if (bucket.inWindow >= MAX_PER_WINDOW || bucket.inDay >= MAX_PER_DAY) {
    return Response.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '600' } });
  }
  bucket.inWindow += 1;
  bucket.inDay += 1;

  const knowledge = await siteKnowledge();
  if (!knowledge.pages) return Response.json({ error: 'unavailable' }, { status: 503 });

  const { lang, page, turns } = parsed;
  const requestId = request.headers.get('cf-ray')?.split('-')[0] || randomUUID();
  const client = new Anthropic();
  const system: Anthropic.Beta.BetaTextBlockParam[] = [
    {
      type: 'text',
      text: `${RUFO_INSTRUCTIONS}\n\n<website>\n${knowledge.text}\n</website>`,
      cache_control: { type: 'ephemeral', ttl: '1h' },
    },
  ];
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...turns,
    { role: 'system', content: RUFO_PAGE_NOTE(lang, page) },
  ];

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false;
      try {
        for (let round = 0; round < 3; round++) {
          const stream = client.beta.messages.stream(
            {
              model: MODEL,
              max_tokens: 4000,
              betas: ['server-side-fallback-2026-07-01'],
              fallbacks: 'default',
              output_config: { effort: 'low' },
              system,
              tools: [REQUEST_DEMO],
              messages,
            },
            { signal: request.signal }
          );
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta' && event.delta.text) {
              wroteText = true;
              controller.enqueue(line({ t: 'text', v: event.delta.text }));
            }
          }
          const message = await stream.finalMessage();
          const u = message.usage;
          console.log(
            JSON.stringify({
              event: 'rufo_turn',
              requestId,
              model: message.model,
              stop: message.stop_reason,
              input: u.input_tokens,
              cacheRead: u.cache_read_input_tokens,
              cacheWrite: u.cache_creation_input_tokens,
              output: u.output_tokens,
            })
          );

          if (message.stop_reason === 'refusal') {
            if (!wroteText) controller.enqueue(line({ t: 'text', v: SORRY[lang] }));
            break;
          }
          const calls = message.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use');
          if (message.stop_reason !== 'tool_use' || !calls.length) break;

          messages.push({ role: 'assistant', content: contentToSendBack(message.content) });
          const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
          for (const call of calls) {
            if (call.name !== 'request_demo') {
              results.push({ type: 'tool_result', tool_use_id: call.id, is_error: true, content: 'Unknown tool.' });
              continue;
            }
            const check = parseLead(call.input);
            if ('error' in check) {
              results.push({ type: 'tool_result', tool_use_id: call.id, is_error: true, content: check.error });
              continue;
            }
            if (bucket.leads >= MAX_LEADS_PER_DAY) {
              results.push({
                type: 'tool_result',
                tool_use_id: call.id,
                is_error: true,
                content: 'Too many requests from this visitor today. Ask them to write to hello@whagons.com instead.',
              });
              continue;
            }
            bucket.leads += 1;
            const sent = await deliverRufoLead(check.lead, {
              lang,
              page,
              requestId,
              country: request.headers.get('cf-ipcountry'),
              city: request.headers.get('cf-ipcity'),
              ip: addressOf(request),
            });
            controller.enqueue(line({ t: 'lead', ok: sent.ok }));
            results.push({
              type: 'tool_result',
              tool_use_id: call.id,
              is_error: !sent.ok,
              content: sent.ok
                ? 'Sent. The team will reply to the visitor by email, usually within one business day.'
                : 'It could not be sent right now. Ask the visitor to use the demo form or write to hello@whagons.com.',
            });
          }
          messages.push({ role: 'user', content: results });
        }
        controller.enqueue(line({ t: 'done' }));
      } catch (error) {
        if (!request.signal.aborted) {
          console.error(
            JSON.stringify({
              event: 'rufo_error',
              requestId,
              status: error instanceof Anthropic.APIError ? error.status : undefined,
              error: error instanceof Error ? error.name : 'Unknown',
            })
          );
          if (!wroteText) controller.enqueue(line({ t: 'text', v: SORRY[lang] }));
          controller.enqueue(line({ t: 'error', code: error instanceof Anthropic.RateLimitError ? 'busy' : 'failed' }));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
