import Image from 'next/image';
import { getPosts } from '../../lib/blog';
import { demoOffer } from '../../lib/demo-offer';
import { Language, routeFor } from '../../lib/locales';
import { shotsFor } from '../../lib/shots';
import styles from './HomePage.module.css';
import ScorePromotion from '../hotel-score/ScorePromotion';
import HospitalityAnalytics from '../hospitality/HospitalityAnalytics';
import { toFeedPost } from '../blog/feed';
import HomeGuides from './HomeGuides';

const content = {
  en: {
    chip: 'Hotel operations',
    heroTitle: 'Hotel operations without blind spots.',
    heroLead:
      'Connect guest requests, room readiness, maintenance, inspections, and shifts in one operating view. Every job gets an owner, a due time, and proof it was done.',
    scoreCta: 'Assess my hotel for free',
    heroMeta: [
      ['Works with', 'Your current PMS'],
      ['Runs on', 'Web and mobile'],
      ['Set up for', 'Your roles and shifts'],
      ['Teams in', 'Latin America'],
    ],
    onPage: 'On this page',
    tree: [
      ['hotel-operations', 'The operational layer'],
      ['how-it-works', 'How it works'],
      ['features', 'Product'],
      ['powerups', 'Powerups'],
      ['customers', 'Customers'],
    ],
    award: 'Innovative Product of the Year · Exphore 2017',
    heroShotAlt: 'Whagons task grid for a hotel maintenance team, with status, priority and assignee columns',
    heroShotCaption: 'Task grid for a maintenance team: status, priority and owner on every row.',
    clientsLabel: 'Teams that trust Whagons',
    problemEyebrow: 'The operational layer',
    problemTitle: 'The work between teams should never disappear between shifts.',
    problemText:
      'Your PMS knows the stay. Whagons coordinates the work around it, across front desk, housekeeping, engineering, food and beverage, security, and leadership.',
    moments: [
      { title: 'Guest requests', text: 'Route every request to the right team, set the response time, and keep the front desk informed through resolution.', tag: 'Service recovery' },
      { title: 'Room readiness', text: 'Connect housekeeping, inspections, and maintenance so blockers are visible before they affect the guest.', tag: 'Cross-team handoffs' },
      { title: 'Maintenance', text: 'Manage preventive plans and urgent work orders with ownership, priority, history, photos, and completion evidence.', tag: 'Assets + work orders' },
      { title: 'Quality & compliance', text: 'Turn standards into repeatable checklists, inspections, approvals, and auditable records for every property.', tag: 'SOPs + inspections' },
    ],
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
    processShotCaption: 'Board columns follow the statuses your team already uses.',
    productEyebrow: 'A clearer operating picture',
    productTitle: 'One view for every shift. The right detail for every role.',
    productText:
      'Frontline teams see what to do next. Managers see exceptions before they become guest problems. Leaders see the patterns behind performance.',
    productShotAlt: 'Whagons Mission Control overview with open tasks, overdue work, completion and status breakdown',
    productShotCaption: 'Mission Control: open work, overdue tasks and completion by status.',
    capabilities: [
      ['Workflow automation', 'Move recurring and reactive work forward automatically.'],
      ['Mobile fieldwork', 'Photos, forms, signatures, QR, barcode, GPS, and NFC.'],
      ['Escalations & approvals', 'Keep important work moving without manager follow-up.'],
      ['Analytics & reports', 'Find delays, recurring issues, and the next action faster.'],
      ['SOPs & knowledge', 'Keep procedures and training where the work happens.'],
      ['API & integrations', 'Connect the hotel systems your teams already rely on.'],
    ],
    featuresCta: 'See all features',
    powerupsEyebrow: 'Powerups',
    powerupsTitle: 'Turn on only what your operation needs.',
    powerupsText:
      "Powerups add modules to Whagons, like recurring work plans, room cleaning and KPI cards. They are turned on for the whole organization, and each role's permissions decide who uses them.",
    guidesLabel: 'Powerup guides',
    allPosts: 'Read the blog',
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
    chip: 'Operaciones hoteleras',
    heroTitle: 'Operación hotelera sin puntos ciegos.',
    heroLead:
      'Conecta solicitudes de huéspedes, habitaciones, mantenimiento, inspecciones y turnos en una sola vista operativa. Cada tarea tiene responsable, plazo y evidencia de cierre.',
    scoreCta: 'Evaluar mi hotel gratis',
    heroMeta: [
      ['Funciona con', 'Tu PMS actual'],
      ['Disponible en', 'Web y móvil'],
      ['Configurado para', 'Tus roles y turnos'],
      ['Equipos en', 'Toda Latinoamérica'],
    ],
    onPage: 'En esta página',
    tree: [
      ['hotel-operations', 'La capa operativa'],
      ['how-it-works', 'Cómo funciona'],
      ['features', 'Producto'],
      ['powerups', 'Powerups'],
      ['customers', 'Clientes'],
    ],
    award: 'Producto Innovador del Año · Exphore 2017',
    heroShotAlt: 'Grilla de tareas de Whagons para el equipo de mantenimiento de un hotel, con columnas de estado, prioridad y responsable',
    heroShotCaption: 'Grilla de tareas de un equipo de mantenimiento: estado, prioridad y responsable en cada fila.',
    clientsLabel: 'Equipos que confían en Whagons',
    problemEyebrow: 'La capa operativa',
    problemTitle: 'El trabajo entre equipos no debería perderse entre turnos.',
    problemText:
      'Tu PMS conoce la estadía. Whagons coordina el trabajo a su alrededor: recepción, ama de llaves, ingeniería, alimentos y bebidas, seguridad y liderazgo.',
    moments: [
      { title: 'Solicitudes de huéspedes', text: 'Dirige cada solicitud al equipo correcto, define el tiempo de respuesta y mantén informada a recepción hasta resolverla.', tag: 'Recuperación del servicio' },
      { title: 'Habitaciones listas', text: 'Conecta limpieza, inspecciones y mantenimiento para detectar bloqueos antes de que afecten al huésped.', tag: 'Entregas entre equipos' },
      { title: 'Mantenimiento', text: 'Gestiona planes preventivos y órdenes urgentes con responsable, prioridad, historial, fotos y evidencia de cierre.', tag: 'Activos + órdenes' },
      { title: 'Calidad y cumplimiento', text: 'Convierte estándares en listas, inspecciones, aprobaciones y registros auditables para cada propiedad.', tag: 'SOPs + inspecciones' },
    ],
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
    processShotAlt: 'Tarjetas de tarea de Whagons en columnas por estado: por hacer, en revisión y en progreso',
    processShotCaption: 'Las columnas del tablero siguen los estados que tu equipo ya usa.',
    productEyebrow: 'Una imagen operativa más clara',
    productTitle: 'Una vista para cada turno. El detalle correcto para cada rol.',
    productText:
      'El personal ve qué hacer ahora. Los gerentes ven excepciones antes de que se conviertan en problemas para el huésped. Los líderes ven los patrones detrás del desempeño.',
    productShotAlt: 'Vista de analítica de Whagons con totales de tareas, tasa de finalización y gráficos de tendencia',
    productShotCaption: 'Centro de mando: trabajo abierto, tareas vencidas y avance por estado.',
    capabilities: [
      ['Automatización de flujos', 'Mueve automáticamente el trabajo recurrente y reactivo.'],
      ['Trabajo móvil', 'Fotos, formularios, firmas, QR, códigos, GPS y NFC.'],
      ['Escalamientos y aprobaciones', 'Mantén el trabajo importante en marcha sin perseguir avances.'],
      ['Analítica y reportes', 'Detecta demoras, problemas recurrentes y la próxima acción.'],
      ['SOPs y conocimiento', 'Ubica procedimientos y capacitación donde ocurre el trabajo.'],
      ['API e integraciones', 'Conecta los sistemas que los equipos del hotel ya utilizan.'],
    ],
    featuresCta: 'Ver todas las funcionalidades',
    powerupsEyebrow: 'Powerups',
    powerupsTitle: 'Activa solo lo que tu operación necesita.',
    powerupsText:
      'Los powerups agregan módulos a Whagons, como planes de trabajo recurrentes, limpieza de habitaciones y tarjetas KPI. Se activan para toda la organización y los permisos de cada rol deciden quién los usa.',
    guidesLabel: 'Guías de powerups',
    allPosts: 'Leer el blog',
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
const hotelMomentAnchors = ['guest-requests', 'room-readiness', 'engineering', 'inspection-correction'];

const customerNames = ['Grupo El Lagar', 'Colegio Humboldt', 'Rythmia', 'IQS', 'Grupo Colono', 'Refritec'];

const customerProof = {
  en: {
    eyebrow: 'Public customer evidence',
    title: 'What operations leaders have said.',
    text: 'With a presence across Latin America, published customer voices and an operational case make the result more concrete than a feature list alone.',
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
    sourceLabel: 'See public evidence',
  },
  es: {
    eyebrow: 'Evidencia pública de clientes',
    title: 'Lo que han dicho líderes de operaciones.',
    text: 'Con presencia en toda Latinoamérica, voces de clientes y un caso operativo publicado hacen el resultado más concreto que una lista de funcionalidades.',
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
    sourceLabel: 'Ver evidencia pública',
  },
} as const;

function Arrow() {
  return (
    <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHead({ label, title, text, id }: { label: string; title: string; text?: string; id?: string }) {
  return (
    <div className={`g12 ${styles.head}`} data-reveal="">
      <p className={`lbl ${styles.headLabel}`}>{label}</p>
      <div className={styles.headCopy}>
        <h2 id={id}>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </div>
  );
}

function Shot({ src, width, height, alt, fig, caption, priority, sizes }: {
  src: string; width: number; height: number; alt: string; fig: string; caption: string; priority?: boolean; sizes: string;
}) {
  return (
    <figure className={styles.fig}>
      <div className={styles.mat}>
        <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes={sizes} quality={90} />
      </div>
      <figcaption className={styles.cap}><b>FIG {fig}</b><span>{caption}</span></figcaption>
    </figure>
  );
}

export default function HomePage({ lang }: { lang: Language }) {
  const t = content[lang];
  const proof = customerProof[lang];
  const shots = shotsFor(lang);
  const demoHref = routeFor(lang, 'demo');
  const hotelHref = routeFor(lang, 'hotels');
  const industriesHref = routeFor(lang, 'markets');
  const powerupPosts = getPosts(lang).filter((post) => post.category === 'powerups');
  const guides = [...powerupPosts.filter((post) => post.featured), ...powerupPosts.filter((post) => !post.featured)]
    .slice(0, 4)
    .map((post) => toFeedPost(lang, post));

  return (
    <main className={styles.page}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`wrap g12 ${styles.heroGrid}`}>
          <aside className={styles.heroRail} data-rise="" style={{ ['--d' as string]: '.18s' }}>
            <p className="lbl">{t.onPage}</p>
            <ul className={styles.tree}>
              {t.tree.map(([anchor, label]) => (
                <li key={anchor}><a href={`#${anchor}`}><span className="br" aria-hidden="true" />{label}</a></li>
              ))}
            </ul>
            <p className={styles.award}><span aria-hidden="true">★</span>{t.award}</p>
          </aside>
          <div className={styles.heroCopy}>
            <span className="chip" data-rise="">{t.chip}</span>
            <h1 data-rise="" style={{ ['--d' as string]: '.04s' }}>{t.heroTitle}</h1>
            <p className={styles.lead} data-rise="" style={{ ['--d' as string]: '.1s' }}>{t.heroLead}</p>
            <div className={styles.actions} data-rise="" style={{ ['--d' as string]: '.14s' }}>
              <a className="btn" href={demoHref}>{demoOffer[lang].cta}<Arrow /></a>
              <a className="tlink" data-track="hotel_score_hero_click" href={routeFor(lang, 'hotelScore')}>
                {t.scoreCta} <span className="arr" aria-hidden="true">→</span>
              </a>
            </div>
            <dl className={styles.meta} data-rise="" style={{ ['--d' as string]: '.2s' }}>
              {t.heroMeta.map(([label, value]) => (
                <div key={label}>
                  <dt className="lbl">{label}</dt>
                  <dd><span className="br" aria-hidden="true" />{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {/* No entrance animation here: this capture is the page's largest paint. */}
        <div className="wrap">
          <Shot
            src={shots.grid.src}
            width={shots.grid.width}
            height={shots.grid.height}
            alt={t.heroShotAlt}
            fig="01"
            caption={t.heroShotCaption}
            priority
            sizes="(max-width: 1480px) 100vw, 1420px"
          />
        </div>
      </section>

      {/* ── Customers strip ─────────────────────────────── */}
      <section className={styles.clients} aria-label={t.clientsLabel}>
        <div className="wrap g12">
          <p className={`lbl ${styles.clientsLabel}`}>{t.clientsLabel}</p>
          <ul className={styles.clientsList}>{customerNames.map((name) => <li key={name}>{name}</li>)}</ul>
        </div>
      </section>

      {/* ── Moments ─────────────────────────────────────── */}
      <section className={styles.section} id="hotel-operations">
        <div className="wrap">
          <SectionHead label={t.problemEyebrow} title={t.problemTitle} text={t.problemText} />
          <div className={`feed ${styles.moments}`} data-reveal="">
            {t.moments.map((moment, index) => (
              <a className={`frow ${styles.moment}`} href={`${hotelHref}#${hotelMomentAnchors[index]}`} key={moment.title}>
                <span className={styles.momentTag}>{moment.tag}</span>
                <span className={styles.momentTitle}>{moment.title}</span>
                <span className={styles.momentText}>{moment.text}</span>
                <span className={styles.momentGo} aria-hidden="true"><Arrow /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <HospitalityAnalytics page="home" market={lang === 'es' ? 'latam' : 'us'} />

      {/* ── Process ─────────────────────────────────────── */}
      <section className={styles.section} id="how-it-works">
        <div className="wrap">
          <SectionHead label={t.processEyebrow} title={t.processTitle} text={t.processLead} />
          <div className={`g12 ${styles.process}`}>
            <ol className={styles.steps} data-reveal="">
              {t.steps.map(([title, text], index) => (
                <li key={title}>
                  <span className={styles.stepNum}>[{index + 1}]</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
              <li className={styles.stepLink}>
                <a className="tlink" href={routeFor(lang, 'platform')}>{t.platformCta} <span className="arr" aria-hidden="true">→</span></a>
              </li>
            </ol>
            <div className={styles.processShot} data-reveal="" style={{ ['--d' as string]: '.08s' }}>
              <Shot
                src={shots.boardDetail.src}
                width={shots.boardDetail.width}
                height={shots.boardDetail.height}
                alt={t.processShotAlt}
                fig="02"
                caption={t.processShotCaption}
                sizes="(max-width: 900px) 100vw, 900px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Product ─────────────────────────────────────── */}
      <section className={styles.section} id="features">
        <div className="wrap">
          <SectionHead label={t.productEyebrow} title={t.productTitle} text={t.productText} />
          <div data-reveal="">
            <Shot
              src={shots.analytics.src}
              width={shots.analytics.width}
              height={shots.analytics.height}
              alt={t.productShotAlt}
              fig="03"
              caption={t.productShotCaption}
              sizes="(max-width: 1480px) 100vw, 1420px"
            />
          </div>
          <div className={styles.capabilities} data-reveal="">
            {t.capabilities.map(([title, text], index) => (
              <article key={title} className={styles.capability}>
                <span className="lbl">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className={styles.more}>
            <a className="tlink" href={routeFor(lang, 'features')}>{t.featuresCta} <span className="arr" aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      {/* ── Powerups + guides ───────────────────────────── */}
      {guides.length > 0 && (
        <section className={styles.section} id="powerups">
          <div className="wrap">
            <SectionHead label={t.powerupsEyebrow} title={t.powerupsTitle} text={t.powerupsText} />
            <HomeGuides lang={lang} guides={guides} label={t.guidesLabel} allHref={routeFor(lang, 'blog')} allLabel={t.allPosts} />
          </div>
        </section>
      )}

      <ScorePromotion lang={lang} />

      {/* ── Proof ───────────────────────────────────────── */}
      <section className={styles.section}>
        <div className="wrap">
          <SectionHead label={t.proofEyebrow} title={t.proofTitle} text={t.proofText} />
          <div className={`g12 ${styles.proof}`} data-reveal="">
            <div className={styles.awardBox}>
              <span className={styles.awardStar} aria-hidden="true">★</span>
              <div>
                <p className={styles.awardTitle}>{t.awardTitle}</p>
                <p className={styles.awardEvent}>{t.awardEvent}</p>
                <p className={styles.awardNote}>{t.awardNote}</p>
              </div>
            </div>
            <div className={styles.adoption}>
              <p className="lbl">{t.proofCardEyebrow}</p>
              <p className={styles.adoptionTitle}>{t.proofCardTitle}</p>
              <ul className={styles.tree}>
                {t.proofCardItems.map((item) => <li key={item}><span className="br" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Markets ─────────────────────────────────────── */}
      <section className={styles.section} id="markets">
        <div className="wrap">
          <SectionHead label={t.marketsEyebrow} title={t.marketsTitle} text={t.marketsText} />
          <div className={`g12 ${styles.markets}`} data-reveal="">
            <a className={styles.featuredMarket} href={hotelHref}>
              <Image src="/images/industries/hoteleria.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 640px" />
              <span className={styles.featuredShade} aria-hidden="true" />
              <span className={styles.featuredBody}>
                <span className="chip">{t.priorityMarket}</span>
                <span className={styles.featuredTitle}>{t.featuredMarket[0]}</span>
                <span className={styles.featuredText}>{t.featuredMarket[1]}</span>
                <span className={styles.featuredLink}>{t.featuredLink} <Arrow /></span>
              </span>
            </a>
            <div className={`feed ${styles.marketList}`}>
              {t.markets.map(([title, text], index) => (
                <a className={`frow ${styles.marketRow}`} key={title} href={`${industriesHref}#${marketSlugs[index]}`}>
                  <span className={styles.marketTitle}>{title}</span>
                  <span className={styles.marketText}>{text}</span>
                  <span className={styles.momentGo} aria-hidden="true"><Arrow /></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className={styles.section} id="customers" aria-labelledby="customer-proof-title">
        <div className="wrap">
          <SectionHead label={proof.eyebrow} title={proof.title} text={proof.text} id="customer-proof-title" />
          <div className={styles.quotes} data-reveal="">
            {proof.testimonials.map((item) => (
              <figure className={styles.quote} key={item.name}>
                <blockquote>“{item.quote}”</blockquote>
                <figcaption><strong>{item.name}</strong><span>{item.role}</span></figcaption>
              </figure>
            ))}
          </div>
          <p className={styles.source}>
            {demoOffer[lang].source}{' '}
            <a href="https://whagons.com/docs/Whagons-2022.pdf" target="_blank" rel="noreferrer">{demoOffer[lang].sourceLink} ↗</a>
          </p>

          <article className={`g12 ${styles.caseStudy}`} data-reveal="">
            <div className={styles.caseCopy}>
              <p className="lbl">{proof.caseLabel}</p>
              <h3>{proof.caseTitle}</h3>
              <p>{proof.caseText}</p>
              <a className="tlink" href="https://es.linkedin.com/posts/whagons_mantenimientoindustrial-gesti%C3%B3noperativa-activity-7470803294903312384-VFou" target="_blank" rel="noreferrer">
                {proof.sourceLabel} <span className="arr" aria-hidden="true">↗</span>
              </a>
            </div>
            <dl className={styles.metrics}>
              {proof.caseMetrics.map(([value, label]) => (
                <div key={label}><dt className="lbl">{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </article>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className={styles.final}>
        <div className={`wrap g12 ${styles.finalGrid}`} data-reveal="">
          <p className={`lbl ${styles.headLabel}`}>{t.finalEyebrow}</p>
          <div className={styles.finalCopy}>
            <h2>{demoOffer[lang].title}</h2>
            <p>{demoOffer[lang].description}</p>
            <div className={styles.actions}>
              <a className="btn" href={demoHref}>{demoOffer[lang].cta}<Arrow /></a>
              <a className="tlink" href="https://wa.me/50670717099">WhatsApp <span className="arr" aria-hidden="true">↗</span></a>
            </div>
            <small>{demoOffer[lang].deliverable}</small>
          </div>
        </div>
      </section>
    </main>
  );
}
