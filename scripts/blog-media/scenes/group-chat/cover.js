// Cover (4:3, still): a hotel corridor with a housekeeping trolley, a busy
// team chat where the Room 214 request gets lost, and the task it became.
// The photo is a generated image in assets/; every word is rendered here.
import { box, el } from '../../lib/kit.js';
import { chat, fromBadge, loadImages, photo, taskCard } from './_art.js';
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

    photo(stage, { x: 262, y: 40, w: 300, h: 250, pos: '40% 50%', tag: s.tag });

    const title = box(stage, '', 40, 40, 240, 200);
    title.style.zIndex = '4';
    el('div', 'lbl', title, s.kicker);
    const h = el('div', 'title', title);
    h.style.cssText = 'margin-top:10px;font-size:var(--fs);line-height:1.02;letter-spacing:-.035em;font-weight:500';
    s.name.forEach((part, i) => { const line = el('div', '', h, part); if (i === 1) line.style.color = 'var(--red)'; });
    el('div', 'muted', title, s.line).style.cssText = 'margin-top:12px;font-size:12px;line-height:1.42;max-width:214px';
    let fs = 38;
    h.style.setProperty('--fs', `${fs}px`);
    [...h.children].forEach((c) => { c.style.whiteSpace = 'nowrap'; c.style.width = 'max-content'; });
    while (fs > 26 && Math.max(...[...h.children].map((c) => c.scrollWidth)) > 210) { fs -= 1; h.style.setProperty('--fs', `${fs}px`); }

    chat(stage, s, { x: 40, y: 218, w: 272, msgs: 2, more: false });
    taskCard(stage, s, { x: 336, y: 290, w: 228 });
    const badge = box(stage, '', 0, 0);
    badge.style.cssText = 'position:absolute;z-index:5;right:48px;top:277px';
    fromBadge(badge, s);

    const foot = box(stage, '', 40, 412, 100, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px"></span>';
    return () => {};
  },
};
