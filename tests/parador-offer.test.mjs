import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOffer, defaultOffer, isOfferDraft } from '../app/lib/parador-offer.ts';

test('Parador starts without an invented negotiated concession', () => {
  const offer = calculateOffer(defaultOffer);
  assert.equal(offer.monthly, 699);
  assert.equal(offer.implementation, 1000);
  assert.equal(offer.firstMonth, 1699);
  assert.equal(offer.firstYear, 9388);
  assert.equal(offer.firstYearSavings, 0);
});

test('gifts, seats and percentage discount apply in the documented order', () => {
  const offer = calculateOffer({...defaultOffer, users: '60', bonusUsers: '10', discount: '10', implementationDiscount: '50', groupModes: {people:'gift', mobility:'gift', supply:'paid'}});
  assert.equal(offer.regular.monthly, 1206);
  assert.equal(offer.giftSavings, 208);
  assert.equal(offer.userSavings, 50);
  assert.equal(offer.subtotal, 948);
  assert.equal(offer.discount, 94.8);
  assert.equal(offer.monthly, 853.2);
  assert.equal(offer.implementation, 500);
  assert.equal(offer.firstMonth, 1353.2);
  assert.equal(offer.firstYearSavings, 4733.6);
});

test('six-month promotion returns to the same scope at full price in month seven', () => {
  const offer = calculateOffer({...defaultOffer, promoMonths:'6', discount:'10', groupModes:{people:'gift'}});
  assert.equal(offer.regular.monthly, 848);
  assert.equal(offer.monthly, 629.1);
  assert.equal(offer.firstYear, 9862.6);
  assert.equal(offer.firstYearSavings, 1313.4);
});

test('promotions longer than a year only count twelve discounted months in annual totals', () => {
  const offer = calculateOffer({...defaultOffer, promoMonths:'24', discount:'10'});
  assert.equal(offer.firstYear, 8549.2);
  assert.equal(offer.firstYearSavings, 838.8);
});

test('fixed concessions and complimentary users cannot create negative charges', () => {
  const offer = calculateOffer({...defaultOffer, users:'41', bonusUsers:'100', discountType:'amount', discount:'5000', implementationDiscount:'100'});
  assert.equal(offer.effectiveBonusUsers, 1);
  assert.equal(offer.userSavings, 5);
  assert.equal(offer.discount, 699);
  assert.equal(offer.monthly, 0);
  assert.equal(offer.implementation, 0);
  assert.equal(offer.firstMonth, 0);
});

test('an included group is neither removed nor counted as a gift when changing plans', () => {
  const draft = {...defaultOffer, groupModes:{people:'gift', maintenance:'off', daily:'off'}};
  const professional = calculateOffer(draft);
  assert.equal(professional.giftSavings, 149);
  assert(professional.active.some(group => group.id === 'maintenance'));
  const enterprise = calculateOffer({...draft, plan:'enterprise'});
  assert.equal(enterprise.giftSavings, 0);
  assert.equal(enterprise.monthlySavings, 0);
  assert(enterprise.active.some(group => group.id === 'daily'));
});

test('gifted groups return to charged or removed without stale savings', () => {
  assert.equal(calculateOffer({...defaultOffer, groupModes:{people:'gift'}}).monthly, 699);
  assert.equal(calculateOffer({...defaultOffer, groupModes:{people:'paid'}}).monthly, 848);
  assert.equal(calculateOffer({...defaultOffer, groupModes:{people:'off'}}).monthly, 699);
  assert.equal(calculateOffer({...defaultOffer, groupModes:{people:'off'}}).monthlySavings, 0);
});

test('setup-only gift does not discount subscription or add a second training fee', () => {
  const offer = calculateOffer({...defaultOffer, implementationDiscount:'100'});
  assert.equal(offer.monthly, 699);
  assert.equal(offer.monthlySavings, 0);
  assert.equal(offer.firstMonth, 699);
  assert.equal(offer.implementation, 0);
  assert.equal(offer.firstYearSavings, 1000);
});

test('saved concessions recalculate from current shared setup fees without changing the draft', () => {
  const saved = JSON.stringify({...defaultOffer, implementationDiscount:'50', bonusUsers:'5', users:'50', groupModes:{people:'gift'}});
  const draft = JSON.parse(saved);
  assert(isOfferDraft(draft));
  const offer = calculateOffer(draft);
  assert.equal(offer.implementationRegular, 1000);
  assert.equal(offer.implementation, 500);
  assert.equal(offer.giftSavings, 149);
  assert.equal(offer.userSavings, 25);
  assert.equal(offer.monthly, 724);
  assert.equal(JSON.stringify(draft), saved);
});

test('saved drafts round-trip and invalid stored or edited terms are rejected', () => {
  assert(isOfferDraft(JSON.parse(JSON.stringify(defaultOffer))));
  for (const changed of [
    {users:''}, {users:'1.5'}, {users:'0'}, {users:'100001'}, {bonusUsers:'-1'},
    {discount:'101'}, {discount:'NaN'}, {implementationDiscount:'101'}, {promoMonths:'-1'},
    {promoMonths:'2.5'}, {promoMonths:'121'}, {plan:'unknown'}, {discountType:'unknown'},
    {groupModes:{sales:'free'}}, {groupModes:{unknown:'gift'}}, {groupModes:null},
    {validUntil:'2026-02-30'}, {validUntil:'invalid'}, {notes:'x'.repeat(1501)}, {version:2},
  ]) {
    const draft = {...defaultOffer, ...changed};
    assert.equal(isOfferDraft(draft), false, JSON.stringify(changed));
    assert.throws(() => calculateOffer(draft), RangeError);
  }
  for (const invalid of [null, [], {}, 'offer']) assert.equal(isOfferDraft(invalid), false);
});
