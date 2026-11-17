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
