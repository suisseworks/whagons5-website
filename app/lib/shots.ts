// Product screenshots per site language. Each page shows the app captured in
// the visitor's language: Spanish UI for /es, English UI for /en.

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
    grid: { src: '/images/demo-task-grid.png', width: 1536, height: 860 },
    board: { src: '/images/demo-housekeeping-board.png', width: 1536, height: 735 },
    boardDetail: { src: '/images/demo-housekeeping-detail.png', width: 1774, height: 887 },
    analytics: { src: '/images/whagons-analytics-dashboard.png', width: 1024, height: 515 },
  },
  en: {
    grid: { src: '/images/en/demo-task-grid.png', width: 1536, height: 860 },
    board: { src: '/images/en/demo-board.png', width: 1536, height: 860 },
    boardDetail: { src: '/images/en/demo-board-detail.png', width: 828, height: 638 },
    analytics: { src: '/images/en/whagons-analytics.png', width: 1536, height: 860 },
  },
};

export function shotsFor(lang: string): ShotSet {
  return SHOTS[lang === 'en' ? 'en' : 'es'];
}
