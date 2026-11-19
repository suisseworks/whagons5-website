// Shared pieces for the room assignments cover and social card: a dark daily
// room board coloured by attendant, a credits-per-attendant card and a
// supervisor card for a covered sick call.
import { box, el } from '../../lib/kit.js';
import { FLOORS } from './_strings.js';

const css = `
.ra-board { position: absolute; border-radius: 18px; overflow: hidden; color: #fff;
  background: radial-gradient(120% 90% at 85% 0%, #3a2a22 0%, #1d1a17 45%, #161513 100%);
  box-shadow: 0 2px 4px rgba(60,44,22,.12), 0 30px 70px rgba(60,44,22,.32); }
.ra-board::after { content: ''; position: absolute; inset: 0; border-radius: 18px; pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
.ra-hd { position: absolute; display: flex; align-items: center; justify-content: space-between; }
.ra-tag { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px; border-radius: 11px;
  background: rgba(255,255,255,.08); font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.ra-tag i { width: 6px; height: 6px; border-radius: 50%; background: #ff5a36; box-shadow: 0 0 0 3px rgba(255,90,54,.25); }
.ra-count { font-family: var(--mono); font-size: 8.5px; color: rgba(255,255,255,.5); letter-spacing: .04em; white-space: nowrap; }
.ra-row { position: absolute; display: flex; align-items: center; }
.ra-fl { font-family: var(--mono); font-size: 8.5px; color: rgba(255,255,255,.42); letter-spacing: .04em; flex-shrink: 0; }
.ra-t { position: relative; flex-shrink: 0; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between;
  padding: 4px 0 3px 5px; font-family: var(--mono); line-height: 1; }
.ra-t b { font-size: 7.5px; font-weight: 500; opacity: .78; letter-spacing: .02em; }
.ra-t span { font-size: 9.5px; font-weight: 700; }
.ra-t.a { background: #d4310a; color: #fff; box-shadow: 0 4px 12px rgba(212,49,10,.35); }
.ra-t.r { background: #f3a084; color: #3a1a0e; }
.ra-t.l { background: #efe6d8; color: #2a2620; }
.ra-t.s { background: rgba(255,255,255,.03); box-shadow: inset 0 0 0 1.5px currentColor; }
.ra-t.a.s { color: #ff6a45; } .ra-t.r.s { color: #f3a084; } .ra-t.l.s { color: #efe6d8; }
.ra-t.vip { outline: 1.5px solid #fff; outline-offset: 2px; }
.ra-t.vip::after { content: ''; position: absolute; right: 4px; bottom: 4px; width: 5px; height: 5px; border-radius: 50%; background: #fff; }
.ra-lg { position: absolute; display: flex; justify-content: flex-end; gap: 12px; font-family: var(--mono); font-size: 8px; color: rgba(255,255,255,.55); white-space: nowrap; letter-spacing: .02em; }
.ra-lg span { display: inline-flex; align-items: center; gap: 5px; }
.ra-lg i { width: 8px; height: 8px; border-radius: 2px; background: #efe6d8; }
.ra-lg i.s { background: transparent; box-shadow: inset 0 0 0 1.5px #efe6d8; }
.ra-lg i.vip { background: transparent; outline: 1.5px solid #fff; outline-offset: 0; border-radius: 2px; }
.ra-card { position: absolute; z-index: 3; background: #fff; border-radius: 16px; border: 1px solid rgba(22,21,19,.06);
  box-shadow: 0 1px 2px rgba(60,44,22,.08), 0 22px 50px rgba(60,44,22,.22), 0 6px 14px rgba(60,44,22,.08); }
.ra-chd { display: flex; align-items: center; gap: 9px; padding-bottom: 9px; border-bottom: 1px solid var(--line); }
.ra-ico { width: 26px; height: 26px; border-radius: 8px; background: var(--red-soft); display: grid; place-items: center; flex-shrink: 0; }
.ra-name { font-size: 12px; font-weight: 600; color: var(--ink); line-height: 1.1; white-space: nowrap; }
.ra-name small { display: block; font-family: var(--mono); font-size: 8px; color: var(--ink-3); font-weight: 400; letter-spacing: .03em; margin-top: 2px; }
.ra-p { display: flex; align-items: center; gap: 9px; padding: var(--rp, 6px) 0; border-bottom: 1px solid var(--line); }
.ra-p:last-child { border-bottom: 0; padding-bottom: 0; }
.ra-av { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; font-size: 9px; font-weight: 700; }
.ra-av.a { background: #d4310a; color: #fff; } .ra-av.r { background: #f3a084; color: #3a1a0e; }
.ra-av.l { background: #efe6d8; color: #2a2620; box-shadow: inset 0 0 0 1px rgba(22,21,19,.12); }
.ra-av.x { background: #f3f1ec; color: var(--ink-4); box-shadow: inset 0 0 0 1px rgba(22,21,19,.1); }
.ra-who { width: 92px; flex-shrink: 0; font-size: 11px; font-weight: 600; color: var(--ink); line-height: 1.15; white-space: nowrap; }
.ra-who small { display: block; font-family: var(--mono); font-size: 7.5px; font-weight: 400; color: var(--ink-3); margin-top: 2px; letter-spacing: .02em; }
.ra-bar { flex: 1; height: 6px; border-radius: 3px; background: #f3efe8; overflow: hidden; }
.ra-bar i { display: block; height: 100%; border-radius: 3px; }
.ra-bar.a i { background: #d4310a; } .ra-bar.r i { background: #f3a084; } .ra-bar.l i { background: #d9cbb4; }
.ra-bar.x { background: repeating-linear-gradient(90deg, rgba(22,21,19,.16) 0 4px, transparent 4px 8px); height: 2px; }
.ra-val { width: 34px; text-align: right; flex-shrink: 0; font-family: var(--mono); font-size: 9.5px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.ra-p.x .ra-who { color: var(--ink-3); }
.ra-p.x .ra-who em { font-style: normal; text-decoration: line-through; text-decoration-color: rgba(22,21,19,.35); }
.ra-pill { flex-shrink: 0; height: 18px; padding: 0 8px; border-radius: 9px; display: inline-flex; align-items: center;
  background: #fff4ed; color: #b93815; box-shadow: inset 0 0 0 1px rgba(212,49,10,.32);
  font-family: var(--mono); font-size: 8px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase; white-space: nowrap; }
.ra-big { font-size: 15px; font-weight: 600; letter-spacing: -.015em; line-height: 1.2; white-space: nowrap; }
.ra-sub { margin-top: 4px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.ra-foot { display: flex; align-items: center; gap: 7px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap;
  margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--line); }
.ra-foot .av { width: 18px; height: 18px; font-size: 8.5px; background: var(--ink); }
.ra-badge { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px; border-radius: 7px; background: var(--red); color: #fff;
  font-size: 10px; font-weight: 600; white-space: nowrap; box-shadow: 0 6px 16px rgba(212,49,10,.3); }
`;

let injected = false;
function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

/** Dark daily room board, one row per floor, tiles coloured by attendant. */
export function board(parent, s, { x, y, w, h, pad = 16, tile = 27, th = 32, gap = 4, rowGap = 6, label = 30, legend = true, rooms = 7, floors = 4 }) {
  inject();
  const node = box(parent, 'ra-board', x, y, w, h);
  const hd = box(node, 'ra-hd', pad, pad - 2, w - pad * 2, 22);
  const tag = el('span', 'ra-tag', hd);
  el('i', '', tag);
  el('span', '', tag, s.tag);
  el('span', 'ra-count', hd, s.count);
  let top = pad + 34;
  FLOORS.slice(0, floors).forEach(([fl, list]) => {
    const row = box(node, 'ra-row', pad, top, w - pad * 2, th);
    el('span', 'ra-fl', row, `${s.floor}${fl}`).style.width = `${label}px`;
    list.slice(0, rooms).forEach(([who, kind, vip], i) => {
      const t = el('div', `ra-t ${who} ${kind}${vip ? ' vip' : ''}`, row);
      t.style.width = `${tile}px`;
      t.style.height = `${th}px`;
      if (i) t.style.marginLeft = `${gap}px`;
      el('b', '', t, `${fl}${String(i + 1).padStart(2, '0')}`);
      el('span', '', t, s.kinds[kind]);
    });
    top += th + rowGap;
  });
  if (legend) {
    const lg = box(node, 'ra-lg', pad, top + 6, w - pad * 2);
    s.legend.forEach(([k, txt]) => { const sp = el('span', '', lg); el('i', k, sp); el('span', '', sp, txt); });
  }
  return node;
}

/** Credits-per-attendant card. */
export function credits(parent, s, { x, y, w, pad = 14, sick = true, rp = 6 }) {
  inject();
  const card = box(parent, 'ra-card', x, y, w);
  card.style.setProperty('--rp', `${rp}px`);
  card.style.padding = `${pad}px ${pad}px ${pad - 2}px`;
  const hd = el('div', 'ra-chd', card);
  const ico = el('div', 'ra-ico', hd);
  ico.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#d4310a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.5v11M4.5 13.5h7M3 4.5h10"/><path d="M3 4.5L1.2 9h3.6zM13 4.5L11.2 9h3.6z"/></svg>';
  const n = el('div', 'ra-name', hd, s.board);
  el('small', '', n, s.sub);
  s.people.forEach(([k, name, detail, val]) => {
    const r = el('div', 'ra-p', card);
    el('span', `ra-av ${k}`, r, name[0]);
    const who = el('div', 'ra-who', r, name);
    el('small', '', who, detail);
    const bar = el('div', `ra-bar ${k}`, r);
    el('i', '', bar).style.width = '100%';
    el('span', 'ra-val', r, val);
  });
  if (sick) {
    const [name, detail, pill] = s.sick;
    const r = el('div', 'ra-p x', card);
    el('span', 'ra-av x', r, name[0]);
    const who = el('div', 'ra-who', r);
    el('em', '', who, name);
    el('small', '', who, detail);
    el('div', 'ra-bar x', r);
    el('span', 'ra-pill', r, pill);
  }
  return card;
}

/** Supervisor card: sick call covered. */
export function task(parent, s, { x, y, w, pad = 14 }) {
  inject();
  const card = box(parent, 'ra-card', x, y, w);
  card.style.padding = `${pad}px ${pad + 1}px`;
  el('div', 'ra-big', card, s.taskTitle);
  el('div', 'ra-sub', card, s.taskSub);
  const f = el('div', 'ra-foot', card);
  el('span', 'av', f, s.taskBy.trim()[0]);
  el('span', '', f, s.taskBy);
  return card;
}

export function badge(parent, s) {
  inject();
  const b = el('span', 'ra-badge', parent);
  b.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16"><path d="M3.5 8.4l3 3 6-6.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  el('span', '', b, s.badge);
  return b;
}
