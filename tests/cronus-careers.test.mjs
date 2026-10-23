import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CRONUS_CAREERS_RECIPIENTS,
  MAX_RESUME_BYTES,
  detectResumeType,
  resumeFilename,
  sendCronusApplication,
  validateCronusApplication,
} from '../app/lib/cronus-careers.mjs';

const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x25]);
const docx = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00, 0x08, 0x00]);
const doc = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00, 0x00]);
const exe = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00]);

const fields = {
  name: ' Sam Analyst ',
  email: 'Sam@Example.com',
  phone: '',
  discipline: 'Advanced analysis, including ML and AI',
  linkedin: 'https://www.linkedin.com/in/sam',
  message: 'FEA and VIV.\r\nAvailable in January.',
  website: '',
};

test('accepts a complete application with a PDF résumé', () => {
  const result = validateCronusApplication(fields, { name: 'Sam CV (2026).pdf', bytes: pdf });
  assert.equal(result.ok, true);
  assert.equal(result.application.name, 'Sam Analyst');
  assert.equal(result.application.email, 'sam@example.com');
  assert.equal(result.application.message, 'FEA and VIV.\nAvailable in January.');
  assert.equal(result.resume.type, 'pdf');
  assert.equal(result.resume.filename, 'Sam CV 2026.pdf');
});

test('identifies résumés by their contents, and the name must agree', () => {
  assert.equal(detectResumeType(pdf, 'cv.PDF'), 'pdf');
  assert.equal(detectResumeType(docx, 'cv.docx'), 'docx');
  assert.equal(detectResumeType(doc, 'cv.doc'), 'doc');
  assert.equal(detectResumeType(pdf, 'cv.docx'), null);
  assert.equal(detectResumeType(exe, 'cv.pdf'), null);
  assert.equal(detectResumeType(new Uint8Array(3), 'cv.pdf'), null);
  assert.equal(resumeFilename('../../etc/passwd.pdf', 'pdf'), 'etcpasswd.pdf');
  assert.equal(resumeFilename('', 'docx'), 'resume.docx');
});

test('rejects bad files, bad fields and bots', () => {
  assert.deepEqual(validateCronusApplication(fields, { name: 'cv.pdf', bytes: exe }), { ok: false, code: 'FILE_TYPE' });
  const big = new Uint8Array(MAX_RESUME_BYTES + 1);
  big.set(pdf);
  assert.deepEqual(validateCronusApplication(fields, { name: 'cv.pdf', bytes: big }), { ok: false, code: 'FILE_SIZE' });
  assert.deepEqual(validateCronusApplication(fields, null), { ok: false, code: 'INVALID' });
  for (const patch of [{ name: '' }, { email: 'nope' }, { discipline: 'Astronaut' }, { linkedin: 'javascript:alert(1)' }, { message: 'x'.repeat(5001) }]) {
    assert.deepEqual(validateCronusApplication({ ...fields, ...patch }, { name: 'cv.pdf', bytes: pdf }), { ok: false, code: 'INVALID' });
  }
  assert.deepEqual(validateCronusApplication({ ...fields, website: 'x' }, { name: 'cv.pdf', bytes: pdf }), { ok: false, code: 'SPAM' });
});

test('sends the application to the hiring inbox with the résumé attached', async () => {
  const calls = [];
  const { application, resume } = validateCronusApplication(fields, { name: 'cv.pdf', bytes: pdf });
  const result = await sendCronusApplication({
    resendApiKey: 're_test',
    from: 'Cronus Website <website@notify.whagons.com>',
    application,
    resume,
    requestId: 'app-1',
    bcc: ['hr-backup@cronustec.com'],
    fetchImpl: async (url, init) => { calls.push(init); return new Response('{}', { status: 200 }); },
  });
  assert.equal(result.ok, true);
  const payload = JSON.parse(calls[0].body);
  assert.deepEqual(payload.to, [...CRONUS_CAREERS_RECIPIENTS]);
  assert.deepEqual(CRONUS_CAREERS_RECIPIENTS, ['careers@cronustec.com']);
  assert.deepEqual(payload.bcc, ['hr-backup@cronustec.com']);
  assert.equal(payload.reply_to, 'sam@example.com');
  assert.equal(payload.attachments[0].filename, 'cv.pdf');
  assert.equal(Buffer.from(payload.attachments[0].content, 'base64').toString('latin1').slice(0, 5), '%PDF-');
  assert.match(payload.subject, /^Job application: Sam Analyst \(Advanced analysis/);
  assert.equal(calls[0].headers['Idempotency-Key'], 'cronus-application/app-1');
});
