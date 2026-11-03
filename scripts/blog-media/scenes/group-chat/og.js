// Social card (1200×630): brand and title on the left, the corridor photo
// with the lost chat request on the right.
import { box, el } from '../../lib/kit.js';
import { chat, loadImages, photo } from './_art.js';
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
    const copy = box(stage, '', 34, 84, 250, 190);
    el('span', 'og-chip', copy, s.chip);
    el('div', 'og-title', copy, s.title).style.cssText = 'margin-top:14px;font-size:27px';
    const meta = box(stage, 'og-meta', 34, 272, 240, 16, s.meta);
    meta.style.whiteSpace = 'nowrap';

    photo(stage, { x: 350, y: 26, w: 224, h: 200, pos: '35% 50%', tag: s.tag });
    chat(stage, s, { x: 292, y: 112, w: 252, msgs: 2, pad: 12, more: false });
    return () => {};
  },
};
