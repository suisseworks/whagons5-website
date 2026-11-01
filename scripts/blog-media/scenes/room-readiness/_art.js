// Shared pieces for the room readiness cover and social card: a photo of the
// inspected room, the room status card with the checkout → released path, and
// the ticked inspection list with a photo-evidence thumbnail.
import { box, el } from '../../lib/kit.js';

const css = `
.rr-photo { position: absolute; border-radius: 18px; overflow: hidden; background: #d9cdb9;
  box-shadow: 0 2px 4px rgba(60,44,22,.10), 0 30px 70px rgba(60,44,22,.28); }
.rr-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.rr-photo::after { content: ''; position: absolute; inset: 0; border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
  background: linear-gradient(180deg, rgba(22,21,19,.18) 0%, rgba(22,21,19,0) 26%, rgba(22,21,19,0) 70%, rgba(22,21,19,.12) 100%); }
.rr-tag { position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px;
  border-radius: 11px; background: rgba(22,21,19,.62); backdrop-filter: blur(6px); color: #fff;
  font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.rr-tag i { width: 6px; height: 6px; border-radius: 50%; background: #ff5a36; box-shadow: 0 0 0 3px rgba(255,90,54,.25); }
.rr-card { position: absolute; z-index: 3; background: #fff; border-radius: 16px; border: 1px solid rgba(22,21,19,.06);
  box-shadow: 0 1px 2px rgba(60,44,22,.08), 0 22px 50px rgba(60,44,22,.22), 0 6px 14px rgba(60,44,22,.08); }
.rr-room { font-size: 21px; font-weight: 600; letter-spacing: -.02em; line-height: 1; }
.rr-sub { margin-top: 5px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.rr-pill { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 9px 0 5px; border-radius: 11px;
  background: #f4f3ff; color: #5925dc; box-shadow: inset 0 0 0 1px rgba(89,37,220,.28); font-size: 10.5px; font-weight: 600; white-space: nowrap; }
.rr-pill b { display: grid; place-items: center; width: 14px; height: 14px; border-radius: 50%; background: #7c3aed; color: #fff; font-size: 8.5px; }
.rr-steps { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); }
.rr-steps::before { content: ''; position: absolute; left: 12.5%; right: 12.5%; top: 6px; height: 2px; background: linear-gradient(90deg, #22c55e, #8b5cf6 66%, #d4310a); border-radius: 1px; }
.rr-step { position: relative; display: grid; justify-items: center; gap: 6px; font-size: 9.5px; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
.rr-step i { display: grid; place-items: center; width: 14px; height: 14px; border-radius: 50%; color: #fff; font-style: normal; font-size: 8px; font-weight: 700; box-shadow: 0 0 0 3px #fff; }
.rr-step.on { color: var(--ink); }
.rr-foot { display: flex; align-items: center; gap: 7px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.rr-foot .av { width: 18px; height: 18px; font-size: 8.5px; }
.rr-rel { display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px; border-radius: 8px; background: var(--ink); color: #fff; font-size: 10.5px; font-weight: 600; white-space: nowrap; }
.rr-rel i { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,.25); }
.rr-list-hd { display: flex; justify-content: space-between; align-items: center; }
.rr-count { font-family: var(--mono); font-size: 10px; font-weight: 600; color: #067647; background: #ecfdf3; padding: 2px 6px; border-radius: 5px; }
.rr-bar { height: 4px; border-radius: 2px; background: #22c55e; margin: 9px 0 4px; }
.rr-item { display: flex; align-items: center; gap: 9px; height: 25px; font-size: 11.5px; color: var(--ink); border-bottom: 1px solid var(--line); white-space: nowrap; }
.rr-item:last-child { border-bottom: 0; }
.rr-item .tick { display: grid; place-items: center; flex-shrink: 0; width: 15px; height: 15px; border-radius: 4px; background: var(--ink); color: #fff; font-size: 9px; font-weight: 700; }
.rr-item .sp { flex: 1; }
.rr-thumb { position: relative; width: 26px; height: 19px; border-radius: 4px; overflow: hidden; box-shadow: 0 0 0 1px rgba(22,21,19,.12); }
.rr-thumb img { width: 100%; height: 100%; object-fit: cover; }
.rr-cam { font-family: var(--mono); font-size: 8.5px; color: var(--ink-3); letter-spacing: .04em; }
`;

let injected = false;
export function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

const asset = (name) => `/assets/room-readiness-${name}.jpg`;

export async function loadImages() {
  await Promise.all(['room', 'bath'].map((name) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = asset(name);
  })));
}

export function photo(parent, { x, y, w, h, pos = '50% 50%', tag }) {
  inject();
  const node = box(parent, 'rr-photo', x, y, w, h);
  const img = el('img', '', node);
  img.src = asset('room');
  img.style.objectPosition = pos;
  if (tag) {
    const t = el('div', 'rr-tag', node);
    t.style.cssText = 'left:12px;top:12px';
    el('i', '', t);
    el('span', '', t, tag);
  }
  return node;
}

/** Room status card. */
export function statusCard(parent, s, { x, y, w, steps = true, foot = true, pad = 16 }) {
  inject();
  const card = box(parent, 'rr-card', x, y, w);
  card.style.padding = `${pad}px ${pad + 1}px`;
  const top = el('div', '', card);
  top.style.cssText = 'display:flex;justify-content:space-between;align-items:flex-start;gap:10px';
  const name = el('div', '', top);
  el('div', 'rr-room', name, s.room);
  el('div', 'rr-sub', name, s.type);
  const pill = el('span', 'rr-pill', top);
  el('b', '', pill, '✓');
  el('span', '', pill, s.inspected);
  if (steps) {
    const row = el('div', 'rr-steps', card);
    row.style.marginTop = '16px';
    const colors = ['#ef4444', '#22c55e', '#8b5cf6', '#d4310a'];
    s.steps.forEach((label, i) => {
      const step = el('div', `rr-step ${i === 2 ? 'on' : ''}`, row);
      const dot = el('i', '', step, i < 3 ? '✓' : '');
      dot.style.background = colors[i];
      if (i === 3) { dot.style.background = '#fff'; dot.style.boxShadow = '0 0 0 3px #fff, inset 0 0 0 2px #d4310a'; }
      el('span', '', step, label);
    });
  }
  if (foot) {
    const f = el('div', 'rr-foot', card);
    f.style.cssText += ';margin-top:15px;padding-top:12px;border-top:1px solid var(--line);justify-content:space-between';
    const who = el('div', '', f);
    who.style.cssText = 'display:flex;align-items:center;gap:7px';
    el('span', 'av a', who, 'A');
    el('span', '', who, s.by);
    const rel = el('span', 'rr-rel', f);
    el('i', '', rel);
    el('span', '', rel, s.release);
  }
  return card;
}

/** Inspection list; the bathroom row carries a photo-evidence thumbnail. */
export function checklist(parent, s, { x, y, w, items = s.items, pad = 15 }) {
  inject();
  const card = box(parent, 'rr-card', x, y, w);
  card.style.padding = `${pad - 2}px ${pad}px ${pad - 6}px`;
  const hd = el('div', 'rr-list-hd', card);
  el('div', 'lbl ink', hd, s.list).style.cssText = 'font-size:9.5px;color:var(--ink-3)';
  el('span', 'rr-count', hd, `${items.length}/${items.length}`);
  el('div', 'rr-bar', card);
  items.forEach((item, i) => {
    const line = el('div', 'rr-item', card);
    el('span', 'tick', line, '✓');
    el('span', 'sp', line, item);
    if (i === 1) {
      el('span', 'rr-cam', line, s.photoCount);
      const th = el('span', 'rr-thumb', line);
      el('img', '', th).src = asset('bath');
    }
  });
  return card;
}
