// Social card for the Approvals guide.
import { el } from '../../lib/kit.js';
import { ogScene } from '../../lib/og.js';
import { injectTasksCss } from '../../lib/tasks.js';

export default ogScene({
  strings: {
    en: { chip: 'Guides', title: 'Approvals: the right yes before the work starts', meta: 'Guide · Whagons', items: ['2 mattresses', 'Ice machine', 'Pool chairs ×12'], pending: 'Pending', approved: 'Approved to buy' },
    es: { chip: 'Guías', title: 'Aprobaciones: el sí correcto antes de empezar', meta: 'Guía · Whagons', items: ['2 colchones', 'Máquina de hielo', 'Camastros ×12'], pending: 'Pendiente', approved: 'Aprobada para comprar' },
    pt: { chip: 'Guias', title: 'Aprovações: o sim certo antes de começar', meta: 'Guia · Whagons', items: ['2 colchões', 'Máquina de gelo', 'Espreguiçadeiras ×12'], pending: 'Pendente', approved: 'Aprovado para compra' },
    de: { chip: 'Leitfäden', title: 'Genehmigungen: das richtige Ja vor der Arbeit', meta: 'Leitfaden · Whagons', items: ['2 Matratzen', 'Eismaschine', 'Poolliegen ×12'], pending: 'Offen', approved: 'Kauf freigegeben' },
  },
  art(panel, s) {
    injectTasksCss();
    panel.style.padding = '16px';
    s.items.forEach((item, i) => {
      const approved = i > 0;
      const card = el('div', '', panel);
      card.style.cssText = `display:grid;gap:6px;margin-top:${i ? 10 : 0}px;padding:10px 11px;border:1px solid var(--line);border-radius:10px;background:#fff`;
      const top = el('div', '', card);
      top.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:6px';
      el('span', '', top, item).style.cssText = 'font-size:11.5px;font-weight:600;white-space:nowrap';
      el('span', `abadge ${approved ? 'approved' : 'pending ring'}`, top).innerHTML = `<i>${approved ? '✓' : '◷'}</i><span>${approved ? '1/1' : '0/1'}</span>`;
      el('span', `pill ${approved ? 'review' : 'todo'}`, card, approved ? s.approved : s.pending).style.cssText = 'justify-self:start;font-size:9.5px';
    });
  },
});
