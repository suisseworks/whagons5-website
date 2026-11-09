// Shared pieces for the maintenance priorities cover and social card: a repair
// photo, a maintenance queue sorted by priority, and an urgent task card.
import { box, el } from '../../lib/kit.js';

const css = `
.mp-photo { position: absolute; border-radius: 18px; overflow: hidden; background: #d9cdb9;
  box-shadow: 0 2px 4px rgba(60,44,22,.10), 0 30px 70px rgba(60,44,22,.28); }
.mp-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.mp-photo::after { content: ''; position: absolute; inset: 0; border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
  background: linear-gradient(180deg, rgba(22,21,19,.24) 0%, rgba(22,21,19,0) 28%, rgba(22,21,19,0) 70%, rgba(22,21,19,.14) 100%); }
.mp-tag { position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px;
  border-radius: 11px; background: rgba(22,21,19,.62); backdrop-filter: blur(6px); color: #fff;
  font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.mp-tag i { width: 6px; height: 6px; border-radius: 50%; background: #ff5a36; box-shadow: 0 0 0 3px rgba(255,90,54,.25); }
.mp-card { position: absolute; z-index: 3; background: #fff; border-radius: 16px; border: 1px solid rgba(22,21,19,.06);
  box-shadow: 0 1px 2px rgba(60,44,22,.08), 0 22px 50px rgba(60,44,22,.22), 0 6px 14px rgba(60,44,22,.08); }
.mp-hd { display: flex; align-items: center; gap: 9px; padding-bottom: 9px; border-bottom: 1px solid var(--line); }
.mp-ico { width: 26px; height: 26px; border-radius: 8px; background: var(--red-soft); display: grid; place-items: center; flex-shrink: 0; }
.mp-name { font-size: 12px; font-weight: 600; color: var(--ink); line-height: 1.1; white-space: nowrap; }
.mp-name small { display: block; font-family: var(--mono); font-size: 8px; color: var(--ink-3); font-weight: 400; letter-spacing: .03em; margin-top: 2px; }
.mp-row { display: flex; align-items: center; gap: 9px; padding: 7px 0 6px; border-bottom: 1px solid var(--line); }
.mp-row:last-child { border-bottom: 0; padding-bottom: 1px; }
.mp-pr { display: inline-flex; align-items: center; justify-content: center; height: 18px; width: 66px; border-radius: 9px; flex-shrink: 0;
  font-family: var(--mono); font-size: 8px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase; white-space: nowrap; }
.mp-row.urgent .mp-pr { background: var(--red); color: #fff; box-shadow: 0 4px 10px rgba(212,49,10,.28); }
.mp-row.today .mp-pr { background: #fff4ed; color: #b93815; box-shadow: inset 0 0 0 1px rgba(212,49,10,.32); }
.mp-row.week .mp-pr { background: #f3efe8; color: #5b554c; box-shadow: inset 0 0 0 1px rgba(22,21,19,.12); }
.mp-row.plan .mp-pr { background: #fff; color: #8a8378; box-shadow: inset 0 0 0 1px rgba(22,21,19,.12); }
.mp-it { flex: 1; min-width: 0; font-size: 11px; font-weight: 600; color: var(--ink); white-space: nowrap; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; }
.mp-row.plan .mp-it, .mp-row.week .mp-it { color: #4a453e; }
.mp-sp { font-family: var(--mono); font-size: 8.5px; color: var(--ink-3); white-space: nowrap; flex-shrink: 0; }
.mp-big { font-size: 15px; font-weight: 600; letter-spacing: -.015em; line-height: 1.2; white-space: nowrap; }
.mp-sub { margin-top: 4px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.mp-foot { display: flex; align-items: center; gap: 7px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.mp-foot .av { width: 18px; height: 18px; font-size: 8.5px; }
.mp-badge { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px; border-radius: 7px; background: var(--red); color: #fff; font-size: 10px; font-weight: 600; white-space: nowrap; box-shadow: 0 6px 16px rgba(212,49,10,.3); }
`;

let injected = false;
function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

const asset = '/assets/maintenance-priorities-repair.jpg';

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
  const node = box(parent, 'mp-photo', x, y, w, h);
  const img = el('img', '', node);
  img.src = asset;
  img.style.objectPosition = pos;
  if (tag) {
    const t = el('div', 'mp-tag', node);
    t.style.cssText = 'left:12px;top:12px';
    el('i', '', t);
    el('span', '', t, tag);
  }
  return node;
}

/** Maintenance queue sorted by priority. */
export function queue(parent, s, { x, y, w, rows = 4, pad = 14 }) {
  inject();
  const card = box(parent, 'mp-card', x, y, w);
  card.style.padding = `${pad}px ${pad}px ${pad - 4}px`;
  const hd = el('div', 'mp-hd', card);
  const ico = el('div', 'mp-ico', hd);
  ico.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16"><path d="M3 4h10M3 8h7M3 12h4" fill="none" stroke="#d4310a" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const n = el('div', 'mp-name', hd, s.board);
  el('small', '', n, s.sub);
  s.items.slice(0, rows).forEach(([key, pr, it, spot]) => {
    const r = el('div', `mp-row ${key}`, card);
    el('span', 'mp-pr', r, pr);
    el('div', 'mp-it', r, it);
    el('span', 'mp-sp', r, spot);
  });
  return card;
}

/** Urgent task card. */
export function task(parent, s, { x, y, w, pad = 14 }) {
  inject();
  const card = box(parent, 'mp-card', x, y, w);
  card.style.padding = `${pad}px ${pad + 1}px`;
  el('div', 'mp-big', card, s.taskTitle);
  el('div', 'mp-sub', card, s.taskSub);
  const f = el('div', 'mp-foot', card);
  f.style.cssText += ';margin-top:12px;padding-top:10px;border-top:1px solid var(--line)';
  el('span', 'av a', f, 'L');
  el('span', '', f, s.taskBy);
  return card;
}

export function badge(parent, s) {
  inject();
  const b = el('span', 'mp-badge', parent);
  b.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16"><path d="M8 2.5v7M8 12.6v.9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>';
  el('span', '', b, s.badge);
  return b;
}
