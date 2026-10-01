// Product screenshots per site language, with their native capture dimensions.
// Each page shows the app in the visitor's language: Spanish UI for /es,
// English UI for /en. Hotel Premium, September 19, 2026.
// The task grid, Kanban board and board close-up are rebuilt in HTML
// (components/product) so they stay sharp; their captures remain in
// public/images as the reference for those replicas.

export type ShotLang = 'es' | 'en';

export interface Shot {
  src: string;
  width: number;
  height: number;
}

interface ShotSet {
  /** Analytics / Mission Control overview. */
  analytics: Shot;
}

const SHOTS: Record<ShotLang, ShotSet> = {
  es: {
    analytics: { src: '/images/hotel-premium-analytics-es.jpg', width: 1170, height: 446 },
  },
  en: {
    analytics: { src: '/images/en/hotel-premium-analytics-en.jpg', width: 1170, height: 446 },
  },
};

export function shotsFor(lang: string): ShotSet {
  return SHOTS[lang === 'en' ? 'en' : 'es'];
}
