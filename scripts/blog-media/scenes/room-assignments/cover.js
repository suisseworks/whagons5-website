// Cover (4:3, still): the daily room board coloured by attendant, credits per
// attendant, and the supervisor card for a covered sick call.
import { box, el } from '../../lib/kit.js';
import { badge, board, credits, task } from './_art.js';
import { STRINGS } from './_strings.js';

export default {
  size: [600, 450],
  duration: 1000,
  poster: 0,
  still: true,
  strings: STRINGS,

  async build(stage, s) {
    stage.classList.add('dot-grid');

    const arc = box(stage, '', 228, 6, 420, 420);
    arc.innerHTML = '<svg viewBox="0 0 100 100" width="420" height="420"><circle cx="50" cy="50" r="41" fill="none" stroke="rgba(212,49,10,.13)" stroke-width="6"/></svg>';

    board(stage, s, { x: 312, y: 36, w: 252, h: 236, tile: 24, label: 22 });

    const title = box(stage, '', 40, 40, 250, 200);
    title.style.zIndex = '4';
    el('div', 'lbl', title, s.kicker);
    const h = el('div', 'title', title);
    h.style.cssText = 'margin-top:10px;font-size:var(--fs);line-height:1.02;letter-spacing:-.035em;font-weight:500';
    s.name.forEach((part, i) => { const line = el('div', '', h, part); if (i === 1) line.style.color = 'var(--red)'; });
    el('div', 'muted', title, s.line).style.cssText = 'margin-top:12px;font-size:12px;line-height:1.42;max-width:214px';
    let fs = 40;
    h.style.setProperty('--fs', `${fs}px`);
    [...h.children].forEach((c) => { c.style.whiteSpace = 'nowrap'; c.style.width = 'max-content'; });
    while (fs > 24 && Math.max(...[...h.children].map((c) => c.scrollWidth)) > 244) { fs -= 1; h.style.setProperty('--fs', `${fs}px`); }

    credits(stage, s, { x: 40, y: 196, w: 284, pad: 13, rp: 5 });
    task(stage, s, { x: 362, y: 300, w: 200 });
    const b = box(stage, '', 0, 0);
    b.style.cssText = 'position:absolute;z-index:5;right:48px;top:287px';
    badge(b, s);

    const foot = box(stage, '', 40, 412, 100, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px"></span>';
    return () => {};
  },
};
