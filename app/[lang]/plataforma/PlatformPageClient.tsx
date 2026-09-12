import Image from 'next/image';
import { Language } from '../../lib/i18n';
import { shotsFor } from '../../lib/shots';

type Module = { num: string; name: string; tagline: string; desc: string; features: string[] };

const MODULES: Record<Language, Module[]> = {
  es: [
    {
      num: '01',
      name: 'Asistente con Inteligencia Artificial',
      tagline: 'Tu copiloto estratégico, no un chatbot genérico',
      desc: 'Un copiloto que busca, analiza y recomienda acciones con contexto real de tu operación. Habla para crear, actualizar o cerrar tareas al instante y toma decisiones basadas en datos, no en suposiciones.',
      features: [
        'Búsqueda inteligente en toda tu operación con lenguaje natural',
        'Resúmenes automáticos de rendimiento por equipo, sede o periodo',
        'Recomendaciones accionables basadas en patrones reales de tu data',
        'Creación, actualización y cierre de tareas por voz o comandos conversacionales',
        'Detección de anomalías y alertas proactivas antes de que escalen',
      ],
    },
    {
      num: '02',
      name: 'Flujos de Trabajo y Automatizaciones',
      tagline: 'Automatiza la lógica de negocio, no solo las tareas',
      desc: 'Automatiza aprobaciones, flujos secuenciales o por mayoría, broadcasts y escalamientos con SLAs configurables. Los workflows se adaptan a tu lógica de negocio, no al revés.',
      features: [
        'Aprobaciones unánimes, por mayoría o secuenciales con reglas configurables',
        'Escalamiento automático en 3 niveles cuando un SLA se aproxima a su límite',
        'Broadcasts y notificaciones masivas con segmentación por equipo o sede',
        'Timeouts inteligentes que reasignan tareas automáticamente',
        'Condicionales por campo: distintos flujos según prioridad, categoría o sede',
      ],
    },
    {
      num: '03',
      name: 'Integraciones',
      tagline: 'Conecta todo en una sola plataforma operativa',
      desc: 'Conecta Whagons con tus sistemas existentes vía API completa. ERP, CRM, herramientas de comunicación y más, todo en una sola plataforma operativa.',
      features: [
        'API RESTful completa para integración con ERP, CRM, BI y sistemas legacy',
        'Webhooks configurables para eventos en tiempo real',
        'SSO (Single Sign-On) con SAML 2.0 y OIDC para autenticación empresarial',
        'White-label completo: tu logo, colores y dominio personalizado',
        'Offline-first con sincronización automática al recuperar conexión',
      ],
    },
    {
      num: '04',
      name: 'Planes de Trabajo y Programación',
      tagline: 'Todo trazable, todo medible',
      desc: 'Crea planes de trabajo, asigna tareas recurrentes, gestiona horarios y controla costos operativos. Ideal para programar personal de hotelería por turno, área u ocupación.',
      features: [
        'Planes de trabajo con asignación por equipo, sede y calendario',
        'Tareas recurrentes con frecuencias configurables y seguimiento automático',
        'Gestión de horarios y turnos con costos operativos asociados',
        'Programación de personal por área, turno y ocupación para hoteles',
        'Vista de programación por día, semana o mes con arrastrar y soltar',
        'Control de costos por tarea, proyecto o periodo con reportes detallados',
      ],
    },
    {
      num: '05',
      name: 'Formularios, Firmas y Aprobaciones',
      tagline: 'Captura datos en campo: digital, trazable, verificable',
      desc: 'Captura datos en campo con formularios digitales, firmas electrónicas y flujos de aprobación. Compatible con escaneo QR, códigos de barra, geolocalización GPS y toques NFC para iniciar, finalizar o validar tareas en sitio.',
      features: [
        'Formularios dinámicos con campos condicionales y validaciones',
        'Firmas electrónicas vinculadas a identidad y dispositivo',
        'Escaneo de códigos QR y códigos de barra integrado',
        'Toques NFC para iniciar, pausar, finalizar o confirmar tareas en sitio',
        'Geolocalización GPS automática al capturar datos en campo',
        'Flujos de aprobación con notificaciones y escalamiento automático',
      ],
    },
    {
      num: '06',
      name: 'Documentación, SOPs y Cumplimiento',
      tagline: 'El manual de tu organización, siempre actualizado y auditable',
      desc: 'Centraliza manuales, normas ISO, procedimientos operativos y materiales de entrenamiento. Multimedia, multi-idioma, con confirmación de lectura y registros auditables.',
      features: [
        'Biblioteca organizada por departamento, rol y sede',
        'Documentos multimedia: video, PDF, imágenes, listas de verificación',
        'Confirmación de lectura con registro de quién leyó qué y cuándo',
        'Registros digitales y trazables para apoyar programas ISO, FDA o HACCP',
        'Retención configurable de registros con historial de cambios',
      ],
    },
    {
      num: '07',
      name: 'Control Operativo en Tiempo Real',
      tagline: 'Visibilidad total, del piso operativo al directorio',
      desc: 'Dashboards con KPIs personalizados, analítica P50/P90/P95, SLAs con escalamiento y monitoreo de actividad en tiempo real.',
      features: [
        'KPIs en tiempo real por sede, equipo, categoría o periodo personalizado',
        'SLAs con monitoreo P50/P90/P95 y tres niveles de alertas de escalamiento',
        'Monitor de actividad en vivo: quién está haciendo qué, dónde, ahora mismo',
        'Comparación de rendimiento histórico vs. actual con tendencias automáticas',
        'Exportación programada de reportes en PDF, Excel o vía API',
      ],
    },
  ],
  en: [
    {
      num: '01',
      name: 'AI-Powered Assistant',
      tagline: 'Your strategic copilot, not a generic chatbot',
      desc: 'A strategic copilot that searches, analyzes, and recommends actions with real context from your operation. Speak to create, update, or close tasks instantly and make decisions based on data, not assumptions.',
      features: [
        'Natural language search across your entire operation',
        'Automatic performance summaries by team, location, or period',
        'Actionable recommendations based on real patterns in your data',
        'Task creation, updates, and completion through voice or conversational commands',
        'Anomaly detection and proactive alerts before issues escalate',
      ],
    },
    {
      num: '02',
      name: 'Workflows & Automations',
      tagline: 'Automate business logic, not just tasks',
      desc: 'Automate approvals, sequential or majority flows, broadcasts, and escalations with configurable SLAs. Workflows adapt to your business logic, not the other way around.',
      features: [
        'Unanimous, majority, or sequential approvals with configurable rules',
        'Automatic 3-level escalation when an SLA approaches its limit',
        'Broadcasts and mass notifications with team or location segmentation',
        'Smart timeouts that automatically reassign tasks',
        'Field-based conditionals: different flows based on priority, category, or location',
      ],
    },
    {
      num: '03',
      name: 'Integrations',
      tagline: 'Connect everything in one operational platform',
      desc: 'Connect Whagons with your existing systems via a full API. ERP, CRM, communication tools, and more, all in one operational platform.',
      features: [
        'Complete RESTful API for integration with ERP, CRM, BI, and legacy systems',
        'Configurable webhooks for real-time events',
        'SSO (Single Sign-On) with SAML 2.0 and OIDC for enterprise authentication',
        'Full white-label: your logo, colors, and custom domain',
        'Offline-first with automatic sync when connectivity is restored',
      ],
    },
    {
      num: '04',
      name: 'Work Plans & Scheduling',
      tagline: 'Fully traceable, fully measurable',
      desc: 'Create work plans, assign recurring tasks, manage schedules, and control operational costs. Ideal for hotel staff scheduling by shift, department, or occupancy.',
      features: [
        'Work plans with assignment by team, location, and calendar',
        'Recurring tasks with configurable frequencies and automatic tracking',
        'Schedule and shift management with associated operational costs',
        'Staff scheduling by department, shift, and occupancy for hotels',
        'Day, week, or month scheduling view with drag and drop',
        'Cost control per task, project, or period with detailed reports',
      ],
    },
    {
      num: '05',
      name: 'Forms, Signatures & Approvals',
      tagline: 'Capture field data: digital, traceable, verifiable',
      desc: 'Capture field data with digital forms, electronic signatures, and approval workflows. Compatible with QR scanning, barcodes, GPS geolocation, and NFC taps to start, finish, or validate work on site.',
      features: [
        'Dynamic forms with conditional fields and validations',
        'Electronic signatures linked to identity and device',
        'Integrated QR code and barcode scanning',
        'NFC taps to start, pause, finish, or confirm on-site tasks',
        'Automatic GPS geolocation when capturing field data',
        'Approval workflows with notifications and automatic escalation',
      ],
    },
    {
      num: '06',
      name: 'Documentation, SOPs & Compliance',
      tagline: "Your organization's manual, always updated and auditable",
      desc: 'Centralize manuals, ISO standards, operating procedures, and training materials. Multimedia, multilingual, with read confirmations and auditable records.',
      features: [
        'Library organized by department, role, and location',
        'Multimedia documents: video, PDF, images, checklists',
        'Read confirmation with records of who read what and when',
        'Digital, traceable records to support ISO, FDA, or HACCP programs',
        'Configurable record retention with change history',
      ],
    },
    {
      num: '07',
      name: 'Real-Time Operations Control',
      tagline: 'Full visibility, from the operations floor to the boardroom',
      desc: 'Dashboards with custom KPIs, P50/P90/P95 analytics, SLAs with escalation, and real-time activity monitoring.',
      features: [
        'Real-time KPIs by location, team, category, or custom period',
        'SLAs with P50/P90/P95 monitoring and three escalation alert levels',
        "Live activity monitor: who's doing what, where, right now",
        'Historical vs. current performance comparison with automatic trends',
        'Scheduled report exports in PDF, Excel, or via API',
      ],
    },
  ],
};

const TONES = ['', 'blue', 'amber', 'violet', 'green', 'slate', ''] as const;

const DIFFERENTIATORS: Record<Language, { title: string; lead: string; items: { title: string; desc: string }[] }> = {
  es: {
    title: '¿Por qué Whagons y no otra plataforma?',
    lead: 'Seis decisiones de diseño que marcan la diferencia cuando la operación es real, distribuida y no siempre tiene conexión.',
    items: [
      { title: 'Implementación por etapas', desc: 'Empieza con un flujo prioritario, valida la adopción con el equipo y amplía desde un resultado operativo real.' },
      { title: 'Offline-first por diseño', desc: 'Diseñado para equipos en campo sin conexión estable. Opera normalmente offline y sincroniza cuando hay red.' },
      { title: 'White-label completo', desc: 'No es solo cambiar un logo. Tu dominio, tus colores, tu marca: la plataforma se siente 100% tuya.' },
      { title: 'API abierta e integraciones', desc: 'Se conecta con tu ERP, CRM, BI y cualquier sistema existente. No reemplaza tu stack, lo complementa.' },
      { title: 'Móvil + Web + iOS + Android', desc: 'Una sola plataforma que funciona igual en escritorio, tablet y teléfono. App nativa para campo.' },
      { title: 'Seguridad enterprise', desc: 'SSO, roles granulares, cifrado en tránsito y reposo, y cumplimiento con estándares de privacidad de datos.' },
    ],
  },
  en: {
    title: 'Why Whagons over other platforms?',
    lead: 'Six design decisions that matter once the operation is real, distributed, and not always online.',
    items: [
      { title: 'Phased implementation', desc: 'Start with one priority workflow, validate adoption with the team, and expand from a real operating result.' },
      { title: 'Offline-first by design', desc: 'Built for field teams without stable connectivity. Operate fully offline and sync when back online.' },
      { title: 'Full white-label', desc: "It's not just swapping a logo. Your domain, your colors, your brand: the platform feels 100% yours." },
      { title: 'Open API & integrations', desc: "Connects with your ERP, CRM, BI, and any existing system. It doesn't replace your stack, it complements it." },
      { title: 'Mobile + Web + iOS + Android', desc: 'A single platform that works the same on desktop, tablet, and phone. Native app for field operations.' },
      { title: 'Enterprise security', desc: 'SSO, granular roles, encryption in transit and at rest, and compliance with data privacy standards.' },
    ],
  },
};

const COPY = {
  es: {
    eyebrow: 'Plataforma',
    title: 'Plataforma de operaciones hoteleras con inteligencia artificial',
    lead: 'Siete módulos integrados para coordinar, automatizar y hacer visible el trabajo del hotel. Cada módulo funciona de forma independiente o como parte de una plataforma unificada.',
    primary: 'Ver en acción',
    secondary: 'Ver funcionalidades',
    navLabel: 'Módulos',
    modulesEyebrow: 'Los siete módulos',
    modulesTitle: 'Todo lo que necesita una operación, en una sola plataforma.',
    includes: 'Incluye',
    shotCaption: 'Analítica · Whagons',
    shotAlt: 'Vista de analítica de Whagons con totales de tareas, tasa de finalización y gráficos de tendencia',
    ctaTitle: '¿Listo para transformar tu operación?',
    ctaText: 'Agenda una demostración personalizada y descubre qué módulos resuelven los desafíos específicos de tu hotel.',
    ctaButton: 'Solicitar demo',
  },
  en: {
    eyebrow: 'Platform',
    title: 'AI-powered hotel operations platform',
    lead: 'Seven integrated modules to coordinate, automate, and make hotel work visible. Each module works independently or as part of one unified platform.',
    primary: 'See it in action',
    secondary: 'View features',
    navLabel: 'Modules',
    modulesEyebrow: 'The seven modules',
    modulesTitle: 'Everything an operation needs, in one platform.',
    includes: 'Includes',
    shotCaption: 'Mission Control · Whagons',
    shotAlt: 'Whagons Mission Control overview with open tasks, overdue work, completion and status breakdown',
    ctaTitle: 'Ready to transform your operation?',
    ctaText: "Schedule a personalized demo and discover which modules solve your hotel's specific challenges.",
    ctaButton: 'Request demo',
  },
} as const;

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlatformPageClient({ lang }: { lang: Language }) {
  const modules = MODULES[lang];
  const diff = DIFFERENTIATORS[lang];
  const t = COPY[lang];
  const shots = shotsFor(lang);
  const demoHref = `/${lang}/demo`;
  const featuresHref = lang === 'en' ? '/en/features' : '/es/funcionalidades';

  return (
    <main className="pg">
      <section className="pg-hero">
        <div className="pg-hero-inner pg-hero-split">
          <div className="pg-hero-copy">
            <p className="pg-eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="pg-lead">{t.lead}</p>
            <div className="pg-actions">
              <a href={demoHref} className="pg-btn">{t.primary}<Arrow /></a>
              <a href={featuresHref} className="pg-btn-secondary">{t.secondary}</a>
            </div>
          </div>
          <figure className="pg-shot">
            <div className="pg-shot-bar" aria-hidden="true"><i /><i /><i /><span>{t.shotCaption}</span></div>
            <Image src={shots.analytics.src} alt={t.shotAlt} width={shots.analytics.width} height={shots.analytics.height} priority sizes="(max-width: 1000px) 100vw, 560px" />
          </figure>
        </div>
      </section>

      <div className="pg-subnav" role="navigation" aria-label={t.navLabel}>
        {modules.map((mod) => (
          <a key={mod.num} href={`#modulo-${mod.num}`}><span>{mod.num}</span>{mod.name}</a>
        ))}
      </div>

      <section className="pg-section">
        <div className="pg-intro">
          <p className="pg-eyebrow">{t.modulesEyebrow}</p>
          <h2>{t.modulesTitle}</h2>
        </div>
        <div className="pg-grid-2">
          {modules.map((mod, i) => (
            <article className="pg-card" id={`modulo-${mod.num}`} key={mod.num}>
              <span className="pg-icon" data-tone={TONES[i] || undefined} aria-hidden="true" />
              <h3 style={{ marginTop: 6 }}>{mod.name}</h3>
              <p className="pg-small" style={{ color: 'var(--accent)', fontWeight: 600 }}>{mod.tagline}</p>
              <p>{mod.desc}</p>
              <p className="pg-small" style={{ marginTop: 8, fontWeight: 600, color: 'var(--ink)' }}>{t.includes}</p>
              <ul className="pg-checks">
                {mod.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="pg-band">
        <div className="pg-section">
          <div className="pg-intro">
            <p className="pg-eyebrow">Whagons</p>
            <h2>{diff.title}</h2>
            <p className="pg-text">{diff.lead}</p>
          </div>
          <div className="pg-grid-3">
            {diff.items.map((item, i) => (
              <article className="pg-card" key={item.title} style={{ background: 'var(--bg)' }}>
                <span className="pg-num">{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pg-cta" style={{ paddingTop: 96 }}>
        <div>
          <h2>{t.ctaTitle}</h2>
          <p className="pg-text">{t.ctaText}</p>
          <div className="pg-actions">
            <a href={demoHref} className="pg-btn">{t.ctaButton}<Arrow /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
