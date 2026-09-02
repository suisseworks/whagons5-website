import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEMO_NOTIFICATION_RECIPIENTS,
  DEMO_SEGMENT_NAMES,
  FLODESK_SEGMENTS_URL,
  FLODESK_SUBSCRIBERS_URL,
  RESEND_EMAILS_URL,
  buildFlodeskCustomFields,
  findFlodeskSegmentId,
  resolveLeadDeliveryOutcome,
  sendDemoNotification,
  upsertFlodeskSubscriber,
} from '../app/lib/demo-delivery.mjs';

const lead = {
  name: 'Matthias',
  email: 'mm@whagons.com',
  company: 'Malek',
  industry: 'Hospitality',
  country: 'CR',
  language: 'en',
  phone: '',
  teamSize: '1 to 10 people',
};

test('uses distinct exact demo segments for English and Spanish', () => {
  assert.deepEqual(DEMO_SEGMENT_NAMES, {
    en: 'Whagons-Demo-EN',
    es: 'Whagons-Demo-ES',
  });
});

test('maps website lead data to the exact Flodesk custom field keys', () => {
  assert.deepEqual(
    buildFlodeskCustomFields({
      company: 'Hotel 5',
      industry: 'Hospitality',
      country: 'MX',
      phone: '+506 7071-7099',
    }),
    {
      empresa: 'Hotel 5',
      sector: 'Hospitality',
      pais: 'MX',
      telFono: '+506 7071-7099',
    }
  );

  assert.deepEqual(
    buildFlodeskCustomFields({
      company: 'Hotel 5',
      industry: 'Hospitality',
      country: 'MX',
      phone: '',
    }),
    {
      empresa: 'Hotel 5',
      sector: 'Hospitality',
      pais: 'MX',
    }
  );
});

test('retries a transient Flodesk 502 and always uses the official endpoint', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return calls.length === 1
      ? new Response('temporary', { status: 502 })
      : Response.json({ id: 'subscriber-id', email: lead.email });
  };

  const result = await upsertFlodeskSubscriber({
    apiKey: 'flodesk-test-key',
    payload: { email: lead.email },
    apiUrl: 'https://whagons.com/api/flodesk',
    fetchImpl,
    retryDelayMs: 0,
  });

  assert.equal(result.ok, true);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls.map((call) => call.url), [
    FLODESK_SUBSCRIBERS_URL,
    FLODESK_SUBSCRIBERS_URL,
  ]);
  assert.match(calls[0].init.headers.Authorization, /^Basic /);
});

test('times out and returns a controlled Flodesk error instead of hanging', async () => {
  let calls = 0;
  const fetchImpl = async (_url, init) => {
    calls += 1;
    return new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        reject(error);
      });
    });
  };

  const result = await upsertFlodeskSubscriber({
    apiKey: 'flodesk-test-key',
    payload: { email: lead.email },
    fetchImpl,
    timeoutMs: 5,
    retryDelayMs: 0,
  });

  assert.equal(result.ok, false);
  assert.equal(result.code, 'FLODESK_UNAVAILABLE');
  assert.equal(calls, 2);
});

test('resolves a segment through the fixed Flodesk endpoint', async () => {
  let requestedUrl;
  const result = await findFlodeskSegmentId({
    apiKey: 'flodesk-test-key',
    segmentName: DEMO_SEGMENT_NAMES.en,
    fetchImpl: async (url) => {
      requestedUrl = url;
      return Response.json({
        data: [{ id: 'segment-id', name: DEMO_SEGMENT_NAMES.en }],
        meta: { total_pages: 1 },
      });
    },
  });

  assert.deepEqual(result, { ok: true, id: 'segment-id' });
  assert.equal(requestedUrl, `${FLODESK_SEGMENTS_URL}?page=1&per_page=50`);
});

test('never includes Flodesk subscriber data in its result', async () => {
  const result = await upsertFlodeskSubscriber({
    apiKey: 'flodesk-test-key',
    payload: { email: lead.email },
    fetchImpl: async () =>
      Response.json({ id: 'private-subscriber-id', email: lead.email, secret: 'upstream-data' }),
  });

  assert.equal(result.ok, true);
  assert.equal(JSON.stringify(result).includes(lead.email), false);
  assert.equal(JSON.stringify(result).includes('private-subscriber-id'), false);
  assert.equal(JSON.stringify(result).includes('upstream-data'), false);
});

test('sends one notification to both fixed internal recipients', async () => {
  let request;
  const fetchImpl = async (url, init) => {
    request = { url, init };
    return Response.json({ id: 'email-id' });
  };

  const result = await sendDemoNotification({
    resendApiKey: 'resend-test-key',
    from: 'Whagons Website <website@notify.whagons.com>',
    lead,
    flodeskOk: true,
    requestId: 'request-123',
    fetchImpl,
    retryDelayMs: 0,
  });

  assert.equal(result.ok, true);
  assert.equal(request.url, RESEND_EMAILS_URL);
  const body = JSON.parse(request.init.body);
  assert.deepEqual(DEMO_NOTIFICATION_RECIPIENTS, [
    'hello@whagons.com',
    'business@whagons.com',
  ]);
  assert.deepEqual(body.to, DEMO_NOTIFICATION_RECIPIENTS);
  assert.equal(body.reply_to, lead.email);
  assert.match(body.text, /Malek/);
  assert.match(body.text, /Hospitality/);
  assert.match(body.text, /1 to 10 people/);
  assert.equal(request.init.headers['Idempotency-Key'], 'demo-request/request-123');
});

test('user fields cannot change recipients, sender, or inject email headers', async () => {
  let request;
  await sendDemoNotification({
    resendApiKey: 'resend-test-key',
    from: 'Whagons Website <website@notify.whagons.com>',
    lead: {
      ...lead,
      company: 'Malek\r\nBcc: attacker@example.com',
      to: ['attacker@example.com'],
      from: 'attacker@example.com',
    },
    flodeskOk: true,
    requestId: 'request-headers',
    fetchImpl: async (url, init) => {
      request = { url, init };
      return Response.json({ id: 'email-id' });
    },
  });

  const body = JSON.parse(request.init.body);
  assert.deepEqual(body.to, DEMO_NOTIFICATION_RECIPIENTS);
  assert.equal(body.from, 'Whagons Website <website@notify.whagons.com>');
  assert.equal(body.subject.includes('\r'), false);
  assert.equal(body.subject.includes('\n'), false);
  assert.equal(JSON.stringify(body).includes('"to":["attacker@example.com"]'), false);
});

test('retries transient email errors with the same idempotency key', async () => {
  const keys = [];
  const fetchImpl = async (_url, init) => {
    keys.push(init.headers['Idempotency-Key']);
    return keys.length === 1
      ? new Response('rate limited', { status: 429 })
      : Response.json({ id: 'email-id' });
  };

  const result = await sendDemoNotification({
    resendApiKey: 'resend-test-key',
    from: 'Whagons Website <website@notify.whagons.com>',
    lead,
    flodeskOk: false,
    requestId: 'request-456',
    fetchImpl,
    retryDelayMs: 0,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(keys, ['demo-request/request-456', 'demo-request/request-456']);
});

test('does not call the email provider when notification is not configured', async () => {
  let called = false;
  const result = await sendDemoNotification({
    resendApiKey: '',
    from: '',
    lead,
    flodeskOk: true,
    requestId: 'request-789',
    fetchImpl: async () => {
      called = true;
      return Response.json({});
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.configured, false);
  assert.equal(result.code, 'EMAIL_NOT_CONFIGURED');
  assert.equal(called, false);
});

test('delivery matrix succeeds through either demo channel and fails only when both fail', () => {
  assert.deepEqual(
    resolveLeadDeliveryOutcome({
      formType: 'demo',
      flodeskResult: { ok: true, configured: true },
      emailResult: { ok: false, configured: true },
    }),
    { success: true, status: 200 }
  );
  assert.deepEqual(
    resolveLeadDeliveryOutcome({
      formType: 'demo',
      flodeskResult: { ok: false, configured: true },
      emailResult: { ok: true, configured: true },
    }),
    { success: true, status: 200 }
  );
  assert.deepEqual(
    resolveLeadDeliveryOutcome({
      formType: 'demo',
      flodeskResult: { ok: false, configured: true },
      emailResult: { ok: false, configured: true },
    }),
    { success: false, status: 502 }
  );
  assert.deepEqual(
    resolveLeadDeliveryOutcome({
      formType: 'demo',
      flodeskResult: { ok: false, configured: false },
      emailResult: { ok: false, configured: false },
    }),
    { success: false, status: 503 }
  );
  assert.deepEqual(
    resolveLeadDeliveryOutcome({
      formType: 'brief',
      flodeskResult: { ok: false, configured: true },
      emailResult: { ok: true, configured: true },
    }),
    { success: false, status: 502 }
  );
});
