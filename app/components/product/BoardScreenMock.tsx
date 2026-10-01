'use client';

import AppShell from './AppShell';
import KanbanBoard from './KanbanBoard';

/** The maintenance space on its Kanban tab: the app shell with the board in its content area. */
export default function BoardScreenMock({ lang, label }: { lang: string; label?: string }) {
  return <AppShell lang={lang} space="maintenance" tab="board" aria-label={label}>
    <KanbanBoard lang={lang} label={label} />
  </AppShell>;
}
