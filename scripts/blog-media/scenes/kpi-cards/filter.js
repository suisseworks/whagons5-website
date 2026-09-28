// FIG: clicking the "In Progress" card filters the space's task grid;
// clicking another card clears the filter again.
import { box, caption, center, cursor, el, loopVeil, rise, seg, set } from '../../lib/kit.js';
import { overviewCards, stripEdge, taskRows } from '../../lib/space.js';

const TASKS = [
  { status: 1, spot: 0 }, { status: 0, spot: 1 }, { status: 1, spot: 2 }, { status: 2, spot: 3 },
  { status: 0, spot: 4 }, { status: 1, spot: 5 }, { status: 0, spot: 6 },
];

export default {
  size: [800, 450],
  duration: 14000,
  poster: 6400,
  strings: {
    es: {
      space: 'Mantenimiento Preventivo',
      cards: ['Total Tareas', 'En Progreso', 'Finalizadas Hoy', 'Vencidas', 'Tendencia Semanal', 'Por Estado'],
      cols: ['Tarea', 'Ubicación', 'Estado', 'Vence'],
      names: ['Revisión Sellado Ventanas', 'Mantenimiento Equipos Cocina', 'Cambio de Filtros A/C', 'Inspección Eléctrica', 'Prueba de Bombas', 'Pintura Pasillo 2', 'Revisión de Calderas'],
      spots: ['Hab 204', 'Cocina', 'Hab 118', 'Lobby', 'Cuarto de máquinas', 'Piso 2', 'Sótano'],
      statuses: [['por hacer', 'todo'], ['en progreso', 'progress'], ['en revisión', 'review']],
      dues: ['hoy', 'mañana', 'hoy', 'vie', 'ayer', 'lun', 'mañana'],
      steps: [
        'Haz clic en En Progreso para filtrar la grilla',
        'La grilla muestra solo el trabajo en curso',
        'Otra tarjeta, como Total Tareas, quita el filtro',
      ],
    },
    en: {
      space: 'Preventive Maintenance',
      cards: ['Total Tasks', 'In Progress', 'Finished Today', 'Overdue', 'Weekly Trend', 'By Status'],
      cols: ['Task', 'Spot', 'Status', 'Due'],
      names: ['Window Seal Check', 'Kitchen Equipment Service', 'A/C Filter Change', 'Electrical Inspection', 'Pump Test', 'Hallway 2 Paint', 'Boiler Check'],
      spots: ['Rm 204', 'Kitchen', 'Rm 118', 'Lobby', 'Plant room', 'Floor 2', 'Basement'],
      statuses: [['to do', 'todo'], ['in progress', 'progress'], ['in review', 'review']],
      dues: ['today', 'tomorrow', 'today', 'Fri', 'yesterday', 'Mon', 'tomorrow'],
      steps: [
        'Click In Progress to filter the grid',
        'The grid now shows only the work under way',
        'Another card, like Total Tasks, clears the filter',
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
    strip.style.cssText = 'position:relative;height:62px;margin:10px 14px;overflow:hidden';
    const cards = overviewCards(strip, s.cards, { values: ['7', '3', '4', '1', '+18%', ''] });
    stripEdge(strip);
    const grid = el('div', '', win);
    grid.style.cssText = 'position:relative;border-top:1px solid var(--line)';
    const { rows } = taskRows(grid, TASKS.map((task, i) => ({
      name: s.names[i], spot: s.spots[task.spot], status: s.statuses[task.status][0], tone: s.statuses[task.status][1], due: s.dues[i], late: s.dues[i] === 'ayer' || s.dues[i] === 'yesterday', who: ['AM', 'LR', 'JP', 'SV', 'AM', 'LR', 'JP'][i], whoTone: ['a', 'b', 'c', 'd', 'a', 'b', 'c'][i],
    })), s.cols);
    const rowH = 36;

    const clickFilter = 2200;
    const clickClear = 8300;
    const at = (node, dx = 0, dy = 0) => center(stage, node, dx, dy);
    const pointer = cursor(stage, [
      { at: 400, x: 320, y: 430 },
      { at: clickFilter, ...at(cards[1].node), click: true },
      { at: 4600, x: 420, y: 250 },
      { at: 7000, x: 330, y: 170 },
      { at: clickClear, ...at(cards[0].node), click: true },
      { at: 9800, x: 470, y: 430, hide: 9700 },
    ]);
    const steps = caption(stage, [
      { at: 400, text: s.steps[0] },
      { at: 3400, text: s.steps[1] },
      { at: 7700, text: s.steps[2], until: 13300 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(win, seg(t, 150, 700));
      const filtering = t >= clickFilter && t < clickClear;
      cards[1].node.classList.toggle('sel', filtering);
      cards[0].node.classList.toggle('sel', t >= clickClear && t < clickClear + 900);
      // Rows: in-progress rows slide up, others collapse; then everything returns.
      const fold = t < clickClear ? seg(t, clickFilter + 120, 520) : 1 - seg(t, clickClear + 120, 520);
      let visibleIndex = 0;
      rows.forEach(({ row }, i) => {
        const keep = TASKS[i].status === 1;
        const baseY = i * rowH;
        const targetY = keep ? visibleIndex * rowH : baseY;
        if (keep) visibleIndex += 1;
        row.style.position = 'absolute';
        row.style.left = '0';
        row.style.right = '0';
        row.style.top = `${28}px`;
        const y = baseY + (targetY - baseY) * fold;
        set(row, { o: keep ? 1 : 1 - fold, y, sy: keep ? 1 : 1 - fold * 0.2 });
        row.style.background = keep && fold > 0.5 ? '#f8fbff' : '#fff';
      });
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
