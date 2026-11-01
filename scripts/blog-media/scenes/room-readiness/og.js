// Social card (1200×630) for the room readiness article: the brand and title
// on the left, the inspected room photo with its status card on the right.
import { box, el } from '../../lib/kit.js';
import { loadImages, photo, statusCard } from './_art.js';
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
    const copy = box(stage, '', 34, 84, 268, 190);
    el('span', 'og-chip', copy, s.chip);
    el('div', 'og-title', copy, s.title).style.cssText = 'margin-top:14px;font-size:30px';
    const meta = box(stage, 'og-meta', 34, 272, 260, 16, s.meta);
    meta.style.whiteSpace = 'nowrap';

    photo(stage, { x: 330, y: 26, w: 244, h: 214, pos: '66% 58%', tag: s.tag });
    statusCard(stage, s, { x: 306, y: 174, w: 236, foot: false, pad: 14 });

    // Inspection score chip pinned to the photo's edge.
    const chip = box(stage, 'rr-card', 474, 112, null, null);
    chip.style.cssText += ';display:flex;align-items:center;gap:8px;padding:8px 11px 8px 9px;border-radius:12px;white-space:nowrap';
    const tick = el('span', '', chip, '✓');
    tick.style.cssText = 'display:grid;place-items:center;width:20px;height:20px;border-radius:6px;background:#22c55e;color:#fff;font-size:11px;font-weight:700';
    const txt = el('div', '', chip);
    el('div', 'lbl ink', txt, s.list).style.cssText = 'font-size:8px;color:var(--ink-3)';
    el('div', '', txt, `${s.items.length}/${s.items.length}`).style.cssText = 'font-size:13px;font-weight:600;letter-spacing:-.01em;line-height:1.1';
    return () => {};
  },
};
