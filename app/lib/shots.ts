// Product screenshots per site language, with their native capture dimensions.
// Each page shows the app in the visitor's language: Spanish UI for /es,
// English UI for /en. Task grids: Hotel Premium, September 19, 2026.

export type ShotLang = 'es' | 'en';

export interface Shot {
  src: string;
  width: number;
  height: number;
}

interface ShotSet {
  /** Main task grid (Tareas / Tasks tab). */
  grid: Shot;
  /** Kanban board, full view. */
  board: Shot;
  /** Close-up of board cards, used in "process" style sections. */
  boardDetail: Shot;
  /** Analytics / Mission Control overview. */
  analytics: Shot;
}

const SHOTS: Record<ShotLang, ShotSet> = {
  es: {
    grid: { src: '/images/hotel-premium-task-grid-es.jpg', width: 1512, height: 827 },
    board: { src: '/images/hotel-premium-board-es.jpg', width: 1512, height: 827 },
    boardDetail: { src: '/images/hotel-premium-board-detail-es.jpg', width: 810, height: 526 },
    analytics: { src: '/images/hotel-premium-analytics-es.jpg', width: 1170, height: 446 },
  },
  en: {
    grid: { src: '/images/en/hotel-premium-task-grid-en.jpg', width: 1512, height: 827 },
    board: { src: '/images/en/hotel-premium-board-en.jpg', width: 1512, height: 827 },
    boardDetail: { src: '/images/en/hotel-premium-board-detail-en.jpg', width: 805, height: 526 },
    analytics: { src: '/images/en/hotel-premium-analytics-en.jpg', width: 1170, height: 446 },
  },
};

export function shotsFor(lang: string): ShotSet {
  return SHOTS[lang === 'en' ? 'en' : 'es'];
}
