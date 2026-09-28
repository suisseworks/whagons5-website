// FIG: one schedule inside a work plan becomes one task per spot, and it
// repeats on the chosen days.
import {
  avatar, box, button, caption, center, chip, cursor, ease, el, loopVeil, pill, rise, seg, set, setPill, setToggle, toggle, type,
} from '../../lib/kit.js';

export default {
  size: [800, 450],
  duration: 17000,
  poster: 10400,
  strings: {
    es: {
      dialog: 'Nueva programación',
      name: 'Nombre',
      taskName: 'Revisión de habitación',
      repeat: 'Repetir Tarea',
      every: 'Cada',
      week: 'semana',
      days: 'Los días',
      dayLabels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      starts: 'Comienza el',
      startValue: 'lun 5 oct · 07:00',
      spots: 'Spots',
      rooms: ['Hab 101', 'Hab 102', 'Hab 103', 'Hab 104'],
      save: 'Guardar',
      grid: 'Mantenimiento · Tareas',
      cols: ['Tarea', 'Ubicación', 'Estado'],
      todo: 'por hacer',
      done: 'completado',
      clock: ['Lun 07:00', 'Mié 07:00'],
      steps: [
        'Crea la programación dentro del plan',
        'Marca los spots y cada uno recibe su tarea',
        'A la hora programada, las tareas aparecen solas',
        'Y se repite cada lunes, miércoles y viernes',
      ],
    },
    en: {
      dialog: 'New schedule',
      name: 'Name',
      taskName: 'Room check',
      repeat: 'Repeat Task',
      every: 'Every',
      week: 'week',
      days: 'On days',
      dayLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      starts: 'Starts on',
      startValue: 'Mon Oct 5 · 7:00 AM',
      spots: 'Spots',
      rooms: ['Rm 101', 'Rm 102', 'Rm 103', 'Rm 104'],
      save: 'Save',
      grid: 'Maintenance · Tasks',
      cols: ['Task', 'Spot', 'Status'],
      todo: 'to do',
      done: 'completed',
      clock: ['Mon 7:00 AM', 'Wed 7:00 AM'],
      steps: [
        'Create the schedule inside the plan',
        'Select the spots and each one gets its own task',
        'At the scheduled time, the tasks appear on their own',
        'And it repeats every Monday, Wednesday and Friday',
      ],
    },
  },

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');

    // ── Schedule dialog (left) ───────────────────────────
    const dlg = box(stage, 'win dlg', 28, 28, 344, 342);
    const hd = el('div', 'win-hd', dlg);
    el('span', 'ico', hd, '↻');
    el('span', 'dlg-title', hd, s.dialog);
    el('span', 'sp', hd);
    const save = button(hd, s.save, 'primary');
    save.style.height = '26px';
    const bd = el('div', 'win-bd', dlg);
    bd.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr);gap:11px;padding:14px 16px';

    const nameField = el('label', 'field', bd);
    el('span', '', nameField, s.name);
    const nameInput = el('div', 'input', nameField);

    const repeatRow = el('div', '', bd);
    repeatRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border:1px solid var(--line);border-radius:9px;background:var(--paper-2)';
    el('span', '', repeatRow, s.repeat).style.cssText = 'font-size:12px;font-weight:600';
    const sw = toggle(repeatRow);

    const recurrence = el('div', '', bd);
    recurrence.style.cssText = 'display:grid;gap:8px';
    const row = (label) => {
      const node = el('div', '', recurrence);
      node.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ink-2)';
      el('span', '', node, label).style.cssText = 'width:76px;flex-shrink:0;font-weight:600';
      return node;
    };
    const everyRow = row(s.every);
    el('span', 'input', everyRow, '1').style.cssText = 'width:34px;justify-content:center';
    el('span', 'input', everyRow, `${s.week} ▾`).style.cssText = 'width:100px';
    const daysRow = row(s.days);
    const days = s.dayLabels.map((d) => el('span', 'day', daysRow, d));
    days.forEach((d) => { d.style.width = '27px'; });
    const startRow = row(s.starts);
    el('span', 'input', startRow, s.startValue).style.cssText = 'width:176px';

    const spotsField = el('div', 'field', bd);
    el('span', '', spotsField, s.spots);
    const chipsWrap = el('div', '', spotsField);
    chipsWrap.style.cssText = 'display:flex;gap:5px';
    const chips = s.rooms.map((room) => {
      const node = chip(chipsWrap, room);
      node.style.cssText = 'padding:0 8px;font-size:11px;gap:5px';
      return node;
    });

    // ── Task grid (right) ────────────────────────────────
    const grid = box(stage, 'win', 392, 28, 380, 342);
    const ghd = el('div', 'win-hd', grid);
    el('span', 'ico', ghd, '✓');
    el('span', '', ghd, s.grid);
    el('span', 'sp', ghd);
    const clock = el('span', 'mono', ghd, s.clock[0]);
    clock.style.cssText = 'font-size:10.5px;font-weight:500;color:var(--red);padding:3px 7px;border-radius:6px;background:var(--red-soft)';
    const cols = '1.55fr 0.75fr 1fr';
    const head = el('div', 'grid-hd', grid);
    head.style.gridTemplateColumns = cols;
    s.cols.forEach((c) => el('span', '', head, c));
    const list = el('div', '', grid);
    list.style.cssText = 'position:relative;height:276px;overflow:hidden';
    const tones = ['a', 'b', 'c', 'd'];
    const initials = ['AM', 'LR', 'JP', 'SV'];
    const makeRow = (room, i) => {
      const node = el('div', 'trow', list);
      node.style.cssText = `grid-template-columns:${cols};position:absolute;left:0;right:0;top:0`;
      const name = el('span', 'name', node);
      el('span', 'tico', name, '↻');
      el('span', '', name, s.taskName);
      el('span', 'spot', node, room);
      const status = el('span', '', node);
      status.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:6px';
      const p = pill(status, s.todo, 'todo');
      avatar(status, initials[i], tones[i]);
      return { node, pill: p };
    };
    const monday = s.rooms.map(makeRow);
    const wednesday = s.rooms.map(makeRow);
    const ghosts = [0, 1, 2, 3, 4].map((i) => {
      const ghost = el('div', 'trow', list);
      ghost.style.cssText = `grid-template-columns:${cols};position:absolute;left:0;right:0;top:${i * 36}px`;
      for (let k = 0; k < 3; k += 1) {
        const bar = el('span', '', ghost);
        bar.style.cssText = `height:8px;border-radius:4px;background:var(--paper-3);width:${[70, 55, 45][k]}%`;
      }
      return ghost;
    });

    // ── Choreography ─────────────────────────────────────
    const dayClicks = [3050, 3450, 3850];
    const chipClicks = [4750, 5100, 5450, 5800];
    const saveAt = 6700;
    const mondayAt = 7800;
    const doneAt = 10900;
    const wednesdayAt = 12500;
    const at = (node, dx = 0, dy = 0) => center(stage, node, dx, dy);
    const pointer = cursor(stage, [
      { at: 400, x: 250, y: 430 },
      { at: 1900, ...at(sw, -6, 0) },
      { at: 2250, ...at(sw, 2, 0), click: true },
      { at: dayClicks[0], ...at(days[0]), click: true },
      { at: dayClicks[1], ...at(days[2]), click: true },
      { at: dayClicks[2], ...at(days[4]), click: true },
      ...chips.map((node, i) => ({ at: chipClicks[i], ...at(node), click: true })),
      { at: saveAt, ...at(save), click: true },
      { at: 8000, x: 600, y: 430, hide: 7700 },
    ]);
    const steps = caption(stage, [
      { at: 350, text: s.steps[0] },
      { at: 4350, text: s.steps[1] },
      { at: 7300, text: s.steps[2] },
      { at: 11900, text: s.steps[3], until: 16300 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      const settle = seg(t, saveAt + 250, 500);
      const enter = seg(t, 150, 700);
      set(dlg, { o: enter * (1 - settle * 0.45), y: (1 - enter) * 14, s: 1 - settle * 0.02 });
      rise(grid, seg(t, 350, 700));
      type(nameInput, s.taskName, seg(t, 900, 900, ease.linear), true);
      nameInput.classList.toggle('focus', t > 800 && t < 2000);
      setToggle(sw, seg(t, 2250, 220));
      recurrence.style.opacity = String(0.35 + 0.65 * seg(t, 2300, 350));
      days.forEach((day, i) => {
        const index = [0, 2, 4].indexOf(i);
        day.classList.toggle('on', index >= 0 && t >= dayClicks[index]);
      });
      chips.forEach((node, i) => node.classList.toggle('on', t >= chipClicks[i]));
      save.classList.toggle('press', pointer.pressed(t, saveAt));

      // Clock badge: Monday run, then Wednesday run.
      const clockIn = seg(t, mondayAt - 400, 400, ease.outBack);
      const flip = seg(t, wednesdayAt - 500, 400, ease.inOut);
      clock.textContent = t < wednesdayAt - 300 ? s.clock[0] : s.clock[1];
      set(clock, { o: clockIn * (flip < 1 ? 1 - Math.sin(flip * Math.PI) * 0.6 : 1), s: 0.8 + clockIn * 0.2 });

      // Monday rows drop in, get finished, then slide down for Wednesday.
      const push = seg(t, wednesdayAt - 200, 600, ease.inOut) * 4 * 36;
      monday.forEach((r, i) => {
        const start = mondayAt + i * 260;
        const p = seg(t, start, 520, ease.outBack);
        r.node.style.display = t >= start ? 'grid' : 'none';
        const dim = seg(t, wednesdayAt, 500);
        set(r.node, { o: Math.min(1, p * 1.4) * (1 - dim * 0.45), y: i * 36 + (1 - p) * -10 + push });
        r.node.classList.toggle('hl', t >= start && t < start + 900);
        const finished = t >= doneAt + i * 220;
        setPill(r.pill, finished ? s.done : s.todo, finished ? 'done' : 'todo');
      });
      wednesday.forEach((r, i) => {
        const start = wednesdayAt + 250 + i * 260;
        const p = seg(t, start, 520, ease.outBack);
        r.node.style.display = t >= start ? 'grid' : 'none';
        set(r.node, { o: Math.min(1, p * 1.4), y: i * 36 + (1 - p) * -10 });
        r.node.classList.toggle('hl', t >= start && t < start + 900);
      });
      ghosts.forEach((ghost, i) => {
        ghost.style.display = t < mondayAt + i * 260 ? 'grid' : 'none';
      });
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
