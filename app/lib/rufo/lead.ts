/**
 * A demo request Rufo takes in the chat: the same Flodesk segment and team
 * email as the demo form, labelled as coming from Rufo and carrying his
 * summary of the conversation.
 */
import {
  RUFO_CHAT_SOURCE,
  buildFlodeskCustomFields,
  demoSegmentName,
  findFlodeskSegmentId,
  resolveApproximateLocation,
  sendDemoNotification,
  upsertFlodeskSubscriber,
} from '../demo-delivery.mjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only the live site sends demo requests to Flodesk and the team inbox.
// Anywhere else (Coolify previews, local runs) a request Rufo takes is
// simulated: nothing leaves the server. RUFO_LEADS=dry-run forces the same
// on the live site, for testing there.
const LIVE_HOSTS = new Set(['whagons.com', 'www.whagons.com']);

export function leadDeliveryMode(host: string | null | undefined, setting = process.env.RUFO_LEADS): 'live' | 'dry-run' {
  if (setting?.trim().toLowerCase() === 'dry-run') return 'dry-run';
  const name = (host || '').split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');
  return LIVE_HOSTS.has(name) ? 'live' : 'dry-run';
}

export interface RufoLeadInput {
  name: string;
  email: string;
  company: string;
  industry: string;
  team_size: string;
  phone?: string;
  summary: string;
}

const clean = (value: unknown, max = 200) =>
  typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max) : '';

/** Checks the tool input; returns the cleaned lead or what is missing. */
export function parseLead(input: unknown): { lead: RufoLeadInput } | { error: string } {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const lead: RufoLeadInput = {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    company: clean(raw.company),
    industry: clean(raw.industry),
    team_size: clean(raw.team_size, 60),
    phone: clean(raw.phone, 60),
    summary: clean(raw.summary, 1500),
  };
  const missing = (['name', 'email', 'company', 'industry', 'team_size'] as const).filter((k) => !lead[k]);
  if (missing.length) return { error: `Missing: ${missing.join(', ')}. Ask the visitor for them.` };
  if (!EMAIL_REGEX.test(lead.email)) return { error: 'The email address is not valid. Ask the visitor to check it.' };
  return { lead };
}

const segmentIds = new Map<string, { id: string | null; expiresAt: number }>();

async function demoSegment(apiKey: string, lang: 'es' | 'en') {
  const configured = (lang === 'es' ? process.env.FLODESK_SEGMENT_DEMO_ES_ID : process.env.FLODESK_SEGMENT_DEMO_EN_ID)?.trim();
  if (configured) return configured;
  const name = demoSegmentName(lang);
  const cached = segmentIds.get(name);
  if (cached && Date.now() < cached.expiresAt) return cached.id || undefined;
  const result = await findFlodeskSegmentId({ apiKey, segmentName: name, timeoutMs: 1200 });
  segmentIds.set(name, { id: result.id, expiresAt: Date.now() + (result.ok ? 3600_000 : 300_000) });
  return result.id || undefined;
}

export async function deliverRufoLead(
  lead: RufoLeadInput,
  context: { lang: 'es' | 'en'; page: string; requestId: string; country?: string | null; city?: string | null; ip?: string | null }
): Promise<{ ok: boolean }> {
  const apiKey = process.env.FLODESK_API_KEY?.trim() || '';
  const [location, segment] = await Promise.all([
    resolveApproximateLocation({ edgeCountry: context.country, edgeCity: context.city, ip: context.ip ?? null, submittedCountry: '', submittedCity: '' }),
    apiKey ? demoSegment(apiKey, context.lang) : undefined,
  ]);
  const full = {
    name: lead.name,
    email: lead.email,
    company: lead.company,
    industry: lead.industry,
    teamSize: lead.team_size,
    phone: lead.phone || '',
    language: context.lang,
    country: location.country,
    city: location.city,
    source: RUFO_CHAT_SOURCE,
    page: context.page,
    summary: lead.summary,
  };
  const parts = lead.name.split(/\s+/);
  const payload = {
    email: lead.email,
    first_name: parts[0] || lead.name,
    last_name: parts.slice(1).join(' '),
    custom_fields: buildFlodeskCustomFields(full),
  };
  let flodesk = await upsertFlodeskSubscriber({ apiKey, payload: segment ? { ...payload, segment_ids: [segment] } : payload });
  if (!flodesk.ok && flodesk.status === 400 && segment) {
    flodesk = await upsertFlodeskSubscriber({ apiKey, payload, maxAttempts: 1 });
  }
  const email = await sendDemoNotification({
    resendApiKey: process.env.RESEND_API_KEY,
    from: process.env.DEMO_NOTIFICATION_FROM,
    lead: full,
    flodeskOk: flodesk.ok,
    requestId: context.requestId,
  });
  console.log(JSON.stringify({ event: 'rufo_lead', requestId: context.requestId, flodesk: flodesk.ok, email: email.ok }));
  // The team email is what matters; Flodesk alone still keeps the contact.
  return { ok: Boolean(email.ok || flodesk.ok) };
}
