// FIG: the five steps of the Add New Approval wizard. Basics gets a name,
// Approvers gets one person with Require all approvers on, Trigger keeps
// "When task is created", Actions adds Change Status on approval, and Summary
// creates it; the new approval lands in the list as Active.
import { box, caption, center, cursor, ease, el, loopVeil, pop, rise, seg, set, setToggle, toggle, type } from '../../lib/kit.js';
import { injectTasksCss } from '../../lib/tasks.js';
import { withCommon } from './_strings.js';

// Labels as each language's app shows them; untranslated settings stay English.
const UI = {
  en: { others: ['Contractor in a guest room', 'Weekend overtime'], title: 'Add New Approval', stages: ['Basics', 'Approvers', 'Trigger', 'Actions', 'Summary'], name: 'Name', description: 'Description', addApprover: 'Add approver', user: 'User', search: 'Search user...', assigned: 'Assigned approvers', requirements: 'Approval requirements', requireAll: 'Require all approvers', peopleRequired: 'People required', onePerson: '1 person', triggerType: 'Trigger Type', onCreate: 'When task is created', conditional: 'Conditional', approved: 'Approved', rejected: 'Rejected', runAfter: 'Run after approval', addAction: 'Add Action', actionTypes: ['Add Tags', 'Remove Tags', 'Change Status', 'Assign User'], changeStatus: 'Change Status', create: 'Create Approval', next: 'Next', back: 'Back', list: 'Approvals', active: 'Active', oneAction: '1 action' },
  es: { others: ['Contratista en habitación de huésped', 'Horas extra de fin de semana'], title: 'Agregar nueva aprobación', stages: ['Básico', 'Aprobadores', 'Disparador', 'Acciones', 'Resumen'], name: 'Nombre', description: 'Descripción', addApprover: 'Agregar aprobador', user: 'Usuario', search: 'Buscar usuario...', assigned: 'Aprobadores asignados', requirements: 'Requisitos de aprobación', requireAll: 'Requerir todos los aprobadores', peopleRequired: 'Personas requeridas', onePerson: '1 persona', triggerType: 'Tipo de disparador', onCreate: 'Cuando se crea la tarea', conditional: 'Condicional', approved: 'Aprobado', rejected: 'Rechazado', runAfter: 'Después de aprobar', addAction: 'Agregar acción', actionTypes: ['Agregar etiquetas', 'Quitar etiquetas', 'Cambiar estado', 'Asignar usuario'], changeStatus: 'Cambiar estado', create: 'Crear aprobación', next: 'Siguiente', back: 'Atrás', list: 'Aprobaciones', active: 'Activa', oneAction: '1 acción' },
  pt: { others: ['Prestador em quarto de hóspede', 'Hora extra de fim de semana'], title: 'Add New Approval', stages: ['Básico', 'Aprovadores', 'Disparador', 'Ações', 'Resumo'], name: 'Name', description: 'Description', addApprover: 'Adicionar aprovador', user: 'Usuário', search: 'Pesquisar usuário...', assigned: 'Aprovadores atribuídos', requirements: 'Requisitos de aprovação', requireAll: 'Require all approvers', peopleRequired: 'People required', onePerson: '1 person', triggerType: 'Trigger Type', onCreate: 'When task is created', conditional: 'Conditional', approved: 'Aprovado', rejected: 'Rejeitado', runAfter: 'Depois de aprovar', addAction: 'Adicionar ação', actionTypes: ['Adicionar tags', 'Remover tags', 'Alterar status', 'Atribuir usuário'], changeStatus: 'Alterar status', create: 'Criar aprovação', next: 'Próximo', back: 'Voltar', list: 'Approvals', active: 'Active', oneAction: '1 ação' },
  de: { others: ['Handwerker im Gästezimmer', 'Überstunden am Wochenende'], title: 'Add New Approval', stages: ['Basics', 'Approvers', 'Trigger', 'Actions', 'Summary'], name: 'Name', description: 'Description', addApprover: 'Add approver', user: 'User', search: 'Search user...', assigned: 'Assigned approvers', requirements: 'Approval requirements', requireAll: 'Require all approvers', peopleRequired: 'People required', onePerson: '1 person', triggerType: 'Trigger Type', onCreate: 'When task is created', conditional: 'Conditional', approved: 'Genehmigt', rejected: 'Abgelehnt', runAfter: 'Nach Genehmigung ausführen', addAction: 'Aktion hinzufügen', actionTypes: ['Tags hinzufügen', 'Tags entfernen', 'Status ändern', 'Benutzer zuweisen'], changeStatus: 'Status ändern', create: 'Create Approval', next: 'Next', back: 'Back', list: 'Approvals', active: 'Active', oneAction: '1 Aktion' },
};

export default {
  size: [800, 450],
  duration: 17600,
  poster: 13000,
  strings: withCommon({
    en: { ...UI.en, steps: ['Name what is being approved', 'One approver, by name. Everyone must say yes', 'It starts when the task is created', 'On approval, the status moves on its own', 'Create it, and it is ready to attach'] },
    es: { ...UI.es, steps: ['Nombra lo que se aprueba', 'Un aprobador por nombre. Todos deben decir que sí', 'Empieza cuando se crea la tarea', 'Al aprobar, el estado avanza solo', 'Créala y está lista para conectar'] },
    pt: { ...UI.pt, steps: ['Dê nome ao que é aprovado', 'Um aprovador pelo nome. Todos precisam dizer sim', 'Começa quando a tarefa é criada', 'Ao aprovar, o status avança sozinho', 'Crie e ela está pronta para ligar'] },
    de: { ...UI.de, steps: ['Benennen, was genehmigt wird', 'Eine Person namentlich. Alle müssen zustimmen', 'Startet, wenn die Aufgabe erstellt wird', 'Bei Genehmigung wechselt der Status von selbst', 'Anlegen, und sie ist bereit zum Verbinden'] },
  }),

  build(stage, s, { duration }) {
    injectTasksCss();
    stage.classList.add('dot-grid');

    // Approvals list behind the dialog.
    const list = box(stage, 'win', 40, 26, 720, 220);
    const lhd = el('div', 'win-hd', list);
    el('span', 'ico', lhd, '✓');
    el('span', '', lhd, s.list);
    el('span', 'sp', lhd);
    const listRow = (name, initials, tone) => {
      const row = el('div', 'trow', list);
      row.style.cssText = 'grid-template-columns:1fr auto auto;height:44px';
      el('span', 'name', row, name);
      const who = el('span', '', row);
      who.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;color:var(--ink-3)';
      el('span', `av ${tone}`, who, initials).style.cssText = 'width:20px;height:20px;font-size:8.5px';
      el('span', '', who, s.onePerson);
      const on = el('span', '', row);
      on.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600';
      setToggle(toggle(on), 1);
      el('span', '', on, s.active);
    };
    listRow(s.others[0], 'RC', 'a');
    listRow(s.others[1], 'GM', 'd');
    const lrow = el('div', 'trow', list);
    lrow.style.cssText = 'grid-template-columns:1fr auto auto;height:44px';
    el('span', 'name', lrow, s.approval);
    const lav = el('span', '', lrow);
    lav.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;color:var(--ink-3)';
    el('span', 'av b', lav, 'LM').style.cssText = 'width:20px;height:20px;font-size:8.5px';
    el('span', '', lav, s.onePerson);
    const lact = el('span', '', lrow);
    lact.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600';
    const lsw = toggle(lact);
    setToggle(lsw, 1);
    el('span', '', lact, s.active);

    // Dialog.
    const dlg = box(stage, 'win dlg', 150, 18, 500, 352);
    dlg.style.zIndex = '20';
    const head = el('div', '', dlg);
    head.style.cssText = 'padding:14px 18px 10px';
    el('div', 'dlg-title', head, s.title);
    const pills = el('div', '', head);
    pills.style.cssText = 'display:flex;gap:5px;margin-top:10px';
    const stagePills = s.stages.map((label, i) => {
      const node = el('span', '', pills, `${i + 1}. ${label}`);
      node.style.cssText = 'display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:11px;font-size:10.5px;font-weight:600;border:1px solid var(--line-2);color:var(--ink-3);white-space:nowrap';
      return node;
    });
    const body = el('div', '', dlg);
    body.style.cssText = 'position:relative;height:236px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)';
    const panel = () => {
      const node = el('div', '', body);
      node.style.cssText = 'position:absolute;inset:0;padding:14px 18px;display:grid;gap:11px;align-content:start';
      return node;
    };
    const foot = el('div', '', dlg);
    foot.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;padding:11px 18px';
    el('span', 'btn', foot, s.back);
    const nextBtn = el('span', 'btn dark', foot, s.next);

    // 1. Basics
    const p1 = panel();
    const f1 = el('label', 'field', p1);
    el('span', '', f1, s.name);
    const nameInput = el('div', 'input', f1);
    const f2 = el('label', 'field', p1);
    el('span', '', f2, s.description);
    el('div', 'input', f2).style.height = '54px';

    // 2. Approvers
    const p2 = panel();
    el('div', 'lbl ink', p2, s.addApprover);
    const addRow = el('div', '', p2);
    addRow.style.cssText = 'display:grid;grid-template-columns:110px 1fr;gap:8px';
    el('span', 'input', addRow, `${s.user} ▾`);
    const search = el('span', 'input', addRow);
    search.style.color = 'var(--ink-3)';
    const result = el('div', '', p2);
    result.style.cssText = 'position:absolute;left:136px;right:18px;top:68px;display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--line-2);border-radius:9px;background:#fff;box-shadow:0 10px 24px rgba(60,44,22,.16);font-size:11.5px;z-index:2';
    el('span', 'av b', result, 'LM').style.cssText = 'width:20px;height:20px;font-size:8.5px';
    el('b', '', result, s.approver);
    el('span', 'muted', result, s.approverRole);
    el('div', 'lbl ink', p2, s.assigned);
    const assigned = el('div', '', p2);
    assigned.style.cssText = 'display:flex;align-items:center;gap:8px;height:34px;padding:0 10px;border:1px solid var(--line);border-radius:9px;background:var(--paper-2);font-size:11.5px';
    el('span', 'av b', assigned, 'LM').style.cssText = 'width:20px;height:20px;font-size:8.5px';
    el('b', '', assigned, s.approver);
    el('span', 'muted', assigned, s.user).style.marginLeft = 'auto';
    const req = el('div', '', p2);
    req.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border:1px solid var(--line);border-radius:9px';
    const reqText = el('span', '', req);
    reqText.style.cssText = 'display:grid;gap:1px';
    el('span', 'lbl ink', reqText, s.requirements).style.fontSize = '9px';
    el('b', '', reqText, s.requireAll).style.fontSize = '12px';
    const reqSw = toggle(req);
    const people = el('div', '', p2);
    people.style.cssText = 'font-size:11px;color:var(--ink-3)';
    people.textContent = `${s.peopleRequired}: ${s.onePerson}`;

    // 3. Trigger
    const p3 = panel();
    const f3 = el('label', 'field', p3);
    el('span', '', f3, s.triggerType);
    const trig = el('div', 'input', f3);
    trig.textContent = `${s.onCreate} ▾`;
    const trigMenu = el('div', 'menu', p3);
    trigMenu.style.cssText += ';position:static;width:260px';
    const optCreate = el('div', 'mi', trigMenu, `✓ ${s.onCreate}`);
    el('div', 'mi', trigMenu, `   ${s.conditional}`).style.color = 'var(--ink-3)';

    // 4. Actions
    const p4 = panel();
    const tabs = el('div', 'tabs', p4);
    tabs.style.cssText += ';padding:0;margin:-4px 0 0';
    el('span', 'on', tabs, s.approved);
    el('span', '', tabs, s.rejected);
    const runRow = el('div', '', p4);
    runRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:var(--ink-2)';
    el('span', '', runRow, s.runAfter);
    const addAction = el('span', 'btn dark', runRow, `+ ${s.addAction}`);
    const actionMenu = el('div', 'menu', p4);
    actionMenu.style.cssText += ';position:absolute;right:18px;top:78px;width:200px';
    const actionItems = s.actionTypes.map((label) => el('div', 'mi', actionMenu, label));
    const actionRow = el('div', '', p4);
    actionRow.style.cssText = 'display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border:1px solid var(--line);border-radius:9px;background:var(--paper-2);font-size:12px';
    el('b', '', actionRow, s.changeStatus);
    el('span', 'muted', actionRow, '→');
    el('span', 'pill review', actionRow, s.statuses.approved);

    // 5. Summary
    const p5 = panel();
    const sum = el('div', '', p5);
    sum.style.cssText = 'display:grid;gap:9px;padding:14px;border:1px solid var(--line);border-radius:11px;background:var(--paper-2)';
    el('div', 'dlg-title', sum, s.approval);
    const line = (icon, text) => {
      const node = el('div', '', sum);
      node.style.cssText = 'display:flex;align-items:center;gap:9px;font-size:12px;color:var(--ink-2)';
      el('span', 'mono', node, icon).style.cssText = 'width:16px;color:var(--red);font-size:11px';
      el('span', '', node, text);
    };
    line('◷', s.onCreate);
    line('◉', `${s.approver} · ${s.onePerson}`);
    line('✓', s.requireAll);
    line('↻', `${s.oneAction}: ${s.changeStatus} → ${s.statuses.approved}`);

    const panels = [p1, p2, p3, p4, p5];

    // ── Choreography ─────────────────────────────────────
    const STAGE_AT = [0, 2700, 7000, 9300, 13100];
    const NEXTS = STAGE_AT.slice(1).map((at) => at - 250);
    const PICK = 4600;
    const REQ = 5700;
    const ADD = 10300;
    const PICK_ACTION = 11300;
    const CREATE = 15000;
    const nextAt = center(stage, nextBtn);
    const pointer = cursor(stage, [
      { at: 200, x: 420, y: 430 },
      { at: NEXTS[0], ...nextAt, click: true },
      { at: PICK, ...center(stage, result, 20, 0), click: true },
      { at: REQ, ...center(stage, reqSw), click: false },
      { at: NEXTS[1], ...nextAt, click: true },
      { at: 7900, ...center(stage, optCreate, 40, 0), click: true },
      { at: NEXTS[2], ...nextAt, click: true },
      { at: ADD, ...center(stage, addAction), click: true },
      { at: PICK_ACTION, ...center(stage, actionItems[2]), click: true },
      { at: NEXTS[3], ...nextAt, click: true },
      { at: CREATE, ...nextAt, click: true },
      { at: CREATE + 900, x: 600, y: 420, hide: CREATE + 500 },
    ]);
    const steps = caption(stage, [
      { at: 300, text: s.steps[0] },
      { at: STAGE_AT[1] + 100, text: s.steps[1] },
      { at: STAGE_AT[2] + 100, text: s.steps[2] },
      { at: STAGE_AT[3] + 100, text: s.steps[3] },
      { at: STAGE_AT[4] + 100, text: s.steps[4], until: duration - 700 },
    ]);
    const veil = loopVeil(stage, duration);

    return (t) => {
      rise(list, seg(t, 50, 500));
      const gone = seg(t, CREATE + 150, 450, ease.inOut);
      set(dlg, { o: seg(t, 150, 500) * (1 - gone), y: (1 - seg(t, 150, 600)) * 14 + gone * 10, s: 1 - gone * 0.04 });
      dlg.style.display = gone >= 1 ? 'none' : 'block';
      const current = STAGE_AT.reduce((acc, at, i) => (t >= at ? i : acc), 0);
      stagePills.forEach((node, i) => {
        const done = i < current;
        node.style.background = i === current ? 'var(--ink)' : done ? 'var(--paper-3)' : '#fff';
        node.style.color = i === current ? '#fff' : done ? 'var(--ink)' : 'var(--ink-3)';
        node.style.borderColor = i === current ? 'var(--ink)' : 'var(--line-2)';
      });
      panels.forEach((node, i) => {
        const inP = seg(t, STAGE_AT[i], 320);
        const outP = i < panels.length - 1 ? seg(t, STAGE_AT[i + 1] - 120, 160) : 0;
        node.style.display = t >= STAGE_AT[i] && outP < 1 ? 'grid' : 'none';
        set(node, { o: inP * (1 - outP), x: (1 - inP) * 14 - outP * 10 });
      });
      nextBtn.textContent = current === 4 ? s.create : s.next;
      nextBtn.className = current === 4 ? 'btn primary' : 'btn dark';
      nextBtn.classList.toggle('press', NEXTS.some((at) => pointer.pressed(t, at)) || pointer.pressed(t, CREATE));

      // Basics
      type(nameInput, s.approval, seg(t, 600, 1200, ease.linear), true);
      nameInput.classList.toggle('focus', t > 500 && t < NEXTS[0]);
      // Approvers
      type(search, 'Laura', seg(t, STAGE_AT[1] + 500, 700, ease.linear), true);
      search.classList.toggle('focus', t > STAGE_AT[1] + 400 && t < PICK);
      search.style.color = t < PICK ? 'var(--ink)' : 'var(--ink-3)';
      if (t >= PICK) search.textContent = s.search;
      result.style.display = t >= STAGE_AT[1] + 1300 && t < PICK + 120 ? 'flex' : 'none';
      rise(result, seg(t, STAGE_AT[1] + 1300, 260), 6);
      const added = seg(t, PICK + 80, 380, ease.outBack);
      assigned.style.opacity = String(0.25 + 0.75 * added);
      set(assigned, { o: 0.25 + 0.75 * added, s: 0.97 + added * 0.03 });
      setToggle(reqSw, 1);
      req.style.boxShadow = t >= REQ - 300 && t < REQ + 900 ? '0 0 0 2px var(--ink)' : 'none';
      people.style.opacity = String(seg(t, PICK + 300, 300));
      // Trigger
      trig.classList.toggle('focus', t >= STAGE_AT[2] + 300 && t < 8200);
      trigMenu.style.display = t >= STAGE_AT[2] + 500 && t < 8000 ? 'grid' : 'none';
      rise(trigMenu, seg(t, STAGE_AT[2] + 500, 260), 6);
      optCreate.classList.toggle('hover', t >= 7600);
      // Actions
      addAction.classList.toggle('press', pointer.pressed(t, ADD));
      actionMenu.style.display = t >= ADD + 80 && t < PICK_ACTION + 150 ? 'grid' : 'none';
      rise(actionMenu, seg(t, ADD + 80, 240), 6);
      actionItems.forEach((item, i) => item.classList.toggle('hover', i === 2 && t >= PICK_ACTION - 500));
      actionRow.style.display = t >= PICK_ACTION + 120 ? 'flex' : 'none';
      pop(actionRow, seg(t, PICK_ACTION + 120, 420));
      // The new approval lands in the list.
      const landed = seg(t, CREATE + 450, 520, ease.outBack);
      set(lrow, { o: landed, y: (1 - landed) * -10 });
      lrow.classList.toggle('hl', t >= CREATE + 450 && t < CREATE + 2000);

      pointer.render(t);
      steps(t);
      veil(t);
    };
  },
};
