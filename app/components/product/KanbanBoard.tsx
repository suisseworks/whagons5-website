'use client';

import { useRef, type CSSProperties } from 'react';
import { appFont } from './appFont';
import styles from './Kanban.module.css';
import { IconList, IconMaximize, KanbanColumn, LAYOUT_FINAL, LAYOUT_START, copy, toLang, useKanbanMotion, type StatusKey } from './KanbanParts';

/*
 * The Kanban view of the Hotel Premium maintenance workspace, rebuilt in HTML:
 * the board area only (the toolbar with Compact / Fullscreen and the columns),
 * as the app's KanbanBoard renders it below the workspace header and tabs.
 *
 * It fills its parent. Columns keep the app's 256px minimum width, so a narrow
 * area shows fewer of them and the last one is cut off at the edge, as in the app.
 */

const ORDER: StatusKey[] = ['todo', 'doing', 'review', 'hold', 'done'];

export interface KanbanBoardProps {
  lang: string;
  className?: string;
  style?: CSSProperties;
  /** Accessible description of the board; defaults to a short built-in one. */
  label?: string;
}

export function KanbanBoard({ lang, className, style, label }: KanbanBoardProps) {
  const l = toLang(lang);
  const t = copy[l];
  const rootRef = useRef<HTMLDivElement>(null);
  const { phase, moved, lifted } = useKanbanMotion(rootRef);
  const layout = moved ? LAYOUT_FINAL : LAYOUT_START;

  return <div
    ref={rootRef}
    className={`${styles.root} ${styles.board} ${appFont.className}${className ? ` ${className}` : ''}`}
    style={style}
    data-phase={phase}
    role="img"
    aria-label={label ?? t.label}
  >
    <div className={styles.toolbar}>
      <span className={styles.toolBtn} title={t.compactView}><IconList />{t.compact}</span>
      <span className={styles.toolBtn} title={t.fullscreen}><IconMaximize /></span>
    </div>
    <div className={styles.lanes}>
      {ORDER.map((status, i) => <KanbanColumn key={status} lang={l} status={status} ids={layout[status]} index={i} lifted={lifted} />)}
    </div>
  </div>;
}

export default KanbanBoard;
