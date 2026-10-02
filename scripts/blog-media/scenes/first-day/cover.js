// Cover loop (4:3): a task is born with a photo and a place, someone picks it
// up, and it moves from Pending to In Progress to Completed. Seamless loop.
import { box, clamp, ease, el, set } from '../../lib/kit.js';
import { photo } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

const PERIOD = 2400;
const CYCLE = 3;

export default {
  size: [600, 450],
  duration: PERIOD * CYCLE,
  poster: PERIOD + 1600,
  strings: withCommon({
    en: { kicker: 'Basics', name: 'Your first day', line: 'Find it, do it, finish it' },
    es: { kicker: 'Lo básico', name: 'Tu primer día', line: 'Encuéntrala, hazla, termínala' },
    pt: { kicker: 'O básico', name: 'Seu primeiro dia', line: 'Encontre, faça, conclua' },
    de: { kicker: 'Grundlagen', name: 'Ihr erster Tag', line: 'Finden, erledigen, abschließen' },
  }),

  build(stage, s) {
    stage.classList.add('dot-grid');
    const ring = box(stage, '', 270, 34, 380, 380);
    ring.innerHTML = '<svg viewBox="0 0 100 100" width="380" height="380"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(22,21,19,.07)" stroke-width="6"/><path d="M50 10a40 40 0 0 1 34.6 60" fill="none" stroke="rgba(212,49,10,.16)" stroke-width="6" stroke-linecap="round"/></svg>';
    const title = box(stage, '', 40, 38, 250, 110);
    el('div', 'lbl ink', title, s.kicker);
    el('div', 'title', title, s.name).style.cssText = 'margin-top:6px;font-size:30px';
    el('div', 'muted', title, s.line).style.cssText = 'margin-top:8px;font-size:13px';

    // Three steps legend.
    const legend = box(stage, '', 40, 176, 220, 150);
    legend.style.cssText += ';display:grid;gap:10px';
    const legendItems = [['todo', s.statuses.pending], ['progress', s.statuses.progress], ['done', s.statuses.done]].map(([tone, label]) => {
      const row = el('div', '', legend);
      row.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:12px;color:var(--ink-3)';
      const dot = el('span', '', row);
      dot.style.cssText = `width:10px;height:10px;border-radius:50%;background:var(--${tone === 'todo' ? 'todo' : tone})`;
      el('span', '', row, label);
      return row;
    });

    const names = s.tasks.slice(0, 3);
    const slots = [0, 1, 2, 3];
    const cards = slots.map(() => {
      const card = box(stage, 'card', 270, 0, 300, 74);
      card.style.cssText += ';display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:4px 12px;padding:10px 12px';
      const pic = photo(card, 54, 54);
      pic.style.gridRow = 'span 2';
      const name = el('span', '', card);
      name.style.cssText = 'font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
      const who = el('span', 'av a', card, 'AM');
      who.style.cssText += ';grid-row:span 2;width:24px;height:24px;font-size:9px';
      const meta = el('div', '', card);
      meta.style.cssText = 'display:flex;align-items:center;gap:8px';
      const status = el('span', 'pill todo', meta, s.statuses.pending);
      const spot = el('span', 'muted', meta, '');
      spot.style.fontSize = '11px';
      return { card, name, who, status, spot };
    });
    const foot = box(stage, '', 40, 404, 240, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px;vertical-align:middle"></span>';

    return (t) => {
      const tick = Math.floor(t / PERIOD) % CYCLE;
      const phase = (t % PERIOD) / PERIOD;
      const move = ease.inOut(clamp((phase - 0.02) / 0.3));
      const step = phase > 0.55 ? 1 : 0;
      cards.forEach((c, slot) => {
        const serial = tick - slot + 99;
        const [name, spot] = names[((serial % 3) + 3) % 3];
        c.name.textContent = name;
        c.spot.textContent = spot;
        // Slot 0 is new, slot 1 gets picked up, slot 2 finishes.
        const stage2 = slot === 0 ? 0 : slot === 1 ? step : slot === 2 ? 1 + step : 2;
        const tone = stage2 >= 2 ? 'done' : stage2 >= 1 ? 'progress' : 'todo';
        c.status.className = `pill ${tone}`;
        c.status.textContent = tone === 'done' ? s.statuses.done : tone === 'progress' ? s.statuses.progress : s.statuses.pending;
        c.who.style.opacity = stage2 >= 1 ? '1' : '0';
        const y = 96 + (slot - 1 + move) * 86;
        const enter = slot === 0 ? move : 1;
        const leave = slot === slots.length - 1 ? move : 0;
        const depth = clamp((slot - 1 + move) / 3);
        set(c.card, { o: enter * (1 - leave) * (1 - depth * 0.4), y, s: 1 - depth * 0.05, origin: 'center top' });
      });
      const active = step ? 1 : 0;
      legendItems.forEach((row, i) => { row.style.color = i === active + (phase > 0.55 ? 0 : 0) ? 'var(--ink)' : 'var(--ink-3)'; row.style.fontWeight = i === active ? '600' : '400'; });
    };
  },
};
