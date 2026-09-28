// Cover loop (4:3): six room cards cycle dirty → cleaning → clean while the
// daily progress card climbs, then a reset sets them back to dirty.
import { box, el } from '../../lib/kit.js';
import { roomCard } from '../../lib/rooms.js';

const CYCLE = 9000;

export default {
  size: [600, 450],
  duration: CYCLE,
  poster: 6200,
  strings: {
    es: {
      kicker: 'Powerup',
      name: 'Limpieza',
      progress: 'Progreso del día',
      labels: { dirty: 'Sucia', cleaning: 'En limpieza', clean: 'Limpia', inspected: 'Inspeccionada' },
      rooms: ['Hab 101', 'Hab 102', 'Hab 103', 'Hab 104', 'Hab 105', 'Hab 106'],
      now: 'ahora',
      ago: 'ayer',
    },
    en: {
      kicker: 'Powerup',
      name: 'Cleaning',
      progress: 'Daily progress',
      labels: { dirty: 'Dirty', cleaning: 'Cleaning', clean: 'Clean', inspected: 'Inspected' },
      rooms: ['Rm 101', 'Rm 102', 'Rm 103', 'Rm 104', 'Rm 105', 'Rm 106'],
      now: 'just now',
      ago: 'yesterday',
    },
  },

  build(stage, s) {
    stage.classList.add('dot-grid');
    const title = box(stage, '', 40, 38, 300, 80);
    el('div', 'lbl ink', title, s.kicker);
    el('div', 'title', title, s.name).style.cssText = 'margin-top:6px;font-size:30px';

    const prog = box(stage, '', 350, 40, 210, 70);
    prog.style.cssText += ';padding:11px 14px;border-radius:14px;background:rgba(255,255,255,.75);border:1px solid rgba(255,255,255,.6);box-shadow:0 4px 18px rgba(60,44,22,.08)';
    el('div', 'lbl ink', prog, s.progress).style.cssText = 'font-size:9px;color:var(--ink-3)';
    const row = el('div', '', prog);
    row.style.cssText = 'display:flex;align-items:baseline;gap:8px;margin-top:3px';
    const pct = el('span', '', row, '0%');
    pct.style.cssText = 'font-size:22px;font-weight:600;letter-spacing:-.02em';
    const frac = el('span', 'muted', row, '');
    frac.style.fontSize = '10.5px';
    const bar = el('div', 'bar', prog);
    bar.style.marginTop = '6px';
    const fill = el('i', '', bar);

    const cw = 166;
    const ch = 118;
    const updates = s.rooms.map((name, i) => roomCard(stage, {
      x: 40 + (i % 3) * (cw + 11), y: 138 + Math.floor(i / 3) * (ch + 12), w: cw, h: ch, name, labels: s.labels,
    }));
    const foot = box(stage, '', 40, 406, 100, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px"></span>';
    const who = [['Ana', 'a'], ['Luis', 'b'], ['Julia', 'c']];

    return (t) => {
      let clean = 0;
      updates.forEach((update, i) => {
        // Rooms get cleaned one after another, then a reset sets them back
        // to dirty for the next day, so the loop starts where it ends.
        const startCleaning = 400 + i * 800;
        const done = startCleaning + 1500;
        const reset = 7900 + i * 90;
        let state = 'dirty';
        let since = 0;
        if (t >= startCleaning) { state = 'cleaning'; since = startCleaning; }
        if (t >= done) { state = 'clean'; since = done; }
        if (t >= reset) { state = 'dirty'; since = reset; }
        if (state === 'clean') clean += 1;
        const [name, tone] = who[i % 3];
        update({ t, state, since, who: name, tone, last: state === 'clean' ? s.now : s.ago, tasks: state === 'cleaning' ? 1 : 0 });
      });
      const value = Math.round((clean / 6) * 100);
      pct.textContent = `${value}%`;
      const color = value === 100 ? '#22c55e' : value > 50 ? '#f97316' : '#3b82f6';
      pct.style.color = color;
      fill.style.width = `${value}%`;
      fill.style.background = color;
      frac.textContent = `${clean}/6`;
    };
  },
};
