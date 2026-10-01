'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { appFont } from './appFont';
import { Fa, FaDuo, Lucide, LOGO_PATHS, type FaName } from './AppShellIcons';
import styles from './AppShell.module.css';

/*
 * The Whagons app frame (sidebar, workspace header, KPI strip and view tabs)
 * rebuilt in HTML at the 1512×827 size of the product screenshots it
 * replaces. The frame scales like an image (same aspect ratio and
 * proportions, sharp at any density) without JS: the canvas is laid out at
 * exactly 1512×827 CSS px and scaled to the frame's width, so inside it one
 * CSS px is one screenshot px (children can be styled in plain px; 1em is
 * 10px). Every length in the CSS is written as a multiple of `--u`, which is
 * 1px there and 1/1512 of the width in browsers without tan(atan2()).
 *
 * The content area (children) is the box below the tabs row:
 * x = sidebar + 30 … 1512, y = 217 … 827 (EN 321,217 1191×610; ES 315,217 1197×610).
 *
 * Positions follow the Hotel Premium screenshots measured pixel by pixel;
 * markup and colors follow the app's AppSidebar, Header, WorkspaceKpiCard and
 * workspace tabs. Motion: KPI numbers count up and the progress ring draws
 * when the frame scrolls into view; the avatar's online dot pulses.
 */

export type ShellLang = 'en' | 'es';
export type ShellTab = 'tasks' | 'board';
export type SpaceKey = 'housekeeping' | 'maintenance' | 'guests' | 'lostFound' | 'gardens' | 'quality' | 'purchasing' | 'management';
export type ShellKpis = { total: number; inProgress: number; completedToday: number; progress: number };
export type ShellPhase = 'static' | 'armed' | 'live';

export interface AppShellProps {
  lang: string;
  /** Active sidebar space; also sets the header title and icon. */
  space?: SpaceKey;
  /** Which view tab is selected; the toolbar changes with it like in the app. */
  tab?: ShellTab;
  /** KPI figures (defaults: the screenshot's 16 / 4 / 1 / 56%). Changes roll in. */
  kpis?: Partial<ShellKpis>;
  /** Fired once the entrance count-up has finished (never under reduced motion). */
  onReveal?: () => void;
  /** Fired whenever the frame enters or leaves the viewport. */
  onVisibilityChange?: (visible: boolean) => void;
  /** Content below the tabs row (task grid, Kanban board…). */
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

/** One design pixel as a CSS length. */
export const u = (n: number) => `calc(var(--u) * ${n})`;

const SPACES: { key: SpaceKey; en: string; es: string; color: string; icon: FaName }[] = [
  { key: 'housekeeping', en: 'Housekeeping', es: 'Ama de llaves', color: '#8b5cf6', icon: 'bed' },
  { key: 'maintenance', en: 'Maintenance', es: 'Mantenimiento', color: '#2563eb', icon: 'wrench' },
  { key: 'guests', en: 'Guest requests', es: 'Solicitudes de huéspedes', color: '#f59e0b', icon: 'bellConcierge' },
  { key: 'lostFound', en: 'Lost & Found', es: 'Objetos perdidos', color: '#e11d48', icon: 'suitcase' },
  { key: 'gardens', en: 'Gardens', es: 'Jardines', color: '#16a34a', icon: 'leaf' },
  { key: 'quality', en: 'Quality & inspections', es: 'Calidad y hallazgos', color: '#ec4899', icon: 'clipboardCheck' },
  { key: 'purchasing', en: 'Purchasing', es: 'Compras', color: '#64748b', icon: 'cartShopping' },
  { key: 'management', en: 'Management', es: 'Gerencia', color: '#0d9488', icon: 'briefcase' },
];

const copy = {
  en: {
    nav: ['Mission Control', 'Everything', 'Shared', 'Messages'], spaces: 'Spaces', settings: 'Settings', more: 'More', bug: 'Report a bug', powered: 'Powered by',
    search: 'Search — use $and / $or for keywords', ai: 'AI', create: 'Create Task', theme: 'Toggle theme',
    kpis: ['Team tasks', 'In progress', 'Completed today', 'Team progress'],
    tabs: { tasks: 'Tasks', calendar: 'Calendar', map: 'Map', board: 'Kanban', stats: 'Statistics', settings: 'Settings' },
    kpiToggle: 'KPIs', collab: 'Collab', views: 'Views', toolbar: ['Filters', 'Saved filters', 'Date range', 'Group by', 'Workspace views', 'Export', 'Archived tasks', 'Full screen'],
  },
  es: {
    nav: ['Centro de Mando', 'Todo', 'Compartido', 'Mensajes'], spaces: 'Espacios', settings: 'Configuración', more: 'Más', bug: 'Informar un error', powered: 'Desarrollado por',
    search: 'Buscar', ai: 'IA', create: 'Crear Tarea', theme: 'Cambiar tema',
    kpis: ['Tareas del equipo', 'En atención', 'Completadas hoy', 'Avance del equipo'],
    tabs: { tasks: 'Tareas', calendar: 'Calendario', map: 'Mapa', board: 'Kanban', stats: 'Estadísticas', settings: 'Configuración' },
    kpiToggle: 'KPI', collab: 'Colab', views: 'Vistas', toolbar: ['Filtros', 'Filtros guardados', 'Rango de fechas', 'Agrupar', 'Vistas del espacio', 'Exportar', 'Tareas archivadas', 'Pantalla completa'],
  },
};

/* Measured from the screenshots: the Spanish sidebar is 6px narrower and its
   header carries the gamification trophy, which moves the search and button. */
const LAYOUT = {
  en: { sidebar: 291, search: [548, 545], create: [1271, 129], trophy: null, online: true },
  es: { sidebar: 285, search: [569, 544], create: [1200, 128], trophy: [1337, 70], online: false },
} as const;

/** Selected tab widths (icon + label), fixed so the row never depends on text metrics. */
const ACTIVE_TAB_WIDTH: Record<ShellLang, Record<ShellTab, number>> = { en: { tasks: 86, board: 98 }, es: { tasks: 92, board: 98 } };

const DEFAULT_KPIS: ShellKpis = { total: 16, inProgress: 4, completedToday: 1, progress: 56 };

const TABS: { key: keyof typeof copy.en.tabs; icon: FaName }[] = [
  { key: 'tasks', icon: 'clipboardList' },
  { key: 'calendar', icon: 'calendarDays' },
  { key: 'map', icon: 'mapLocationDot' },
  { key: 'board', icon: 'tableColumns' },
  { key: 'stats', icon: 'gaugeHigh' },
  { key: 'settings', icon: 'gear' },
];

/**
 * static: final values (server render, reduced motion, already on screen at
 * load); armed: zeroed while waiting to scroll into view; live: counted up.
 */
function useReveal(onReveal?: () => void, onVisibilityChange?: (visible: boolean) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<ShellPhase>('static');
  const [progress, setProgress] = useState(1);
  const callbacks = useRef({ onReveal, onVisibilityChange });
  callbacks.current = { onReveal, onVisibilityChange };
  const revealed = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = node.getBoundingClientRect();
    const visibleAtLoad = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visibleAtLoad) { setPhase('armed'); setProgress(0); }
    // A parent may zoom the frame (the homepage explorer does on phones), so
    // also count it as seen once a good-sized piece of it is on screen.
    const io = new IntersectionObserver(([entry]) => {
      const seen = entry.isIntersecting && (entry.intersectionRatio >= 0.35 || entry.intersectionRect.height >= 150);
      callbacks.current.onVisibilityChange?.(seen);
      if (seen) setPhase('live');
    }, { threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.6, 1] });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== 'live') return;
    if (progress >= 1) {
      if (!revealed.current) { revealed.current = true; callbacks.current.onReveal?.(); }
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1300);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [phase, progress >= 1]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ref, phase, progress };
}

export default function AppShell({ lang, space = 'maintenance', tab = 'tasks', kpis, onReveal, onVisibilityChange, children, className, 'aria-label': ariaLabel }: AppShellProps) {
  const l: ShellLang = lang === 'en' ? 'en' : 'es';
  const t = copy[l];
  const layout = LAYOUT[l];
  const active = SPACES.find(s => s.key === space) ?? SPACES[1];
  const values = { ...DEFAULT_KPIS, ...kpis };
  const { ref, phase, progress } = useReveal(onReveal, onVisibilityChange);
  const ease = 1 - Math.pow(1 - progress, 3);
  const num = (value: number) => progress < 1 ? Math.round(value * ease) : <Ticker value={value} />;
  const sw = layout.sidebar;

  const kpiCards: { label: string; value: ReactNode; tone: string; icon: ReactNode; ring?: boolean }[] = [
    { label: t.kpis[0], value: num(values.total), tone: '#3b82f6', icon: <Lucide><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></Lucide> },
    { label: t.kpis[1], value: num(values.inProgress), tone: '#f59e0b', icon: <Lucide><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></Lucide> },
    { label: t.kpis[2], value: num(values.completedToday), tone: '#10b981', icon: <Lucide><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></Lucide> },
    { label: t.kpis[3], value: <>{num(values.progress)}%</>, tone: '#a855f7', ring: true, icon: <Lucide><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Lucide> },
  ];
  const ringPercent = phase === 'armed' ? 0 : values.progress * (progress < 1 ? ease : 1);

  return <div ref={ref} className={`${styles.frame} ${appFont.className} ${className ?? ''}`} data-phase={phase} role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel}>
    <div className={styles.canvas} style={{ '--sw': sw } as CSSProperties}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.logoBar}>
          <svg className={styles.logo} viewBox="33 133 1928 272" aria-hidden="true">{LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}</svg>
          <span className={styles.toggle}><i /></span>
        </div>

        {[
          <path key="mc" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />,
          <g key="all"><rect x="3" y="5" width="6" height="6" rx="1" /><path d="m3 17 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></g>,
          <g key="shared"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></g>,
          <path key="msg" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
        ].map((icon, i) => <div key={i} className={styles.navItem} style={{ top: u(72 + i * 28) }}>
          <Lucide className={styles.navIcon}>{icon}</Lucide><span>{t.nav[i]}</span>
        </div>)}

        <span className={styles.divider} style={{ top: u(194) }} />
        <div className={styles.spacesHead}>
          <Lucide className={styles.chevron} strokeWidth={2.4}><path d="m18 15-6-6-6 6" /></Lucide>
          <span>{t.spaces}</span>
          <Lucide className={styles.spacesTune}><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></Lucide>
        </div>
        {SPACES.map((s, i) => <div key={s.key} className={styles.space} data-active={s.key === active.key || undefined} style={{ top: u(232 + i * 34) }}>
          <span className={styles.spaceIcon} style={{ background: s.color }}><FaDuo name={s.icon} /></span>
          <span className={styles.spaceName}>{s[l]}</span>
          <span className={styles.count}>7</span>
        </div>)}
        <span className={`${styles.divider} ${styles.dividerWide}`} style={{ top: u(520) }} />

        <Illustration scene={l === 'en' ? 'kitchen' : 'finance'} />

        <div className={styles.footer}>
          <div className={styles.footItem} style={{ top: u(11) }}>
            <span className={styles.footTile} style={{ background: '#6b7280' }}><Lucide strokeWidth={2.2}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></Lucide></span>
            <span style={{ marginLeft: u(8) }}>{t.settings}</span>
          </div>
          <div className={styles.footItem} style={{ top: u(49) }}>
            <span className={styles.dots}>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>
            <span>{t.more}</span>
          </div>
          <div className={styles.footItem} style={{ top: u(87) }}>
            <span className={styles.footTile} style={{ background: '#f0a531' }}><Lucide strokeWidth={2.2}><path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" /><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" /><path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" /><path d="M6 13H2" /><path d="M3 21c0-2.1 1.7-3.9 3.8-4" /><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" /><path d="M22 13h-4" /><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" /></Lucide></span>
            <span>{t.bug}</span>
          </div>
          <div className={styles.version}>
            <Lucide className={styles.heart}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></Lucide>
            <span>v5.2.23 · 1423ef4</span>
            <Lucide className={styles.versionGear}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></Lucide>
          </div>
          <p className={styles.powered}>{t.powered} <b>Whagons</b></p>
        </div>
      </aside>

      {/* ── Workspace header ────────────────────────────────── */}
      <header className={styles.header}>
        <span className={styles.titleIcon} style={{ color: active.color }}><FaDuo name={active.icon} /></span>
        <span className={styles.title}>{active[l]}</span>
        <div className={styles.search} style={{ left: u(layout.search[0]), width: u(layout.search[1]) }}>
          <Lucide className={styles.searchIcon}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Lucide>
          <span>{t.search}</span>
          <Lucide className={styles.history}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></Lucide>
          <span className={styles.ai}>{t.ai}</span>
        </div>
        <span className={styles.create} style={{ left: u(layout.create[0]), width: u(layout.create[1]) }}>
          <Lucide strokeWidth={2.4}><path d="M5 12h14" /><path d="M12 5v14" /></Lucide>{t.create}
        </span>
        {layout.trophy && <span className={styles.trophy} style={{ left: u(layout.trophy[0]), width: u(layout.trophy[1]) }}>
          <Lucide><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></Lucide>2
        </span>}
        <span className={styles.theme} aria-label={t.theme}>
          <Lucide><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></Lucide>
        </span>
        <span className={styles.avatar}>AS<i data-online={layout.online || undefined} /></span>
      </header>

      {/* ── KPI strip ───────────────────────────────────────── */}
      <div className={styles.kpis}>
        {kpiCards.map((card, i) => <div key={i} className={styles.kpi} style={{ '--tone': card.tone, '--i': i } as CSSProperties}>
          <span className={styles.kpiIcon}>{card.icon}</span>
          <span className={styles.kpiText}>
            <span className={styles.kpiLabel}>{card.label}</span>
            <span className={styles.kpiValue}>{card.value}</span>
          </span>
          {card.ring && <svg className={styles.ring} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="17.75" fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth="4.5" />
            <circle cx="20" cy="20" r="17.75" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" transform="rotate(-90 20 20)"
              strokeDasharray={`${(ringPercent / 100) * 2 * Math.PI * 17.75} ${2 * Math.PI * 17.75}`} />
          </svg>}
        </div>)}
      </div>

      {/* ── View tabs + toolbar ─────────────────────────────── */}
      <div className={styles.tabsRow}>
        <div className={styles.tabs}>
          {TABS.map(item => {
            const selected = item.key === tab;
            return <span key={item.key} className={styles.tab} data-active={selected || undefined} aria-label={t.tabs[item.key]} style={selected ? { width: u(ACTIVE_TAB_WIDTH[l][tab]) } : undefined}>
              <Fa name={item.icon} />{selected && <span>{t.tabs[item.key]}</span>}
            </span>;
          })}
        </div>
        <div className={styles.tools}>
          <span className={styles.kpiToggle}><Lucide><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></Lucide>{t.kpiToggle}</span>
          {tab === 'tasks' && <>
            <span className={styles.filterGroup}>
              <span aria-label={t.toolbar[0]}><Lucide><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" /></Lucide></span>
              <span aria-label={t.toolbar[1]}><Lucide><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></Lucide></span>
              <span aria-label={t.toolbar[2]}><Lucide><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M3 10h18" /><path d="M8 2v4" /><path d="M17 14h-6" /><path d="M13 18H7" /><path d="M7 14h.01" /><path d="M17 18h.01" /></Lucide></span>
            </span>
            <span className={styles.tool} aria-label={t.toolbar[3]}><Lucide><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></Lucide></span>
            <span className={styles.tool} aria-label={t.toolbar[4]}><Lucide><rect width="18" height="7" x="3" y="3" rx="1" /><rect width="9" height="7" x="3" y="14" rx="1" /><rect width="5" height="7" x="16" y="14" rx="1" /></Lucide></span>
            <span className={styles.tool} aria-label={t.toolbar[5]}><Lucide><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" /></Lucide></span>
            <span className={styles.tool} aria-label={t.toolbar[6]}><Lucide><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></Lucide></span>
            <span className={styles.tool} aria-label={t.toolbar[7]}><Lucide><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" /></Lucide></span>
          </>}
          <span className={styles.collab} style={{ width: u(l === 'en' ? 76 : 74) }}><Lucide><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Lucide>{t.collab}</span>
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  </div>;
}

export { AppShell };

/** Re-mounts on change so each new value rolls in. */
function Ticker({ value }: { value: number }) {
  return <span key={value} className={styles.tick}>{value}</span>;
}

/*
 * The sidebar's horizon drawing (SidebarIllustration in the app): a 220×320
 * scene anchored to the bottom of an 88px band, plus a corner accent. The app
 * picks scenes at random; these are the two in the screenshots.
 */
function Illustration({ scene }: { scene: 'kitchen' | 'finance' }) {
  return <div className={styles.band} aria-hidden="true">
    <svg className={styles.accent} viewBox="0 0 64 44" fill="none">
      {scene === 'kitchen'
        ? <g fill="currentColor">
          <path d="M46 8 L47.5 13 L52.5 14.5 L47.5 16 L46 21 L44.5 16 L39.5 14.5 L44.5 13Z" className={styles.twinkle} />
          <path d="M28 24 L29 27 L32 28 L29 29 L28 32 L27 29 L24 28 L27 27Z" fillOpacity="0.6" className={styles.twinkleAlt} />
          <circle cx="52" cy="30" r="1.4" fillOpacity="0.5" />
        </g>
        : <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className={styles.birds}>
          <path d="M36 14 Q39 11 42 14 Q45 11 48 14" />
          <path d="M20 22 Q22.5 19.5 25 22 Q27.5 19.5 30 22" strokeWidth="1" />
          <path d="M44 28 Q46 26 48 28 Q50 26 52 28" strokeWidth="0.9" />
        </g>}
    </svg>
    <svg className={styles.scene} viewBox="0 0 220 320" preserveAspectRatio="xMidYMax slice" fill="none">
      <path d="M0 303 Q110 301 220 303" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {scene === 'kitchen' ? <>
        <ellipse cx="60" cy="285" rx="25" ry="8" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.05" />
        <path d="M85 285 L115 278" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <g className={styles.steam}>
          <path d="M50 275 Q52 270 50 265" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
          <path d="M60 273 Q62 268 60 263" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.12" />
          <path d="M70 275 Q72 270 70 265" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
        </g>
        <path d="M155 303 L165 250" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M165 250 L170 230 L163 250 Z" stroke="currentColor" strokeWidth="0.6" fill="currentColor" fillOpacity="0.1" />
        <path d="M170 270 L165 303 L205 303 L200 270 Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.04" />
        <path d="M168 270 L202 270" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M166 270 Q185 262 204 270" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.04" />
        <path d="M183 262 L187 258" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M25 303 L30 265" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M27 275 Q30 255 33 275 M25 278 Q30 260 35 278" stroke="currentColor" strokeWidth="0.6" />
        <rect x="130" y="288" width="8" height="15" rx="1.5" stroke="currentColor" strokeWidth="0.6" fill="currentColor" fillOpacity="0.05" />
        <path d="M130 288 L138 288" stroke="currentColor" strokeWidth="0.5" />
      </> : <>
        <rect x="40" y="270" width="12" height="33" rx="1" stroke="currentColor" strokeWidth="0.6" fill="currentColor" fillOpacity="0.06" />
        <rect x="58" y="255" width="12" height="48" rx="1" stroke="currentColor" strokeWidth="0.6" fill="currentColor" fillOpacity="0.07" />
        <rect x="76" y="240" width="12" height="63" rx="1" stroke="currentColor" strokeWidth="0.6" fill="currentColor" fillOpacity="0.08" />
        <rect x="94" y="250" width="12" height="53" rx="1" stroke="currentColor" strokeWidth="0.6" fill="currentColor" fillOpacity="0.07" />
        <g opacity="0.16">
          <ellipse cx="155" cy="290" rx="14" ry="4" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05" />
          <ellipse cx="155" cy="285" rx="14" ry="4" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.05" />
          <ellipse cx="155" cy="280" rx="14" ry="4" stroke="currentColor" strokeWidth="0.5" fill="currentColor" fillOpacity="0.06" />
        </g>
      </>}
    </svg>
  </div>;
}
