// Social card for the Cleaning article.
import { el } from '../../lib/kit.js';
import { ogScene } from '../../lib/og.js';
import { roomCard } from '../../lib/rooms.js';

export default ogScene({
  strings: {
    es: { chip: 'Powerups', title: 'Limpieza: cada habitación con su estado, en una pantalla', meta: 'Guía · Whagons', progress: 'Progreso del día', labels: { dirty: 'Sucia', cleaning: 'En limpieza', clean: 'Limpia', inspected: 'Inspeccionada' }, rooms: ['Hab 101', 'Hab 102', 'Hab 103', 'Hab 104'], now: 'ahora', ago: 'ayer' },
    en: { chip: 'Powerups', title: 'Cleaning: every room and its status on one screen', meta: 'Guide · Whagons', progress: 'Daily progress', labels: { dirty: 'Dirty', cleaning: 'Cleaning', clean: 'Clean', inspected: 'Inspected' }, rooms: ['Rm 101', 'Rm 102', 'Rm 103', 'Rm 104'], now: 'just now', ago: 'yesterday' },
  },
  art(panel, s) {
    panel.style.cssText += ';background:linear-gradient(180deg,#fbfaf7,#f1ede4)';
    const head = el('div', '', panel);
    head.style.cssText = 'position:absolute;left:12px;right:12px;top:12px;padding:8px 10px;border-radius:12px;background:#fff;border:1px solid var(--line)';
    el('div', 'lbl ink', head, s.progress).style.cssText = 'font-size:8.5px;color:var(--ink-3)';
    const v = el('div', '', head, '75%');
    v.style.cssText = 'font-size:18px;font-weight:600;color:#f97316';
    const bar = el('div', 'bar', head);
    el('i', '', bar).style.cssText = 'width:75%;background:#f97316';
    const states = ['clean', 'cleaning', 'clean', 'clean'];
    s.rooms.forEach((name, i) => {
      const update = roomCard(panel, { x: 12 + (i % 2) * 108, y: 92 + Math.floor(i / 2) * 76, w: 102, h: 66, name, labels: s.labels });
      const card = update({ t: 0, state: states[i], since: -5000, who: 'Ana', tone: 'a', last: states[i] === 'clean' ? s.now : s.ago, tasks: states[i] === 'cleaning' ? 1 : 0 });
      card.querySelector('.r-last').style.display = 'none';
      card.querySelector('.r-status').style.fontSize = '9.5px';
      card.querySelector('.r-sweep').style.display = 'none';
    });
  },
});
