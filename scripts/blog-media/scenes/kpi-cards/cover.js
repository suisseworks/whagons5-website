// Cover loop (4:3): KPI cards stacked like a dashboard; numbers tick, the
// trend line redraws and the donut turns. Seamless loop.
import { box, clamp, el, ease, lerp } from '../../lib/kit.js';
import { ARC, PIE, drawExtra, kpiCard } from '../../lib/space.js';

const CYCLE = 8000;

export default {
  size: [600, 450],
  duration: CYCLE,
  poster: 4000,
  strings: {
    es: { kicker: 'Powerup', name: 'Tarjetas KPI', cards: ['Total Tareas', 'En Progreso', 'Finalizadas Hoy', 'Vencidas', 'Tendencia Semanal', 'Por Estado'] },
    en: { kicker: 'Powerup', name: 'KPI Cards', cards: ['Total Tasks', 'In Progress', 'Finished Today', 'Overdue', 'Weekly Trend', 'By Status'] },
  },

  build(stage, s) {
    stage.classList.add('dot-grid');
    const title = box(stage, '', 40, 38, 300, 80);
    el('div', 'lbl ink', title, s.kicker);
    el('div', 'title', title, s.name).style.cssText = 'margin-top:6px;font-size:30px';
    const board = box(stage, '', 40, 132, 520, 250);
    const place = [[0, 0, 250], [262, 0, 258], [0, 72, 250], [262, 72, 258], [0, 144, 250], [262, 144, 258]];
    const icons = ['#', ARC, '✓', '!', '↗', PIE];
    const tones = ['blue', 'amber', 'green', 'rose', 'indigo', 'purple'];
    const cards = s.cards.map((label, i) => {
      const [x, y, w] = place[i];
      const card = kpiCard(board, { x, w, label, icon: icons[i], tone: tones[i], spark: i === 4, donut: i === 5, value: '' });
      card.node.style.top = `${y}px`;
      card.node.style.height = '62px';
      return card;
    });
    const foot = box(stage, '', 40, 406, 100, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px"></span>';

    return (t) => {
      // Values drift during the day and come back to the start.
      const wave = (Math.sin((t / CYCLE) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const values = [Math.round(lerp(42, 51, wave)), Math.round(lerp(9, 14, wave)), Math.round(lerp(4, 12, wave)), Math.round(lerp(4, 2, wave))];
      cards.slice(0, 4).forEach((card, i) => { card.value.textContent = String(values[i]); });
      cards[4].value.textContent = `+${Math.round(lerp(12, 18, wave))}%`;
      const draw = ease.inOut(clamp((t % CYCLE) / 1800));
      const undraw = ease.inOut(clamp(((t % CYCLE) - (CYCLE - 900)) / 900));
      drawExtra(cards[4].extra, draw * (1 - undraw));
      drawExtra(cards[5].extra, 1);
      cards[5].extra.style.transform = `rotate(${(t / CYCLE) * 360}deg)`;
    };
  },
};
