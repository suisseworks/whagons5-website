import { NextRequest } from 'next/server';

import { MAX_RESUME_BYTES, sendCronusApplication, validateCronusApplication } from '../../lib/cronus-careers.mjs';
import { addressList, cronusSenderAddress, sendCronusConfirmation, verifyTurnstile } from '../../lib/cronus-contact.mjs';
import { clientAddress, createRateLimiter, noStoreJson, originAllowed, readBody, requestId } from '../../lib/cronus-request';

// Job applications from the Cronus client site's careers page
// (/clients/cronus2/careers). Each one goes to careers@cronustec.com with the
// résumé attached; see DEMO_REQUEST_SETUP.md. Only POST is answered.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// The résumé plus the text fields and multipart overhead.
const MAX_BODY_BYTES = MAX_RESUME_BYTES + 64 * 1024;
const limiter = createRateLimiter(30 * 60 * 1000, 3);
const TEXT_FIELDS = ['name', 'email', 'phone', 'discipline', 'linkedin', 'message', 'website', 'turnstile'];

export async function POST(request: NextRequest) {
  const id = requestId(request);
  if (!originAllowed(request.headers.get('origin'))) return noStoreJson({ error: 'FORBIDDEN' }, 403);
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.startsWith('multipart/form-data')) return noStoreJson({ error: 'INVALID' }, 400);

  const raw = await readBody(request, MAX_BODY_BYTES);
  if (!raw) return noStoreJson({ error: 'TOO_LARGE' }, 413);
  let form: FormData;
  try {
    const body = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer;
    form = await new Response(body, { headers: { 'content-type': contentType } }).formData();
  } catch {
    return noStoreJson({ error: 'INVALID' }, 400);
  }
  const fields: Record<string, string> = {};
  for (const key of TEXT_FIELDS) {
    const value = form.get(key);
    fields[key] = typeof value === 'string' ? value : '';
  }
  const upload = form.get('resume');
  const file = upload && typeof upload !== 'string' ? { name: upload.name, bytes: new Uint8Array(await upload.arrayBuffer()) } : null;

  const result = validateCronusApplication(fields, file);
  if (!result.ok || !result.application || !result.resume) {
    if (result.code === 'SPAM') return noStoreJson({ ok: true });
    return noStoreJson({ error: result.code }, result.code === 'FILE_SIZE' ? 413 : 400);
  }
  const { application, resume } = result;

  if (limiter.limited(request)) {
    return noStoreJson({ error: 'RATE_LIMITED' }, 429, { 'Retry-After': String(limiter.windowSeconds) });
  }

  const human = await verifyTurnstile({
    secret: process.env.CRONUS_TURNSTILE_SECRET,
    token: fields.turnstile,
    ip: clientAddress(request),
    action: 'apply',
  });
  if (!human.ok) return noStoreJson({ error: 'CHALLENGE_FAILED' }, 403);

  const started = Date.now();
  const from = cronusSenderAddress(process.env);
  const sent = await sendCronusApplication({
    resendApiKey: process.env.RESEND_API_KEY,
    from,
    application,
    resume,
    requestId: id,
    bcc: addressList(process.env.CRONUS_CAREERS_BACKUP_TO),
  });
  const confirmed = sent.ok
    ? await sendCronusConfirmation({ resendApiKey: process.env.RESEND_API_KEY, from, to: application.email, kind: 'application', replyTo: 'careers@cronustec.com', requestId: id })
    : null;
  console.info(
    JSON.stringify({
      event: 'cronus_application',
      requestId: id,
      ok: sent.ok,
      code: sent.code,
      status: sent.status,
      attempts: sent.attempts,
      resumeType: resume.type,
      resumeBytes: resume.bytes.length,
      confirmation: confirmed ? confirmed.ok : undefined,
      turnstile: human.configured ? (human.unverified ? 'unverified' : 'passed') : 'off',
      elapsedMs: Date.now() - started,
    })
  );

  if (sent.ok) return noStoreJson({ ok: true, requestId: id });
  return noStoreJson({ error: sent.configured ? 'UNAVAILABLE' : 'NOT_CONFIGURED', requestId: id }, 503);
}
