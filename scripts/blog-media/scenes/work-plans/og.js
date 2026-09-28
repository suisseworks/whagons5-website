// Social card for the Work Plans article.
import { el } from '../../lib/kit.js';
import { ogScene } from '../../lib/og.js';

export default ogScene({
  strings: {
    es: { chip: 'Powerups', title: 'Planes de Trabajo: la rutina que se crea sola', meta: 'Guía · Whagons', task: 'Revisión de habitación', rooms: ['Hab 101', 'Hab 102', 'Hab 103'], todo: 'por hacer', done: 'completado', days: ['L', 'M', 'M', 'J', 'V'] },
    en: { chip: 'Powerups', title: 'Work Plans: routines that create themselves', meta: 'Guide · Whagons', task: 'Room check', rooms: ['Rm 101', 'Rm 102', 'Rm 103'], todo: 'to do', done: 'completed', days: ['M', 'T', 'W', 'T', 'F'] },
  },
  art(panel, s) {
    panel.style.padding = '16px';
    const week = el('div', '', panel);
    week.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding-bottom:14px;border-bottom:1px solid var(--line)';
    s.days.forEach((d, i) => {
      const cell = el('div', '', week);
      cell.style.cssText = `display:grid;justify-items:center;gap:6px;font-size:10.5px;font-weight:600;color:${i === 2 ? 'var(--red)' : 'var(--ink-3)'}`;
      el('span', '', cell, d);
      const dot = el('span', '', cell);
      const on = [0, 2, 4].includes(i);
      dot.style.cssText = on ? `width:10px;height:10px;border-radius:50%;${i < 3 ? 'background:#10b981' : 'border:1.5px solid rgba(22,21,19,.35)'}` : 'width:10px;height:10px;border-radius:50%;background:var(--paper-3)';
    });
    s.rooms.forEach((room, i) => {
      const card = el('div', '', panel);
      card.style.cssText = 'display:flex;align-items:center;gap:9px;margin-top:10px;padding:9px 10px;border:1px solid var(--line);border-radius:9px;background:#fff';
      el('span', 'tico', card, '↻').style.cssText = 'display:grid;place-items:center;width:22px;height:22px;border-radius:6px;background:#e0f2fe;color:#0369a1;font-size:11px';
      const text = el('div', '', card);
      text.style.cssText = 'display:grid;gap:1px;flex:1;min-width:0';
      el('span', '', text, s.task).style.cssText = 'font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
      el('span', 'muted', text, room).style.fontSize = '10px';
      el('span', `pill ${i === 0 ? 'todo' : 'done'}`, card, i === 0 ? s.todo : s.done).style.fontSize = '9.5px';
    });
  },
});
