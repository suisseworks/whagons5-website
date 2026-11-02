// Cover (4:3, still): a tidy hotel plant room, with the plan's weekly
// calendar (done days green, a late day red) and today's generator test task
// layered over it. The photo is a generated image in assets/; every word is
// rendered here in the brand fonts.
import { box, el } from '../../lib/kit.js';
import { calendar, fromBadge, loadImages, photo, taskCard } from './_art.js';
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

    const photoNode = photo(stage, { x: 262, y: 40, w: 300, h: 250, pos: '78% 45%', tag: s.tag });

    const title = box(stage, '', 40, 40, 240, 200);
    title.style.zIndex = '4';
    el('div', 'lbl', title, s.kicker);
    const h = el('div', 'title', title);
    h.style.cssText = 'margin-top:10px;font-size:var(--fs);line-height:1.02;letter-spacing:-.035em;font-weight:500';
    s.name.forEach((part, i) => { const line = el('div', '', h, part); if (i === 1) line.style.color = 'var(--red)'; });
    el('div', 'muted', title, s.line).style.cssText = 'margin-top:14px;font-size:12.5px;line-height:1.45;max-width:190px';
    // Fit the longest title word into the space left of the photo.
    let fs = 38;
    h.style.setProperty('--fs', `${fs}px`);
    while (fs > 26 && Math.max(...[...h.children].map((c) => c.scrollWidth)) > 214) { fs -= 1; h.style.setProperty('--fs', `${fs}px`); }
    [...h.children].forEach((c) => { c.style.whiteSpace = 'nowrap'; c.style.width = 'max-content'; });

    calendar(stage, s, { x: 40, y: 204, w: 286, nameW: 112 });
    const task = taskCard(stage, s, { x: 340, y: 268, w: 224 });
    const badge = box(stage, '', 0, 0);
    badge.style.cssText = 'position:absolute;z-index:5;left:476px;top:256px';
    fromBadge(badge, s);
    void photoNode; void task;

    const foot = box(stage, '', 40, 412, 100, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px"></span>';
    return () => {};
  },
};
