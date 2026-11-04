// Shared pieces for the shift handover cover and social card: the front desk
// photo, the handover list (open items with a place, an owner and a time,
// one flagged as guest-sensitive) and the sign-off of the incoming shift.
import { box, el } from '../../lib/kit.js';

const css = `
.sh-photo { position: absolute; border-radius: 18px; overflow: hidden; background: #d9cdb9;
  box-shadow: 0 2px 4px rgba(60,44,22,.10), 0 30px 70px rgba(60,44,22,.28); }
.sh-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.sh-photo::after { content: ''; position: absolute; inset: 0; border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
  background: linear-gradient(180deg, rgba(22,21,19,.22) 0%, rgba(22,21,19,0) 28%, rgba(22,21,19,0) 70%, rgba(22,21,19,.14) 100%); }
.sh-tag { position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px;
  border-radius: 11px; background: rgba(22,21,19,.62); backdrop-filter: blur(6px); color: #fff;
  font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.sh-tag i { width: 6px; height: 6px; border-radius: 50%; background: #ff5a36; box-shadow: 0 0 0 3px rgba(255,90,54,.25); }
.sh-card { position: absolute; z-index: 3; background: #fff; border-radius: 16px; border: 1px solid rgba(22,21,19,.06);
  box-shadow: 0 1px 2px rgba(60,44,22,.08), 0 22px 50px rgba(60,44,22,.22), 0 6px 14px rgba(60,44,22,.08); }
.sh-hd { display: flex; align-items: center; gap: 9px; padding-bottom: 9px; border-bottom: 1px solid var(--line); }
.sh-ico { width: 26px; height: 26px; border-radius: 8px; background: var(--red-soft); display: grid; place-items: center; flex-shrink: 0; }
.sh-name { font-size: 12px; font-weight: 600; color: var(--ink); line-height: 1.1; white-space: nowrap; }
.sh-name small { display: block; font-family: var(--mono); font-size: 8px; color: var(--ink-3); font-weight: 400; letter-spacing: .03em; margin-top: 2px; }
.sh-count { margin-left: auto; font-family: var(--mono); font-size: 9px; font-weight: 600; color: #fff; background: var(--ink); padding: 2px 7px; border-radius: 9px; white-space: nowrap; }
.sh-row { display: flex; align-items: center; gap: 9px; padding: 8px 0 7px; border-bottom: 1px solid var(--line); }
.sh-row:last-child { border-bottom: 0; padding-bottom: 1px; }
.sh-st { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 1.6px var(--ink-4); }
.sh-row.done .sh-st { background: #22c55e; box-shadow: 0 0 0 2px #dcfce7; display: grid; place-items: center; }
.sh-row.hot .sh-st { box-shadow: inset 0 0 0 2px var(--red), 0 0 0 3px rgba(212,49,10,.14); }
.sh-txt { min-width: 0; flex: 1; }
.sh-it { font-size: 11px; font-weight: 600; color: var(--ink); white-space: nowrap; line-height: 1.2; }
.sh-row.done .sh-it { color: var(--ink-3); text-decoration: line-through; text-decoration-color: var(--ink-4); }
.sh-meta { font-family: var(--mono); font-size: 8px; color: var(--ink-3); letter-spacing: .02em; margin-top: 3px; white-space: nowrap; }
.sh-flag { display: inline-flex; align-items: center; gap: 4px; height: 18px; padding: 0 7px; border-radius: 9px; flex-shrink: 0;
  background: #fff4ed; color: #b93815; box-shadow: inset 0 0 0 1px rgba(212,49,10,.3); font-size: 9px; font-weight: 600; white-space: nowrap; }
.sh-flag i { width: 5px; height: 5px; border-radius: 50%; background: var(--red); }
.sh-big { font-size: 15px; font-weight: 600; letter-spacing: -.015em; line-height: 1.2; white-space: nowrap; }
.sh-sub { margin-top: 4px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.sh-foot { display: flex; align-items: center; gap: 7px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.sh-foot .av { width: 18px; height: 18px; font-size: 8.5px; }
.sh-hand { display: flex; align-items: center; }
.sh-hand .av { box-shadow: 0 0 0 2px #fff; }
.sh-hand .av + .av { margin-left: -5px; }
.sh-from { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px; border-radius: 7px; background: var(--red); color: #fff; font-size: 10px; font-weight: 600; white-space: nowrap; box-shadow: 0 6px 16px rgba(212,49,10,.3); }
`;

let injected = false;
function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

const asset = '/assets/shift-handover-desk.jpg';

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
  const node = box(parent, 'sh-photo', x, y, w, h);
  const img = el('img', '', node);
  img.src = asset;
  img.style.objectPosition = pos;
  if (tag) {
    const t = el('div', 'sh-tag', node);
    t.style.cssText = 'left:12px;top:12px';
    el('i', '', t);
    el('span', '', t, tag);
  }
  return node;
}

const check = '<svg width="8" height="8" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** The handover list: open items with place, owner and time. */
export function handover(parent, s, { x, y, w, rows = 3, pad = 14 }) {
  inject();
  const card = box(parent, 'sh-card', x, y, w);
  card.style.padding = `${pad}px ${pad}px ${pad - 4}px`;
  const hd = el('div', 'sh-hd', card);
  const ico = el('div', 'sh-ico', hd);
  ico.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16"><path d="M2.5 5.5h9M8.5 2.5l3 3-3 3" fill="none" stroke="#d4310a" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.5 10.5h-9M7.5 7.5l-3 3 3 3" fill="none" stroke="#d4310a" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/></svg>';
  const n = el('div', 'sh-name', hd, s.board);
  el('small', '', n, s.shift);
  el('span', 'sh-count', hd, s.count);
  s.items.slice(0, rows).forEach(([state, it, meta, flag]) => {
    const r = el('div', `sh-row ${state}${flag ? ' hot' : ''}`, card);
    const st = el('span', 'sh-st', r);
    if (state === 'done') st.innerHTML = check;
    const t = el('div', 'sh-txt', r);
    el('div', 'sh-it', t, it);
    el('div', 'sh-meta', t, meta);
    if (flag) {
      const f = el('span', 'sh-flag', r);
      el('i', '', f);
      el('span', '', f, flag);
    }
  });
  return card;
}

/** The incoming shift's sign-off. */
export function signoff(parent, s, { x, y, w, pad = 16 }) {
  inject();
  const card = box(parent, 'sh-card', x, y, w);
  card.style.padding = `${pad}px ${pad + 1}px`;
  el('div', 'sh-big', card, s.signTitle);
  el('div', 'sh-sub', card, s.signSub);
  const f = el('div', 'sh-foot', card);
  f.style.cssText += ';margin-top:13px;padding-top:11px;border-top:1px solid var(--line)';
  const hand = el('div', 'sh-hand', f);
  el('span', 'av b', hand, 'A');
  el('span', 'av a', hand, 'C');
  el('span', '', f, s.signBy);
  return card;
}

export function signedBadge(parent, s) {
  inject();
  const b = el('span', 'sh-from', parent);
  b.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  el('span', '', b, s.signed);
  return b;
}
