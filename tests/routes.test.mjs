import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import { routeFor, routeKeyFromPath } from '../app/lib/locales.ts';
import { hospitalityDestination, isHospitalityHost } from '../app/lib/hospitality-host.ts';

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

test('hospitality.whagons.com serves only the hotel page', () => {
  assert.equal(isHospitalityHost('hospitality.whagons.com'), true);
  assert.equal(isHospitalityHost('Hospitality.whagons.com:443'), true);
  for (const host of ['whagons.com', 'www.whagons.com', 'pageup.whagons.com', '', null]) {
    assert.equal(isHospitalityHost(host), false);
  }

  // The root opens the hotel page in the visitor's language.
  assert.equal(hospitalityDestination('/', 'es'), '/es/operaciones-hoteleras');
  assert.equal(hospitalityDestination('/', 'en'), '/en/hotel-operations');
  assert.equal(hospitalityDestination('/en', 'es'), '/en/hotel-operations');
  assert.equal(hospitalityDestination('/es/', 'en'), '/es/operaciones-hoteleras');
  // The hotel page itself is served on the subdomain.
  assert.equal(hospitalityDestination('/es/operaciones-hoteleras', 'es'), null);
  assert.equal(hospitalityDestination('/en/hotel-operations/', 'es'), null);
  // Its buttons and the site menu lead to pages that live on the main site.
  assert.equal(hospitalityDestination('/es/demo', 'es'), 'https://whagons.com/es/demo');
  assert.equal(hospitalityDestination('/es/evaluacion', 'es'), 'https://whagons.com/es/evaluacion');
  assert.equal(hospitalityDestination('/es/planes', 'es'), 'https://whagons.com/es/planes');
});
