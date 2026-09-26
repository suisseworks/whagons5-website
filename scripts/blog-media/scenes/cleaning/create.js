// FIG: "Create Cleaning" with several spots makes one task per room.
import { avatar, box, button, caption, center, cursor, el, loopVeil, pop, rise, seg, set, type, ease } from '../../lib/kit.js';
import { roomCard } from '../../lib/rooms.js';

export default {
  size: [800, 450],
  duration: 15000,
  poster: 11400,
  strings: {
    es: {
      title: 'Crear limpieza',
      board: 'Gestión de Limpieza',
      spots: 'Ubicaciones',
      pick: 'Seleccione lugares...',
      picked: (n) => `${n} lugares seleccionados`,
      rooms: ['Hab 201', 'Hab 202', 'Hab 203', 'Hab 204'],
      taskLabel: 'Tarea de Limpieza',
      taskValue: 'Limpieza de salida',
      priority: 'Prioridad',
      priorityValue: 'Alta',
      assign: 'Asignar a',
      assignee: 'Ana Morales',
      due: 'Fecha de Vencimiento',
      dueValue: 'hoy · 14:00',
      create: 'Crear',
      toast: '3 tareas creadas exitosamente',
      labels: { dirty: 'Sucia', cleaning: 'En limpieza', clean: 'Limpia', inspected: 'Inspeccionada' },
      ago: 'ayer',
      steps: [
        'Elige las habitaciones que necesitan limpieza',
        'Define la tarea, la prioridad y quién la hace',
        'Whagons crea una tarea por habitación',
      ],
    },
    en: {
      title: 'Create Cleaning',
      board: 'Cleaning Management',
      spots: 'Spots',
      pick: 'Select spots...',
      picked: (n) => `${n} spots selected`,
      rooms: ['Rm 201', 'Rm 202', 'Rm 203', 'Rm 204'],
      taskLabel: 'Cleaning Task',
      taskValue: 'Checkout cleaning',
      priority: 'Priority',
      priorityValue: 'High',
      assign: 'Assign to',
      assignee: 'Ana Morales',
      due: 'Due Date',
      dueValue: 'today · 2:00 PM',
      create: 'Create',
      toast: '3 tasks created successfully',
      labels: { dirty: 'Dirty', cleaning: 'Cleaning', clean: 'Clean', inspected: 'Inspected' },
      ago: 'yesterday',
      steps: [
        'Pick the rooms that need cleaning',
        'Set the task, the priority and who does it',
        'Whagons creates one task per room',
      ],
    },
  },

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    const dlg = box(stage, 'win dlg', 28, 26, 330, 350);
    const hd = el('div', 'win-hd', dlg);
    el('span', 'ico', hd, '✦');
    el('span', 'dlg-title', hd, s.title);
    const bd = el('div', 'win-bd', dlg);
    bd.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr);gap:11px;padding:14px 16px';
    const field = (label) => {
      const node = el('div', 'field', bd);
      el('span', '', node, label);
      return el('div', 'input', node);
    };
    const spotsInput = field(s.spots);
    const spotsText = el('span', 'muted', spotsInput, s.pick);
    const taskInput = field(s.taskLabel);
    const taskText = el('span', '', taskInput, '');
    const row = el('div', '', bd);
    row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px';
    const pf = el('div', 'field', row);
    el('span', '', pf, s.priority);
    const prioInput = el('div', 'input', pf);
    const prio = el('span', 'prio high', prioInput, s.priorityValue);
    const df = el('div', 'field', row);
    el('span', '', df, s.due);
    const dueInput = el('div', 'input', df);
    const dueText = el('span', '', dueInput, '');
    const assignInput = field(s.assign);
    const who = el('span', '', assignInput);
    who.style.cssText = 'display:flex;align-items:center;gap:7px';
    avatar(who, 'AM', 'a').style.cssText = 'width:18px;height:18px;font-size:8px';
    el('span', '', who, s.assignee);
    const foot = el('div', '', bd);
    foot.style.cssText = 'display:flex;justify-content:flex-end;padding-top:4px';
    const create = button(foot, s.create, 'primary');

    // Spot picker dropdown.
    const menu = box(stage, 'win dlg', 44, 118, 298, 158);
    menu.style.padding = '6px';
    const options = s.rooms.map((room) => {
      const item = el('div', '', menu);
      item.style.cssText = 'display:flex;align-items:center;gap:9px;height:35px;padding:0 9px;border-radius:7px;font-size:12px;font-weight:500';
      const check = el('span', 'check', item, '✓');
      el('span', '', item, room);
      return { item, check };
    });

    // Rooms board (right).
    const board = box(stage, 'win', 384, 26, 388, 350);
    board.style.background = 'linear-gradient(180deg,#fbfaf7,#f4f1ea)';
    const bhd = el('div', 'win-hd', board);
    el('span', 'ico', bhd, '✦');
    el('span', '', bhd, s.board);
    const cards = s.rooms.map((name, i) => roomCard(board, { x: 14 + (i % 2) * 184, y: 54 + Math.floor(i / 2) * 142, w: 174, h: 128, name, labels: s.labels }));
    const toast = box(stage, '', 520, 330, 240, 34);
    toast.style.cssText += ';display:flex;align-items:center;gap:8px;padding:0 12px;border-radius:9px;background:var(--ink);color:#fff;font-size:12px;font-weight:500;box-shadow:0 10px 30px rgba(22,21,19,.25)';
    el('span', '', toast, '✓').style.color = '#4ade80';
    el('span', '', toast, s.toast);

    const picks = [2100, 2600, 3100];
    const openAt = 1300;
    const closeAt = 3700;
    const createAt = 8200;
    const chosen = [0, 1, 3];
    const at = (node, dx = 0, dy = 0) => center(stage, node, dx, dy);
    const pointer = cursor(stage, [
      { at: 400, x: 190, y: 430 },
      { at: openAt, ...at(spotsInput, 40, 0), click: true },
      { at: picks[0], ...at(options[0].check), click: true },
      { at: picks[1], ...at(options[1].check), click: true },
      { at: picks[2], ...at(options[3].check), click: true },
      { at: closeAt, x: 250, y: 60, click: true },
      { at: 4700, ...at(taskInput, 30, 0), click: true },
      { at: 6900, ...at(assignInput, 60, 0) },
      { at: createAt, ...at(create), click: true },
      { at: 9300, x: 360, y: 430, hide: 9200 },
    ]);
    const steps = caption(stage, [
      { at: 400, text: s.steps[0] },
      { at: 4300, text: s.steps[1] },
      { at: 8500, text: s.steps[2], until: 14300 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(dlg, seg(t, 150, 700));
      rise(board, seg(t, 350, 700));
      const open = t >= openAt && t < closeAt + 120;
      const m = open ? seg(t, openAt, 220) : 0;
      set(menu, { o: m, y: (1 - m) * -6 });
      spotsInput.classList.toggle('focus', open);
      const n = picks.filter((p) => t >= p).length;
      options.forEach(({ item, check }, i) => {
        const index = chosen.indexOf(i);
        const on = index >= 0 && t >= picks[index];
        check.classList.toggle('on', on);
        item.style.background = on ? 'var(--paper-2)' : 'transparent';
      });
      spotsText.textContent = n === 0 ? s.pick : s.picked(n);
      spotsText.className = n === 0 ? 'muted' : '';
      type(taskText, s.taskValue, seg(t, 4900, 700, ease.linear));
      taskInput.classList.toggle('focus', t > 4700 && t < 5800);
      set(prio, { o: seg(t, 5900, 300) });
      type(dueText, s.dueValue, seg(t, 6300, 500, ease.linear));
      set(who, { o: seg(t, 7000, 300) });
      create.classList.toggle('press', pointer.pressed(t, createAt));
      const done = seg(t, createAt + 250, 500);
      set(dlg, { o: seg(t, 150, 700) * (1 - done * 0.4) });

      cards.forEach((update, i) => {
        const index = chosen.indexOf(i);
        const selected = index >= 0 && t >= picks[index] && t < createAt + 300;
        const created = index >= 0 && t >= createAt + 450 + index * 180;
        const card = update({ t, state: 'dirty', last: s.ago, who: 'Luis', tone: 'b', tasks: created ? 1 : 0, selected });
        const badge = card.querySelector('.r-badge');
        if (created) pop(badge, seg(t, createAt + 450 + index * 180, 380));
      });
      const toastP = seg(t, createAt + 900, 400, ease.outBack);
      const toastOut = seg(t, createAt + 4200, 400);
      set(toast, { o: toastP * (1 - toastOut), y: (1 - toastP) * 12 });
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
