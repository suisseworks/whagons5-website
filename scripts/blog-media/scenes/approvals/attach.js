// FIG: the Purchase request template gets the approval under Approval. From
// then on every task created from it arrives waiting, with an orange badge.
import { box, caption, center, cursor, ease, el, loopVeil, pop, rise, seg, set } from '../../lib/kit.js';
import { approvalBadge, injectTasksCss, taskGrid } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

const UI = {
  en: { title: 'Edit Template', template: 'Purchase request', name: 'Name *', priority: 'Priority', high: 'High', approvalField: 'Approval', none: 'None', other: 'Contractor in a guest room', override: 'Allow approval changes when creating tasks', update: 'Update', items: ['2 mattresses', 'New ice machine', 'Pool chairs ×12'], steps: ['Edit the template the team already uses', 'Choose the approval under Approval', 'Every new task arrives waiting for a yes'] },
  es: { title: 'Editar Plantilla', template: 'Solicitud de compra', name: 'Nombre *', priority: 'Prioridad', high: 'Alta', approvalField: 'Aprobación', none: 'Ninguna', other: 'Contratista en habitación de huésped', override: 'Permitir cambios de aprobación al crear tareas', update: 'Actualizar', items: ['2 colchones', 'Máquina de hielo', 'Camastros ×12'], steps: ['Edita la plantilla que el equipo ya usa', 'Elige la aprobación en Aprobación', 'Cada tarea nueva llega esperando un sí'] },
  pt: { title: 'Editar modelo', template: 'Pedido de compra', name: 'Nome *', priority: 'Prioridade', high: 'Alta', approvalField: 'Aprovação', none: 'Nenhuma', other: 'Prestador em quarto de hóspede', override: 'Permitir alterações de aprovação ao criar tarefas', update: 'Atualizar', items: ['2 colchões', 'Máquina de gelo', 'Espreguiçadeiras ×12'], steps: ['Edite o modelo que a equipe já usa', 'Escolha a aprovação em Aprovação', 'Toda tarefa nova chega esperando um sim'] },
  de: { title: 'Edit Template', template: 'Bestellanforderung', name: 'Name *', priority: 'Priority', high: 'Hoch', approvalField: 'Approval', none: 'None', other: 'Handwerker im Gästezimmer', override: 'Allow approval changes when creating tasks', update: 'Aktualisieren', items: ['2 Matratzen', 'Eismaschine', 'Poolliegen ×12'], steps: ['Die Vorlage öffnen, die das Team nutzt', 'Unter Approval die Genehmigung wählen', 'Jede neue Aufgabe wartet auf ein Ja'] },
};

export default {
  size: [800, 450],
  duration: 14000,
  poster: 11800,
  strings: withCommon(UI),

  build(stage, s, { duration }) {
    injectTasksCss();
    stage.classList.add('dot-grid');

    // Template dialog (left).
    const dlg = box(stage, 'win dlg', 26, 24, 340, 336);
    const hd = el('div', 'win-hd', dlg);
    el('span', 'ico', hd, '▤');
    el('span', 'dlg-title', hd, s.title).style.fontSize = '13.5px';
    const bd = el('div', '', dlg);
    bd.style.cssText = 'display:grid;gap:11px;padding:14px 16px';
    const field = (label) => {
      const node = el('label', 'field', bd);
      el('span', '', node, label);
      return el('div', 'input', node);
    };
    field(s.name).textContent = s.template;
    field(s.priority).innerHTML = `<span class="prio high">${s.high}</span>`;
    const approval = field(s.approvalField);
    const approvalText = el('span', '', approval, s.none);
    el('span', 'muted', approval, '▾').style.marginLeft = 'auto';
    const menu = box(stage, 'menu', 42, 0, 308);
    const options = [s.none, s.approval, s.other].map((label) => el('div', 'mi', menu, label));
    const over = el('div', '', bd);
    over.style.cssText = 'display:flex;align-items:flex-start;gap:8px;font-size:11px;line-height:1.35;color:var(--ink-2)';
    el('span', 'check', over).style.marginTop = '1px';
    el('span', '', over, s.override);
    const foot = el('div', '', dlg);
    foot.style.cssText = 'position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:flex-end;padding:11px 16px;border-top:1px solid var(--line)';
    const update = el('span', 'btn primary', foot, s.update);

    // Task grid (right).
    const cols = '46px 1.6fr 1.15fr';
    const grid = taskGrid(stage, { x: 386, y: 24, w: 390, h: 336, title: s.space, headers: [s.cols[0], s.cols[1], s.cols[3]], cols });
    const tasks = s.items.map((item, i) => {
      const row = grid.makeRow({ num: `#${1043 + i}`, name: `${s.template} · ${item}`, spot: '', status: s.statuses.pending });
      row.node.style.gridTemplateColumns = cols;
      row.spotCell.remove();
      row.peopleCell.remove();
      const badge = approvalBadge(row.statusCell);
      return { row, badge };
    });

    const approvalAnchor = center(stage, approval);
    menu.style.top = `${approvalAnchor.y + 18}px`;
    const OPEN = 2600;
    const PICK = 4200;
    const SAVE = 5600;
    const FIRST = 7200;
    const pointer = cursor(stage, [
      { at: 200, x: 300, y: 430 },
      { at: OPEN, ...approvalAnchor, click: true },
      { at: PICK, ...center(stage, options[1]), click: true },
      { at: SAVE, ...center(stage, update), click: true },
      { at: SAVE + 900, x: 560, y: 420, hide: SAVE + 600 },
    ]);
    const steps = caption(stage, [
      { at: 300, text: s.steps[0] },
      { at: OPEN - 200, text: s.steps[1] },
      { at: FIRST - 300, text: s.steps[2], until: duration - 700 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      const settle = seg(t, SAVE + 200, 500);
      set(dlg, { o: seg(t, 100, 600) * (1 - settle * 0.5), y: (1 - seg(t, 100, 600)) * 14, s: 1 - settle * 0.02 });
      rise(grid.win, seg(t, 300, 700));
      const open = seg(t, OPEN + 60, 260, ease.outBack) * (1 - seg(t, PICK + 120, 200));
      menu.style.display = open > 0.01 ? 'grid' : 'none';
      set(menu, { o: open, y: (1 - open) * -6 });
      options.forEach((node, i) => node.classList.toggle('hover', i === 1 && t >= PICK - 500));
      const picked = t >= PICK + 100;
      approvalText.textContent = picked ? s.approval : s.none;
      approval.classList.toggle('focus', t >= OPEN && t < PICK + 900);
      approval.style.background = picked && t < SAVE + 600 ? '#fffaf3' : '#fff';
      update.classList.toggle('press', pointer.pressed(t, SAVE));
      tasks.forEach(({ row, badge }, i) => {
        const at = FIRST + i * 1100;
        const p = seg(t, at, 560, ease.outBack);
        row.node.style.display = t >= at ? 'grid' : 'none';
        set(row.node, { o: Math.min(1, p * 1.5), y: i * 36 + (1 - p) * -10 });
        row.node.classList.toggle('hl', t >= at && t < at + 900);
        pop(badge.node, seg(t, at + 300, 420));
        badge.node.classList.toggle('ring', t >= at + 700 && t < at + 1500);
      });
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
