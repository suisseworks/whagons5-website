// FIG: two requests wait. The first is approved from its badge; the second is
// rejected with a written reason, its badge turns red and the Rejected action
// adds a "Needs changes" tag.
import { box, caption, center, cursor, ease, el, loopVeil, pop, rise, seg, set, setPill, type } from '../../lib/kit.js';
import { approvalBadge, taskGrid } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

export default {
  size: [800, 450],
  duration: 16000,
  poster: 13400,
  strings: withCommon({
    en: { rejectedBy: 'Rejected by', rejectedNote: 'Approval rejected', second: 'Purchase request · New ice machine', secondSpot: 'Kitchen', promptTitle: 'Reject approval', promptLabel: 'Rejection Reason (Optional)', reason: 'Please get a second quote', submit: 'Submit rejection', cancel: 'Cancel', steps: ['Approve: one click from the orange badge', 'Reject: write the reason', 'The reason travels with the decision, and the action tags the task'] },
    es: { rejectedBy: 'Rechazado por', rejectedNote: 'Aprobación rechazada', second: 'Solicitud de compra · Máquina de hielo', secondSpot: 'Cocina', promptTitle: 'Rechazar aprobación', promptLabel: 'Motivo del rechazo (opcional)', reason: 'Por favor consigue una segunda cotización', submit: 'Enviar rechazo', cancel: 'Cancelar', steps: ['Aprobar: un clic desde la insignia naranja', 'Rechazar: escribe el motivo', 'El motivo viaja con la decisión y la acción etiqueta la tarea'] },
    pt: { rejectedBy: 'Rejeitado por', rejectedNote: 'Aprovação rejeitada', second: 'Pedido de compra · Máquina de gelo', secondSpot: 'Cozinha', promptTitle: 'Rejeitar aprovação', promptLabel: 'Motivo da rejeição (opcional)', reason: 'Por favor, consiga um segundo orçamento', submit: 'Enviar rejeição', cancel: 'Cancelar', steps: ['Aprovar: um clique no selo laranja', 'Rejeitar: escreva o motivo', 'O motivo vai junto com a decisão e a ação marca a tarefa'] },
    de: { rejectedBy: 'Abgelehnt von', rejectedNote: 'Genehmigung abgelehnt', second: 'Bestellanforderung · Eismaschine', secondSpot: 'Küche', promptTitle: 'Genehmigung ablehnen', promptLabel: 'Ablehnungsgrund (optional)', reason: 'Bitte ein zweites Angebot einholen', submit: 'Ablehnung einreichen', cancel: 'Abbrechen', steps: ['Genehmigen: ein Klick auf das orange Abzeichen', 'Ablehnen: den Grund dazuschreiben', 'Der Grund reist mit, und die Aktion setzt einen Tag'] },
  }),

  build(stage, s, { duration, lang }) {
    stage.classList.add('dot-grid');
    const cols = '52px 2.1fr 0.62fr 1.45fr 0.55fr';
    const grid = taskGrid(stage, { x: 24, y: 22, w: 752, h: 180, title: s.space, headers: s.cols, cols });
    const first = grid.makeRow({ num: '#1043', name: s.request, spot: s.room, status: s.statuses.pending, people: [['TR', 'e']] });
    const second = grid.makeRow({ num: '#1044', name: s.second, spot: s.secondSpot, status: s.statuses.pending, people: [['JP', 'b']] });
    const third = grid.makeRow({ num: '#1039', name: s.rows[0][0], spot: s.rows[0][1], status: s.statuses.progress, tone: 'progress', people: [['AM', 'a']] });
    const badges = [approvalBadge(first.statusCell), approvalBadge(second.statusCell)];
    set(first.node, { y: 0 }); set(second.node, { y: 36 }); set(third.node, { y: 72 });
    const tag = el('span', 'tagchip', second.nameCell, s.tag);

    // The decision record under the grid, as the task's history shows it.
    const record = box(stage, 'card', 24, 222, 470, 84);
    record.style.cssText += ';padding:12px 14px;display:grid;gap:6px';
    const rTop = el('div', '', record);
    rTop.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;color:#b91c1c';
    el('span', 'abadge rejected', rTop).innerHTML = '<i>✕</i>';
    el('span', '', rTop, s.rejectedNote);
    el('span', 'num', rTop, '#1044').style.marginLeft = 'auto';
    const rWho = el('div', '', record);
    rWho.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--ink-2)';
    el('span', 'av b', rWho, 'LM').style.cssText = 'width:20px;height:20px;font-size:8.5px';
    el('span', '', rWho, `${s.rejectedBy} ${s.approver}`);
    el('div', '', record, lang === 'de' ? `„${s.reason}“` : `“${s.reason}”`).style.cssText = 'font-size:12.5px;font-weight:500;color:var(--ink)';

    // One popover, moved to whichever badge is open.
    const popNode = box(stage, 'pop', 0, 0, 236);
    const hd = el('div', 'pop-hd', popNode);
    el('span', 'abadge pending', hd).innerHTML = '<i>◷</i>';
    el('span', '', hd, s.approval);
    const bd = el('div', 'pop-bd', popNode);
    const who = el('div', 'who', bd);
    el('span', 'av b', who, 'LM');
    el('b', '', who, s.approver).style.fontWeight = '600';
    const whoState = el('span', 'st', who, s.pendingLbl);
    const acts = el('div', 'acts', popNode);
    const approveBtn = el('span', 'btn ok', acts, `✓ ${s.approve}`);
    const rejectBtn = el('span', 'btn no', acts, `✕ ${s.reject}`);

    // Rejection prompt.
    const shade = box(stage, '', 0, 0, 800, 450);
    shade.style.cssText += ';background:rgba(22,21,19,.28);z-index:35';
    const prompt = box(stage, 'win dlg', 210, 116, 380, 196);
    prompt.style.zIndex = '36';
    const pBody = el('div', '', prompt);
    pBody.style.cssText = 'display:grid;gap:10px;padding:16px 18px';
    el('div', 'dlg-title', pBody, s.promptTitle);
    const field = el('label', 'field', pBody);
    el('span', '', field, s.promptLabel);
    const area = el('div', 'input', field);
    area.style.cssText = 'height:58px;align-items:flex-start;padding-top:8px;white-space:normal';
    const pFoot = el('div', '', pBody);
    pFoot.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;margin-top:2px';
    el('span', 'btn', pFoot, s.cancel);
    const submit = el('span', 'btn', pFoot, s.submit);
    submit.style.cssText = 'background:#dc2626;border-color:#dc2626;color:#fff';

    const a1 = center(stage, badges[0].node);
    const a2 = center(stage, badges[1].node);
    const place = (anchor) => { popNode.style.left = `${anchor.x - 30}px`; popNode.style.top = `${anchor.y + 16}px`; };
    place(a1);
    const approveAt1 = center(stage, approveBtn);
    const rejectAt2 = { x: center(stage, rejectBtn).x, y: center(stage, rejectBtn).y + (a2.y - a1.y) };

    const OPEN1 = 1700;
    const APPROVE = 3200;
    const CLOSE1 = 3900;
    const OPEN2 = 5600;
    const REJECT = 7100;
    const PROMPT = 7400;
    const TYPE = 8100;
    const SUBMIT = 10600;
    const TAG_AT = 11300;
    const pointer = cursor(stage, [
      { at: 200, x: 420, y: 430 },
      { at: OPEN1, x: a1.x + 2, y: a1.y + 2, click: true },
      { at: APPROVE, ...approveAt1, click: true },
      { at: OPEN2, x: a2.x + 2, y: a2.y + 2, click: true },
      { at: REJECT, ...rejectAt2, click: true },
      { at: TYPE - 200, ...center(stage, area) },
      { at: SUBMIT, ...center(stage, submit), click: true },
      { at: SUBMIT + 900, x: 560, y: 410, hide: SUBMIT + 600 },
    ]);
    const steps = caption(stage, [
      { at: 300, text: s.steps[0] },
      { at: OPEN2 - 300, text: s.steps[1] },
      { at: SUBMIT + 200, text: s.steps[2], until: duration - 700 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(grid.win, seg(t, 100, 650));
      [first, second, third].forEach((row, i) => set(row.node, { o: seg(t, 250 + i * 140, 500), y: i * 36 + (1 - seg(t, 250 + i * 140, 500)) * 8 }));
      badges.forEach((badge, i) => pop(badge.node, seg(t, 700 + i * 180, 420)));

      const approved = t >= APPROVE + 120;
      const rejected = t >= SUBMIT + 120;
      badges[0].setState(approved ? 'approved' : 'pending', approved ? '1/1' : '0/1');
      badges[1].setState(rejected ? 'rejected' : 'pending', rejected ? '0/1' : '0/1');
      first.node.classList.toggle('hl', t >= OPEN1 && t < CLOSE1 + 400);
      second.node.classList.toggle('hl', t >= OPEN2 && t < TAG_AT + 1400);

      // Popover: first badge, then second badge.
      const onSecond = t >= OPEN2 - 50;
      place(onSecond ? a2 : a1);
      const o1 = seg(t, OPEN1 + 60, 300, ease.outBack) * (1 - seg(t, CLOSE1, 260));
      const o2 = seg(t, OPEN2 + 60, 300, ease.outBack) * (1 - seg(t, REJECT + 220, 220));
      const o = onSecond ? o2 : o1;
      popNode.style.display = o > 0.01 ? 'block' : 'none';
      set(popNode, { o, s: 0.96 + o * 0.04, y: (1 - o) * -6, origin: 'top left' });
      whoState.textContent = !onSecond && approved ? s.approvedLbl : s.pendingLbl;
      whoState.style.color = !onSecond && approved ? '#16a34a' : 'var(--ink-3)';
      approveBtn.classList.toggle('press', pointer.pressed(t, APPROVE));
      rejectBtn.classList.toggle('press', pointer.pressed(t, REJECT));

      // Prompt.
      const pIn = seg(t, PROMPT, 360, ease.outBack);
      const pOut = seg(t, SUBMIT + 120, 260, ease.inOut);
      const visible = t >= PROMPT && pOut < 1;
      shade.style.display = visible ? 'block' : 'none';
      prompt.style.display = visible ? 'block' : 'none';
      shade.style.opacity = String(seg(t, PROMPT, 300) * (1 - pOut));
      set(prompt, { o: pIn * (1 - pOut), s: 0.95 + pIn * 0.05, y: (1 - pIn) * 10 });
      area.classList.toggle('focus', t >= TYPE - 100 && t < SUBMIT);
      type(area, s.reason, seg(t, TYPE, 1900, ease.linear), true);
      submit.classList.toggle('press', pointer.pressed(t, SUBMIT));

      // Approved action: the first request's status moves on.
      const moved = t >= APPROVE + 700;
      setPill(first.statusPill, moved ? s.statuses.approved : s.statuses.pending, moved ? 'review' : 'todo');
      set(first.statusPill, { s: moved ? 1 + Math.sin(seg(t, APPROVE + 700, 450) * Math.PI) * 0.12 : 1 });
      rise(record, seg(t, TAG_AT + 500, 520, ease.outBack), 16);
      record.style.opacity = String(seg(t, TAG_AT + 500, 320));

      // Rejected action: tag.
      tag.style.display = t >= TAG_AT ? 'inline-flex' : 'none';
      pop(tag, seg(t, TAG_AT, 420));
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
