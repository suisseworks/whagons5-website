import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GITHUB_API,
  checklistRepo,
  codeMatches,
  commentMarkdown,
  createChecklistStore,
  createCodeGate,
  issueTitle,
  itemFromTitle,
  toPageComment,
  validateChecklistComment,
} from '../app/lib/cronus-checklist.mjs';

test('the access code matches only the configured value', () => {
  assert.equal(codeMatches('pipeline-2026', 'pipeline-2026'), true);
  assert.equal(codeMatches('pipeline-2026', ' pipeline-2026 '), true);
  assert.equal(codeMatches('pipeline-2026', 'pipeline-2025'), false);
  assert.equal(codeMatches('', ''), false);
  assert.equal(codeMatches(undefined, 'anything'), false);
  assert.equal(codeMatches('pipeline-2026', null), false);
});

test('accepts a comment and normalizes it', () => {
  const result = validateChecklistComment({ item: 'ga-id', name: '  Diego   Zuniga ', body: 'Sent it.\r\nCheck your inbox.', website: '' });
  assert.deepEqual(result, { ok: true, comment: { item: 'ga-id', name: 'Diego Zuniga', body: 'Sent it.\nCheck your inbox.' } });
});

test('rejects bad items, empty or oversized fields, and flags the honeypot', () => {
  const valid = { item: 'ga-id', name: 'Tony', body: 'Done.' };
  for (const patch of [{ item: 'GA ID' }, { item: '../x' }, { item: '' }, { name: '' }, { body: '  ' }, { name: 'x'.repeat(81) }, { body: 'x'.repeat(4001) }]) {
    assert.deepEqual(validateChecklistComment({ ...valid, ...patch }), { ok: false, code: 'INVALID' }, JSON.stringify(patch));
  }
  assert.deepEqual(validateChecklistComment(null), { ok: false, code: 'INVALID' });
  assert.deepEqual(validateChecklistComment({ ...valid, website: 'http://spam.example' }), { ok: false, code: 'SPAM' });
});

test('a name cannot break out of the author marker', () => {
  const { comment } = validateChecklistComment({ item: 'ga-id', name: 'Eve --> <!-- x', body: 'hi' });
  assert.equal(comment.name.includes('-->'), false);
  assert.equal(toPageComment({ id: 1, body: commentMarkdown(comment), created_at: 't' }).author, comment.name);
});

test('issue titles round-trip to item ids', () => {
  assert.equal(itemFromTitle(issueTitle('turnstile-keys')), 'turnstile-keys');
  assert.equal(itemFromTitle('Something else'), null);
  assert.equal(itemFromTitle('Checklist: Bad Id'), null);
});

test('page comments keep their author and drop the GitHub signature', () => {
  const gh = { id: 7, body: commentMarkdown({ name: 'Michelle Doucette', body: 'Test message arrived.' }), user: { login: 'matas432' }, created_at: '2026-11-05T15:00:00Z' };
  assert.deepEqual(toPageComment(gh), { id: 7, author: 'Michelle Doucette', body: 'Test message arrived.', at: '2026-11-05T15:00:00Z' });
  assert.deepEqual(toPageComment({ id: 8, body: 'Reply from GitHub', user: { login: 'matas432' }, created_at: 'x' }),
    { id: 8, author: 'matas432', body: 'Reply from GitHub', at: 'x' });
});

test('the repo setting falls back to the default when malformed', () => {
  assert.equal(checklistRepo({}), 'matas432/cronus-website');
  assert.equal(checklistRepo({ CRONUS_CHECKLIST_REPO: 'acme/site' }), 'acme/site');
  assert.equal(checklistRepo({ CRONUS_CHECKLIST_REPO: 'https://evil.example/x' }), 'matas432/cronus-website');
});

test('the code gate blocks an address after too many wrong codes', () => {
  const gate = createCodeGate(1000, 3);
  for (let i = 0; i < 3; i += 1) gate.fail('1.2.3.4', 0);
  assert.equal(gate.blocked('1.2.3.4', 10), true);
  assert.equal(gate.blocked('5.6.7.8', 10), false);
  assert.equal(gate.blocked('1.2.3.4', 1001), false);
});

// A fake GitHub holding issues and comments in memory.
function fakeGitHub() {
  const issues = [{ number: 1, title: 'Checklist: ga-id', comments: 1 }, { number: 2, title: 'Unrelated', comments: 4 }];
  const comments = { 1: [{ id: 10, body: 'Earlier note', user: { login: 'matas432' }, created_at: '2026-11-01T00:00:00Z' }] };
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    const path = url.replace(GITHUB_API, '');
    calls.push(`${init.method || 'GET'} ${path.split('?')[0]}`);
    assert.equal(init.headers.Authorization, 'Bearer t0ken');
    const json = (body, status = 200) => ({ ok: status < 300, status, json: async () => body });
    if (path.startsWith('/repos/acme/site/issues?')) return json(issues);
    let m = path.match(/^\/repos\/acme\/site\/issues\/(\d+)\/comments/);
    if (m && !init.method) return json(comments[m[1]] || []);
    if (m && init.method === 'POST') {
      const c = { id: 100 + calls.length, body: JSON.parse(init.body).body, user: { login: 'matas432' }, created_at: '2026-11-05T12:00:00Z' };
      (comments[m[1]] ||= []).push(c);
      return json(c, 201);
    }
    if (path === '/repos/acme/site/issues' && init.method === 'POST') {
      const body = JSON.parse(init.body);
      assert.deepEqual(body.labels, ['checklist']);
      const issue = { number: issues.length + 1, title: body.title, comments: 0 };
      issues.push(issue);
      return json(issue, 201);
    }
    return json({ message: 'Not Found' }, 404);
  };
  return { fetchImpl, calls, issues };
}

test('lists comments per item, fetching only issues that have comments', async () => {
  const gh = fakeGitHub();
  const store = createChecklistStore({ token: 't0ken', repo: 'acme/site', fetchImpl: gh.fetchImpl });
  const { items } = await store.list();
  assert.deepEqual(Object.keys(items), ['ga-id']);
  assert.equal(items['ga-id'][0].body, 'Earlier note');
  assert.deepEqual(gh.calls, ['GET /repos/acme/site/issues', 'GET /repos/acme/site/issues/1/comments']);
  await store.list();
  assert.equal(gh.calls.length, 2, 'the second list is served from the cache');
});

test('adds a comment, creating the item issue once', async () => {
  const gh = fakeGitHub();
  const store = createChecklistStore({ token: 't0ken', repo: 'acme/site', fetchImpl: gh.fetchImpl });
  const [a, b] = await Promise.all([
    store.add({ item: 'turnstile-keys', name: 'Tony Jean', body: 'Keys sent.' }),
    store.add({ item: 'turnstile-keys', name: 'Diego Zuniga', body: 'Thanks Tony.' }),
  ]);
  assert.equal(a.author, 'Tony Jean');
  assert.equal(b.body, 'Thanks Tony.');
  assert.equal(gh.calls.filter((c) => c === 'POST /repos/acme/site/issues').length, 1);
  const { items } = await store.list();
  assert.equal(items['turnstile-keys'].length, 2);
});

test('GitHub errors surface with their status', async () => {
  const store = createChecklistStore({ token: 't0ken', repo: 'acme/site', fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({}) }) });
  await assert.rejects(store.list(), (e) => e.status === 401);
});
