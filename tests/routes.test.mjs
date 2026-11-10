import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import { routeFor, routeKeyFromPath } from '../app/lib/locales.ts';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

test('the free evaluation page has a slug in each language', () => {
  assert.equal(routeFor('en', 'evaluation'), '/en/evaluation');
  assert.equal(routeFor('es', 'evaluation'), '/es/evaluacion');
  // The language switcher uses this to swap one slug for the other.
  for (const path of ['/en/evaluation', '/es/evaluacion', '/es/evaluacion/']) {
    assert.equal(routeKeyFromPath(path), 'evaluation');
  }
});

test('the free business evaluation page has a slug in each language', () => {
  assert.equal(routeFor('en', 'businessEvaluation'), '/en/business-evaluation');
  assert.equal(routeFor('es', 'businessEvaluation'), '/es/evaluacion-empresa');
  for (const path of ['/en/business-evaluation', '/es/evaluacion-empresa', '/es/evaluacion-empresa/']) {
    assert.equal(routeKeyFromPath(path), 'businessEvaluation');
  }
});

test('the retired pilot waitlist URLs permanently redirect to the demo in the same language', async () => {
  const redirects = await nextConfig.redirects();
  const expected = {
    '/en/pilot': '/en/demo',
    '/es/piloto': '/es/demo',
    '/en/piloto': '/en/demo',
    '/es/pilot': '/es/demo',
  };

  for (const [source, destination] of Object.entries(expected)) {
    const rule = redirects.find((redirect) => redirect.source === source);
    assert.ok(rule, `${source} redirects`);
    assert.equal(rule.destination, destination);
    assert.equal(rule.permanent, true);
    assert.equal(destination, routeFor(source.slice(1, 3), 'demo'));
  }
  assert.equal(routeKeyFromPath('/en/pilot'), null);
  assert.equal(routeKeyFromPath('/es/piloto'), null);
});
