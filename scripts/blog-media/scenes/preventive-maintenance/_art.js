// Shared pieces for the preventive maintenance cover and social card: a photo
// of a tidy plant room, the plan's weekly calendar (green = done, red
// triangle = late) and the generator test task the plan created today.
import { box, el } from '../../lib/kit.js';

const css = `
.pm-photo { position: absolute; border-radius: 18px; overflow: hidden; background: #d9cdb9;
  box-shadow: 0 2px 4px rgba(60,44,22,.10), 0 30px 70px rgba(60,44,22,.28); }
.pm-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.pm-photo::after { content: ''; position: absolute; inset: 0; border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
  background: linear-gradient(180deg, rgba(22,21,19,.18) 0%, rgba(22,21,19,0) 26%, rgba(22,21,19,0) 70%, rgba(22,21,19,.12) 100%); }
.pm-tag { position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px;
  border-radius: 11px; background: rgba(22,21,19,.62); backdrop-filter: blur(6px); color: #fff;
  font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.pm-tag i { width: 6px; height: 6px; border-radius: 50%; background: #ff5a36; box-shadow: 0 0 0 3px rgba(255,90,54,.25); }
.pm-card { position: absolute; z-index: 3; background: #fff; border-radius: 16px; border: 1px solid rgba(22,21,19,.06);
  box-shadow: 0 1px 2px rgba(60,44,22,.08), 0 22px 50px rgba(60,44,22,.22), 0 6px 14px rgba(60,44,22,.08); }
.pm-hd { display: flex; justify-content: space-between; align-items: center; }
.pm-range { font-family: var(--mono); font-size: 9.5px; font-weight: 600; color: var(--ink-2); background: var(--paper-3); padding: 2px 7px; border-radius: 5px; }
.pm-grid { display: grid; align-items: center; column-gap: 0; }
.pm-dayh { font-family: var(--mono); font-size: 8.5px; color: var(--ink-4); text-align: center; }
.pm-dayh.today { color: var(--red); font-weight: 700; }
.pm-name { font-size: 11px; color: var(--ink); white-space: nowrap; line-height: 1.15; }
.pm-name small { display: block; font-family: var(--mono); font-size: 8px; color: var(--ink-3); letter-spacing: .03em; margin-top: 2px; }
.pm-cell { display: grid; place-items: center; height: 30px; border-top: 1px solid var(--line); }
.pm-cell.today { background: rgba(212,49,10,.05); }
.pm-ok { width: 11px; height: 11px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px #dcfce7; }
.pm-todo { width: 9px; height: 9px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--ink-4); }
.pm-now { width: 11px; height: 11px; border-radius: 50%; box-shadow: inset 0 0 0 2px var(--red), 0 0 0 3px rgba(212,49,10,.14); }
.pm-late { width: 0; height: 0; border-left: 6.5px solid transparent; border-right: 6.5px solid transparent; border-bottom: 11px solid #dc2626; }
.pm-none { width: 6px; height: 2px; border-radius: 1px; background: var(--line-2); }
.pm-pct { font-family: var(--mono); font-size: 9.5px; font-weight: 600; color: var(--ink-2); text-align: right; }
.pm-pct.bad { color: #b42318; }
.pm-rowl { height: 30px; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid var(--line); }
.pm-task { font-size: 15px; font-weight: 600; letter-spacing: -.015em; line-height: 1.2; }
.pm-sub { margin-top: 4px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.pm-pill { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 9px 0 7px; border-radius: 11px;
  background: #fff4ed; color: #b93815; box-shadow: inset 0 0 0 1px rgba(212,49,10,.28); font-size: 10.5px; font-weight: 600; white-space: nowrap; }
.pm-pill i { width: 6px; height: 6px; border-radius: 50%; background: var(--red); }
.pm-foot { display: flex; align-items: center; justify-content: space-between; gap: 7px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.pm-foot .av { width: 18px; height: 18px; font-size: 8.5px; }
.pm-from { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px; border-radius: 7px; background: var(--ink); color: #fff; font-size: 10px; font-weight: 600; }
.pm-from svg { display: block; }
.pm-legend { display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: var(--ink-3); white-space: nowrap; }
`;

let injected = false;
export function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

const asset = '/assets/preventive-maintenance-plant.jpg';

export async function loadImages() {
  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = asset;
  });
}

export function photo(parent, { x, y, w, h, pos = '50% 50%', tag }) {
  inject();
  const node = box(parent, 'pm-photo', x, y, w, h);
  const img = el('img', '', node);
  img.src = asset;
  img.style.objectPosition = pos;
  if (tag) {
    const t = el('div', 'pm-tag', node);
    t.style.cssText = 'left:12px;top:12px';
    el('i', '', t);
    el('span', '', t, tag);
  }
  return node;
}

// Week state per row: 1 done, 0 late, 2 today (open), 3 upcoming, 4 not scheduled.
// Today is Thursday (index 3).
const WEEK = [
  [1, 1, 1, 2, 3, 3, 3],
  [1, 0, 1, 2, 3, 3, 3],
  [4, 4, 4, 2, 4, 4, 4],
  [1, 4, 4, 4, 4, 4, 4],
];
const TODAY = 3;

/** Weekly plan calendar. */
export function calendar(parent, s, { x, y, w, rows = 4, pad = 15, nameW = 104 }) {
  inject();
  const card = box(parent, 'pm-card', x, y, w);
  card.style.padding = `${pad - 1}px ${pad}px ${pad - 5}px`;
  const hd = el('div', 'pm-hd', card);
  el('div', 'lbl ink', hd, s.plan).style.cssText = 'font-size:9.5px;color:var(--ink-3);white-space:nowrap';
  el('span', 'pm-range', hd, s.range);
  const grid = el('div', 'pm-grid', card);
  grid.style.gridTemplateColumns = `${nameW}px repeat(7, 1fr)`;
  grid.style.marginTop = '10px';
  el('div', '', grid);
  s.days.forEach((d, i) => { const c = el('div', `pm-dayh ${i === TODAY ? 'today' : ''}`, grid, d); c.style.paddingBottom = '5px'; });
  for (let r = 0; r < rows; r++) {
    const l = el('div', 'pm-rowl', grid);
    const n = el('div', 'pm-name', l, s.rows[r][0]);
    el('small', '', n, s.rows[r][1]);
    WEEK[r].forEach((v, i) => {
      const c = el('div', `pm-cell ${i === TODAY ? 'today' : ''}`, grid);
      el('span', ['pm-late', 'pm-ok', 'pm-now', 'pm-todo', 'pm-none'][v], c);
    });
  }
  return card;
}

/** The generator test task the plan created today. */
export function taskCard(parent, s, { x, y, w, pad = 16, foot = true }) {
  inject();
  const card = box(parent, 'pm-card', x, y, w);
  card.style.padding = `${pad}px ${pad + 1}px`;
  const top = el('div', '', card);
  top.style.cssText = 'display:flex;justify-content:space-between;align-items:flex-start;gap:10px';
  const name = el('div', '', top);
  el('div', 'pm-task', name, s.task);
  el('div', 'pm-sub', name, s.spot);
  if (foot) {
    const f = el('div', 'pm-foot', card);
    f.style.cssText += ';margin-top:13px;padding-top:11px;border-top:1px solid var(--line)';
    const pill = el('span', 'pm-pill', f);
    el('i', '', pill);
    el('span', '', pill, s.due);
    const who = el('div', '', f);
    who.style.cssText = 'display:flex;align-items:center;gap:7px';
    el('span', 'av a', who, 'L');
    el('span', '', who, s.by);
  }
  return card;
}

/** Small "from plan" badge. */
export function fromBadge(parent, s) {
  inject();
  const b = el('span', 'pm-from', parent);
  b.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.4h-2.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  el('span', '', b, s.from);
  return b;
}
