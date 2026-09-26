// Social card for the KPI Cards article.
import { el } from '../../lib/kit.js';
import { ogScene } from '../../lib/og.js';
import { ARC, PIE, drawExtra, kpiCard } from '../../lib/space.js';

export default ogScene({
  strings: {
    es: { chip: 'Powerups', title: 'Tarjetas KPI: los números del turno, arriba de cada espacio', meta: 'Guía · Whagons', cards: ['Total Tareas', 'En Progreso', 'Vencidas', 'Tendencia Semanal'] },
    en: { chip: 'Powerups', title: "KPI Cards: the shift's numbers on top of every space", meta: 'Guide · Whagons', cards: ['Total Tasks', 'In Progress', 'Overdue', 'Weekly Trend'] },
  },
  art(panel, s) {
    panel.style.background = 'var(--paper-2)';
    const values = ['48', '12', '3', '+18%'];
    const tones = ['blue', 'amber', 'rose', 'indigo'];
    const icons = ['#', ARC, '!', '↗'];
    s.cards.forEach((label, i) => {
      const card = kpiCard(panel, { x: 12, w: 210, label, icon: icons[i], tone: tones[i], value: values[i], spark: i === 3 });
      card.node.style.top = `${12 + i * 59}px`;
      card.node.style.height = '52px';
      drawExtra(card.extra, 1);
    });
    el('span', '', panel);
  },
});
