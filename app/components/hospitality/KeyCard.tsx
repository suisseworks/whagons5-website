'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import type { ConnectorProps } from '../home/hero/Hero';
import { LOGO_PATHS } from '../product/AppShellIcons';
import styles from './KeyCard.module.css';

/*
 * The hotel hero's connection: the card switch beside a room's door and the
 * room's key card. Sliding the card in does what the plug does on the home
 * page: light runs along the wire to the mosaic, which turns into the Whagons
 * screen. Drag the card over the switch, click or tap it, or press Enter or
 * Space on it. Pulling it up out of the switch, or the same click, tap or key
 * again, takes it out.
 */

const COPY = {
  es: {
    invite: 'Inserta la tarjeta. Enciende tu hotel.',
    connected: 'Una habitación. Varios equipos. Un mismo contexto.',
    hintPointer: 'Arrastra la tarjeta hasta el interruptor o haz clic en ella.',
    hintTouch: 'Toca la tarjeta para insertarla.',
    hintOff: 'Tira de la tarjeta hacia arriba o haz clic en ella para retirarla.',
    hintOffTouch: 'Deslízala hacia arriba o tócala de nuevo para retirarla.',
    insert: 'Insertar la tarjeta de Whagons en el interruptor de la habitación',
    remove: 'Retirar la tarjeta de Whagons del interruptor',
    room: 'Hab. 204',
  },
  en: {
    invite: 'Slide the card in. Switch your hotel on.',
    connected: 'One room. Several teams. The same context.',
    hintPointer: 'Drag the card to the switch, or click it.',
    hintTouch: 'Tap the card to slide it in.',
    hintOff: 'Pull the card up, or click it, to take it out.',
    hintOffTouch: 'Slide it up, or tap it again, to take it out.',
    insert: 'Slide the Whagons card into the room switch',
    remove: 'Take the Whagons card out of the switch',
    room: 'Room 204',
  },
} as const;

/** Where the card rests, measured from its seat in the switch (mirrored when the switch sits on the right). */
const REST = { x: 94, y: 16, tilt: 9 };
/** How far above its seat the card lines up before it slides in. */
const LIFT = 50;
const SEAT_MS = 460;
/** How far up the card comes before it is clear of the slot and the room switches off. */
const CLEAR = 52;

type Stage = 'rest' | 'lift' | 'in';

export default function KeyCard({ lang, connected, onConnect, onDisconnect, heroRef, portRef, reducedMotion, pulse, onPulseArrive }: ConnectorProps) {
  const t = COPY[lang];
  const plateRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>('rest');
  const [drag, setDrag] = useState<{ x: number; y: number; from: 'rest' | 'in' } | null>(null);
  const [near, setNear] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [wire, setWire] = useState<{ w: number; h: number; d: string } | null>(null);
  const [pulseOn, setPulseOn] = useState(0);
  const pointer = useRef<{ x: number; y: number; moved: boolean; from: 'rest' | 'in'; out: boolean } | null>(null);
  const dragged = useRef(false);
  const timers = useRef<number[]>([]);
  const callbacks = useRef({ onConnect, onDisconnect, onPulseArrive });
  callbacks.current = { onConnect, onDisconnect, onPulseArrive };

  const side = mirror ? -1 : 1;
  const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };
  const clearTimers = () => { timers.current.forEach(id => window.clearTimeout(id)); timers.current = []; };
  useEffect(() => clearTimers, []);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 899px)');
    const touch = window.matchMedia('(pointer: coarse)');
    const update = () => { setMirror(narrow.matches); setCoarse(touch.matches); };
    update();
    narrow.addEventListener('change', update);
    touch.addEventListener('change', update);
    return () => { narrow.removeEventListener('change', update); touch.removeEventListener('change', update); };
  }, []);

  /* ── The wire from the switch to the mosaic ────────── */
  const measure = useCallback(() => {
    const hero = heroRef.current;
    const plate = plateRef.current;
    const port = portRef.current;
    if (!hero || !plate || !port) return;
    const h = hero.getBoundingClientRect();
    const a = plate.getBoundingClientRect();
    const b = port.getBoundingClientRect();
    if (!a.width || !b.width) return;
    const px = b.left - h.left + b.width / 2;
    const py = b.bottom - h.top - 5;
    let d: string;
    if (window.matchMedia('(max-width: 899px)').matches) {
      // The switch sits under the mosaic: up from its top edge, beside the card's slot.
      const sx = a.left - h.left + 8;
      const sy = a.top - h.top + 16;
      const my = (sy + py) / 2;
      const dir = px < sx ? -1 : 1;
      const r = Math.min(10, Math.abs(px - sx) / 2, Math.abs(sy - py) / 2);
      d = `M${sx} ${sy} V${my + r} Q${sx} ${my} ${sx + dir * r} ${my} H${px - dir * r} Q${px} ${my} ${px} ${my - r} V${py}`;
    } else {
      // Down the wall, along the floor and up into the mosaic.
      const sx = a.left - h.left + a.width / 2;
      const sy = a.bottom - h.top - 16;
      const fy = Math.max(sy + 24, h.height - 23);
      const r = 12;
      d = `M${sx} ${sy} V${fy - r} Q${sx} ${fy} ${sx + r} ${fy} H${px - r} Q${px} ${fy} ${px} ${fy - r} V${py}`;
    }
    setWire({ w: h.width, h: h.height, d });
  }, [heroRef, portRef]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    // The panel rises in on load, so the first measure waits for it to settle.
    const first = window.setTimeout(measure, 1000);
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    window.addEventListener('load', measure);
    return () => { window.clearTimeout(first); ro.disconnect(); window.removeEventListener('load', measure); };
  }, [heroRef, measure, mirror]);

  /* ── Sliding the card in and out ───────────────────── */
  const seat = useCallback((via: 'drag' | 'click' | 'keyboard') => {
    clearTimers();
    setDrag(null);
    setNear(false);
    if (reducedMotion) { setStage('in'); callbacks.current.onConnect(via); return; }
    if (via === 'drag') {
      setStage('in');
      later(SEAT_MS - 120, () => callbacks.current.onConnect(via));
    } else {
      setStage('lift');
      later(300, () => setStage('in'));
      later(300 + SEAT_MS - 120, () => callbacks.current.onConnect(via));
    }
  }, [reducedMotion]);

  const release = useCallback(() => {
    clearTimers();
    callbacks.current.onDisconnect();
    if (reducedMotion) { setStage('rest'); return; }
    setStage('lift');
    later(320, () => setStage('rest'));
  }, [reducedMotion]);

  /** The card's offset from its seat while it is dragged by (dx, dy). */
  const offset = (dx: number, dy: number) => ({ x: REST.x * side + dx, y: REST.y + dy });
  const overSlot = (dx: number, dy: number) => {
    const o = offset(dx, dy);
    return (Math.abs(o.x) < 42 && o.y < 40 && o.y > -130) || Math.hypot(o.x, o.y + LIFT / 2) < 62;
  };

  /** The seated card pulled by (dx, dy): it only comes up, and moves sideways once it is clear of the slot. */
  const pulled = (dx: number, dy: number) => {
    const y = Math.min(5, dy);
    const free = Math.min(1, Math.max(0.1, (-y - CLEAR * 0.6) / (CLEAR * 0.6)));
    return { x: dx * free, y };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || stage === 'lift') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointer.current = { x: e.clientX, y: e.clientY, moved: false, from: stage, out: false };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const p = pointer.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (!p.moved && Math.hypot(dx, dy) < 6) return;
    p.moved = true;
    setDrag({ x: dx, y: dy, from: p.from });
    if (p.from === 'rest') { setNear(overSlot(dx, dy)); return; }
    // Pulled clear of the slot: the room switches off there and then.
    if (!p.out && pulled(dx, dy).y < -CLEAR) {
      p.out = true;
      clearTimers();
      setStage('rest');
      callbacks.current.onDisconnect();
    }
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const p = pointer.current;
    pointer.current = null;
    if (!p) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!p.moved) return; // a click: onClick takes it
    dragged.current = true;
    window.setTimeout(() => { dragged.current = false; }, 0);
    // A card pulled out goes back to rest; one not pulled far enough settles back in.
    if (p.from === 'rest' && overSlot(e.clientX - p.x, e.clientY - p.y)) seat('drag');
    else { setDrag(null); setNear(false); }
  };
  const onPointerCancel = () => { pointer.current = null; setDrag(null); setNear(false); };

  const onClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (dragged.current) return;
    if (stage === 'lift') return;
    if (stage === 'in') release();
    else seat(e.detail === 0 ? 'keyboard' : 'click');
  };
  const onPlateClick = () => { if (stage === 'rest') seat('click'); else if (stage === 'in') release(); };

  /* ── The pulse of light towards the mosaic ─────────── */
  useEffect(() => {
    if (!pulse) return;
    if (reducedMotion || !wire) { callbacks.current.onPulseArrive(); return; }
    setPulseOn(pulse);
  }, [pulse, reducedMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  const o = drag ? (drag.from === 'in' ? pulled(drag.x, drag.y) : offset(drag.x, drag.y)) : stage === 'rest' ? { x: REST.x * side, y: REST.y } : stage === 'lift' ? { x: 0, y: -LIFT } : { x: 0, y: 0 };
  // The card straightens as it nears the slot.
  const away = Math.min(1, Math.hypot(o.x, o.y + LIFT) / (REST.x * 0.9));
  const tilt = drag ? (drag.from === 'in' ? o.x / 9 : REST.tilt * side * away) : stage === 'rest' ? REST.tilt * side : 0;
  const cardStyle = { transform: `translate(${o.x}px, ${o.y}px) rotate(${tilt}deg)` } as CSSProperties;
  const hint = connected ? (coarse ? t.hintOffTouch : t.hintOff) : coarse ? t.hintTouch : t.hintPointer;

  return <div className={styles.panel} data-connected={connected || undefined} data-stage={stage} data-near={near || undefined}>
    <div className={styles.unit} data-mirror={mirror || undefined}>
      <div ref={plateRef} className={styles.plate} onClick={onPlateClick} aria-hidden="true">
        <span className={styles.halo} />
        <span className={styles.well} />
      </div>
      <button
        type="button"
        className={styles.card}
        style={cardStyle}
        data-dragging={drag ? '' : undefined}
        aria-pressed={connected}
        aria-label={connected ? t.remove : t.insert}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClick={onClick}
      >
        <span className={styles.face}>
          <svg className={styles.mark} viewBox="30 160 362 184" aria-hidden="true"><path d={LOGO_PATHS[0]} /><path d={LOGO_PATHS[1]} /></svg>
          <span className={styles.chip} aria-hidden="true" />
          <svg className={styles.chevrons} viewBox="0 0 16 18" aria-hidden="true"><path d="m3 3 5 5 5-5M3 10l5 5 5-5" /></svg>
          <span className={styles.room} aria-hidden="true">{t.room}</span>
        </span>
      </button>
      {/* The front of the switch: the card slides in behind it. */}
      <div className={styles.pocket} aria-hidden="true">
        <span className={styles.led} />
        <svg className={styles.glyph} viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M12 8v7m-2.5-2.5L12 15l2.5-2.5" /></svg>
      </div>
    </div>

    <div className={styles.copy}>
      <p className={styles.invite} aria-live="polite">{connected ? t.connected : t.invite}</p>
      <p className={styles.hint}>{hint}</p>
    </div>

    {/* The room's light coming on, and the wire, both drawn over the whole hero. */}
    <span className={styles.light} aria-hidden="true" />
    {wire && <svg className={styles.overlay} viewBox={`0 0 ${wire.w} ${wire.h}`} preserveAspectRatio="none" aria-hidden="true">
      <path className={styles.wireShadow} d={wire.d} transform="translate(0 3)" />
      <path className={styles.wire} d={wire.d} />
      <path className={styles.wireLive} d={wire.d} />
      {pulseOn > 0 && <g key={pulseOn} className={styles.pulse} onAnimationEnd={e => { if (e.target === e.currentTarget.lastChild) { setPulseOn(0); callbacks.current.onPulseArrive(); } }}>
        <path d={wire.d} pathLength={1} />
        <path d={wire.d} pathLength={1} />
      </g>}
    </svg>}
  </div>;
}
