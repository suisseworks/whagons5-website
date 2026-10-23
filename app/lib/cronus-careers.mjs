import { EMAIL_REGEX, escapeHtml, oneLine, sendResendEmail } from './cronus-contact.mjs';

// Job applications from the careers page of the Cronus client site
// (/clients/cronus2/careers). They go to Cronus's hiring inbox with the résumé
// attached. An optional backup copy goes to CRONUS_CAREERS_BACKUP_TO.
export const CRONUS_CAREERS_RECIPIENTS = Object.freeze(['careers@cronustec.com']);
export const CRONUS_DISCIPLINES = Object.freeze([
  'Pipeline engineering',
  'Advanced analysis, including ML and AI',
  'Design and drafting',
  'Project management',
  'Project controls',
  'Inspection',
  'Internship',
  'Other',
]);
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const LIMITS = Object.freeze({ name: 120, email: 200, phone: 40, linkedin: 300, message: 5000 });
const TYPES = Object.freeze({
  pdf: { ext: ['pdf'], mime: 'application/pdf' },
  docx: { ext: ['docx'], mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  doc: { ext: ['doc'], mime: 'application/msword' },
});

const startsWith = (bytes, signature) => signature.every((b, i) => bytes[i] === b);

// The file's contents decide its type, and the name must agree with it.
export function detectResumeType(bytes, filename) {
  if (!bytes || bytes.length < 8) return null;
  let type = null;
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) type = 'pdf'; // %PDF-
  else if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04])) type = 'docx'; // ZIP container
  else if (startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) type = 'doc'; // OLE container
  const ext = String(filename || '').toLowerCase().split('.').pop();
  return type && TYPES[type].ext.includes(ext) ? type : null;
}

export function resumeFilename(name, type) {
  const base = String(name || 'resume')
    .replace(/\.[^.]*$/, '')
    .normalize('NFKD')
    .replace(/[^\w\- ]+/g, '')
    .trim()
    .slice(0, 80) || 'resume';
  return `${base}.${type}`;
}

// fields: the form's text fields. file: { name, bytes } or null.
// Returns { ok: true, application, resume } or { ok: false, code } where code
// is 'SPAM', 'INVALID', 'FILE_TYPE' or 'FILE_SIZE'.
export function validateCronusApplication(fields, file) {
  if (!fields || typeof fields !== 'object') return { ok: false, code: 'INVALID' };
  if (oneLine(fields.website)) return { ok: false, code: 'SPAM' };
  const application = {
    name: oneLine(fields.name),
    email: oneLine(fields.email).toLowerCase(),
    phone: oneLine(fields.phone),
    discipline: oneLine(fields.discipline),
    linkedin: oneLine(fields.linkedin),
    message: typeof fields.message === 'string' ? fields.message.replace(/\r\n?/g, '\n').trim() : '',
  };
  if (!application.name || !EMAIL_REGEX.test(application.email) || !CRONUS_DISCIPLINES.includes(application.discipline)) {
    return { ok: false, code: 'INVALID' };
  }
  if (application.linkedin && !/^https?:\/\/[^\s]+$/i.test(application.linkedin)) return { ok: false, code: 'INVALID' };
  for (const [field, max] of Object.entries(LIMITS)) {
    if (application[field].length > max) return { ok: false, code: 'INVALID' };
  }
  if (!file || !file.bytes || !file.bytes.length) return { ok: false, code: 'INVALID' };
  if (file.bytes.length > MAX_RESUME_BYTES) return { ok: false, code: 'FILE_SIZE' };
  const type = detectResumeType(file.bytes, file.name);
  if (!type) return { ok: false, code: 'FILE_TYPE' };
  return { ok: true, application, resume: { filename: resumeFilename(file.name, type), type, bytes: file.bytes } };
}

export function buildCronusApplicationEmail(application, resume, requestId) {
  const subject = `Job application: ${application.name} (${application.discipline})`.slice(0, 160);
  const rows = [
    ['Name', application.name],
    ['Email', application.email],
    ['Phone', application.phone || '-'],
    ['Discipline', application.discipline],
    ['LinkedIn', application.linkedin || '-'],
    ['Résumé', `${resume.filename} (attached)`],
  ];
  const text = [
    'New application from the careers page of the Cronus website.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    application.message || '(No note)',
    '',
    `Reply to this email to answer ${application.name} directly.`,
    `Request ID: ${requestId}`,
  ].join('\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#2d2926">
<p>New application from the careers page of the Cronus website.</p>
<table style="border-collapse:collapse;margin:0 0 16px">${rows
    .map(([label, value]) => `<tr><td style="padding:4px 16px 4px 0;color:#56606b;vertical-align:top">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`)
    .join('')}</table>
<p style="white-space:pre-wrap;margin:0 0 16px;padding:12px 16px;background:#f3f5f7;border-left:3px solid #0077c8">${escapeHtml(application.message || '(No note)')}</p>
<p style="color:#56606b;font-size:13px">Reply to this email to answer ${escapeHtml(application.name)} directly. Request ID: ${escapeHtml(requestId)}</p>
</div>`;
  return { subject, text, html };
}

export async function sendCronusApplication({ resendApiKey, from, application, resume, requestId, bcc = /** @type {string[]} */ ([]), ...options }) {
  const content = buildCronusApplicationEmail(application, resume, requestId);
  return sendResendEmail({
    resendApiKey,
    from,
    idempotencyKey: `cronus-application/${requestId}`,
    message: {
      to: [...CRONUS_CAREERS_RECIPIENTS],
      ...(bcc.length ? { bcc } : {}),
      subject: content.subject,
      text: content.text,
      html: content.html,
      reply_to: application.email,
      attachments: [{ filename: resume.filename, content: Buffer.from(resume.bytes).toString('base64') }],
    },
    timeoutMs: 15000,
    ...options,
  });
}
