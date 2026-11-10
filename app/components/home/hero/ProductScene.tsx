'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import type { Language } from '../../../lib/locales';
import { LOGO_PATHS } from '../../product/AppShellIcons';
import { SCENE_COPY, beatIndex, type Beat, type Card, type SpaceIcon, type Status, type Tone } from './scenarios';
import styles from './ProductScene.module.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/*
 * The Whagons interface the mosaic turns into: one continuous scene the size of
 * the whole mosaic. Every frame is a function of (scenario, beat, typed), so
 * the tile backs can show still slices of the exact frame the live scene starts
 * or ends on. Motion between beats is CSS transitions.
 *
 * Wide containers show the board with the sidebar and the assignee's phone;
 * narrow ones show the app's phone list, as Whagons does on a small screen.
 */

export interface SceneFrame { scenario: number; beat: Beat; typed: number }

interface Props {
  lang: Language;
  frame: SceneFrame;
  /** The live scene animates; still copies render the same frame without motion. */
  live?: boolean;
  /** Increment to play the "everything is connected" pulse. */
  pulse?: number;
}

const STATUS_ORDER: Status[] = ['todo', 'doing', 'done'];

export default function ProductScene({ lang, frame, live = false, pulse = 0 }: Props) {
  const copy = SCENE_COPY[lang];
  const t = copy.ui;
  const scenario = copy.scenarios[frame.scenario % copy.scenarios.length];
  const space = copy.spaces[scenario.space];
  const b = beatIndex(frame.beat);
  const at = (beat: Beat) => b >= beatIndex(beat);

  const panelOpen = at('panel') && !at('created');
  const created = at('created');
  const taskStatus: Status = at('complete') ? 'done' : at('start') ? 'doing' : 'todo';
  const phoneIn = at('notify') && !at('settle');
  const checks = [at('check1'), at('check2'), at('check3')];
  const evidence = at('evidence');
  const pressed = frame.beat === 'pressCreate' ? 'create' : frame.beat === 'pressSubmit' ? 'submit' : undefined;
  const cursor = !at('cursor') ? 'off' : at('created') ? 'gone' : at('cursorSubmit') ? 'submit' : 'create';
  const typed = scenario.task.title.slice(0, at('spot') ? scenario.task.title.length : frame.typed);

  const kpis = [
    scenario.kpis.total + (created ? 1 : 0),
    scenario.kpis.doing + (created && taskStatus === 'doing' ? 1 : 0),
    scenario.kpis.doneToday + (created && taskStatus === 'done' ? 1 : 0),
    scenario.kpis.overdue,
  ];

  const newCard: Card | null = created ? {
    id: scenario.task.id, title: scenario.task.title, spot: scenario.task.spot, status: taskStatus,
    priority: scenario.task.high ? 'high' : 'normal', who: scenario.task.who, tone: scenario.task.tone,
  } : null;
  const cards = newCard ? [newCard, ...scenario.cards] : scenario.cards;
  const rowOf = new Map<number, number>();
  for (const status of STATUS_ORDER) cards.filter(c => c.status === status).forEach((c, i) => rowOf.set(c.id, i));
  const counts = STATUS_ORDER.map(status => cards.filter(c => c.status === status).length);

  const rootRef = useRef<HTMLDivElement>(null);
  const links = usePulse(rootRef, pulse, live);

  return <div
    ref={rootRef}
    className={styles.scene}
    data-live={live || undefined}
    data-beat={frame.beat}
    data-cursor={cursor}
    data-panel={panelOpen || undefined}
    data-phone={phoneIn || undefined}
    aria-hidden="true"
  >
    {/* ── Sidebar ─────────────────────────── */}
    <aside className={styles.sidebar}>
      <svg className={styles.logo} viewBox="33 133 1928 272">{LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}</svg>
      <p className={styles.sideTitle}>{t.spacesTitle}</p>
      <ul className={styles.spaces}>
        {copy.spaces.map((s, i) => <li key={s.name} data-active={i === scenario.space || undefined} data-anchor={i === scenario.space ? 'space' : undefined}>
          <span className={styles.spaceIcon} data-tone={s.tone}><SpaceGlyph icon={s.icon} /></span>
          <span className={styles.spaceName}>{s.name}</span>
          <span className={styles.spaceCount}>{s.count + (i === scenario.space && created && taskStatus !== 'done' ? 1 : 0)}</span>
        </li>)}
      </ul>
    </aside>

    {/* ── Workspace header ─────────────────── */}
    <header className={styles.header}>
      <span className={styles.headIcon} data-tone={space.tone}><SpaceGlyph icon={space.icon} /></span>
      <strong className={styles.headTitle}>{space.name}</strong>
      <span className={styles.tabs}><span>{t.tasks}</span><span data-active="">Kanban</span></span>
      <span className={styles.search}><Icon d="search" /><span>{t.search}</span></span>
      <span className={styles.create} data-pressed={pressed === 'create' || undefined}><Icon d="plus" />{t.create}</span>
      <span className={styles.me}>AS</span>
    </header>

    {/* ── KPI cards ───────────────────────── */}
    <div className={styles.kpis} data-anchor="kpi">
      {kpis.map((value, i) => <div key={i} className={styles.kpi} data-kpi={i}>
        <span className={styles.kpiIcon}><Icon d={(['grid', 'activity', 'check', 'clock'] as const)[i]} /></span>
        <span className={styles.kpiText}><span>{t.kpis[i]}</span><b key={value} className={styles.tick}>{value}</b></span>
      </div>)}
    </div>

    {/* ── Board ───────────────────────────── */}
    <div className={styles.board}>
      {STATUS_ORDER.map((status, i) => <div key={status} className={styles.col} data-status={status}>
        <div className={styles.colHead}><i />{t.statuses[status]}<span key={counts[i]} className={styles.tick}>{counts[i]}</span></div>
      </div>)}
      <div className={styles.cards}>
        {cards.map((c, i) => <div
          key={c.id}
          className={styles.card}
          data-status={c.status}
          data-new={c === newCard || undefined}
          data-anchor={c === newCard ? 'task' : undefined}
          style={{ '--col': STATUS_ORDER.indexOf(c.status), '--row': rowOf.get(c.id), '--li': i } as CSSProperties}
        >
          <span className={styles.cardTop}>
            <span className={styles.cardId}>#{c.id}</span>
            {c.priority === 'high' && <span className={styles.badge}>{t.high}</span>}
            {c === newCard && <span className={styles.due}><Icon d="calendar" />{scenario.task.due}</span>}
          </span>
          <span className={styles.cardTitle}>{c.title}</span>
          <span className={styles.cardSpot}><Icon d="pin" />{c.spot}</span>
          <span className={styles.cardFoot}>
            {c === newCard && evidence && <span className={styles.proof}><Icon d="check" />3/3{scenario.evidence === 'photo' ? <Icon d="camera" /> : <Icon d="pen" />}</span>}
            <span className={styles.pill} data-status={c.status}>{t.statuses[c.status]}</span>
            <span className={styles.avatar} data-tone={c.tone}>{c.who}</span>
          </span>
        </div>)}
      </div>
    </div>

    {/* ── Create task panel ───────────────── */}
    <div className={styles.scrim} />
    <section className={styles.panel}>
      <p className={styles.panelTitle}>{t.panelTitle}</p>
      <label className={styles.field}><span>{t.name}</span><span className={styles.input} data-focus={at('typing') && !at('spot') || undefined} data-filled={typed.length > 0 || undefined}>{typed || '—'}<i className={styles.caret} /></span></label>
      <label className={styles.field}><span>{t.spot}</span><span className={styles.input} data-filled={at('spot') || undefined}><Icon d="pin" />{at('spot') ? scenario.task.spot : '—'}</span></label>
      <div className={styles.fieldRow}>
        <label className={styles.field}><span>{t.assignees}</span><span className={styles.input} data-filled={at('assignee') || undefined}>{at('assignee') ? <><span className={styles.avatar} data-tone={scenario.task.tone}>{scenario.task.who}</span>{scenario.task.whoFull}</> : '—'}</span></label>
        <label className={styles.field}><span>{t.priority}</span><span className={styles.input} data-filled={at('priority') || undefined}>{at('priority') ? <span className={styles.badge} data-plain={!scenario.task.high || undefined}>{scenario.task.priority}</span> : '—'}</span></label>
      </div>
      <label className={styles.field}><span>{t.due}</span><span className={styles.input} data-filled={at('priority') || undefined}><Icon d="calendar" />{at('priority') ? scenario.task.due : '—'}</span></label>
      <label className={styles.field}><span>{t.attachments}</span><span className={styles.drop}>{t.drop}</span></label>
      <div className={styles.panelActions}><span>{t.cancel}</span><span className={styles.submit} data-pressed={pressed === 'submit' || undefined}>{t.create}</span></div>
    </section>

    {/* ── The assignee's phone ────────────── */}
    <div className={styles.phone} data-anchor="phone">
      <div className={styles.phoneScreen}>
        <span className={styles.phoneBar}><b>9:41</b><i /></span>
        <div className={styles.notice}><span className={styles.noticeLogo}><svg viewBox="33 133 1928 272">{LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}</svg></span><span><b>{t.notifyTitle}</b>{scenario.task.title}</span><em>{t.now}</em></div>
        <div className={styles.phoneTask}>
          <span className={styles.phoneId}>#{scenario.task.id}</span>
          <b className={styles.phoneTitle}>{scenario.task.title}</b>
          <span className={styles.phoneSpot}><Icon d="pin" />{scenario.task.spot}</span>
          <span className={styles.pill} data-status={taskStatus}>{t.statuses[taskStatus]}</span>
          <p className={styles.phoneLabel}>{t.checklist}</p>
          <ul className={styles.checklist}>{scenario.checklist.map((item, i) => <li key={item} data-done={checks[i] || undefined}><i><Icon d="check" /></i>{item}</li>)}</ul>
          <div className={styles.evidence} data-on={evidence || undefined}>
            {scenario.evidence === 'photo' && scenario.evidencePhoto
              ? <span className={styles.thumb} style={{ backgroundImage: `url(${scenario.evidencePhoto})` }} />
              : <svg className={styles.signature} viewBox="0 0 120 40"><path d="M4 28c10-14 18-22 22-18s-8 20-2 20 14-24 20-22-6 18 0 18 10-12 16-14 4 10 10 10 12-8 18-12 8 6 14 4 8-6 14-8" /></svg>}
            <span>{scenario.evidence === 'photo' ? t.photo : t.signature}</span>
          </div>
          <span className={styles.phoneButton} data-state={taskStatus} data-tap={frame.beat === 'start' || frame.beat === 'complete' || undefined}>
            {taskStatus === 'todo' ? t.start : taskStatus === 'doing' ? t.complete : <><Icon d="check" />{t.completed}</>}
          </span>
        </div>
      </div>
    </div>

    {/* Narrow layouts: the notification arrives as a toast. */}
    <div className={styles.toast}><Icon d="bell" /><span><b>{t.notifyTitle}</b>{scenario.task.whoFull} · {scenario.task.title}</span></div>

    <span className={styles.cursor}><svg viewBox="0 0 24 24"><path d="M5 3.2v15.6l4.3-4.1 2.7 6.1 2.6-1.2-2.7-6h6.2z" /></svg></span>
    <span className={styles.sample}>{t.sample}</span>

    {live && links && <svg key={pulse} className={styles.links} viewBox={`0 0 ${links.w} ${links.h}`} preserveAspectRatio="none">
      {links.paths.map((d, i) => <path key={i} d={d} pathLength={1} style={{ '--i': i } as CSSProperties} />)}
      {links.points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" style={{ '--i': i } as CSSProperties} />)}
    </svg>}
  </div>;
}

/** Curves between the team's space, the task, the assignee's phone and the KPI cards, measured when a pulse plays. */
function usePulse(rootRef: RefObject<HTMLDivElement>, pulse: number, live: boolean) {
  const [links, setLinks] = useState<{ w: number; h: number; paths: string[]; points: [number, number][] } | null>(null);
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!live || !pulse || !root) return;
    const box = root.getBoundingClientRect();
    const centre = (name: string): [number, number] | null => {
      const el = root.querySelector<HTMLElement>(`[data-anchor="${name}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (!r.width || getComputedStyle(el).visibility === 'hidden' || getComputedStyle(el).opacity === '0') return null;
      return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2];
    };
    const points = ['space', 'task', 'phone', 'kpi'].map(centre).filter((p): p is [number, number] => !!p);
    const paths: string[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      const mx = (x1 + x2) / 2;
      paths.push(`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`);
    }
    setLinks({ w: box.width, h: box.height, paths, points });
  }, [pulse, live, rootRef]);
  return links;
}

const TONES: Record<Tone, string> = { blue: '#2563eb', violet: '#8b5cf6', amber: '#f59e0b', teal: '#0d9488', pink: '#ec4899', green: '#16a34a', orange: '#ea580c' };
export const toneColor = (tone: Tone) => TONES[tone];

function SpaceGlyph({ icon }: { icon: SpaceIcon }) {
  const paths: Record<SpaceIcon, ReactNode> = {
    wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
    sparkles: <><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z" /><path d="M20 3v4M22 5h-4" /></>,
    truck: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>,
    package: <><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12M3.3 7l8.7 5 8.7-5M7.5 4.27l9 5.15" /></>,
    clipboard: <><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></>,
    store: <><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-2 1 2 2 0 0 1-2-2V7" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[icon]}</svg>;
}

type IconName = 'search' | 'plus' | 'grid' | 'activity' | 'check' | 'clock' | 'calendar' | 'pin' | 'camera' | 'pen' | 'bell';
function Icon({ d }: { d: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    plus: <path d="M5 12h14M12 5v14" />,
    grid: <><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></>,
    activity: <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />,
    check: <path d="M20 6 9 17l-5-5" />,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    calendar: <><path d="M8 2v4M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>,
    pin: <><path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>,
    camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>,
    pen: <><path d="M12 20h9" /><path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  };
  return <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[d]}</svg>;
}

