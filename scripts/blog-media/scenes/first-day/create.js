// FIG: Create Task opens the Create New Task panel. The name says action,
// object and place, the Spot is picked, a photo is dropped under Attachments,
// and the new task appears at the top of the space with its number.
import { box, caption, center, cursor, ease, el, loopVeil, pop, rise, seg, set, type } from '../../lib/kit.js';
import { injectTasksCss, photo, taskGrid } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

export default {
  size: [800, 450],
  duration: 15200,
  poster: 12600,
  strings: withCommon({
    en: { steps: ['Create Task opens the panel', 'Action, object and place', 'Pick the Spot, drop a photo', 'It lands in the space, with its number'] },
    es: { steps: ['Crear Tarea abre el panel', 'Acción, objeto y lugar', 'Elige el Spot y suelta una foto', 'Llega al espacio, con su número'] },
    pt: { steps: ['Criar tarefa abre o painel', 'Ação, objeto e lugar', 'Escolha o Spot e solte uma foto', 'Ela chega ao espaço, com o seu número'] },
    de: { steps: ['Create Task öffnet das Fenster', 'Tätigkeit, Objekt und Ort', 'Spot wählen, Foto ablegen', 'Sie landet im Bereich, mit Nummer'] },
  }),

  build(stage, s, { duration }) {
    injectTasksCss();
    stage.classList.add('dot-grid');
    const frame = box(stage, 'win', 22, 20, 756, 340);
    const top = el('div', 'win-hd', frame);
    el('span', 'ico', top, '✓');
    el('span', '', top, s.tasksTitle);
    el('span', 'sp', top);
    const createBtn = el('span', 'btn primary', top, `＋ ${s.createTask}`);
    createBtn.style.height = '26px';
    const cols = '52px 1.9fr 0.7fr 0.95fr 0.55fr';
    const grid = taskGrid(frame, { x: 0, y: 38, w: 756, h: 302, title: '', headers: s.cols, cols });
    grid.win.style.cssText += ';border:0;border-radius:0;box-shadow:none';
    grid.hd.remove();
    const tones = ['progress', 'todo', 'progress', 'done', 'todo'];
    const people = [['JP', 'b'], ['SV', 'c'], ['AM', 'a'], ['LR', 'd'], ['JP', 'b']];
    const rows = s.tasks.slice(1, 6).map(([name, spot], i) => grid.makeRow({
      num: `#${1046 - i}`, name, spot, tone: tones[i],
      status: tones[i] === 'progress' ? s.statuses.progress : tones[i] === 'done' ? s.statuses.done : s.statuses.pending,
      people: [people[i]],
    }));
    const fresh = grid.makeRow({ num: '#1047', name: s.newTask, spot: s.room.replace('Room', 'Rm').replace('Quarto', 'Qto').replace('Zimmer', 'Zi.'), status: s.statuses.pending, people: [] });
    const thumb = photo(fresh.nameCell, 26, 19);
    thumb.style.flexShrink = '0';
    fresh.nameCell.insertBefore(thumb, fresh.nameText);

    // Side sheet.
    const sheet = box(frame, 'sheet', 0, 0, 340);
    sheet.style.left = 'auto';
    el('div', 'sheet-hd', sheet, s.createTitle);
    const sb = el('div', 'sheet-bd', sheet);
    const f1 = el('label', 'field', sb);
    el('span', '', f1, s.name);
    const nameInput = el('div', 'input', f1);
    const f2 = el('label', 'field', sb);
    el('span', '', f2, s.spot);
    const spotInput = el('div', 'input', f2);
    const spotText = el('span', '', spotInput, s.noSpot);
    el('span', 'muted', spotInput, '▾').style.marginLeft = 'auto';
    const f3 = el('label', 'field', sb);
    el('span', '', f3, s.attachments);
    const drop = el('div', 'drop', f3);
    const dropText = el('span', '', drop, s.drop);
    dropText.style.cssText = 'padding:0 14px;text-align:center';
    const dropped = photo(drop, 64, 46);
    dropped.style.cssText += ';position:absolute';
    drop.style.position = 'relative';
    const sf = el('div', 'sheet-ft', sheet);
    el('span', 'btn', sf, s.cancel);
    const saveBtn = el('span', 'btn primary', sf, s.createTask);
    const spotMenu = box(frame, 'menu', 0, 0, 200);
    spotMenu.style.zIndex = '45';
    const spotOptions = [s.room, s.room.replace('214', '215'), s.room.replace('214', '216')].map((label) => el('div', 'mi', spotMenu, label));
    const flying = photo(stage, 92, 66);
    flying.style.cssText += ';position:absolute;left:0;top:0;z-index:70;box-shadow:0 14px 30px rgba(22,21,19,.3);border:3px solid #fff';

    // Layout-dependent anchors (sheet in its open position).
    const spotAnchor = center(stage, spotInput);
    const dropAnchor = center(stage, drop);
    const frameBox = frame.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    spotMenu.style.left = `${spotAnchor.x - (frameBox.left - stageBox.left) - 140}px`;
    spotMenu.style.top = `${spotAnchor.y - (frameBox.top - stageBox.top) + 18}px`;

    const OPEN = 1200;
    const TYPE = 2100;
    const SPOT = 4900;
    const PICK = 5900;
    const DRAG = 7000;
    const DROP = 8300;
    const SAVE = 9700;
    const LAND = 10300;
    const pointer = cursor(stage, [
      { at: 200, x: 500, y: 430 },
      { at: OPEN, ...center(stage, createBtn), click: true },
      { at: SPOT, ...spotAnchor, click: true },
      { at: PICK, ...center(stage, spotOptions[0]), click: true },
      { at: DRAG, x: 760, y: 420 },
      { at: DROP, x: dropAnchor.x + 10, y: dropAnchor.y + 4 },
      { at: SAVE, ...center(stage, saveBtn), click: true },
      { at: SAVE + 900, x: 380, y: 420, hide: SAVE + 600 },
    ]);
    const steps = caption(stage, [
      { at: 300, text: s.steps[0] },
      { at: TYPE - 100, text: s.steps[1] },
      { at: SPOT - 200, text: s.steps[2] },
      { at: LAND, text: s.steps[3], until: duration - 700 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(frame, seg(t, 80, 600));
      rows.forEach((row, i) => set(row.node, { y: (i + (t >= LAND ? seg(t, LAND, 450, ease.inOut) : 0)) * 36 }));
      createBtn.classList.toggle('press', pointer.pressed(t, OPEN));
      const open = seg(t, OPEN + 100, 520, ease.outQuart);
      const close = seg(t, SAVE + 150, 420, ease.inOut);
      sheet.style.display = t >= OPEN && close < 1 ? 'flex' : 'none';
      set(sheet, { x: (1 - open) * 340 + close * 340 });
      type(nameInput, s.newTask, seg(t, TYPE, 2200, ease.linear), true);
      nameInput.classList.toggle('focus', t >= TYPE - 200 && t < SPOT);
      spotInput.classList.toggle('focus', t >= SPOT && t < PICK + 300);
      const menuO = seg(t, SPOT + 80, 240, ease.outBack) * (1 - seg(t, PICK + 100, 200));
      spotMenu.style.display = menuO > 0.01 ? 'grid' : 'none';
      set(spotMenu, { o: menuO, y: (1 - menuO) * -6 });
      spotOptions[0].classList.toggle('hover', t >= PICK - 400);
      spotText.textContent = t >= PICK + 80 ? s.room : s.noSpot;
      spotText.style.color = t >= PICK + 80 ? 'var(--ink)' : 'var(--ink-3)';
      // The photo is dragged in from outside and dropped.
      const drag = ease.inOut(seg(t, DRAG, DROP - DRAG, (x) => x));
      const dragging = t >= DRAG && t < DROP + 200;
      flying.style.display = dragging ? 'block' : 'none';
      set(flying, { o: Math.min(1, drag * 3) * (1 - seg(t, DROP, 200)), x: 740 + (dropAnchor.x - 46 - 740) * drag, y: 420 + (dropAnchor.y - 33 - 420) * drag, r: (1 - drag) * 8, s: 1 - drag * 0.25 });
      drop.classList.toggle('hot', t >= DROP - 500 && t < DROP + 150);
      const landed = t >= DROP + 100;
      dropText.style.display = landed ? 'none' : 'block';
      dropped.style.display = landed ? 'block' : 'none';
      pop(dropped, seg(t, DROP + 100, 380));
      saveBtn.classList.toggle('press', pointer.pressed(t, SAVE));
      // The new task appears at the top.
      const p = seg(t, LAND + 150, 560, ease.outBack);
      fresh.node.style.display = t >= LAND + 150 ? 'grid' : 'none';
      set(fresh.node, { o: Math.min(1, p * 1.5), y: (1 - p) * -12 });
      fresh.node.classList.toggle('hl', t >= LAND && t < LAND + 2600);
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
