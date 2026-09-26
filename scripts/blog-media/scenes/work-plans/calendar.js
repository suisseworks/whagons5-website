// FIG: the plan's calendar fills in as the week runs. Completed cells turn
// green, a missed one turns into a red "late" triangle, percentages follow.
import { box, caption, count, el, loopVeil, rise, seg, set } from '../../lib/kit.js';

// Which days each row is scheduled on (0 = Monday) and which one gets missed.
const ROWS = [
  { days: [0, 2, 4], miss: -1 },
  { days: [0, 2, 4], miss: -1 },
  { days: [0, 2, 4], miss: 2 },
  { days: [1, 3], miss: -1 },
  { days: [0, 1, 2, 3, 4], miss: -1 },
];

export default {
  size: [800, 450],
  duration: 15000,
  poster: 11800,
  strings: {
    es: {
      plan: 'Ronda preventiva',
      tabs: ['Programación', 'Calendario', 'Ejecuciones'],
      today: 'Hoy',
      view: 'Semana ▾',
      week: ['L 5', 'M 6', 'M 7', 'J 8', 'V 9', 'S 10', 'D 11'],
      rows: [
        ['Revisión de habitación', 'Hab 101'],
        ['Revisión de habitación', 'Hab 102'],
        ['Revisión de habitación', 'Hab 103'],
        ['Prueba de planta eléctrica', 'Cuarto de máquinas'],
        ['Cloro y pH de piscina', 'Piscina'],
      ],
      legend: ['Completada', 'Atrasada', 'Programada'],
      total: 'Total',
      steps: [
        'Cada programación es una fila; cada día, una columna',
        'Verde, completada. Triángulo rojo, atrasada',
        'El porcentaje muestra cuánto del plan se cumplió',
      ],
    },
    en: {
      plan: 'Preventive round',
      tabs: ['Scheduling', 'Calendar', 'Runs'],
      today: 'Today',
      view: 'Week ▾',
      week: ['M 5', 'T 6', 'W 7', 'T 8', 'F 9', 'S 10', 'S 11'],
      rows: [
        ['Room check', 'Rm 101'],
        ['Room check', 'Rm 102'],
        ['Room check', 'Rm 103'],
        ['Generator test', 'Plant room'],
        ['Pool chlorine and pH', 'Pool'],
      ],
      legend: ['Completed', 'Late', 'Scheduled'],
      total: 'Total',
      steps: [
        'Each schedule is a row; each day, a column',
        'Green means completed. A red triangle means late',
        'The percentage shows how much of the plan got done',
      ],
    },
  },

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    const winW = 740;
    const w = box(stage, 'win', 30, 24, winW, 358);
    const hd = el('div', 'win-hd', w);
    el('span', 'ico', hd, '▦');
    el('span', '', hd, s.plan);
    const tabs = el('div', 'tabs', w);
    s.tabs.forEach((label, i) => el('span', i === 1 ? 'on' : '', tabs, label));

    // Toolbar: today, view mode, overall progress.
    const bar = el('div', '', w);
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-bottom:1px solid var(--line)';
    el('span', 'btn', bar, '‹').style.cssText = 'width:26px;padding:0;height:26px';
    el('span', 'btn', bar, s.today).style.height = '26px';
    el('span', 'btn', bar, '›').style.cssText = 'width:26px;padding:0;height:26px';
    el('span', 'btn', bar, s.view).style.height = '26px';
    const prog = el('span', 'bar', bar);
    prog.style.cssText = 'flex:1;margin-left:10px;height:6px';
    const progFill = el('i', '', prog);
    const pct = el('span', 'mono', bar, '0%');
    pct.style.cssText = 'width:38px;text-align:right;font-size:11px;font-weight:600;color:var(--ink-2)';

    // Grid
    const cols = `210px repeat(7, 1fr) 54px`;
    const head = el('div', 'grid-hd', w);
    head.style.gridTemplateColumns = cols;
    el('span', '', head, '');
    const dayHeads = s.week.map((d) => {
      const node = el('span', '', head, d);
      node.style.cssText = 'text-align:center;border-radius:5px;padding:3px 0';
      return node;
    });
    el('span', '', head, '%').style.textAlign = 'right';

    const rowEls = s.rows.map(([task, spot], r) => {
      const node = el('div', 'trow', w);
      node.style.cssText = `grid-template-columns:${cols};height:36px`;
      const name = el('span', 'name', node);
      el('span', 'tico', name, '↻');
      const label = el('span', '', name);
      label.style.cssText = 'display:grid;line-height:1.2;min-width:0';
      el('span', '', label, task).style.cssText = 'overflow:hidden;text-overflow:ellipsis';
      el('span', 'spot', label, spot).style.fontWeight = '400';
      const cells = s.week.map((_, d) => {
        const cell = el('span', '', node);
        cell.style.cssText = 'display:grid;place-items:center;height:100%';
        if (!ROWS[r].days.includes(d)) return null;
        const mark = el('span', '', cell);
        return mark;
      });
      const value = el('span', 'mono', node, '0%');
      value.style.cssText = 'text-align:right;font-size:11px;font-weight:600';
      return { node, cells, value };
    });

    const foot = el('div', 'grid-hd', w);
    foot.style.cssText = `grid-template-columns:${cols};height:34px;border-top:1px solid var(--line);border-bottom:0`;
    el('span', '', foot, `${s.total} (${s.rows.length})`);
    const dayTotals = s.week.map(() => {
      const node = el('span', '', foot, '');
      node.style.textAlign = 'center';
      return node;
    });
    el('span', '', foot, '');

    // Legend in the window header.
    el('span', 'sp', hd);
    const legend = el('div', '', hd);
    legend.style.cssText = 'display:flex;gap:16px;align-items:center;font-size:11px;font-weight:500;color:var(--ink-2)';
    const legendMarks = [];
    s.legend.forEach((label, i) => {
      const item = el('span', '', legend);
      item.style.cssText = 'display:flex;align-items:center;gap:7px';
      const mark = el('span', '', item);
      legendMarks.push(mark);
      el('span', '', item, label);
    });

    const markStyle = (node, state) => {
      if (!node) return;
      if (state === 'late') {
        node.style.cssText = 'width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:11px solid #e11d48;border-radius:0;background:none';
      } else if (state === 'done') {
        node.style.cssText = 'width:12px;height:12px;border-radius:50%;background:#10b981';
      } else {
        node.style.cssText = 'width:12px;height:12px;border-radius:50%;border:1.5px solid rgba(22,21,19,.35);background:#fff';
      }
    };
    markStyle(legendMarks[0], 'done');
    markStyle(legendMarks[1], 'late');
    markStyle(legendMarks[2], 'sched');

    const steps = caption(stage, [
      { at: 400, text: s.steps[0] },
      { at: 5600, text: s.steps[1] },
      { at: 9800, text: s.steps[2], until: 14300 },
    ]);
    const veil = loopVeil(stage, duration);
    const dayLen = 1500;
    const weekStart = 1600;

    return (t) => {
      rise(w, seg(t, 150, 700));
      // "Today" moves one column every dayLen ms, Monday to Friday.
      const today = Math.min(4, Math.floor(Math.max(0, t - weekStart) / dayLen));
      const dayProgress = t < weekStart ? -1 : today;
      dayHeads.forEach((node, d) => {
        const on = d === dayProgress;
        node.style.background = on ? 'rgba(14,165,233,.15)' : 'transparent';
        node.style.color = on ? '#0284c7' : '';
      });

      let done = 0;
      let total = 0;
      rowEls.forEach((row, r) => {
        let rowDone = 0;
        let rowTotal = 0;
        row.cells.forEach((mark, d) => {
          if (!mark) return;
          rowTotal += 1;
          // A day resolves shortly after "today" passes over it.
          const resolveAt = weekStart + d * dayLen + 500 + r * 120;
          const passed = t >= resolveAt;
          const missed = ROWS[r].miss === d;
          const lateAt = weekStart + (d + 1) * dayLen + 200;
          let state = 'sched';
          if (passed && !missed) state = 'done';
          if (missed && t >= lateAt) state = 'late';
          markStyle(mark, state);
          const pulse = passed && !missed ? 1 - seg(t, resolveAt, 400) : 0;
          const latePulse = missed && t >= lateAt ? 1 - seg(t, lateAt, 500) : 0;
          set(mark, { s: 1 + pulse * 0.45 + latePulse * 0.5 });
          if (state === 'done') rowDone += 1;
        });
        done += rowDone;
        total += rowTotal;
        const target = Math.round((rowDone / rowTotal) * 100);
        row.value.textContent = `${target}%`;
        row.value.style.color = ROWS[r].miss >= 0 && t >= weekStart + (ROWS[r].miss + 1) * dayLen + 200 ? '#e11d48' : target === 100 ? '#059669' : 'var(--ink-2)';
      });
      const overall = total ? done / total : 0;
      progFill.style.width = `${overall * 100}%`;
      count(pct, 0, Math.round(overall * 100), 1, (v) => `${v}%`);

      dayTotals.forEach((node, d) => {
        let n = 0;
        rowEls.forEach((row, r) => {
          if (!row.cells[d]) return;
          if (t >= weekStart + d * dayLen + 500 + r * 120 && ROWS[r].miss !== d) n += 1;
        });
        node.textContent = n ? String(n) : '';
      });
      steps(t);
      veil(t);
    };
  },
};
