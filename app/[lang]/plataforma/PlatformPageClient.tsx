import type { ReactNode } from 'react';
import { Language } from '../../lib/i18n';
import { routeFor } from '../../lib/locales';
import { businessEvaluation } from '../../lib/free-evaluation';
import Adapt from '../../components/home/sections/Adapt';
import Powerups from '../../components/home/sections/Powerups';
import Capabilities from './Capabilities';
import styles from './PlatformPage.module.css';

/*
 * The platform page, for any operation: plants, field service, logistics,
 * construction and facilities. The hero shows the same Whagons window as the
 * home page (grid, Kanban, map, capture channels and the triage agent), then
 * one task from report to verified, the capabilities, the powerups, how it
 * sits next to the systems a company already has, and the next step.
 */

type StepIcon = 'voice' | 'agent' | 'clip' | 'check';

const content = {
  es: {
    eyebrow: 'La plataforma Whagons', title: 'Cada equipo conectado.', emphasis: 'Cada pendiente, visible.',
    lead: 'Del primer reporte al trabajo verificado. Un solo lugar para coordinar plantas, cuadrillas de campo, almacenes, obras y edificios, con el contexto que cada equipo necesita.',
    demo: 'Solicitar una demo', explore: 'Explorar la plataforma',
    screen: 'Dentro de Whagons', screenNote: 'Datos de ejemplo',
    lenses: [['Por equipo', 'Cada equipo en su espacio, con responsables claros.'], ['Por lugar', 'Plantas, equipos, rutas y áreas, cada uno con su historial.'], ['Por estado', 'Lo pendiente, lo que avanza y lo verificado.']],
    flowLabel: 'Un mismo hilo, de principio a fin', flowTitle: 'Un reporte no debería perderse entre equipos.',
    flowLead: 'Operación, mantenimiento y supervisión trabajan sobre la misma tarea. Cada paso deja contexto para el siguiente.',
    example: 'Ejemplo de un flujo configurado', task: 'Vibración anormal en la bomba P-3', place: 'Línea 2 · Mantenimiento',
    steps: [
      ['Reportar', 'Un operario lo reporta por voz, QR o NFC. El spot y el activo se llenan solos.', 'Voz · 07:42', 'voice'],
      ['Coordinar', 'El agente de triaje sugiere categoría y responsable; supervisión lo aprueba.', 'Diego R. · SLA 4 h', 'agent'],
      ['Resolver', 'El técnico registra repuestos, fotos y comentarios en la misma tarea.', '3 adjuntos · 2 notas', 'clip'],
      ['Verificar', 'Supervisión revisa la evidencia y cierra. Los indicadores se actualizan.', 'Verificada · 11:05', 'check'],
    ] as [string, string, string, StepIcon][],
    connectLabel: 'En tu operación', connectTitle: 'Tus sistemas guardan los datos. Whagons coordina el trabajo.',
    connectText: 'Conserva los sistemas que ya usas. Define con nuestro equipo qué información conectar y qué proceso ordenar primero.',
    system: 'Tus sistemas', systemSub: 'ERP · Inventario · RR. HH. · otras herramientas', center: 'Trabajo coordinado', people: 'Tu equipo', peopleSub: 'Operación · Campo · Supervisión · Gerencia',
    rolloutTitle: 'Empieza con un flujo real.', rolloutText: 'Configuramos el alcance, capacitamos al equipo y acompañamos la puesta en marcha. Desde ahí, puedes ampliar la operación.',
    offlineTitle: 'También donde la conexión falla.', offlineText: 'Consulta la información guardada y sincroniza los cambios compatibles al reconectarte.',
    finalLabel: 'Veamos tu operación', finalTitle: 'Trae un proceso de tu operación. Veamos cómo organizarlo.',
    finalText: 'Una demo enfocada en tus equipos, tus pendientes y tu forma de trabajar.', features: 'Consultar todas las funcionalidades',
  },
  en: {
    eyebrow: 'The Whagons platform', title: 'Every team connected.', emphasis: 'Every open task, visible.',
    lead: 'From the first report to verified work. One place to coordinate plants, field crews, warehouses, sites and buildings, with the context each team needs.',
    demo: 'Request a demo', explore: 'Explore the platform',
    screen: 'Inside Whagons', screenNote: 'Sample data',
    lenses: [['By team', 'Each team in its own space, with clear owners.'], ['By place', 'Plants, equipment, routes and areas, each with its history.'], ['By status', 'What is pending, moving and verified.']],
    flowLabel: 'One thread, from start to finish', flowTitle: 'A report should never get lost between teams.',
    flowLead: 'Operations, maintenance and supervisors work on the same task. Each step leaves context for the next.',
    example: 'Example of a configured workflow', task: 'Abnormal vibration on pump P-3', place: 'Line 2 · Maintenance',
    steps: [
      ['Report', 'An operator reports it by voice, QR or NFC. The spot and asset fill in on their own.', 'Voice · 07:42', 'voice'],
      ['Coordinate', 'The triage agent suggests a category and owner; a supervisor approves.', 'Diego R. · 4 h SLA', 'agent'],
      ['Resolve', 'The technician records parts, photos and comments on the same task.', '3 attachments · 2 notes', 'clip'],
      ['Verify', 'A supervisor reviews the evidence and closes it. The KPIs update.', 'Verified · 11:05', 'check'],
    ] as [string, string, string, StepIcon][],
    connectLabel: 'Within your operation', connectTitle: 'Your systems keep the records. Whagons coordinates the work.',
    connectText: 'Keep the systems you already use. Work with our team to define what to connect and which process to organize first.',
    system: 'Your systems', systemSub: 'ERP · Inventory · HR · other tools', center: 'Coordinated work', people: 'Your team', peopleSub: 'Operations · Field · Supervisors · Management',
    rolloutTitle: 'Start with a real workflow.', rolloutText: 'We configure the scope, train your team and support the rollout. From there, you can expand your operation.',
    offlineTitle: 'Even when the connection drops.', offlineText: 'Access saved information and sync supported changes when you reconnect.',
    finalLabel: 'Let’s look at your operation', finalTitle: 'Bring a process from your operation. Let’s see how to organize it.',
    finalText: 'A demo focused on your teams, open tasks and way of working.', features: 'Explore all features',
  },
};

const STEP_ICONS: Record<StepIcon, ReactNode> = {
  voice: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" /></>,
  agent: <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z" />,
  clip: <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />,
  check: <path d="M20 6 9 17l-5-5" />,
};

export default function PlatformPageClient({ lang }: { lang: Language }) {
  const t = content[lang];
  const demoHref = routeFor(lang, 'demo');
  const evaluation = businessEvaluation[lang];
  const evaluationHref = routeFor(lang, 'businessEvaluation');

  return <main className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroIntro} data-reveal="">
        <div>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1>{t.title}<em>{t.emphasis}</em></h1>
        </div>
        <div>
          <p className={styles.lead}>{t.lead}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={demoHref} data-track="platform_demo_click">{t.demo}<span aria-hidden="true">→</span></a>
            <a className={styles.secondary} href={evaluationHref} data-track="platform_evaluation_click">{evaluation.cta}</a>
          </div>
          <a className={styles.textLink} href="#platform-capabilities">{t.explore}<span aria-hidden="true">↓</span></a>
        </div>
      </div>

      <div className={styles.productHeading}><span>{t.screen}</span><span>{t.screenNote}</span></div>
      <div className={styles.product}><Adapt lang={lang} bare /></div>
      <ul className={styles.lenses} data-reveal-kids="">
        {t.lenses.map(([title, desc], i) => <li key={title}><span>0{i + 1}</span><p><strong>{title}</strong>{desc}</p></li>)}
      </ul>
    </section>

    <section className={styles.flow} aria-labelledby="platform-flow-title">
      <div className={styles.sectionIntro} data-reveal="">
        <div><p className={styles.eyebrow}>{t.flowLabel}</p><h2 id="platform-flow-title">{t.flowTitle}</h2></div>
        <p className={styles.lead}>{t.flowLead}</p>
      </div>
      <div className={styles.example} data-reveal=""><span>{t.example}</span><strong>{t.task}</strong><span>{t.place}</span></div>
      <ol className={styles.steps} data-reveal-kids="">
        {t.steps.map(([title, desc, status, icon], i) => <li key={title}>
          <span className={styles.stepNumber}>0{i + 1}</span>
          <h3>{title}</h3>
          <p>{desc}</p>
          <span className={styles.stepStatus} data-icon={icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{STEP_ICONS[icon]}</svg>
            {status}
          </span>
        </li>)}
      </ol>
    </section>

    <Capabilities lang={lang} />

    <Powerups lang={lang} />

    <section className={styles.connections} aria-labelledby="platform-connect-title">
      <div className={styles.sectionIntro} data-reveal="">
        <div><p className={styles.eyebrow}>{t.connectLabel}</p><h2 id="platform-connect-title">{t.connectTitle}</h2></div>
        <p className={styles.lead}>{t.connectText}</p>
      </div>
      <div className={styles.connectionDiagram} data-reveal="">
        <div className={styles.node}><strong>{t.system}</strong><span>{t.systemSub}</span></div>
        <span className={styles.connector} aria-hidden="true"><i /></span>
        <div className={styles.hub}><span>Whagons</span><strong>{t.center}</strong></div>
        <span className={styles.connector} aria-hidden="true"><i /></span>
        <div className={styles.node}><strong>{t.people}</strong><span>{t.peopleSub}</span></div>
      </div>
      <div className={styles.practical} data-reveal-kids="">
        <article><span aria-hidden="true">01</span><h3>{t.rolloutTitle}</h3><p>{t.rolloutText}</p></article>
        <article><span aria-hidden="true">02</span><h3>{t.offlineTitle}</h3><p>{t.offlineText}</p></article>
      </div>
    </section>

    <section className={styles.final} aria-labelledby="platform-final-title">
      <div className={styles.finalInner} data-reveal="">
        <p className={styles.eyebrow}>{t.finalLabel}</p>
        <h2 id="platform-final-title">{t.finalTitle}</h2>
        <p className={styles.lead}>{t.finalText}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={demoHref} data-track="platform_final_demo_click">{t.demo}<span aria-hidden="true">→</span></a>
          <a className={styles.secondary} href={evaluationHref} data-track="platform_final_evaluation_click">{evaluation.cta}</a>
        </div>
        <a className={styles.textLink} href={routeFor(lang, 'features')}>{t.features}<span aria-hidden="true">→</span></a>
      </div>
    </section>
  </main>;
}
