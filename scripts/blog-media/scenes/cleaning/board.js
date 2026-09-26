// FIG: the Cleaning Management board during a shift. Rooms move from dirty
// to cleaning to clean, the status counts follow and daily progress climbs.
import { box, caption, count, el, loopVeil, rise, seg, set } from '../../lib/kit.js';
import { roomCard, STATUS } from '../../lib/rooms.js';

// [start state, cleaning at, clean at] per room; null = no change.
const PLAN = [
  ['clean', null, null], ['dirty', 1800, 5200], ['dirty', 2600, 7400], ['cleaning', null, 3800],
  ['dirty', 6200, 10200], ['clean', null, null], ['dirty', 3400, 8600], ['dirty', null, null],
  ['cleaning', null, 6400], ['dirty', 7800, 11400], ['clean', null, null], ['dirty', null, null],
];
const WHO = [['Ana', 'a'], ['Luis', 'b'], ['Julia', 'c'], ['Sofía', 'd']];

export default {
  size: [800, 450],
  duration: 15000,
  poster: 11900,
  strings: {
    es: {
      title: 'Gestión de Limpieza',
      tabs: ['Panel', 'Reportes y Análisis'],
      progress: 'Progreso del día',
      labels: { dirty: 'Sucia', cleaning: 'En limpieza', clean: 'Limpia', inspected: 'Inspeccionada' },
      rooms: ['Hab 101', 'Hab 102', 'Hab 103', 'Hab 104', 'Hab 105', 'Hab 106', 'Hab 201', 'Hab 202', 'Hab 203', 'Hab 204', 'Hab 205', 'Hab 206'],
      ago: ['hace 1 h', 'ayer', 'ayer', 'hace 3 h', 'ayer', 'hace 40 min', 'ayer', 'ayer', 'hace 2 h', 'ayer', 'hace 25 min', 'ayer'],
      now: 'ahora',
      view: 'Vista tarjetas',
      steps: [
        'Cada habitación muestra su estado de limpieza',
        'El progreso del día sube con cada habitación limpia',
        'Y ves quién limpió cada una y hace cuánto',
      ],
    },
    en: {
      title: 'Cleaning Management',
      tabs: ['Dashboard', 'Reports & Analysis'],
      progress: 'Daily progress',
      labels: { dirty: 'Dirty', cleaning: 'Cleaning', clean: 'Clean', inspected: 'Inspected' },
      rooms: ['Rm 101', 'Rm 102', 'Rm 103', 'Rm 104', 'Rm 105', 'Rm 106', 'Rm 201', 'Rm 202', 'Rm 203', 'Rm 204', 'Rm 205', 'Rm 206'],
      ago: ['1 h ago', 'yesterday', 'yesterday', '3 h ago', 'yesterday', '40 min ago', 'yesterday', 'yesterday', '2 h ago', 'yesterday', '25 min ago', 'yesterday'],
      now: 'just now',
      view: 'Card view',
      steps: [
        'Every room shows its cleaning status',
        'Daily progress climbs with every clean room',
        'And you see who cleaned each one, and when',
      ],
    },
  },

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    const w = box(stage, 'win', 24, 20, 752, 362);
    w.style.background = 'linear-gradient(180deg,#fbfaf7,#f4f1ea)';
    const hd = el('div', 'win-hd', w);
    el('span', 'ico', hd, '✦');
    el('span', '', hd, s.title);
    el('span', 'sp', hd);
    el('span', 'btn', hd, s.view).style.height = '24px';
    const tabs = el('div', 'tabs', w);
    s.tabs.forEach((label, i) => el('span', i === 0 ? 'on' : '', tabs, label));

    // Stats: daily progress + one card per status.
    const stats = el('div', '', w);
    stats.style.cssText = 'position:absolute;left:14px;right:14px;top:84px;display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:10px';
    const glass = 'padding:9px 12px;border-radius:14px;background:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.6);box-shadow:0 4px 18px rgba(60,44,22,.07)';
    const prog = el('div', '', stats);
    prog.style.cssText = glass;
    el('div', 'lbl ink', prog, s.progress).style.cssText = 'font-size:9px;color:var(--ink-3)';
    const progRow = el('div', '', prog);
    progRow.style.cssText = 'display:flex;align-items:baseline;gap:8px;margin-top:3px';
    const pct = el('span', '', progRow, '0%');
    pct.style.cssText = 'font-size:22px;font-weight:600;letter-spacing:-.02em';
    const frac = el('span', 'muted', progRow, '');
    frac.style.fontSize = '10.5px';
    const bar = el('div', 'bar', prog);
    bar.style.marginTop = '6px';
    const barFill = el('i', '', bar);
    const statusCards = ['dirty', 'cleaning', 'clean'].map((key) => {
      const card = el('div', '', stats);
      card.style.cssText = `${glass};border-left:3px solid ${STATUS[key].color}`;
      const top = el('div', '', card);
      top.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;color:var(--ink-2)';
      el('i', '', top).style.cssText = `width:7px;height:7px;border-radius:50%;background:${STATUS[key].color}`;
      el('span', '', top, s.labels[key]);
      const value = el('div', '', card, '0');
      value.style.cssText = 'margin-top:4px;font-size:20px;font-weight:600;letter-spacing:-.02em';
      return { key, value };
    });

    // Room grid, 6 × 2.
    const cols = 6;
    const cw = 113;
    const ch = 92;
    const gx = 9;
    const updates = s.rooms.map((name, i) => roomCard(w, {
      x: 14 + (i % cols) * (cw + gx),
      y: 160 + Math.floor(i / cols) * (ch + 10),
      w: cw,
      h: ch,
      name,
      labels: s.labels,
    }));

    const steps = caption(stage, [
      { at: 400, text: s.steps[0] },
      { at: 5000, text: s.steps[1] },
      { at: 9600, text: s.steps[2], until: 14300 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(w, seg(t, 150, 700));
      const counts = { dirty: 0, cleaning: 0, clean: 0 };
      PLAN.forEach(([start, cleaningAt, cleanAt], i) => {
        let state = start;
        let since = 0;
        if (cleaningAt != null && t >= cleaningAt) { state = 'cleaning'; since = cleaningAt; }
        if (cleanAt != null && t >= cleanAt) { state = 'clean'; since = cleanAt; }
        counts[state] += 1;
        const [who, tone] = WHO[i % WHO.length];
        const justCleaned = cleanAt != null && t >= cleanAt;
        updates[i]({
          t,
          state,
          since,
          who: start === 'clean' || justCleaned || state === 'cleaning' ? who : (s.ago[i] === 'ayer' || s.ago[i] === 'yesterday' ? WHO[(i + 1) % 4][0] : who),
          tone,
          last: justCleaned ? s.now : s.ago[i],
          tasks: state === 'cleaning' ? 1 : 0,
        });
      });
      const total = PLAN.length;
      const value = Math.round((counts.clean / total) * 100);
      pct.textContent = `${value}%`;
      pct.style.color = value === 100 ? '#22c55e' : value > 50 ? '#f97316' : '#3b82f6';
      frac.textContent = `${counts.clean}/${total}`;
      barFill.style.width = `${value}%`;
      barFill.style.background = pct.style.color;
      statusCards.forEach(({ key, value: node }) => { node.textContent = String(counts[key]); });
      steps(t);
      veil(t);
    };
  },
};
