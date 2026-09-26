// FIG: drag a KPI card to change the order. Each person keeps their own
// order per space.
import { box, caption, center, clamp, cursor, ease, el, lerp, loopVeil, rise, seg, set } from '../../lib/kit.js';
import { overviewCards, stripEdge, taskRows } from '../../lib/space.js';

export default {
  size: [800, 450],
  duration: 13000,
  poster: 7600,
  strings: {
    es: {
      space: 'Mantenimiento Preventivo',
      cards: ['Total Tareas', 'En Progreso', 'Finalizadas Hoy', 'Vencidas', 'Tendencia Semanal', 'Por Estado'],
      cols: ['Tarea', 'Ubicación', 'Estado', 'Vence'],
      names: ['Revisión Sellado Ventanas', 'Mantenimiento Equipos Cocina', 'Inspección Eléctrica', 'Calibración Tratamiento Agua'],
      spots: ['Hab 204', 'Cocina', 'Lobby', 'Piscina'],
      statuses: [['en progreso', 'progress'], ['por hacer', 'todo'], ['por hacer', 'todo'], ['en revisión', 'review']],
      dues: ['hoy', 'ayer', 'mañana', 'vie'],
      steps: [
        'Arrastra una tarjeta para cambiar el orden',
        'Tu orden se guarda para ti, en este espacio',
      ],
    },
    en: {
      space: 'Preventive Maintenance',
      cards: ['Total Tasks', 'In Progress', 'Finished Today', 'Overdue', 'Weekly Trend', 'By Status'],
      cols: ['Task', 'Spot', 'Status', 'Due'],
      names: ['Window Seal Check', 'Kitchen Equipment Service', 'Electrical Inspection', 'Water Treatment Calibration'],
      spots: ['Rm 204', 'Kitchen', 'Lobby', 'Pool'],
      statuses: [['in progress', 'progress'], ['to do', 'todo'], ['to do', 'todo'], ['in review', 'review']],
      dues: ['today', 'yesterday', 'tomorrow', 'Fri'],
      steps: [
        'Drag a card to change the order',
        'Your order is saved for you, in this space',
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
    strip.style.cssText = 'position:relative;height:62px;margin:10px 14px;clip-path:inset(-24px 0 -24px 0)';
    const cards = overviewCards(strip, s.cards, { values: ['48', '12', '9', '3', '+18%', ''] });
    stripEdge(strip);
    const grid = el('div', '', win);
    grid.style.borderTop = '1px solid var(--line)';
    taskRows(grid, s.names.map((name, i) => ({
      name, spot: s.spots[i], status: s.statuses[i][0], tone: s.statuses[i][1], due: s.dues[i], late: i === 1, who: ['AM', 'LR', 'JP', 'SV'][i], whoTone: ['a', 'b', 'c', 'd'][i],
    })), s.cols);

    // Final order: Overdue first, the rest keep their relative order.
    const order = [3, 0, 1, 2, 4, 5];
    const gap = 8;
    const finalX = [];
    let x = 0;
    order.forEach((index) => { finalX[index] = x; x += cards[index].w + gap; });

    const grab = 1800;
    const drop = 4400;
    const dragged = cards[3];
    const start = center(stage, dragged.node);
    const end = { x: start.x - dragged.x + finalX[3], y: start.y };
    const pointer = cursor(stage, [
      { at: 400, x: 460, y: 430 },
      { at: grab, ...start, click: true },
      { at: drop, x: end.x, y: end.y + 2 },
      { at: 5400, x: 520, y: 430, hide: 5300 },
    ]);
    const steps = caption(stage, [
      { at: 400, text: s.steps[0] },
      { at: 5000, text: s.steps[1], until: 12300 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(win, seg(t, 150, 700));
      const moving = ease.inOut(clamp((t - grab - 150) / (drop - grab - 150)));
      cards.forEach((card, i) => {
        const home = card.x;
        const target = finalX[i];
        if (card === dragged) {
          const lifted = t >= grab && t < drop + 250;
          card.node.classList.toggle('lift', lifted);
          const settle = seg(t, drop, 250);
          set(card.node, { x: lerp(0, target - home, moving), y: lifted ? -6 * (1 - settle) : 0, s: lifted ? 1.04 - 0.04 * settle : 1 });
          card.node.style.zIndex = '5';
        } else {
          // Others make room as the dragged card passes them.
          const p = seg(t, grab + 600 + (3 - i) * 180, 420, ease.inOut);
          set(card.node, { x: (target - home) * p });
        }
      });
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
