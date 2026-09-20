import Image from 'next/image';
import { demoOffer } from '../../lib/demo-offer';
import { Language, routeFor } from '../../lib/locales';
import { shotsFor } from '../../lib/shots';
import styles from './HomePage.module.css';
import ScorePromotion from '../hotel-score/ScorePromotion';
import HospitalityAnalytics from '../hospitality/HospitalityAnalytics';
import OperationsHeroDemo from './OperationsHeroDemo';
import AnnotatedScreenshot from './AnnotatedScreenshot';

const content = {
  en: {
    heroEyebrow: 'Operations software for hotels',
    heroTitle: <>Hotel operations <em>without blind spots.</em></>,
    heroLead:
      'Connect guest requests, room readiness, maintenance, inspections, and shifts in one operating view. Every job gets an owner, a due time, and proof it was done.',
    scoreCta: 'Assess my hotel for free',
    heroPoints: ['Works alongside your PMS', 'Mobile + web', 'Configured to your operation', 'Across Latin America'],
    offlineTitle: 'Works offline, too.',
    offlineText: 'Access saved information and sync supported changes when you reconnect.',
    heroShotAlt: 'Whagons task grid for a hotel maintenance team, with status, priority and assignee columns',
    heroShotCaption: 'Task grid · Maintenance · Whagons',
    clientsLabel: 'Teams that trust Whagons',
    problemEyebrow: 'The operational layer',
    problemTitle: 'The work between teams should never disappear between shifts.',
    problemText:
      'Your PMS knows the stay. Whagons coordinates the work around it, across front desk, housekeeping, engineering, food and beverage, security, and leadership.',
    moments: [
      { title: 'Guest requests', text: 'Give each request an owner and keep front desk informed until it is resolved.', tag: 'Service recovery' },
      { title: 'Room readiness', text: 'Connect cleaning, repairs and inspection before the next arrival.', tag: 'Cross-team handoffs' },
      { title: 'Maintenance', text: 'Coordinate repairs with location history and evidence of completion.', tag: 'Assets + work orders' },
      { title: 'Quality & compliance', text: 'Turn each inspection finding into an assigned corrective action.', tag: 'SOPs + inspections' },
    ],
    learnMore: 'Learn more',
    processEyebrow: 'From signal to certainty',
    processTitle: 'Capture it. Coordinate it. Prove it.',
    processLead:
      'Whagons makes the full operational loop visible, from the first signal on the floor to a verified result managers can review.',
    platformCta: 'Explore the platform',
    steps: [
      ['Capture', 'Create work from a phone, computer, form, QR code, schedule, or connected system.'],
      ['Coordinate', 'Assign owners, due times, priorities, approvals, and escalation rules that match the hotel.'],
      ['Improve', 'Verify completion, review patterns, and use real operating data to strengthen the next shift.'],
    ],
    processShotAlt: 'Whagons Kanban board for a maintenance team with tasks to do, in review and in progress',
    productEyebrow: 'A clearer operating picture',
    productTitle: 'One view for every shift. The right detail for every role.',
    productText:
      'Frontline teams see what to do next. Managers see exceptions before they become guest problems. Leaders see the patterns behind performance.',
    productShotAlt: 'Whagons Mission Control overview with open tasks, overdue work, completion and status breakdown',
    productShotCaption: 'Mission Control · Whagons',
    capabilities: [
      ['Workflow automation', 'Move recurring and reactive work forward automatically.'],
      ['Mobile fieldwork', 'Photos, forms, signatures, QR, barcode, GPS, and NFC.'],
      ['Escalations & approvals', 'Notify the right person when work needs attention or approval.'],
      ['Analytics & AI', 'Find delays, recurring issues, and the next action faster.'],
      ['SOPs & knowledge', 'Keep procedures and training where the work happens.'],
      ['API & integrations', 'Connect the hotel systems your teams already rely on.'],
    ],
    featuresCta: 'See all features',
    proofEyebrow: 'Experience beyond the hotel lobby',
    proofTitle: 'Built on years of real operational work.',
    proofText:
      'Whagons supports operational teams across Latin America. Our hotel focus brings that same discipline to the moments where service, teams, and shifts meet.',
    awardTitle: 'Innovative Product of the Year',
    awardEvent: 'Exphore Hotels & Restaurants Expo · 2017',
    awardNote: 'Awarded under the former DingDone name',
    proofCardEyebrow: 'Designed for practical adoption',
    proofCardTitle: 'Keep the PMS. Start with one workflow. Make the result visible.',
    proofCardItems: ['No PMS replacement', 'Mobile and desktop', 'Configured around hotel roles'],
    marketsEyebrow: 'One platform, more markets',
    priorityMarket: 'Priority market',
    marketsTitle: 'Hotels are the focus. Other operational teams are welcome.',
    marketsText:
      'The same operating principles, clear ownership, visible timing, consistent standards, and verified completion, also support complex work in other industries.',
    featuredMarket: ['Hospitality', 'Guest service, rooms, maintenance, inspections, and every handoff between them.'],
    featuredLink: 'Explore hotel operations',
    markets: [
      ['Retail', 'Multi-location execution'],
      ['Industrial maintenance', 'Assets and field work'],
      ['Pharma & food', 'Traceability and compliance'],
      ['Health & education', 'Protocols and standards'],
      ['Construction', 'Progress and site control'],
    ],
    finalEyebrow: 'Your operation, made visible',
  },
  es: {
    heroEyebrow: 'Software de operaciones para hoteles',
    heroTitle: <>Operación hotelera <em>sin puntos ciegos.</em></>,
    heroLead:
      'Conecta solicitudes de huéspedes, habitaciones, mantenimiento, inspecciones y turnos en una sola vista operativa. Cada tarea tiene responsable, plazo y evidencia de cierre.',
    scoreCta: 'Evaluar mi hotel gratis',
    heroPoints: ['Funciona junto a tu PMS', 'Móvil + web', 'Configurado para tu operación', 'En toda Latinoamérica'],
    offlineTitle: 'También funciona offline.',
    offlineText: 'Consulta la información guardada y sincroniza los cambios compatibles al reconectarte.',
    heroShotAlt: 'Grilla de tareas de Whagons para el equipo de mantenimiento de un hotel, con columnas de estado, prioridad y responsable',
    heroShotCaption: 'Tareas · Mantenimiento · Whagons',
    clientsLabel: 'Equipos que confían en Whagons',
    problemEyebrow: 'La capa operativa',
    problemTitle: 'El trabajo entre equipos no debería perderse entre turnos.',
    problemText:
      'Tu PMS conoce la estadía. Whagons coordina el trabajo a su alrededor: recepción, ama de llaves, ingeniería, alimentos y bebidas, seguridad y liderazgo.',
    moments: [
      { title: 'Solicitudes de huéspedes', text: 'Asigna cada solicitud y mantén informada a recepción hasta resolverla.', tag: 'Recuperación del servicio' },
      { title: 'Habitaciones listas', text: 'Coordina limpieza, reparaciones e inspección antes de la próxima llegada.', tag: 'Entregas entre equipos' },
      { title: 'Mantenimiento', text: 'Organiza reparaciones con el historial del lugar y evidencia del trabajo.', tag: 'Activos + órdenes' },
      { title: 'Calidad y cumplimiento', text: 'Convierte cada hallazgo de una inspección en una acción con responsable.', tag: 'Procedimientos + inspecciones' },
    ],
    learnMore: 'Ver más',
    processEyebrow: 'De la señal a la certeza',
    processTitle: 'Captura. Coordina. Comprueba.',
    processLead:
      'Whagons hace visible todo el ciclo operativo: desde la primera señal en el piso hasta un resultado verificado que la gerencia puede revisar.',
    platformCta: 'Explorar la plataforma',
    steps: [
      ['Captura', 'Crea trabajo desde un teléfono, computadora, formulario, código QR, programación o sistema conectado.'],
      ['Coordina', 'Asigna responsables, plazos, prioridades, aprobaciones y reglas de escalamiento según el hotel.'],
      ['Mejora', 'Verifica el cierre, revisa patrones y usa datos reales para fortalecer el siguiente turno.'],
    ],
    processShotAlt: 'Tablero Kanban de mantenimiento con tareas por hacer, en progreso y en revisión',
    productEyebrow: 'Una imagen operativa más clara',
    productTitle: 'Una vista para cada turno. El detalle correcto para cada rol.',
    productText:
      'El personal ve qué hacer ahora. Los gerentes ven excepciones antes de que se conviertan en problemas para el huésped. Los líderes ven los patrones detrás del desempeño.',
    productShotAlt: 'Panel de Whagons con tareas abiertas, vencidas, completadas y distribución por estado',
    productShotCaption: 'Analítica · Whagons',
    capabilities: [
      ['Automatización de flujos', 'Mueve automáticamente el trabajo recurrente y reactivo.'],
      ['Trabajo móvil', 'Fotos, formularios, firmas, QR, códigos de barras, GPS y NFC.'],
      ['Escalamientos y aprobaciones', 'Notifica al responsable cuando una tarea necesita atención o aprobación.'],
      ['Analítica e IA', 'Detecta demoras, problemas recurrentes y la próxima acción.'],
      ['Procedimientos y conocimiento', 'Consulta instrucciones y capacitación mientras realizas el trabajo.'],
      ['API e integraciones', 'Conecta los sistemas que los equipos del hotel ya utilizan.'],
    ],
    featuresCta: 'Ver todas las funcionalidades',
    proofEyebrow: 'Experiencia más allá del lobby',
    proofTitle: 'Construido sobre años de trabajo operativo real.',
    proofText:
      'Whagons apoya equipos operativos en América Latina. Nuestro enfoque hotelero lleva esa misma disciplina a los momentos donde se encuentran el servicio, los equipos y los turnos.',
    awardTitle: 'Producto Innovador del Año',
    awardEvent: 'Exphore Expo Hoteles & Restaurantes · 2017',
    awardNote: 'Premio recibido bajo el nombre anterior DingDone',
    proofCardEyebrow: 'Diseñado para una adopción práctica',
    proofCardTitle: 'Conserva el PMS. Empieza con un flujo. Haz visible el resultado.',
    proofCardItems: ['Sin reemplazar el PMS', 'Móvil y escritorio', 'Configurado según los roles del hotel'],
    marketsEyebrow: 'Una plataforma, más mercados',
    priorityMarket: 'Mercado prioritario',
    marketsTitle: 'Los hoteles son el foco. Otros equipos operativos también son bienvenidos.',
    marketsText:
      'Los mismos principios operativos (responsabilidad clara, tiempos visibles, estándares consistentes y cierres verificados) apoyan trabajo complejo en otras industrias.',
    featuredMarket: ['Hotelería', 'Servicio al huésped, habitaciones, mantenimiento, inspecciones y cada entrega entre equipos.'],
    featuredLink: 'Explorar operaciones hoteleras',
    markets: [
      ['Retail', 'Ejecución en múltiples sedes'],
      ['Mantenimiento industrial', 'Activos y trabajo en campo'],
      ['Farma y alimentos', 'Trazabilidad y cumplimiento'],
      ['Salud y educación', 'Protocolos y estándares'],
      ['Construcción', 'Avance y control en obra'],
    ],
    finalEyebrow: 'Tu operación, visible',
  },
} as const;

const marketSlugs = ['retail', 'mantenimiento', 'farmaceutica', 'salud-educacion', 'construccion'];
const momentFlows = {
  es: [['Solicitud', 'Responsable', 'Resolución'], ['Limpieza', 'Inspección', 'Lista'], ['Reporte', 'Reparación', 'Historial'], ['Inspección', 'Corrección', 'Verificación']],
  en: [['Request', 'Owner', 'Resolution'], ['Cleaning', 'Inspection', 'Ready'], ['Report', 'Repair', 'History'], ['Inspection', 'Correction', 'Verification']],
} as const;

function CapabilityIcon({ index }: { index: number }) {
  const paths = [
    <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6m-3-3 3 3 3-3M6 9v9h5"/></>,
    <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2m-3-6 2 2 4-5"/></>,
    <><path d="M12 21V3m-6 6 6-6 6 6M4 17h4m8-4h4"/><circle cx="5" cy="5" r="2"/></>,
    <><path d="M3 3v18h18M7 16v-4m5 4V8m5 8V5"/><path d="m16 3 2-2 2 2"/></>,
    <><path d="M12 5v16M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2z"/><path d="M6 8h3m6 0h3"/></>,
    <><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-12-2 16"/></>,
  ];
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[index]}</svg>;
}

function MomentIcon({ index }: { index: number }) {
  return <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {index === 0 ? <><path d="M9 12h30v21H22l-9 7v-7H9z"/><path d="M17 20h14M17 26h9"/><circle cx="38" cy="11" r="5" fill="currentColor" stroke="none"/></> :
     index === 1 ? <><path d="M7 38V20m34 18V20M7 30h34M10 20V11h28v9M7 30v-7a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v7"/><path d="M16 15h5m6 0h5M11 38v-4m26 4v-4"/></> :
     index === 2 ? <><path d="M29 8a11 11 0 0 0-13 14L7 33a5 5 0 0 0 8 7l10-12A11 11 0 0 0 39 14l-7 7-6-6z"/><circle cx="12" cy="36" r="1"/></> :
     <><rect x="12" y="10" width="25" height="32" rx="3"/><rect x="19" y="6" width="11" height="8" rx="2" fill="var(--moment-bg)"/><path d="m18 27 5 5 9-11"/></>}
  </svg>;
}

const hotelMomentAnchors = ['guest-requests', 'room-readiness', 'engineering', 'inspection-correction'];

const customerNames = ['Grupo El Lagar', 'Colegio Humboldt', 'Rythmia', 'IQS', 'Grupo Colono', 'Refritec'];

const customerProof = {
  en: {
    eyebrow: 'Our customers',
    title: 'What operations leaders say.',
    text: 'Their experiences with day-to-day processes, team coordination and quality management in Whagons.',
    testimonials: [
      { quote: 'Whagons makes it easier to control day-to-day processes. It is a very useful and easy-to-use tool.', name: 'Leela Wernscheid', role: 'Operations Manager · Colegio Humboldt' },
      { quote: 'I am very satisfied, because keeping more than 1,500 employees aligned around one discipline is not easy.', name: 'Guido Tenorio', role: 'Operations Manager · Grupo El Lagar' },
      { quote: 'I recommend Whagons 100%. I believe in the tool and in the people behind Whagons.', name: 'Jorge Varela', role: 'General Manager · Rythmia' },
      { quote: 'Whagons has made ISO 9001:2015 certification easier.', name: 'Isaac Mena Chacón', role: 'Quality Manager · IQS' },
      { quote: 'Whagons has been very important because it allows us to monitor the company’s different areas.', name: 'William Ulate Loaiza', role: 'Operations Manager · Grupo Colono' },
      { quote: 'At Refritec we are 100% satisfied with Whagons because of our experience and the improvements achieved through its implementation.', name: 'Jonathan Gaitán', role: 'Manager · Refritec' },
    ],
    caseLabel: 'Anonymized case published by Whagons',
    caseTitle: 'From repeat visits to a digital equipment history.',
    caseText: 'A refrigeration maintenance team changed its operating flow in 60 days.',
    caseMetrics: [['−80%', 'repeat visits'], ['2 days → 4 h', 'resolution time'], ['100%', 'digital equipment history']],
    sourceLabel: 'Read the published case',
  },
  es: {
    eyebrow: 'Nuestros clientes',
    title: 'Lo que dicen los líderes de operaciones.',
    text: 'Sus experiencias con los procesos diarios, la coordinación de equipos y la gestión de calidad en Whagons.',
    testimonials: [
      { quote: 'Facilita tener un control sobre los procesos del día a día. Es una herramienta muy útil y sencilla de utilizar.', name: 'Leela Wernscheid', role: 'Gerente de Operaciones · Colegio Humboldt' },
      { quote: 'De mi parte estoy muy satisfecho, porque controlar más de 1.500 empleados en una disciplina no es sencillo.', name: 'Guido Tenorio', role: 'Gerente de Operaciones · Grupo El Lagar' },
      { quote: 'Recomiendo Whagons al 100%. Creo en la herramienta y en la gente que trabaja para Whagons.', name: 'Jorge Varela', role: 'Gerente General · Rythmia' },
      { quote: 'Con Whagons, la certificación ISO 9001:2015 se ha facilitado.', name: 'Isaac Mena Chacón', role: 'Gerente de Calidad · IQS' },
      { quote: 'Whagons ha sido de gran importancia porque nos permite monitorear las diferentes áreas de la empresa.', name: 'William Ulate Loaiza', role: 'Gerente de Operaciones · Grupo Colono' },
      { quote: 'En Refritec estamos 100% satisfechos con Whagons por la experiencia vivida y las mejoras logradas con la implementación de esta herramienta.', name: 'Jonathan Gaitán', role: 'Gerente · Refritec' },
    ],
    caseLabel: 'Caso anonimizado publicado por Whagons',
    caseTitle: 'De visitas repetidas a un historial digital de equipos.',
    caseText: 'Un equipo de mantenimiento de refrigeración cambió su flujo operativo en 60 días.',
    caseMetrics: [['−80%', 'visitas repetidas'], ['2 días → 4 h', 'tiempo de resolución'], ['100%', 'historial digital de equipos']],
    sourceLabel: 'Leer el caso publicado',
  },
} as const;

function Arrow() {
  return (
    <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="currentColor" opacity=".12" />
      <path d="M5.5 9.2 8 11.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage({ lang }: { lang: Language }) {
  const t = content[lang];
  const proof = customerProof[lang];
  const shots = shotsFor(lang);
  const hasLocalizedDetailPages = lang === 'en' || lang === 'es';
  const demoHref = routeFor(lang, 'demo');
  const platformHref = hasLocalizedDetailPages ? routeFor(lang, 'platform') : routeFor(lang, 'features');
  const featuresHref = hasLocalizedDetailPages ? routeFor(lang, 'features') : demoHref;
  const hotelHref = routeFor(lang, 'hotels');
  const industriesHref = routeFor(lang, 'markets');

  return (
    <main className={styles.page}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroTop}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t.heroEyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className={styles.lead}>{t.heroLead}</p>
          <div className={styles.actions}>
            <a className={styles.btnPrimary} href={demoHref}>{demoOffer[lang].cta}<Arrow /></a>
            <a className={styles.btnSecondary} data-track="hotel_score_hero_click" href={routeFor(lang, 'hotelScore')}>{t.scoreCta}</a>
          </div>
          <ul className={styles.points}>
            {t.heroPoints.map((point) => <li key={point}><Check />{point}</li>)}
          </ul>
          <div className={styles.offlineNote}>
            <span className={styles.offlineIcon} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a11 11 0 0 1 16 0M7 14a7 7 0 0 1 10 0M10 17a3 3 0 0 1 4 0M3 3l18 18" /><circle cx="12" cy="20" r=".8" fill="currentColor" stroke="none" /></svg>
            </span>
            <p><strong>{t.offlineTitle}</strong><span>{t.offlineText}</span></p>
          </div>
        </div>
        <OperationsHeroDemo lang={lang} />
        </div>
        <AnnotatedScreenshot lang={lang} shot={shots.grid} alt={t.heroShotAlt} caption={t.heroShotCaption} />
      </section>

      {/* ── Customers strip ─────────────────────────────── */}
      <section className={styles.clients} aria-label={t.clientsLabel}>
        <span>{t.clientsLabel}</span>
        <ul>{customerNames.map((name) => <li key={name}>{name}</li>)}</ul>
      </section>

      {/* ── Moments ─────────────────────────────────────── */}
      <section className={styles.section} id="hotel-operations">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{t.problemEyebrow}</p>
          <h2>{t.problemTitle}</h2>
          <p>{t.problemText}</p>
        </div>
        <div className={styles.cardGrid}>
          {t.moments.map((moment, index) => (
            <a className={styles.card} href={hasLocalizedDetailPages ? `${hotelHref}#${hotelMomentAnchors[index]}` : demoHref} key={moment.title}>
              <div className={styles.momentVisual} data-index={index} aria-hidden="true">
                <span className={styles.momentNumber}>0{index + 1}</span>
                <span className={styles.momentIcon}><MomentIcon index={index} /></span>
                <div className={styles.momentFlow}>
                  {momentFlows[lang][index].map((step, stepIndex) => <span key={step}><i>{stepIndex === 2 ? '✓' : `0${stepIndex + 1}`}</i>{step}</span>)}
                </div>
              </div>
              <div className={styles.momentCopy}>
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
                <span className={styles.cardLink}>{t.learnMore}<Arrow /></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <HospitalityAnalytics page="home" market={lang === 'es' ? 'latam' : 'us'} />

      {/* ── Process ─────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.process}`} id="how-it-works">
        <div className={styles.processCopy}>
          <p className={styles.eyebrow}>{t.processEyebrow}</p>
          <h2>{t.processTitle}</h2>
          <p>{t.processLead}</p>
          <ol className={styles.steps}>
            {t.steps.map(([title, text], index) => (
              <li key={title}>
                <span>{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
          <a className={styles.btnSecondary} href={platformHref}>{t.platformCta}<Arrow /></a>
        </div>
        <div className={styles.processShot}>
          <Image src={shots.boardDetail.src} alt={t.processShotAlt} width={shots.boardDetail.width} height={shots.boardDetail.height} sizes="(max-width: 1000px) 100vw, 620px" quality={90} />
        </div>
      </section>

      {/* ── Product ─────────────────────────────────────── */}
      <section className={styles.section} id="features">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{t.productEyebrow}</p>
          <h2>{t.productTitle}</h2>
          <p>{t.productText}</p>
        </div>
        <figure className={`${styles.shot} ${styles.shotWide}`}>
          <div className={styles.shotBar} aria-hidden="true"><i /><i /><i /><span>{t.productShotCaption}</span></div>
          <Image src={shots.analytics.src} alt={t.productShotAlt} width={shots.analytics.width} height={shots.analytics.height} sizes="(max-width: 1240px) 100vw, 1180px" quality={90} />
        </figure>
        <div className={styles.featureGrid}>
          {t.capabilities.map(([title, text], index) => (
            <article key={title} className={styles.feature}>
              <span className={styles.featureIcon} aria-hidden="true"><CapabilityIcon index={index} /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
              <span className={styles.featureNumber} aria-hidden="true">0{index + 1}</span>
            </article>
          ))}
        </div>
        <div className={styles.centerAction}>
          <a className={styles.btnSecondary} href={featuresHref}>{t.featuresCta}<Arrow /></a>
        </div>
      </section>

      <ScorePromotion lang={lang} />

      {/* ── Proof ───────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.proof}`}>
        <div>
          <p className={styles.eyebrow}>{t.proofEyebrow}</p>
          <h2>{t.proofTitle}</h2>
          <p className={styles.text}>{t.proofText}</p>
          <div className={styles.award}>
            <span aria-hidden="true">★</span>
            <div><strong>{t.awardTitle}</strong><p>{t.awardEvent}</p><small>{t.awardNote}</small></div>
          </div>
        </div>
        <aside className={styles.proofCard}>
          <p className={styles.eyebrow}>{t.proofCardEyebrow}</p>
          <h3>{t.proofCardTitle}</h3>
          <ul>
            {t.proofCardItems.map((item) => <li key={item}><Check />{item}</li>)}
          </ul>
        </aside>
      </section>

      {/* ── Markets ─────────────────────────────────────── */}
      <section className={styles.section} id="markets">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{t.marketsEyebrow}</p>
          <h2>{t.marketsTitle}</h2>
          <p>{t.marketsText}</p>
        </div>
        <div className={styles.markets}>
          <a className={styles.featuredMarket} href={hotelHref}>
            <Image src="/images/industries/hoteleria.jpg" alt="" fill sizes="(max-width: 1000px) 100vw, 560px" />
            <div>
              <span>{t.priorityMarket}</span>
              <h3>{t.featuredMarket[0]}</h3>
              <p>{t.featuredMarket[1]}</p>
              <strong>{t.featuredLink}<Arrow /></strong>
            </div>
          </a>
          <ul className={styles.marketList}>
            {t.markets.map(([title, text], index) => (
              <li key={title}>
                <a href={hasLocalizedDetailPages ? `${industriesHref}#${marketSlugs[index]}` : demoHref}>
                  <div><h3>{title}</h3><p>{text}</p></div>
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className={`${styles.section} ${styles.testimonials}`} aria-labelledby="customer-proof-title">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{proof.eyebrow}</p>
          <h2 id="customer-proof-title">{proof.title}</h2>
          <p>{proof.text}</p>
        </div>
        <div className={styles.quoteGrid}>
          {[2, 1, 0, 3, 4, 5].map((sourceIndex, index) => {
            const item = proof.testimonials[sourceIndex];
            const [role, company] = item.role.split(' · ');
            const initials = item.name.split(' ').map(part => part[0]).filter((_, i, parts) => i === 0 || i === parts.length - 1).join('');
            return <figure className={`${styles.quote} ${index === 0 ? 'tech-frame' : ''}`} data-featured={index < 2} key={item.name}>
              <div className={styles.quoteBrand}><span>{company}</span><span className={styles.quoteMark} aria-hidden="true">“</span></div>
              <blockquote>“{item.quote}”</blockquote>
              <figcaption><span className={styles.quoteAvatar} aria-hidden="true">{initials}</span><div><strong>{item.name}</strong><span>{role}</span></div></figcaption>
            </figure>;
          })}
        </div>
        <p className={styles.source}>
          {demoOffer[lang].source}
        </p>

        <article className={styles.caseStudy}>
          <div>
            <p className={styles.eyebrow}>{proof.caseLabel}</p>
            <h3>{proof.caseTitle}</h3>
            <p className={styles.text}>{proof.caseText}</p>
            <a href="https://es.linkedin.com/posts/whagons_mantenimientoindustrial-gesti%C3%B3noperativa-activity-7470803294903312384-VFou" target="_blank" rel="noreferrer">
              {proof.sourceLabel} ↗
            </a>
          </div>
          <dl className={styles.metrics}>
            {proof.caseMetrics.map(([value, label]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </article>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className={styles.finalCta}>
        <div>
          <p className={styles.eyebrow}>{t.finalEyebrow}</p>
          <h2>{demoOffer[lang].title}</h2>
          <p>{demoOffer[lang].description}</p>
          <a className={styles.btnPrimary} href={demoHref}>{demoOffer[lang].cta}<Arrow /></a>
          <small>{demoOffer[lang].deliverable}</small>
        </div>
      </section>
    </main>
  );
}
