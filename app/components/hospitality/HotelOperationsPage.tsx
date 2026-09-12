import HospitalityAnalytics from './HospitalityAnalytics';
import Image from 'next/image';

type HotelPageLanguage = 'en' | 'es';

const content = {
  en: {
    heroEyebrow: 'Built for the work between hotel departments',
    heroTitle: <>One operating layer. <span className="pg-accent">Every handoff visible.</span></>,
    heroLead:
      'Hotels already have systems of record. Whagons focuses on the work that moves between people, departments, shifts, and properties after a request or standard needs action.',
    primaryCta: 'Request a tailored demo',
    secondaryCta: 'Explore the platform',
    shotCaption: 'Task grid · Maintenance · Whagons',
    shotAlt: 'Whagons task grid showing maintenance work with owners, due times, and status',
    flow: {
      signal: 'Guest request',
      first: 'Front desk',
      second: 'Operating department',
      third: 'Manager verification',
      controls: 'Owner · due time · escalation · evidence',
    },
    departmentsEyebrow: 'Department-level clarity',
    departmentsTitle: 'Give each team the part of the workflow it owns.',
    departmentsLead:
      'The goal is not to make every employee a project manager. Each role sees the work, context, standard, and next action required from that role.',
    departments: [
      ['01', 'Front desk', 'Capture the request, set the operational handoff in motion, and see whether guest follow-up has happened.'],
      ['02', 'Housekeeping', 'Own room-readiness exceptions, inspections, corrective actions, and cross-shift carryover.'],
      ['03', 'Engineering', 'Receive complete requests, work against due times, attach completion evidence, and flag exceptions.'],
      ['04', 'Operations leaders', 'See late work, escalations, repeated failure points, and where a handoff needs intervention.'],
      ['05', 'Regional teams', 'Compare an agreed workflow across properties without forcing every hotel into one generic process.'],
    ],
    momentsEyebrow: 'High-value handoff moments',
    momentsTitle: 'Start where ambiguity creates guest or manager risk.',
    momentsLead:
      'A strong first workflow crosses a boundary, happens often enough to observe, and matters enough that the hotel will measure whether it improves.',
    moments: [
      ['Guest request to resolution', 'The guest-facing team can see who owns the operating response and whether follow-up is still required.'],
      ['Room exception to release', 'The teams preparing, inspecting, repairing, and releasing the room share one visible chain of work.'],
      ['Inspection finding to correction', 'A failed standard creates assigned corrective work and manager verification instead of another static report.'],
      ['Open item to next shift', 'Unfinished work carries forward with context, ownership, and timing rather than an informal message.'],
    ],
    operatorTypes: [
      {
        eyebrow: 'Independent hotels',
        title: 'Control one property without enterprise overhead.',
        text: 'Begin with one workflow, one sponsor, and the people already responsible for doing the work.',
      },
      {
        eyebrow: 'Management companies',
        title: 'Standardize the control, not every local detail.',
        text: 'Define what must be owned, timed, proven, and reviewed while allowing property-specific roles and terminology.',
      },
      {
        eyebrow: 'Multi-property operators',
        title: 'Expand after one workflow is proven.',
        text: 'Use the results from the first workflow to decide where the same operating pattern belongs next.',
      },
    ],
    finalEyebrow: 'Your hotel operation, made visible',
    finalTitle: 'Which handoff costs your managers the most follow-up?',
    finalCta: 'Request a tailored demo',
    finalNote: 'We will focus on one real workflow, the teams involved, and the operational result you need.',
  },
  es: {
    heroEyebrow: 'Diseñado para el trabajo entre departamentos del hotel',
    heroTitle: <>Una sola capa operativa. <span className="pg-accent">Cada entrega, visible.</span></>,
    heroLead:
      'Los hoteles ya cuentan con sistemas de registro. Whagons se enfoca en el trabajo que se mueve entre personas, departamentos, turnos y propiedades cuando una solicitud o estándar requiere acción.',
    primaryCta: 'Solicitar un demo personalizado',
    secondaryCta: 'Explorar la plataforma',
    shotCaption: 'Tareas · Mantenimiento · Whagons',
    shotAlt: 'Tabla de tareas de Whagons con trabajo de mantenimiento, responsables, plazos y estado',
    flow: {
      signal: 'Solicitud del huésped',
      first: 'Recepción',
      second: 'Departamento responsable',
      third: 'Verificación gerencial',
      controls: 'Responsable · plazo · escalamiento · evidencia',
    },
    departmentsEyebrow: 'Claridad por departamento',
    departmentsTitle: 'Dale a cada equipo la parte del flujo que le corresponde.',
    departmentsLead:
      'El objetivo no es convertir a cada colaborador en gerente de proyectos. Cada rol ve el trabajo, el contexto, el estándar y la próxima acción que le corresponde.',
    departments: [
      ['01', 'Recepción', 'Registra la solicitud, pone en marcha la entrega operativa y confirma si se dio seguimiento al huésped.'],
      ['02', 'Ama de llaves', 'Gestiona excepciones de habitaciones listas, inspecciones, acciones correctivas y pendientes entre turnos.'],
      ['03', 'Ingeniería', 'Recibe solicitudes completas, trabaja según los plazos, adjunta evidencia de cierre y señala excepciones.'],
      ['04', 'Líderes de operaciones', 'Ven tareas atrasadas, escalamientos, fallas recurrentes y entregas que requieren intervención.'],
      ['05', 'Equipos regionales', 'Comparan un flujo acordado entre propiedades sin forzar a cada hotel a seguir un proceso genérico.'],
    ],
    momentsEyebrow: 'Entregas operativas de alto valor',
    momentsTitle: 'Empieza donde la ambigüedad crea riesgo para el huésped o la gerencia.',
    momentsLead:
      'Un buen primer flujo cruza una frontera entre equipos, ocurre con suficiente frecuencia y produce un resultado que el hotel puede medir y mejorar.',
    moments: [
      ['De la solicitud a la resolución', 'El equipo de cara al huésped ve quién responde por la operación y si todavía hace falta darle seguimiento.'],
      ['De la excepción a la liberación de la habitación', 'Los equipos que preparan, inspeccionan, reparan y liberan la habitación comparten una sola cadena visible de trabajo.'],
      ['Del hallazgo a la corrección', 'Un estándar incumplido genera trabajo correctivo asignado y verificación gerencial, no otro informe estático.'],
      ['Del pendiente al siguiente turno', 'El trabajo sin terminar continúa con contexto, responsable y plazo, en vez de depender de un mensaje informal.'],
    ],
    operatorTypes: [
      {
        eyebrow: 'Hoteles independientes',
        title: 'Controla una propiedad sin complejidad corporativa.',
        text: 'Empieza con un flujo, un patrocinador y las personas que ya son responsables de ejecutar el trabajo.',
      },
      {
        eyebrow: 'Empresas administradoras',
        title: 'Estandariza el control, no cada detalle local.',
        text: 'Define qué debe tener responsable, plazo, evidencia y revisión, conservando los roles y términos propios de cada propiedad.',
      },
      {
        eyebrow: 'Operadores multipropiedad',
        title: 'Expande después de comprobar un flujo.',
        text: 'Usa los resultados del primer flujo para decidir dónde aplicar después el mismo patrón operativo.',
      },
    ],
    finalEyebrow: 'Tu operación hotelera, visible',
    finalTitle: '¿Qué entrega entre equipos exige más seguimiento de tus gerentes?',
    finalCta: 'Solicitar un demo personalizado',
    finalNote: 'Nos enfocaremos en un flujo real, los equipos involucrados y el resultado operativo que necesitas.',
  },
} as const;

const departmentIds = ['front-desk', 'housekeeping', 'engineering', 'operations-leaders', 'regional-teams'];
const momentIds = ['guest-requests', 'room-readiness', 'inspection-correction', 'shift-handoff'];
const momentTones = ['', 'blue', 'amber', 'green'] as const;
const operatorTones = ['blue', 'violet', 'green'] as const;

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HotelOperationsPage({ lang = 'en' }: { lang?: HotelPageLanguage }) {
  const t = content[lang];
  const demoHref = `/${lang}/demo`;
  const platformHref = lang === 'en' ? '/en/platform' : '/es/plataforma';
  const analyticsMarket = lang === 'es' ? 'latam' : 'us';

  return (
    <>
      <HospitalityAnalytics page={`${analyticsMarket}_hotel_operations`} market={analyticsMarket} />
      <main className="pg">
        <section className="pg-hero">
          <div className="pg-hero-inner pg-hero-split">
            <div className="pg-hero-copy">
              <p className="pg-eyebrow">{t.heroEyebrow}</p>
              <h1>{t.heroTitle}</h1>
              <p className="pg-lead">{t.heroLead}</p>
              <div className="pg-actions">
                <a className="pg-btn" href={demoHref} data-track="operations_demo_click">
                  {t.primaryCta}
                  <Arrow />
                </a>
                <a className="pg-btn-secondary" href={platformHref}>
                  {t.secondaryCta} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <figure className="pg-shot">
              <div className="pg-shot-bar" aria-hidden="true"><i /><i /><i /><span>{t.shotCaption}</span></div>
              <Image src="/images/demo-task-grid.png" alt={t.shotAlt} width={2048} height={1146} priority sizes="(max-width: 1000px) 100vw, 560px" />
            </figure>
          </div>
          <div className="pg-hero-inner pg-flow" aria-label={t.flow.controls}>
            <ol className="pg-flow-chain">
              <li><span className="pg-tag" data-tone="neutral">{t.flow.signal}</span></li>
              <li><span className="pg-tag" data-tone="blue">{t.flow.first}</span></li>
              <li><span className="pg-tag" data-tone="amber">{t.flow.second}</span></li>
              <li><span className="pg-tag" data-tone="green">{t.flow.third}</span></li>
            </ol>
            <p className="pg-small">{t.flow.controls}</p>
          </div>
        </section>

        <section className="pg-section">
          <div className="pg-intro">
            <p className="pg-eyebrow">{t.departmentsEyebrow}</p>
            <h2>{t.departmentsTitle}</h2>
            <p className="pg-text">{t.departmentsLead}</p>
          </div>
          <div className="pg-grid-3">
            {t.departments.map(([number, name, text], index) => (
              <article className="pg-card" id={departmentIds[index]} key={number}>
                <span className="pg-num">{number}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </article>
            ))}
            <article className="pg-card pg-card-soft">
              <span className="pg-icon" aria-hidden="true" />
              <h3>{t.flow.controls}</h3>
              <a className="pg-card-link" href={platformHref}>
                {t.secondaryCta}
                <Arrow />
              </a>
            </article>
          </div>
        </section>

        <section className="pg-band">
          <div className="pg-section">
            <div className="pg-intro">
              <p className="pg-eyebrow">{t.momentsEyebrow}</p>
              <h2>{t.momentsTitle}</h2>
              <p className="pg-text">{t.momentsLead}</p>
            </div>
            <div className="pg-grid-2">
              {t.moments.map(([title, text], index) => (
                <article className="pg-card" id={momentIds[index]} key={title} style={{ background: 'var(--bg)' }}>
                  <span className="pg-tag" data-tone={momentTones[index] || undefined}>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pg-section">
          <div className="pg-grid-3">
            {t.operatorTypes.map((operator, index) => (
              <article className="pg-card pg-card-raised" key={operator.eyebrow}>
                <span className="pg-tag" data-tone={operatorTones[index]}>{operator.eyebrow}</span>
                <h3>{operator.title}</h3>
                <p>{operator.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pg-cta">
          <div>
            <p className="pg-eyebrow">{t.finalEyebrow}</p>
            <h2>{t.finalTitle}</h2>
            <div className="pg-actions">
              <a className="pg-btn" href={demoHref} data-track="operations_final_demo_click">
                {t.finalCta}
                <Arrow />
              </a>
            </div>
            <small>{t.finalNote}</small>
          </div>
        </section>
      </main>
    </>
  );
}
