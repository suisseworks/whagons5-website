// FIG: closing checklist for the Work Plans article.
import { checklistScene } from '../../lib/checklist.js';

export default checklistScene({
  strings: {
    es: {
      kicker: 'Planes de Trabajo',
      title: 'Tu lista antes de activar un plan',
      caption: 'Repásala antes de dejar que un plan corra solo',
      groups: [
        { title: 'El plan', items: ['Vive en el espacio del equipo que hace el trabajo', 'Tiene una programación por tarea y por frecuencia'] },
        { title: 'Las programaciones', items: ['Tienen los spots marcados, no tareas copiadas', 'Tienen responsables y plantilla', 'Tienen un SLA si el equipo necesita un plazo'] },
        { title: 'El seguimiento', items: ['Alguien abre el Calendario al cierre de la semana', 'Cada día atrasado tiene una explicación'] },
        { title: 'Los permisos', items: ['Los roles del equipo tienen acceso a Planes de trabajo', 'Cada persona está en uno de los equipos del espacio'] },
      ],
    },
    en: {
      kicker: 'Work Plans',
      title: 'Your checklist before a plan goes live',
      caption: 'Run through it before you let a plan run on its own',
      groups: [
        { title: 'The plan', items: ['Lives in the space of the team that does the work', 'Has one schedule per task and frequency'] },
        { title: 'The schedules', items: ['Have spots selected, not tasks copied', 'Have assignees and a template', 'Have an SLA if the team needs a deadline'] },
        { title: 'Follow-up', items: ['Someone opens the Calendar at the end of the week', 'Every late day has an explanation'] },
        { title: 'Permissions', items: ["The team's roles have access to Work plans", "Everyone is on one of the space's teams"] },
      ],
    },
  },
});
