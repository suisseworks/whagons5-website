// Cover loop (4:3): requests arrive with an orange badge, the approver's yes
// lands on each one, the badge turns green and the card files away. Seamless.
import { box, clamp, ease, el, set } from '../../lib/kit.js';
import { injectTasksCss } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

const PERIOD = 2400;
const CYCLE = 3;

export default {
  size: [600, 450],
  duration: PERIOD * CYCLE,
  poster: PERIOD + 1700,
  strings: withCommon({
    en: { kicker: 'Everyday work', name: 'Approvals', line: 'The right yes, on the task', items: ['2 mattresses · Rm 412', 'Ice machine · Kitchen', 'Pool chairs ×12 · Pool'] },
    es: { kicker: 'Trabajo diario', name: 'Aprobaciones', line: 'El sí correcto, en la tarea', items: ['2 colchones · Hab 412', 'Máquina de hielo · Cocina', 'Camastros ×12 · Alberca'] },
    pt: { kicker: 'Trabalho diário', name: 'Aprovações', line: 'O sim certo, na tarefa', items: ['2 colchões · Qto 412', 'Máquina de gelo · Cozinha', 'Espreguiçadeiras ×12 · Piscina'] },
    de: { kicker: 'Arbeitsalltag', name: 'Genehmigungen', line: 'Das richtige Ja, an der Aufgabe', items: ['2 Matratzen · Zi. 412', 'Eismaschine · Küche', 'Poolliegen ×12 · Pool'] },
  }),

  build(stage, s) {
    injectTasksCss();
    stage.classList.add('dot-grid');
    const arc = box(stage, '', 250, 30, 400, 400);
    arc.innerHTML = '<svg viewBox="0 0 100 100" width="400" height="400"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(212,49,10,.09)" stroke-width="6"/><path d="M31 51l13 13 26-28" fill="none" stroke="rgba(22,163,74,.16)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const title = box(stage, '', 40, 38, 260, 110);
    el('div', 'lbl ink', title, s.kicker);
    el('div', 'title', title, s.name).style.cssText = 'margin-top:6px;font-size:30px';
    el('div', 'muted', title, s.line).style.cssText = 'margin-top:8px;font-size:13px';

    // Approver card.
    const who = box(stage, 'win', 40, 170, 220, 74);
    who.style.cssText += ';display:flex;align-items:center;gap:10px;padding:0 14px';
    el('span', 'av b', who, 'LM').style.cssText = 'width:34px;height:34px;font-size:12px';
    const wt = el('div', '', who);
    wt.style.cssText = 'display:grid;gap:2px';
    el('b', '', wt, s.approver).style.fontSize = '13px';
    el('span', 'muted', wt, s.approverRole).style.fontSize = '11px';

    const slots = [0, 1, 2, 3];
    const cards = slots.map(() => {
      const card = box(stage, 'card', 276, 0, 290, 84);
      card.style.cssText += ';display:grid;grid-template-columns:1fr auto;align-items:center;gap:5px 10px;padding:11px 14px';
      el('span', 'lbl ink', card, s.request.split(' · ')[0]).style.cssText = 'font-size:9px;letter-spacing:.07em';
      const badge = el('span', 'abadge pending', card);
      badge.style.gridRow = 'span 2';
      const name = el('span', '', card);
      name.style.cssText = 'font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
      const icon = el('i', '', badge, '◷');
      const frac = el('span', '', badge, '0/1');
      const status = el('span', 'pill todo', card, s.statuses.pending);
      status.style.gridColumn = '1 / -1';
      status.style.justifySelf = 'start';
      return { card, name, badge, icon, frac, status };
    });
    const stamp = box(stage, '', 0, 0, 30, 30);
    stamp.style.cssText += ';display:grid;place-items:center;border-radius:50%;background:#16a34a;color:#fff;font-size:15px;font-weight:700;box-shadow:0 8px 18px rgba(22,163,74,.35);z-index:5';
    stamp.textContent = '✓';

    const foot = box(stage, '', 40, 404, 240, 16);
    foot.innerHTML = '<span class="mark" style="width:36px;height:14px;vertical-align:middle"></span>';

    return (t) => {
      const tick = Math.floor(t / PERIOD) % CYCLE;
      const phase = (t % PERIOD) / PERIOD;
      const move = ease.inOut(clamp((phase - 0.02) / 0.3));
      const decide = clamp((phase - 0.42) / 0.22);
      cards.forEach((c, slot) => {
        const y = 100 + (slot - 1 + move) * 96;
        const serial = tick - slot + 99;
        c.name.textContent = s.items[((serial % 3) + 3) % 3];
        const approved = slot >= 2 || (slot === 1 && decide >= 1);
        c.badge.className = `abadge ${approved ? 'approved' : 'pending'}`;
        c.icon.textContent = approved ? '✓' : '◷';
        c.frac.textContent = approved ? '1/1' : '0/1';
        c.status.className = `pill ${approved ? 'review' : 'todo'}`;
        c.status.textContent = approved ? s.statuses.approved : s.statuses.pending;
        const enter = slot === 0 ? move : 1;
        const leave = slot === slots.length - 1 ? move : 0;
        const depth = clamp((slot - 1 + move) / 3);
        set(c.card, { o: enter * (1 - leave) * (1 - depth * 0.4), y, s: 1 - depth * 0.05, origin: 'center top' });
        if (slot === 1) c.badge.classList.toggle('ring', !approved && Math.floor(phase * 8) % 2 === 0);
      });
      // The approver's yes flies from their card to the waiting request.
      const fly = ease.inOut(clamp((phase - 0.3) / 0.14));
      const land = clamp((phase - 0.44) / 0.12);
      const sx = 230 + (520 - 230) * fly;
      const sy = 192 + (124 - 192) * fly - Math.sin(fly * Math.PI) * 50;
      set(stamp, { o: phase > 0.28 && land < 1 ? 1 - land : 0, x: sx, y: sy, s: 0.8 + Math.sin(fly * Math.PI) * 0.35 });
    };
  },
};
