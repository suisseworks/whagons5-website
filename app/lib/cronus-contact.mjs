import { RESEND_EMAILS_URL, fetchWithRetry } from './demo-delivery.mjs';

// The contact form on the Cronus client site (/clients/cronus2) delivers
// straight to Cronus's inbox. Recipients are fixed here and can't be changed
// by form input. An optional backup copy goes to CRONUS_CONTACT_BACKUP_TO.
export const CRONUS_CONTACT_RECIPIENTS = Object.freeze(['info@cronustec.com']);
export const CRONUS_PHONE = '713.787.9444';
export const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
export const CRONUS_WORK_LINES = Object.freeze([
  'Embedded Project Specialists',
  'In-house Projects',
  'Integrity Management',
  'On-site Inspectors',
  'Not sure yet',
]);

const APP_USER_AGENT = 'Whagons Website (whagons.com)';
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = Object.freeze({ name: 120, company: 160, email: 200, phone: 40, message: 5000 });

export function oneLine(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

export function escapeHtml(value) {
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

// Comma-separated addresses from an environment variable; anything that
// isn't an email address is ignored.
export function addressList(value) {
  return String(value || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter((v) => EMAIL_REGEX.test(v) && v.length <= 200)
    .slice(0, 5);
}

export async function sendResendEmail({
  resendApiKey,
  from,
  message,
  idempotencyKey,
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
  const outcome = await fetchWithRetry({
    fetchImpl,
    url: RESEND_EMAILS_URL,
    init: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        'User-Agent': APP_USER_AGENT,
      },
      body: JSON.stringify({ from: cleanFrom, ...message }),
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

export async function sendCronusContact({ resendApiKey, from, inquiry, requestId, bcc = /** @type {string[]} */ ([]), ...options }) {
  const content = buildCronusContactEmail(inquiry, requestId);
  return sendResendEmail({
    resendApiKey,
    from,
    idempotencyKey: `cronus-contact/${requestId}`,
    message: {
      to: [...CRONUS_CONTACT_RECIPIENTS],
      ...(bcc.length ? { bcc } : {}),
      subject: content.subject,
      text: content.text,
      html: content.html,
      reply_to: inquiry.email,
    },
    ...options,
  });
}

// The confirmation to the visitor is fixed text. It repeats nothing they
// typed, so the form can't be used to send someone else a message.
export function buildCronusConfirmationEmail(kind) {
  const application = kind === 'application';
  const subject = application ? 'We’ve received your application – Cronus' : 'We’ve received your message – Cronus';
  const body = application
    ? ['Thank you for applying to Cronus.', 'Your application and résumé have reached our hiring team. We review every application, and we’ll contact you if there’s a role that fits.']
    : ['Thank you for contacting Cronus.', `Your message has reached our team, and an engineer will get back to you soon. If it’s urgent, call us on ${CRONUS_PHONE}.`];
  const footer = 'Cronus Technology, LLC · 333 Cypress Run, Suite 300, Houston, TX 77094 · cronustec.com';
  const notice = 'You’re receiving this because this address was entered in a form on the Cronus website. If that wasn’t you, you can ignore this email.';
  const text = [...body, notice, footer].join('\n\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#2d2926">
${body.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')}
<p style="color:#56606b;font-size:13px">${escapeHtml(notice)}</p>
<p style="color:#56606b;font-size:13px">${escapeHtml(footer)}</p>
</div>`;
  return { subject, text, html };
}

export async function sendCronusConfirmation({ resendApiKey, from, to, kind = 'contact', replyTo, requestId, ...options }) {
  const content = buildCronusConfirmationEmail(kind);
  return sendResendEmail({
    resendApiKey,
    from,
    idempotencyKey: `cronus-${kind}-confirmation/${requestId}`,
    message: { to: [to], subject: content.subject, text: content.text, html: content.html, reply_to: replyTo },
    maxAttempts: 1,
    ...options,
  });
}

// Cloudflare Turnstile. When no secret is configured the check is skipped, so
// the form keeps working before the widget exists.
export async function verifyTurnstile({ secret, token, ip, action, fetchImpl = fetch, timeoutMs = 5000 }) {
  const cleanSecret = typeof secret === 'string' ? secret.trim() : '';
  if (!cleanSecret) return { ok: true, configured: false };
  if (typeof token !== 'string' || !token || token.length > 2048) return { ok: false, configured: true };
  try {
    const body = new URLSearchParams({ secret: cleanSecret, response: token });
    if (ip) body.set('remoteip', ip);
    const res = await fetchImpl(TURNSTILE_VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(timeoutMs) });
    const data = await res.json();
    return { ok: data.success === true && (!action || !data.action || data.action === action), configured: true };
  } catch {
    // If Cloudflare can't be reached, don't lose the message; the honeypot and
    // rate limit still apply.
    return { ok: true, configured: true, unverified: true };
  }
}
