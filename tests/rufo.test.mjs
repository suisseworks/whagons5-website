import test from 'node:test';
import assert from 'node:assert/strict';

import { pageText } from '../app/lib/rufo/knowledge.ts';
import { parseLead } from '../app/lib/rufo/lead.ts';

test('reads only the main content of a page, without decorative demos', () => {
  const html = `<html><head><title>Whagons — Hotels</title></head><body>
    <nav>Menu Platform Blog</nav>
    <div id="page-content" tabindex="-1">
      <h1>Every handoff &amp; task</h1>
      <p>Owners and due times.</p>
      <div aria-hidden="true"><div><p>Example task #2041</p></div></div>
      <select><option>Mexico</option></select>
      <ul><li>Evidence on close</li><li>Escalation</li></ul>
      <script>window.x = 1</script>
    </div>
    <footer>Footer links</footer></body></html>`;
  const { title, text } = pageText(html);
  assert.equal(title, 'Whagons — Hotels');
  assert.match(text, /^## Every handoff & task$/m);
  assert.match(text, /^Owners and due times\.$/m);
  assert.match(text, /^- Evidence on close$/m);
  assert.doesNotMatch(text, /Example task|Mexico|window\.x|Menu|Footer/);
});

test('accepts a demo request only with the details the team needs', () => {
  const ok = parseLead({
    name: ' Ana Pérez ', email: 'Ana@Hotel.com', company: 'Hotel Sol', industry: 'hospitality',
    team_size: '40 people', summary: 'Coordinates maintenance on WhatsApp.',
  });
  assert.ok('lead' in ok);
  assert.equal(ok.lead.email, 'ana@hotel.com');
  assert.equal(ok.lead.name, 'Ana Pérez');

  const missing = parseLead({ name: 'Ana', email: 'ana@hotel.com' });
  assert.ok('error' in missing);
  assert.match(missing.error, /company, industry, team_size/);

  const bad = parseLead({ name: 'Ana', email: 'not-an-email', company: 'X', industry: 'Y', team_size: '5', summary: '' });
  assert.ok('error' in bad);
  assert.match(bad.error, /email/);
});

// ---- the privacy policy describes what the chat actually does ----
import { readFileSync } from 'node:fs';
import { privacyContent } from '../app/lib/legal.ts';

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('both privacy policies have the Rufo chat section the panel links to', () => {
  const panel = source('app/components/rufo/RufoChat.tsx');
  assert.match(panel, /\/privacy#rufo-assistant/);
  for (const lang of ['es', 'en']) {
    const { sections } = privacyContent[lang];
    sections.forEach((section, i) => assert.ok(section.title.startsWith(`${i + 1}. `), `${lang}: ${section.title}`));
    const rufo = sections.find((section) => section.id === 'rufo-assistant');
    assert.ok(rufo, lang);
    const all = sections.map((s) => [s.title, ...s.body, ...(s.bullets ?? [])].join(' ')).join(' ');
    for (const word of ['Anthropic', 'Flodesk', 'Resend', '30', '24']) assert.ok(all.includes(word), `${lang}: ${word}`);
  }
});

test('the chat keeps to what the privacy policy says', () => {
  const route = source('app/api/rufo/route.ts');
  const panel = source('app/components/rufo/RufoChat.tsx');
  // "up to 30 messages" are sent to Anthropic; IP entries are dropped after a day.
  assert.match(route, /const MAX_TURNS = 30;/);
  assert.match(route, /const DAY_MS = 24 \* 60 \* 60 \* 1000;/);
  assert.match(route, /buckets\.delete\(key\)/);
  // The conversation lives in the tab's session storage only.
  assert.match(panel, /sessionStorage/);
  assert.doesNotMatch(panel, /localStorage/);
  // Logs carry no conversation text and no address.
  const logs = [...route.matchAll(/console\.(?:log|error|warn)\(([\s\S]*?)\);\n/g)].map((m) => m[1]);
  assert.ok(logs.length >= 2);
  for (const log of logs) assert.doesNotMatch(log, /messages|turns|content|text|address|addressOf|ip\b/i);
  // Anthropic gets no visitor address or browser headers.
  const call = route.slice(route.indexOf('client.beta.messages.stream('), route.indexOf('for await'));
  assert.doesNotMatch(call, /addressOf|headers|metadata/);
});
