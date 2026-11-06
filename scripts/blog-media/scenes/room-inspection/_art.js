// Shared pieces for the room inspection cover and social card: a room photo,
// a pass/fail inspection checklist, and a "do not release" rework card.
import { box, el } from '../../lib/kit.js';

const css = `
.ri-photo { position: absolute; border-radius: 18px; overflow: hidden; background: #d9cdb9;
  box-shadow: 0 2px 4px rgba(60,44,22,.10), 0 30px 70px rgba(60,44,22,.28); }
.ri-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ri-photo::after { content: ''; position: absolute; inset: 0; border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
  background: linear-gradient(180deg, rgba(22,21,19,.22) 0%, rgba(22,21,19,0) 28%, rgba(22,21,19,0) 70%, rgba(22,21,19,.14) 100%); }
.ri-tag { position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px;
  border-radius: 11px; background: rgba(22,21,19,.62); backdrop-filter: blur(6px); color: #fff;
  font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.ri-tag i { width: 6px; height: 6px; border-radius: 50%; background: #ff5a36; box-shadow: 0 0 0 3px rgba(255,90,54,.25); }
.ri-card { position: absolute; z-index: 3; background: #fff; border-radius: 16px; border: 1px solid rgba(22,21,19,.06);
  box-shadow: 0 1px 2px rgba(60,44,22,.08), 0 22px 50px rgba(60,44,22,.22), 0 6px 14px rgba(60,44,22,.08); }
.ri-hd { display: flex; align-items: center; gap: 9px; padding-bottom: 9px; border-bottom: 1px solid var(--line); }
.ri-ico { width: 26px; height: 26px; border-radius: 8px; background: var(--red-soft); display: grid; place-items: center; flex-shrink: 0; }
.ri-name { font-size: 12px; font-weight: 600; color: var(--ink); line-height: 1.1; white-space: nowrap; }
.ri-name small { display: block; font-family: var(--mono); font-size: 8px; color: var(--ink-3); font-weight: 400; letter-spacing: .03em; margin-top: 2px; }
.ri-count { margin-left: auto; font-family: var(--mono); font-size: 9px; font-weight: 600; color: #fff; background: var(--ink); padding: 2px 7px; border-radius: 9px; white-space: nowrap; }
.ri-count.fail { background: var(--red); }
.ri-row { display: flex; align-items: center; gap: 9px; padding: 7px 0 6px; border-bottom: 1px solid var(--line); }
.ri-row:last-child { border-bottom: 0; padding-bottom: 1px; }
.ri-st { width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0; display: grid; place-items: center; }
.ri-row.pass .ri-st { background: #22c55e; box-shadow: 0 0 0 2px #dcfce7; }
.ri-row.fail .ri-st { background: var(--red); box-shadow: 0 0 0 2px #ffe8e0; }
.ri-txt { min-width: 0; flex: 1; }
.ri-it { font-size: 11px; font-weight: 600; color: var(--ink); white-space: nowrap; line-height: 1.2; }
.ri-row.fail .ri-it { color: var(--ink); }
.ri-flag { display: inline-flex; align-items: center; height: 18px; padding: 0 7px; border-radius: 9px; flex-shrink: 0;
  background: #fff4ed; color: #b93815; box-shadow: inset 0 0 0 1px rgba(212,49,10,.3); font-size: 9px; font-weight: 600; white-space: nowrap; }
.ri-room { font-size: 18px; font-weight: 600; letter-spacing: -.02em; line-height: 1; white-space: nowrap; }
.ri-sub { margin-top: 4px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.ri-big { font-size: 15px; font-weight: 600; letter-spacing: -.015em; line-height: 1.2; white-space: nowrap; }
.ri-foot { display: flex; align-items: center; gap: 7px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.ri-foot .av { width: 18px; height: 18px; font-size: 8.5px; }
.ri-from { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px; border-radius: 7px; background: var(--red); color: #fff; font-size: 10px; font-weight: 600; white-space: nowrap; box-shadow: 0 6px 16px rgba(212,49,10,.3); }
`;

let injected = false;
function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

const asset = '/assets/room-readiness-room.jpg';

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
  const node = box(parent, 'ri-photo', x, y, w, h);
  const img = el('img', '', node);
  img.src = asset;
  img.style.objectPosition = pos;
  if (tag) {
    const t = el('div', 'ri-tag', node);
    t.style.cssText = 'left:12px;top:12px';
    el('i', '', t);
    el('span', '', t, tag);
  }
  return node;
}

const check = '<svg width="8" height="8" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const cross = '<svg width="8" height="8" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';

/** Pass/fail inspection checklist with room and inspector. */
export function inspection(parent, s, { x, y, w, rows = 5, pad = 14 }) {
  inject();
  const card = box(parent, 'ri-card', x, y, w);
  card.style.padding = `${pad}px ${pad}px ${pad - 4}px`;
  const hd = el('div', 'ri-hd', card);
  const ico = el('div', 'ri-ico', hd);
  ico.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16"><path d="M3.5 8.2l2.8 2.8L12.5 5" fill="none" stroke="#d4310a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="none" stroke="#d4310a" stroke-width="1.4" opacity=".35"/></svg>';
  const n = el('div', 'ri-name', hd, s.board);
  el('small', '', n, `${s.room} · ${s.inspector.split(' · ')[0]}`);
  const fails = s.items.filter(([st]) => st === 'fail').length;
  el('span', `ri-count${fails ? ' fail' : ''}`, hd, fails ? s.result : s.resultOk);
  s.items.slice(0, rows).forEach(([state, it, flag]) => {
    const r = el('div', `ri-row ${state}`, card);
    const st = el('span', 'ri-st', r);
    st.innerHTML = state === 'pass' ? check : cross;
    const t = el('div', 'ri-txt', r);
    el('div', 'ri-it', t, it);
    if (flag) el('span', 'ri-flag', r, flag);
  });
  return card;
}

/** Compact room header card. */
export function roomCard(parent, s, { x, y, w, pad = 14 }) {
  inject();
  const card = box(parent, 'ri-card', x, y, w);
  card.style.padding = `${pad}px ${pad + 1}px`;
  el('div', 'ri-room', card, s.room);
  el('div', 'ri-sub', card, s.type);
  const f = el('div', 'ri-foot', card);
  f.style.cssText += ';margin-top:12px;padding-top:10px;border-top:1px solid var(--line)';
  el('span', 'av a', f, 'S');
  el('span', '', f, s.inspector);
  return card;
}

/** Rework / do-not-release card. */
export function rework(parent, s, { x, y, w, pad = 14 }) {
  inject();
  const card = box(parent, 'ri-card', x, y, w);
  card.style.padding = `${pad}px ${pad + 1}px`;
  el('div', 'ri-big', card, s.failTitle);
  el('div', 'ri-sub', card, s.failSub);
  const f = el('div', 'ri-foot', card);
  f.style.cssText += ';margin-top:12px;padding-top:10px;border-top:1px solid var(--line)';
  el('span', 'av a', f, 'S');
  el('span', '', f, s.failBy);
  return card;
}

export function failBadge(parent, s) {
  inject();
  const b = el('span', 'ri-from', parent);
  b.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
  el('span', '', b, s.failBadge);
  return b;
}
