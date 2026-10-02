// Shared pieces for the task scenes (first-day and approvals): a space frame
// with a sidebar, a task grid whose rows can be added and changed in place, the
// approval badge that sits next to a task's status, popovers, a side sheet,
// a toast and a little photo thumbnail. Everything is plain DOM driven by the
// scene's render(t); nothing animates on its own.
import { avatar, box, el, pill } from './kit.js';

const css = `
.side { position: absolute; display: flex; flex-direction: column; gap: 2px; padding: 12px 10px; background: #f6f3ee; border-right: 1px solid var(--line); }
.side .s-brand { display: flex; align-items: center; gap: 8px; height: 26px; padding: 0 6px; margin-bottom: 8px; font-size: 12px; font-weight: 600; }
.side .s-brand i { width: 18px; height: 18px; border-radius: 5px; background: var(--red); }
.side .s-lbl { padding: 8px 8px 4px; font-family: var(--mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); }
.side .s-item { display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 8px; border-radius: 7px; font-size: 12px; color: var(--ink-2); white-space: nowrap; }
.side .s-item b { display: grid; place-items: center; width: 18px; height: 18px; border-radius: 5px; font-size: 10px; color: #fff; }
.side .s-item.on { background: #fff; color: var(--ink); font-weight: 600; box-shadow: 0 1px 2px rgba(60,44,22,.08); }

.abadge { display: inline-flex; align-items: center; gap: 3px; height: 18px; padding: 0 6px 0 3px; border-radius: 9px; font-size: 9.5px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
.abadge i { display: grid; place-items: center; width: 13px; height: 13px; border-radius: 50%; font-style: normal; font-size: 8.5px; color: #fff; }
.abadge.pending { background: #fff7ed; color: #c2410c; box-shadow: inset 0 0 0 1px rgba(234,88,12,.35); }
.abadge.pending i { background: #ea580c; }
.abadge.approved { background: #ecfdf3; color: #067647; box-shadow: inset 0 0 0 1px rgba(6,118,71,.35); }
.abadge.approved i { background: #16a34a; }
.abadge.rejected { background: #fef2f2; color: #b91c1c; box-shadow: inset 0 0 0 1px rgba(185,28,28,.35); }
.abadge.rejected i { background: #dc2626; }
.abadge.ring { box-shadow: inset 0 0 0 1px rgba(234,88,12,.35), 0 0 0 3px rgba(234,88,12,.18); }

.tagchip { display: inline-flex; align-items: center; height: 17px; padding: 0 7px; border-radius: 5px; font-size: 9.5px; font-weight: 600; background: #fef3c7; color: #92400e; white-space: nowrap; }
.num { font-family: var(--mono); font-size: 10.5px; color: var(--ink-3); }

.pop { position: absolute; background: #fff; border: 1px solid rgba(22,21,19,.1); border-radius: 12px; box-shadow: 0 2px 6px rgba(60,44,22,.08), 0 22px 48px rgba(60,44,22,.22); overflow: hidden; z-index: 30; }
.pop-hd { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--line); font-size: 12px; font-weight: 600; }
.pop-bd { padding: 10px 12px; display: grid; gap: 8px; }
.pop .who { display: flex; align-items: center; gap: 8px; font-size: 11.5px; }
.pop .who .st { margin-left: auto; font-size: 10px; font-weight: 600; color: var(--ink-3); }
.pop .acts { display: flex; gap: 6px; padding: 10px 12px; border-top: 1px solid var(--line); background: var(--paper-2); }
.btn.ok { background: #16a34a; border-color: #16a34a; color: #fff; }
.btn.no { background: #fff; border-color: rgba(220,38,38,.45); color: #b91c1c; }
.menu { position: absolute; background: #fff; border: 1px solid rgba(22,21,19,.1); border-radius: 10px; box-shadow: 0 2px 6px rgba(60,44,22,.08), 0 18px 40px rgba(60,44,22,.2); padding: 5px; z-index: 30; display: grid; gap: 2px; }
.menu .mi { display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 8px; border-radius: 6px; font-size: 11.5px; white-space: nowrap; }
.menu .mi.hover { background: var(--paper-3); }

.sheet { position: absolute; top: 0; bottom: 0; right: 0; background: #fff; border-left: 1px solid rgba(22,21,19,.1); box-shadow: -18px 0 48px rgba(60,44,22,.18); z-index: 40; display: flex; flex-direction: column; }
.sheet-hd { display: flex; align-items: center; height: 44px; padding: 0 16px; border-bottom: 1px solid var(--line); font-size: 14px; font-weight: 600; letter-spacing: -.01em; }
.sheet-bd { flex: 1; padding: 14px 16px; display: grid; gap: 12px; align-content: start; }
.sheet-ft { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--line); }
.drop { display: grid; place-items: center; height: 64px; border: 1.5px dashed rgba(22,21,19,.22); border-radius: 10px; font-size: 11px; color: var(--ink-3); }
.drop.hot { border-color: var(--red); background: var(--red-soft); color: var(--red); }

.toast { position: absolute; display: flex; align-items: center; gap: 10px; padding: 10px 14px 10px 10px; border-radius: 12px; background: #fff; border: 1px solid rgba(22,21,19,.1); box-shadow: 0 2px 6px rgba(60,44,22,.08), 0 18px 40px rgba(60,44,22,.22); z-index: 60; }
.toast .t-ico { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; font-size: 13px; }
.toast .t-title { font-size: 11.5px; font-weight: 700; }
.toast .t-sub { font-size: 11px; color: var(--ink-3); white-space: nowrap; }

.photo { position: relative; overflow: hidden; border-radius: 7px; background: linear-gradient(160deg, #d9e6ef 0%, #b7c9d6 55%, #9fb3c2 100%); }
.photo svg { position: absolute; inset: 0; width: 100%; height: 100%; }
`;

let injected = false;
export function injectTasksCss() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

const TAP = '<svg viewBox="0 0 60 44" preserveAspectRatio="xMidYMid slice"><rect x="0" y="31" width="60" height="13" fill="#e9eef2"/><rect x="0" y="30" width="60" height="2" fill="#c3cfd8"/><path d="M14 13h20a4 4 0 0 1 4 4v3h-6v-1H18a4 4 0 0 1-4-4z" fill="#8a99a6"/><rect x="21" y="7" width="6" height="7" rx="1.5" fill="#7a8a97"/><rect x="17" y="5" width="14" height="3.5" rx="1.75" fill="#6b7b88"/><rect x="31" y="19" width="7" height="4" rx="1" fill="#7a8a97"/><path d="M34.5 25.5c1.6 2.3 2.4 3.8 2.4 4.9a2.4 2.4 0 1 1-4.8 0c0-1.1.8-2.6 2.4-4.9z" fill="#3b82f6" opacity=".85"/></svg>';

/** A small "photo" of a dripping tap, drawn in SVG so it stays sharp and needs no assets. */
export function photo(parent, w = 60, h = 44) {
  const node = el('div', 'photo', parent);
  node.style.width = `${w}px`;
  node.style.height = `${h}px`;
  node.innerHTML = TAP;
  return node;
}

/** Sidebar listing spaces. Returns { node, items }. */
export function sidebar(stage, { x, y, w, h, brand, label, spaces, everything }) {
  injectTasksCss();
  const node = box(stage, 'side', x, y, w, h);
  const top = el('div', 's-brand', node);
  el('i', '', top);
  el('span', '', top, brand);
  const all = el('div', 's-item', node);
  el('b', '', all, '∗').style.background = '#78756d';
  el('span', '', all, everything);
  el('div', 's-lbl', node, label);
  const colors = ['#2563eb', '#0d9488', '#9333ea', '#d97706'];
  const items = spaces.map((name, i) => {
    const item = el('div', 's-item', node);
    el('b', '', item, name.slice(0, 1)).style.background = colors[i % colors.length];
    el('span', '', item, name);
    return item;
  });
  return { node, items, all };
}

/** Approval badge next to a task's status: state is 'pending' | 'approved' | 'rejected'. */
export function approvalBadge(parent) {
  injectTasksCss();
  const node = el('span', 'abadge pending', parent);
  const icon = el('i', '', node, '◷');
  const text = el('span', '', node, '0/1');
  const setState = (state, label) => {
    node.className = `abadge ${state}`;
    icon.textContent = state === 'approved' ? '✓' : state === 'rejected' ? '✕' : '◷';
    text.textContent = label;
  };
  return { node, setState };
}

/**
 * Task grid inside a window. cols is a CSS grid template; rows are absolutely
 * positioned so scenes can slide them. makeRow(data) builds one row.
 */
export function taskGrid(parent, { x, y, w, h, title, icon = '✓', headers, cols, rowHeight = 36 }) {
  injectTasksCss();
  const win = box(parent, 'win', x, y, w, h);
  const hd = el('div', 'win-hd', win);
  el('span', 'ico', hd, icon);
  const titleNode = el('span', '', hd, title);
  el('span', 'sp', hd);
  const tools = el('span', '', hd);
  tools.style.cssText = 'display:flex;align-items:center;gap:6px';
  const head = el('div', 'grid-hd', win);
  head.style.gridTemplateColumns = cols;
  headers.forEach((label) => el('span', '', head, label));
  const list = el('div', '', win);
  list.style.cssText = `position:relative;height:${h - 66}px;overflow:hidden`;
  const makeRow = ({ num, name, spot, status, tone = 'todo', people = [] }) => {
    const node = el('div', 'trow', list);
    node.style.cssText = `grid-template-columns:${cols};position:absolute;left:0;right:0;top:0;height:${rowHeight}px`;
    el('span', 'num', node, num);
    const nameCell = el('span', 'name', node);
    const nameText = el('span', '', nameCell, name);
    nameText.style.cssText = 'overflow:hidden;text-overflow:ellipsis';
    const spotCell = el('span', 'spot', node, spot);
    const statusCell = el('span', '', node);
    statusCell.style.cssText = 'display:flex;align-items:center;gap:5px;min-width:0';
    const statusPill = pill(statusCell, status, tone);
    const peopleCell = el('span', '', node);
    peopleCell.style.cssText = 'display:flex;align-items:center';
    const avatars = people.map(([initials, t], i) => {
      const a = avatar(peopleCell, initials, t);
      a.style.cssText += `;width:20px;height:20px;font-size:8.5px;box-shadow:0 0 0 2px #fff;margin-left:${i ? -5 : 0}px`;
      return a;
    });
    return { node, nameCell, nameText, spotCell, statusCell, statusPill, peopleCell, avatars };
  };
  return { win, hd, tools, titleNode, head, list, makeRow };
}

/** Notification toast. */
export function toast(stage, { x, y, w, icon, iconBg, iconFg, title, sub }) {
  injectTasksCss();
  const node = box(stage, 'toast', x, y, w);
  const ico = el('span', 't-ico', node, icon);
  ico.style.background = iconBg;
  ico.style.color = iconFg;
  const text = el('div', '', node);
  text.style.cssText = 'display:grid;gap:1px;min-width:0';
  el('span', 't-title', text, title);
  el('span', 't-sub', text, sub);
  return node;
}
