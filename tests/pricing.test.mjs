import test from 'node:test';
import assert from 'node:assert/strict';
import { aiAllowance, calculatePrice, groups, groupPrice } from '../app/lib/pricing.ts';

test('Costa Rica Professional quote separates recurring and one-time fees', () => {
  assert.deepEqual(calculatePrice('cr', 'professional', 60, ['people', 'supply']), {
    base: 699, extraUsers: 20, userTotal: 100, addons: 348, monthly: 1147,
    implementation: 1000, firstMonth: 2147,
  });
});
test('Latin America keeps the approved implementation revision across all plans', () => {
  for (const [plan, users, setup] of [
    ['essential', 20, 600],
    ['professional', 40, 1000],
    ['enterprise', 60, 1600],
  ]) {
    assert.equal(calculatePrice('cr', plan, users, []).implementation, setup);
  }
});
test('USA publishes its implementation fee for each plan', () => {
  for (const [plan, users, setup] of [['essential', 20, 1500], ['professional', 40, 3500], ['enterprise', 60, 7500]]) {
    assert.equal(calculatePrice('us', plan, users, []).implementation, setup);
  }
});
test('included powerups and duplicate selections never generate a second charge', () => {
  const selection = ['maintenance', 'compliance', 'people', 'people'];
  assert.equal(calculatePrice('cr', 'essential', 20, selection).monthly, 896);
  assert.equal(calculatePrice('cr', 'professional', 20, selection).monthly, 848);
  assert.equal(calculatePrice('cr', 'enterprise', 20, selection).monthly, 1200);
});
test('additional users start above each plan allowance', () => {
  for (const [plan, included, base] of [['essential', 20, 399], ['professional', 40, 699], ['enterprise', 60, 1200]]) {
    assert.equal(calculatePrice('cr', plan, included - 1, []).monthly, base);
    assert.equal(calculatePrice('cr', plan, included, []).monthly, base);
    assert.equal(calculatePrice('cr', plan, included + 1, []).monthly, base + 5);
  }
});
test('USA Essential with extra users and two powerups adds the one-time fee to the first month', () => {
  const result = calculatePrice('us', 'essential', 25, ['sales', 'ai']);
  assert.equal(result.userTotal, 90);
  assert.equal(result.monthly, 1537);
  assert.equal(result.implementation, 1500);
  assert.equal(result.firstMonth, 3037);
});
test('Enterprise includes six groups; sales and AI remain optional', () => {
  assert.deepEqual(groups.filter(group => groupPrice(group, 'us', 'enterprise') > 0).map(group => group.id), ['sales', 'ai']);
  assert.equal(calculatePrice('us', 'enterprise', 61, groups.map(group => group.id)).monthly, 4266);
});
test('user count rejects blank-equivalent, fractional, negative and nonfinite numbers', () => {
  for (const users of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => calculatePrice('cr', 'essential', users, []), RangeError);
  }
});
test('AI Operations Manager includes some AI usage every month in each market, below its price', () => {
  const ai = groups.find(group => group.id === 'ai');
  for (const market of ['cr', 'us']) {
    assert.ok(aiAllowance[market] > 0);
    assert.ok(aiAllowance[market] < groupPrice(ai, market, 'essential'));
  }
});
