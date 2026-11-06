// Cover (4:3, still): hotel room after cleaning, pass/fail inspection list,
// and a "do not release" rework card when items fail.
import { box, el } from '../../lib/kit.js';
import { failBadge, inspection, loadImages, photo, rework } from './_art.js';
import { STRINGS } from './_strings.js';

export default {
  size: [600, 450],
  duration: 1000,
  poster: 0,
  still: true,
  strings: STRINGS,

  async build(stage, s) {
    stage.classList.add('dot-grid');
    await loadImages();

    const arc = box(stage, '', 228, 6, 420, 420);
    arc.innerHTML = '<svg viewBox="0 0 100 100" width="420" height="420"><circle cx="50" cy="50" r="41" fill="none" stroke="rgba(212,49,10,.13)" stroke-width="6"/></svg>';

    photo(stage, { x: 282, y: 40, w: 280, h: 250, pos: '58% 42%', tag: s.tag });

    const title = box(stage, '', 40, 40, 240, 200);
    title.style.zIndex = '4';
    el('div', 'lbl', title, s.kicker);
    const h = el('div', 'title', title);
    h.style.cssText = 'margin-top:10px;font-size:var(--fs);line-height:1.02;letter-spacing:-.035em;font-weight:500';
    s.name.forEach((part, i) => { const line = el('div', '', h, part); if (i === 1) line.style.color = 'var(--red)'; });
    el('div', 'muted', title, s.line).style.cssText = 'margin-top:12px;font-size:12px;line-height:1.42;max-width:214px';
    let fs = 34;
    h.style.setProperty('--fs', `${fs}px`);
    [...h.children].forEach((c) => { c.style.whiteSpace = 'nowrap'; c.style.width = 'max-content'; });
    while (fs > 24 && Math.max(...[...h.children].map((c) => c.scrollWidth)) > 226) { fs -= 1; h.style.setProperty('--fs', `${fs}px`); }

    inspection(stage, s, { x: 40, y: 198, w: 300, rows: 5 });
    rework(stage, s, { x: 362, y: 300, w: 200 });
    const badge = box(stage, '', 0, 0);
    badge.style.cssText = 'position:absolute;z-index:5;right:48px;top:287px';
    failBadge(badge, s);

    const foot = box(stage, '', 40, 412, 100, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px"></span>';
    return () => {};
  },
};
