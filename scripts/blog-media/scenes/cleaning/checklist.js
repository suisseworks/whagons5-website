// FIG: closing checklist for the Cleaning article.
import { checklistScene } from '../../lib/checklist.js';

export default checklistScene({
  strings: {
    es: {
      kicker: 'Limpieza',
      title: 'Tu lista antes del primer turno',
      caption: 'Revísala con ama de llaves antes del primer turno',
      groups: [
        { title: 'La base', items: ['Las habitaciones son spots de un tipo aplicable', 'Existe una plantilla para la tarea de limpieza'] },
        { title: 'Los estados', items: ['Están Sucia, En limpieza y Limpia, más Inspeccionada si se usa', 'Los estados listos tienen marcado Estado Limpio'] },
        { title: 'La conexión', items: ['Cada estado de la tarea tiene su estado de limpieza', 'El estado final de la tarea lleva a un estado limpio'] },
        { title: 'El turno', items: ['Alguien revisa el Progreso del día al abrir', 'Quien cambia estados a mano tiene el permiso'] },
      ],
    },
    en: {
      kicker: 'Cleaning',
      title: 'Your checklist before the first shift',
      caption: 'Go through it with housekeeping before the first shift',
      groups: [
        { title: 'The basics', items: ['Rooms are spots of an applicable type', 'There is a template for the cleaning task'] },
        { title: 'Statuses', items: ['Dirty, Cleaning and Clean exist, plus Inspected if you use it', 'Ready statuses have the clean flag'] },
        { title: 'The link', items: ['Every task status maps to a cleaning status', "The task's final status leads to a clean status"] },
        { title: 'The shift', items: ['Someone checks daily progress at the start', 'Whoever changes statuses by hand has the permission'] },
      ],
    },
  },
});
