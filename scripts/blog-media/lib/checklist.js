// Closing figure shared by every article: a checklist card whose boxes tick
// in reading order. `groups` is [{ title, items: [..] }].
import { box, caption, el, ease, loopVeil, pop, rise, seg, set } from './kit.js';

export function checklistScene({ strings, duration = 12000 }) {
  return {
    size: [800, 450],
    duration,
    poster: duration - 1600,
    strings,
    build(stage, s, api) {
      stage.classList.add('dot-grid');
      const card = box(stage, 'win', 40, 26, 720, 360);
      card.style.padding = '22px 24px';
      el('div', 'lbl ink', card, s.kicker);
      el('div', 'title', card, s.title).style.cssText = 'margin-top:6px;font-size:23px';
      const grid = el('div', '', card);
      grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px';
      const checks = [];
      s.groups.forEach((group) => {
        const panel = el('div', '', grid);
        panel.style.cssText = 'padding:12px 14px 14px;border:1px solid var(--line);border-radius:10px;background:var(--paper-2)';
        el('div', 'lbl', panel, group.title).style.marginBottom = '9px';
        group.items.forEach((item) => {
          const line = el('div', '', panel);
          line.style.cssText = 'display:flex;align-items:flex-start;gap:9px;padding:4px 0;font-size:12.5px;line-height:1.35;color:var(--ink-2)';
          const check = el('span', 'check', line, '✓');
          check.style.marginTop = '1px';
          el('span', '', line, item);
          checks.push({ line, check });
        });
      });
      const steps = caption(stage, [{ at: 500, text: s.caption, until: duration - 700 }]);
      const veil = loopVeil(stage, api.duration);
      const first = 1300;
      const gap = Math.min(520, (duration - 4200) / checks.length);
      return (t) => {
        rise(card, seg(t, 150, 700));
        checks.forEach(({ line, check }, i) => {
          const at = first + i * gap;
          const on = t >= at;
          check.classList.toggle('on', on);
          pop(check, on ? seg(t, at, 360) : 1);
          line.style.color = on ? 'var(--ink)' : 'var(--ink-2)';
          set(line, { x: on ? (1 - seg(t, at, 300, ease.out)) * 3 : 0 });
        });
        steps(t);
        veil(t);
      };
    },
  };
}
