'use client';

import { Language } from '../../lib/i18n';
import ScrollReveal from '../../components/ScrollReveal';

const MODULES: Record<Language, {
  num: string;
  name: string;
  tagline: string;
  desc: string;
  features: string[];
}[]> = {
  es: [
    {
      num: '01',
      name: 'Asistente con Inteligencia Artificial',
      tagline: 'Tu copiloto estratégico — no un chatbot genérico',
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
      desc: 'Conecta Whagons con tus sistemas existentes vía API completa. ERP, CRM, herramientas de comunicación y más — todo en una sola plataforma operativa.',
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
      desc: 'Crea planes de trabajo, asigna tareas recurrentes, gestiona horarios y controla costos operativos. Ideal para programar personal de hotelería por turno, área u ocupación. Todo trazable, todo medible.',
      features: [
        'Planes de trabajo con asignación por equipo, sede y calendario',
        'Tareas recurrentes con frecuencias configurables y seguimiento automático',
        'Gestión de horarios y turnos con costos operativos asociados',
        'Programación de personal por área, turno y ocupación para hoteles y operaciones de hospitalidad',
        'Vista de programación por día, semana o mes con arrastrar y soltar',
        'Control de costos por tarea, proyecto o periodo con reportes detallados',
      ],
    },
    {
      num: '05',
      name: 'Formularios, Firmas y Aprobaciones',
      tagline: 'Captura datos en campo — digital, trazable, verificable',
      desc: 'Captura datos en campo con formularios digitales, firmas electrónicas y flujos de aprobación. Compatible con escaneo QR, códigos de barra, geolocalización GPS y toques NFC para iniciar, finalizar o validar tareas en sitio.',
      features: [
        'Formularios dinámicos con campos condicionales y validaciones',
        'Firmas electrónicas vinculadas a identidad y dispositivo',
        'Escaneo de códigos QR y códigos de barra integrado',
        'Toques NFC para iniciar, pausar, finalizar o confirmar tareas y acciones en sitio',
        'Geolocalización GPS automática al capturar datos en campo',
        'Flujos de aprobación con notificaciones y escalamiento automático',
      ],
    },
    {
      num: '06',
      name: 'Documentación, SOPs y Cumplimiento',
      tagline: 'El manual de tu organización — siempre actualizado, siempre auditable',
      desc: 'Centraliza manuales, normas ISO, procedimientos operativos y materiales de entrenamiento. Multimedia, multi-idioma, con confirmación de lectura y registros auditables.',
      features: [
        'Biblioteca organizada por departamento, rol y sede',
        'Documentos multimedia: video, PDF, imágenes, listas de verificación',
        'Confirmación de lectura con registro de quién leyó qué y cuándo',
        'Cumplimiento ISO, FDA, HACCP con registros 100% digitales y trazables',
        'Retención configurable de registros (hasta 7+ años) con auditoría de cambios',
      ],
    },
    {
      num: '07',
      name: 'Control Operativo en Tiempo Real',
      tagline: 'Visibilidad total — del piso operativo al directorio',
      desc: 'Visibilidad total del piso al directorio. Dashboards con KPIs personalizados, analítica P50/P90/P95, SLAs con escalamiento y monitoreo de actividad en tiempo real.',
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
      tagline: 'Your strategic copilot — not a generic chatbot',
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
      desc: 'Connect Whagons with your existing systems via a full API. ERP, CRM, communication tools, and more — all in one operational platform.',
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
      desc: 'Create work plans, assign recurring tasks, manage schedules, and control operational costs. Ideal for hotel staff scheduling by shift, department, or occupancy. Fully traceable, fully measurable.',
      features: [
        'Work plans with assignment by team, location, and calendar',
        'Recurring tasks with configurable frequencies and automatic tracking',
        'Schedule and shift management with associated operational costs',
        'Staff scheduling by department, shift, and occupancy for hotels and hospitality teams',
        'Day, week, or month scheduling view with drag and drop',
        'Cost control per task, project, or period with detailed reports',
      ],
    },
    {
      num: '05',
      name: 'Forms, Signatures & Approvals',
      tagline: 'Capture field data — digital, traceable, verifiable',
      desc: 'Capture field data with digital forms, electronic signatures, and approval workflows. Compatible with QR scanning, barcodes, GPS geolocation, and NFC taps to start, finish, or validate work on site.',
      features: [
        'Dynamic forms with conditional fields and validations',
        'Electronic signatures linked to identity and device',
        'Integrated QR code and barcode scanning',
        'NFC taps to start, pause, finish, or confirm on-site tasks and actions',
        'Automatic GPS geolocation when capturing field data',
        'Approval workflows with notifications and automatic escalation',
      ],
    },
    {
      num: '06',
      name: 'Documentation, SOPs & Compliance',
      tagline: 'Your organization\'s manual — always updated, always auditable',
      desc: 'Centralize manuals, ISO standards, operating procedures, and training materials. Multimedia, multilingual, with read confirmations and auditable records.',
      features: [
        'Library organized by department, role, and location',
        'Multimedia documents: video, PDF, images, checklists',
        'Read confirmation with records of who read what and when',
        'ISO, FDA, HACCP compliance with 100% digital, traceable records',
        'Configurable record retention (up to 7+ years) with change auditing',
      ],
    },
    {
      num: '07',
      name: 'Real-Time Operations Control',
      tagline: 'Full visibility — from the operations floor to the boardroom',
      desc: 'Full visibility from floor to boardroom. Dashboards with custom KPIs, P50/P90/P95 analytics, SLAs with escalation, and real-time activity monitoring.',
      features: [
        'Real-time KPIs by location, team, category, or custom period',
        'SLAs with P50/P90/P95 monitoring and three escalation alert levels',
        'Live activity monitor: who\'s doing what, where, right now',
        'Historical vs. current performance comparison with automatic trends',
        'Scheduled report exports in PDF, Excel, or via API',
      ],
    },
  ],
};

const DIFFERENTIATORS: Record<Language, { title: string; items: { icon: string; title: string; desc: string }[] }> = {
  es: {
    title: '¿Por qué Whagons y no otra plataforma?',
    items: [
      { icon: '⚡', title: 'Implementación en días, no meses', desc: 'Sin migraciones complejas ni dependencia de IT. Tu equipo puede estar operando en Whagons en menos de una semana.' },
      { icon: '🌐', title: 'Offline-first por diseño', desc: 'Diseñado para equipos en campo sin conexión estable. Opera normalmente offline y sincroniza cuando hay red.' },
      { icon: '🎨', title: 'White-label completo', desc: 'No es solo cambiar un logo. Tu dominio, tus colores, tu marca — la plataforma se siente 100% tuya.' },
      { icon: '🔌', title: 'API abierta e integraciones', desc: 'Se conecta con tu ERP, CRM, BI y cualquier sistema existente. No reemplaza tu stack — lo complementa.' },
      { icon: '📱', title: 'Móvil + Web + iOS + Android', desc: 'Una sola plataforma que funciona igual en escritorio, tablet y teléfono. App nativa para campo.' },
      { icon: '🔒', title: 'Seguridad enterprise', desc: 'SSO, roles granulares, cifrado en tránsito y reposo, y cumplimiento con estándares de privacidad de datos.' },
    ],
  },
  en: {
    title: 'Why Whagons over other platforms?',
    items: [
      { icon: '⚡', title: 'Implementation in days, not months', desc: 'No complex migrations or IT dependency. Your team can be operating on Whagons in less than a week.' },
      { icon: '🌐', title: 'Offline-first by design', desc: 'Built for field teams without stable connectivity. Operate fully offline and sync when back online.' },
      { icon: '🎨', title: 'Full white-label', desc: 'It\'s not just swapping a logo. Your domain, your colors, your brand — the platform feels 100% yours.' },
      { icon: '🔌', title: 'Open API & integrations', desc: 'Connects with your ERP, CRM, BI, and any existing system. It doesn\'t replace your stack — it complements it.' },
      { icon: '📱', title: 'Mobile + Web + iOS + Android', desc: 'A single platform that works the same on desktop, tablet, and phone. Native app for field operations.' },
      { icon: '🔒', title: 'Enterprise security', desc: 'SSO, granular roles, encryption in transit and at rest, and compliance with data privacy standards.' },
    ],
  },
};

export default function PlatformPageClient({ lang }: { lang: Language }) {
  const modules = MODULES[lang];
  const diff = DIFFERENTIATORS[lang];

  return (
    <>
      <ScrollReveal />

      <section className="page-hero">
        <div className="page-hero-inner r">
          <h1 className="page-hero-title">
            {lang === 'es'
              ? 'Software de Gestión Operativa con Inteligencia Artificial'
              : 'AI-Powered Operations Management Software'}
          </h1>
          <p className="page-hero-desc">
            {lang === 'es'
              ? '7 módulos integrados para controlar, automatizar y escalar las operaciones de tu empresa. Cada módulo funciona de forma independiente o como parte de una plataforma unificada.'
              : '7 integrated modules to control, automate, and scale your business operations. Each module works independently or as part of a unified platform.'}
          </p>
          <div className="page-hero-ctas">
            <a href={`/${lang}/demo`} className="cta-primary">
              {lang === 'es' ? 'Ver en acción' : 'See it in action'} &rarr;
            </a>
            <a href={`/${lang}/industrias`} className="cta-ghost">
              {lang === 'es' ? 'Por industria' : 'By industry'} {'\u2197'}
            </a>
          </div>
        </div>
      </section>

      {/* Deep-dive modules */}
      <section className="platform-modules">
        {modules.map((mod, i) => (
          <div className={`plat-module r${i % 2 === 1 ? ' plat-module--alt' : ''}`} key={mod.num} id={`modulo-${mod.num}`}>
            <div className="plat-module-header">
              <span className="plat-module-num">{mod.num}</span>
              <h2 className="plat-module-name">{mod.name}</h2>
            </div>
            <p className="plat-module-tagline">{mod.tagline}</p>
            <p className="plat-module-desc">{mod.desc}</p>
            <ul className="plat-module-features">
              {mod.features.map((f, fi) => (
                <li key={fi}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Differentiators */}
      <section className="platform-diff">
        <h2 className="platform-diff-title r">{diff.title}</h2>
        <div className="platform-diff-grid">
          {diff.items.map((item, i) => (
            <div className={`platform-diff-card r${i > 0 ? ` d${Math.min(i, 2)}` : ''}`} key={i}>
              <span className="platform-diff-icon">{item.icon}</span>
              <h3 className="platform-diff-name">{item.title}</h3>
              <p className="platform-diff-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-bottom-section">
        <div className="cta-bottom-inner r">
          <h2 className="cta-bottom-title">
            {lang === 'es'
              ? '¿Listo para transformar tu operación?'
              : 'Ready to transform your operation?'}
          </h2>
          <p className="cta-bottom-desc">
            {lang === 'es'
              ? 'Agenda una demostración personalizada y descubre qué módulos resuelven los desafíos específicos de tu empresa.'
              : 'Schedule a personalized demo and discover which modules solve your company\'s specific challenges.'}
          </p>
          <a href={`/${lang}/demo`} className="cta-primary">
            {lang === 'es' ? 'Solicitar demo' : 'Request demo'} &rarr;
          </a>
        </div>
      </section>
    </>
  );
}
