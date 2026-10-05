import test from 'node:test';
import assert from 'node:assert/strict';
import { buildScoreNotification, completeScoreRequest, scoreNotificationAvailable } from '../app/lib/hotel-score-notification.mjs';
import { questions } from '../app/lib/hotel-score.mjs';

const data = { email: ' Person@Example.com ', language: 'en', answers: [0,1,2,3,0,1,2,3,'unknown','na'], requestId: '12345678-1234-4123-8123-123456789012', marketingOptIn: false };
const fieldMapping = Object.fromEntries(['score','language','answers','requestedAt','marketing','delivery', ...[1,2,3].flatMap(i => [`priority${i}`,`priority${i}Features`,`priority${i}Review`])].map(key => [key,key]));
function setup({ statuses = [200], rejectFields = false, rejectCapture = false, offline = false } = {}) {
  const messages = []; let fields = {};
  const fetchImpl = async (url, init) => {
    if (url === 'https://api.resend.com/emails') {
      messages.push(init);
      if (offline) throw new Error('offline');
      return Response.json({}, { status: statuses[Math.min(messages.length - 1, statuses.length - 1)] });
    }
    assert(url.startsWith('https://api.flodesk.com/v1/subscribers'));
    if (rejectCapture) return Response.json({}, { status: 400 });
    if (init.method === 'POST') {
      const body = JSON.parse(init.body);
      if (body.custom_fields && rejectFields) return Response.json({}, { status: 400 });
      fields = {...fields, ...body.custom_fields};
    }
    return Response.json({segments: [{id: 'score'}], custom_fields: fields});
  };
  return { messages, options: { data, apiKey: 'test', segmentId: 'score', fieldMapping, resendApiKey: 'test', from: 'Whagons <website@example.com>', fetchImpl } };
}
for (const language of ['en','es']) test(`notification contains all ten full questions and selected answers in ${language}`, async () => {
  const u = setup();
  const result = await completeScoreRequest({...u.options, data: {...data, language}});
  assert.equal(result.ok, true);
  assert.equal(u.messages.length, 1);
  const message = JSON.parse(u.messages[0].body);
  assert.deepEqual(message.to, ['marketing@whagons.com']);
  assert.equal(message.reply_to, 'person@example.com');
  assert.match(message.text, /Score: 50\/100/);
  assert.match(message.text, /Optional marketing consent: No/);
  for (let i = 0; i < 10; i++) {
    assert(message.text.includes(`${i+1}. ${questions[language][i].question}`));
    if (i < 8) assert(message.text.includes(questions[language][i].answers[data.answers[i]]));
  }
  assert(message.text.includes(language === 'es' ? 'No lo sé' : 'Not sure'));
  assert(message.text.includes(language === 'es' ? 'No aplica' : 'Not applicable'));
  assert.equal((message.html.match(/<h2>/g) || []).length, 10);
});
test('all excluded answers have no fabricated score, and HTML is escaped', () => {
  const message = buildScoreNotification({...data, email: '<person>@example.com', answers: Array(10).fill('na')});
  assert.match(message.text, /Score: Not enough information/);
  assert.match(message.html, /&lt;person&gt;@example.com/);
  assert(!message.html.includes('<person>'));
});
test('transient failure retries the identical message and repeated submissions use the same key', async () => {
  const u = setup({statuses: [503,200]});
  assert.equal((await completeScoreRequest(u.options)).ok, true);
  assert.equal(u.messages.length, 2);
  assert.equal(u.messages[0].body, u.messages[1].body);
  await completeScoreRequest(u.options);
  assert.equal(u.messages[0].headers['Idempotency-Key'], u.messages[2].headers['Idempotency-Key']);
  await completeScoreRequest({...u.options, data: {...data, email: 'other@example.com'}});
  assert.notEqual(u.messages[0].headers['Idempotency-Key'], u.messages[3].headers['Idempotency-Key']);
});
test('permanent and exhausted email failures never report successful completion', async () => {
  for (const config of [{statuses:[400]}, {statuses:[503]}, {offline:true}]) {
    const u = setup(config);
    const result = await completeScoreRequest(u.options);
    assert.equal(result.ok, false);
    assert.equal(result.status, 502);
    assert.equal(u.messages.length, config.statuses?.[0] === 400 ? 1 : 2);
  }
});
test('notification preserves all answers even if Flodesk analysis storage fails', async () => {
  const u = setup({rejectFields:true});
  const result = await completeScoreRequest(u.options);
  assert.equal(result.ok, true);
  assert.equal(result.analysisSaved, false);
  assert.equal(u.messages.length, 1);
  assert(JSON.parse(u.messages[0].body).text.includes(questions.en[9].question));
});
test('invalid submissions and failed lead capture never send email', async () => {
  for (const invalid of [{...data,answers:[]}, {...data,language:'fr'}, {...data,website:'bot'}, {...data,email:'bad'}]) {
    const u = setup();
    assert.equal((await completeScoreRequest({...u.options,data:invalid})).status,400);
    assert.equal(u.messages.length,0);
  }
  const u = setup({rejectCapture:true});
  assert.equal((await completeScoreRequest(u.options)).status,502);
  assert.equal(u.messages.length,0);
});
test('missing email configuration is unavailable, not silent success', async () => {
  assert.equal(scoreNotificationAvailable({}),false);
  assert.equal(scoreNotificationAvailable({RESEND_API_KEY:'test',DEMO_NOTIFICATION_FROM:'sender@example.com'}),true);
  const u = setup();
  assert.equal((await completeScoreRequest({...u.options,resendApiKey:''})).status,503);
  assert.equal(u.messages.length,0);
});
