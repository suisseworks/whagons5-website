// Product screenshots per site language, captured at 2x device pixel ratio so
// they stay sharp on retina displays. Each page shows the app captured in
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
    grid: { src: '/images/demo-task-grid.png', width: 3072, height: 1720 },
    board: { src: '/images/demo-board.png', width: 3072, height: 1720 },
    boardDetail: { src: '/images/demo-board-detail.png', width: 1656, height: 1276 },
    analytics: { src: '/images/whagons-analytics.png', width: 3072, height: 1720 },
  },
  en: {
    grid: { src: '/images/en/demo-task-grid.png', width: 3072, height: 1720 },
    board: { src: '/images/en/demo-board.png', width: 3072, height: 1720 },
    boardDetail: { src: '/images/en/demo-board-detail.png', width: 1656, height: 1276 },
    analytics: { src: '/images/en/whagons-analytics.png', width: 3072, height: 1720 },
  },
};

export function shotsFor(lang: string): ShotSet {
  return SHOTS[lang === 'en' ? 'en' : 'es'];
}
