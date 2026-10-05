// Loaded only by the API integration test's child server. Never sends real email.
const { appendFileSync } = require('node:fs');
if (!process.env.SCORE_TEST_EMAIL_LOG) throw new Error('Missing test email log');
const originalFetch = globalThis.fetch;
const subscribers = new Map();
globalThis.fetch = async (url, init) => {
  const address = String(url);
  if (address.startsWith('https://api.flodesk.com/v1/subscribers')) {
    if (init.method === 'POST') {
      const body = JSON.parse(init.body);
      const prior = subscribers.get(body.email) || {};
      subscribers.set(body.email, {...prior, ...body, segments: [{id:'score'}]});
      return Response.json({id:'test'});
    }
    return Response.json(subscribers.get(decodeURIComponent(address.split('/').pop())) || {});
  }
  if (address === 'https://api.resend.com/emails') {
    const message = JSON.parse(init.body);
    appendFileSync(process.env.SCORE_TEST_EMAIL_LOG, JSON.stringify({message, key:init.headers['Idempotency-Key']}) + '\n');
    return Response.json({}, {status:message.reply_to === 'failure@example.com' ? 503 : 200});
  }
  if (address.startsWith('https://')) throw new Error('Unexpected external request in score API test');
  return originalFetch(url, init);
};
