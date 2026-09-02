import Image from 'next/image';
import { Language } from '../../lib/i18n';
import styles from './HomePage.module.css';

const content = {
  en: {
    heroEyebrow: 'Operations software for hotels',
    heroTitle: <><span>Hotel operations.</span><em>No blind spots.</em></>,
    heroLead:
      'Connect guest requests, room readiness, maintenance, inspections, and shifts in one operating view. Every job gets an owner, a due time, and proof it was done.',
    primaryCta: 'Request a tailored demo',
    secondaryCta: 'See how it works',
    heroPoints: ['Works alongside your PMS', 'Mobile + web', 'Configured to your operation'],
    heroAlt: 'Hotel pool and guest areas at sunset',
    liveWorkflow: 'Illustrative hotel workflow',
    managerView: 'Manager view',
    workflowTitle: 'Guest room A/C issue',
    room: 'Room 418',
    workflowRows: [
      ['Guest request', 'Front desk', 'Captured'],
      ['Engineering', 'Due 10:30', 'In progress'],
      ['Guest follow-up', 'Photo + note', 'Next'],
    ],
    workflowControls: ['Owner', 'Due time', 'Escalation', 'Evidence'],
    signalItems: [
      ['Guest requests', 'One visible owner'],
      ['Room readiness', 'Across departments'],
      ['Maintenance', 'Planned and reactive'],
      ['Standards', 'Evidence on every shift'],
    ],
    problemEyebrow: 'The operational layer',
    problemTitle: 'The work between teams should never disappear between shifts.',
    problemText:
      'Your PMS knows the stay. Whagons coordinates the work around it—across front desk, housekeeping, engineering, food and beverage, security, and leadership.',
    moments: [
      {
        number: '01',
        title: 'Guest requests',
        text: 'Route every request to the right team, set the response time, and keep the front desk informed through resolution.',
        tag: 'Service recovery',
      },
      {
        number: '02',
        title: 'Room readiness',
        text: 'Connect housekeeping, inspections, and maintenance so blockers are visible before they affect the guest.',
        tag: 'Cross-team handoffs',
      },
      {
        number: '03',
        title: 'Maintenance',
        text: 'Manage preventive plans and urgent work orders with ownership, priority, history, photos, and completion evidence.',
        tag: 'Assets + work orders',
      },
      {
        number: '04',
        title: 'Quality & compliance',
        text: 'Turn standards into repeatable checklists, inspections, approvals, and auditable records for every property.',
        tag: 'SOPs + inspections',
      },
    ],
    processEyebrow: 'From signal to certainty',
    processTitle: <>Capture it. Coordinate it. <em>Prove it.</em></>,
    processLead:
      'Whagons makes the full operational loop visible—from the first signal on the floor to a verified result managers can review.',
    steps: [
      ['Capture', 'Create work from a phone, computer, form, QR code, schedule, or connected system.'],
      ['Coordinate', 'Assign owners, due times, priorities, approvals, and escalation rules that match the hotel.'],
      ['Improve', 'Verify completion, review patterns, and use real operating data to strengthen the next shift.'],
    ],
    productEyebrow: 'A clearer operating picture',
    productTitle: 'One view for every shift. The right detail for every role.',
    productText:
      'Frontline teams see what to do next. Managers see exceptions before they become guest problems. Leaders see the patterns behind performance.',
    dashboardTitle: 'Hotel operations',
    dashboardSubtitle: 'Today · All departments · Illustrative',
    dashboardMetrics: [
      ['Open', '38'],
      ['On time', '91%'],
      ['At risk', '6'],
      ['Completed', '124'],
    ],
    dashboardFeed: 'Live workflow',
    dashboardRows: [
      ['Room 418 · A/C', 'Engineering', '12 min left'],
      ['Arrival inspection', 'Housekeeping', 'Review'],
      ['Pool checklist', 'Recreation', 'Completed'],
    ],
    capabilities: [
      ['Workflow automation', 'Move recurring and reactive work forward automatically.'],
      ['Mobile fieldwork', 'Photos, forms, signatures, QR, barcode, GPS, and NFC.'],
      ['Escalations & approvals', 'Keep important work moving without manager follow-up.'],
      ['Analytics & AI', 'Find delays, recurring issues, and the next action faster.'],
      ['SOPs & knowledge', 'Keep procedures and training where the work happens.'],
      ['API & integrations', 'Connect the hotel systems your teams already rely on.'],
    ],
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
    marketsTitle: 'Hotels are the focus. Other operational teams are welcome.',
    marketsText:
      'The same operating principles—clear ownership, visible timing, consistent standards, and verified completion—also support complex work in other industries.',
    featuredMarket: ['Hospitality', 'The priority market for Whagons: guest service, rooms, maintenance, inspections, and every handoff between them.'],
    featuredLink: 'Explore hotel operations',
    markets: [
      ['Retail', 'Multi-location execution'],
      ['Industrial maintenance', 'Assets and field work'],
      ['Pharma & food', 'Traceability and compliance'],
      ['Health & education', 'Protocols and standards'],
      ['Construction', 'Progress and site control'],
    ],
    exploreMarket: 'Explore',
    finalEyebrow: 'Your operation, made visible',
    finalTitle: 'See Whagons around one real workflow from your hotel.',
    finalText:
      'We will focus the conversation on your teams, your handoffs, and the operational result you need—not a generic product tour.',
    finalCta: 'Request your demo',
  },
  es: {
    heroEyebrow: 'Software de operaciones para hoteles',
    heroTitle: <><span>Operación hotelera.</span><em>Sin puntos ciegos.</em></>,
    heroLead:
      'Conecta solicitudes de huéspedes, habitaciones, mantenimiento, inspecciones y turnos en una sola vista operativa. Cada tarea tiene responsable, plazo y evidencia de cierre.',
    primaryCta: 'Solicitar un demo personalizado',
    secondaryCta: 'Ver cómo funciona',
    heroPoints: ['Funciona junto a tu PMS', 'Móvil + web', 'Configurado para tu operación'],
    heroAlt: 'Piscina y áreas de huéspedes de un hotel al atardecer',
    liveWorkflow: 'Flujo hotelero ilustrativo',
    managerView: 'Vista gerencial',
    workflowTitle: 'Problema de A/C en habitación',
    room: 'Habitación 418',
    workflowRows: [
      ['Solicitud del huésped', 'Recepción', 'Registrada'],
      ['Ingeniería', 'Vence 10:30', 'En progreso'],
      ['Seguimiento al huésped', 'Foto + nota', 'Siguiente'],
    ],
    workflowControls: ['Responsable', 'Plazo', 'Escalamiento', 'Evidencia'],
    signalItems: [
      ['Solicitudes de huéspedes', 'Un responsable visible'],
      ['Habitaciones listas', 'Entre departamentos'],
      ['Mantenimiento', 'Preventivo y reactivo'],
      ['Estándares', 'Evidencia en cada turno'],
    ],
    problemEyebrow: 'La capa operativa',
    problemTitle: 'El trabajo entre equipos no debería perderse entre turnos.',
    problemText:
      'Tu PMS conoce la estadía. Whagons coordina el trabajo a su alrededor: recepción, ama de llaves, ingeniería, alimentos y bebidas, seguridad y liderazgo.',
    moments: [
      {
        number: '01',
        title: 'Solicitudes de huéspedes',
        text: 'Dirige cada solicitud al equipo correcto, define el tiempo de respuesta y mantén informada a recepción hasta resolverla.',
        tag: 'Recuperación del servicio',
      },
      {
        number: '02',
        title: 'Habitaciones listas',
        text: 'Conecta limpieza, inspecciones y mantenimiento para detectar bloqueos antes de que afecten al huésped.',
        tag: 'Entregas entre equipos',
      },
      {
        number: '03',
        title: 'Mantenimiento',
        text: 'Gestiona planes preventivos y órdenes urgentes con responsable, prioridad, historial, fotos y evidencia de cierre.',
        tag: 'Activos + órdenes',
      },
      {
        number: '04',
        title: 'Calidad y cumplimiento',
        text: 'Convierte estándares en listas, inspecciones, aprobaciones y registros auditables para cada propiedad.',
        tag: 'SOPs + inspecciones',
      },
    ],
    processEyebrow: 'De la señal a la certeza',
    processTitle: <>Captura. Coordina. <em>Comprueba.</em></>,
    processLead:
      'Whagons hace visible todo el ciclo operativo: desde la primera señal en el piso hasta un resultado verificado que la gerencia puede revisar.',
    steps: [
      ['Captura', 'Crea trabajo desde un teléfono, computadora, formulario, código QR, programación o sistema conectado.'],
      ['Coordina', 'Asigna responsables, plazos, prioridades, aprobaciones y reglas de escalamiento según el hotel.'],
      ['Mejora', 'Verifica el cierre, revisa patrones y usa datos reales para fortalecer el siguiente turno.'],
    ],
    productEyebrow: 'Una imagen operativa más clara',
    productTitle: 'Una vista para cada turno. El detalle correcto para cada rol.',
    productText:
      'El personal ve qué hacer ahora. Los gerentes ven excepciones antes de que se conviertan en problemas para el huésped. Los líderes ven los patrones detrás del desempeño.',
    dashboardTitle: 'Operaciones del hotel',
    dashboardSubtitle: 'Hoy · Todos los departamentos · Ilustrativo',
    dashboardMetrics: [
      ['Abiertas', '38'],
      ['A tiempo', '91%'],
      ['En riesgo', '6'],
      ['Completadas', '124'],
    ],
    dashboardFeed: 'Flujo en vivo',
    dashboardRows: [
      ['Hab. 418 · A/C', 'Ingeniería', '12 min restantes'],
      ['Inspección de llegada', 'Ama de llaves', 'Revisar'],
      ['Lista de piscina', 'Recreación', 'Completada'],
    ],
    capabilities: [
      ['Automatización de flujos', 'Mueve automáticamente el trabajo recurrente y reactivo.'],
      ['Trabajo móvil', 'Fotos, formularios, firmas, QR, códigos, GPS y NFC.'],
      ['Escalamientos y aprobaciones', 'Mantén el trabajo importante en marcha sin perseguir avances.'],
      ['Analítica e IA', 'Detecta demoras, problemas recurrentes y la próxima acción.'],
      ['SOPs y conocimiento', 'Ubica procedimientos y capacitación donde ocurre el trabajo.'],
      ['API e integraciones', 'Conecta los sistemas que los equipos del hotel ya utilizan.'],
    ],
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
    marketsTitle: 'Los hoteles son el foco. Otros equipos operativos también son bienvenidos.',
    marketsText:
      'Los mismos principios operativos —responsabilidad clara, tiempos visibles, estándares consistentes y cierres verificados— apoyan trabajo complejo en otras industrias.',
    featuredMarket: ['Hotelería', 'El mercado prioritario de Whagons: servicio al huésped, habitaciones, mantenimiento, inspecciones y cada entrega entre equipos.'],
    featuredLink: 'Explorar operaciones hoteleras',
    markets: [
      ['Retail', 'Ejecución en múltiples sedes'],
      ['Mantenimiento industrial', 'Activos y trabajo en campo'],
      ['Farma y alimentos', 'Trazabilidad y cumplimiento'],
      ['Salud y educación', 'Protocolos y estándares'],
      ['Construcción', 'Avance y control en obra'],
    ],
    exploreMarket: 'Explorar',
    finalEyebrow: 'Tu operación, visible',
    finalTitle: 'Mira Whagons aplicado a un flujo real de tu hotel.',
    finalText:
      'Enfocaremos la conversación en tus equipos, tus entregas y el resultado operativo que necesitas; no en un recorrido genérico del producto.',
    finalCta: 'Solicitar mi demo',
  },
} as const;

const marketSlugs = ['retail', 'mantenimiento', 'farmaceutica', 'salud-educacion', 'construccion'];

export default function HomePage({ lang }: { lang: Language }) {
  const t = content[lang];
  const demoHref = `/${lang}/demo`;
  const platformHref = lang === 'en' ? '/en/platform' : '/es/plataforma';
  const hotelHref = lang === 'en' ? '/en/hotel-operations' : '/es/industrias#hoteleria';
  const industriesHref = lang === 'en' ? '/en/industries' : '/es/industrias';

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t.heroEyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className={styles.heroLead}>{t.heroLead}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href={demoHref}>{t.primaryCta}<span aria-hidden="true">↗</span></a>
            <a className={styles.textButton} href="#how-it-works">{t.secondaryCta}<span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.heroPoints}>
            {t.heroPoints.map((point) => <span key={point}>{point}</span>)}
          </div>
        </div>

        <div className={styles.heroVisual}>
          <Image
            src="/images/industries/hoteleria.jpg"
            alt={t.heroAlt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.heroImage}
          />
          <div className={styles.photoWash} />
          <div className={styles.workflowCard}>
            <div className={styles.workflowHead}>
              <div>
                <span>{t.liveWorkflow}</span>
                <strong>{t.workflowTitle}</strong>
                <small>{t.room}</small>
              </div>
              <span className={styles.liveStatus}><i />{t.managerView}</span>
            </div>
            <div className={styles.workflowBody}>
              {t.workflowRows.map(([title, detail, status], index) => (
                <div className={styles.workflowRow} key={title}>
                  <span className={styles.workflowNumber}>{index + 1}</span>
                  <div><strong>{title}</strong><small>{detail}</small></div>
                  <span className={index === 1 ? styles.statusWarm : styles.status}>{status}</span>
                </div>
              ))}
            </div>
            <div className={styles.workflowFoot}>
              {t.workflowControls.map((control) => <span key={control}>{control}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.signalStrip} aria-label={lang === 'es' ? 'Momentos operativos del hotel' : 'Hotel operating moments'}>
        {t.signalItems.map(([title, text]) => (
          <div key={title}><strong>{title}</strong><span>{text}</span></div>
        ))}
      </section>

      <section className={styles.section} id="hotel-operations">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>{t.problemEyebrow}</p>
          <h2>{t.problemTitle}</h2>
          <p>{t.problemText}</p>
        </div>
        <div className={styles.momentsGrid}>
          {t.moments.map((moment) => (
            <article className={styles.momentCard} key={moment.number}>
              <div className={styles.momentTop}><span>{moment.number}</span><small>{moment.tag}</small></div>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
              <span className={styles.cardArrow} aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.process} id="how-it-works">
        <div className={styles.processIntro}>
          <p className={styles.eyebrow}>{t.processEyebrow}</p>
          <h2>{t.processTitle}</h2>
          <p>{t.processLead}</p>
          <a className={styles.lightButton} href={platformHref}>{lang === 'es' ? 'Explorar la plataforma' : 'Explore the platform'}<span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.steps}>
          {t.steps.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.productSection}`}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>{t.productEyebrow}</p>
          <h2>{t.productTitle}</h2>
          <p>{t.productText}</p>
        </div>
        <div className={styles.productGrid}>
          <div className={styles.dashboard} aria-label={t.dashboardTitle}>
            <div className={styles.dashboardNav}>
              <span className={styles.dashboardMark} aria-hidden="true" />
              <div><strong>{t.dashboardTitle}</strong><small>{t.dashboardSubtitle}</small></div>
              <span className={styles.avatar}>MO</span>
            </div>
            <div className={styles.metricGrid}>
              {t.dashboardMetrics.map(([label, value], index) => (
                <div key={label}><span className={styles.metricIcon} data-index={index} /><small>{label}</small><strong>{value}</strong></div>
              ))}
            </div>
            <div className={styles.feed}>
              <div className={styles.feedHead}><strong>{t.dashboardFeed}</strong><span>{lang === 'es' ? 'Ahora' : 'Now'}</span></div>
              {t.dashboardRows.map(([title, team, status], index) => (
                <div className={styles.feedRow} key={title}>
                  <span className={styles.feedDot} data-index={index} />
                  <strong>{title}</strong><small>{team}</small><span>{status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.capabilityGrid}>
            {t.capabilities.map(([title, text], index) => (
              <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.proofSection}>
        <div className={styles.proofCopy}>
          <p className={styles.eyebrow}>{t.proofEyebrow}</p>
          <h2>{t.proofTitle}</h2>
          <p>{t.proofText}</p>
          <div className={styles.award}>
            <span aria-hidden="true">★</span>
            <div><strong>{t.awardTitle}</strong><p>{t.awardEvent}</p><small>{t.awardNote}</small></div>
          </div>
        </div>
        <aside className={styles.proofCard}>
          <p>{t.proofCardEyebrow}</p>
          <h3>{t.proofCardTitle}</h3>
          <div>
            {t.proofCardItems.map((item, index) => (
              <span key={item}><i>0{index + 1}</i>{item}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className={`${styles.section} ${styles.marketsSection}`} id="markets">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>{t.marketsEyebrow}</p>
          <h2>{t.marketsTitle}</h2>
          <p>{t.marketsText}</p>
        </div>
        <div className={styles.marketsGrid}>
          <a className={styles.featuredMarket} href={hotelHref}>
            <span>01 / {lang === 'es' ? 'Mercado prioritario' : 'Priority market'}</span>
            <div><h3>{t.featuredMarket[0]}</h3><p>{t.featuredMarket[1]}</p></div>
            <strong>{t.featuredLink}<span aria-hidden="true">↗</span></strong>
          </a>
          <div className={styles.otherMarkets}>
            {t.markets.map(([title, text], index) => (
              <a href={`${industriesHref}#${marketSlugs[index]}`} key={title}>
                <span>0{index + 2}</span><div><h3>{title}</h3><p>{text}</p></div><strong>{t.exploreMarket} ↗</strong>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.eyebrow}>{t.finalEyebrow}</p>
        <h2>{t.finalTitle}</h2>
        <p>{t.finalText}</p>
        <a className={styles.primaryButton} href={demoHref}>{t.finalCta}<span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}
