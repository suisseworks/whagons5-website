// FIG: closing checklist for the KPI Cards article.
import { checklistScene } from '../../lib/checklist.js';

export default checklistScene({
  strings: {
    es: {
      kicker: 'Tarjetas KPI',
      title: 'Tu lista para las Tarjetas KPI',
      caption: 'Revísala antes de mostrarle el tablero al equipo',
      groups: [
        { title: 'Las tarjetas', items: ['Empezaste con una plantilla', 'Cada espacio muestra solo las tarjetas que se usan'] },
        { title: 'El filtro', items: ['El equipo sabe que En Progreso y Finalizadas Hoy filtran la grilla', 'Las tarjetas desde cero están activadas'] },
        { title: 'El orden', items: ['Lo urgente queda a la izquierda', 'Cada persona ajusta su orden si lo necesita'] },
        { title: 'Quién edita', items: ['Solo los roles con permiso crean o editan tarjetas', 'El tablero se revisa en la reunión del turno'] },
      ],
    },
    en: {
      kicker: 'KPI Cards',
      title: 'Your checklist for KPI Cards',
      caption: 'Go through it before you show the board to the team',
      groups: [
        { title: 'The cards', items: ['You started from a template', 'Each space shows only the cards people use'] },
        { title: 'Filtering', items: ['The team knows In Progress and Finished Today filter the grid', 'Cards made from scratch are switched on'] },
        { title: 'Order', items: ["What's urgent sits on the left", 'Each person adjusts their own order if needed'] },
        { title: 'Who edits', items: ['Only roles with permission create or edit cards', 'The board gets a look in the shift meeting'] },
      ],
    },
  },
});
