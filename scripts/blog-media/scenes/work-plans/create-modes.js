// FIG: the plan's "Create tasks" setting decides when each run's tasks
// appear: at the scheduled time, some minutes before, or at the start of
// the scheduled day.
import { box, caption, clamp, el, ease, lerp, loopVeil, pop, rise, seg, set } from '../../lib/kit.js';

const PASS = 3900;
const START = 700;

export default {
  size: [800, 450],
  duration: START + PASS * 3 + 1200,
  poster: START + PASS * 1 + 3000,
  strings: {
    es: {
      setting: 'Crear tareas',
      options: ['A la hora programada', 'Antes de la hora programada', 'Al inicio del día programado'],
      minutes: 'Minutos antes',
      scheduled: 'Hora programada',
      task: 'Revisión de habitación',
      spot: 'Hab 101',
      steps: [
        'A la hora programada, la tarea aparece a las 07:00',
        'Antes, con los minutos de anticipación que elijas',
        'Al inicio del día, a las 00:00 del día programado',
      ],
    },
    en: {
      setting: 'Create tasks',
      options: ['At scheduled time', 'Before scheduled time', 'At start of scheduled day'],
      minutes: 'Minutes before',
      scheduled: 'Scheduled time',
      task: 'Room check',
      spot: 'Rm 101',
      steps: [
        'At scheduled time, the task appears at 7:00',
        'Before, as many minutes early as you choose',
        'At start of day, at 00:00 on the scheduled day',
      ],
    },
  },

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    // Setting card.
    const card = box(stage, 'win', 40, 30, 720, 126);
    card.style.padding = '16px 18px';
    el('div', '', card, s.setting).style.cssText = 'font-size:12px;font-weight:600;color:var(--ink-2)';
    const opts = el('div', '', card);
    opts.style.cssText = 'display:flex;gap:8px;margin-top:10px';
    const options = s.options.map((label) => {
      const node = el('div', 'chip', opts);
      node.style.cssText = 'height:34px;padding:0 14px;font-size:12.5px;border-radius:9px';
      const dot = el('span', '', node);
      dot.style.cssText = 'width:12px;height:12px;border-radius:50%;border:1.5px solid var(--ink-4);flex-shrink:0';
      el('span', '', node, label);
      return { node, dot };
    });
    const minutes = el('div', '', card);
    minutes.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:10px;font-size:11.5px;color:var(--ink-2);font-weight:600';
    el('span', '', minutes, s.minutes);
    el('span', 'input', minutes, '60').style.cssText = 'height:26px;width:52px;justify-content:center';

    // Timeline of one day.
    const line = box(stage, '', 70, 300, 660, 2);
    line.style.background = 'rgba(22,21,19,.25)';
    const x0 = 70;
    const span = 660;
    const hours = [0, 2, 4, 6, 8, 10, 12];
    const hourX = (h) => x0 + (h / 12) * span;
    hours.forEach((h) => {
      const tick = box(stage, '', hourX(h) - 0.5, 296, 1, 10);
      tick.style.background = 'rgba(22,21,19,.35)';
      const label = box(stage, 'mono', hourX(h) - 20, 312, 40, 14, `${String(h).padStart(2, '0')}:00`);
      label.style.cssText += ';font-size:10px;text-align:center;color:var(--ink-3)';
    });
    const sched = box(stage, '', hourX(7) - 1, 250, 2, 52);
    sched.style.background = 'var(--red)';
    const schedLabel = box(stage, 'lbl', hourX(7) - 110, 332, 220, 14, `${s.scheduled} · 07:00`);
    schedLabel.style.whiteSpace = 'nowrap';
    schedLabel.style.textAlign = 'center';

    // Time cursor.
    const now = box(stage, '', x0, 262, 2, 40);
    now.style.background = 'var(--ink)';
    const nowLabel = box(stage, 'mono', x0 - 24, 240, 48, 18, '00:00');
    nowLabel.style.cssText += ';font-size:10.5px;font-weight:600;text-align:center;color:#fff;background:var(--ink);border-radius:5px;line-height:18px';

    // Task card that pops when the task is created.
    const task = box(stage, 'card', 0, 176, 196, 50);
    task.style.cssText += ';display:flex;align-items:center;gap:9px;padding:0 11px';
    el('span', 'tico', task, '↻').style.cssText = 'display:grid;place-items:center;width:24px;height:24px;border-radius:7px;background:#e0f2fe;color:#0369a1;font-size:12px';
    const tt = el('div', '', task);
    el('div', '', tt, s.task).style.cssText = 'font-size:12px;font-weight:600;white-space:nowrap';
    el('div', 'muted', tt, s.spot).style.fontSize = '10.5px';
    const stem = box(stage, '', 0, 226, 1, 74);
    stem.style.borderLeft = '1.5px dashed rgba(22,21,19,.35)';

    const createdAt = [7, 6, 0];
    const steps = caption(stage, s.steps.map((text, i) => ({ at: START + i * PASS + 200, text, ...(i === 2 ? { until: duration - 700 } : {}) })));
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(card, seg(t, 150, 600));
      const pass = clamp(Math.floor((t - START) / PASS), 0, 2);
      const local = t - START - pass * PASS;
      options.forEach(({ node, dot }, i) => {
        const on = i === pass && t >= START;
        node.classList.toggle('on', on);
        dot.style.border = on ? '4px solid var(--ink)' : '1.5px solid var(--ink-4)';
      });
      set(minutes, { o: pass === 1 && t >= START ? seg(local, 0, 300) : 0.25 });
      // Cursor sweeps 00:00 → 09:00 over the pass.
      const hour = lerp(0, 9, ease.inOut(clamp(local / (PASS - 700))));
      const x = hourX(hour);
      set(now, { x: x - x0, o: t >= START ? 1 : 0 });
      set(nowLabel, { x: x - x0, o: t >= START ? 1 : 0 });
      const hh = Math.floor(hour);
      const mm = Math.floor((hour - hh) * 60);
      nowLabel.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
      const created = createdAt[pass];
      const cx = hourX(created);
      const appeared = hour >= created && t >= START;
      task.style.left = `${Math.min(Math.max(cx - 98, 40), 560)}px`;
      stem.style.left = `${cx}px`;
      if (appeared) {
        const timeSince = local - (created / 9) * (PASS - 700);
        pop(task, clamp(timeSince / 380));
        set(stem, { o: clamp(timeSince / 300) });
      } else {
        set(task, { o: 0 });
        set(stem, { o: 0 });
      }
      steps(t);
      veil(t);
    };
  },
};
