// FIG: a purchase request arrives with an orange approval badge, the approver
// opens it and approves, the badge turns green, the Approved action moves the
// status, and the requester gets a notification.
import { box, caption, center, cursor, ease, el, loopVeil, pop, rise, seg, set, setPill } from '../../lib/kit.js';
import { approvalBadge, taskGrid, toast } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

export default {
  size: [800, 450],
  duration: 13600,
  poster: 9800,
  strings: withCommon({
    en: { steps: ['The request arrives with an orange badge', 'The approver opens the badge and decides', 'Approved: the badge turns green and the status moves', 'The person who asked gets a notification'] },
    es: { steps: ['La solicitud llega con una insignia naranja', 'El aprobador abre la insignia y decide', 'Aprobada: la insignia se pone verde y el estado avanza', 'Quien pidió recibe una notificación'] },
    pt: { steps: ['O pedido chega com um selo laranja', 'O aprovador abre o selo e decide', 'Aprovado: o selo fica verde e o status avança', 'Quem pediu recebe uma notificação'] },
    de: { steps: ['Die Anfrage kommt mit orangem Abzeichen', 'Die freigebende Person öffnet es und entscheidet', 'Genehmigt: Abzeichen grün, der Status geht weiter', 'Die anfragende Person wird benachrichtigt'] },
  }),

  build(stage, s, { duration }) {
    stage.classList.add('dot-grid');
    const cols = '52px 1.9fr 0.7fr 1.55fr 0.62fr';
    const grid = taskGrid(stage, { x: 24, y: 22, w: 752, h: 300, title: s.space, headers: s.cols, cols });
    const tones = [['AM', 'a'], ['JP', 'b'], ['SV', 'c'], ['LR', 'd']];
    const statusOf = [['progress', s.statuses.progress], ['pending', s.statuses.pending], ['progress', s.statuses.progress], ['done', s.statuses.done]];
    const rows = s.rows.map(([name, spot], i) => grid.makeRow({ num: `#${1039 - i}`, name, spot, status: statusOf[i][1], tone: statusOf[i][0] === 'pending' ? 'todo' : statusOf[i][0], people: [tones[i]] }));
    const fresh = grid.makeRow({ num: '#1043', name: s.request, spot: s.room, status: s.statuses.pending, tone: 'todo', people: [['TR', 'e']] });
    const badge = approvalBadge(fresh.statusCell);

    // Approval popover, anchored under the badge once layout is final.
    rows.forEach((r, i) => set(r.node, { y: (i + 1) * 36 }));
    set(fresh.node, { y: 0 });
    const anchor = center(stage, badge.node);
    const popNode = box(stage, 'pop', anchor.x - 40, anchor.y + 16, 264);
    const hd = el('div', 'pop-hd', popNode);
    el('span', 'abadge pending', hd).innerHTML = '<i>◷</i>';
    el('span', '', hd, s.approval);
    const bd = el('div', 'pop-bd', popNode);
    const progressRow = el('div', '', bd);
    progressRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3)';
    el('span', '', progressRow, s.progress);
    const fraction = el('span', '', progressRow, '0/1');
    const bar = el('div', 'bar', bd);
    const fill = el('i', '', bar);
    const who = el('div', 'who', bd);
    el('span', 'av b', who, 'LM');
    const whoText = el('span', '', who);
    whoText.style.cssText = 'display:grid;gap:1px';
    el('b', '', whoText, s.approver).style.fontWeight = '600';
    el('span', 'muted', whoText, s.approverRole).style.fontSize = '10.5px';
    const whoState = el('span', 'st', who, s.pendingLbl);
    const acts = el('div', 'acts', popNode);
    const approveBtn = el('span', 'btn ok', acts, `✓ ${s.approve}`);
    el('span', 'btn no', acts, `✕ ${s.reject}`);

    const note = toast(stage, { x: 446, y: 366, w: 330, icon: '✓', iconBg: '#ecfdf3', iconFg: '#16a34a', title: s.request, sub: `${s.approver} ${s.approvedWord}` });

    // ── Choreography ─────────────────────────────────────
    const NEW_AT = 900;
    const OPEN_AT = 3000;
    const APPROVE_AT = 5000;
    const CLOSE_AT = 6000;
    const STATUS_AT = 6700;
    const TOAST_AT = 8600;
    const pointer = cursor(stage, [
      { at: 300, x: 330, y: 440 },
      { at: OPEN_AT - 100, x: anchor.x + 2, y: anchor.y + 2, click: false },
      { at: OPEN_AT, x: anchor.x + 2, y: anchor.y + 2, click: true },
      { at: APPROVE_AT - 150, ...center(stage, approveBtn) },
      { at: APPROVE_AT, ...center(stage, approveBtn), click: true },
      { at: STATUS_AT + 600, x: 620, y: 300, hide: STATUS_AT + 300 },
    ]);
    const steps = caption(stage, [
      { at: 350, text: s.steps[0] },
      { at: OPEN_AT - 400, text: s.steps[1] },
      { at: APPROVE_AT + 300, text: s.steps[2] },
      { at: TOAST_AT - 200, text: s.steps[3], until: duration - 700 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(grid.win, seg(t, 100, 650));
      // The new request slides in at the top and pushes the others down.
      const arrive = seg(t, NEW_AT, 650, ease.outBack);
      const push = seg(t, NEW_AT, 500, ease.inOut);
      rows.forEach((r, i) => set(r.node, { y: i * 36 + push * 36 }));
      set(fresh.node, { o: Math.min(1, arrive * 1.5), y: (1 - arrive) * -14 });
      fresh.node.classList.toggle('hl', t >= NEW_AT && t < CLOSE_AT + 1800);
      pop(badge.node, seg(t, NEW_AT + 450, 420));
      const approved = t >= APPROVE_AT + 150;
      badge.setState(approved ? 'approved' : 'pending', approved ? '1/1' : '0/1');
      badge.node.classList.toggle('ring', !approved && t > NEW_AT + 900 && Math.floor((t - NEW_AT) / 600) % 2 === 0 && t < OPEN_AT);

      // Popover.
      const open = seg(t, OPEN_AT + 80, 320, ease.outBack);
      const close = seg(t, CLOSE_AT, 280, ease.inOut);
      popNode.style.display = t >= OPEN_AT ? 'block' : 'none';
      set(popNode, { o: open * (1 - close), y: (1 - open) * -6 + close * -4, s: 0.96 + open * 0.04, origin: 'top left' });
      approveBtn.classList.toggle('press', pointer.pressed(t, APPROVE_AT));
      whoState.textContent = approved ? s.approvedLbl : s.pendingLbl;
      whoState.style.color = approved ? '#16a34a' : 'var(--ink-3)';
      fraction.textContent = approved ? '1/1' : '0/1';
      fill.style.width = `${seg(t, APPROVE_AT + 150, 500) * 100}%`;

      // The Approved action changes the status.
      const moved = t >= STATUS_AT;
      setPill(fresh.statusPill, moved ? s.statuses.approved : s.statuses.pending, moved ? 'review' : 'todo');
      set(fresh.statusPill, { s: moved ? 1 + Math.sin(seg(t, STATUS_AT, 450) * Math.PI) * 0.12 : 1 });

      rise(note, seg(t, TOAST_AT, 520, ease.outBack), 18);
      note.style.opacity = String(seg(t, TOAST_AT, 300));
      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
