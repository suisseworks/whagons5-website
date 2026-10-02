// FIG: the status is clicked and moved to In Progress (the person joins the
// assignees), a comment with a photo is left on the task, and later the task
// is moved to Completed.
import { box, caption, center, cursor, ease, el, loopVeil, pop, rise, seg, set, setPill, type } from '../../lib/kit.js';
import { photo, taskGrid } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

export default {
  size: [800, 450],
  duration: 14200,
  poster: 11600,
  strings: withCommon({
    en: { comments: 'Comments', now: 'now', comment: 'Changed the cartridge. No more drip.', steps: ['Click the status when the work starts', 'Starting adds you to the task', 'Leave the trail: a comment and a photo', 'Completed. The finished task is read-only'] },
    es: { comments: 'Comentarios', now: 'ahora', comment: 'Cambié el cartucho. Ya no gotea.', steps: ['Haz clic en el estado cuando empieza el trabajo', 'Empezar te suma a la tarea', 'Deja el rastro: un comentario y una foto', 'Completada. La tarea terminada es de solo lectura'] },
    pt: { comments: 'Comentários', now: 'agora', comment: 'Troquei o cartucho. Parou de pingar.', steps: ['Clique no status quando o trabalho começar', 'Começar inclui você na tarefa', 'Deixe o registro: um comentário e uma foto', 'Concluída. A tarefa concluída é somente leitura'] },
    de: { comments: 'Kommentare', now: 'jetzt', comment: 'Kartusche getauscht. Tropft nicht mehr.', steps: ['Status anklicken, wenn die Arbeit beginnt', 'Wer beginnt, wird zugewiesen', 'Spur hinterlassen: Kommentar und Foto', 'Erledigt. Die Aufgabe ist jetzt schreibgeschützt'] },
  }),

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    const cols = '52px 1.8fr 0.65fr 1fr 0.6fr';
    const grid = taskGrid(stage, { x: 22, y: 20, w: 756, h: 214, title: s.tasksTitle, headers: s.cols, cols });
    const tones = ['todo', 'progress', 'todo', 'done'];
    const owners = [[], [['JP', 'b']], [['SV', 'c']], [['LR', 'd']]];
    const rows = s.tasks.slice(0, 4).map(([name, spot], i) => grid.makeRow({
      num: `#${1031 + i}`, name, spot, tone: tones[i],
      status: tones[i] === 'progress' ? s.statuses.progress : tones[i] === 'done' ? s.statuses.done : s.statuses.pending,
      people: owners[i],
    }));
    rows.forEach((row, i) => set(row.node, { y: i * 36 }));
    const target = rows[0];
    const me = el('span', 'av a', target.peopleCell, 'AM');
    me.style.cssText += ';width:20px;height:20px;font-size:8.5px';

    const menu = box(stage, 'menu', 0, 0, 170);
    const options = [['pending', s.statuses.pending, 'var(--todo)'], ['progress', s.statuses.progress, 'var(--progress)'], ['inspecting', s.statuses.inspecting, 'var(--review)'], ['done', s.statuses.done, 'var(--done)']].map(([key, label, color]) => {
      const item = el('div', 'mi', menu);
      el('span', '', item).style.cssText = `width:8px;height:8px;border-radius:50%;background:${color}`;
      el('span', '', item, label);
      return { key, item };
    });

    // Comment card under the grid.
    const card = box(stage, 'card', 22, 248, 470, 108);
    card.style.cssText += ';padding:12px 14px;display:grid;gap:8px';
    el('span', 'lbl ink', card, `${s.comments} · #1031`).style.fontSize = '9px';
    const line = el('div', '', card);
    line.style.cssText = 'display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:start';
    el('span', 'av a', line, 'AM');
    const text = el('div', '', line);
    text.style.cssText = 'display:grid;gap:3px;min-width:0';
    const head = el('span', '', text);
    head.style.cssText = 'font-size:11.5px;font-weight:700';
    head.innerHTML = `${s.you} <span style="font-weight:500;color:var(--ink-3);margin-left:4px">${s.now}</span>`;
    const body = el('span', '', text);
    body.style.cssText = 'font-size:12.5px;color:var(--ink)';
    const shot = photo(line, 64, 46);

    const statusAnchor = center(stage, target.statusPill);
    menu.style.left = `${statusAnchor.x - 30}px`;
    menu.style.top = `${statusAnchor.y + 16}px`;
    const OPEN1 = 1400;
    const PICK1 = 2700;
    const COMMENT = 4900;
    const OPEN2 = 8600;
    const PICK2 = 9800;
    const at = (i) => center(stage, options[i].item);
    const pointer = cursor(stage, [
      { at: 200, x: 420, y: 430 },
      { at: OPEN1, ...statusAnchor, click: true },
      { at: PICK1, ...at(1), click: true },
      { at: COMMENT, x: 300, y: 330 },
      { at: OPEN2, ...statusAnchor, click: true },
      { at: PICK2, ...at(3), click: true },
      { at: PICK2 + 900, x: 640, y: 420, hide: PICK2 + 600 },
    ]);
    const steps = caption(stage, [
      { at: 300, text: s.steps[0] },
      { at: PICK1 + 200, text: s.steps[1] },
      { at: COMMENT - 100, text: s.steps[2] },
      { at: PICK2 + 200, text: s.steps[3], until: duration - 700 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(grid.win, seg(t, 80, 600));
      const status = t >= PICK2 + 80 ? 'done' : t >= PICK1 + 80 ? 'progress' : 'todo';
      setPill(target.statusPill, status === 'done' ? s.statuses.done : status === 'progress' ? s.statuses.progress : s.statuses.pending, status);
      set(target.statusPill, { s: 1 + Math.sin(seg(t, status === 'done' ? PICK2 + 80 : PICK1 + 80, 420) * Math.PI) * (status === 'todo' ? 0 : 0.12) });
      me.style.display = t >= PICK1 + 300 ? 'inline-grid' : 'none';
      pop(me, seg(t, PICK1 + 300, 420));
      target.node.classList.toggle('hl', (t >= OPEN1 && t < PICK1 + 1600) || (t >= OPEN2 && t < PICK2 + 1600));
      target.node.style.background = t >= PICK2 + 1600 ? 'var(--paper-2)' : '';
      target.nameText.style.color = t >= PICK2 + 1600 ? 'var(--ink-2)' : '';
      const m1 = seg(t, OPEN1 + 60, 240, ease.outBack) * (1 - seg(t, PICK1 + 100, 200));
      const m2 = seg(t, OPEN2 + 60, 240, ease.outBack) * (1 - seg(t, PICK2 + 100, 200));
      const mo = Math.max(m1, m2);
      menu.style.display = mo > 0.01 ? 'grid' : 'none';
      set(menu, { o: mo, y: (1 - mo) * -6 });
      options.forEach(({ key, item }) => {
        const hover = (key === 'progress' && t >= PICK1 - 450 && t < PICK1 + 300) || (key === 'done' && t >= PICK2 - 450);
        item.classList.toggle('hover', hover);
      });
      rise(card, seg(t, COMMENT, 520, ease.outBack), 16);
      card.style.opacity = String(seg(t, COMMENT, 300));
      type(body, s.comment, seg(t, COMMENT + 500, 1700, ease.linear), true);
      pop(shot, seg(t, COMMENT + 2400, 420));
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
