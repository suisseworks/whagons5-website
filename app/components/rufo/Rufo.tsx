'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../../lib/locales';
import styles from './Rufo.module.css';

/**
 * Rufo, the Whagons mascot: «el cursor abandonado».
 *
 * When the mouse has sat still for IDLE_MS, Rufo floats in from the nearest
 * side of the screen, stops beside the cursor and asks whether it is yours.
 * Move the mouse and he winks and floats away again.
 *
 * Only on devices with a real mouse. Scrolling, typing or clicking count as
 * activity. Nothing renders until he is needed, so pages pay for nothing.
 */

const IDLE_MS = 10_000;
// After he leaves, he waits at least this long before coming back.
const COOLDOWN_MS = 30_000;
// How long he winks before he floats off.
const WINK_MS = 950;

const RUFO_W = 92;
const RUFO_H = 107;
const GAP = 20; // between the cursor and Rufo
const EDGE = 14; // from the viewport edge
const BUBBLE_ROOM = 54; // the bubble above his head

const POSES = {
  turn: '/images/rufo/rufo-turn.webp',
  wink: '/images/rufo/rufo-wink.webp',
};

const COPY: Record<Language, { ask: string; found: string }> = {
  es: { ask: '¿Es tuyo?', found: '¡Ah, es tuyo!' },
  en: { ask: 'Is this yours?', found: 'Oh, it’s yours!' },
};

type Phase = 'away' | 'arriving' | 'asking' | 'winking' | 'leaving';
type Side = 'left' | 'right';

export default function Rufo({ lang }: { lang: Language }) {
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<Phase>('away');
  const [side, setSide] = useState<Side>('right');
  const [below, setBelow] = useState(false);

  const el = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>('away');
  const cursor = useRef<{ x: number; y: number } | null>(null);
  const inside = useRef(true);
  const idleTimer = useRef<number>();
  const stepTimer = useRef<number>();
  const lastLeft = useRef(0);
  const reduced = useRef(false);

  const go = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const place = (x: number, y: number, ms: number) => {
    const node = el.current;
    if (!node) return;
    node.style.transitionDuration = `${ms}ms`;
    node.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  };

  // Only for a real mouse; the images load the first time he is armed.
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reduced.current = motion.matches;
      setEnabled(mq.matches);
    };
    sync();
    mq.addEventListener('change', sync);
    motion.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    Object.values(POSES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const leave = () => {
      const node = el.current;
      if (!node) return;
      const w = window.innerWidth;
      const fromRight = node.dataset.side === 'right';
      const box = node.getBoundingClientRect();
      go('leaving');
      // With reduced motion he fades where he is instead of flying off.
      let ms = 260;
      if (!reduced.current) {
        const x = fromRight ? w + 40 : -RUFO_W - 40;
        ms = Math.min(1400, Math.max(700, Math.abs(x - box.left) * 1.4));
        place(x, box.top - 30, ms);
      }
      window.clearTimeout(stepTimer.current);
      stepTimer.current = window.setTimeout(() => {
        go('away');
        lastLeft.current = Date.now();
      }, ms + 20);
    };

    const arrive = () => {
      const node = el.current;
      const at = cursor.current;
      if (!node || !at || !inside.current || document.visibilityState !== 'visible') return;
      if (Date.now() - lastLeft.current < COOLDOWN_MS) {
        arm(COOLDOWN_MS - (Date.now() - lastLeft.current));
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Beside the cursor, facing it: to its right when there is room.
      const nextSide: Side = at.x + GAP + RUFO_W + EDGE <= w ? 'right' : 'left';
      let x = nextSide === 'right' ? at.x + GAP : at.x - GAP - RUFO_W;
      let y = at.y - RUFO_H * 0.42;
      const nextBelow = y - BUBBLE_ROOM < EDGE;
      if (nextBelow) y = at.y + GAP + 6;
      x = Math.min(Math.max(x, EDGE), w - RUFO_W - EDGE);
      y = Math.min(Math.max(y, nextBelow ? EDGE : EDGE + BUBBLE_ROOM), h - RUFO_H - EDGE);

      node.dataset.side = nextSide;
      setSide(nextSide);
      setBelow(nextBelow);

      if (reduced.current) {
        place(x, y, 0);
        go('asking');
        return;
      }
      // Start just off the near edge, a little lower, then float in.
      const startX = nextSide === 'right' ? w + 30 : -RUFO_W - 30;
      place(startX, y + 70, 0);
      void node.offsetWidth;
      go('arriving');
      const dist = Math.hypot(startX - x, 70);
      const ms = Math.min(2200, Math.max(1100, dist * 1.6));
      place(x, y, ms);
      window.clearTimeout(stepTimer.current);
      stepTimer.current = window.setTimeout(() => go('asking'), ms);
    };

    const arm = (ms = IDLE_MS) => {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(arrive, ms);
    };

    const active = () => {
      const now = phaseRef.current;
      if (now === 'arriving' || now === 'asking') {
        window.clearTimeout(stepTimer.current);
        if (now === 'asking') {
          go('winking');
          stepTimer.current = window.setTimeout(leave, WINK_MS);
        } else {
          leave();
        }
      }
      arm();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      inside.current = true;
      const prev = cursor.current;
      cursor.current = { x: e.clientX, y: e.clientY };
      // Ignore the synthetic zero-distance moves some browsers send.
      if (prev && prev.x === e.clientX && prev.y === e.clientY) return;
      active();
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) inside.current = false;
    };
    const onHidden = () => {
      if (document.visibilityState !== 'visible') window.clearTimeout(idleTimer.current);
      else if (cursor.current) arm();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', active, { passive: true });
    window.addEventListener('keydown', active);
    window.addEventListener('wheel', active, { passive: true });
    window.addEventListener('scroll', active, { passive: true });
    document.addEventListener('mouseout', onOut);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(stepTimer.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', active);
      window.removeEventListener('keydown', active);
      window.removeEventListener('wheel', active);
      window.removeEventListener('scroll', active);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, [enabled, go]);

  if (!enabled) return null;

  const copy = COPY[lang] ?? COPY.es;
  const pose = phase === 'winking' ? POSES.wink : POSES.turn;
  // The turn pose looks to the left; mirror him to look right.
  const faceRight = phase === 'winking' ? false : phase === 'leaving' ? side === 'right' : side === 'left';
  const talking = phase === 'asking' || phase === 'winking';

  return (
    <div
      ref={el}
      className={styles.rufo}
      data-phase={phase}
      data-side={side}
      data-below={below || undefined}
      aria-hidden="true"
    >
      <div className={styles.body}>
        <div
          className={styles.bubble}
          data-show={talking || undefined}
        >
          {phase === 'winking' ? copy.found : copy.ask}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.img}
          src={pose}
          alt=""
          width={RUFO_W}
          height={RUFO_H}
          draggable={false}
          data-mirror={faceRight || undefined}
        />
      </div>
    </div>
  );
}
