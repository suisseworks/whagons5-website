// FIG: closing checklist for the first-day guide.
import { checklistScene } from '../../lib/checklist.js';

export default checklistScene({
  strings: {
    en: {
      kicker: 'Your first day',
      title: 'Your first-day checklist',
      caption: 'Tick it off during your first shift',
      groups: [
        { title: 'Finding', items: ["I can open my team's space", 'I can filter the list to my own tasks'] },
        { title: 'Reporting', items: ['My task names say what, and where', 'I choose the Spot and add a photo'] },
        { title: 'Working', items: ['I change the status when the work starts', 'I leave a comment before I stop', "I finish a task only when it's done"] },
        { title: 'Hearing back', items: ['My notifications are behind my avatar'] },
      ],
    },
    es: {
      kicker: 'Tu primer día',
      title: 'Tu lista del primer día',
      caption: 'Márcala durante tu primer turno',
      groups: [
        { title: 'Encontrar', items: ['Puedo abrir el espacio de mi equipo', 'Puedo filtrar la lista a mis tareas'] },
        { title: 'Reportar', items: ['Mis tareas dicen qué y dónde', 'Elijo el Spot y agrego una foto'] },
        { title: 'Trabajar', items: ['Cambio el estado cuando empieza el trabajo', 'Dejo un comentario antes de parar', 'Termino una tarea solo cuando está hecha'] },
        { title: 'Enterarme', items: ['Mis notificaciones están detrás de mi avatar'] },
      ],
    },
    pt: {
      kicker: 'Seu primeiro dia',
      title: 'Sua lista do primeiro dia',
      caption: 'Marque durante o seu primeiro turno',
      groups: [
        { title: 'Encontrar', items: ['Consigo abrir o espaço da minha equipe', 'Consigo filtrar a lista para as minhas tarefas'] },
        { title: 'Relatar', items: ['Minhas tarefas dizem o quê e onde', 'Escolho o Spot e adiciono uma foto'] },
        { title: 'Trabalhar', items: ['Mudo o status quando o trabalho começa', 'Deixo um comentário antes de parar', 'Concluo uma tarefa só quando está feita'] },
        { title: 'Ficar sabendo', items: ['Minhas notificações ficam atrás do meu avatar'] },
      ],
    },
    de: {
      kicker: 'Ihr erster Tag',
      title: 'Ihre Checkliste für den ersten Tag',
      caption: 'In der ersten Schicht abhaken',
      groups: [
        { title: 'Finden', items: ['Ich kann den Bereich meines Teams öffnen', 'Ich kann die Liste auf meine Aufgaben filtern'] },
        { title: 'Melden', items: ['Meine Aufgaben sagen, was und wo', 'Ich wähle den Spot und füge ein Foto hinzu'] },
        { title: 'Arbeiten', items: ['Ich ändere den Status, wenn die Arbeit beginnt', 'Ich kommentiere, bevor ich aufhöre', 'Ich schließe erst ab, wenn es fertig ist'] },
        { title: 'Rückmeldung', items: ['Benachrichtigungen liegen hinter meinem Avatar'] },
      ],
    },
  },
});
