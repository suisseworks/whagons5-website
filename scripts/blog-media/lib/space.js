// A workspace frame with the KPI strip on top and a task grid below, used by
// the KPI card scenes. KPI cards follow the app: tinted icon tile, label,
// big number, optional sparkline or donut.
import { avatar, el, pill } from './kit.js';

const css = `
.kpi2 { position: absolute; top: 0; height: 58px; display: flex; align-items: center; gap: 9px; padding: 0 10px; border-radius: 12px; background: #fff; border: 1px solid rgba(22,21,19,.09); box-shadow: 0 1px 2px rgba(60,44,22,.05), 0 6px 16px rgba(60,44,22,.06); overflow: hidden; }
.kpi2 .ki { display: grid; place-items: center; flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px; font-size: 13px; }
.kpi2 .kl { font-size: 10px; font-weight: 500; color: var(--ink-3); white-space: nowrap; }
.kpi2 .kv { font-size: 20px; font-weight: 600; letter-spacing: -.02em; line-height: 1.15; font-variant-numeric: tabular-nums; }
.kpi2.sel { box-shadow: 0 0 0 2px var(--ink), 0 6px 18px rgba(22,21,19,.14); }
.kpi2.lift { box-shadow: 0 18px 34px rgba(22,21,19,.22); }
.kpi-slot { position: absolute; top: 0; height: 58px; border-radius: 12px; border: 1.5px dashed rgba(22,21,19,.18); display: grid; place-items: center; font-size: 11.5px; font-weight: 600; color: var(--ink-3); }
.due-late { color: var(--late); font-weight: 600; }
.kpi-fade { position: absolute; top: -2px; bottom: -2px; right: 0; width: 70px; background: linear-gradient(90deg, rgba(255,255,255,0), #fff 70%); pointer-events: none; }
.kpi-chev { position: absolute; top: 17px; right: 2px; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 1px solid var(--line-2); display: grid; place-items: center; font-size: 12px; color: var(--ink-2); box-shadow: 0 2px 6px rgba(0,0,0,.08); }
`;

let injected = false;
function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

export const KPI_TONES = {
  blue: { bg: '#eff6ff', fg: '#2563eb' },
  amber: { bg: '#fffbeb', fg: '#d97706' },
  green: { bg: '#ecfdf5', fg: '#059669' },
  rose: { bg: '#fff1f2', fg: '#e11d48' },
  indigo: { bg: '#eef2ff', fg: '#4f46e5' },
  purple: { bg: '#faf5ff', fg: '#9333ea' },
};

/** KPI card; returns { node, value, extra }. */
export function kpiCard(parent, { x, w, label, icon, tone, value = '0', spark = false, donut = false }) {
  inject();
  const node = el('div', 'kpi2', parent);
  node.style.left = `${x}px`;
  node.style.top = '2px';
  node.style.width = `${w}px`;
  const t = KPI_TONES[tone];
  const ico = el('span', 'ki', node);
  if (icon.startsWith('<svg')) ico.innerHTML = icon; else ico.textContent = icon;
  ico.style.background = t.bg;
  ico.style.color = t.fg;
  const text = el('div', '', node);
  text.style.cssText = 'display:grid;min-width:0';
  el('span', 'kl', text, label);
  const val = el('span', 'kv', text, value);
  let extra = null;
  if (spark) {
    extra = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    extra.setAttribute('viewBox', '0 0 60 24');
    extra.setAttribute('width', '46');
    extra.setAttribute('height', '20');
    extra.style.marginLeft = 'auto';
    extra.innerHTML = `<path d="M1 20 L10 17 L19 18 L28 12 L37 13 L46 7 L58 3" fill="none" stroke="${t.fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`;
    node.appendChild(extra);
  }
  if (donut) {
    extra = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    extra.setAttribute('viewBox', '0 0 36 36');
    extra.setAttribute('width', '32');
    extra.setAttribute('height', '32');
    extra.style.marginLeft = 'auto';
    const arcs = [['#5b6068', 0.4], ['#2563eb', 0.25], ['#7c3aed', 0.1], ['#16a34a', 0.25]];
    let offset = 0;
    extra.innerHTML = arcs.map(([color, part]) => {
      const seg = `<circle cx="18" cy="18" r="14" fill="none" stroke="${color}" stroke-width="6" pathLength="100" stroke-dasharray="${part * 100 - 1.5} ${100 - part * 100 + 1.5}" stroke-dashoffset="${-offset * 100}" transform="rotate(-90 18 18)" data-part="${part}"/>`;
      offset += part;
      return seg;
    }).join('');
    node.appendChild(extra);
  }
  return { node, value: val, extra };
}

/** Progress (0..1) for a sparkline or donut built by kpiCard. */
export function drawExtra(extra, p) {
  if (!extra) return;
  const path = extra.querySelector('path');
  if (path) path.setAttribute('stroke-dashoffset', String(1 - p));
  extra.querySelectorAll('circle').forEach((c) => { c.style.opacity = String(p); });
  if (!path) extra.style.transform = `rotate(${(1 - p) * -90}deg)`;
}

/** Task grid rows. tasks: [{ name, spot, status, tone, due, late, who, whoTone }] */
export function taskRows(parent, tasks, labels = [], cols = '1.6fr 0.8fr 0.8fr 0.7fr') {
  const head = el('div', 'grid-hd', parent);
  head.style.gridTemplateColumns = cols;
  labels.forEach((label) => el('span', '', head, label));
  return { head, rows: tasks.map((task) => {
    const row = el('div', 'trow', parent);
    row.style.gridTemplateColumns = cols;
    const name = el('span', 'name', row);
    el('span', 'tico', name, '✓');
    el('span', '', name, task.name);
    el('span', 'spot', row, task.spot);
    const st = el('span', '', row);
    pill(st, task.status, task.tone);
    const due = el('span', '', row);
    due.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11px;color:var(--ink-3)';
    const d = el('span', task.late ? 'due-late' : '', due, task.due);
    avatar(due, task.who, task.whoTone);
    return { row, due: d, late: task.late };
  }) };
}

/** Right-edge fade + chevron: the app's strip scrolls when cards overflow. */
export function stripEdge(strip) {
  inject();
  el('div', 'kpi-fade', strip);
  el('div', 'kpi-chev', strip, '›');
}

export const ARC = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9"/></svg>';
export const PIE = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/></svg>';

/** Standard six cards of the Overview Dashboard template. */
export function overviewCards(strip, labels, { values = ['48', '12', '9', '3', '+18%', ''], gap = 8 } = {}) {
  const widths = [116, 120, 136, 110, 146, 118];
  const icons = ['#', ARC, '✓', '!', '↗', PIE];
  const tones = ['blue', 'amber', 'green', 'rose', 'indigo', 'purple'];
  let x = 0;
  return labels.map((label, i) => {
    const card = kpiCard(strip, { x, w: widths[i], label, icon: icons[i], tone: tones[i], spark: i === 4, donut: i === 5, value: values[i] });
    card.x = x;
    card.w = widths[i];
    x += widths[i] + gap;
    return card;
  });
}
