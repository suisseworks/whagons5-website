import { NextRequest } from 'next/server';

import {
  addressList,
  cronusSenderAddress,
  sendCronusConfirmation,
  sendCronusContact,
  validateCronusContact,
  verifyTurnstile,
} from '../../lib/cronus-contact.mjs';
import { clientAddress, createRateLimiter, noStoreJson, originAllowed, readBody, requestId } from '../../lib/cronus-request';

// Contact form for the Cronus client site (/clients/cronus2). Messages go to
// info@cronustec.com through the site's Resend account; see DEMO_REQUEST_SETUP.md.
// Only POST is answered; anything else gets 405 from Next.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const limiter = createRateLimiter(10 * 60 * 1000, 5);

export async function POST(request: NextRequest) {
  const id = requestId(request);
  if (!originAllowed(request.headers.get('origin'))) return noStoreJson({ error: 'FORBIDDEN' }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return noStoreJson({ error: 'INVALID' }, 400);

  const raw = await readBody(request, MAX_BODY_BYTES);
  if (!raw) return noStoreJson({ error: 'TOO_LARGE' }, 413);
  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return noStoreJson({ error: 'INVALID' }, 400);
  }

  const result = validateCronusContact(body);
  // Quietly accept bot submissions so the honeypot can't be used to probe validation.
  if (!result.ok || !result.inquiry) return result.code === 'SPAM' ? noStoreJson({ ok: true }) : noStoreJson({ error: 'INVALID' }, 400);
  const inquiry = result.inquiry;

  if (limiter.limited(request)) {
    return noStoreJson({ error: 'RATE_LIMITED' }, 429, { 'Retry-After': String(limiter.windowSeconds) });
  }

  const human = await verifyTurnstile({
    secret: process.env.CRONUS_TURNSTILE_SECRET,
    token: (body as { turnstile?: unknown }).turnstile,
    ip: clientAddress(request),
    action: 'contact',
  });
  if (!human.ok) return noStoreJson({ error: 'CHALLENGE_FAILED' }, 403);

  const started = Date.now();
  const from = cronusSenderAddress(process.env);
  const sent = await sendCronusContact({
    resendApiKey: process.env.RESEND_API_KEY,
    from,
    inquiry,
    requestId: id,
    bcc: addressList(process.env.CRONUS_CONTACT_BACKUP_TO),
  });
  // The visitor's confirmation is best effort: their message already arrived.
  const confirmed = sent.ok
    ? await sendCronusConfirmation({ resendApiKey: process.env.RESEND_API_KEY, from, to: inquiry.email, replyTo: 'info@cronustec.com', requestId: id })
    : null;
  console.info(
    JSON.stringify({
      event: 'cronus_contact',
      requestId: id,
      ok: sent.ok,
      code: sent.code,
      status: sent.status,
      attempts: sent.attempts,
      confirmation: confirmed ? confirmed.ok : undefined,
      turnstile: human.configured ? (human.unverified ? 'unverified' : 'passed') : 'off',
      elapsedMs: Date.now() - started,
    })
  );

  if (sent.ok) return noStoreJson({ ok: true, requestId: id });
  return noStoreJson({ error: sent.configured ? 'UNAVAILABLE' : 'NOT_CONFIGURED', requestId: id }, 503);
}
