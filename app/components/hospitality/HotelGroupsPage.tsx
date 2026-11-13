import Image from 'next/image';
import HospitalityAnalytics from './HospitalityAnalytics';
import OperationsHeroDemo from '../home/OperationsHeroDemo';
import Backdrop from '../home/sections/Backdrop';
import CountUp from '../home/CountUp';
import { MEDIA } from '../home/hero/media';
import Departments, { type DepartmentKey } from './Departments';
import FlowSteps from './FlowSteps';
import HotelHero from './HotelHero';
import TaskGridMock from '../product/TaskGridMock';
import PhoneCrop from '../product/PhoneCrop';
import { routeFor } from '../../lib/locales';
import home from '../home/HomePage.module.css';
import s from './HotelGroupsPage.module.css';

/*
 * The hotel page for hotels and hotel groups: /es/operaciones-hoteleras and
 * /en/hotel-operations.
 *
 * It looks and moves like the home page: the same living mosaic, with hotel
 * scenes and a room key card in place of the plug (HotelHero), the room 204
 * example playing step by step (FlowSteps), the departments as an index that
 * moves on by itself (Departments), and the home page's buttons, questions
 * and closing band (their styles come from HomePage.module.css).
 *
 * The page shows no prices or plans and does not link to the pricing page.
 * Every mention of the PMS says that Whagons integrates with it and does not
 * replace it. The only customer figures are the published refrigeration case.
 */

type Headline = [plain: string, accent: string];

const copy = {
  es: {
    ids: { departments: 'departamentos', groups: 'grupos', integrations: 'integraciones', start: 'empezar', contact: 'contacto' },
    eyebrow: 'Whagons para hoteles y grupos hoteleros',
    title: ['Una gran estadía empieza', 'detrás de escena.'] as Headline,
    lead: 'Conecta recepción, ama de llaves, mantenimiento y calidad para que cada solicitud tenga responsable y cada turno sepa qué sigue. En un hotel o en todos los de tu grupo.',
    demo: 'Conversemos sobre tu hotel',
    brand: 'Whagons · Hospitalidad',
    mosaicLabel: 'Mosaico de escenas de un hotel: la propiedad, habitaciones, limpieza, mantenimiento, cocina y servicio. Después todos los cuadros giran y forman una animación de la interfaz de Whagons en la que se crea una solicitud, se asigna, cambia de estado y se actualizan los indicadores.',
    pause: 'Pausar la animación',
    play: 'Reanudar la animación',
    ribbon: ['Cada solicitud, con responsable', 'Cada lugar, con historial', 'Cada turno, con contexto'],
    sectionsLabel: 'Secciones de la página',
    sections: ['Departamentos', 'Grupos hoteleros', 'Integraciones', 'Cómo empezar'],
    problem: {
      eyebrow: 'Lo que pasa hoy',
      title: ['El huésped no ve el desorden.', 'Pero lo siente.'] as Headline,
      cards: [
        ['La solicitud se pierde', 'Sale de recepción por radio o por chat y nadie sabe quién la tomó ni cuándo queda.'],
        ['El turno empieza a ciegas', 'Los pendientes se entregan de palabra. Lo que no se dijo, no se hace.'],
        ['La avería vuelve', 'Sin historial de la habitación ni del equipo, se repara lo mismo una y otra vez.'],
        ['Cada hotel mide distinto', 'La dirección recibe reportes que no se pueden comparar, y los recibe tarde.'],
      ],
    },
    flow: {
      eyebrow: 'Ejemplo de operación',
      title: ['El huésped ve un hotel.', 'Tu equipo también debería.'] as Headline,
      lead: 'Una fuga en la habitación 204, de principio a fin.',
      photoAlt: 'Técnico de mantenimiento trabajando en el baño de una habitación de hotel',
      steps: [
        ['09:10 · Recepción', 'Registra', 'El huésped reporta la fuga. Recepción la registra y ve el avance sin perseguir respuestas.'],
        ['Mantenimiento', 'Repara', 'El técnico recibe ubicación y detalle en su teléfono. Cierra con evidencia.'],
        ['Ama de llaves', 'Revisa', 'La supervisora inspecciona y libera la habitación para la siguiente llegada.'],
        ['Gerencia', 'Ve el conjunto', 'El caso queda en el historial de la 204 y suma a los indicadores del hotel.'],
      ],
    },
    departments: {
      eyebrow: 'Por departamento',
      title: ['Cada equipo trabaja a su manera.', 'Todos en el mismo lugar.'] as Headline,
      cards: [
        ['housekeeping', 'Ama de llaves', ['Limpieza e inspección de habitaciones y áreas públicas', 'Checklists con evidencia de cierre', 'Solicitudes de huésped con plazo']],
        ['maintenance', 'Mantenimiento', ['Averías con ubicación, prioridad y estado', 'Activos con historial y planes preventivos', 'Rutinas que crean sus tareas a tiempo']],
        ['frontDesk', 'Recepción', ['Registro de lo que pide el huésped', 'Avance visible sin llamar a nadie', 'Aviso cuando algo está por vencer']],
        ['quality', 'Calidad', ['Estándares y documentos al alcance de cada puesto', 'Auditorías programadas', 'Hallazgos que se convierten en tareas']],
        ['food', 'Alimentos y bebidas', ['Checklists de apertura y cierre', 'Rutinas de limpieza por estación', 'Reportes de equipo de cocina']],
        ['management', 'Gerencia', ['Tarjetas KPI por área', 'Vencidas, en curso y completadas hoy', 'Metas por equipo']],
      ] as [DepartmentKey, string, string[]][],
    },
    product: {
      eyebrow: 'El trabajo, a la vista',
      title: ['Menos preguntas sobre el estado.', 'Más claridad para actuar.'] as Headline,
      lead: 'Organiza tareas por equipo, ubicación y prioridad. El siguiente turno puede retomar los pendientes y consultar lo que ya se hizo.',
      shotAlt: 'Tabla de tareas de mantenimiento en Whagons, con ubicaciones, prioridades y responsables',
    },
    capture: {
      eyebrow: 'Desde el lugar donde pasa',
      title: ['Reportar debería ser', 'la parte fácil.'] as Headline,
      cards: [
        ['Voz', 'Repórtalo', 'Dicta la incidencia en tus palabras y revisa el texto antes de enviarlo.'],
        ['QR', 'Identifícalo', 'Escanea el código de la habitación o del equipo. El lugar ya queda registrado.'],
        ['NFC', 'Confirma en sitio', 'Acerca el teléfono a la etiqueta para confirmar que la ronda se hizo ahí.'],
      ],
    },
    groups: {
      eyebrow: 'Para grupos hoteleros',
      title: ['Un estándar.', 'Todas tus propiedades.'] as Headline,
      lead: 'Define cómo se trabaja una vez y llévalo a cada hotel. Compara propiedades con los mismos indicadores.',
      cards: [
        ['Una plantilla por marca', 'Espacios, estados, formularios y rutinas configurados una vez y replicados en cada propiedad.'],
        ['La misma medida para todos', 'Los mismos indicadores en cada hotel, con reportes consolidados del grupo.'],
        ['Cada quien ve lo suyo', 'Acceso según el rol: el hotel ve su operación y corporativo ve el conjunto.'],
      ],
    },
    integrations: {
      eyebrow: 'Integraciones',
      title: ['Tu PMS sigue mandando.', 'Whagons se conecta.'] as Headline,
      lead: 'Whagons no reemplaza tu PMS ni tu ERP. Se integra con Cloudbeds, OPERA Cloud y Mews, y con cualquier otro PMS por API.',
      pmsLabel: 'PMS con los que se integra',
      pms: ['Cloudbeds', 'OPERA Cloud', 'Mews'],
      anyPms: 'Cualquier otro PMS, por API',
      cards: [
        ['Asistentes de IA', 'Un agente sugiere quién toma cada tarea nueva. El asistente responde preguntas sobre tu operación.'],
        ['Herramientas a la medida', 'Si tu hotel tiene un proceso propio, lo configuramos: formularios, flujos, tableros y desarrollos específicos.'],
        ['Powerups', 'Suma personal, abastecimiento, movilidad o capacitación cuando los necesites.'],
      ],
    },
    // A third figure, from a hotel, joins these two when that case exists.
    results: {
      eyebrow: 'Resultados',
      title: ['Lo que cambia cuando', 'el trabajo queda a la vista.'] as Headline,
      stats: [
        ['80 % menos', 'Visitas repetidas en un equipo de mantenimiento de refrigeración, en 60 días.'],
        ['De 2 días a 4 horas', 'Tiempo de resolución en ese mismo equipo.'],
      ],
    },
    start: {
      eyebrow: 'Cómo empezar',
      title: ['Empieza por un día real', 'de tu hotel.'] as Headline,
      steps: [
        ['01 · Evaluación', 'Evaluamos tu hotel', 'Revisamos una solicitud frecuente, los equipos que intervienen y dónde se pierde tiempo.'],
        ['02 · 90 días', 'Piloto con metas', 'De uno a tres hoteles, con indicadores que tú defines sobre tu propia línea base.'],
        ['03 · A tu ritmo', 'Más áreas y propiedades', 'Lo que funcionó se replica en el resto del grupo con la configuración ya probada.'],
      ],
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: ['Lo que nos preguntan', 'los hoteleros.'] as Headline,
      items: [
        ['¿Whagons reemplaza mi PMS?', 'No. Tu PMS sigue siendo el registro principal. Whagons coordina el trabajo operativo y se integra con Cloudbeds, OPERA Cloud, Mews o el PMS que uses, por API.'],
        ['¿Funciona donde no hay señal?', 'Sí. Tu equipo consulta la información guardada sin conexión, y los cambios compatibles se sincronizan cuando vuelve la señal.'],
        ['¿Mi personal necesita un teléfono especial?', 'No. Whagons funciona en el teléfono y en la web, y el acceso depende del rol de cada persona.'],
        ['¿Cómo es la implementación?', 'Por etapas. Configuramos tu operación, capacitamos al equipo y acompañamos la puesta en marcha, empezando por un flujo concreto.'],
        ['¿Sirve para un solo hotel?', 'Sí. Puedes empezar con una propiedad y ampliar a más áreas o más hoteles cuando quieras.'],
      ],
    },
    final: {
      title: ['Que el buen servicio se note.', 'Y el trabajo detrás también.'] as Headline,
    },
  },
  en: {
    ids: { departments: 'departments', groups: 'groups', integrations: 'integrations', start: 'get-started', contact: 'contact' },
    eyebrow: 'Whagons for hotels and hotel groups',
    title: ['A great stay starts', 'behind the scenes.'] as Headline,
    lead: 'Connect front desk, housekeeping, maintenance and quality so every request has an owner and every shift knows what comes next. In one hotel or across your whole group.',
    demo: 'Let’s talk about your hotel',
    brand: 'Whagons · Hospitality',
    mosaicLabel: 'A mosaic of hotel scenes: the property, rooms, cleaning, maintenance, kitchen and service. Then every tile turns over and together they form an animation of the Whagons interface, where a request is created, assigned, moves through its statuses and the indicators update.',
    pause: 'Pause the animation',
    play: 'Resume the animation',
    ribbon: ['Every request, with an owner', 'Every place, with a history', 'Every shift, with context'],
    sectionsLabel: 'Page sections',
    sections: ['Departments', 'Hotel groups', 'Integrations', 'How to start'],
    problem: {
      eyebrow: 'What happens today',
      title: ['Guests don’t see the disorder.', 'But they feel it.'] as Headline,
      cards: [
        ['The request gets lost', 'It leaves the front desk by radio or chat, and nobody knows who took it or when it will be done.'],
        ['The shift starts blind', 'Open work is handed over by word of mouth. What wasn’t said doesn’t get done.'],
        ['The fault comes back', 'With no history for the room or the equipment, the same thing gets repaired again and again.'],
        ['Every hotel measures differently', 'Management gets reports that can’t be compared, and gets them late.'],
      ],
    },
    flow: {
      eyebrow: 'Example workflow',
      title: ['Guests see one hotel.', 'Your team should, too.'] as Headline,
      lead: 'A leak in room 204, from start to finish.',
      photoAlt: 'Maintenance technician working in the bathroom of a hotel room',
      steps: [
        ['09:10 · Front desk', 'Records it', 'The guest reports the leak. Front desk records it and follows progress without chasing replies.'],
        ['Maintenance', 'Repairs it', 'The technician gets the location and the details on their phone, and closes with evidence.'],
        ['Housekeeping', 'Inspects it', 'The supervisor inspects the room and releases it for the next arrival.'],
        ['Management', 'Sees the whole picture', 'The case stays in room 204’s history and counts towards the hotel’s indicators.'],
      ],
    },
    departments: {
      eyebrow: 'By department',
      title: ['Every team works its own way.', 'All in the same place.'] as Headline,
      cards: [
        ['housekeeping', 'Housekeeping', ['Cleaning and inspection of rooms and public areas', 'Checklists with evidence at close', 'Guest requests with a deadline']],
        ['maintenance', 'Maintenance', ['Faults with location, priority and status', 'Assets with history and preventive plans', 'Routines that create their tasks on time']],
        ['frontDesk', 'Front desk', ['A record of what the guest asks for', 'Progress in view without calling anyone', 'An alert when something is about to be overdue']],
        ['quality', 'Quality', ['Standards and documents within reach of every role', 'Scheduled audits', 'Findings that become tasks']],
        ['food', 'Food and beverage', ['Opening and closing checklists', 'Cleaning routines by station', 'Kitchen equipment reports']],
        ['management', 'Management', ['KPI cards by area', 'Overdue, in progress and completed today', 'Goals by team']],
      ] as [DepartmentKey, string, string[]][],
    },
    product: {
      eyebrow: 'Work in view',
      title: ['Fewer questions about status.', 'More clarity to act.'] as Headline,
      lead: 'Organize tasks by team, location and priority. The next shift can pick up open work and check what has already been done.',
      shotAlt: 'Whagons maintenance task grid with locations, priorities and assignees',
    },
    capture: {
      eyebrow: 'Where the work happens',
      title: ['Reporting should be', 'the easy part.'] as Headline,
      cards: [
        ['Voice', 'Report it', 'Dictate the issue in your own words and check the text before you send it.'],
        ['QR', 'Identify it', 'Scan the code on the room or the equipment. The place is already recorded.'],
        ['NFC', 'Confirm on site', 'Hold your phone to the tag to confirm the round was done there.'],
      ],
    },
    groups: {
      eyebrow: 'For hotel groups',
      title: ['One standard.', 'All your properties.'] as Headline,
      lead: 'Define how work is done once and take it to every hotel. Compare properties with the same indicators.',
      cards: [
        ['One template per brand', 'Spaces, statuses, forms and routines set up once and replicated in every property.'],
        ['The same measure for everyone', 'The same indicators in every hotel, with consolidated reports for the group.'],
        ['Everyone sees their own', 'Access by role: the hotel sees its operation and corporate sees the whole.'],
      ],
    },
    integrations: {
      eyebrow: 'Integrations',
      title: ['Your PMS stays in charge.', 'Whagons connects.'] as Headline,
      lead: 'Whagons does not replace your PMS or your ERP. It integrates with Cloudbeds, OPERA Cloud and Mews, and with any other PMS via API.',
      pmsLabel: 'PMS it integrates with',
      pms: ['Cloudbeds', 'OPERA Cloud', 'Mews'],
      anyPms: 'Any other PMS, via API',
      cards: [
        ['AI assistants', 'An agent suggests who takes each new task. The assistant answers questions about your operation.'],
        ['Tools made to measure', 'If your hotel has a process of its own, we set it up: forms, flows, boards and specific development.'],
        ['Powerups', 'Add staffing, procurement, mobility or training when you need them.'],
      ],
    },
    // A third figure, from a hotel, joins these two when that case exists.
    results: {
      eyebrow: 'Results',
      title: ['What changes when', 'the work is in view.'] as Headline,
      stats: [
        ['80% fewer', 'Repeat visits in a refrigeration maintenance team, in 60 days.'],
        ['From 2 days to 4 hours', 'Resolution time in that same team.'],
      ],
    },
    start: {
      eyebrow: 'How to start',
      title: ['Start with a real day', 'at your hotel.'] as Headline,
      steps: [
        ['01 · Assessment', 'We assess your hotel', 'We look at a frequent request, the teams involved and where time is lost.'],
        ['02 · 90 days', 'A pilot with goals', 'One to three hotels, with indicators you define against your own baseline.'],
        ['03 · At your pace', 'More areas and properties', 'What worked is replicated across the rest of the group, with the configuration already proven.'],
      ],
    },
    faq: {
      eyebrow: 'Frequently asked questions',
      title: ['What hoteliers', 'ask us.'] as Headline,
      items: [
        ['Does Whagons replace my PMS?', 'No. Your PMS remains the main record. Whagons coordinates the operational work and integrates with Cloudbeds, OPERA Cloud, Mews or the PMS you use, via API.'],
        ['Does it work where there is no signal?', 'Yes. Your team can check saved information offline, and compatible changes sync when the signal returns.'],
        ['Does my staff need a special phone?', 'No. Whagons works on the phone and on the web, and access depends on each person’s role.'],
        ['What is implementation like?', 'In stages. We set up your operation, train the team and support the launch, starting with one specific workflow.'],
        ['Does it work for a single hotel?', 'Yes. You can start with one property and expand to more areas or more hotels whenever you want.'],
      ],
    },
    final: {
      title: ['Make great service visible.', 'And the work behind it, too.'] as Headline,
    },
  },
} as const;

type Language = keyof typeof copy;

function Arrow() {
  return (
    <svg className={home.arrow} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Section heading: eyebrow, a two-beat title with the second half in the accent colour, and an optional lead. */
function Head({ eyebrow, title, lead, id }: { eyebrow: string; title: Readonly<Headline>; lead?: string; id?: string }) {
  return (
    <div className={s.head} data-reveal="">
      <p className={s.eyebrow}>{eyebrow}</p>
      <h2 id={id}>{title[0]} <em>{title[1]}</em></h2>
      {lead && <p className={s.lead}>{lead}</p>}
    </div>
  );
}

export default function HotelGroupsPage({ lang = 'es' }: { lang?: Language }) {
  const t = copy[lang];
  const market = lang === 'es' ? 'latam' : 'us';

  return <>
    <HospitalityAnalytics page={`${market}_hotel_operations`} market={market} />
    <main className={`${home.page} ${s.page}`}>
      {/* ── Hero ──────────────────────────────────── */}
      <HotelHero lang={lang} copy={{
        badge: t.eyebrow,
        titleA: t.title[0],
        titleB: t.title[1],
        lead: t.lead,
        primary: { label: t.demo, href: routeFor(lang, 'demo'), track: 'operations_demo_click' },
        mosaicLabel: t.mosaicLabel,
        pause: t.pause,
        play: t.play,
      }} />
      <ul className={s.ribbon}>{t.ribbon.map((item, i) => <li key={item}><b>0{i + 1}</b>{item}</li>)}</ul>

      {/* Not a <nav> element: the site styles every <nav> as the fixed top bar. */}
      <div className={s.sections} role="navigation" aria-label={t.sectionsLabel}>
        {([t.ids.departments, t.ids.groups, t.ids.integrations, t.ids.start] as const).map((id, i) => <a key={id} href={`#${id}`}>{t.sections[i]}</a>)}
      </div>

      {/* ── The problem ───────────────────────────── */}
      <section className={`${s.band} ${s.problem}`}>
        <Head eyebrow={t.problem.eyebrow} title={t.problem.title} />
        <ol className={s.rows}>
          {t.problem.cards.map(([title, text], i) => (
            <li key={title} data-reveal="" style={{ ['--d' as string]: `${i * 0.05}s` }}>
              <span className={s.num}>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Room 204 ──────────────────────────────── */}
      <section className={`${s.band} ${s.dark}`}>
        <Head eyebrow={t.flow.eyebrow} title={t.flow.title} lead={t.flow.lead} />
        <FlowSteps steps={t.flow.steps} photo={MEDIA.plumbing.src} focus={MEDIA.plumbing.focus} alt={t.flow.photoAlt} caption={MEDIA.plumbing.label[lang]} />
      </section>

      {/* ── By department ─────────────────────────── */}
      <section className={s.band} id={t.ids.departments}>
        <Head eyebrow={t.departments.eyebrow} title={t.departments.title} />
        <Departments lang={lang} items={t.departments.cards.map(([key, name, points]) => ({ key, name, points }))} />
      </section>

      {/* ── The work in view ──────────────────────── */}
      <section className={`${s.band} ${s.white}`}>
        <div className={s.split}>
          <Head eyebrow={t.product.eyebrow} title={t.product.title} />
          <p className={s.lead} data-reveal="">{t.product.lead}</p>
        </div>
        <div className={s.stage} data-reveal="">
          <figure className={s.screenshot}>
            <div className={s.screenshotBar}><span aria-hidden="true">● ● ●</span> Whagons · Hotel Premium</div>
            <PhoneCrop><TaskGridMock lang={lang} label={t.product.shotAlt} /></PhoneCrop>
          </figure>
        </div>
      </section>

      {/* ── Voice, QR and NFC ─────────────────────── */}
      <section className={s.band}>
        <Head eyebrow={t.capture.eyebrow} title={t.capture.title} />
        <div className={s.capture}>
          <div className={s.channels}>
            {t.capture.cards.map(([label, title, text], i) => (
              <article key={label} data-reveal="" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <span className={s.chip}>{label}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
          <div className={s.demo} data-reveal=""><OperationsHeroDemo lang={lang} /></div>
        </div>
      </section>

      {/* ── Hotel groups ──────────────────────────── */}
      <section className={`${s.band} ${s.groups}`} id={t.ids.groups}>
        <Image className={s.groupsPhoto} src="/images/photos/lobby.jpg" alt="" fill sizes="100vw" />
        <Head eyebrow={t.groups.eyebrow} title={t.groups.title} lead={t.groups.lead} />
        <div className={`${s.cards} ${s.three}`}>
          {t.groups.cards.map(([title, text], i) => (
            <article className={s.glass} key={title} data-reveal="" style={{ ['--d' as string]: `${i * 0.06}s` }}>
              <span className={s.num}>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Integrations ──────────────────────────── */}
      <section className={s.band} id={t.ids.integrations}>
        <div className={s.integrations}>
          <Head eyebrow={t.integrations.eyebrow} title={t.integrations.title} lead={t.integrations.lead} />
          <ul className={s.pms} aria-label={t.integrations.pmsLabel} data-reveal="">
            {t.integrations.pms.map((name) => <li key={name}><span aria-hidden="true" />{name}</li>)}
            <li className={s.anyPms}>{t.integrations.anyPms}</li>
          </ul>
        </div>
        <div className={`${s.cards} ${s.three}`}>
          {t.integrations.cards.map(([title, text], i) => (
            <article className={s.card} key={title} data-reveal="" style={{ ['--d' as string]: `${i * 0.06}s` }}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Results ───────────────────────────────── */}
      <section className={`${s.band} ${s.resultsBand}`}>
        <div className={s.results} data-reveal="">
          <div className={s.head}>
            <p className={s.eyebrow}>{t.results.eyebrow}</p>
            <h2>{t.results.title[0]} <em>{t.results.title[1]}</em></h2>
          </div>
          <dl>
            {t.results.stats.map(([figure, text]) => (
              <div key={figure}><dt><CountUp value={figure} /></dt><dd>{text}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── How to start ──────────────────────────── */}
      <section className={`${s.band} ${s.white}`} id={t.ids.start}>
        <Head eyebrow={t.start.eyebrow} title={t.start.title} />
        <ol className={s.steps}>
          {t.start.steps.map(([label, title, text], i) => (
            <li key={title} data-reveal="" style={{ ['--d' as string]: `${i * 0.07}s` }}>
              <span className={s.tag}>{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Questions ─────────────────────────────── */}
      <section className={`${home.faq} ${s.faq}`}>
        <div className={home.faqIntro} data-reveal="">
          <div className={s.head}>
            <p className={s.eyebrow}>{t.faq.eyebrow}</p>
            <h2>{t.faq.title[0]} <em>{t.faq.title[1]}</em></h2>
          </div>
          <div className={home.faqPhoto}>
            <Image src="/images/photos/hero-woman.jpg" alt="" fill sizes="(max-width: 999px) 92vw, 460px" style={{ objectPosition: '60% 30%' }} />
          </div>
        </div>
        <div className={home.faqList} data-reveal="" style={{ ['--d' as string]: '.06s' }}>
          {t.faq.items.map(([question, answer], i) => (
            <details key={question} className={home.faqItem} open={i === 0}>
              <summary>{question}<span className={home.faqIcon} aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Closing ───────────────────────────────── */}
      <section className={`${home.final} ${s.final}`} id={t.ids.contact}>
        <Backdrop src={MEDIA.hotelRoomService.src} poster={MEDIA.hotelRoomService.poster!} focus={MEDIA.hotelRoomService.focus} />
        <div className={home.finalInner} data-reveal="">
          <p className={home.finalEyebrow}>{t.brand}</p>
          <h2>{t.final.title[0]} <em>{t.final.title[1]}</em></h2>
          <div className={home.finalActions}>
            <a className={home.btnPrimary} href={routeFor(lang, 'demo')} data-track="operations_final_demo_click">{t.demo}<Arrow /></a>
          </div>
        </div>
      </section>
    </main>
  </>;
}
