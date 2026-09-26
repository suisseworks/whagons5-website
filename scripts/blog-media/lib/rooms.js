// Room cards for the Cleaning scenes, modelled on the app's card view:
// rounded glass cards with the cleaning status, who cleaned last and when,
// a task-count badge, a sweeping band while cleaning and bubbles on clean.
import { clamp, el, seg, set } from './kit.js';

export const STATUS = {
  dirty: { color: '#ef4444', tone: 'dirty' },
  cleaning: { color: '#3b82f6', tone: 'cleaning' },
  clean: { color: '#22c55e', tone: 'clean' },
  inspected: { color: '#8b5cf6', tone: 'inspected' },
};

const css = `
.room { position: absolute; border-radius: 16px; background: rgba(255,255,255,.72); border: 1px solid rgba(255,255,255,.6); box-shadow: 0 4px 18px rgba(60,44,22,.08), 0 1px 2px rgba(60,44,22,.05); overflow: hidden; padding: 10px 11px; }
.room .r-name { font-size: 13px; font-weight: 600; letter-spacing: -.01em; }
.room .r-type { font-size: 10px; color: var(--ink-3); margin-top: 1px; }
.room .r-status { display: inline-flex; align-items: center; gap: 5px; margin-top: 9px; height: 20px; padding: 0 8px; border-radius: 10px; font-size: 10.5px; font-weight: 600; background: #fff; }
.room .r-status i { width: 6px; height: 6px; border-radius: 50%; }
.room .r-last { display: flex; align-items: center; gap: 5px; margin-top: 7px; font-size: 10px; color: var(--ink-3); white-space: nowrap; }
.room .r-last .av { width: 15px; height: 15px; font-size: 7.5px; }
.room .r-badge { position: absolute; top: 8px; right: 8px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: #fef3c7; color: #92400e; font-size: 9.5px; font-weight: 700; display: grid; place-items: center; }
.room .r-sweep { position: absolute; top: 0; bottom: 0; width: 30%; background: linear-gradient(90deg, transparent, rgba(110,231,183,.35), transparent); }
.room .r-glow { position: absolute; inset: 0; border-radius: 16px; box-shadow: inset 0 0 0 1.5px rgba(16,185,129,.4); }
.room.sel { box-shadow: 0 0 0 2px var(--ink), 0 8px 24px rgba(22,21,19,.14); }
.bubble { position: absolute; border-radius: 50%; border: 1.5px solid rgba(16,185,129,.55); background: rgba(209,250,229,.35); }
`;

let injected = false;
function inject() {
  if (injected) return;
  injected = true;
  el('style', '', document.head).textContent = css;
}

/** Create a room card; returns an updater. */
export function roomCard(parent, { x, y, w = 150, h = 96, name, type, labels }) {
  inject();
  const card = el('div', 'room', parent);
  card.style.cssText += `;left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
  const sweep = el('div', 'r-sweep', card);
  const glow = el('div', 'r-glow', card);
  el('div', 'r-name', card, name);
  if (type) el('div', 'r-type', card, type);
  const status = el('div', 'r-status', card);
  const dot = el('i', '', status);
  const statusText = el('span', '', status);
  const last = el('div', 'r-last', card);
  const badge = el('div', 'r-badge', card, '1');
  const bubbles = Array.from({ length: 9 }, (_, i) => {
    const b = el('div', 'bubble', card);
    const size = 6 + ((i * 7) % 9);
    b.style.width = `${size}px`;
    b.style.height = `${size}px`;
    b.style.left = `${8 + ((i * 37) % (w - 20))}px`;
    return { b, size, drift: ((i * 13) % 11) - 5, delay: (i % 5) * 70 };
  });

  /**
   * state: 'dirty' | 'cleaning' | 'clean' | 'inspected'
   * t: time, since: when this state began (for sweep/bubbles), last: text.
   */
  return ({ t, state, since = 0, last: lastText, who, tone = 'a', tasks = 0, selected = false }) => {
    const info = STATUS[state];
    dot.style.background = info.color;
    statusText.textContent = labels[state];
    status.style.color = info.color;
    status.style.boxShadow = `inset 0 0 0 1px ${info.color}55`;
    last.innerHTML = '';
    if (who) {
      const av = el('span', `av ${tone}`, last, who.slice(0, 1));
      av.style.width = '15px';
      av.style.height = '15px';
    }
    el('span', '', last, lastText || '—');
    badge.style.display = tasks > 0 ? 'grid' : 'none';
    badge.textContent = String(tasks);
    card.classList.toggle('sel', selected);

    // Cleaning: a light band sweeps across, looping every 1.6s.
    const cleaning = state === 'cleaning';
    sweep.style.display = cleaning ? 'block' : 'none';
    if (cleaning) sweep.style.left = `${-35 + (((t - since) % 1600) / 1600) * 140}%`;
    glow.style.opacity = cleaning ? String(0.5 + 0.5 * Math.sin((t - since) / 260)) : state === 'clean' ? '0.6' : '0';

    // Clean: bubbles float up for ~1.4s after the change.
    const sinceClean = state === 'clean' ? t - since : -1;
    bubbles.forEach(({ b, size, drift, delay }) => {
      const p = sinceClean < 0 ? -1 : clamp((sinceClean - delay) / 1300);
      if (p < 0 || p >= 1) { b.style.opacity = '0'; return; }
      b.style.opacity = String((1 - p) * 0.9);
      b.style.top = `${h - 10 - p * (h - 4)}px`;
      b.style.transform = `translateX(${drift * p * 3}px) scale(${0.6 + p * 0.6})`;
    });
    const settle = state === 'clean' ? seg(t, since, 420) : 1;
    set(card, { s: state === 'clean' ? 1 + Math.sin(settle * Math.PI) * 0.035 : 1 });
    card.style.opacity = state === 'clean' ? '0.92' : '1';
    return card;
  };
}
