'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import type { Language } from '../../../lib/locales';
import {
  ALL_TYPES, BOOT, COUNTRY_PLUGS, DEFAULT_COUNTRY, OTHER, STANDARDS, drawPlug, guessCountry, outline, toPath, typesFor,
  type PlugDrawing, type PlugType,
} from './plugs';
import styles from './Socket.module.css';

/*
 * The hero's wall socket: an outlet in the visitor's local standard, and the
 * mosaic's cable lying on the floor with its plug. Drag the plug in, click or
 * tap it, or press Enter/Space on it. The cable is a Verlet rope drawn in an
 * SVG over the hero; the plug is drawn in pseudo-3D and turns from hanging
 * (pins visible) to facing the wall as it nears the outlet.
 */

const COPY = {
  es: {
    invite: 'Conecta tu empresa. Hazlo a tu manera.',
    connected: 'Tu forma de trabajar. Todo conectado.',
    hintPointer: 'Arrastra el enchufe hasta el tomacorriente o haz clic en él.',
    hintTouch: 'Toca el enchufe para conectarlo.',
    hintOff: 'Haz clic en el enchufe para desconectarlo.',
    hintOffTouch: 'Tócalo de nuevo para desconectarlo.',
    plug: 'Conectar el enchufe de Whagons al tomacorriente',
    unplug: 'Desconectar el enchufe de Whagons',
    country: 'País del tomacorriente',
    type: 'Tipo',
    types: 'Formato del enchufe',
    other: 'Otro país',
  },
  en: {
    invite: 'Plug in your business. Your way.',
    connected: 'Your way of working. All connected.',
    hintPointer: 'Drag the plug to the outlet, or click it.',
    hintTouch: 'Tap the plug to connect it.',
    hintOff: 'Click the plug to disconnect it.',
    hintOffTouch: 'Tap it again to disconnect.',
    plug: 'Plug Whagons into the outlet',
    unplug: 'Unplug Whagons',
    country: 'Outlet country',
    type: 'Type',
    types: 'Plug standard',
    other: 'Other country',
  },
} as const;

const STORE_KEY = 'whagons-plug';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const N = 26;
const CABLE = 6.5;

type Mode = 'rest' | 'drag' | 'seat' | 'plugged' | 'pull';
interface Vec { x: number; y: number }

interface Props {
  lang: Language;
  connected: boolean;
  onConnect: (via: 'drag' | 'click' | 'keyboard') => void;
  onDisconnect: () => void;
  heroRef: RefObject<HTMLElement>;
  portRef: RefObject<HTMLElement>;
  reducedMotion: boolean;
  /** Increments to send a pulse of light down the cable. */
  pulse: number;
  onPulseArrive: () => void;
}

export default function Socket({ lang, connected, onConnect, onDisconnect, heroRef, portRef, reducedMotion, pulse, onPulseArrive }: Props) {
  const t = COPY[lang];
  const uid = useId().replace(/:/g, '');

  /* ── Standard: saved choice, then detection, then the main market ── */
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY[lang]);
  const [type, setType] = useState<PlugType>(COUNTRY_PLUGS[DEFAULT_COUNTRY[lang]][0]);
  const [touch, setTouch] = useState(false);
  const manual = useRef(false);

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches);
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORE_KEY) || 'null');
      if (saved && typeof saved.country === 'string' && ALL_TYPES.includes(saved.type)) {
        manual.current = true;
        setCountry(saved.country);
        setType(saved.type);
        return;
      }
    } catch { /* storage unavailable */ }
    const guess = guessCountry();
    if (guess && COUNTRY_PLUGS[guess]) { setCountry(guess); setType(COUNTRY_PLUGS[guess][0]); }
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    fetch('/api/geo', { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then((data: { country?: string | null } | null) => {
        const code = data?.country;
        if (!manual.current && code && COUNTRY_PLUGS[code]) { setCountry(code); setType(COUNTRY_PLUGS[code][0]); }
      })
      .catch(() => { /* keep the guess */ })
      .finally(() => window.clearTimeout(timer));
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, []);

  const choose = (nextCountry: string, nextType?: PlugType) => {
    const list = typesFor(nextCountry);
    const chosen = nextType && list.includes(nextType) ? nextType : list.includes(type) && nextCountry === OTHER ? type : list[0];
    manual.current = true;
    setCountry(nextCountry);
    setType(chosen);
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify({ country: nextCountry, type: chosen })); } catch { /* ignore */ }
  };

  const countries = useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try { names = new Intl.DisplayNames([lang], { type: 'region' }); } catch { /* old browser */ }
    return Object.keys(COUNTRY_PLUGS)
      .map(code => ({ code, name: names?.of(code) ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name, lang));
  }, [lang]);
  const types = typesFor(country);

  /* ── Geometry and physics ─────────────────────────── */
  const plateRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const els = useRef<Record<string, SVGElement | null>>({});
  const set = (key: string) => (el: SVGElement | null) => { els.current[key] = el; };

  const sim = useRef({
    x: new Float64Array(N + 1), y: new Float64Array(N + 1), ox: new Float64Array(N + 1), oy: new Float64Array(N + 1),
    seg: 10, ready: false, w: 0, h: 0, k: 1,
    anchor: { x: 0, y: 0 } as Vec, socket: { x: 0, y: 0 } as Vec, rest: { x: 0, y: 0 } as Vec, floor: 0,
    mode: (connected ? 'plugged' : 'rest') as Mode, target: { x: 0, y: 0 } as Vec,
    theta: 90, phi: 90, scale: 1,
    tween: null as null | { from: Vec; to: Vec; ctrl: Vec; t0: number; dur: number; theta0: number; phi0: number; done: () => void },
    raf: 0, still: 0, drawn: '' as string, drawing: null as PlugDrawing | null, type: type as PlugType,
  });
  const callbacks = useRef({ onConnect, onDisconnect, onPulseArrive });
  callbacks.current = { onConnect, onDisconnect, onPulseArrive };

  const plugDrawing = useCallback((s: typeof sim.current) => {
    const key = `${s.type}:${Math.round(s.theta * 2) / 2}:${s.k.toFixed(3)}`;
    if (key !== s.drawn || !s.drawing) {
      s.drawing = drawPlug(s.type, s.theta, s.k);
      s.drawn = key;
      const d = s.drawing;
      els.current.side?.setAttribute('d', d.side);
      els.current.sideEdge?.setAttribute('d', d.side);
      els.current.rear?.setAttribute('d', d.rear);
      els.current.boot?.setAttribute('d', d.boot);
      els.current.bootEnd?.setAttribute('d', d.bootEnd);
      const pins = els.current.pins;
      if (pins) {
        while (pins.childNodes.length > d.pins.length) pins.removeChild(pins.lastChild!);
        d.pins.forEach((path, i) => {
          let el = pins.childNodes[i] as SVGPathElement | undefined;
          if (!el) { el = document.createElementNS('http://www.w3.org/2000/svg', 'path'); el.setAttribute('fill', `url(#${uid}metal)`); pins.appendChild(el); }
          el.setAttribute('d', path);
        });
      }
    }
    return s.drawing;
  }, [uid]);

  const render = useCallback(() => {
    const s = sim.current;
    if (!s.ready) return;
    // Cable, from the plug to the mosaic (the pulse travels in this direction).
    let d = `M${s.x[N].toFixed(1)} ${s.y[N].toFixed(1)}`;
    for (let i = N - 1; i > 0; i--) {
      const mx = (s.x[i] + s.x[i - 1]) / 2, my = (s.y[i] + s.y[i - 1]) / 2;
      d += `Q${s.x[i].toFixed(1)} ${s.y[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    d += `L${s.x[0].toFixed(1)} ${s.y[0].toFixed(1)}`;
    for (const key of ['cable', 'braid', 'shine', 'shadow', 'pulse', 'glow']) els.current[key]?.setAttribute('d', d);
    plugDrawing(s);
    const off = attachOffset(s);
    const plug = els.current.plug;
    plug?.setAttribute('transform', `translate(${s.x[N].toFixed(2)} ${s.y[N].toFixed(2)}) rotate(${s.phi.toFixed(2)}) translate(0 ${off.toFixed(2)}) scale(${s.scale.toFixed(4)})`);
    // In front of the plug when it faces the wall (the cable comes towards us), behind it when it hangs.
    const front = s.theta < 45;
    els.current.under?.setAttribute('visibility', front ? 'hidden' : 'visible');
    els.current.over?.setAttribute('visibility', front ? 'visible' : 'hidden');
    // Contact shadow: tight on the plate, soft below a hanging plug.
    const shadow = els.current.plugShadow;
    if (shadow) {
      const lying = Math.abs(Math.abs(s.phi) - 90) < 30 && s.mode === 'rest';
      shadow.setAttribute('opacity', s.mode === 'plugged' ? '.5' : lying ? '.0' : '.28');
    }
    const button = buttonRef.current;
    if (button) {
      const a = (s.phi * Math.PI) / 180;
      const depth = STANDARDS[s.type].body.depth;
      const along = off - (depth / 2) * Math.sin((s.theta * Math.PI) / 180) * s.k;
      const cx = s.x[N] - Math.sin(a) * along;
      const cy = s.y[N] + Math.cos(a) * along;
      button.style.transform = `translate(${(cx - 32).toFixed(1)}px, ${(cy - 32).toFixed(1)}px)`;
    }
  }, [plugDrawing]);

  const step = useCallback((dt: number) => {
    const s = sim.current;
    const g = 2400, damp = 0.986;
    const pinned = s.mode !== 'rest';
    for (let i = 1; i <= N; i++) {
      if (i === N && pinned) continue;
      const vx = (s.x[i] - s.ox[i]) * damp, vy = (s.y[i] - s.oy[i]) * damp;
      s.ox[i] = s.x[i]; s.oy[i] = s.y[i];
      s.x[i] += vx; s.y[i] += vy + g * dt * dt;
    }
    s.x[0] = s.anchor.x; s.y[0] = s.anchor.y;
    if (pinned) { s.x[N] = s.target.x; s.y[N] = s.target.y; }
    const endFloor = s.floor - plugBelow(s);
    for (let it = 0; it < 22; it++) {
      for (let i = 0; i < N; i++) {
        const dx = s.x[i + 1] - s.x[i], dy = s.y[i + 1] - s.y[i];
        const dist = Math.hypot(dx, dy) || 1e-6;
        const diff = (dist - s.seg) / dist;
        const w0 = i === 0 ? 0 : 1;
        const w1 = i + 1 === N ? (pinned ? 0 : 0.5) : 1;
        const sum = w0 + w1;
        if (!sum) continue;
        s.x[i] += dx * diff * (w0 / sum); s.y[i] += dy * diff * (w0 / sum);
        s.x[i + 1] -= dx * diff * (w1 / sum); s.y[i + 1] -= dy * diff * (w1 / sum);
      }
      for (let i = 1; i <= N; i++) {
        if (i === N && pinned) continue;
        const limit = i === N ? endFloor : s.floor - CABLE / 2;
        if (s.y[i] > limit) s.y[i] = limit;
        if (s.x[i] < 4) s.x[i] = 4;
        if (s.x[i] > s.w - 4) s.x[i] = s.w - 4;
      }
    }
    // On the floor: no bounce, and friction along it.
    for (let i = 1; i <= N; i++) {
      if (i === N && pinned) continue;
      const limit = i === N ? endFloor : s.floor - CABLE / 2;
      if (s.y[i] >= limit - 0.5) { s.oy[i] = s.y[i]; s.ox[i] = s.x[i] - (s.x[i] - s.ox[i]) * 0.5; }
    }
  }, []);

  const orient = useCallback((now: number) => {
    const s = sim.current;
    const tw = s.tween;
    if (tw) {
      const p = Math.min(1, (now - tw.t0) / tw.dur);
      const e = 1 - Math.pow(1 - p, 3);
      const u = 1 - e;
      s.target = {
        x: u * u * tw.from.x + 2 * u * e * tw.ctrl.x + e * e * tw.to.x,
        y: u * u * tw.from.y + 2 * u * e * tw.ctrl.y + e * e * tw.to.y,
      };
      s.theta = tw.theta0 + (0 - tw.theta0) * Math.min(1, e * 1.25);
      s.phi = lerpAngle(tw.phi0, 0, Math.min(1, e * 1.25));
      s.scale = 1 + 0.07 * Math.sin(Math.min(1, e) * Math.PI / 2);
      if (p >= 1) { s.tween = null; tw.done(); }
      return;
    }
    if (s.mode === 'plugged') { s.theta = 0; s.phi = 0; return; }
    if (s.mode === 'seat' || s.mode === 'pull') return;
    // Hanging or lying: the pins point away from the cable.
    const dx = s.x[N] - s.x[N - 2], dy = s.y[N] - s.y[N - 2];
    let phi = (Math.atan2(dy, dx) * 180) / Math.PI - 90;
    const lying = s.mode === 'rest' && s.y[N] >= s.floor - plugBelow(s) - 1.5;
    if (lying) phi = Math.abs(normalize(phi) - 90) < Math.abs(normalize(phi) + 90) ? 90 : -90;
    let theta = 90;
    if (s.mode === 'drag') {
      const dist = Math.hypot(s.x[N] - s.socket.x, s.y[N] - s.socket.y);
      const near = clamp(1 - (dist - 24) / 200, 0, 1);
      theta = 90 * (1 - easeInOut(near));
      phi = lerpAngle(phi, 0, easeInOut(near));
    }
    s.theta += (theta - s.theta) * 0.3;
    s.phi = lerpAngle(s.phi, phi, 0.28);
    s.scale += ((s.mode === 'drag' ? 1.04 : 1) - s.scale) * 0.25;
  }, []);

  const loop = useCallback(() => {
    const s = sim.current;
    cancelAnimationFrame(s.raf);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const before = s.x[N] + s.y[N] + s.x[N >> 1] + s.y[N >> 1] + s.theta + s.phi;
      orient(now);
      step(dt / 2); step(dt / 2);
      render();
      const after = s.x[N] + s.y[N] + s.x[N >> 1] + s.y[N >> 1] + s.theta + s.phi;
      s.still = Math.abs(after - before) < 0.02 && !s.tween && s.mode !== 'drag' ? s.still + 1 : 0;
      if (s.still < 45) s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  }, [orient, render, step]);

  /** Measure the hero and lay the cable on the floor (or plug it in), settled. */
  const layout = useCallback(() => {
    const s = sim.current;
    const hero = heroRef.current, port = portRef.current, plate = plateRef.current;
    if (!hero || !port || !plate) return;
    const hb = hero.getBoundingClientRect();
    const pb = port.getBoundingClientRect();
    const plb = plate.getBoundingClientRect();
    if (!hb.width || !pb.width || !plb.width) return;
    s.w = hb.width; s.h = hb.height;
    svgRef.current?.setAttribute('viewBox', `0 0 ${s.w} ${s.h}`);
    s.k = plb.width / STANDARDS[s.type].plate.w;
    s.anchor = { x: pb.left - hb.left + pb.width / 2, y: pb.bottom - hb.top - 2 };
    s.socket = { x: plb.left - hb.left + plb.width / 2, y: plb.top - hb.top + plb.height / 2 };
    s.floor = hb.height - (hb.width < 768 ? 14 : 22);
    // Just long enough to reach the outlet with a little sag. At rest it drops
    // from the mosaic to the floor and runs along it towards the outlet, so the
    // plug lies on the floor below it.
    const reach = Math.hypot(s.anchor.x - s.socket.x, s.anchor.y - s.socket.y);
    const lie = s.floor - CABLE / 2;
    const drop = Math.max(0, lie - s.anchor.y);
    // Long enough for the plug to lie on the floor too, when the port is high above it.
    const length = Math.max(reach * 1.09, drop + 90, 200);
    s.seg = length / N;
    const dir = s.socket.x < s.anchor.x ? -1 : 1;
    const room = dir < 0 ? s.anchor.x - 24 : s.w - 24 - s.anchor.x;
    for (let i = 0; i <= N; i++) {
      const d = i * s.seg;
      let p: Vec;
      if (d <= drop) p = { x: s.anchor.x, y: s.anchor.y + d };
      else {
        // Along the floor; if the floor runs out, the rest coils back.
        const along = d - drop;
        const fold = Math.floor(along / Math.max(1, room));
        const rem = along - fold * room;
        const out = fold % 2 === 0 ? rem : room - rem;
        p = { x: s.anchor.x + dir * out, y: lie };
      }
      s.x[i] = s.ox[i] = p.x; s.y[i] = s.oy[i] = p.y;
    }
    s.tween = null;
    if (s.mode === 'plugged' || s.mode === 'seat' || s.mode === 'pull') { s.mode = 'plugged'; s.target = { ...s.socket }; s.theta = 0; s.phi = 0; s.scale = 1; }
    else { s.mode = 'rest'; s.theta = 90; s.phi = dir < 0 ? 90 : -90; s.scale = 1; }
    s.ready = true;
    plugDrawing(s);
    // The plug lies on its side, its body resting on the floor.
    if (s.mode === 'rest') s.y[N] = s.oy[N] = s.floor - plugBelow(s);
    s.rest = { x: s.x[N], y: s.y[N] };
    for (let i = 0; i < 360; i++) { orient(0); step(1 / 120); }
    render();
  }, [heroRef, portRef, orient, plugDrawing, render, step]);

  useIsoLayoutEffect(() => {
    sim.current.type = type;
    sim.current.drawn = '';
    layout();
  }, [type, layout]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let frame = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(layout); });
    ro.observe(hero);
    if (portRef.current) ro.observe(portRef.current);
    // Web fonts can move the outlet once they load.
    document.fonts?.ready.then(() => layout()).catch(() => {});
    const state = sim.current;
    return () => { ro.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(state.raf); };
  }, [heroRef, portRef, layout]);

  /* ── Connecting and disconnecting ─────────────────── */
  const seat = useCallback((via: 'drag' | 'click' | 'keyboard') => {
    const s = sim.current;
    if (reducedMotion) {
      s.mode = 'plugged'; s.target = { ...s.socket }; s.theta = 0; s.phi = 0; s.scale = 1; s.tween = null;
      for (let i = 0; i < 240; i++) step(1 / 120);
      render();
      callbacks.current.onConnect(via);
      return;
    }
    const from = { x: s.x[N], y: s.y[N] };
    const far = Math.hypot(from.x - s.socket.x, from.y - s.socket.y) > 60;
    s.mode = 'seat';
    s.tween = {
      from, to: { ...s.socket },
      // Keep the cable off the copy beside the outlet: round the open side, or
      // stay low and rise into the socket when coming from the copy's side.
      ctrl: !far
        ? { x: (from.x + s.socket.x) / 2, y: (from.y + s.socket.y) / 2 }
        : (from.x - s.socket.x) * side(s) < 0
          ? { x: clamp(Math.min(from.x, s.socket.x) - 60, 12, s.w - 12), y: (from.y + s.socket.y) / 2 + 10 }
          : { x: s.socket.x + (from.x - s.socket.x) * 0.25, y: Math.max(from.y, s.socket.y) + 6 },
      t0: performance.now(), dur: far ? 760 : 260, theta0: s.theta, phi0: s.phi,
      done: () => {
        s.mode = 'plugged';
        s.target = { ...s.socket };
        // The last few millimetres: the plug sinks into the socket and seats.
        const t0 = performance.now();
        const settle = (now: number) => {
          const p = Math.min(1, (now - t0) / 220);
          s.scale = 1 + 0.07 * (1 - p) - 0.012 * Math.sin(p * Math.PI);
          render();
          if (p < 1) requestAnimationFrame(settle);
          else { s.scale = 1; render(); callbacks.current.onConnect(via); }
        };
        requestAnimationFrame(settle);
      },
    };
    loop();
  }, [loop, reducedMotion, render, step]);

  const unplug = useCallback((thenDrag = false) => {
    const s = sim.current;
    callbacks.current.onDisconnect();
    if (reducedMotion || thenDrag) {
      s.mode = thenDrag ? 'drag' : 'rest';
      s.tween = null;
      if (reducedMotion && !thenDrag) { layout(); return; }
      loop();
      return;
    }
    s.mode = 'pull';
    const t0 = performance.now();
    const pull = (now: number) => {
      const p = Math.min(1, (now - t0) / 200);
      s.scale = 1 + 0.08 * p;
      s.theta = 22 * p;
      render();
      if (p < 1) requestAnimationFrame(pull);
      else { s.mode = 'rest'; s.ox[N] = s.x[N] - 1.5; s.oy[N] = s.y[N] + 1; loop(); }
    };
    requestAnimationFrame(pull);
  }, [layout, loop, reducedMotion, render]);

  // Keep the drawing in step with the parent (e.g. a reset elsewhere).
  useEffect(() => {
    const s = sim.current;
    if (!connected && (s.mode === 'plugged')) { s.mode = 'rest'; loop(); }
  }, [connected, loop]);

  /* ── Pointer and keyboard ─────────────────────────── */
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean; wasPlugged: boolean } | null>(null);
  const toLocal = (e: { clientX: number; clientY: number }): Vec => {
    const hb = heroRef.current!.getBoundingClientRect();
    return { x: e.clientX - hb.left, y: e.clientY - hb.top };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || sim.current.mode === 'seat' || sim.current.mode === 'pull') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, wasPlugged: sim.current.mode === 'plugged' };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || reducedMotion) return;
    const s = sim.current;
    if (!d.moved) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
      d.moved = true;
      if (d.wasPlugged) unplug(true);
      s.mode = 'drag';
      s.tween = null;
      loop();
    }
    let p = toLocal(e);
    // The cable can't stretch; near the outlet the plug is drawn in.
    const reach = s.seg * N * 0.97;
    const da = Math.hypot(p.x - s.anchor.x, p.y - s.anchor.y);
    if (da > reach) p = { x: s.anchor.x + ((p.x - s.anchor.x) / da) * reach, y: s.anchor.y + ((p.y - s.anchor.y) / da) * reach };
    const ds = Math.hypot(p.x - s.socket.x, p.y - s.socket.y);
    const pullIn = clamp(1 - (ds - 18) / 70, 0, 1) * 0.55;
    s.target = { x: p.x + (s.socket.x - p.x) * pullIn, y: Math.min(s.floor - 8, p.y + (s.socket.y - p.y) * pullIn) };
    if (s.still) loop();
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const s = sim.current;
    if (!d.moved) {
      if (d.wasPlugged) unplug(); else seat('click');
      return;
    }
    const ds = Math.hypot(s.x[N] - s.socket.x, s.y[N] - s.socket.y);
    if (ds < Math.max(46, (STANDARDS[s.type].plate.w * s.k) * 0.62)) seat('drag');
    else { s.mode = 'rest'; loop(); }
  };
  const onKeyClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    // Pointer clicks are handled on pointer up; this is Enter or Space.
    if (e.detail !== 0) return;
    if (sim.current.mode === 'plugged') unplug(); else if (sim.current.mode === 'rest') seat('keyboard');
  };
  const onPlateClick = () => { if (sim.current.mode === 'rest') seat('click'); };

  /* ── Pulse of light along the cable ───────────────── */
  const [pulseOn, setPulseOn] = useState(0);
  useEffect(() => {
    if (!pulse) return;
    if (reducedMotion) { callbacks.current.onPulseArrive(); return; }
    setPulseOn(pulse);
  }, [pulse, reducedMotion]);
  useEffect(() => { if (pulseOn) render(); }, [pulseOn, render]);

  const std = STANDARDS[type];
  const hint = connected ? (touch ? t.hintOffTouch : t.hintOff) : (touch ? t.hintTouch : t.hintPointer);

  return <div className={styles.panel} data-connected={connected || undefined}>
    <div className={styles.plateBox} onClick={onPlateClick} aria-hidden="true">
      <div ref={plateRef} className={styles.plate} style={{ '--pw': std.plate.w, '--ph': std.plate.h } as CSSProperties}>
        <OutletFace type={type} on={connected} uid={uid} />
      </div>
    </div>
    <div className={styles.copy}>
      <p className={styles.invite} aria-live="polite">{connected ? t.connected : t.invite}</p>
      <p className={styles.hint}>{hint}</p>
      <div className={styles.standard}>
        <label className={styles.select}>
          <span className="sr-only">{t.country}</span>
          <select value={country} onChange={e => choose(e.target.value)}>
            {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            <option value={OTHER}>{t.other}</option>
          </select>
        </label>
        {types.length > 1
          ? <fieldset className={styles.types}>
            <legend className="sr-only">{t.types}</legend>
            {types.map(code => <label key={code}><input type="radio" name={`${uid}type`} value={code} checked={code === type} onChange={() => choose(country, code)} /><span>{t.type} {code}</span></label>)}
          </fieldset>
          : <span className={styles.single}>{t.type} {type}</span>}
      </div>
    </div>

    <svg ref={svgRef} className={styles.overlay} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf8f2" /><stop offset=".55" stopColor="#e9e2d5" /><stop offset="1" stopColor="#c9c0b0" />
        </linearGradient>
        <linearGradient id={`${uid}edge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b2f22" stopOpacity=".38" /><stop offset=".18" stopColor="#3b2f22" stopOpacity=".06" />
          <stop offset=".42" stopColor="#fff" stopOpacity=".35" /><stop offset=".6" stopColor="#fff" stopOpacity="0" />
          <stop offset=".84" stopColor="#3b2f22" stopOpacity=".12" /><stop offset="1" stopColor="#3b2f22" stopOpacity=".42" />
        </linearGradient>
        <radialGradient id={`${uid}rear`} cx=".38" cy=".3" r=".85">
          <stop offset="0" stopColor="#fffdf8" /><stop offset=".6" stopColor="#f1ebe0" /><stop offset="1" stopColor="#ddd5c7" />
        </radialGradient>
        <linearGradient id={`${uid}boot`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cfc6b6" /><stop offset=".45" stopColor="#efe9df" /><stop offset="1" stopColor="#bcb2a1" />
        </linearGradient>
        <linearGradient id={`${uid}metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c5c22" /><stop offset=".32" stopColor="#d9b56a" /><stop offset=".5" stopColor="#fff0c4" />
          <stop offset=".68" stopColor="#c69a4b" /><stop offset="1" stopColor="#6e5120" />
        </linearGradient>
        <filter id={`${uid}soft`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id={`${uid}glow`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2" /></filter>
        <g id={`${uid}cable`}>
          <path ref={set('cable')} fill="none" stroke="#b5370f" strokeWidth={CABLE} strokeLinecap="round" strokeLinejoin="round" />
          <path ref={set('braid')} fill="none" stroke="#5a1704" strokeOpacity=".38" strokeWidth={CABLE} strokeDasharray="1.1 2.3" strokeLinecap="butt" />
          <path ref={set('shine')} fill="none" stroke="#ffb48f" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round" transform="translate(-.6 -1.4)" />
        </g>
      </defs>
      <path ref={set('shadow')} className={styles.cableShadow} fill="none" strokeWidth={CABLE + 3} strokeLinecap="round" transform="translate(0 7)" filter={`url(#${uid}soft)`} />
      <use ref={set('under')} href={`#${uid}cable`} />
      <g ref={set('plug')}>
        <ellipse ref={set('plugShadow')} cx="0" cy="6" rx="26" ry="22" fill="#000" opacity=".28" filter={`url(#${uid}soft)`} />
        <g ref={set('pins')} />
        <path ref={set('side')} fill={`url(#${uid}body)`} stroke="#8a7d68" strokeOpacity=".35" strokeWidth=".6" />
        <path ref={set('sideEdge')} fill={`url(#${uid}edge)`} />
        <path ref={set('rear')} fill={`url(#${uid}rear)`} stroke="#fff" strokeOpacity=".7" strokeWidth=".8" />
        <path ref={set('boot')} fill={`url(#${uid}boot)`} />
        <path ref={set('bootEnd')} fill="#b9ae9b" />
      </g>
      <use ref={set('over')} href={`#${uid}cable`} visibility="hidden" />
      {pulseOn > 0 && <g key={pulseOn} className={styles.pulse} onAnimationEnd={e => { if (e.target === e.currentTarget.lastChild) { setPulseOn(0); callbacks.current.onPulseArrive(); } }}>
        <path ref={set('glow')} pathLength={1} filter={`url(#${uid}glow)`} />
        <path ref={set('pulse')} pathLength={1} />
      </g>}
    </svg>

    <button
      ref={buttonRef}
      type="button"
      className={styles.plug}
      aria-pressed={connected}
      aria-label={connected ? t.unplug : t.plug}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onKeyClick}
    />
  </div>;
}

/** The outlet face, front on, in millimetres. */
function OutletFace({ type, on, uid }: { type: PlugType; on: boolean; uid: string }) {
  const std = STANDARDS[type];
  const { w, h, r } = std.plate;
  const socket = toPath(outline(std.socket.shape));
  const id = `${uid}o`;
  const half = std.socket.shape.kind === 'circle' ? std.socket.shape.d / 2 : 'h' in std.socket.shape ? std.socket.shape.h / 2 : 18;
  const ledY = h / 2 - Math.min(9, (h / 2 - half) / 2);
  return <svg className={styles.face} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
    <defs>
      <linearGradient id={`${id}p`} x1="0" y1="0" x2=".7" y2="1">
        <stop offset="0" stopColor="#fcfaf5" /><stop offset=".55" stopColor="#f0eadf" /><stop offset="1" stopColor="#ddd5c7" />
      </linearGradient>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#6b5f4c" stopOpacity=".35" />
      </linearGradient>
      <radialGradient id={`${id}r`} cx=".5" cy=".42" r=".6">
        <stop offset="0" stopColor="#efe9de" /><stop offset=".7" stopColor="#e1d9cb" /><stop offset="1" stopColor="#c8bfaf" />
      </radialGradient>
      <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a3f30" stopOpacity=".55" /><stop offset=".45" stopColor="#4a3f30" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".9" />
      </linearGradient>
      <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f3f1ec" /><stop offset=".5" stopColor="#b9b4aa" /><stop offset="1" stopColor="#8e877b" />
      </linearGradient>
      <radialGradient id={`${id}g`}><stop offset="0" stopColor="#ff8a52" stopOpacity=".55" /><stop offset="1" stopColor="#ff8a52" stopOpacity="0" /></radialGradient>
    </defs>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={`url(#${id}p)`} />
    <rect x={-w / 2 + .5} y={-h / 2 + .5} width={w - 1} height={h - 1} rx={r - .5} fill="none" stroke={`url(#${id}b)`} strokeWidth="1" />
    <circle className={styles.halo} cx="0" cy="0" r={half + 9} fill={`url(#${id}g)`} />
    {std.socket.recessed ? <>
      <path d={socket} fill={`url(#${id}r)`} />
      <path d={socket} fill="none" stroke={`url(#${id}w)`} strokeWidth="2.4" />
    </> : <>
      <path d={socket} fill="#f7f3eb" transform="translate(0 .6)" opacity=".9" />
      <path d={socket} fill="#f3eee5" stroke="#cfc6b6" strokeWidth=".45" />
    </>}
    {std.clips && [-1, 1].map(side => <rect key={side} x={-3.5} y={side * (half - 2.2) - 1.3} width="7" height="2.6" rx=".8" fill={`url(#${id}m)`} />)}
    {std.holes.map((hole, i) => {
      const shape = hole.kind === 'round'
        ? <circle r={hole.w / 2} />
        : hole.kind === 'ground'
          ? <path d={`M${-hole.w / 2} ${hole.h / 2}V${-hole.h / 2 + hole.w / 2}A${hole.w / 2} ${hole.w / 2} 0 0 1 ${hole.w / 2} ${-hole.h / 2 + hole.w / 2}V${hole.h / 2}Z`} />
          : <rect x={-hole.w / 2} y={-hole.h / 2} width={hole.w} height={hole.h} rx={Math.min(hole.w, hole.h) * .28} />;
      return <g key={i} transform={`translate(${hole.x} ${hole.y}) rotate(${hole.rot ?? 0})`}>
        <g fill="#fff" fillOpacity=".55" transform="translate(0 .45)">{shape}</g>
        <g fill="#1d1a16">{shape}</g>
      </g>;
    })}
    {std.earthPin && <g transform={`translate(${std.earthPin.x} ${std.earthPin.y})`}>
      <circle r={std.earthPin.d / 2 + .6} fill="#000" opacity=".18" transform="translate(.4 .8)" />
      <circle r={std.earthPin.d / 2} fill={`url(#${id}m)`} />
    </g>}
    <circle className={styles.led} cx="0" cy={ledY} r="1.5" data-on={on || undefined} />
  </svg>;
}

interface PlugPose { type: PlugType; theta: number; phi: number; k: number; drawing: PlugDrawing | null }

/** Distance from the cable end to the pin face, along the plug. */
const attachOffset = (s: PlugPose) => (STANDARDS[s.type].body.depth + BOOT.len) * Math.sin((s.theta * Math.PI) / 180) * s.k;

/** Lowest point of the plug below its cable end, for floor contact. */
function plugBelow(s: PlugPose) {
  const box = s.drawing?.box;
  if (!box) return 20;
  const off = attachOffset(s);
  const a = (s.phi * Math.PI) / 180;
  const corners = [[box.x0, box.y0], [box.x1, box.y0], [box.x0, box.y1], [box.x1, box.y1]];
  // A local point (x, y) sits at (x, y + off) from the cable end; on screen its height is x·sin + y·cos.
  return Math.max(...corners.map(([x, y]) => x * Math.sin(a) + (y + off) * Math.cos(a))) + 2;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** 1 when the outlet's free side is to its left (the copy is on its right), -1 otherwise. */
const side = (s: { socket: Vec; w: number }) => (s.socket.x < s.w / 2 ? 1 : -1);
const easeInOut = (t: number) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const normalize = (a: number) => { let x = a % 360; if (x > 180) x -= 360; if (x < -180) x += 360; return x; };
const lerpAngle = (a: number, b: number, t: number) => a + normalize(b - a) * t;
