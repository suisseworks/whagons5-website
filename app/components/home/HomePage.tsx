import Image from 'next/image';
import { demoOffer } from '../../lib/demo-offer';
import { Language, routeFor } from '../../lib/locales';
import { shotsFor } from '../../lib/shots';
import styles from './HomePage.module.css';
import ScorePromotion from '../hotel-score/ScorePromotion';
import HospitalityAnalytics from '../hospitality/HospitalityAnalytics';

const content = {
  en: {
    heroEyebrow: 'Operations software for hotels',
    heroTitle: <>Hotel operations <em>without blind spots.</em></>,
    heroLead:
      'Connect guest requests, room readiness, maintenance, inspections, and shifts in one operating view. Every job gets an owner, a due time, and proof it was done.',
    scoreCta: 'Assess my hotel for free',
    heroPoints: ['Works alongside your PMS', 'Mobile + web', 'Configured to your operation', 'Across Latin America'],
    heroShotAlt: 'Whagons task grid for a hotel maintenance team, with status, priority and assignee columns',
    heroShotCaption: 'Task grid · Maintenance · Whagons',
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
      ['Escalations & approvals', 'Keep important work moving without manager follow-up.'],
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
    heroShotAlt: 'Grilla de tareas de Whagons para el equipo de mantenimiento de un hotel, con columnas de estado, prioridad y responsable',
    heroShotCaption: 'Tareas · Mantenimiento · Whagons',
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
    processShotAlt: 'Dos tarjetas de tarea en Whagons, una en revisión y otra en espera, con la pregunta "¿Qué falta para continuar?"',
    productEyebrow: 'Una imagen operativa más clara',
    productTitle: 'Una vista para cada turno. El detalle correcto para cada rol.',
    productText:
      'El personal ve qué hacer ahora. Los gerentes ven excepciones antes de que se conviertan en problemas para el huésped. Los líderes ven los patrones detrás del desempeño.',
    productShotAlt: 'Vista de analítica de Whagons con totales de tareas, tasa de finalización y gráficos de tendencia',
    productShotCaption: 'Analítica · Whagons',
    capabilities: [
      ['Automatización de flujos', 'Mueve automáticamente el trabajo recurrente y reactivo.'],
      ['Trabajo móvil', 'Fotos, formularios, firmas, QR, códigos, GPS y NFC.'],
      ['Escalamientos y aprobaciones', 'Mantén el trabajo importante en marcha sin perseguir avances.'],
      ['Analítica e IA', 'Detecta demoras, problemas recurrentes y la próxima acción.'],
      ['SOPs y conocimiento', 'Ubica procedimientos y capacitación donde ocurre el trabajo.'],
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
        </div>
        <figure className={styles.shot}>
          <div className={styles.shotBar} aria-hidden="true"><i /><i /><i /><span>{t.heroShotCaption}</span></div>
          <Image src={shots.grid.src} alt={t.heroShotAlt} width={shots.grid.width} height={shots.grid.height} priority sizes="(max-width: 1240px) 100vw, 1180px" />
        </figure>
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
              <span className={styles.tag} data-index={index}>{moment.tag}</span>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
              <span className={styles.cardLink}>{t.learnMore}<Arrow /></span>
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
          <Image src={shots.boardDetail.src} alt={t.processShotAlt} width={shots.boardDetail.width} height={shots.boardDetail.height} sizes="(max-width: 1000px) 100vw, 620px" />
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
          <Image src={shots.analytics.src} alt={t.productShotAlt} width={shots.analytics.width} height={shots.analytics.height} sizes="(max-width: 1240px) 100vw, 1180px" />
        </figure>
        <div className={styles.featureGrid}>
          {t.capabilities.map(([title, text], index) => (
            <article key={title} className={styles.feature}>
              <span className={styles.featureIcon} data-index={index} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
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
