// Cover loop (4:3): the week strip ticks Monday → Wednesday → Friday and each
// tick drops a fresh set of room checks onto the stack. Seamless loop.
import { box, clamp, ease, el, pill, set } from '../../lib/kit.js';

const PERIOD = 2000;
const CYCLE = 3;

export default {
  size: [600, 450],
  duration: PERIOD * CYCLE,
  poster: PERIOD * 1 + 1500,
  strings: {
    es: {
      kicker: 'Powerup',
      name: 'Planes de Trabajo',
      week: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      task: 'Revisión de habitación',
      rooms: ['Hab 101', 'Hab 102', 'Hab 103', 'Hab 104'],
      todo: 'por hacer',
      done: 'completado',
      every: 'Cada lun, mié y vie · 07:00',
    },
    en: {
      kicker: 'Powerup',
      name: 'Work Plans',
      week: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      task: 'Room check',
      rooms: ['Rm 101', 'Rm 102', 'Rm 103', 'Rm 104'],
      todo: 'to do',
      done: 'completed',
      every: 'Every Mon, Wed and Fri · 7:00 AM',
    },
  },

  build(stage, s) {
    stage.classList.add('dot-grid');

    // Big repeat arc behind everything.
    const arc = box(stage, '', 300, 40, 380, 380);
    arc.innerHTML = '<svg viewBox="0 0 100 100" width="380" height="380"><path d="M50 8a42 42 0 1 1-37.5 23" fill="none" stroke="rgba(212,49,10,.16)" stroke-width="7" stroke-linecap="round"/><path d="M4 24l9 8 7-10" fill="none" stroke="rgba(212,49,10,.16)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const title = box(stage, '', 40, 38, 260, 80);
    el('div', 'lbl ink', title, s.kicker);
    el('div', 'title', title, s.name).style.cssText = 'margin-top:6px;font-size:30px';

    // Week strip card.
    const week = box(stage, 'win', 40, 128, 250, 92);
    week.style.padding = '12px 14px';
    el('div', 'lbl', week, s.every).style.cssText = 'color:var(--ink-3);letter-spacing:.04em';
    const row = el('div', '', week);
    row.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:10px';
    const days = s.week.map((d, i) => {
      const cell = el('div', '', row);
      cell.style.cssText = 'display:grid;justify-items:center;gap:6px;font-size:10.5px;font-weight:600;color:var(--ink-3)';
      el('span', '', cell, d);
      const dot = el('span', '', cell);
      const scheduled = [0, 2, 4].includes(i);
      dot.style.cssText = scheduled
        ? 'width:10px;height:10px;border-radius:50%;border:1.5px solid rgba(22,21,19,.35)'
        : 'width:10px;height:10px;border-radius:50%;background:var(--paper-3)';
      return { cell, dot, scheduled };
    });

    // Stack of task cards.
    const slots = [0, 1, 2, 3, 4];
    const cards = slots.map(() => {
      const card = box(stage, 'card', 292, 0, 280, 58);
      card.style.cssText += ';display:flex;align-items:center;gap:10px;padding:0 12px';
      el('span', 'tico', card, '↻').style.cssText = 'display:grid;place-items:center;width:26px;height:26px;border-radius:7px;background:#e0f2fe;color:#0369a1;font-size:13px';
      const text = el('div', '', card);
      text.style.cssText = 'display:grid;gap:2px;min-width:0;flex:1';
      const name = el('span', '', text, s.task);
      name.style.cssText = 'font-size:12.5px;font-weight:600;white-space:nowrap';
      const room = el('span', 'muted', text, '');
      room.style.fontSize = '11px';
      const p = pill(card, s.todo, 'todo');
      return { card, room, pill: p };
    });

    const foot = box(stage, '', 40, 404, 240, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px;vertical-align:middle"></span>';

    return (t) => {
      const tick = Math.floor(t / PERIOD) % CYCLE;
      const phase = (t % PERIOD) / PERIOD;
      const move = ease.inOut(clamp((phase - 0.05) / 0.35));
      // Today marker walks Mon → Wed → Fri, then a new week starts.
      const todayIndex = [0, 2, 4][tick];
      days.forEach(({ cell, dot, scheduled }, i) => {
        const isToday = i === todayIndex;
        cell.style.color = isToday ? 'var(--red)' : 'var(--ink-3)';
        if (!scheduled) return;
        const passed = i < todayIndex || (isToday && phase > 0.45);
        dot.style.background = passed ? '#10b981' : '#fff';
        dot.style.borderColor = passed ? '#10b981' : 'rgba(22,21,19,.35)';
        set(dot, { s: isToday ? 1 + Math.sin(clamp(phase / 0.4) * Math.PI) * 0.4 : 1 });
      });

      // Conveyor: every period all cards shift down one slot.
      cards.forEach((c, slot) => {
        const y = 96 + (slot - 1 + move) * 68;
        const serial = tick - slot + 99;
        const roomIndex = ((serial % 3) + 3) % 3;
        c.room.textContent = s.rooms[roomIndex];
        const enter = slot === 0 ? move : 1;
        const leave = slot === slots.length - 1 ? move : slot === slots.length - 2 ? 0 : 0;
        const finished = slot >= 2 || (slot === 1 && phase > 0.7);
        c.pill.className = `pill ${finished ? 'done' : 'todo'}`;
        c.pill.textContent = finished ? s.done : s.todo;
        const depth = clamp((slot - 1 + move) / 3);
        set(c.card, { o: enter * (1 - leave) * (1 - depth * 0.35), y, s: 1 - depth * 0.04, origin: 'center top' });
      });
    };
  },
};
