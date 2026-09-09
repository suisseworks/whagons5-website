import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, questions, validAnswers } from '../app/lib/hotel-score.mjs';
import { buildScoreEmail } from '../app/lib/hotel-score-delivery.mjs';

test('score extremes and rounding use only evaluated answers', () => {
  assert.equal(calculateScore(Array(10).fill(0)).score, 0);
  assert.equal(calculateScore(Array(10).fill(3)).score, 100);
  assert.equal(calculateScore(Array(10).fill(2)).score, 67);
  const result = calculateScore([3, 3, 3, 3, 3, 3, 'unknown', 'na', 'na', 'na']);
  assert.equal(result.score, 100); assert.equal(result.evaluated, 6);
  assert.deepEqual(result.unknown, [6]); assert.equal(result.partial, false);
  assert.equal(calculateScore(Array(10).fill('unknown')).score, null);
  assert.equal(calculateScore([3, ...Array(9).fill('na')]).partial, true);
});
test('recommendations prioritize gaps and never invent weaknesses for strong answers', () => {
  assert.deepEqual(calculateScore([3, 2, 0, 1, 3, 3, 3, 3, 3, 3]).opportunities, [2, 3, 1]);
  assert.deepEqual(calculateScore(Array(10).fill(3)).opportunities, []);
  assert.equal(calculateScore(Array(10).fill(3)).strengths.length, 10);
});
test('answer validation rejects partial, malformed and coerced scores', () => {
  for (const value of [null, {}, [], Array(9).fill(1), Array(10).fill('3'), Array(10).fill(4), Array(10).fill(null)]) assert.equal(validAnswers(value), false);
  assert.throws(() => calculateScore(Array(10).fill(-1)));
});
test('both languages have ten questions with feature-linked actions and starter templates', () => {
  for (const lang of ['es', 'en']) {
    assert.equal(questions[lang].length, 10);
    for (const q of questions[lang]) { assert.equal(q.answers.length, 4); assert(q.features.length); assert(q.action); assert(q.improve); assert(q.metric); assert(q.template.length >= 3); }
  }
});
const data = { email: ' Hotel@Example.com ', language: 'es', answers: Array(10).fill(1), requestId: '12345678-1234-4123-8123-123456789012', marketingOptIn: false };
test('email report recomputes score and includes relevant recommendations and template', () => {
  const report = buildScoreEmail({...data, score: 100});
  assert.match(report.text, /33\/100/); assert.match(report.html, /Whagons/); assert.match(report.html, /<table/);
  assert(!report.text.includes('100/100'));
});
