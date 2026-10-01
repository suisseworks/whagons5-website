'use client';

import { useRef, type CSSProperties } from 'react';
import { appFont } from './appFont';
import styles from './Kanban.module.css';
import { KanbanColumn, LAYOUT_FINAL, LAYOUT_START, copy, toLang, useKanbanMotion, type StatusKey } from './KanbanParts';

/*
 * Close-up of the maintenance board's columns, rebuilt in HTML so it stays
 * sharp. Same columns and cards as the full KanbanBoard, shown slightly larger
 * than 1:1 and reflowed to the space it gets:
 *   ≥ 780px: To do, In progress, In review
 *   440–779px: To do, In progress
 *   < 440px: In progress
 * Its height follows the content (about 0.85× its width at 514px).
 */

const ORDER: StatusKey[] = ['todo', 'doing', 'review'];

export interface KanbanCloseUpProps {
  lang: string;
  className?: string;
  style?: CSSProperties;
  /** Accessible description of the board; defaults to a short built-in one. */
  label?: string;
}

export function KanbanCloseUp({ lang, className, style, label }: KanbanCloseUpProps) {
  const l = toLang(lang);
  const t = copy[l];
  const rootRef = useRef<HTMLDivElement>(null);
  const { phase, moved, lifted } = useKanbanMotion(rootRef);
  const layout = moved ? LAYOUT_FINAL : LAYOUT_START;

  return <div
    ref={rootRef}
    className={`${styles.root} ${styles.closeUp} ${appFont.className}${className ? ` ${className}` : ''}`}
    style={style}
    data-phase={phase}
    role="img"
    aria-label={label ?? t.label}
  >
    <div className={styles.closeGrid}>
      {ORDER.map((status, i) => <KanbanColumn key={status} lang={l} status={status} ids={layout[status]} index={i} lifted={lifted} ghost={status === 'doing'} />)}
    </div>
  </div>;
}

export default KanbanCloseUp;
