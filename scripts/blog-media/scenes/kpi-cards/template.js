// FIG: add KPI cards to a space from the "Overview Dashboard" template.
import { box, button, caption, center, count, cursor, ease, el, loopVeil, rise, seg, set } from '../../lib/kit.js';
import { drawExtra, overviewCards, stripEdge, taskRows } from '../../lib/space.js';

export default {
  size: [800, 450],
  duration: 16000,
  poster: 12600,
  strings: {
    es: {
      space: 'Mantenimiento Preventivo',
      add: '+ Agregar tarjeta KPI',
      dialog: 'Crear Tarjeta KPI',
      choose: 'Elige cómo crear tu tarjeta',
      scratch: ['Desde Cero', 'Configura cada aspecto manualmente'],
      template: ['Usar Plantilla', 'Empieza con tarjetas pre-configuradas'],
      templates: [['Panel General', '6 tarjetas: visión general del espacio'], ['Monitor de Carga', '3 tarjetas: carga de trabajo de un vistazo']],
      cards: ['Total Tareas', 'En Progreso', 'Finalizadas Hoy', 'Vencidas', 'Tendencia Semanal', 'Por Estado'],
      scope: 'Ámbito del Espacio',
      scopeValue: 'Todos los Espacios',
      apply: 'Aplicar Plantilla',
      cols: ['Tarea', 'Ubicación', 'Estado', 'Vence'],
      tasks: ['Revisión Sellado Ventanas', 'Mantenimiento Equipos Cocina', 'Inspección Eléctrica', 'Calibración Tratamiento Agua'],
      spots: ['Hab 204', 'Cocina', 'Lobby', 'Piscina'],
      statuses: ['en progreso', 'por hacer', 'por hacer', 'en revisión'],
      dues: ['hoy', 'ayer', 'mañana', 'vie'],
      steps: [
        'Agrega una tarjeta y elige Usar Plantilla',
        'Panel General trae seis tarjetas listas',
        'Aparecen arriba del espacio, con los datos del momento',
      ],
    },
    en: {
      space: 'Preventive Maintenance',
      add: '+ Add KPI card',
      dialog: 'Create KPI Card',
      choose: 'Choose how to create your card',
      scratch: ['From Scratch', 'Configure every aspect manually'],
      template: ['Use Template', 'Start with pre-configured cards'],
      templates: [['Overview Dashboard', '6 cards: general overview of the space'], ['Workload Monitor', '3 cards: workload at a glance']],
      cards: ['Total Tasks', 'In Progress', 'Finished Today', 'Overdue', 'Weekly Trend', 'By Status'],
      scope: 'Space Scope',
      scopeValue: 'All Spaces',
      apply: 'Apply Template',
      cols: ['Task', 'Spot', 'Status', 'Due'],
      tasks: ['Window Seal Check', 'Kitchen Equipment Service', 'Electrical Inspection', 'Water Treatment Calibration'],
      spots: ['Rm 204', 'Kitchen', 'Lobby', 'Pool'],
      statuses: ['in progress', 'to do', 'to do', 'in review'],
      dues: ['today', 'yesterday', 'tomorrow', 'Fri'],
      steps: [
        'Add a card and choose Use Template',
        'Overview Dashboard comes with six ready cards',
        'They sit on top of the space, with live numbers',
      ],
    },
  },

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    const win = box(stage, 'win', 24, 22, 752, 356);
    const hd = el('div', 'win-hd', win);
    el('span', 'ico', hd, '✓');
    el('span', '', hd, s.space).style.fontSize = '14px';
    const strip = el('div', '', win);
    strip.style.cssText = 'position:relative;height:62px;margin:10px 14px 10px;padding-top:2px';
    const slot = el('div', 'kpi-slot', strip, s.add);
    slot.style.cssText += ';left:0;right:0';

    strip.style.overflow = 'hidden';
    const cards = overviewCards(strip, s.cards, { values: ['0', '0', '0', '0', '+18%', ''] });
    stripEdge(strip);
    const grid = el('div', '', win);
    grid.style.cssText = 'border-top:1px solid var(--line)';
    taskRows(grid, s.tasks.map((name, i) => ({
      name, spot: s.spots[i], status: s.statuses[i], tone: ['progress', 'todo', 'todo', 'review'][i], due: s.dues[i], late: i === 1, who: ['AM', 'LR', 'JP', 'SV'][i], whoTone: ['a', 'b', 'c', 'd'][i],
    })), s.cols);

    // Builder dialog with three steps.
    const dlg = box(stage, 'win dlg', 190, 70, 420, 290);
    const dhd = el('div', 'win-hd', dlg);
    el('span', 'ico', dhd, '▦');
    el('span', 'dlg-title', dhd, s.dialog);
    const body = el('div', '', dlg);
    body.style.cssText = 'position:relative;height:250px';
    const page = () => {
      const node = el('div', '', body);
      node.style.cssText = 'position:absolute;inset:0;padding:16px 18px';
      return node;
    };
    // Step 1: choose mode.
    const p1 = page();
    el('div', 'muted', p1, s.choose).style.cssText = 'font-size:12px;margin-bottom:12px';
    const modes = el('div', '', p1);
    modes.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px';
    const mode = ([title, desc], icon) => {
      const node = el('div', '', modes);
      node.style.cssText = 'display:grid;justify-items:center;gap:6px;padding:20px 12px;border:1px solid var(--line-2);border-radius:12px;text-align:center';
      el('span', '', node, icon).style.cssText = 'display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--paper-3);font-size:16px';
      el('span', '', node, title).style.cssText = 'font-size:13px;font-weight:600';
      el('span', 'muted', node, desc).style.fontSize = '11px';
      return node;
    };
    mode(s.scratch, '✎');
    const useTemplate = mode(s.template, '▦');
    // Step 2: template gallery.
    const p2 = page();
    const tpls = s.templates.map(([name, desc]) => {
      const node = el('div', '', p2);
      node.style.cssText = 'display:flex;align-items:center;gap:12px;margin-bottom:10px;padding:14px;border:1px solid var(--line-2);border-radius:12px';
      el('span', '', node, '▦').style.cssText = 'display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:#eef2ff;color:#4f46e5';
      const t = el('div', '', node);
      el('div', '', t, name).style.cssText = 'font-size:13px;font-weight:600';
      el('div', 'muted', t, desc).style.fontSize = '11px';
      return node;
    });
    // Step 3: pick cards + scope.
    const p3 = page();
    const list = el('div', '', p3);
    list.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px 12px';
    s.cards.forEach((label) => {
      const line = el('div', '', list);
      line.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:12px;font-weight:500';
      el('span', 'check on', line, '✓');
      el('span', '', line, label);
    });
    const scope = el('div', 'field', p3);
    scope.style.marginTop = '14px';
    el('span', '', scope, s.scope);
    el('div', 'input', scope, `${s.scopeValue} ▾`);
    const applyRow = el('div', '', p3);
    applyRow.style.cssText = 'display:flex;justify-content:flex-end;margin-top:14px';
    const apply = button(applyRow, s.apply, 'primary');

    const openAt = 1300;
    const modeAt = 2700;
    const tplAt = 4300;
    const applyAt = 7200;
    const at = (node, dx = 0, dy = 0) => center(stage, node, dx, dy);
    const addPos = at(slot);
    const pointer = cursor(stage, [
      { at: 300, x: 400, y: 430 },
      { at: openAt, ...addPos, click: true },
      { at: modeAt, ...at(useTemplate), click: true },
      { at: tplAt, ...at(tpls[0], -60, 0), click: true },
      { at: applyAt, ...at(apply), click: true },
      { at: 8300, x: 520, y: 430, hide: 8200 },
    ]);
    const steps = caption(stage, [
      { at: 400, text: s.steps[0] },
      { at: 4000, text: s.steps[1] },
      { at: 7900, text: s.steps[2], until: 15300 },
    ]);
    const veil = loopVeil(stage, duration);
    const targets = [48, 12, 9, 3];

    return (t) => {
      rise(win, seg(t, 150, 700));
      const open = seg(t, openAt + 150, 300, ease.out);
      const close = seg(t, applyAt + 200, 300, ease.inOut);
      set(dlg, { o: open * (1 - close), s: 0.96 + open * 0.04 - close * 0.02 });
      const page2 = t >= modeAt + 200;
      const page3 = t >= tplAt + 200;
      set(p1, { o: page2 ? 0 : 1, x: page2 ? -20 : 0 });
      set(p2, { o: page2 && !page3 ? seg(t, modeAt + 200, 260) : 0, x: page2 && !page3 ? (1 - seg(t, modeAt + 200, 260)) * 20 : 0 });
      set(p3, { o: page3 ? seg(t, tplAt + 200, 260) : 0, x: page3 ? (1 - seg(t, tplAt + 200, 260)) * 20 : 0 });
      useTemplate.style.borderColor = t > modeAt - 300 && t < modeAt + 200 ? 'var(--ink)' : '';
      tpls[0].style.borderColor = t > tplAt - 300 && t < tplAt + 200 ? 'var(--ink)' : '';
      apply.classList.toggle('press', pointer.pressed(t, applyAt));
      slot.style.borderColor = t > openAt - 250 && t < openAt + 400 ? 'var(--ink)' : '';

      // Cards drop in after Apply.
      const landed = applyAt + 600;
      set(slot, { o: 1 - seg(t, landed - 200, 250) });
      cards.forEach((card, i) => {
        const start = landed + i * 170;
        const p = seg(t, start, 480, ease.outBack);
        set(card.node, { o: Math.min(1, p * 1.5), y: (1 - p) * -14 });
        if (i < 4) count(card.value, 0, targets[i], seg(t, start + 150, 900));
        drawExtra(card.extra, seg(t, start + 150, 900, ease.inOut));
      });
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
