// Tiny deterministic animation kit for blog scenes.
//
// A scene module exports { size, duration, poster, strings, build }.
// build(stage, s, api) creates the DOM once and returns render(t), a pure
// function of the time t in milliseconds. The renderer calls render() for
// every frame and screenshots the stage, so nothing here may depend on real
// time, random numbers or CSS transitions.

export const ease = {
  linear: (x) => x,
  out: (x) => 1 - Math.pow(1 - x, 3),
  outQuart: (x) => 1 - Math.pow(1 - x, 4),
  in: (x) => x * x * x,
  inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outBack: (x) => {
    const c1 = 1.5;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  spring: (x) => 1 - Math.cos(x * Math.PI * 2.5) * Math.exp(-5.5 * x),
};

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;

/** Progress of t through [start, start + dur], eased, clamped to 0..1. */
export function seg(t, start, dur, e = ease.out) {
  if (dur <= 0) return t >= start ? 1 : 0;
  return e(clamp((t - start) / dur));
}

/** 0 → 1 → 0 window: fades in at `start`, holds, fades out at `end`. */
export function win(t, start, end, fade = 300, e = ease.out) {
  return Math.min(seg(t, start, fade, e), 1 - seg(t, end - fade, fade, ease.inOut));
}

/** Create an element. `cls` may be a string; `text` sets textContent. */
export function el(tag, cls, parent, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  if (parent) parent.appendChild(node);
  return node;
}

/** Absolute element at x, y with optional width/height. */
export function box(parent, cls, x, y, w, h, text) {
  const node = el('div', `abs ${cls || ''}`.trim(), parent, text);
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  if (w != null) node.style.width = `${w}px`;
  if (h != null) node.style.height = `${h}px`;
  return node;
}

/** Apply opacity + transform in one call. */
export function set(node, { o, x = 0, y = 0, s = 1, sx, sy, r = 0, origin } = {}) {
  if (!node) return;
  if (o != null) node.style.opacity = String(clamp(o));
  if (origin) node.style.transformOrigin = origin;
  const scaleX = sx ?? s;
  const scaleY = sy ?? s;
  node.style.transform = `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY}) rotate(${r}deg)`;
}

/** Common "rise in" entrance driven by progress p (0..1). */
export function rise(node, p, dist = 14) {
  set(node, { o: p, y: (1 - p) * dist });
}

/** Pop in with a little overshoot. */
export function pop(node, p) {
  set(node, { o: clamp(p * 1.6), s: lerp(0.86, 1, ease.outBack(clamp(p))) });
}

/** Reveal `text` progressively; returns true while typing. */
export function type(node, text, p, caret = false) {
  const count = Math.round(clamp(p) * text.length);
  node.textContent = text.slice(0, count);
  if (caret && p > 0 && p < 1) el('span', 'caret', node);
  return p > 0 && p < 1;
}

/** Integer count-up with optional formatter. */
export function count(node, from, to, p, format = (v) => String(v)) {
  node.textContent = format(Math.round(lerp(from, to, clamp(p))));
}

/** Toggle a class based on a condition (deterministic state). */
export function flag(node, cls, on) {
  if (node) node.classList.toggle(cls, Boolean(on));
}

// ── Components ───────────────────────────────────────────

export function avatar(parent, initials, tone = 'a') {
  return el('span', `av ${tone}`, parent, initials);
}

export function pill(parent, label, tone = 'todo') {
  return el('span', `pill ${tone}`, parent, label);
}

/** Set a pill's label + tone in place. */
export function setPill(node, label, tone) {
  node.className = `pill ${tone}`;
  node.textContent = label;
}

export function button(parent, label, kind = '') {
  return el('span', `btn ${kind}`.trim(), parent, label);
}

export function chip(parent, label) {
  const node = el('span', 'chip', parent);
  el('span', 'box', node, '✓');
  el('span', '', node, label);
  return node;
}

export function toggle(parent) {
  const node = el('span', 'toggle', parent);
  el('i', '', node);
  return node;
}

export function setToggle(node, p) {
  const knob = node.firstChild;
  knob.style.transform = `translateX(${p * 12}px)`;
  node.classList.toggle('on', p > 0.5);
}

/** Lower-third instruction caption with numbered steps. */
export function caption(stage, steps) {
  const node = el('div', 'caption', stage);
  const num = el('span', 'n', node);
  const text = el('span', '', node);
  return (t) => {
    let active = -1;
    steps.forEach((step, index) => { if (t >= step.at) active = index; });
    if (active < 0) { set(node, { o: 0, y: 8 }); return; }
    const step = steps[active];
    const next = steps[active + 1];
    const end = step.until ?? (next ? next.at : Infinity);
    const inP = seg(t, step.at, 380);
    const outP = end === Infinity ? 0 : seg(t, end - 260, 260, ease.inOut);
    num.textContent = step.n ?? String(active + 1).padStart(2, '0');
    text.textContent = step.text;
    set(node, { o: inP * (1 - outP), y: (1 - inP) * 10 + outP * 6 });
  };
}

/**
 * Pointer that glides between keyframes: [{ at, x, y, click }]. Clicks draw a
 * ripple. Returns render(t) and `pressed(t, at)` to sync button presses.
 */
export function cursor(stage, keys) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 22 22');
  svg.setAttribute('class', 'cursor');
  svg.innerHTML = '<path d="M4 2.5v15.2l4.1-3.9 2.7 6 2.9-1.3-2.7-5.9 5.7-.2z" fill="#161513" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>';
  stage.appendChild(svg);
  const ripple = el('div', 'ripple', stage);
  const clicks = keys.filter((k) => k.click);

  const render = (t) => {
    let x = keys[0].x;
    let y = keys[0].y;
    for (let i = 0; i < keys.length - 1; i += 1) {
      const a = keys[i];
      const b = keys[i + 1];
      if (t >= a.at && t <= b.at) {
        const p = ease.inOut(clamp((t - a.at - (a.hold ?? 0)) / Math.max(1, b.at - a.at - (a.hold ?? 0))));
        x = lerp(a.x, b.x, p);
        y = lerp(a.y, b.y, p);
        break;
      }
      if (t > b.at) { x = b.x; y = b.y; }
    }
    const visible = keys.find((k) => k.hide != null);
    let o = seg(t, keys[0].at, 250);
    if (visible && t >= visible.hide) o *= 1 - seg(t, visible.hide, 250);
    const press = clicks.some((k) => t >= k.at && t < k.at + 140);
    svg.style.opacity = String(o);
    svg.style.transform = `translate(${x - 4}px, ${y - 2}px) scale(${press ? 0.88 : 1})`;
    const click = [...clicks].reverse().find((k) => t >= k.at && t < k.at + 520);
    if (click) {
      const p = clamp((t - click.at) / 520);
      ripple.style.left = `${click.x}px`;
      ripple.style.top = `${click.y}px`;
      ripple.style.opacity = String((1 - p) * 0.9 * o);
      ripple.style.transform = `scale(${0.4 + p * 0.9})`;
    } else {
      ripple.style.opacity = '0';
    }
  };
  const pressed = (t, at) => t >= at && t < at + 160;
  return { render, pressed };
}

/** Sand veil for a seamless loop: fades out at start, back in at the end. */
export function loopVeil(stage, duration, fadeIn = 450, fadeOut = 550) {
  const node = el('div', 'veil', stage);
  return (t) => {
    const start = 1 - seg(t, 0, fadeIn, ease.inOut);
    const end = seg(t, duration - fadeOut, fadeOut, ease.inOut);
    node.style.opacity = String(Math.max(start, end));
  };
}

/** Center of `node` in stage coordinates (layout must be final). */
export function center(stage, node, dx = 0, dy = 0) {
  const a = stage.getBoundingClientRect();
  const b = node.getBoundingClientRect();
  return { x: Math.round(b.left - a.left + b.width / 2 + dx), y: Math.round(b.top - a.top + b.height / 2 + dy) };
}

/** Mount a scene module on #stage. Used by host.html. */
export async function mount(scene, { lang }) {
  const stage = document.getElementById('stage');
  const [w, h] = scene.size;
  stage.style.width = `${w}px`;
  stage.style.height = `${h}px`;
  const strings = scene.strings ? scene.strings[lang] ?? scene.strings.es : {};
  const render = await scene.build(stage, strings, { lang, w, h, duration: scene.duration });
  render(0);
  return { render, duration: scene.duration, poster: scene.poster ?? 0, size: scene.size, still: Boolean(scene.still) };
}
