import Image from 'next/image';
import { Language } from '../../lib/i18n';
import { shotsFor } from '../../lib/shots';
import styles from './PlatformPage.module.css';

const content = {
  es: {
    eyebrow: 'LA PLATAFORMA WHAGONS', title: 'Cada equipo conectado.', emphasis: 'Cada pendiente, visible.',
    lead: 'Del primer aviso al trabajo verificado. Un lugar para coordinar la operación de tu hotel, con el contexto que cada equipo necesita.',
    demo: 'Conocer Whagons', explore: 'Explorar la plataforma', screen: 'Dentro de Whagons', screenTitle: 'La operación tiene un lugar.',
    screenAlt: 'Hotel Premium en Whagons: espacios de trabajo, tareas de mantenimiento, estados, ubicaciones y responsables en español',
    screenNote: 'Hotel Premium · Datos de demostración',
    lenses: [['Por equipo', 'Espacios para organizar quién se encarga.'], ['Por lugar', 'Habitaciones, equipos y áreas con contexto.'], ['Por estado', 'Lo pendiente, lo que avanza y lo resuelto.']],
    flowLabel: 'UN MISMO HILO, DE PRINCIPIO A FIN', flowTitle: 'Un aviso no debería perderse entre departamentos.',
    flowLead: 'Recepción, mantenimiento y supervisión trabajan sobre la misma tarea. Cada paso deja contexto para el siguiente.',
    example: 'Ejemplo de un flujo configurado', task: 'Revisar fuga en el baño', room: 'Habitación 204 · Mantenimiento',
    steps: [['Reportar', 'Recepción registra el aviso y su ubicación.', 'Solicitud recibida'], ['Coordinar', 'El equipo identifica al responsable y la prioridad.', 'Trabajo asignado'], ['Resolver', 'Mantenimiento documenta la intervención.', 'Resultado registrado'], ['Verificar', 'Supervisión revisa el cierre y su evidencia.', 'Servicio confirmado']],
    capabilities: 'CAPACIDADES CONECTADAS', capabilitiesTitle: 'Configura la forma en que trabaja tu hotel.', capabilitiesLead: 'Empieza con lo que necesitas hoy. Incorpora más capacidades a medida que tu operación lo requiera.', detailHint: 'Abre cada capacidad para conocer su alcance.',
    modules: [
      ['Flujos y automatizaciones', 'Cada pendiente sabe cuál es su siguiente paso.', 'Define responsables, aprobaciones y reglas de seguimiento según el tipo de trabajo. Los plazos y las alertas ayudan al equipo a identificar qué requiere atención.', 'Aprobaciones · Reglas · Seguimiento'],
      ['Integraciones', 'El trabajo conectado con tus sistemas.', 'Conecta información y procesos mediante API e integraciones definidas para tu operación. El alcance se revisa con tu equipo y con los sistemas que ya utiliza.', 'API · Sistemas existentes · Alcance acordado'],
      ['Planes y programación', 'Lo recurrente también tiene responsable.', 'Organiza planes de trabajo y tareas recurrentes por equipo, área y calendario. Consulta lo previsto y coordina su ejecución con el trabajo del día.', 'Planes · Recurrencias · Calendario'],
      ['Formularios y evidencia', 'El resultado queda documentado.', 'Guía la ejecución con formularios, verificaciones y evidencia vinculada a la tarea. QR y NFC conectan el trabajo con su ubicación, según la configuración.', 'Formularios · Evidencia · QR y NFC'],
      ['Procedimientos y conocimiento', 'El contexto acompaña al equipo.', 'Reúne procedimientos, documentos y materiales de capacitación. Facilita que los equipos consulten las instrucciones y registren su lectura cuando corresponda.', 'Procedimientos · Documentos · Capacitación'],
      ['Visibilidad operativa', 'Una vista clara de lo que necesita atención.', 'Consulta tareas, estados e indicadores para dar seguimiento a la operación. Revisa el avance del equipo y el historial del trabajo antes de decidir el siguiente paso.', 'Indicadores · Estados · Historial'],
      ['Asistencia inteligente', 'Menos tiempo buscando el contexto.', 'Consulta información y recibe asistencia sobre el trabajo de tu operación. Las funciones de voz, las acciones disponibles y el consumo se definen según la configuración y el alcance contratado.', 'Consultas · Contexto · Asistencia por voz'],
    ],
    connectLabel: 'EN TU OPERACIÓN', connectTitle: 'Tu PMS conoce la estadía. Whagons coordina el trabajo.', connectText: 'Conserva los sistemas que ya usas. Define con nuestro equipo qué información conectar y qué proceso ordenar primero.',
    system: 'Tus sistemas', systemSub: 'PMS · ERP · otras herramientas', center: 'Trabajo coordinado', people: 'Tu equipo', peopleSub: 'Recepción · Operación · Gerencia',
    rolloutTitle: 'Empieza con un flujo real.', rolloutText: 'Configuramos el alcance, capacitamos al equipo y acompañamos la puesta en marcha. Desde ahí, puedes ampliar la operación.',
    offlineTitle: 'También donde la conexión falla.', offlineText: 'Consulta la información guardada y sincroniza los cambios compatibles al reconectarte.',
    finalLabel: 'VEAMOS TU OPERACIÓN', finalTitle: 'Trae un proceso de tu hotel. Veamos cómo organizarlo.', finalText: 'Una demo enfocada en tus equipos, tus pendientes y tu forma de trabajar.', finalButton: 'Solicitar una demo', features: 'Consultar todas las funcionalidades',
  },
  en: {
    eyebrow: 'THE WHAGONS PLATFORM', title: 'Every team connected.', emphasis: 'Every open task, visible.',
    lead: 'From the first report to verified work. One place to coordinate hotel operations, with the context each team needs.',
    demo: 'Meet Whagons', explore: 'Explore the platform', screen: 'Inside Whagons', screenTitle: 'A place for your operations.',
    screenAlt: 'Hotel Premium in Whagons: workspaces, maintenance tasks, statuses, locations and assignees in English', screenNote: 'Hotel Premium · Demonstration data',
    lenses: [['By team', 'Workspaces make ownership clear.'], ['By location', 'Rooms, equipment and areas with context.'], ['By status', 'What is pending, progressing and resolved.']],
    flowLabel: 'ONE THREAD, FROM START TO FINISH', flowTitle: 'A request should never get lost between departments.', flowLead: 'Front desk, maintenance and supervisors work from the same task. Each step leaves context for the next.',
    example: 'Example of a configured workflow', task: 'Check the bathroom leak', room: 'Room 204 · Maintenance',
    steps: [['Report', 'Front desk records the request and its location.', 'Request received'], ['Coordinate', 'The team identifies the assignee and priority.', 'Work assigned'], ['Resolve', 'Maintenance documents the work performed.', 'Result recorded'], ['Verify', 'A supervisor reviews completion and evidence.', 'Service confirmed']],
    capabilities: 'CONNECTED CAPABILITIES', capabilitiesTitle: 'Configure how your hotel works.', capabilitiesLead: 'Start with what you need today. Add capabilities as your operation requires them.', detailHint: 'Open each capability to explore its scope.',
    modules: [
      ['Workflows & automation', 'Every task has a next step.', 'Define owners, approvals and follow-up rules for each type of work. Deadlines and alerts help the team identify what needs attention.', 'Approvals · Rules · Follow-up'],
      ['Integrations', 'Work connected to your systems.', 'Connect information and processes through APIs and integrations defined for your operation. Scope is reviewed with your team and the systems it already uses.', 'API · Existing systems · Agreed scope'],
      ['Work plans & scheduling', 'Recurring work has an owner, too.', 'Organize work plans and recurring tasks by team, area and calendar. See what is planned and coordinate its execution alongside the day’s work.', 'Plans · Recurring tasks · Calendar'],
      ['Forms & evidence', 'The result stays documented.', 'Guide execution with forms, checks and evidence attached to the task. QR and NFC connect work with its location, depending on configuration.', 'Forms · Evidence · QR & NFC'],
      ['Procedures & knowledge', 'Context stays with the team.', 'Bring together procedures, documents and training materials. Help teams consult instructions and acknowledge reading them when needed.', 'Procedures · Documents · Training'],
      ['Operational visibility', 'A clear view of what needs attention.', 'Review tasks, statuses and indicators to follow the operation. Check team progress and work history before deciding the next step.', 'Indicators · Statuses · History'],
      ['Intelligent assistance', 'Less time searching for context.', 'Find information and get assistance with your operational work. Voice functions, available actions and usage depend on configuration and contracted scope.', 'Queries · Context · Voice assistance'],
    ],
    connectLabel: 'WITHIN YOUR OPERATION', connectTitle: 'Your PMS knows the stay. Whagons coordinates the work.', connectText: 'Keep the systems you already use. Work with our team to define what to connect and which process to organize first.',
    system: 'Your systems', systemSub: 'PMS · ERP · other tools', center: 'Coordinated work', people: 'Your team', peopleSub: 'Front desk · Operations · Management',
    rolloutTitle: 'Start with a real workflow.', rolloutText: 'We configure the scope, train your team and support the rollout. From there, you can expand your operation.',
    offlineTitle: 'Even when the connection drops.', offlineText: 'Access saved information and sync supported changes when you reconnect.',
    finalLabel: 'LET’S LOOK AT YOUR OPERATION', finalTitle: 'Bring a hotel process. Let’s see how to organize it.', finalText: 'A demo focused on your teams, open tasks and way of working.', finalButton: 'Request a demo', features: 'Explore all features',
  },
};

export default function PlatformPageClient({ lang }: { lang: Language }) {
  const t = content[lang];
  const shot = shotsFor(lang).grid;
  const demoHref = `/${lang}/demo`;
  return <main className={styles.page}>
    <section className={styles.hero}>
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <div className={styles.heroIntro}><h1>{t.title}<em>{t.emphasis}</em></h1><div><p className={styles.lead}>{t.lead}</p><div className={styles.actions}><a className={styles.primary} href={demoHref}>{t.demo}<span aria-hidden="true">↗</span></a><a className={styles.textLink} href="#platform-capabilities">{t.explore}<span aria-hidden="true">↓</span></a></div></div></div>
      <div className={styles.productHeading}><span>{t.screen}</span><span>{t.screenNote}</span></div>
      <figure className={`${styles.product} tech-frame`}><Image src={shot.src} width={shot.width} height={shot.height} alt={t.screenAlt} priority sizes="(max-width: 1240px) 100vw, 1180px" quality={90} /><figcaption className={styles.lenses}>{t.lenses.map(([title,desc],i)=><div key={title}><span>0{i+1}</span><p><strong>{title}</strong>{desc}</p></div>)}</figcaption></figure>
    </section>

    <section className={styles.flow}>
      <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>{t.flowLabel}</p><h2>{t.flowTitle}</h2></div><p className={styles.lead}>{t.flowLead}</p></div>
      <div className={styles.example}><span>{t.example}</span><strong>{t.task}</strong><span>{t.room}</span></div>
      <ol className={styles.steps}>{t.steps.map(([title,desc,status],i)=><li key={title}><span className={styles.stepNumber}>0{i+1}</span><h3>{title}</h3><p>{desc}</p><span className={styles.stepStatus}>{status}</span></li>)}</ol>
    </section>

    <section className={styles.capabilities} id="platform-capabilities">
      <div className={styles.capabilityIntro}><p className={styles.eyebrow}>{t.capabilities}</p><h2>{t.capabilitiesTitle}</h2><p className={styles.lead}>{t.capabilitiesLead}</p><p className={styles.hint}>{t.detailHint}</p></div>
      <div className={styles.moduleList}>{t.modules.map(([title,tagline,desc,terms],i)=><details key={title} id={`modulo-0${i+1}`} className={styles.module} open={i===0}><summary><span className={styles.moduleNumber}>0{i+1}</span><span><h3>{title}</h3><span className={styles.tagline}>{tagline}</span></span><span className={styles.expand} aria-hidden="true" /></summary><div className={styles.moduleBody}><p>{desc}</p><span>{terms}</span></div></details>)}</div>
    </section>

    <section className={styles.connections}><div className={styles.sectionIntro}><div><p className={styles.eyebrow}>{t.connectLabel}</p><h2>{t.connectTitle}</h2></div><p className={styles.lead}>{t.connectText}</p></div>
      <div className={styles.connectionDiagram}><div><strong>{t.system}</strong><span>{t.systemSub}</span></div><span className={styles.connector} aria-hidden="true">↔</span><div className={styles.hub}><span>Whagons</span><strong>{t.center}</strong></div><span className={styles.connector} aria-hidden="true">↔</span><div><strong>{t.people}</strong><span>{t.peopleSub}</span></div></div>
      <div className={styles.practical}><article><span aria-hidden="true">01 /</span><h3>{t.rolloutTitle}</h3><p>{t.rolloutText}</p></article><article><span aria-hidden="true">02 /</span><h3>{t.offlineTitle}</h3><p>{t.offlineText}</p></article></div>
    </section>
    <section className={styles.final}><p className={styles.eyebrow}>{t.finalLabel}</p><h2>{t.finalTitle}</h2><p className={styles.lead}>{t.finalText}</p><div className={styles.actions}><a className={styles.primary} href={demoHref}>{t.finalButton}<span aria-hidden="true">↗</span></a><a className={styles.textLink} href={lang==='es'?'/es/funcionalidades':'/en/features'}>{t.features}<span aria-hidden="true">→</span></a></div></section>
  </main>;
}
