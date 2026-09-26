// FIG: changing the cleaning task's status moves the room through the
// cleaning statuses you mapped; finishing it stamps time and person.
import { avatar, box, caption, center, cursor, el, loopVeil, pill, rise, seg, set, setPill } from '../../lib/kit.js';
import { roomCard } from '../../lib/rooms.js';

export default {
  size: [800, 450],
  duration: 15000,
  poster: 11600,
  strings: {
    es: {
      task: 'Limpieza de salida',
      taskId: 'Tarea #2481',
      spot: 'Hab 204',
      assignee: 'Ana Morales',
      statusLabel: 'Estado',
      statuses: ['por hacer', 'en progreso', 'completado'],
      mapping: 'Mapeo de estados',
      mapHead: ['Tarea', 'Habitación'],
      labels: { dirty: 'Sucia', cleaning: 'En limpieza', clean: 'Limpia', inspected: 'Inspeccionada' },
      room: 'Hab 204',
      type: 'Habitación doble',
      ago: 'ayer',
      now: 'ahora',
      last: 'Última limpieza',
      steps: [
        'Tu equipo cambia el estado de la tarea',
        'La habitación sigue el mapeo que configuraste',
        'Al completarla queda limpia, con hora y responsable',
      ],
    },
    en: {
      task: 'Checkout cleaning',
      taskId: 'Task #2481',
      spot: 'Rm 204',
      assignee: 'Ana Morales',
      statusLabel: 'Status',
      statuses: ['to do', 'in progress', 'completed'],
      mapping: 'Status mapping',
      mapHead: ['Task', 'Room'],
      labels: { dirty: 'Dirty', cleaning: 'Cleaning', clean: 'Clean', inspected: 'Inspected' },
      room: 'Rm 204',
      type: 'Double room',
      ago: 'yesterday',
      now: 'just now',
      last: 'Last cleaned',
      steps: [
        'Your team changes the task status',
        'The room follows the mapping you set up',
        'Once completed it is clean, with time and person',
      ],
    },
  },

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    const tones = ['todo', 'progress', 'done'];

    // Task panel (left).
    const task = box(stage, 'win', 28, 40, 246, 250);
    const thd = el('div', 'win-hd', task);
    el('span', 'ico', thd, '✓');
    el('span', 'mono', thd, s.taskId).style.cssText = 'font-size:11px;font-weight:500;color:var(--ink-3)';
    const tbd = el('div', 'win-bd', task);
    tbd.style.cssText = 'display:grid;gap:12px;padding:16px';
    el('div', '', tbd, s.task).style.cssText = 'font-size:16px;font-weight:600;letter-spacing:-.01em';
    const meta = el('div', '', tbd);
    meta.style.cssText = 'display:grid;gap:8px;font-size:12px;color:var(--ink-2)';
    const spotRow = el('div', '', meta);
    spotRow.style.cssText = 'display:flex;align-items:center;gap:8px';
    el('span', 'lbl ink', spotRow, '⌂').style.cssText = 'color:var(--ink-3);font-size:12px';
    el('span', '', spotRow, s.spot);
    const who = el('div', '', meta);
    who.style.cssText = 'display:flex;align-items:center;gap:8px';
    avatar(who, 'AM', 'a');
    el('span', '', who, s.assignee);
    const statusRow = el('div', '', tbd);
    statusRow.style.cssText = 'display:grid;gap:6px;margin-top:4px';
    el('span', '', statusRow, s.statusLabel).style.cssText = 'font-size:11px;font-weight:600;color:var(--ink-2)';
    const statusBtn = el('div', 'input', statusRow);
    statusBtn.style.cssText = 'justify-content:space-between;height:34px';
    const current = pill(statusBtn, s.statuses[0], 'todo');
    el('span', 'muted', statusBtn, '▾');

    // Status menu (appears under the status field).
    const menu = box(stage, 'win dlg', 44, 262, 214, 112);
    menu.style.padding = '6px';
    const options = s.statuses.map((label, i) => {
      const item = el('div', '', menu);
      item.style.cssText = 'display:flex;align-items:center;height:32px;padding:0 8px;border-radius:7px';
      pill(item, label, tones[i]);
      return item;
    });

    // Mapping (middle).
    const map = box(stage, 'win', 292, 90, 220, 190);
    const mhd = el('div', 'win-hd', map);
    el('span', 'ico', mhd, '⇄');
    el('span', '', mhd, s.mapping);
    const mhead = el('div', 'grid-hd', map);
    mhead.style.gridTemplateColumns = '1fr 1fr';
    s.mapHead.forEach((h) => el('span', '', mhead, h));
    const mapRows = ['dirty', 'cleaning', 'clean'].map((key, i) => {
      const row = el('div', 'trow', map);
      row.style.cssText = 'grid-template-columns:1fr 1fr;height:40px';
      pill(el('span', '', row), s.statuses[i], tones[i]).style.fontSize = '9.5px';
      const right = el('span', '', row);
      right.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600';
      el('i', '', right).style.cssText = `width:7px;height:7px;border-radius:50%;background:${['#ef4444', '#3b82f6', '#22c55e'][i]}`;
      el('span', '', right, s.labels[key]);
      return row;
    });

    // Arrows between panels.
    const arrow = (x, y) => {
      const node = box(stage, '', x, y, 22, 14);
      node.innerHTML = '<svg viewBox="0 0 22 14" width="22" height="14"><path d="M1 7h18M14 2l5 5-5 5" fill="none" stroke="#161513" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      return node;
    };
    const a1 = arrow(276, 175);
    const a2 = arrow(516, 175);

    // Room card (right).
    const roomWrap = box(stage, '', 546, 124, 226, 116);
    const room = roomCard(roomWrap, { x: 0, y: 0, w: 226, h: 116, name: s.room, type: s.type, labels: s.labels });

    // Timeline.
    const open1 = 1900;
    const pick1 = 2900;
    const open2 = 7300;
    const pick2 = 8300;
    const at = (node, dx = 0, dy = 0) => center(stage, node, dx, dy);
    const pointer = cursor(stage, [
      { at: 500, x: 200, y: 420 },
      { at: open1, ...at(statusBtn, 60, 0), click: true },
      { at: pick1, ...at(options[1], -40, 0), click: true },
      { at: 4200, x: 250, y: 400 },
      { at: open2, ...at(statusBtn, 60, 0), click: true },
      { at: pick2, ...at(options[2], -40, 0), click: true },
      { at: 9400, x: 300, y: 430, hide: 9300 },
    ]);
    const steps = caption(stage, [
      { at: 400, text: s.steps[0] },
      { at: 3300, text: s.steps[1] },
      { at: 8700, text: s.steps[2], until: 14300 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(task, seg(t, 150, 700));
      rise(map, seg(t, 350, 700));
      rise(roomWrap, seg(t, 550, 700));
      set(a1, { o: seg(t, 900, 500) });
      set(a2, { o: seg(t, 1000, 500) });

      const stage1 = t >= pick1 ? 1 : 0;
      const stage2 = t >= pick2 ? 2 : stage1;
      setPill(current, s.statuses[stage2], tones[stage2]);
      const menuOpen = (t >= open1 && t < pick1 + 150) || (t >= open2 && t < pick2 + 150);
      const menuP = menuOpen ? seg(t, t >= open2 ? open2 : open1, 200) : 0;
      set(menu, { o: menuP, y: (1 - menuP) * -6 });
      options.forEach((item, i) => {
        const hover = (t >= pick1 - 350 && t < pick1 + 150 && i === 1) || (t >= pick2 - 350 && t < pick2 + 150 && i === 2);
        item.style.background = hover ? 'var(--paper-3)' : 'transparent';
      });
      statusBtn.classList.toggle('focus', menuOpen);

      // Mapping highlight follows the task status.
      mapRows.forEach((row, i) => {
        const active = i === stage2 && t > 1200;
        row.style.background = active ? '#fffaf0' : '#fff';
        row.style.boxShadow = active ? 'inset 3px 0 0 var(--red)' : 'none';
      });

      const state = stage2 === 0 ? 'dirty' : stage2 === 1 ? 'cleaning' : 'clean';
      const since = stage2 === 1 ? pick1 + 250 : stage2 === 2 ? pick2 + 250 : 0;
      const card = room({
        t,
        state: t < since ? (stage2 === 2 ? 'cleaning' : 'dirty') : state,
        since,
        who: stage2 === 2 && t >= since ? 'Ana' : 'Luis',
        tone: stage2 === 2 && t >= since ? 'a' : 'b',
        last: `${s.last}: ${stage2 === 2 && t >= since ? s.now : s.ago}`,
        tasks: stage2 < 2 ? 1 : 0,
      });
      card.style.opacity = '1';
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
