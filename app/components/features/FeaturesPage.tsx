import Image from 'next/image';
import Link from 'next/link';
import { shotsFor } from '../../lib/shots';

export type FeaturesLanguage = 'en' | 'es';

type PageContent = {
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    facts: string[];
    recordLabel: string;
    recordState: string;
    recordTitle: string;
    recordMeta: string;
    recordFields: Array<[string, string]>;
    recordFlow: Array<[string, string]>;
    proofLabel: string;
    proofItems: string[];
    shotCaption: string;
    shotAlt: string;
  };
  featureNavLabel: string;
  featureNav: Array<[string, string]>;
  chapters: Array<{
    id: string;
    number: string;
    eyebrow: string;
    title: string;
    intro: string;
    signal: string;
    signalLabel: string;
    signalDetail: string;
    shotCaption?: string;
    shotAlt?: string;
    features: Array<{ title: string; text: string }>;
  }>;
  roles: {
    eyebrow: string;
    title: string;
    lead: string;
    items: Array<{ number: string; title: string; text: string; detail: string }>;
  };
  boundary: {
    eyebrow: string;
    title: string;
    lead: string;
    worksWith: string;
    worksWithText: string;
    notReplacement: string;
    notReplacementText: string;
    startFocused: string;
    startFocusedText: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    text: string;
    primary: string;
    secondary: string;
  };
};

const content: Record<FeaturesLanguage, PageContent> = {
  en: {
    hero: {
      eyebrow: 'Hotel operations · Feature by feature',
      title: 'Control the work.',
      accent: 'Keep the context.',
      lead:
        'Whagons turns guest requests, room readiness, maintenance, inspections, and recurring routines into visible hotel work, with clear ownership from first signal to verified result.',
      primaryCta: 'Request a tailored demo',
      secondaryCta: 'Explore the platform',
      facts: ['Works alongside your PMS', 'Mobile + web', 'Configured to your operation'],
      recordLabel: 'Illustrative operating record',
      recordState: 'In progress',
      recordTitle: 'Guest room A/C issue',
      recordMeta: 'Room 418 · Engineering',
      recordFields: [
        ['Owner', 'Engineering lead'],
        ['Due', '10:30'],
        ['Priority', 'Guest impact'],
      ],
      recordFlow: [
        ['Captured', 'Front desk'],
        ['Assigned', 'Engineering'],
        ['Verify', 'Photo + note'],
      ],
      proofLabel: 'Completion evidence',
      proofItems: ['Photo', 'Checklist', 'Guest follow-up'],
      shotCaption: 'Task grid · Maintenance · Whagons',
      shotAlt: 'Whagons task grid for a maintenance workspace with owners, statuses, priorities, and due dates',
    },
    featureNavLabel: 'Feature groups',
    featureNav: [
      ['workflow-control', 'Workflow control'],
      ['mobile-execution', 'Mobile execution'],
      ['standards-knowledge', 'Standards + knowledge'],
      ['visibility-integrations', 'Visibility + integrations'],
    ],
    chapters: [
      {
        id: 'workflow-control',
        number: '01',
        eyebrow: 'Workflow control',
        title: 'Give every handoff an owner and a clock.',
        intro:
          'Coordinate reactive requests and recurring routines with the same clear operating structure. Teams know what is next; managers know what needs attention.',
        signal: 'Request → Owner → Resolution',
        signalLabel: 'Control loop',
        signalDetail: 'Visible across departments and shifts',
        features: [
          {
            title: 'Flexible work intake',
            text: 'Create work from a phone, computer, form, QR code, schedule, or connected system.',
          },
          {
            title: 'Ownership and due times',
            text: 'Set the responsible role, priority, deadline, and status so work does not disappear in a message thread.',
          },
          {
            title: 'Approvals and escalation',
            text: 'Route exceptions and approvals to the right people, with escalation rules that match the hotel.',
          },
        ],
      },
      {
        id: 'mobile-execution',
        number: '02',
        eyebrow: 'Mobile execution',
        title: 'Put the operating record where the work happens.',
        intro:
          'Frontline teams can receive, update, and complete work from the floor while preserving the context managers need to verify the outcome.',
        signal: 'Floor → Record → Manager',
        signalLabel: 'Field context',
        signalDetail: 'Captured at the point of work',
        shotCaption: 'Maintenance board · Whagons',
        shotAlt: 'Whagons Kanban board for a maintenance team with tasks to do, in review and in progress',
        features: [
          {
            title: 'Photos, forms, and signatures',
            text: 'Attach the evidence a workflow requires instead of relying on a verbal update.',
          },
          {
            title: 'QR, barcode, and NFC',
            text: 'Connect a room, area, or asset to the right workflow with familiar scan and tap interactions.',
          },
          {
            title: 'Location-aware context',
            text: 'Capture useful field context, including GPS when configured for the workflow.',
          },
        ],
      },
      {
        id: 'standards-knowledge',
        number: '03',
        eyebrow: 'Standards + knowledge',
        title: 'Turn the standard into the way work gets done.',
        intro:
          'Bring checklists, inspections, corrective actions, and operating knowledge into the workflow so teams can act consistently across every shift.',
        signal: 'Standard → Finding → Correction',
        signalLabel: 'Quality loop',
        signalDetail: 'From inspection to verification',
        features: [
          {
            title: 'Checklists and inspections',
            text: 'Make recurring standards repeatable and keep each result attached to the operating record.',
          },
          {
            title: 'Corrective actions',
            text: 'Turn a failed check into assigned follow-up work with a due time and completion evidence.',
          },
          {
            title: 'SOPs at the point of work',
            text: 'Give teams the relevant procedure and guidance inside the flow instead of sending them elsewhere to find it.',
          },
        ],
      },
      {
        id: 'visibility-integrations',
        number: '04',
        eyebrow: 'Visibility + integrations',
        title: 'See exceptions now, and patterns over time.',
        intro:
          'Give each role the level of detail it needs, then connect operating data with the systems the hotel already relies on.',
        signal: 'Today → Exceptions → Patterns',
        signalLabel: 'Manager view',
        signalDetail: 'Open, late, completed, and recurring',
        shotCaption: 'Mission Control · Whagons',
        shotAlt: 'Whagons Mission Control overview with open tasks, overdue work, completion and status breakdown',
        features: [
          {
            title: 'Role-based operating views',
            text: 'Frontline teams see the next action while managers review open work, late work, and exceptions.',
          },
          {
            title: 'Analytics and AI assistance',
            text: 'Review delays and recurring issues, and use operating context to help identify the next action.',
          },
          {
            title: 'API and integrations',
            text: 'Work alongside the PMS and other hotel systems without trying to replace their core records.',
          },
        ],
      },
    ],
    roles: {
      eyebrow: 'One system, useful at every altitude',
      title: 'The right detail for every hotel role.',
      lead: 'A shared operating record reduces the gap between the person doing the work and the person accountable for the result.',
      items: [
        {
          number: '01',
          title: 'Frontline teams',
          text: 'See what to do next and capture the result without leaving the workflow.',
          detail: 'Clear next action',
        },
        {
          number: '02',
          title: 'Managers',
          text: 'See overdue work, exceptions, and cross-team handoffs before they become guest problems.',
          detail: 'Exception visibility',
        },
        {
          number: '03',
          title: 'Leaders',
          text: 'Review the patterns behind execution across departments, shifts, and properties.',
          detail: 'Operating patterns',
        },
      ],
    },
    boundary: {
      eyebrow: 'A focused operating layer',
      title: 'Built to coordinate hotel work, not replace the hotel stack.',
      lead:
        'Whagons fits around the systems and processes already in place, then adds control where work crosses people, departments, and shifts.',
      worksWith: 'Works alongside',
      worksWithText: 'Your PMS and the other systems that hold core hotel records.',
      notReplacement: 'Does not replace',
      notReplacementText: 'A PMS, booking engine, point-of-sale system, or the teams responsible for the work.',
      startFocused: 'Starts focused',
      startFocusedText: 'Configure one meaningful workflow around your roles, terminology, priorities, and standards.',
    },
    finalCta: {
      eyebrow: 'See it around your operation',
      title: 'Bring one real hotel workflow.',
      text: 'We will use it to show how ownership, timing, escalation, and proof can work together in Whagons.',
      primary: 'Request a tailored demo',
      secondary: 'Review the platform',
    },
  },
  es: {
    hero: {
      eyebrow: 'Operaciones hoteleras · Funcionalidad por funcionalidad',
      title: 'Controla el trabajo.',
      accent: 'Conserva el contexto.',
      lead:
        'Whagons convierte solicitudes de huéspedes, alistamiento de habitaciones, mantenimiento, inspecciones y rutinas recurrentes en trabajo hotelero visible, con responsables claros desde la primera señal hasta el resultado verificado.',
      primaryCta: 'Solicita una demo personalizada',
      secondaryCta: 'Explora la plataforma',
      facts: ['Funciona junto a tu PMS', 'Móvil + web', 'Configurado a tu operación'],
      recordLabel: 'Registro operativo ilustrativo',
      recordState: 'En progreso',
      recordTitle: 'Problema con el A/C de una habitación',
      recordMeta: 'Habitación 418 · Ingeniería',
      recordFields: [
        ['Responsable', 'Líder de ingeniería'],
        ['Vence', '10:30'],
        ['Prioridad', 'Impacto al huésped'],
      ],
      recordFlow: [
        ['Registrado', 'Recepción'],
        ['Asignado', 'Ingeniería'],
        ['Verificar', 'Foto + nota'],
      ],
      proofLabel: 'Evidencia de cierre',
      proofItems: ['Foto', 'Lista de control', 'Seguimiento al huésped'],
      shotCaption: 'Tareas · Mantenimiento · Whagons',
      shotAlt: 'Cuadrícula de tareas de Whagons para un espacio de mantenimiento con responsables, estados, prioridades y vencimientos',
    },
    featureNavLabel: 'Grupos de funcionalidades',
    featureNav: [
      ['control-flujos', 'Control de flujos'],
      ['ejecucion-movil', 'Ejecución móvil'],
      ['estandares-conocimiento', 'Estándares + conocimiento'],
      ['visibilidad-integraciones', 'Visibilidad + integraciones'],
    ],
    chapters: [
      {
        id: 'control-flujos',
        number: '01',
        eyebrow: 'Control de flujos',
        title: 'Dale a cada entrega un responsable y un plazo.',
        intro:
          'Coordina solicitudes reactivas y rutinas recurrentes con una misma estructura operativa clara. Los equipos saben qué sigue; los gerentes saben qué requiere atención.',
        signal: 'Solicitud → Responsable → Resolución',
        signalLabel: 'Ciclo de control',
        signalDetail: 'Visible entre departamentos y turnos',
        features: [
          {
            title: 'Ingreso flexible de trabajo',
            text: 'Crea trabajo desde un teléfono, computadora, formulario, código QR, horario o sistema conectado.',
          },
          {
            title: 'Responsables y plazos',
            text: 'Define el rol responsable, la prioridad, el plazo y el estado para que el trabajo no se pierda en un chat.',
          },
          {
            title: 'Aprobaciones y escalamiento',
            text: 'Dirige excepciones y aprobaciones a las personas correctas, con reglas de escalamiento adaptadas al hotel.',
          },
        ],
      },
      {
        id: 'ejecucion-movil',
        number: '02',
        eyebrow: 'Ejecución móvil',
        title: 'Lleva el registro operativo al lugar donde sucede el trabajo.',
        intro:
          'Los equipos de primera línea pueden recibir, actualizar y completar trabajo desde la operación, conservando el contexto que los gerentes necesitan para verificar el resultado.',
        signal: 'Operación → Registro → Gerencia',
        signalLabel: 'Contexto en campo',
        signalDetail: 'Capturado en el punto de trabajo',
        shotCaption: 'Housekeeping · Detalle de tarea · Whagons',
        shotAlt: 'Detalle de tarea de Whagons para una solicitud de housekeeping con estado, responsable, lista de control y actividad',
        features: [
          {
            title: 'Fotos, formularios y firmas',
            text: 'Adjunta la evidencia que exige cada flujo en lugar de depender de una actualización verbal.',
          },
          {
            title: 'QR, código de barras y NFC',
            text: 'Conecta una habitación, área o activo con el flujo correcto mediante interacciones familiares de escaneo y toque.',
          },
          {
            title: 'Contexto según la ubicación',
            text: 'Captura contexto útil en campo, incluido GPS cuando esté configurado para el flujo.',
          },
        ],
      },
      {
        id: 'estandares-conocimiento',
        number: '03',
        eyebrow: 'Estándares + conocimiento',
        title: 'Convierte el estándar en la forma de ejecutar el trabajo.',
        intro:
          'Integra listas de control, inspecciones, acciones correctivas y conocimiento operativo al flujo para trabajar con consistencia en cada turno.',
        signal: 'Estándar → Hallazgo → Corrección',
        signalLabel: 'Ciclo de calidad',
        signalDetail: 'De la inspección a la verificación',
        features: [
          {
            title: 'Listas de control e inspecciones',
            text: 'Haz repetibles los estándares recurrentes y conserva cada resultado dentro del registro operativo.',
          },
          {
            title: 'Acciones correctivas',
            text: 'Convierte un control fallido en seguimiento asignado, con vencimiento y evidencia de finalización.',
          },
          {
            title: 'Procedimientos en el punto de trabajo',
            text: 'Entrega al equipo el procedimiento y la guía relevantes dentro del flujo, sin obligarlo a buscarlos en otro lugar.',
          },
        ],
      },
      {
        id: 'visibilidad-integraciones',
        number: '04',
        eyebrow: 'Visibilidad + integraciones',
        title: 'Ve las excepciones ahora y los patrones en el tiempo.',
        intro:
          'Ofrece a cada rol el nivel de detalle que necesita y conecta los datos operativos con los sistemas que el hotel ya utiliza.',
        signal: 'Hoy → Excepciones → Patrones',
        signalLabel: 'Vista gerencial',
        signalDetail: 'Abierto, atrasado, completado y recurrente',
        shotCaption: 'Analítica · Whagons',
        shotAlt: 'Vista de analítica de Whagons con totales de tareas, tasa de finalización y gráficos de tendencia',
        features: [
          {
            title: 'Vistas operativas por rol',
            text: 'Los equipos de primera línea ven la siguiente acción; los gerentes revisan trabajo abierto, atrasado y excepciones.',
          },
          {
            title: 'Analítica y asistencia con IA',
            text: 'Revisa atrasos y problemas recurrentes, y usa el contexto operativo para ayudar a identificar la siguiente acción.',
          },
          {
            title: 'API e integraciones',
            text: 'Trabaja junto al PMS y otros sistemas hoteleros sin intentar reemplazar sus registros principales.',
          },
        ],
      },
    ],
    roles: {
      eyebrow: 'Un sistema, útil en cada nivel',
      title: 'El detalle correcto para cada rol del hotel.',
      lead: 'Un registro operativo compartido reduce la distancia entre quien ejecuta el trabajo y quien responde por el resultado.',
      items: [
        {
          number: '01',
          title: 'Equipos de primera línea',
          text: 'Ven qué hacer después y registran el resultado sin salir del flujo.',
          detail: 'Siguiente acción clara',
        },
        {
          number: '02',
          title: 'Gerentes',
          text: 'Ven trabajo vencido, excepciones y entregas entre equipos antes de que se conviertan en problemas para el huésped.',
          detail: 'Visibilidad de excepciones',
        },
        {
          number: '03',
          title: 'Líderes',
          text: 'Revisan los patrones detrás de la ejecución entre departamentos, turnos y propiedades.',
          detail: 'Patrones operativos',
        },
      ],
    },
    boundary: {
      eyebrow: 'Una capa operativa enfocada',
      title: 'Diseñado para coordinar el trabajo hotelero, no para reemplazar los sistemas del hotel.',
      lead:
        'Whagons se adapta a los sistemas y procesos que ya existen y agrega control donde el trabajo cruza personas, departamentos y turnos.',
      worksWith: 'Funciona junto a',
      worksWithText: 'Tu PMS y los demás sistemas que conservan los registros principales del hotel.',
      notReplacement: 'No reemplaza',
      notReplacementText: 'Un PMS, motor de reservas, punto de venta ni a los equipos responsables del trabajo.',
      startFocused: 'Empieza con enfoque',
      startFocusedText: 'Configura un flujo relevante según tus roles, términos, prioridades y estándares.',
    },
    finalCta: {
      eyebrow: 'Míralo aplicado a tu operación',
      title: 'Trae un flujo real de tu hotel.',
      text: 'Lo usaremos para mostrar cómo la responsabilidad, los tiempos, el escalamiento y la evidencia pueden trabajar juntos en Whagons.',
      primary: 'Solicita una demo personalizada',
      secondary: 'Revisa la plataforma',
    },
  },
};

const chapterShots = (lang: FeaturesLanguage) => {
  const s = shotsFor(lang);
  return [null, s.boardDetail, null, s.analytics];
};

const CARD_TONES = ['blue', 'amber', 'violet', 'green', 'slate'] as const;

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Shot({ src, width, height, caption, alt, priority }: { src: string; width: number; height: number; caption: string; alt: string; priority?: boolean }) {
  return (
    <figure className="pg-shot">
      <div className="pg-shot-bar" aria-hidden="true"><i /><i /><i /><span>{caption}</span></div>
      <Image src={src} alt={alt} width={width} height={height} priority={priority} quality={90} sizes="(max-width: 1000px) 100vw, 560px" />
    </figure>
  );
}

export default function FeaturesPage({ lang }: { lang: FeaturesLanguage }) {
  const copy = content[lang];
  const shots = shotsFor(lang);
  const CHAPTER_SHOTS = chapterShots(lang);
  const demoHref = `/${lang}/demo`;
  const platformHref = lang === 'es' ? '/es/plataforma' : '/en/platform';

  return (
    <main className="pg">
      <section className="pg-hero">
        <div className="pg-hero-inner pg-hero-split">
          <div className="pg-hero-copy">
            <p className="pg-eyebrow">{copy.hero.eyebrow}</p>
            <h1>
              {copy.hero.title} <span className="pg-accent">{copy.hero.accent}</span>
            </h1>
            <p className="pg-lead">{copy.hero.lead}</p>
            <div className="pg-actions">
              <Link className="pg-btn" href={demoHref}>
                {copy.hero.primaryCta}
                <Arrow />
              </Link>
              <Link className="pg-btn-secondary" href={platformHref}>
                {copy.hero.secondaryCta}
              </Link>
            </div>
            <ul className="pg-points">
              {copy.hero.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <Shot src={shots.grid.src} width={shots.grid.width} height={shots.grid.height} caption={copy.hero.shotCaption} alt={copy.hero.shotAlt} priority />
        </div>
      </section>

      <nav className="pg-subnav" aria-label={copy.featureNavLabel}>
        {copy.featureNav.map(([id, label], index) => (
          <a key={id} href={`#${id}`}>
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
      </nav>

      {copy.chapters.map((chapter, chapterIndex) => {
        const shot = CHAPTER_SHOTS[chapterIndex];
        const band = chapterIndex === 1;
        const intro = (
          <div className="pg-intro" style={shot ? { marginBottom: 0 } : undefined}>
            <span className="pg-num" style={{ marginBottom: 18 }}>{chapter.number}</span>
            <p className="pg-eyebrow">{chapter.eyebrow}</p>
            <h2>{chapter.title}</h2>
            <p className="pg-text">{chapter.intro}</p>
            <div className="pg-small" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px', marginTop: 20 }}>
              <span className="pg-tag" data-tone="neutral">{chapter.signalLabel}</span>
              <strong style={{ color: 'var(--ink)' }}>{chapter.signal}</strong>
              <span>{chapter.signalDetail}</span>
            </div>
          </div>
        );
        const section = (
          <section className={chapterIndex === 3 ? 'pg-section pg-section-tight' : 'pg-section'} id={chapter.id} key={chapter.id}>
            {shot && chapter.shotCaption && chapter.shotAlt ? (
              <div className={chapterIndex % 2 === 1 ? 'pg-split' : 'pg-split pg-split-reverse'} style={{ marginBottom: 40 }}>
                {intro}
                <Shot src={shot.src} width={shot.width} height={shot.height} caption={chapter.shotCaption} alt={chapter.shotAlt} />
              </div>
            ) : (
              intro
            )}
            <div className="pg-grid-3">
              {chapter.features.map((feature, featureIndex) => (
                <article className="pg-card" key={feature.title} style={band ? { background: 'var(--bg)' } : undefined}>
                  <span className="pg-icon" data-tone={CARD_TONES[(chapterIndex + featureIndex) % CARD_TONES.length]} aria-hidden="true" />
                  <h3 style={{ marginTop: 6 }}>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </section>
        );
        return band ? <div className="pg-band" key={chapter.id}>{section}</div> : section;
      })}

      <section className="pg-band">
        <div className="pg-section">
          <div className="pg-intro">
            <p className="pg-eyebrow">{copy.roles.eyebrow}</p>
            <h2>{copy.roles.title}</h2>
            <p className="pg-text">{copy.roles.lead}</p>
          </div>
          <div className="pg-grid-3">
            {copy.roles.items.map((role) => (
              <article className="pg-card" key={role.title} style={{ background: 'var(--bg)' }}>
                <span className="pg-num">{role.number}</span>
                <h3 style={{ marginTop: 6 }}>{role.title}</h3>
                <p>{role.text}</p>
                <span className="pg-tag" style={{ marginTop: 'auto' }}>{role.detail}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pg-section">
        <div className="pg-intro">
          <p className="pg-eyebrow">{copy.boundary.eyebrow}</p>
          <h2>{copy.boundary.title}</h2>
          <p className="pg-text">{copy.boundary.lead}</p>
        </div>
        <div className="pg-grid-3">
          <article className="pg-card">
            <span className="pg-icon" data-tone="green" aria-hidden="true" />
            <h3 style={{ marginTop: 6 }}>{copy.boundary.worksWith}</h3>
            <p>{copy.boundary.worksWithText}</p>
          </article>
          <article className="pg-card">
            <span className="pg-icon" data-tone="slate" aria-hidden="true" />
            <h3 style={{ marginTop: 6 }}>{copy.boundary.notReplacement}</h3>
            <p>{copy.boundary.notReplacementText}</p>
          </article>
          <article className="pg-card">
            <span className="pg-icon" aria-hidden="true" />
            <h3 style={{ marginTop: 6 }}>{copy.boundary.startFocused}</h3>
            <p>{copy.boundary.startFocusedText}</p>
          </article>
        </div>
      </section>

      <section className="pg-cta">
        <div>
          <p className="pg-eyebrow">{copy.finalCta.eyebrow}</p>
          <h2>{copy.finalCta.title}</h2>
          <p className="pg-text">{copy.finalCta.text}</p>
          <div className="pg-actions">
            <Link className="pg-btn" href={demoHref}>
              {copy.finalCta.primary}
              <Arrow />
            </Link>
            <Link className="pg-btn-secondary" href={platformHref}>
              {copy.finalCta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
