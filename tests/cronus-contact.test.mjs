import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CRONUS_CONTACT_RECIPIENTS,
  TURNSTILE_VERIFY_URL,
  addressList,
  buildCronusConfirmationEmail,
  buildCronusContactEmail,
  cronusSenderAddress,
  sendCronusConfirmation,
  sendCronusContact,
  validateCronusContact,
  verifyTurnstile,
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

test('sends a backup copy only to valid configured addresses', async () => {
  assert.deepEqual(addressList(' Backup@Cronustec.com, not-an-address ,,ops@example.com'), ['backup@cronustec.com', 'ops@example.com']);
  assert.deepEqual(addressList(undefined), []);
  const calls = [];
  await sendCronusContact({
    resendApiKey: 're_test',
    from: 'Cronus Website <website@notify.whagons.com>',
    inquiry: validateCronusContact(valid).inquiry,
    requestId: 'req-5',
    bcc: ['backup@cronustec.com'],
    fetchImpl: async (url, init) => { calls.push(JSON.parse(init.body)); return new Response('{}', { status: 200 }); },
  });
  assert.deepEqual(calls[0].bcc, ['backup@cronustec.com']);
  await sendCronusContact({
    resendApiKey: 're_test',
    from: 'Cronus Website <website@notify.whagons.com>',
    inquiry: validateCronusContact(valid).inquiry,
    requestId: 'req-6',
    fetchImpl: async (url, init) => { calls.push(JSON.parse(init.body)); return new Response('{}', { status: 200 }); },
  });
  assert.equal('bcc' in calls[1], false);
});

test('confirms to the visitor with fixed text that repeats nothing they typed', async () => {
  const calls = [];
  const result = await sendCronusConfirmation({
    resendApiKey: 're_test',
    from: 'Cronus Website <website@notify.whagons.com>',
    to: 'ana@example.com',
    replyTo: 'info@cronustec.com',
    requestId: 'req-7',
    fetchImpl: async (url, init) => { calls.push(init); return new Response('{}', { status: 200 }); },
  });
  assert.equal(result.ok, true);
  const payload = JSON.parse(calls[0].body);
  assert.deepEqual(payload.to, ['ana@example.com']);
  assert.equal(payload.reply_to, 'info@cronustec.com');
  assert.equal(calls[0].headers['Idempotency-Key'], 'cronus-contact-confirmation/req-7');
  for (const kind of ['contact', 'application']) {
    const email = buildCronusConfirmationEmail(kind);
    assert.ok(!/Ana|Gulf|free span/.test(email.text + email.html));
  }
  assert.match(buildCronusConfirmationEmail('application').subject, /application/);
});

test('checks Turnstile only when a secret is configured', async () => {
  const reply = (data) => async (url, init) => {
    assert.equal(url, TURNSTILE_VERIFY_URL);
    assert.equal(init.body.get('secret'), 'sk');
    return new Response(JSON.stringify(data), { status: 200 });
  };
  assert.deepEqual(await verifyTurnstile({ secret: '', token: '' }), { ok: true, configured: false });
  assert.equal((await verifyTurnstile({ secret: 'sk', token: '' })).ok, false);
  assert.equal((await verifyTurnstile({ secret: 'sk', token: 't', action: 'contact', fetchImpl: reply({ success: true, action: 'contact' }) })).ok, true);
  assert.equal((await verifyTurnstile({ secret: 'sk', token: 't', action: 'contact', fetchImpl: reply({ success: false }) })).ok, false);
  assert.equal((await verifyTurnstile({ secret: 'sk', token: 't', action: 'contact', fetchImpl: reply({ success: true, action: 'apply' }) })).ok, false);
  const down = await verifyTurnstile({ secret: 'sk', token: 't', fetchImpl: async () => { throw new Error('offline'); } });
  assert.deepEqual(down, { ok: true, configured: true, unverified: true });
});
