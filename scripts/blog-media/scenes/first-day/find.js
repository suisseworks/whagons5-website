// FIG: open the team's space from the sidebar, then Filters → Assignee → you →
// Apply. The grid narrows to the four tasks that are yours.
import { box, caption, center, cursor, ease, el, loopVeil, pop, rise, seg, set } from '../../lib/kit.js';
import { sidebar, taskGrid } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

const MINE = [0, 3, 4, 6];

export default {
  size: [800, 450],
  duration: 13200,
  poster: 10600,
  strings: withCommon({
    en: { steps: ["Open your team's space", 'Filters → Assignee → you', 'Your shift: only your tasks'] },
    es: { steps: ['Abre el espacio de tu equipo', 'Filtros → Asignado → tú', 'Tu turno: solo tus tareas'] },
    pt: { steps: ['Abra o espaço da sua equipe', 'Filtros → Responsável → você', 'Seu turno: só as suas tarefas'] },
    de: { steps: ['Den Bereich Ihres Teams öffnen', 'Filter → Zugewiesene Person → Sie', 'Ihre Schicht: nur Ihre Aufgaben'] },
  }),

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    const frame = box(stage, 'win', 22, 20, 756, 340);
    const side = sidebar(frame, { x: 0, y: 0, w: 168, h: 340, brand: s.brand, label: s.spacesLbl, spaces: s.spaces, everything: s.everything });
    const cols = '48px 1.75fr 0.7fr 1fr 0.55fr';
    const grid = taskGrid(frame, { x: 168, y: 0, w: 588, h: 340, title: s.tasksTitle, headers: s.cols, cols });
    grid.win.style.cssText += ';border:0;border-radius:0;box-shadow:none';
    const filterBtn = el('span', 'btn', grid.tools, `⏷ ${s.filters}`);
    filterBtn.style.height = '26px';
    const chipNode = el('span', 'chip', grid.tools);
    chipNode.style.cssText = 'height:24px;padding:0 8px;font-size:10.5px;gap:5px';
    chipNode.innerHTML = `<span class="av a" style="width:16px;height:16px;font-size:7px">AM</span>${s.you} ✕`;

    const people = [['AM', 'a'], ['JP', 'b'], ['SV', 'c'], ['LR', 'd']];
    const owners = [0, 1, 2, 0, 0, 3, 0, 2];
    const tones = ['todo', 'progress', 'todo', 'progress', 'todo', 'done', 'todo', 'progress'];
    const rows = s.tasks.map(([name, spot], i) => grid.makeRow({
      num: `#${1031 + i}`, name, spot,
      status: tones[i] === 'progress' ? s.statuses.progress : tones[i] === 'done' ? s.statuses.done : s.statuses.pending,
      tone: tones[i], people: [people[owners[i]]],
    }));

    // Filter popover.
    const popNode = box(frame, 'pop', 300, 44, 270);
    const hd = el('div', 'pop-hd', popNode, s.filters);
    hd.style.fontSize = '12.5px';
    const bd = el('div', 'pop-bd', popNode);
    el('span', 'lbl ink', bd, s.assignee).style.fontSize = '9px';
    const names = [s.you, ...s.others];
    const options = names.map((name, i) => {
      const row = el('div', 'who', bd);
      row.style.cssText += ';padding:3px 6px;border-radius:7px';
      el('span', 'check', row, '✓');
      el('span', `av ${people[i][1]}`, row, people[i][0]).style.cssText = 'width:20px;height:20px;font-size:8.5px';
      el('span', '', row, name);
      return row;
    });
    const acts = el('div', 'acts', popNode);
    acts.style.justifyContent = 'flex-end';
    const applyBtn = el('span', 'btn dark', acts, s.apply);

    const OPEN_SPACE = 1300;
    const FILTERS = 3600;
    const PICK = 5000;
    const APPLY = 6300;
    const pointer = cursor(stage, [
      { at: 200, x: 260, y: 430 },
      { at: OPEN_SPACE, ...center(stage, side.items[0], -20, 0), click: true },
      { at: FILTERS, ...center(stage, filterBtn), click: true },
      { at: PICK, ...center(stage, options[0], -30, 0), click: true },
      { at: APPLY, ...center(stage, applyBtn), click: true },
      { at: APPLY + 900, x: 640, y: 420, hide: APPLY + 600 },
    ]);
    const steps = caption(stage, [
      { at: 300, text: s.steps[0] },
      { at: FILTERS - 300, text: s.steps[1] },
      { at: APPLY + 200, text: s.steps[2], until: duration - 700 },
    ]);
    const veil = loopVeil(stage, duration);
    const checks = options.map((row) => row.querySelector('.check'));

    return (t) => {
      rise(frame, seg(t, 80, 600));
      const opened = t >= OPEN_SPACE + 100;
      side.items[0].classList.toggle('on', opened);
      side.all.classList.toggle('on', !opened);
      grid.titleNode.textContent = opened ? s.tasksTitle : s.everything;
      const filtered = t >= APPLY + 100;
      const regroup = seg(t, APPLY + 300, 520, ease.inOut);
      rows.forEach((row, i) => {
        const appear = seg(t, OPEN_SPACE + 150 + i * 70, 420);
        const mine = MINE.includes(i);
        const out = filtered && !mine ? seg(t, APPLY + 100, 320, ease.inOut) : 0;
        const target = mine ? MINE.indexOf(i) : i;
        const y = (filtered ? i * 36 + (target - i) * 36 * regroup : i * 36) + (1 - appear) * 8;
        row.node.style.display = out >= 1 || appear <= 0 ? 'none' : 'grid';
        set(row.node, { o: appear * (1 - out), y });
        row.node.classList.toggle('hl', filtered && mine && t < APPLY + 2200);
      });
      const open = seg(t, FILTERS + 60, 280, ease.outBack) * (1 - seg(t, APPLY + 80, 220));
      popNode.style.display = open > 0.01 ? 'block' : 'none';
      set(popNode, { o: open, y: (1 - open) * -6, origin: 'top left' });
      const picked = t >= PICK;
      checks[0].classList.toggle('on', picked);
      options[0].style.background = picked ? 'var(--paper-3)' : 'transparent';
      filterBtn.classList.toggle('press', pointer.pressed(t, FILTERS));
      applyBtn.classList.toggle('press', pointer.pressed(t, APPLY));
      chipNode.style.display = filtered ? 'inline-flex' : 'none';
      pop(chipNode, seg(t, APPLY + 150, 380));
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
