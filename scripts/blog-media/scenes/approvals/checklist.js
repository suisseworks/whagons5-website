// FIG: closing checklist for the Approvals guide.
import { checklistScene } from '../../lib/checklist.js';

export default checklistScene({
  strings: {
    en: {
      kicker: 'Approvals',
      title: 'Your checklist before the team starts',
      caption: 'Go through it before the first real request',
      groups: [
        { title: 'The approval', items: ['Its name says what is being approved', 'Named approvers, Require all approvers on', 'Changes status or adds a tag after each decision'] },
        { title: 'The work', items: ['Attached to the template the team uses', 'A test task showed the orange badge'] },
        { title: 'The people', items: ['Approvers look for orange badges', 'Every rejection has a reason'] },
      ],
    },
    es: {
      kicker: 'Aprobaciones',
      title: 'Tu lista antes de que el equipo empiece',
      caption: 'Revísala antes de la primera solicitud real',
      groups: [
        { title: 'La aprobación', items: ['Su nombre dice qué se aprueba', 'Aprobadores por nombre, todos deben aprobar', 'Cambia el estado o agrega una etiqueta al decidir'] },
        { title: 'El trabajo', items: ['Conectada con la plantilla del equipo', 'Una tarea de prueba mostró la insignia naranja'] },
        { title: 'Las personas', items: ['Los aprobadores buscan las insignias naranjas', 'Cada rechazo tiene un motivo'] },
      ],
    },
    pt: {
      kicker: 'Aprovações',
      title: 'Sua lista antes de a equipe começar',
      caption: 'Confira antes do primeiro pedido de verdade',
      groups: [
        { title: 'A aprovação', items: ['O nome diz o que é aprovado', 'Aprovadores pelo nome, todos precisam aprovar', 'Altera o status ou adiciona uma tag ao decidir'] },
        { title: 'O trabalho', items: ['Ligada ao modelo que a equipe usa', 'Uma tarefa de teste mostrou o selo laranja'] },
        { title: 'As pessoas', items: ['Os aprovadores procuram os selos laranja', 'Toda rejeição tem um motivo'] },
      ],
    },
    de: {
      kicker: 'Genehmigungen',
      title: 'Ihre Checkliste, bevor das Team loslegt',
      caption: 'Vor der ersten echten Anfrage durchgehen',
      groups: [
        { title: 'Die Genehmigung', items: ['Der Name sagt, was genehmigt wird', 'Namentliche Freigebende, alle müssen zustimmen', 'Ändert den Status oder setzt einen Tag'] },
        { title: 'Die Arbeit', items: ['Hängt an der Vorlage des Teams', 'Eine Testaufgabe zeigte das orange Abzeichen'] },
        { title: 'Die Menschen', items: ['Freigebende achten auf orange Abzeichen', 'Jede Ablehnung hat einen Grund'] },
      ],
    },
  },
});
