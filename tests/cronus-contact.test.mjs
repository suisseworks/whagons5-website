import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CRONUS_CONTACT_RECIPIENTS,
  buildCronusContactEmail,
  cronusSenderAddress,
  sendCronusContact,
  validateCronusContact,
} from '../app/lib/cronus-contact.mjs';
import { RESEND_EMAILS_URL } from '../app/lib/demo-delivery.mjs';

const valid = {
  name: '  Ana Engineer ',
  company: 'Gulf Midstream',
  email: 'Ana@Example.com',
  phone: '713 555 0100',
  line: 'In-house Projects',
  message: 'We need a free span assessment.\r\nRoute is 40 km.',
  website: '',
};

test('accepts a complete inquiry and normalizes it', () => {
  const result = validateCronusContact(valid);
  assert.equal(result.ok, true);
  assert.deepEqual(result.inquiry, {
    name: 'Ana Engineer',
    company: 'Gulf Midstream',
    email: 'ana@example.com',
    phone: '713 555 0100',
    line: 'In-house Projects',
    message: 'We need a free span assessment.\nRoute is 40 km.',
  });
});

test('rejects missing or malformed required fields', () => {
  for (const patch of [{ name: '' }, { email: 'not-an-email' }, { message: '   ' }, { message: 'x'.repeat(5001) }]) {
    assert.deepEqual(validateCronusContact({ ...valid, ...patch }), { ok: false, code: 'INVALID' });
  }
  assert.deepEqual(validateCronusContact(null), { ok: false, code: 'INVALID' });
  assert.deepEqual(validateCronusContact(['x']), { ok: false, code: 'INVALID' });
});

test('flags honeypot submissions and defaults unknown work lines', () => {
  assert.deepEqual(validateCronusContact({ ...valid, website: 'http://spam.example' }), { ok: false, code: 'SPAM' });
  assert.equal(validateCronusContact({ ...valid, line: 'Something else' }).inquiry.line, 'Not sure yet');
});

test('derives the sender from the shared notification address', () => {
  assert.equal(
    cronusSenderAddress({ DEMO_NOTIFICATION_FROM: 'Whagons Website <website@notify.whagons.com>' }),
    'Cronus Website <website@notify.whagons.com>'
  );
  assert.equal(cronusSenderAddress({ CRONUS_CONTACT_FROM: 'Cronus <web@example.com>', DEMO_NOTIFICATION_FROM: 'x <a@b.co>' }), 'Cronus <web@example.com>');
  assert.equal(cronusSenderAddress({}), '');
});

test('escapes visitor input in the HTML email', () => {
  const { inquiry } = validateCronusContact({ ...valid, name: '<b>Ana</b>', message: '<script>x</script>' });
  const email = buildCronusContactEmail(inquiry, 'req-1');
  assert.match(email.subject, /^Website inquiry from <b>Ana<\/b> \(Gulf Midstream\)$/);
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(email.text.includes('Request ID: req-1'));
});

test('sends one message to the fixed Cronus inbox with the visitor as reply-to', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return new Response('{"id":"x"}', { status: 200 });
  };
  const { inquiry } = validateCronusContact(valid);
  const result = await sendCronusContact({
    resendApiKey: 're_test',
    from: 'Cronus Website <website@notify.whagons.com>',
    inquiry,
    requestId: 'req-2',
    fetchImpl,
  });
  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, RESEND_EMAILS_URL);
  const payload = JSON.parse(calls[0].init.body);
  assert.deepEqual(payload.to, [...CRONUS_CONTACT_RECIPIENTS]);
  assert.deepEqual(CRONUS_CONTACT_RECIPIENTS, ['info@cronustec.com']);
  assert.equal(payload.reply_to, 'ana@example.com');
  assert.equal(calls[0].init.headers['Idempotency-Key'], 'cronus-contact/req-2');
});

test('reports missing configuration without calling the provider', async () => {
  let called = false;
  const result = await sendCronusContact({
    resendApiKey: '',
    from: '',
    inquiry: validateCronusContact(valid).inquiry,
    requestId: 'req-3',
    fetchImpl: async () => { called = true; return new Response(null, { status: 200 }); },
  });
  assert.deepEqual(result, { ok: false, configured: false, code: 'EMAIL_NOT_CONFIGURED', attempts: 0 });
  assert.equal(called, false);
});

test('retries a provider outage, then reports it', async () => {
  let attempts = 0;
  const result = await sendCronusContact({
    resendApiKey: 're_test',
    from: 'Cronus Website <website@notify.whagons.com>',
    inquiry: validateCronusContact(valid).inquiry,
    requestId: 'req-4',
    retryDelayMs: 1,
    fetchImpl: async () => { attempts += 1; return new Response('down', { status: 503 }); },
  });
  assert.equal(attempts, 2);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'EMAIL_REJECTED');
  assert.equal(result.status, 503);
});
