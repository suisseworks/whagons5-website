'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import AppShell, { u, type ShellLang } from './AppShell';
import { Fa, FaDuo, Lucide } from './AppShellIcons';
import styles from './TaskGridMock.module.css';

/*
 * The Maintenance space's task grid from the Whagons app (Hotel Premium demo
 * tenant), rebuilt in HTML inside AppShell. Replaces
 * hotel-premium-task-grid-{en,es}.jpg at their 1512×827 design size; column
 * positions are the screenshots', so overlays positioned in percent of the
 * image still line up.
 *
 * Motion: after the KPI count-up, "Clean air filters" is picked up — its
 * status moves from To do to In progress and the In progress KPI ticks up.
 */

type Status = 'todo' | 'doing' | 'review' | 'blocked';
type Row = { name: string; desc: string; status: Status; place: string; urgent?: boolean; done?: boolean; notes?: number; watched?: boolean };

const STATUS_COLORS: Record<Status, string> = { todo: '#64748b', doing: '#3b82f6', review: '#8b5cf6', blocked: '#f59e0b' };

const copy = {
  en: {
    label: 'Whagons task grid for the Maintenance space: tasks with status, location, priority and assignee',
    head: { name: 'Name', notes: 'Notes', status: 'Status', priority: 'Priority' },
    status: { todo: 'To do', doing: 'In progress', review: 'In review', blocked: 'On hold' } as Record<Status, string>,
    normal: 'Normal', urgent: 'Urgent',
    rows: [
      { name: 'Inspect laundry dryer', desc: 'Inspect laundry dryer · Room 108. Coordinate with maintenance, verify the result and leave evidence.', status: 'doing', place: 'Room 108' },
      { name: 'Clean air filters', desc: 'Clean air filters · Main building · Floor 2. Coordinate with maintenance, verify the result.', status: 'todo', place: 'Main building · Floor 2' },
      { name: 'Adjust door lock', desc: 'Adjust door lock · Room 302. Coordinate with maintenance, verify the result.', status: 'blocked', place: 'Room 302' },
      { name: 'Replace walkway light', desc: 'Replace walkway light · Room 104. Coordinate with maintenance, verify the result.', status: 'doing', place: 'Room 104' },
      { name: 'Preventive pump inspection', desc: 'Preventive pump inspection · Room 103. Coordinate with maintenance, verify the result.', status: 'review', place: 'Room 103', done: true },
      { name: 'Fix leaking sink', desc: 'Fix leaking sink · Room 105. Coordinate with maintenance, verify the result.', status: 'todo', place: 'Room 105', urgent: true },
      { name: 'Noisy air conditioner', desc: 'Noisy air conditioner · Room 207. Coordinate with maintenance, verify the result.', status: 'doing', place: 'Room 207' },
    ] as Row[],
  },
  es: {
    label: 'Cuadrícula de tareas de Whagons para el espacio de Mantenimiento: tareas con estado, ubicación y prioridad',
    head: { name: 'Nombre', notes: 'Notas', status: 'Estado', priority: 'Prioridad' },
    status: { todo: 'Por hacer', doing: 'En progreso', review: 'En revisión', blocked: 'En espera' } as Record<Status, string>,
    normal: 'Normal', urgent: 'Urgente',
    rows: [
      { name: 'Revisar secadora', desc: 'Revisar secadora de lavandería. Coordinar con mantenimiento, verificar el resultado y dejar evidencia.', status: 'doing', place: 'Habitación 108' },
      { name: 'Limpiar filtros de aire', desc: 'Limpiar filtros de aire · Piso 2. Coordinar con mantenimiento, verificar el resultado.', status: 'todo', place: 'Edificio principal · Piso 2', watched: true },
      { name: 'Ajustar cerradura', desc: 'Ajustar cerradura · Habitación 302. Coordinar con mantenimiento, verificar el resultado.', status: 'blocked', place: 'Habitación 302' },
      { name: 'Cambiar luminaria', desc: 'Cambiar luminaria del sendero. Coordinar con mantenimiento, verificar el resultado.', status: 'doing', place: 'Habitación 104' },
      { name: 'Revisión preventiva de bomba', desc: 'Revisión preventiva de bomba de piscina. Coordinar con mantenimiento, verificar el resultado.', status: 'review', place: 'Habitación 103', done: true, notes: 1 },
      { name: 'Reparar goteo en lavamanos', desc: 'Reparar goteo en lavamanos · Habitación 105. Coordinar con mantenimiento, verificar el resultado.', status: 'todo', place: 'Habitación 105', urgent: true, notes: 1 },
      { name: 'Aire acondicionado con ruido', desc: 'Aire acondicionado con ruido · Habitación 207. Coordinar con mantenimiento.', status: 'doing', place: 'Habitación 207' },
    ] as Row[],
  },
};

/* Column x positions (design px from the table's left edge), per screenshot.
   The Spanish grid has a Notes column, which pushes the rest right. */
const COLS = {
  en: { head: { name: 69, file: 508, notes: null, status: 584, place: 805, priority: 1023, people: 1132 }, file: 525, notes: null, status: 580, pin: 804, place: 821, priority: 1020, avatar: 1133, desc: 376 },
  es: { head: { name: 68, file: 508, notes: 582, status: 642, place: 865, priority: 1082, people: null }, file: 525, notes: 591, status: 640, pin: 863, place: 880, priority: 1080, avatar: null, desc: 378 },
} as const;

/** The row that gets picked up live, and when. */
const LIVE_ROW = 1;
const LIVE_DELAY = 2200;

export default function TaskGridMock({ lang, className, label }: { lang: string; className?: string; label?: string }) {
  const l: ShellLang = lang === 'en' ? 'en' : 'es';
  const t = copy[l];
  const cols = COLS[l];
  const [revealed, setRevealed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!revealed || !visible || started) return;
    const timer = window.setTimeout(() => setStarted(true), LIVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [revealed, visible, started]);

  const rows = t.rows.map((row, i) => i === LIVE_ROW && started ? { ...row, status: 'doing' as Status } : row);

  return <AppShell
    lang={l}
    space="maintenance"
    tab="tasks"
    kpis={{ inProgress: started ? 5 : 4 }}
    onReveal={() => setRevealed(true)}
    onVisibilityChange={setVisible}
    className={className}
    aria-label={label ?? t.label}
  >
    <div className={styles.grid}>
      <div className={styles.head}>
        <span style={{ left: u(cols.head.name) }}>{t.head.name}</span>
        <Fa name="filePen" className={styles.headFile} style={{ left: u(cols.head.file) }} />
        {cols.head.notes !== null && <span style={{ left: u(cols.head.notes) }}>{t.head.notes}</span>}
        <span style={{ left: u(cols.head.status) }}>{t.head.status}</span>
        <Fa name="locationDot" className={styles.headPin} style={{ left: u(cols.head.place) }} />
        <span style={{ left: u(cols.head.priority) }}>{t.head.priority}</span>
        {cols.head.people !== null && <Fa name="users" className={styles.headPeople} style={{ left: u(cols.head.people) }} />}
      </div>

      {rows.map((row, i) => <div
        key={i}
        className={styles.row}
        data-live={i === LIVE_ROW && started || undefined}
        style={{ top: u(40 + i * 88), '--status': STATUS_COLORS[row.status] } as CSSProperties}
      >
        <span className={styles.bar} />
        <span className={styles.check} />
        <span className={styles.tile}><FaDuo name="wrench" /></span>
        <span className={styles.name}>{row.name}{row.watched && <span className={styles.watch}><Lucide strokeWidth={2.2}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></Lucide></span>}</span>
        <span className={styles.tag}><Lucide strokeWidth={2}><path d="M5 12h14" /><path d="M12 5v14" /></Lucide></span>
        <span className={styles.desc} style={{ width: u(cols.desc) }}>{row.desc}</span>
        <Fa name={row.done ? 'fileCircleCheck' : 'filePen'} className={styles.file} style={{ left: u(cols.file) }} data-done={row.done || undefined} />
        {cols.notes !== null && <span className={styles.notes} style={{ left: u(cols.notes) }} data-count={row.notes || undefined}>
          <Lucide strokeWidth={1.7}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Lucide>
          {row.notes ? <b>{row.notes}</b> : null}
        </span>}
        <span key={row.status} className={styles.status} data-status={row.status} style={{ left: u(cols.status) }}>
          {STATUS_ICONS[row.status]}{t.status[row.status]}
        </span>
        <Fa name="locationDot" className={styles.pin} style={{ left: u(cols.pin) }} />
        <span className={styles.place} style={{ left: u(cols.place) }}>{row.place}</span>
        <span className={styles.priority} data-urgent={row.urgent || undefined} style={{ left: u(cols.priority) }}><i />{row.urgent ? t.urgent : t.normal}</span>
        {cols.avatar !== null && <span className={styles.avatar} style={{ left: u(cols.avatar) }}>MV</span>}
      </div>)}
    </div>
  </AppShell>;
}

export { TaskGridMock };

const STATUS_ICONS: Record<Status, ReactNode> = {
  doing: <Lucide strokeWidth={3}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></Lucide>,
  review: <Lucide strokeWidth={3}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></Lucide>,
  todo: <Lucide strokeWidth={3.2}><path d="m9 18 6-6-6-6" /></Lucide>,
  blocked: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="3.5" height="14" rx="1" /><rect x="13.5" y="5" width="3.5" height="14" rx="1" /></svg>,
};
