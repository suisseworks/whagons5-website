'use client';

import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../lib/locales';
import styles from './Rufo.module.css';
import type { Rufo3D } from './rufo3d';

/**
 * Rufo, the Whagons mascot. He lives in the bottom-right corner of every
 * page and goofs around there: looks about, hops, spins, wanders off along
 * the bottom and comes back, winks, now and then says something.
 *
 * - His eyes follow the mouse; he wobbles when the page scrolls.
 * - Click him and he reacts (three quick clicks make him dizzy).
 * - «El cursor abandonado»: leave the mouse still for IDLE_MS and he floats
 *   over to it and asks «¿Es tuyo?»; move it and he winks and flies home.
 * - Head for the tabs and he looks sad; come back and he cheers up.
 *
 * Touch screens get a smaller Rufo with the tricks and taps, but nothing that
 * needs a mouse. With reduced motion he stays put and only changes face.
 *
 * He is drawn in 3D (rufo3d.ts), so he turns all the way round and follows
 * the mouse with his head; the flat poses from the character sheet are the
 * fallback.
 */

declare global {
  interface Window { __whCursor?: { x: number; y: number } }
}

type Pose = 'front' | 'turn' | 'side' | 'back' | 'wink' | 'look' | 'sad';
// Height of each pose on the character sheet, so all of them share one scale.
const POSE_H: Record<Pose, number> = { front: 307, turn: 310, side: 307, back: 307, wink: 303, look: 303, sad: 291 };
const POSES = Object.keys(POSE_H) as Pose[];
// turn, side and look face left on the sheet; mirrored, they face right.
// back is front mirrored with the face and belly painted over in body red
// (the sheet has no back view), so he can turn all the way round.

const IDLE_MS = 10_000; // a still mouse before he goes to look at it
const VISIT_COOLDOWN_MS = 30_000;
const TRICK_MIN_MS = 6_000; // pause between tricks at home
const TRICK_MAX_MS = 12_000;
const LEAVE_COOLDOWN_MS = 45_000;

const COPY: Record<Language, {
  hello: string; ask: string; found: string; leaving: string; back: string; dizzy: string;
  clicks: string[]; idle: string[];
}> = {
  es: {
    hello: '¡Hola!',
    ask: '¿Es tuyo?',
    found: '¡Ah, es tuyo!',
    leaving: '¿Ya te vas?',
    back: '¡Volviste!',
    dizzy: '¡Uf, me mareo!',
    clicks: ['¡Hola! Soy Rufo.', '¡Jeje, cosquillas!', 'Estoy de turno.', '¡Otra vez!'],
    idle: ['Todo bajo control.', 'Nada se pierde aquí.', '¿Ya pediste tu demo?'],
  },
  en: {
    hello: 'Hi!',
    ask: 'Is this yours?',
    found: 'Oh, it’s yours!',
    leaving: 'Leaving already?',
    back: 'You’re back!',
    dizzy: 'Whoa, dizzy!',
    clicks: ['Hi! I’m Rufo.', 'Hehe, that tickles!', 'I’m on shift.', 'Again!'],
    idle: ['All under control.', 'Nothing gets lost here.', 'Booked your demo yet?'],
  },
};

type Act = '' | 'hop' | 'spin' | 'wobble' | 'lean-l' | 'lean-r' | 'giggle';
type Align = 'start' | 'center' | 'end';
interface View {
  pose: Pose;
  mirror: boolean;
  bubble: string | null;
  act: Act;
  align: Align;
  below: boolean;
}
type Mode = 'home' | 'trick' | 'visit' | 'asking' | 'sad';

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const between = (a: number, b: number) => a + Math.random() * (b - a);

export default function Rufo({ lang }: { lang: Language }) {
  const [on, setOn] = useState(false);
  const [view, setView] = useState<View>({
    pose: 'front', mirror: false, bubble: null, act: '', align: 'end', below: false,
  });

  const dock = useRef<HTMLDivElement>(null);
  const mover = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = COPY[lang] ?? COPY.es;
  const copyRef = useRef(copy);
  const lastWords = useRef('');
  copyRef.current = copy;

  useEffect(() => setOn(true), []);

  useEffect(() => {
    if (!on) return;
    const dockEl = dock.current;
    const moverEl = mover.current;
    if (!dockEl || !moverEl) return;

    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let viewNow: View = { pose: 'front', mirror: false, bubble: null, act: '', align: 'end', below: false };
    // The 3D Rufo, once loaded; until then (or without WebGL) the flat poses.
    let r3d: Rufo3D | null = null;
    let disposed = false;
    const show = (patch: Partial<View>) => {
      viewNow = { ...viewNow, ...patch };
      setView(viewNow);
      if (r3d && ('pose' in patch || 'mirror' in patch)) r3d.pose(viewNow.pose, viewNow.mirror);
    };

    // ---- position: an offset from his home corner ----
    const offset = { x: 0, y: 0 };
    const place = (x: number, y: number, ms: number) => {
      offset.x = x;
      offset.y = y;
      moverEl.style.transitionDuration = `${ms}ms`;
      moverEl.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    };
    const home = () => dockEl.getBoundingClientRect();

    // ---- scripts: one at a time; starting one cancels the one before ----
    let gen = 0;
    let mode: Mode = 'home';
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
      return t;
    };
    const wait = (ms: number, g: number) =>
      new Promise<boolean>((resolve) => later(() => resolve(gen === g), ms));

    let trickTimer = 0;
    const scheduleTrick = () => {
      window.clearTimeout(trickTimer);
      trickTimer = window.setTimeout(() => {
        if (mode !== 'home' || document.visibilityState !== 'visible' || hovering) return scheduleTrick();
        void run('trick', pick(tricks));
      }, between(TRICK_MIN_MS, TRICK_MAX_MS));
    };

    const run = async (m: Mode, script: (g: number) => Promise<unknown>) => {
      const g = ++gen;
      mode = m;
      await script(g);
      if (gen !== g) return;
      mode = 'home';
      scheduleTrick();
    };

    // Back to the corner, facing the way he travels, then front.
    const goHome = async (g: number) => {
      if (offset.x !== 0 || offset.y !== 0) {
        const dist = Math.hypot(offset.x, offset.y);
        const ms = still ? 0 : Math.min(1600, Math.max(600, dist * 1.3));
        show({ pose: 'side', mirror: offset.x < 0, act: offset.x < 0 ? 'lean-r' : 'lean-l', bubble: null });
        place(0, 0, ms);
        if (!(await wait(ms, g))) return false;
      }
      show({ pose: 'front', mirror: false, act: '', align: 'end', below: false });
      return true;
    };

    // ---- tricks at home ----
    const lookAround = async (g: number) => {
      show({ pose: 'turn', mirror: false });
      if (!(await wait(900, g))) return;
      // Through the front, so he turns his head instead of flipping.
      show({ pose: 'front', mirror: false });
      if (!(await wait(140, g))) return;
      show({ pose: 'turn', mirror: true });
      if (!(await wait(900, g))) return;
      show({ pose: 'look', mirror: false });
      if (!(await wait(700, g))) return;
      show({ pose: 'front', mirror: false });
    };
    const hop = async (g: number) => {
      show({ act: 'hop', pose: 'wink' });
      if (!(await wait(800, g))) return;
      show({ act: '', pose: 'front' });
    };
    // A full turn: the face goes off to the left, round the back and in
    // from the right. He switches sides while his back is turned, where it
    // does not show. Slower at both ends, like a real spin.
    const spinFrames: [Pose, boolean, number][] = [
      ['turn', false, 95], ['side', false, 80], ['back', false, 85],
      ['side', true, 80], ['turn', true, 95], ['front', false, 0],
    ];
    const spin = async (g: number, settle = true) => {
      show({ act: 'spin', bubble: null, pose: 'front', mirror: false });
      if (r3d) {
        // In 3D he simply turns all the way round.
        await r3d.spin(settle ? 950 : 800);
        if (gen !== g || !settle) return;
        if (!(await wait(200, g))) return;
        show({ act: '' });
        return;
      }
      if (!(await wait(90, g))) return;
      for (const [pose, mirror, ms] of spinFrames) {
        show({ pose, mirror });
        if (ms && !(await wait(ms, g))) return;
      }
      if (!settle) return;
      if (!(await wait(320, g))) return;
      show({ act: '' });
    };
    const wander = async (g: number) => {
      if (still) return lookAround(g);
      const room = home().left - 16;
      const dx = -Math.min(room, between(120, 300));
      const dy = -between(0, 36);
      show({ pose: 'side', mirror: false, act: 'lean-l' });
      place(dx, dy, 1700);
      if (!(await wait(1700, g))) return;
      show({ pose: 'look', mirror: false, act: '' });
      if (!(await wait(1100, g))) return;
      show({ pose: 'front' });
      if (!(await wait(700, g))) return;
      await goHome(g);
    };
    const chat = async (g: number) => {
      const say = Math.random() < 0.5;
      show({ pose: 'wink', bubble: say ? pick(copyRef.current.idle) : null, align: 'end', below: false });
      if (!(await wait(say ? 2400 : 1000, g))) return;
      show({ pose: 'front', bubble: null });
    };
    const tricks = still ? [lookAround, chat] : [lookAround, hop, spin, wander, wander, chat];

    // ---- «el cursor abandonado» ----
    const cursor = { x: -1, y: -1, known: false };
    let inside = true;
    let lastVisit = 0;
    let idleTimer = 0;
    const armIdle = (ms = IDLE_MS) => {
      window.clearTimeout(idleTimer);
      if (mouse) idleTimer = window.setTimeout(visit, ms);
    };
    const visit = () => {
      if (!cursor.known || !inside || document.visibilityState !== 'visible' || mode === 'visit' || mode === 'asking') return;
      const since = Date.now() - lastVisit;
      if (since < VISIT_COOLDOWN_MS) return armIdle(VISIT_COOLDOWN_MS - since);
      const h = home();
      const w = h.width;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      // Beside the cursor and facing it: to its right when there is room.
      const right = cursor.x + 22 + w + 14 <= vw;
      let x = right ? cursor.x + 22 : cursor.x - 22 - w;
      let y = cursor.y - h.height * 0.42;
      const below = y - 56 < 14;
      if (below) y = cursor.y + 28;
      x = Math.min(Math.max(x, 14), vw - w - 14);
      y = Math.min(Math.max(y, below ? 14 : 70), vh - h.height - 14);
      const align: Align = x + w / 2 > vw - 110 ? 'end' : x + w / 2 < 110 ? 'start' : 'center';
      const dx = x - h.left;
      const dy = y - h.top;

      void run('visit', async (g) => {
        if (!still) {
          const ms = Math.min(2000, Math.max(800, Math.hypot(dx - offset.x, dy - offset.y) * 1.4));
          show({ pose: 'side', mirror: dx > offset.x, act: dx > offset.x ? 'lean-r' : 'lean-l', bubble: null });
          place(dx, dy, ms);
          if (!(await wait(ms, g))) return;
        }
        mode = 'asking';
        // On the cursor's right he looks left at it; on its left, right.
        show({
          pose: 'turn', mirror: !right && !still, act: '',
          bubble: copyRef.current.ask, align: still ? 'end' : align, below: still ? false : below,
        });
        // He stays until the mouse moves (see wake()).
        await new Promise<void>(() => {});
      });
    };
    // The mouse moved while he was visiting: answer, then fly home.
    const wake = () => {
      if (mode === 'asking') {
        lastVisit = Date.now();
        void run('trick', async (g) => {
          show({ pose: 'wink', mirror: false, bubble: copyRef.current.found, act: 'giggle' });
          if (!(await wait(1000, g))) return;
          show({ bubble: null, act: '' });
          await goHome(g);
        });
      } else if (mode === 'visit') {
        lastVisit = Date.now();
        void run('trick', goHome);
      }
    };

    // ---- eyes on the mouse ----
    let hovering = false;
    let gazeFrame = 0;
    const gaze = () => {
      gazeFrame = 0;
      if (mode !== 'home' || !cursor.known) return;
      const h = home();
      const cx = h.left + offset.x + h.width / 2;
      const cy = h.top + offset.y + h.height / 2;
      const dx = cursor.x - cx;
      if (r3d) {
        // Head and eyes follow the mouse.
        if (viewNow.pose !== 'front' || viewNow.mirror) show({ pose: 'front', mirror: false });
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        r3d.aim(clamp(dx / 450), clamp((cy - cursor.y) / 450));
        return;
      }
      const near = Math.hypot(dx, cursor.y - cy) < 150;
      const next: Partial<View> = near || Math.abs(dx) < 50
        ? { pose: 'front', mirror: false }
        : { pose: 'turn', mirror: dx > 0 };
      if (next.pose !== viewNow.pose || next.mirror !== viewNow.mirror) show(next);
    };

    // ---- events ----
    const activity = () => {
      wake();
      armIdle();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      inside = true;
      const moved = !cursor.known || cursor.x !== e.clientX || cursor.y !== e.clientY;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.known = true;
      if (mode === 'sad') cheerUp();
      if (!moved) return;
      activity();
      if (!gazeFrame) gazeFrame = requestAnimationFrame(gaze);
    };
    // A cursor that has not moved since the page loaded (see the layout's
    // boot script), or one the page changed under: known, but not activity.
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      inside = true;
      const first = !cursor.known;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.known = true;
      if (mode === 'sad') cheerUp();
      if (first) armIdle();
    };
    let lastLeave = 0;
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      inside = false;
      // Toward the tabs or the address bar.
      if (e.clientY > 8 || (mode !== 'home' && mode !== 'trick') || Date.now() - lastLeave < LEAVE_COOLDOWN_MS) return;
      lastLeave = Date.now();
      void run('sad', async () => {
        show({ pose: 'sad', mirror: false, bubble: copyRef.current.leaving, align: 'end', below: false });
        await new Promise<void>(() => {});
      });
    };
    const cheerUp = () => {
      void run('trick', async (g) => {
        show({ pose: 'wink', bubble: copyRef.current.back, act: 'hop' });
        if (!(await wait(1400, g))) return;
        show({ pose: 'front', bubble: null, act: '' });
      });
    };
    let lastScrollY = window.scrollY;
    let wobbling = false;
    const onScroll = () => {
      activity();
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (still || wobbling || mode !== 'home' || Math.abs(dy) < 2) return;
      wobbling = true;
      show({ act: 'wobble' });
      later(() => {
        wobbling = false;
        if (viewNow.act === 'wobble') show({ act: '' });
      }, 650);
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') armIdle();
      else window.clearTimeout(idleTimer);
    };

    // Clicks on Rufo himself.
    let clicks: number[] = [];
    let clickLine = 0;
    const onPoke = () => {
      const now = Date.now();
      clicks = [...clicks.filter((t) => now - t < 900), now];
      lastVisit = now; // he was just played with: no visit right away
      armIdle();
      if (clicks.length >= 3) {
        clicks = [];
        void run('trick', async (g) => {
          await spin(g, false);
          if (gen !== g) return;
          await spin(g);
          if (gen !== g) return;
          show({ pose: 'look', bubble: copyRef.current.dizzy, act: 'wobble' });
          if (!(await wait(1800, g))) return;
          show({ pose: 'front', bubble: null, act: '' });
        });
        return;
      }
      const line = copyRef.current.clicks[clickLine++ % copyRef.current.clicks.length];
      void run('trick', async (g) => {
        if (offset.x !== 0 || offset.y !== 0) {
          if (!(await goHome(g))) return;
        }
        show({ pose: 'wink', mirror: false, bubble: line, act: still ? '' : 'giggle', align: 'end', below: false });
        if (!(await wait(1700, g))) return;
        show({ pose: 'front', bubble: null, act: '' });
      });
    };
    const body = moverEl.querySelector<HTMLElement>('[data-rufo-body]');
    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };
    body?.addEventListener('click', onPoke);
    body?.addEventListener('pointerenter', onEnter);
    body?.addEventListener('pointerleave', onLeave);

    if (mouse) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('mouseout', onOut);
      if (window.__whCursor) {
        cursor.x = window.__whCursor.x;
        cursor.y = window.__whCursor.y;
        cursor.known = true;
        armIdle();
      }
    }
    window.addEventListener('pointerdown', activity, { passive: true });
    window.addEventListener('keydown', activity);
    window.addEventListener('wheel', activity, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisible);

    // ---- entrance: he pops up from below the corner ----
    let greeted = false;
    try {
      greeted = sessionStorage.getItem('whagons-rufo-hello') === '1';
      sessionStorage.setItem('whagons-rufo-hello', '1');
    } catch {
      greeted = false;
    }
    // Load the 3D model (three.js, a separate ~130 KB download); he shows up
    // once it is ready, or after a few seconds with the flat poses if it is
    // slow, WebGL is missing or the visitor asked to save data.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const ready = new Promise<void>((resolve) => {
      if (saveData) return resolve();
      import('./rufo3d')
        .then(({ createRufo3D }) => {
          if (disposed || !canvas.current) return;
          r3d = createRufo3D(canvas.current, still);
          if (!r3d) return;
          r3d.pose(viewNow.pose, viewNow.mirror);
          dockEl.dataset.three = '';
        })
        .catch(() => undefined)
        .finally(resolve);
      later(resolve, 4000);
    });

    void run('trick', async (g) => {
      await ready;
      if (gen !== g) return;
      if (still) place(0, 0, 0);
      if (!still) {
        place(0, home().height + 40, 0);
        void moverEl.offsetWidth;
        if (!(await wait(700, g))) return;
        show({ act: 'hop' });
        place(0, 0, 700);
        if (!(await wait(800, g))) return;
        show({ act: '' });
      }
      if (greeted) return;
      show({ pose: 'wink', bubble: copyRef.current.hello });
      if (!(await wait(1800, g))) return;
      show({ pose: 'front', bubble: null });
    });

    return () => {
      gen++;
      disposed = true;
      r3d?.dispose();
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(trickTimer);
      window.clearTimeout(idleTimer);
      if (gazeFrame) cancelAnimationFrame(gazeFrame);
      body?.removeEventListener('click', onPoke);
      body?.removeEventListener('pointerenter', onEnter);
      body?.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('pointerdown', activity);
      window.removeEventListener('keydown', activity);
      window.removeEventListener('wheel', activity);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [on]);

  // Keep the last words while the bubble fades out.
  if (view.bubble) lastWords.current = view.bubble;

  if (!on) return null;

  return (
    <div ref={dock} className={styles.dock} aria-hidden="true">
      <div ref={mover} className={styles.mover}>
        <div
          className={styles.bubble}
          data-show={view.bubble ? '' : undefined}
          data-align={view.align}
          data-below={view.below ? '' : undefined}
        >
          {view.bubble ?? lastWords.current}
        </div>
        <div className={styles.body} data-rufo-body="" data-act={view.act || undefined}>
          <div className={styles.face} data-mirror={view.mirror ? '' : undefined}>
            {POSES.map((pose) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={pose}
                className={styles.img}
                src={`/images/rufo/rufo-${pose}.webp`}
                alt=""
                draggable={false}
                decoding="async"
                style={{ '--h': POSE_H[pose] } as React.CSSProperties}
                data-on={view.pose === pose ? '' : undefined}
              />
            ))}
          </div>
          <canvas ref={canvas} className={styles.canvas} />
        </div>
      </div>
    </div>
  );
}
