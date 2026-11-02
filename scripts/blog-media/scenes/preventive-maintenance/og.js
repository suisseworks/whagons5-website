// Social card (1200×630) for the preventive maintenance article: the brand and
// title on the left, the plant room photo with the plan calendar on the right.
import { box, el } from '../../lib/kit.js';
import { calendar, loadImages, photo } from './_art.js';
import { STRINGS } from './_strings.js';

export default {
  size: [600, 315],
  duration: 1000,
  poster: 0,
  still: true,
  strings: STRINGS,

  async build(stage, s) {
    stage.classList.add('dot-grid');
    await loadImages();

    const arc = box(stage, '', 330, -40, 330, 330);
    arc.innerHTML = '<svg viewBox="0 0 100 100" width="330" height="330"><circle cx="50" cy="50" r="41" fill="none" stroke="rgba(212,49,10,.13)" stroke-width="6"/></svg>';

    const brand = box(stage, '', 34, 30, 300, 20);
    brand.style.cssText += ';display:flex;align-items:center;gap:10px';
    el('span', 'mark', brand);
    el('span', 'mono', brand, 'whagons/blog').style.cssText = 'font-size:13px;color:var(--ink)';
    const copy = box(stage, '', 34, 84, 262, 190);
    el('span', 'og-chip', copy, s.chip);
    el('div', 'og-title', copy, s.title).style.cssText = 'margin-top:14px;font-size:29px';
    const meta = box(stage, 'og-meta', 34, 272, 260, 16, s.meta);
    meta.style.whiteSpace = 'nowrap';

    photo(stage, { x: 340, y: 26, w: 234, h: 200, pos: '80% 45%', tag: s.tag });
    calendar(stage, s, { x: 290, y: 128, w: 276, rows: 3, pad: 13, nameW: 108 });
    return () => {};
  },
};
