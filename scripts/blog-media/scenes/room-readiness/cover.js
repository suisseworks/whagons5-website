// Cover (4:3, still): a photo of room 312 just inspected, with the room's
// status card (checkout → clean → inspected → released) and the ticked
// inspection list layered over it. The photo is a generated image in
// assets/; every word is rendered here in the brand fonts.
import { box, el } from '../../lib/kit.js';
import { checklist, loadImages, photo, statusCard } from './_art.js';
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

    // Family motif: the big soft red arc behind the art.
    const arc = box(stage, '', 228, 6, 420, 420);
    arc.innerHTML = '<svg viewBox="0 0 100 100" width="420" height="420"><circle cx="50" cy="50" r="41" fill="none" stroke="rgba(212,49,10,.13)" stroke-width="6"/></svg>';

    const title = box(stage, '', 40, 40, 200, 200);
    el('div', 'lbl', title, s.kicker);
    const h = el('div', 'title', title);
    h.style.cssText = 'margin-top:10px;font-size:38px;line-height:1.02;letter-spacing:-.035em;font-weight:500';
    s.name.forEach((part, i) => { const line = el('div', '', h, part); if (i === 1) line.style.color = 'var(--red)'; });
    el('div', 'muted', title, s.line).style.cssText = 'margin-top:14px;font-size:12.5px;line-height:1.45;max-width:180px';

    photo(stage, { x: 252, y: 40, w: 310, h: 262, pos: '62% 40%', tag: s.tag });
    statusCard(stage, s, { x: 40, y: 214, w: 272 });
    checklist(stage, s, { x: 340, y: 236, w: 226 });

    const foot = box(stage, '', 40, 406, 100, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px"></span>';
    return () => {};
  },
};
