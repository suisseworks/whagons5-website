// Shared pieces for the group chat article: a hotel corridor photo, a busy
// team chat where a request gets lost, and the task it should have been.
import { box, el } from '../../lib/kit.js';

const css = `
.gc-photo { position: absolute; border-radius: 18px; overflow: hidden; background: #d9cdb9;
  box-shadow: 0 2px 4px rgba(60,44,22,.10), 0 30px 70px rgba(60,44,22,.28); }
.gc-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.gc-photo::after { content: ''; position: absolute; inset: 0; border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
  background: linear-gradient(180deg, rgba(22,21,19,.18) 0%, rgba(22,21,19,0) 26%, rgba(22,21,19,0) 70%, rgba(22,21,19,.12) 100%); }
.gc-tag { position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px;
  border-radius: 11px; background: rgba(22,21,19,.62); backdrop-filter: blur(6px); color: #fff;
  font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.gc-tag i { width: 6px; height: 6px; border-radius: 50%; background: #ff5a36; box-shadow: 0 0 0 3px rgba(255,90,54,.25); }
.gc-card { position: absolute; z-index: 3; background: #fff; border-radius: 16px; border: 1px solid rgba(22,21,19,.06);
  box-shadow: 0 1px 2px rgba(60,44,22,.08), 0 22px 50px rgba(60,44,22,.22), 0 6px 14px rgba(60,44,22,.08); }
.gc-hd { display: flex; align-items: center; gap: 9px; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
.gc-gav { width: 26px; height: 26px; border-radius: 50%; background: var(--paper-3); display: grid; place-items: center; flex-shrink: 0; }
.gc-gname { font-size: 12px; font-weight: 600; color: var(--ink); line-height: 1.1; white-space: nowrap; }
.gc-gname small { display: block; font-family: var(--mono); font-size: 8px; color: var(--ink-3); font-weight: 400; letter-spacing: .03em; margin-top: 2px; }
.gc-unread { margin-left: auto; font-family: var(--mono); font-size: 9px; font-weight: 600; color: #fff; background: var(--ink-3); padding: 2px 7px; border-radius: 9px; white-space: nowrap; }
.gc-msg { display: flex; gap: 7px; align-items: flex-start; margin-top: 9px; }
.gc-msg .av { width: 18px; height: 18px; font-size: 8px; margin-top: 1px; }
.gc-bub { background: var(--paper-3); border-radius: 4px 11px 11px 11px; padding: 6px 9px 5px; max-width: 100%; }
.gc-who { font-size: 9px; font-weight: 700; color: var(--ink-2); }
.gc-txt { font-size: 10.5px; color: var(--ink); line-height: 1.3; margin-top: 1px; }
.gc-time { font-family: var(--mono); font-size: 8px; color: var(--ink-4); text-align: right; margin-top: 2px; }
.gc-msg.lost .gc-bub { box-shadow: inset 0 0 0 1.5px rgba(220,38,38,.55); background: #fff5f3; }
.gc-more { margin-top: 9px; text-align: center; font-family: var(--mono); font-size: 8.5px; color: var(--ink-4); letter-spacing: .04em; }
.gc-task { font-size: 15px; font-weight: 600; letter-spacing: -.015em; line-height: 1.2; }
.gc-sub { margin-top: 4px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.gc-pill { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 9px 0 7px; border-radius: 11px;
  background: #eff8ff; color: #175cd3; box-shadow: inset 0 0 0 1px rgba(23,92,211,.25); font-size: 10.5px; font-weight: 600; white-space: nowrap; }
.gc-pill i { width: 6px; height: 6px; border-radius: 50%; background: #2e90fa; }
.gc-foot { display: flex; align-items: center; justify-content: space-between; gap: 7px; font-size: 10.5px; color: var(--ink-3); white-space: nowrap; }
.gc-foot .av { width: 18px; height: 18px; font-size: 8.5px; }
.gc-from { display: inline-flex; align-items: center; gap: 6px; height: 22px; padding: 0 9px; border-radius: 7px; background: var(--red); color: #fff; font-size: 10px; font-weight: 600; white-space: nowrap; box-shadow: 0 6px 16px rgba(212,49,10,.3); }
`;

let injected = false;
function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

const asset = '/assets/group-chat-corridor.jpg';

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
  const node = box(parent, 'gc-photo', x, y, w, h);
  const img = el('img', '', node);
  img.src = asset;
  img.style.objectPosition = pos;
  if (tag) {
    const t = el('div', 'gc-tag', node);
    t.style.cssText = 'left:12px;top:12px';
    el('i', '', t);
    el('span', '', t, tag);
  }
  return node;
}

/** Team chat card. The first message is the request that gets lost. */
export function chat(parent, s, { x, y, w, msgs = 4, pad = 14, more = true }) {
  inject();
  const card = box(parent, 'gc-card', x, y, w);
  card.style.padding = `${pad}px ${pad}px ${pad - 2}px`;
  const hd = el('div', 'gc-hd', card);
  const g = el('div', 'gc-gav', hd);
  g.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16"><circle cx="6" cy="5.5" r="2.4" fill="#78756d"/><circle cx="11.2" cy="6.2" r="1.9" fill="#aaa69c"/><path d="M1.6 13.2c.5-2.4 2.3-3.7 4.4-3.7s3.9 1.3 4.4 3.7" fill="#78756d"/><path d="M10.4 9.6c1.9 0 3.4 1.1 3.9 3.2h-3" fill="#aaa69c"/></svg>';
  const n = el('div', 'gc-gname', hd, s.group);
  el('small', '', n, s.members);
  el('span', 'gc-unread', hd, s.unread);
  s.msgs.slice(0, msgs).forEach(([who, tone, txt, time], i) => {
    const m = el('div', `gc-msg ${i === 0 ? 'lost' : ''}`, card);
    el('span', `av ${tone}`, m, who[0]);
    const b = el('div', 'gc-bub', m);
    el('div', 'gc-who', b, who);
    el('div', 'gc-txt', b, txt);
    el('div', 'gc-time', b, time);
  });
  if (more) el('div', 'gc-more', card, '· · ·');
  return card;
}

/** The task the request became. */
export function taskCard(parent, s, { x, y, w, pad = 16 }) {
  inject();
  const card = box(parent, 'gc-card', x, y, w);
  card.style.padding = `${pad}px ${pad + 1}px`;
  el('div', 'gc-task', card, s.task);
  el('div', 'gc-sub', card, s.spot);
  const f = el('div', 'gc-foot', card);
  f.style.cssText += ';margin-top:13px;padding-top:11px;border-top:1px solid var(--line)';
  const pill = el('span', 'gc-pill', f);
  el('i', '', pill);
  el('span', '', pill, s.status);
  const who = el('div', '', f);
  who.style.cssText = 'display:flex;align-items:center;gap:7px';
  el('span', 'av a', who, 'L');
  el('span', '', who, s.by);
  return card;
}

export function fromBadge(parent, s) {
  inject();
  const b = el('span', 'gc-from', parent);
  b.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  el('span', '', b, s.from);
  return b;
}
