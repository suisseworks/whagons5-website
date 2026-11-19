// Social card (1200×630): brand and title on the left, the daily room board
// with the credits card on the right.
import { box, el } from '../../lib/kit.js';
import { board, credits } from './_art.js';
import { STRINGS } from './_strings.js';

export default {
  size: [600, 315],
  duration: 1000,
  poster: 0,
  still: true,
  strings: STRINGS,

  async build(stage, s) {
    stage.classList.add('dot-grid');

    const arc = box(stage, '', 330, -40, 330, 330);
    arc.innerHTML = '<svg viewBox="0 0 100 100" width="330" height="330"><circle cx="50" cy="50" r="41" fill="none" stroke="rgba(212,49,10,.13)" stroke-width="6"/></svg>';

    const brand = box(stage, '', 34, 30, 300, 20);
    brand.style.cssText += ';display:flex;align-items:center;gap:10px';
    el('span', 'mark', brand);
    el('span', 'mono', brand, 'whagons/blog').style.cssText = 'font-size:13px;color:var(--ink)';
    const copy = box(stage, '', 34, 84, 250, 190);
    el('span', 'og-chip', copy, s.chip);
    el('div', 'og-title', copy, s.title).style.cssText = 'margin-top:14px;font-size:24px';
    const meta = box(stage, 'og-meta', 34, 272, 240, 16, s.meta);
    meta.style.whiteSpace = 'nowrap';

    board(stage, s, { x: 336, y: 18, w: 238, h: 190, pad: 14, tile: 23, th: 25, gap: 4, rowGap: 4, label: 26, legend: false, floors: 3 });
    credits(stage, s, { x: 290, y: 156, w: 280, pad: 10, sick: false, rp: 3 });
    return () => {};
  },
};
