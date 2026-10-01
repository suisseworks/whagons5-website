'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import styles from './Kanban.module.css';

/*
 * Shared pieces of the Whagons Kanban replica: the Hotel Premium maintenance
 * board's data, the column and card markup (from the app's KanbanColumn,
 * DraggableCard and KanbanCardContent) and the scroll-triggered motion.
 */

export type Lang = 'es' | 'en';
export type StatusKey = 'todo' | 'doing' | 'review' | 'hold' | 'done';
type Priority = 'normal' | 'high' | 'low';

export const toLang = (lang: string): Lang => lang === 'en' ? 'en' : 'es';

export const copy = {
  en: {
    statuses: { todo: 'To do', doing: 'In progress', review: 'In review', hold: 'On hold', done: 'Done' },
    priorities: { normal: 'Normal', high: 'High', low: 'Low' },
    today: 'Today', compact: 'Compact', compactView: 'Compact view', fullscreen: 'Fullscreen', sort: 'Sort cards', seen: 'Seen by team',
    noTasksYet: 'No tasks yet', dragHere: 'Drag tasks here',
    label: 'Whagons Kanban board for a maintenance team with tasks to do, in progress and in review',
  },
  es: {
    statuses: { todo: 'Por hacer', doing: 'En progreso', review: 'En revisión', hold: 'En espera', done: 'Completado' },
    priorities: { normal: 'Normal', high: 'Alta', low: 'Baja' },
    today: 'Hoy', compact: 'Compacto', compactView: 'Vista compacta', fullscreen: 'Pantalla completa', sort: 'Ordenar tarjetas', seen: 'Visto por el equipo',
    noTasksYet: 'Aún no hay tareas', dragHere: 'Arrastra tareas aquí',
    label: 'Tablero Kanban de mantenimiento con tareas por hacer, en progreso y en revisión',
  },
} satisfies Record<Lang, unknown>;

// The Hotel Premium demo tenant's workspace statuses.
export const STATUS_COLORS: Record<StatusKey, string> = {
  todo: '#64748b', doing: '#3b82f6', review: '#8b5cf6', hold: '#f59e0b', done: '#10b981',
};

interface CardData {
  id: number;
  priority: Priority;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
  /** null = due today; otherwise a past due date (completed history tasks). */
  due: Record<Lang, string> | null;
  seen?: boolean;
}

// The app strips the description's HTML, so its two paragraphs run together.
const tail = { en: 'Coordinate with maintenance, verify the result and record evidence.', es: 'Coordinar con mantenimiento, verificar el resultado y registrar evidencia.' };
const card = (id: number, priority: Priority, en: string, enWhere: string, es: string, esDesc: string, extra: Partial<CardData> = {}): CardData => ({
  id, priority, due: null,
  title: { en, es },
  desc: { en: `${en}${enWhere}.${tail.en}`, es: `${esDesc}.${tail.es}` },
  ...extra,
});

export const CARDS: Record<number, CardData> = Object.fromEntries([
  card(1022, 'normal', 'Clean air filters', ' · Main building · Floor 2', 'Limpiar filtros de aire', 'Limpiar filtros de aire · Piso 2', { seen: true }),
  card(1018, 'low', 'Fix leaking sink', ' · Room 105', 'Reparar goteo en lavamanos', 'Reparar goteo en lavamanos · Habitación 105'),
  card(1024, 'normal', 'Inspect laundry dryer', ' · Room 108', 'Revisar secadora', 'Revisar secadora de lavandería'),
  card(1020, 'normal', 'Replace walkway light', ' · Room 104', 'Cambiar luminaria', 'Cambiar luminaria del sendero'),
  card(1017, 'high', 'Noisy air conditioner', ' · Room 203', 'Aire acondicionado con ruido', 'Aire acondicionado con ruido · Habitación 203'),
  card(1019, 'normal', 'Preventive pump inspection', ' · Room 103', 'Revisión preventiva de bomba', 'Revisión preventiva de bomba de piscina'),
  card(1021, 'normal', 'Adjust door lock', ' · Room 302', 'Ajustar cerradura', 'Ajustar cerradura · Habitación 302'),
  card(1016, 'normal', 'Inspect laundry dryer', ' · Room 108', 'Revisar secadora', 'Revisar secadora de lavandería', { due: { en: 'Sep 30', es: '30 sept' } }),
  card(1015, 'normal', 'Check hot water pressure', ' · Room 210', 'Verificar presión de agua caliente', 'Verificar presión de agua caliente · Habitación 210', { due: { en: 'Sep 30', es: '30 sept' } }),
  card(1013, 'normal', 'Clean air filters', ' · Main building · Floor 1', 'Limpiar filtros de aire', 'Limpiar filtros de aire · Piso 1', { due: { en: 'Sep 29', es: '29 sept' } }),
  card(1012, 'normal', 'Adjust door lock', ' · Room 214', 'Ajustar cerradura', 'Ajustar cerradura · Habitación 214', { due: { en: 'Sep 28', es: '28 sept' } }),
  card(1011, 'normal', 'Replace walkway light', ' · Garden path', 'Cambiar luminaria', 'Cambiar luminaria del jardín', { due: { en: 'Sep 27', es: '27 sept' } }),
].map(c => [c.id, c]));

/** The card that travels from "To do" to "In progress" when the board comes into view. */
export const MOVER = 1020;

// Final layout (what the server renders and the screenshot shows), and the
// layout just before the mover is picked up. Columns keep the app's default
// order: newest task first.
export const LAYOUT_FINAL: Record<StatusKey, number[]> = {
  todo: [1022, 1018], doing: [1024, 1020, 1017], review: [1019], hold: [1021], done: [1016, 1015, 1013, 1012, 1011],
};
export const LAYOUT_START: Record<StatusKey, number[]> = {
  ...LAYOUT_FINAL, todo: [1022, 1020, 1018], doing: [1024, 1017],
};

export type Phase = 'static' | 'armed' | 'live';

const EASE = 'cubic-bezier(.22, .8, .24, 1)';
const LIFT_AT = 1700;
const MOVE_AT = 2150;
const FLIGHT = 650;

/**
 * static: final board (server render, reduced motion, already on screen at load).
 * armed: the mover still sits in "To do" and the cards wait, hidden, to be scrolled to.
 * live: the cards settle in, then the mover is lifted and glides to "In progress";
 * the other cards make room (FLIP) and the column counts roll.
 */
export function useKanbanMotion(rootRef: RefObject<HTMLElement>) {
  const [phase, setPhase] = useState<Phase>('static');
  const [moved, setMoved] = useState(true);
  const [lifted, setLifted] = useState(false);
  const snapshot = useRef<Map<string, DOMRect> | null>(null);
  // The card only travels when its starting column is on screen; a narrow
  // close-up that shows a single column just lets the cards settle in.
  const movable = useRef(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    const source = node.querySelector<HTMLElement>('[data-status="todo"]');
    movable.current = !!source && getComputedStyle(source).display !== 'none';
    setPhase('armed');
    if (movable.current) setMoved(false);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      setPhase('live');
    }, { threshold: 0.35 });
    io.observe(node);
    return () => io.disconnect();
  }, [rootRef]);

  useEffect(() => {
    if (phase !== 'live' || !movable.current) return;
    const timers = [
      window.setTimeout(() => setLifted(true), LIFT_AT),
      window.setTimeout(() => {
        snapshot.current = measure(rootRef.current);
        setMoved(true);
      }, MOVE_AT),
      window.setTimeout(() => setLifted(false), MOVE_AT + FLIGHT),
    ];
    return () => timers.forEach(t => window.clearTimeout(t));
  }, [phase, rootRef]);

  // FLIP: every card that changed place glides from where it was.
  useLayoutEffect(() => {
    const before = snapshot.current;
    const root = rootRef.current;
    if (!moved || !before || !root) return;
    snapshot.current = null;
    const after = measure(root);
    root.querySelectorAll<HTMLElement>('[data-card]').forEach(el => {
      const id = el.dataset.card!;
      const from = before.get(id);
      const to = after.get(id);
      if (!to || !to.width) return;
      if (!from || !from.width) {
        // Its old column is hidden at this width: it arrives from the left.
        if (id === String(MOVER)) el.animate([{ opacity: 0, transform: 'translateX(-32px)' }, { opacity: 1, transform: 'none' }], { duration: FLIGHT, easing: EASE });
        return;
      }
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: FLIGHT, easing: EASE });
    });
  }, [moved, rootRef]);

  return { phase, moved, lifted };
}

function measure(root: HTMLElement | null) {
  const rects = new Map<string, DOMRect>();
  root?.querySelectorAll<HTMLElement>('[data-card]').forEach(el => rects.set(el.dataset.card!, el.getBoundingClientRect()));
  return rects;
}

interface ColumnProps {
  lang: Lang;
  status: StatusKey;
  ids: number[];
  /** Column index, for the settle-in stagger. */
  index: number;
  lifted: boolean;
  /** Render an invisible placeholder for the mover (single-column close-up). */
  ghost?: boolean;
}

export function KanbanColumn({ lang, status, ids, index, lifted, ghost }: ColumnProps) {
  const t = copy[lang];
  const color = STATUS_COLORS[status];
  const final = status === 'done';
  const target = lifted && status === 'doing';
  const slots = ghost && !ids.includes(MOVER) ? [...ids.slice(0, 1), -MOVER, ...ids.slice(1)] : ids;
  const count = ids.length;

  return <div className={styles.col} data-status={status} data-over={target || undefined}>
    <div className={styles.colHead} style={{ borderBottomColor: `${color}4d` }}>
      <div className={styles.colTitle}>
        <span className={styles.grip}><IconGrip /></span>
        <span className={styles.dot} style={{ background: color }} />
        <h3 className={styles.colName}>{t.statuses[status]}</h3>
      </div>
      <div className={styles.colMeta}>
        <span className={styles.sort} title={t.sort}><IconSort /></span>
        <span className={styles.count}><span key={count} className={styles.tick}>{count}</span></span>
      </div>
    </div>
    <div className={styles.colBody}>
      <div className={styles.stack}>
        {slots.map((id, row) => id < 0
          ? <div key="ghost" className={styles.ghost} aria-hidden="true"><KanbanCard lang={lang} id={MOVER} /></div>
          : <div key={id} className={styles.slot} data-card={id} data-lifted={lifted && id === MOVER || undefined} data-arrived={id === MOVER && status === 'doing' || undefined} style={{ ['--i' as string]: index * 1.3 + row }}>
            <KanbanCard lang={lang} id={id} final={final} />
          </div>)}
        {!slots.length && <div className={styles.empty}>
          <IconInbox />
          <p>{t.noTasksYet}</p>
          <span>{t.dragHere}</span>
        </div>}
      </div>
    </div>
  </div>;
}

export function KanbanCard({ lang, id, final }: { lang: Lang; id: number; final?: boolean }) {
  const t = copy[lang];
  const c = CARDS[id];
  return <div className={styles.card} data-final={final || undefined}>
    <span className={styles.stripe} data-priority={c.priority} />
    <div className={styles.cardBody}>
      <div className={styles.top}>
        <div className={styles.topLeft}>
          {c.priority !== 'low' && <span className={styles.badge} data-priority={c.priority}>{t.priorities[c.priority]}</span>}
          <span className={styles.id}>#{c.id}</span>
        </div>
        <span className={styles.due} data-overdue={c.due ? '' : undefined}><IconCalendar />{c.due ? c.due[lang] : t.today}</span>
      </div>
      <div className={styles.titleRow}>
        <h4 className={styles.title}>{c.title[lang]}</h4>
        {c.seen && <span className={styles.eye} title={t.seen}><IconEye /></span>}
      </div>
      <p className={styles.desc}>{c.desc[lang]}</p>
      <div className={styles.bottom}>
        <span className={styles.avatar}>M</span>
      </div>
    </div>
  </div>;
}

// lucide-react icons, same paths as the app.
const svg = (children: ReactNode) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
const IconGrip = () => svg(<><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></>);
const IconSort = () => svg(<><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></>);
const IconCalendar = () => svg(<><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>);
const IconEye = () => svg(<><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></>);
const IconInbox = () => svg(<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>);
export const IconList = () => svg(<><path d="M3 12h.01" /><path d="M3 18h.01" /><path d="M3 6h.01" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M8 6h13" /></>);
export const IconMaximize = () => svg(<><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" /></>);
