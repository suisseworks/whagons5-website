'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import localFont from 'next/font/local';
import styles from './MissionControlMock.module.css';

// The app uses the system UI font; Inter renders the same way on every platform.
const inter = localFont({ src: '../../fonts/inter-latin.woff2', weight: '400 700', display: 'swap' });

/*
 * Mission Control from the Whagons app, rebuilt in HTML so it stays sharp on
 * every screen and can move. Markup, spacing and colors follow the app's
 * MissionControl, MissionOverview, MissionTaskQueue and TaskStatusFlow
 * components; the figures are the Hotel Premium demo tenant's.
 *
 * Motion: numbers count up and the status bar fills when it scrolls into view,
 * then a few tasks "complete" live. The queue tabs and status bar respond to
 * the visitor the way they do in the app.
 */

type Lang = 'es' | 'en';
type Focus = 'all' | 'overdue' | 'upcoming' | 'unassigned' | 'paused';

const copy = {
  en: {
    eyebrow: 'Operations overview', title: 'Your operation, at a glance', scope: 'Current task snapshot · Activity from today', connected: 'Connected',
    open: 'Open tasks', openHint: 'Current workload in scope', overdue: 'Overdue', overdueHint: 'Past their due date', upcoming: 'Next 7 days', upcomingHint: 'Open tasks due soon',
    completed: 'Completed in scope', completedHint: (p: number, t: number) => `${p}% of ${t} tasks`,
    queue: 'Attention queue', queueText: 'Overdue tasks first. Open a task to take the next step.', focus: 'Focus tasks',
    tabs: { all: 'All open', overdue: 'Overdue', upcoming: 'Next 7 days', unassigned: 'Unassigned', paused: 'Paused' },
    search: 'Search tasks or workspaces', empty: 'No open tasks in this view', emptyHint: 'Try another focus or adjust the dashboard filters.',
    byStatus: 'Tasks by Status', total: 'total', phases: ['Initial', 'In Progress', 'Paused', 'Completed'],
    activity: 'Recent activity', live: 'Live', now: 'just now', ago: (m: number) => `${m}m ago`,
    verbs: { completed: 'completed', started: 'started', created: 'created', paused: 'paused' },
    events: ['Clean air filters', 'Fix leaking sink', 'Room 108 turnover', 'Inspect laundry dryer', 'Deep clean room 214', 'Adjust door lock'],
    tasks: [
      ['Inspect laundry dryer', 'Maintenance', 'Overdue · Sep 26', 'In progress'],
      ['Deep clean room 214', 'Housekeeping', 'Overdue · Sep 27', 'To do'],
      ['Replace walkway light', 'Maintenance', 'Oct 2', 'In progress'],
      ['Adjust door lock', 'Maintenance', 'Oct 4', 'On hold'],
    ],
  },
  es: {
    eyebrow: 'Resumen operativo', title: 'Tu operación, de un vistazo', scope: 'Estado actual de las tareas · Actividad de hoy', connected: 'Conectado',
    open: 'Tareas abiertas', openHint: 'Carga de trabajo en el alcance actual', overdue: 'Vencidas', overdueHint: 'Su fecha límite ya pasó', upcoming: 'Próximos 7 días', upcomingHint: 'Tareas abiertas próximas a vencer',
    completed: 'Completadas en este alcance', completedHint: (p: number, t: number) => `${p}% de ${t} tareas`,
    queue: 'Requieren atención', queueText: 'Primero las vencidas. Abre una tarea para dar el siguiente paso.', focus: 'Enfocar tareas',
    tabs: { all: 'Todas las abiertas', overdue: 'Vencidas', upcoming: 'Próximos 7 días', unassigned: 'Sin asignar', paused: 'Pausadas' },
    search: 'Buscar tareas o espacios de trabajo', empty: 'No hay tareas abiertas en esta vista', emptyHint: 'Prueba otro enfoque o ajusta los filtros del panel.',
    byStatus: 'Tareas por estado', total: 'en total', phases: ['Inicial', 'En Progreso', 'Pausado', 'Completado'],
    activity: 'Actividad reciente', live: 'En vivo', now: 'ahora', ago: (m: number) => `hace ${m} min`,
    verbs: { completed: 'completó', started: 'inició', created: 'creó', paused: 'pausó' },
    events: ['Limpiar filtros de aire', 'Reparar goteo en lavamanos', 'Salida hab. 108', 'Revisar secadora', 'Limpieza profunda hab. 214', 'Ajustar cerradura'],
    tasks: [
      ['Revisar secadora', 'Mantenimiento', 'Vencidas · 26 sept', 'En progreso'],
      ['Limpieza profunda hab. 214', 'Ama de llaves', 'Vencidas · 27 sept', 'Por hacer'],
      ['Cambiar luminaria', 'Mantenimiento', '2 oct', 'En progreso'],
      ['Ajustar cerradura', 'Mantenimiento', '4 oct', 'En espera'],
    ],
  },
};

// Which queue tabs each sample task belongs to, mirroring the app's attention flags.
const taskMeta: { id: number; flags: Focus[]; tone: 'overdue' | 'paused' | 'open' }[] = [
  { id: 1042, flags: ['all', 'overdue'], tone: 'overdue' },
  { id: 1037, flags: ['all', 'overdue'], tone: 'overdue' },
  { id: 1051, flags: ['all', 'upcoming'], tone: 'open' },
  { id: 1049, flags: ['all', 'upcoming', 'paused'], tone: 'paused' },
];

type Verb = 'completed' | 'started' | 'created' | 'paused';
// Feed entries: who, verb, index into copy.events, minutes ago. The first three
// arrive live (one per tick); the rest are already on screen.
const LIVE_EVENTS: [string, string, Verb, number][] = [['Marco', '#0e7490', 'completed', 0], ['Lucía', '#7c3aed', 'completed', 1], ['Ana', '#be185d', 'completed', 2]];
const PAST_EVENTS: [string, string, Verb, number, number][] = [['Diego', '#4d7c0f', 'started', 3, 2], ['Lucía', '#7c3aed', 'created', 4, 9], ['Marco', '#0e7490', 'paused', 5, 14]];

const PHASE_COLORS = ['#94a3b8', '#4f46e5', '#f59e0b', '#059669'];
const TOTAL = 128;
const LIVE_TICKS = 3;

export default function MissionControlMock({ lang }: { lang: string }) {
  const t = copy[(lang === 'en' ? 'en' : 'es') satisfies Lang];
  const rootRef = useRef<HTMLDivElement>(null);
  // static: final values (server render, reduced motion); armed: zeroed, waiting
  // to scroll into view; live: counted up and ticking.
  const [phase, setPhase] = useState<'static' | 'armed' | 'live'>('static');
  const [progress, setProgress] = useState(1);
  const [done, setDone] = useState(0);
  const [inView, setInView] = useState(false);
  const [focus, setFocus] = useState<Focus>('all');
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = node.getBoundingClientRect();
    const visibleAtLoad = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visibleAtLoad) { setPhase('armed'); setProgress(0); }
    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setPhase('live');
    }, { threshold: 0.35 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== 'live' || progress >= 1) return;
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // Runs once per arming; progress is read only to skip when already complete.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // A few tasks finish while the visitor watches, as they would on a live board.
  useEffect(() => {
    if (phase !== 'live' || progress < 1 || !inView || done >= LIVE_TICKS) return;
    const timer = window.setTimeout(() => setDone(d => d + 1), done === 0 ? 2600 : 4200);
    return () => window.clearTimeout(timer);
  }, [phase, progress, inView, done]);

  const ease = 1 - Math.pow(1 - progress, 3);
  // Plain numbers while counting up; afterwards each change rolls in.
  const num = (value: number) => progress < 1 ? Math.round(value * ease) : <Ticker value={value} />;

  const open = 56 - done;
  const completed = 72 + done;
  const counts: Record<Focus, number> = { all: open, overdue: 33, upcoming: 23, unassigned: 0, paused: 8 };
  const phases = [16, 32 - done, 8, completed];
  const barShown = phase !== 'armed';

  const metrics: { label: string; value: number; hint: string; icon: ReactNode; tone: string }[] = [
    { label: t.open, value: open, hint: t.openHint, icon: <IconLayers />, tone: styles.toneOpen },
    { label: t.overdue, value: 33, hint: t.overdueHint, icon: <IconAlert />, tone: styles.toneOverdue },
    { label: t.upcoming, value: 23, hint: t.upcomingHint, icon: <IconClock />, tone: styles.toneUpcoming },
    { label: t.completed, value: completed, hint: t.completedHint(Math.round(completed / TOTAL * 100), TOTAL), icon: <IconCheck />, tone: styles.toneDone },
  ];

  const rows = t.tasks.map((task, i) => ({ task, ...taskMeta[i] })).filter(row => row.flags.includes(focus));

  return <div ref={rootRef} className={`${styles.mc} ${inter.className}`} data-phase={phase}>
    <header className={styles.head}>
      <div>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <p className={styles.title}>{t.title}</p>
        <p className={styles.scope}>{t.scope}</p>
      </div>
      <span className={styles.connected}><IconRadio />{t.connected}</span>
    </header>

    <div className={styles.kpis}>
      {metrics.map(metric => <div key={metric.label} className={styles.kpi}>
        <div className={styles.kpiTop}><span>{metric.label}</span><span className={metric.tone}>{metric.icon}</span></div>
        <div className={styles.kpiMid}>
          <span className={`${styles.kpiValue} ${metric.tone}`}>{num(metric.value)}</span>
          <span className={styles.kpiArrow}><IconArrow /></span>
        </div>
        <p className={styles.kpiHint}>{metric.hint}</p>
      </div>)}
    </div>

    <div className={styles.lower}>
      <section className={styles.queue} aria-label={t.queue}>
        <div className={styles.queueHead}>
          <div><p className={styles.queueTitle}>{t.queue}</p><p className={styles.queueText}>{t.queueText}</p></div>
          <span className={styles.queueBadge}>{num(open)}</span>
        </div>
        <div className={styles.tabs} role="group" aria-label={t.focus}>
          {(Object.keys(t.tabs) as Focus[]).map(id => <button key={id} type="button" aria-pressed={focus === id} onClick={() => setFocus(id)}>
            {t.tabs[id]}<span>{num(counts[id])}</span>
          </button>)}
        </div>
        <div className={styles.search}><IconSearch /><span>{t.search}</span></div>
        {rows.length ? <ul key={focus} className={styles.rows}>
          {rows.map((row, i) => <li key={row.id} style={{ ['--i' as string]: i }}>
            <span className={styles.rowBar} data-tone={row.tone} />
            <div className={styles.rowMain}><p>{row.task[0]}</p><span>{row.task[1]}<i>#{row.id}</i></span></div>
            <div className={styles.rowSide}><p data-tone={row.tone}>{row.task[2]}</p><span>{row.task[3]}</span></div>
            <span className={styles.rowArrow}><IconArrow /></span>
          </li>)}
        </ul> : <div key={focus} className={styles.empty}><p>{t.empty}</p><span>{t.emptyHint}</span></div>}
      </section>

      <div className={styles.side}>
      <section className={styles.status} aria-label={t.byStatus}>
        <div className={styles.statusHead}>
          <span>{t.byStatus}</span>
          <span className={styles.total}><b>{TOTAL}</b>{t.total}</span>
        </div>
        <div className={styles.bar} onMouseLeave={() => setHovered(null)}>
          {phases.map((count, i) => <span
            key={i}
            className={styles.segment}
            data-dim={hovered !== null && hovered !== i || undefined}
            onMouseEnter={() => setHovered(i)}
            style={{ width: barShown ? `${count / TOTAL * 100}%` : '0%', background: PHASE_COLORS[i], transitionDelay: phase === 'live' && progress < 1 ? `${i * 90}ms` : '0ms' }}
          ><span>{count}</span></span>)}
        </div>
        <div className={styles.legend}>
          {phases.map((count, i) => <div key={i} data-dim={hovered !== null && hovered !== i || undefined} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <i style={{ background: PHASE_COLORS[i] }} />
            <span>{t.phases[i]}</span>
            <b>{num(count)}</b>
          </div>)}
        </div>
      </section>

      <section className={styles.activity} aria-label={t.activity}>
        <div className={styles.activityHead}><span>{t.activity}</span><span className={styles.live}><i />{t.live}</span></div>
        <ul>
          {[
            ...LIVE_EVENTS.slice(0, done).reverse().map(([who, color, verb, task], i) => ({ key: `live-${task}`, who, color, verb, task, when: i === 0 ? t.now : t.ago(i), fresh: i === 0 })),
            ...PAST_EVENTS.map(([who, color, verb, task, mins]) => ({ key: `past-${task}`, who, color, verb, task, when: t.ago(mins + done), fresh: false })),
          ].slice(0, 4).map(event => <li key={event.key} data-fresh={event.fresh || undefined}>
            <span className={styles.verbIcon} data-verb={event.verb}>{VERB_ICONS[event.verb]}</span>
            <span className={styles.avatar} style={{ background: event.color }}>{event.who[0]}</span>
            <p><b>{event.who}</b> <span>{t.verbs[event.verb]}</span> {t.events[event.task]}</p>
            <time>{event.when}</time>
          </li>)}
        </ul>
      </section>
      </div>
    </div>
  </div>;
}

/** Re-mounts on change so each new value rolls in. */
function Ticker({ value }: { value: number }) {
  return <span key={value} className={styles.tick}>{value}</span>;
}

const svg = (children: ReactNode) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
const IconLayers = () => svg(<><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></>);
const IconAlert = () => svg(<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></>);
const IconClock = () => svg(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16.5 12" /></>);
const IconCheck = () => svg(<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>);
const IconArrow = () => svg(<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>);
const IconSearch = () => svg(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
const VERB_ICONS: Record<Verb, ReactNode> = {
  completed: svg(<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>),
  started: svg(<polygon points="6 3 20 12 6 21 6 3" />),
  created: svg(<><path d="M5 12h14" /><path d="M12 5v14" /></>),
  paused: svg(<><rect x="14" y="4" width="4" height="16" rx="1" /><rect x="6" y="4" width="4" height="16" rx="1" /></>),
};
const IconRadio = () => svg(<><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" /></>);
