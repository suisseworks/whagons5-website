import { RESEND_EMAILS_URL, fetchWithRetry } from './demo-delivery.mjs';

// The contact form on the Cronus client site (/clients/cronus2) delivers
// straight to Cronus's inbox. Recipients are fixed here and can't be changed
// by form input.
export const CRONUS_CONTACT_RECIPIENTS = Object.freeze(['info@cronustec.com']);
export const CRONUS_WORK_LINES = Object.freeze([
  'Embedded Project Specialists',
  'In-house Projects',
  'Integrity Management',
  'On-site Inspectors',
  'Not sure yet',
]);

const APP_USER_AGENT = 'Whagons Website (whagons.com)';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = Object.freeze({ name: 120, company: 160, email: 200, phone: 40, message: 5000 });

function oneLine(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Returns { ok: true, inquiry } or { ok: false, code }, where code is
// 'SPAM' (honeypot filled; answer as if it worked) or 'INVALID'.
export function validateCronusContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, code: 'INVALID' };
  if (oneLine(body.website)) return { ok: false, code: 'SPAM' };

  const inquiry = {
    name: oneLine(body.name),
    company: oneLine(body.company),
    email: oneLine(body.email).toLowerCase(),
    phone: oneLine(body.phone),
    line: CRONUS_WORK_LINES.includes(oneLine(body.line)) ? oneLine(body.line) : 'Not sure yet',
    message: typeof body.message === 'string' ? body.message.replace(/\r\n?/g, '\n').trim() : '',
  };
  if (!inquiry.name || !inquiry.message || !EMAIL_REGEX.test(inquiry.email)) return { ok: false, code: 'INVALID' };
  for (const [field, max] of Object.entries(LIMITS)) {
    if (inquiry[field].length > max) return { ok: false, code: 'INVALID' };
  }
  return { ok: true, inquiry };
}

// "Whagons Website <website@notify.whagons.com>" becomes
// "Cronus Website <website@notify.whagons.com>", unless CRONUS_CONTACT_FROM is set.
export function cronusSenderAddress(env = {}) {
  const explicit = typeof env.CRONUS_CONTACT_FROM === 'string' ? env.CRONUS_CONTACT_FROM.trim() : '';
  if (explicit) return explicit;
  const shared = typeof env.DEMO_NOTIFICATION_FROM === 'string' ? env.DEMO_NOTIFICATION_FROM.trim() : '';
  const address = shared.match(/<([^<>\s]+@[^<>\s]+)>/)?.[1] || (EMAIL_REGEX.test(shared) ? shared : '');
  return address ? `Cronus Website <${address}>` : '';
}

export function buildCronusContactEmail(inquiry, requestId) {
  const subject = `Website inquiry from ${inquiry.name}${inquiry.company ? ` (${inquiry.company})` : ''}`.slice(0, 160);
  const rows = [
    ['Name', inquiry.name],
    ['Company', inquiry.company || '-'],
    ['Email', inquiry.email],
    ['Phone', inquiry.phone || '-'],
    ['Working with us', inquiry.line],
  ];
  const text = [
    'New message from the contact form on the Cronus website.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    inquiry.message,
    '',
    `Reply to this email to answer ${inquiry.name} directly.`,
    `Request ID: ${requestId}`,
  ].join('\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#2d2926">
<p>New message from the contact form on the Cronus website.</p>
<table style="border-collapse:collapse;margin:0 0 16px">${rows
    .map(([label, value]) => `<tr><td style="padding:4px 16px 4px 0;color:#56606b;vertical-align:top">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`)
    .join('')}</table>
<p style="white-space:pre-wrap;margin:0 0 16px;padding:12px 16px;background:#f3f5f7;border-left:3px solid #0077c8">${escapeHtml(inquiry.message)}</p>
<p style="color:#56606b;font-size:13px">Reply to this email to answer ${escapeHtml(inquiry.name)} directly. Request ID: ${escapeHtml(requestId)}</p>
</div>`;
  return { subject, text, html };
}

export async function sendCronusContact({
  resendApiKey,
  from,
  inquiry,
  requestId,
  fetchImpl = fetch,
  timeoutMs = 6000,
  maxAttempts = 2,
  retryDelayMs = 150,
}) {
  const cleanApiKey = typeof resendApiKey === 'string' ? resendApiKey.trim() : '';
  const cleanFrom = typeof from === 'string' ? from.trim() : '';
  if (!cleanApiKey || !cleanFrom) {
    return { ok: false, configured: false, code: 'EMAIL_NOT_CONFIGURED', attempts: 0 };
  }

  const content = buildCronusContactEmail(inquiry, requestId);
  const outcome = await fetchWithRetry({
    fetchImpl,
    url: RESEND_EMAILS_URL,
    init: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `cronus-contact/${requestId}`,
        'User-Agent': APP_USER_AGENT,
      },
      body: JSON.stringify({
        from: cleanFrom,
        to: [...CRONUS_CONTACT_RECIPIENTS],
        subject: content.subject,
        text: content.text,
        html: content.html,
        reply_to: inquiry.email,
      }),
    },
    timeoutMs,
    maxAttempts,
    retryDelayMs,
  });

  if (outcome.error) return { ok: false, configured: true, code: 'EMAIL_UNAVAILABLE', attempts: outcome.attempts || maxAttempts };
  if (!outcome.response.ok) {
    return { ok: false, configured: true, code: 'EMAIL_REJECTED', status: outcome.response.status, attempts: outcome.attempts };
  }
  return { ok: true, configured: true, status: outcome.response.status, attempts: outcome.attempts };
}
