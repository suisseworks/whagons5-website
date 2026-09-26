import { calculatePrice, groups, groupPrice, includedUsers, plans, type GroupId, type Plan } from './pricing.ts';

export type GroupMode = 'off' | 'paid' | 'gift';
export type OfferDraft = {
  version: 1;
  plan: Plan;
  users: string;
  bonusUsers: string;
  discountType: 'percent' | 'amount';
  discount: string;
  implementationDiscount: string;
  promoMonths: string;
  validUntil: string;
  notes: string;
  groupModes: Partial<Record<GroupId, GroupMode>>;
};
export const defaultOffer: OfferDraft = {
  version: 1, plan: 'professional', users: '40', bonusUsers: '0', discountType: 'percent',
  discount: '0', implementationDiscount: '0', promoMonths: '0', validUntil: '', notes: '', groupModes: {},
};

// Browser drafts are untrusted. Reject malformed or incomplete terms instead of
// silently displaying a plausible zero-price offer.
export function isOfferDraft(value: unknown): value is OfferDraft {
  if (!value || typeof value !== 'object') return false;
  const d = value as OfferDraft;
  const numeric = ['users', 'bonusUsers', 'discount', 'implementationDiscount', 'promoMonths'] as const;
  if (d.version !== 1 || !plans.includes(d.plan) || !['percent', 'amount'].includes(d.discountType)) return false;
  if (numeric.some(key => typeof d[key] !== 'string' || !/^\d+(\.\d{1,2})?$/.test(d[key]) || !Number.isFinite(Number(d[key])))) return false;
  if (!Number.isSafeInteger(Number(d.users)) || Number(d.users) < 1 || Number(d.users) > 100000) return false;
  if (!Number.isSafeInteger(Number(d.bonusUsers)) || Number(d.bonusUsers) < 0 || Number(d.bonusUsers) > 100000) return false;
  if (!Number.isSafeInteger(Number(d.promoMonths)) || Number(d.promoMonths) < 0 || Number(d.promoMonths) > 120) return false;
  if (Number(d.discount) < 0 || Number(d.discount) > (d.discountType === 'percent' ? 100 : 1000000)) return false;
  if (Number(d.implementationDiscount) < 0 || Number(d.implementationDiscount) > 100) return false;
  if (typeof d.notes !== 'string' || d.notes.length > 1500 || typeof d.validUntil !== 'string') return false;
  if (d.validUntil && (!/^\d{4}-\d{2}-\d{2}$/.test(d.validUntil) || !Number.isFinite(Date.parse(d.validUntil)) || new Date(d.validUntil).toISOString().slice(0, 10) !== d.validUntil)) return false;
  if (!d.groupModes || typeof d.groupModes !== 'object' || Array.isArray(d.groupModes)) return false;
  return Object.entries(d.groupModes).every(([id, mode]) => groups.some(group => group.id === id) && ['off', 'paid', 'gift'].includes(mode));
}

const cents = (value: number) => Math.round(value * 100) / 100;
export function calculateOffer(draft: OfferDraft) {
  if (!isOfferDraft(draft)) throw new RangeError('Invalid offer terms');
  const users = Number(draft.users);
  const active = groups.filter(group => groupPrice(group, 'cr', draft.plan) === 0 || ['paid', 'gift'].includes(draft.groupModes[group.id] ?? 'off'));
  const regular = calculatePrice('cr', draft.plan, users, active.map(group => group.id));
  const giftedGroups = active.filter(group => groupPrice(group, 'cr', draft.plan) > 0 && draft.groupModes[group.id] === 'gift');
  const giftSavings = cents(giftedGroups.reduce((sum, group) => sum + groupPrice(group, 'cr', draft.plan), 0));
  const effectiveBonusUsers = Math.min(Number(draft.bonusUsers), Math.max(0, users - includedUsers[draft.plan]));
  const userSavings = effectiveBonusUsers * 5;
  const subtotal = cents(regular.monthly - giftSavings - userSavings);
  const discount = cents(Math.min(subtotal, draft.discountType === 'percent' ? subtotal * Number(draft.discount) / 100 : Number(draft.discount)));
  const monthly = cents(subtotal - discount);
  // Costa Rica has a defined setup fee; training is bundled, never added twice.
  const implementationRegular = regular.implementation!;
  const implementationSavings = cents(implementationRegular * Number(draft.implementationDiscount) / 100);
  const implementation = cents(implementationRegular - implementationSavings);
  const promoMonths = Number(draft.promoMonths);
  const monthsInFirstYear = promoMonths === 0 ? 12 : Math.min(promoMonths, 12);
  const firstYear = cents(monthly * monthsInFirstYear + regular.monthly * (12 - monthsInFirstYear) + implementation);
  const firstYearRegular = cents(regular.monthly * 12 + implementationRegular);
  return {
    regular, active, giftedGroups, giftSavings, effectiveBonusUsers, userSavings, subtotal, discount,
    monthly, monthlySavings: cents(regular.monthly - monthly), implementationRegular, implementationSavings,
    implementation, firstMonth: cents(monthly + implementation), firstYear, firstYearRegular,
    firstYearSavings: cents(firstYearRegular - firstYear), promoMonths,
  };
}
