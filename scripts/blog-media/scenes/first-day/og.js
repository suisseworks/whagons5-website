// Social card for the first-day guide.
import { el } from '../../lib/kit.js';
import { ogScene } from '../../lib/og.js';
import { injectTasksCss, photo } from '../../lib/tasks.js';

export default ogScene({
  strings: {
    en: { chip: 'Guides', title: 'Your first day with tasks in Whagons', meta: 'Guide · Whagons', task: 'Replace leaking tap', spot: 'Room 214', steps: ['Pending', 'In Progress', 'Completed'] },
    es: { chip: 'Guías', title: 'Tu primer día con tareas en Whagons', meta: 'Guía · Whagons', task: 'Cambiar llave que gotea', spot: 'Hab 214', steps: ['Pendiente', 'En progreso', 'Completada'] },
    pt: { chip: 'Guias', title: 'Seu primeiro dia com tarefas no Whagons', meta: 'Guia · Whagons', task: 'Trocar torneira pingando', spot: 'Quarto 214', steps: ['Pendente', 'Em andamento', 'Concluída'] },
    de: { chip: 'Leitfäden', title: 'Ihr erster Tag mit Aufgaben in Whagons', meta: 'Leitfaden · Whagons', task: 'Tropfenden Hahn tauschen', spot: 'Zimmer 214', steps: ['Offen', 'In Arbeit', 'Erledigt'] },
  },
  art(panel, s) {
    injectTasksCss();
    panel.style.padding = '16px';
    const pic = photo(panel, 204, 104);
    pic.style.borderRadius = '10px';
    el('div', '', panel, s.task).style.cssText = 'margin-top:12px;font-size:13px;font-weight:600';
    el('div', 'muted', panel, s.spot).style.cssText = 'margin-top:2px;font-size:11px';
    const row = el('div', '', panel);
    row.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-top:12px';
    ['todo', 'progress', 'done'].forEach((tone, i) => el('span', `pill ${tone}`, row, s.steps[i]).style.fontSize = '9.5px');
  },
});
