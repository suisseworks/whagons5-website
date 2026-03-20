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
      tagline: 'Tu copiloto operativo — no un chatbot genérico',
      desc: 'A diferencia de herramientas de IA generales, el asistente de Whagons tiene acceso al contexto completo de tu operación: tareas, SLAs, historial, equipos y métricas. No necesitas explicarle tu negocio — ya lo conoce.',
      features: [
        'Búsqueda inteligente en toda tu operación con lenguaje natural',
        'Resúmenes automáticos de rendimiento por equipo, sede o periodo',
        'Recomendaciones accionables basadas en patrones reales de tu data',
        'Creación y asignación de tareas por comandos conversacionales',
        'Detección de anomalías y alertas proactivas antes de que escalen',
      ],
    },
    {
      num: '02',
      name: 'Automatización de Flujos de Trabajo',
      tagline: 'Automatiza la lógica de negocio, no solo las tareas',
      desc: 'Configura flujos de aprobación, escalamiento y delegación que replican exactamente cómo tu organización toma decisiones — sin código, sin rigidez, sin compromisos.',
      features: [
        'Aprobaciones unánimes, por mayoría o secuenciales con reglas configurables',
        'Escalamiento automático en 3 niveles cuando un SLA se aproxima a su límite',
        'Delegación temporal con reglas de respaldo y notificación',
        'Timeouts inteligentes que reasignan tareas automáticamente',
        'Condicionales por campo: distintos flujos según prioridad, categoría o sede',
      ],
    },
    {
      num: '03',
      name: 'Control de Operaciones en Tiempo Real',
      tagline: 'Visibilidad completa — del piso operativo al directorio',
      desc: 'Dashboards en vivo que muestran exactamente qué está pasando en tu operación en este momento. No reportes estáticos de la semana pasada — inteligencia operativa actualizada al minuto.',
      features: [
        'KPIs en tiempo real por sede, equipo, categoría o periodo personalizado',
        'SLAs con monitoreo P50/P90/P95 y tres niveles de alertas de escalamiento',
        'Monitor de actividad en vivo: quién está haciendo qué, dónde, ahora mismo',
        'Comparación de rendimiento histórico vs. actual con tendencias automáticas',
        'Exportación programada de reportes en PDF, Excel o vía API',
      ],
    },
    {
      num: '04',
      name: 'Software de Cumplimiento y Auditoría',
      tagline: 'Listo para cualquier auditoría — sin papeleo',
      desc: 'Cada acción en Whagons queda registrada con marca de tiempo, usuario y evidencia. Cumple con ISO, FDA, HACCP o cualquier estándar regulatorio con registros 100% digitales y trazables.',
      features: [
        'Firmas digitales vinculadas a identidad y dispositivo',
        'Retención configurable de registros (hasta 7+ años)',
        'Evidencia fotográfica con geolocalización y marca de tiempo',
        'Checklists de estándares con versionado y auditoría de cambios',
        'Reportes de cumplimiento automatizados por periodo o regulación',
      ],
    },
    {
      num: '05',
      name: 'Gestión de Activos y Mantenimiento Preventivo',
      tagline: 'Detecta problemas antes de que se conviertan en costos',
      desc: 'Gestiona el ciclo de vida completo de tus activos: desde la adquisición hasta la depreciación. Programa inspecciones automáticas, rastrea historial de mantenimiento y anticipa fallas con analítica predictiva.',
      features: [
        'Inventario de activos con jerarquías, ubicación y estado en tiempo real',
        'Mantenimiento preventivo con calendarios automáticos por ciclo de vida',
        'Inspecciones con escaneo QR/código de barras en campo',
        'Cálculo de depreciación y costo total de propiedad (TCO)',
        'Historial completo de intervenciones, partes y costos por activo',
      ],
    },
    {
      num: '06',
      name: 'Base de Conocimiento Operativo',
      tagline: 'El manual de tu organización — siempre actualizado, siempre accesible',
      desc: 'Centraliza SOPs, manuales, certificados, protocolos y capacitaciones en un solo lugar. Multi-idioma, multimedia, con confirmación de lectura y gamificación para impulsar la adopción.',
      features: [
        'Biblioteca organizada por departamento, rol y sede',
        'Documentos multimedia: video, PDF, imágenes, listas de verificación',
        'Confirmación de lectura con registro de quién leyó qué y cuándo',
        'Versionado con historial de cambios y notificación automática de actualizaciones',
        'Gamificación con puntos y logros para impulsar el compromiso operativo',
      ],
    },
    {
      num: '07',
      name: 'Diseñado para Escalar sin Límites',
      tagline: 'De 10 usuarios a miles — sin cambiar de plataforma',
      desc: 'Whagons fue construido para operaciones complejas desde el primer día. Funciona offline, se integra con tus sistemas existentes, soporta white-label y ofrece 18+ módulos activables según tus necesidades.',
      features: [
        'Offline-first: operaciones completas sin conexión con sincronización automática',
        'API RESTful completa para integración con ERP, CRM, BI y sistemas legacy',
        'SSO (Single Sign-On) con SAML 2.0 y OIDC para autenticación empresarial',
        'White-label completo: tu logo, colores y dominio personalizado',
        '18+ powerups activables: formularios dinámicos, programador, plantillas y más',
      ],
    },
  ],
  en: [
    {
      num: '01',
      name: 'AI-Powered Business Assistant',
      tagline: 'Your operational copilot — not a generic chatbot',
      desc: 'Unlike general AI tools, the Whagons assistant has access to the full context of your operation: tasks, SLAs, history, teams, and metrics. You don\'t need to explain your business — it already knows it.',
      features: [
        'Natural language search across your entire operation',
        'Automatic performance summaries by team, location, or period',
        'Actionable recommendations based on real patterns in your data',
        'Task creation and assignment through conversational commands',
        'Anomaly detection and proactive alerts before issues escalate',
      ],
    },
    {
      num: '02',
      name: 'Workflow Automation Software',
      tagline: 'Automate business logic, not just tasks',
      desc: 'Configure approval, escalation, and delegation flows that replicate exactly how your organization makes decisions — no code, no rigidity, no compromises.',
      features: [
        'Unanimous, majority, or sequential approvals with configurable rules',
        'Automatic 3-level escalation when an SLA approaches its limit',
        'Temporary delegation with backup rules and notification',
        'Smart timeouts that automatically reassign tasks',
        'Field-based conditionals: different flows based on priority, category, or location',
      ],
    },
    {
      num: '03',
      name: 'Real-Time Operations Control',
      tagline: 'Complete visibility — from the operations floor to the boardroom',
      desc: 'Live dashboards showing exactly what\'s happening in your operation right now. Not static reports from last week — operational intelligence updated to the minute.',
      features: [
        'Real-time KPIs by location, team, category, or custom period',
        'SLAs with P50/P90/P95 monitoring and three escalation alert levels',
        'Live activity monitor: who\'s doing what, where, right now',
        'Historical vs. current performance comparison with automatic trends',
        'Scheduled report exports in PDF, Excel, or via API',
      ],
    },
    {
      num: '04',
      name: 'Compliance & Audit Software',
      tagline: 'Audit-ready for any standard — no paperwork',
      desc: 'Every action in Whagons is recorded with timestamp, user, and evidence. Comply with ISO, FDA, HACCP, or any regulatory standard with 100% digital, traceable records.',
      features: [
        'Digital signatures linked to identity and device',
        'Configurable record retention (up to 7+ years)',
        'Photographic evidence with geolocation and timestamp',
        'Standards checklists with versioning and change auditing',
        'Automated compliance reports by period or regulation',
      ],
    },
    {
      num: '05',
      name: 'Asset Management & Preventive Maintenance',
      tagline: 'Detect problems before they become costs',
      desc: 'Manage the complete lifecycle of your assets: from acquisition to depreciation. Schedule automatic inspections, track maintenance history, and anticipate failures with predictive analytics.',
      features: [
        'Asset inventory with hierarchies, location, and real-time status',
        'Preventive maintenance with automatic lifecycle-based calendars',
        'Field inspections with QR/barcode scanning',
        'Depreciation calculation and total cost of ownership (TCO)',
        'Complete intervention, parts, and cost history per asset',
      ],
    },
    {
      num: '06',
      name: 'Operational Knowledge Base',
      tagline: 'Your organization\'s manual — always updated, always accessible',
      desc: 'Centralize SOPs, manuals, certificates, protocols, and training in one place. Multilingual, multimedia, with read confirmations and gamification to drive adoption.',
      features: [
        'Library organized by department, role, and location',
        'Multimedia documents: video, PDF, images, checklists',
        'Read confirmation with records of who read what and when',
        'Versioning with change history and automatic update notifications',
        'Gamification with points and achievements to drive operational engagement',
      ],
    },
    {
      num: '07',
      name: 'Built to Scale Without Limits',
      tagline: 'From 10 users to thousands — without switching platforms',
      desc: 'Whagons was built for complex operations from day one. It works offline, integrates with your existing systems, supports white-label, and offers 18+ activatable modules based on your needs.',
      features: [
        'Offline-first: full operations without connectivity with automatic sync',
        'Complete RESTful API for integration with ERP, CRM, BI, and legacy systems',
        'SSO (Single Sign-On) with SAML 2.0 and OIDC for enterprise authentication',
        'Full white-label: your logo, colors, and custom domain',
        '18+ activatable powerups: dynamic forms, scheduler, templates, and more',
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
