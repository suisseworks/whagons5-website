'use client';

import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../lib/locales';
import styles from './Rufo.module.css';

/**
 * Rufo, the Whagons mascot. He lives in the bottom-right corner of every
 * page and goofs around there: looks about, blinks, hops, spins, flips,
 * dances, plays peekaboo, wanders off along the bottom and comes back, and
 * now and then says something.
 *
 * - He moves on springs (see "motion" below): he leans into where he is
 *   going, squashes when he lands and stretches when he jumps, and nothing
 *   he does interrupts his idle bob, so he never snaps.
 * - His eyes and head follow the mouse; the page scrolling sways him; a
 *   mouse dashing past startles him.
 * - Click him and he laughs and says something; three quick clicks make
 *   him spin until he is dizzy.
 * - «El cursor abandonado»: leave the mouse still for IDLE_MS and he floats
 *   over to it and asks «¿Es tuyo?»; move it and he laughs and flies home.
 * - Head for the tabs and he looks sad; come back and he cheers up.
 * - Nobody around for DOZE_MS (no mouse in the window, or a phone left
 *   alone) and he yawns and dozes off until something happens.
 *
 * Touch screens get a smaller Rufo with the tricks and taps, but nothing that
 * needs a mouse. With reduced motion he stays put and only changes face.
 */

declare global {
  interface Window { __whCursor?: { x: number; y: number } }
}

type Pose =
  | 'front' | 'turn' | 'side' | 'back' | 'wink' | 'look' | 'sad'
  | 'blink' | 'happy' | 'surprised' | 'talk' | 'yawn';
// Height of each pose on the character sheet, so all of them share one scale.
const POSE_H: Record<Pose, number> = {
  front: 307, turn: 310, side: 307, back: 307, wink: 303, look: 303, sad: 291,
  blink: 307, happy: 303, surprised: 307, talk: 307, yawn: 307,
};
const POSES = Object.keys(POSE_H) as Pose[];
// turn, side and look face left on the sheet; mirrored, they face right.
// back is front mirrored with the face and belly painted over in body red
// (the sheet has no back view), so he can turn all the way round.
// blink, happy, surprised, talk and yawn are front (or wink) with the eyes
// and mouth repainted from the sheet's own closed eye and open mouth.

// Swapping between these is a real change of face or direction, so it gets
// a small jelly bounce. Blinks and mouth flaps do not.
const BIG = new Set<Pose>(['front', 'turn', 'side', 'back', 'look', 'happy', 'surprised', 'sad', 'wink']);

const IDLE_MS = 10_000; // a still mouse before he goes to look at it
const VISIT_COOLDOWN_MS = 30_000;
const TRICK_MIN_MS = 5_000; // pause between tricks at home
const TRICK_MAX_MS = 10_000;
const LEAVE_COOLDOWN_MS = 45_000;
const DOZE_MS = 45_000; // nothing happening before he falls asleep
const STARTLE_COOLDOWN_MS = 9_000;

const COPY: Record<Language, {
  hello: string; ask: string; found: string; leaving: string; back: string; boo: string; dizzy: string;
  clicks: string[]; idle: string[];
}> = {
  es: {
    hello: '¡Hola!',
    ask: '¿Es tuyo?',
    found: '¡Ah, es tuyo!',
    leaving: '¿Ya te vas?',
    back: '¡Volviste!',
    boo: '¡Bu!',
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
    boo: 'Boo!',
    dizzy: 'Whoa, dizzy!',
    clicks: ['Hi! I’m Rufo.', 'Hehe, that tickles!', 'I’m on shift.', 'Again!'],
    idle: ['All under control.', 'Nothing gets lost here.', 'Booked your demo yet?'],
  },
};

type Act = '' | 'giggle' | 'wiggle';
type Align = 'start' | 'center' | 'end';
interface View {
  pose: Pose;
  mirror: boolean;
  bubble: string | null;
  soft: boolean;
  act: Act;
  align: Align;
  below: boolean;
}
type Mode = 'home' | 'trick' | 'visit' | 'asking' | 'sad' | 'sleep';

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const between = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

interface Spring { x: number; v: number; to: number; k: number; c: number }

export default function Rufo({ lang }: { lang: Language }) {
  const [on, setOn] = useState(false);
  const [view, setView] = useState<View>({
    pose: 'front', mirror: false, bubble: null, soft: false, act: '', align: 'end', below: false,
  });

  const dock = useRef<HTMLDivElement>(null);
  const mover = useRef<HTMLDivElement>(null);
  const copy = COPY[lang] ?? COPY.es;
  const copyRef = useRef(copy);
  const lastWords = useRef('');
  copyRef.current = copy;

  useEffect(() => setOn(true), []);

  useEffect(() => {
    if (!on) return;
    const dockEl = dock.current;
    const moverEl = mover.current;
    const airEl = moverEl?.querySelector<HTMLElement>('[data-rufo-air]');
    const tiltEl = moverEl?.querySelector<HTMLElement>('[data-rufo-tilt]');
    const groundEl = moverEl?.querySelector<HTMLElement>('[data-rufo-ground]');
    if (!dockEl || !moverEl || !airEl || !tiltEl || !groundEl) return;

    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    // ---- motion ----
    // Where he is (an offset from home) follows a goal that moves along a
    // path; lean and squash are springs that the motion pushes around. All of
    // it runs in one animation frame loop that stops when he is at rest.
    const pos = { x: 0, y: 0, vx: 0, vy: 0 };
    const goal = { x: 0, y: 0 };
    const spring = (k: number, c: number): Spring => ({ x: 0, v: 0, to: 0, k, c });
    const lean = spring(170, 12); // degrees; a little underdamped, so he jiggles
    const squash = spring(280, 10); // > 0 wider and shorter, < 0 taller
    let look = 0; // head tilt toward the cursor, degrees
    let bias = 0; // a held squash (a stretch, a slump)
    interface Path {
      fx: number; fy: number; tx: number; ty: number; t0: number; ms: number;
      style: 'float' | 'hop'; arc: number; hops: number; landed: number; done: (ok: boolean) => void;
    }
    let path: Path | null = null;
    interface Jump { t0: number; ms: number; h: number; flip: number; done: (ok: boolean) => void }
    let jumping: Jump | null = null;
    let air = 0;
    let flipDeg = 0;
    let frame = 0;
    let lastT = 0;

    const draw = () => {
      moverEl.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      airEl.style.transform = air || flipDeg
        ? `translate3d(0, ${(-air).toFixed(1)}px, 0) rotate(${flipDeg.toFixed(1)}deg)`
        : '';
      const sq = clamp(squash.x, -0.22, 0.28);
      tiltEl.style.transform = `rotate(${lean.x.toFixed(2)}deg) scale(${(1 + sq * 0.75).toFixed(3)}, ${(1 - sq).toFixed(3)})`;
      groundEl.style.transform = `scale(${(1 - Math.min(0.5, air / 90)).toFixed(3)})`;
      groundEl.style.opacity = (1 - Math.min(0.65, air / 70)).toFixed(2);
    };

    const step = (s: Spring, dt: number) => {
      s.v += (s.k * (s.to - s.x) - s.c * s.v) * dt;
      s.x += s.v * dt;
    };

    const tick = (t: number) => {
      frame = 0;
      const dt = lastT ? Math.min(0.034, (t - lastT) / 1000) : 0.016;
      lastT = t;

      let pathAir = 0;
      if (path) {
        const p = clamp((t - path.t0) / path.ms, 0, 1);
        const e = easeInOut(p);
        goal.x = path.fx + (path.tx - path.fx) * e;
        goal.y = path.fy + (path.ty - path.fy) * e;
        if (path.style === 'float') pathAir = Math.sin(Math.PI * p) * path.arc;
        else {
          const phase = p * path.hops;
          pathAir = Math.abs(Math.sin(Math.PI * phase)) * path.arc;
          const landed = Math.min(path.hops, Math.floor(phase));
          if (landed > path.landed) {
            path.landed = landed;
            squash.v += 2.4; // each little landing squashes him
          }
        }
        if (p >= 1 && Math.hypot(goal.x - pos.x, goal.y - pos.y) < 1) {
          const done = path.done;
          path = null;
          done(true);
        }
      }
      // Follow the goal, critically damped: smooth starts and stops, and a
      // change of plan mid-flight curves instead of jerking.
      const K = 240;
      const C = 2 * Math.sqrt(K);
      pos.vx += (K * (goal.x - pos.x) - C * pos.vx) * dt;
      pos.vy += (K * (goal.y - pos.y) - C * pos.vy) * dt;
      pos.x += pos.vx * dt;
      pos.y += pos.vy * dt;

      let jumpAir = 0;
      flipDeg = 0;
      if (jumping) {
        const p = clamp((t - jumping.t0) / jumping.ms, 0, 1);
        jumpAir = 4 * jumping.h * p * (1 - p);
        flipDeg = jumping.flip * (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
        if (p >= 1) {
          flipDeg = 0;
          squash.v += 2.2 + Math.min(2.4, jumping.h / 18); // landing
          const done = jumping.done;
          jumping = null;
          done(true);
        }
      }
      const nextAir = pathAir + jumpAir;
      const airV = (nextAir - air) / dt;
      air = nextAir;

      lean.to = clamp(pos.vx * 0.022, -13, 13) + look;
      squash.to = bias - clamp(Math.abs(airV) / 2400, 0, 0.1);
      step(lean, dt);
      step(squash, dt);
      draw();

      const busy =
        path || jumping ||
        Math.abs(pos.vx) + Math.abs(pos.vy) > 0.4 ||
        Math.hypot(goal.x - pos.x, goal.y - pos.y) > 0.3 ||
        Math.abs(lean.v) > 0.05 || Math.abs(squash.v) > 0.003 ||
        Math.abs(lean.x - lean.to) > 0.05 || Math.abs(squash.x - squash.to) > 0.002;
      if (busy) frame = requestAnimationFrame(tick);
      else lastT = 0;
    };
    const wakeUp = () => {
      if (!frame && !still) frame = requestAnimationFrame(tick);
    };
    const kick = (v: number) => {
      if (still) return;
      squash.v += v;
      wakeUp();
    };
    const sway = (v: number) => {
      if (still) return;
      lean.v += v;
      wakeUp();
    };
    const setAt = (x: number, y: number) => {
      path?.done(false);
      path = null;
      goal.x = pos.x = x;
      goal.y = pos.y = y;
      pos.vx = pos.vy = 0;
      draw();
    };
    // Go to (x, y), floating in an arc or in little hops.
    const travel = (x: number, y: number, ms: number, g: number, style: 'float' | 'hop' = 'float') =>
      new Promise<boolean>((resolve) => {
        if (still || ms <= 0) {
          setAt(x, y);
          resolve(gen === g);
          return;
        }
        path?.done(false);
        const dist = Math.hypot(x - goal.x, y - goal.y);
        path = {
          fx: goal.x, fy: goal.y, tx: x, ty: y, t0: performance.now(), ms, style,
          arc: style === 'float' ? Math.min(46, dist * 0.14) : 12,
          hops: Math.max(1, Math.round(dist / 46)), landed: 0,
          done: (ok) => resolve(ok && gen === g),
        };
        wakeUp();
      });
    // A jump on the spot: crouch, up, (maybe a flip), land with a squash.
    const jump = (h: number, ms: number, g: number, flip = 0) =>
      new Promise<boolean>((resolve) => {
        if (still) {
          resolve(gen === g);
          return;
        }
        kick(2.2); // crouch first
        later(() => {
          jumping?.done(false);
          jumping = { t0: performance.now(), ms, h, flip, done: (ok) => resolve(ok && gen === g) };
          wakeUp();
        }, 90);
      });

    // ---- what he looks like ----
    let viewNow: View = { pose: 'front', mirror: false, bubble: null, soft: false, act: '', align: 'end', below: false };
    const show = (patch: Partial<View>) => {
      const before = viewNow.pose;
      viewNow = { ...viewNow, ...patch };
      if (patch.pose && patch.pose !== before && BIG.has(patch.pose) && BIG.has(before) && !jumping) kick(1.1);
      setView(viewNow);
    };

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
      bias = 0;
      dockEl.removeAttribute('data-asleep');
      look = 0;
      await script(g);
      if (gen !== g) return;
      // Whatever happened, he ends up back in his corner.
      if ((goal.x !== 0 || goal.y !== 0) && !(await goHome(g))) return;
      mode = 'home';
      scheduleTrick();
    };

    // Back to the corner, facing the way he travels, then front.
    const goHome = async (g: number) => {
      if (goal.x !== 0 || goal.y !== 0) {
        const dist = Math.hypot(goal.x, goal.y);
        const ms = still ? 0 : clamp(dist * 1.5, 650, 1700);
        const hop = dist < 300 && Math.abs(goal.y) < 50 && Math.random() < 0.5;
        show({ pose: 'side', mirror: goal.x < 0, bubble: null, soft: false });
        if (!(await travel(0, 0, hop ? Math.max(ms, dist * 5.5) : ms, g, hop ? 'hop' : 'float'))) return false;
      }
      show({ pose: 'front', mirror: false, act: '', align: 'end', below: false });
      return true;
    };

    // ---- tricks at home ----
    const lookAround = async (g: number) => {
      show({ pose: 'turn', mirror: false });
      sway(-45);
      if (!(await wait(900, g))) return;
      // Through the front, so he turns his head instead of flipping.
      show({ pose: 'front', mirror: false });
      if (!(await wait(130, g))) return;
      show({ pose: 'turn', mirror: true });
      sway(45);
      if (!(await wait(900, g))) return;
      show({ pose: 'look', mirror: false });
      if (!(await wait(700, g))) return;
      show({ pose: 'front', mirror: false });
    };
    const hop = async (g: number) => {
      show({ pose: 'happy' });
      if (!(await jump(26, 520, g))) return;
      if (!(await wait(250, g))) return;
      show({ pose: 'front' });
    };
    // A full turn: the face goes off to the left, round the back and in
    // from the right, while he jumps. He switches sides while his back is
    // turned, where it does not show. Slower at both ends, like a real spin.
    const spinFrames: [Pose, boolean, number][] = [
      ['turn', false, 95], ['side', false, 80], ['back', false, 85],
      ['side', true, 80], ['turn', true, 95], ['front', false, 0],
    ];
    const spin = async (g: number) => {
      show({ bubble: null, pose: 'front', mirror: false });
      const landed = jump(30, 700, g);
      if (!(await wait(150, g))) return;
      for (const [pose, mirror, ms] of spinFrames) {
        show({ pose, mirror });
        if (ms && !(await wait(ms, g))) return;
      }
      if (!(await landed)) return;
      show({ pose: 'happy' });
      if (!(await wait(450, g))) return;
      show({ pose: 'front' });
    };
    const flip = async (g: number) => {
      show({ pose: 'happy', mirror: false, bubble: null });
      if (!(await jump(52, 820, g, Math.random() < 0.5 ? 360 : -360))) return;
      show({ pose: 'wink' });
      if (!(await wait(700, g))) return;
      show({ pose: 'front' });
    };
    const wander = async (g: number) => {
      if (still) return lookAround(g);
      const room = home().left - 16;
      const dx = -Math.min(room, between(120, 320));
      const hopping = Math.random() < 0.5;
      const dy = hopping ? 0 : -between(10, 50);
      show({ pose: 'side', mirror: false });
      if (!(await travel(dx, dy, hopping ? Math.abs(dx) * 5.5 : 1700, g, hopping ? 'hop' : 'float'))) return;
      show({ pose: 'look', mirror: false });
      if (!(await wait(1000, g))) return;
      show({ pose: Math.random() < 0.5 ? 'front' : 'surprised' });
      if (!(await wait(700, g))) return;
      await goHome(g);
    };
    // He ducks out of sight below the window, peeks, and pops back up.
    const peekaboo = async (g: number) => {
      if (still) return lookAround(g);
      const h = home().height;
      show({ pose: 'surprised', bubble: null });
      if (!(await wait(260, g))) return;
      if (!(await travel(0, h + 34, 420, g))) return;
      if (!(await wait(between(900, 1700), g))) return;
      show({ pose: 'look', mirror: Math.random() < 0.5 });
      if (!(await travel(0, h * 0.42, 750, g))) return;
      if (!(await wait(900, g))) return;
      show({ pose: 'happy', mirror: false, bubble: copyRef.current.boo, align: 'end', below: false });
      if (!(await travel(0, 0, 360, g))) return;
      kick(2.6);
      if (!(await wait(1300, g))) return;
      show({ pose: 'front', bubble: null });
    };
    const dance = async (g: number) => {
      if (Math.random() < 0.5) show({ bubble: '♪', align: 'end', below: false });
      for (let i = 0; i < 6; i++) {
        const side = i % 2 ? 1 : -1;
        show({ pose: i % 3 === 2 ? 'wink' : 'happy', mirror: side > 0 });
        sway(side * 95);
        void travel(side * 9, 0, 330, g);
        if (!(await jump(12, 300, g))) return;
      }
      if (!(await travel(0, 0, 300, g))) return;
      show({ pose: 'front', mirror: false, bubble: null });
    };
    const stretch = async (g: number) => {
      show({ pose: 'yawn' });
      bias = -0.13; // up tall
      wakeUp();
      if (!(await wait(1100, g))) return;
      bias = 0;
      kick(2.8);
      show({ pose: 'blink' });
      if (!(await wait(240, g))) return;
      show({ pose: 'front' });
    };
    // A shake, like a dog out of the water.
    const shake = async (g: number) => {
      show({ pose: 'surprised', act: 'wiggle' });
      if (!(await wait(900, g))) return;
      show({ pose: 'happy', act: '' });
      if (!(await wait(600, g))) return;
      show({ pose: 'front' });
    };
    const chat = async (g: number) => {
      const say = Math.random() < 0.6;
      const words = pick(copyRef.current.idle);
      show({ pose: say ? 'happy' : 'wink', bubble: say ? words : null, align: 'end', below: false });
      kick(1.4);
      if (!(await wait(say ? 2400 : 1000, g))) return;
      show({ pose: 'front', bubble: null });
    };
    const tricks = still
      ? [lookAround, chat, stretch]
      : [lookAround, hop, spin, flip, wander, wander, peekaboo, dance, stretch, shake, chat, chat];

    // ---- blinking ----
    let blinkTimer = 0;
    const blink = () => {
      blinkTimer = window.setTimeout(blink, between(2400, 5600));
      if (viewNow.pose !== 'front' || mode === 'sleep') return;
      const close = () => show({ pose: 'blink' });
      const open = () => {
        if (viewNow.pose === 'blink' && mode !== 'sleep') show({ pose: 'front' });
      };
      close();
      later(open, 110);
      if (Math.random() < 0.22) {
        later(() => viewNow.pose === 'front' && close(), 230);
        later(open, 330);
      }
    };

    // ---- dozing off ----
    let dozeTimer = 0;
    const armDoze = () => {
      window.clearTimeout(dozeTimer);
      dozeTimer = window.setTimeout(doze, DOZE_MS);
    };
    const doze = () => {
      if (mode !== 'home' || document.visibilityState !== 'visible') return armDoze();
      void run('sleep', async (g) => {
        show({ pose: 'yawn', bubble: null });
        bias = -0.1;
        wakeUp();
        if (!(await wait(1000, g))) return;
        bias = 0.03;
        show({ pose: 'blink' });
        if (!(await wait(700, g))) return;
        dockEl.setAttribute('data-asleep', ''); // slow breathing, in CSS
        show({ bubble: 'Zzz…', soft: true, align: 'end', below: false });
        await new Promise<void>(() => {}); // until something happens (activity)
      });
    };
    const wakeFromSleep = () => {
      void run('trick', async (g) => {
        show({ pose: 'surprised', bubble: null, soft: false });
        if (!(await jump(22, 420, g))) return;
        if (!(await wait(350, g))) return;
        show({ pose: 'front' });
      });
    };

    // ---- «el cursor abandonado» ----
    const cursor = { x: -1, y: -1, known: false, t: 0 };
    let inside = true;
    let lastVisit = 0;
    let idleTimer = 0;
    const armIdle = (ms = IDLE_MS) => {
      window.clearTimeout(idleTimer);
      if (mouse) idleTimer = window.setTimeout(visit, ms);
    };
    const visit = () => {
      if (!cursor.known || !inside || document.visibilityState !== 'visible') return;
      if (mode === 'visit' || mode === 'asking' || mode === 'sleep') return;
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
      x = clamp(x, 14, vw - w - 14);
      y = clamp(y, below ? 14 : 70, vh - h.height - 14);
      const align: Align = x + w / 2 > vw - 110 ? 'end' : x + w / 2 < 110 ? 'start' : 'center';
      const dx = x - h.left;
      const dy = y - h.top;

      void run('visit', async (g) => {
        if (!still) {
          const ms = clamp(Math.hypot(dx - goal.x, dy - goal.y) * 1.4, 800, 2000);
          show({ pose: 'side', mirror: dx > goal.x, bubble: null });
          if (!(await travel(dx, dy, ms, g))) return;
        } else setAt(dx, dy);
        mode = 'asking';
        // On the cursor's right he looks left at it; on its left, right.
        show({
          pose: 'turn', mirror: !right && !still, act: '',
          bubble: copyRef.current.ask, align: still ? 'end' : align, below: still ? false : below,
        });
        kick(1.6);
        // He stays until the mouse moves (see wake()).
        await new Promise<void>(() => {});
      });
    };
    // The mouse moved while he was visiting: answer, then fly home.
    const wake = () => {
      if (mode === 'asking') {
        lastVisit = Date.now();
        void run('trick', async (g) => {
          show({ pose: 'happy', mirror: false, bubble: copyRef.current.found, act: 'giggle' });
          if (!(await jump(16, 380, g))) return;
          if (!(await wait(700, g))) return;
          show({ bubble: null, act: '' });
          await goHome(g);
        });
      } else if (mode === 'visit') {
        lastVisit = Date.now();
        void run('trick', goHome);
      }
    };

    // ---- eyes and head on the mouse ----
    let hovering = false;
    let gazeFrame = 0;
    let gazeHold = 0;
    const centre = () => {
      const h = home();
      return { x: h.left + pos.x + h.width / 2, y: h.top + pos.y + h.height / 2 };
    };
    const gaze = () => {
      gazeFrame = 0;
      if (mode !== 'home' || !cursor.known) return;
      const c = centre();
      const dx = cursor.x - c.x;
      const near = Math.hypot(dx, cursor.y - c.y) < 150;
      look = still ? 0 : clamp(dx / 90, -6, 6);
      wakeUp();
      if (gazeHold) return;
      if (viewNow.pose !== 'front' && viewNow.pose !== 'turn') return; // mid-blink or another face
      const next: Partial<View> = near || Math.abs(dx) < 50
        ? { pose: 'front', mirror: false }
        : { pose: 'turn', mirror: dx > 0 };
      if (next.pose === viewNow.pose && next.mirror === viewNow.mirror) return;
      if (viewNow.pose === 'turn' && next.pose === 'turn') {
        // From one side to the other through the front, like turning a head.
        show({ pose: 'front', mirror: false });
        gazeHold = window.setTimeout(() => {
          gazeHold = 0;
          gaze();
        }, 110);
        return;
      }
      show(next);
    };

    // ---- events ----
    const activity = () => {
      if (mode === 'sleep') wakeFromSleep();
      wake();
      armIdle();
      armDoze();
    };
    let lastStartle = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      inside = true;
      const moved = !cursor.known || cursor.x !== e.clientX || cursor.y !== e.clientY;
      // A mouse dashing right past him makes him jump.
      if (cursor.known && moved && mode === 'home' && !hovering) {
        const dt = Math.max(1, e.timeStamp - cursor.t);
        const speed = Math.hypot(e.clientX - cursor.x, e.clientY - cursor.y) / dt;
        const c = centre();
        if (speed > 3 && Math.hypot(e.clientX - c.x, e.clientY - c.y) < 130 && Date.now() - lastStartle > STARTLE_COOLDOWN_MS) {
          lastStartle = Date.now();
          void run('trick', async (g) => {
            show({ pose: 'surprised', mirror: false, bubble: null });
            sway(e.clientX > c.x ? -110 : 110);
            if (!(await jump(18, 380, g))) return;
            if (!(await wait(500, g))) return;
            show({ pose: 'front' });
          });
        }
      }
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.t = e.timeStamp;
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
      cursor.t = e.timeStamp;
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
      void run('sad', async (g) => {
        show({ pose: 'sad', mirror: false, bubble: copyRef.current.leaving, align: 'end', below: false });
        if (!(await travel(0, 0, 400, g))) return;
        bias = 0.07; // slumped
        wakeUp();
        await new Promise<void>(() => {});
      });
    };
    const cheerUp = () => {
      void run('trick', async (g) => {
        show({ pose: 'happy', bubble: copyRef.current.back });
        if (!(await jump(26, 500, g))) return;
        if (!(await wait(900, g))) return;
        show({ pose: 'front', bubble: null });
      });
    };
    let lastScrollY = window.scrollY;
    let lastWhoa = 0;
    const onScroll = () => {
      activity();
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (still || Math.abs(dy) < 2) return;
      // The page sliding past sways him, like a passenger.
      sway(clamp(dy * 0.7, -80, 80));
      if (Math.abs(dy) > 260 && mode === 'home' && Date.now() - lastWhoa > 4000) {
        lastWhoa = Date.now();
        void run('trick', async (g) => {
          show({ pose: 'surprised' });
          kick(-2.4);
          if (!(await wait(650, g))) return;
          show({ pose: 'front' });
        });
      }
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        armIdle();
        armDoze();
      } else window.clearTimeout(idleTimer);
    };

    // Clicks on Rufo himself: a laugh and a line; three quick ones, dizzy.
    let clicks: number[] = [];
    let clickLine = 0;
    const onPoke = () => {
      const now = Date.now();
      clicks = [...clicks.filter((t) => now - t < 900), now];
      lastVisit = now; // he was just played with: no visit right away
      armIdle();
      kick(3);
      if (clicks.length >= 3) {
        clicks = [];
        void run('trick', async (g) => {
          if (!(await goHome(g))) return;
          await spin(g);
          if (gen !== g) return;
          await spin(g);
          if (gen !== g) return;
          show({ pose: 'look', bubble: copyRef.current.dizzy, align: 'end', below: false });
          for (const v of [130, -120, 90, -60]) {
            sway(v);
            if (!(await wait(420, g))) return;
          }
          if (!(await wait(500, g))) return;
          show({ pose: 'front', bubble: null });
        });
        return;
      }
      const line = copyRef.current.clicks[clickLine++ % copyRef.current.clicks.length];
      void run('trick', async (g) => {
        if (goal.x !== 0 || goal.y !== 0) {
          if (!(await goHome(g))) return;
        }
        show({ pose: 'happy', mirror: false, bubble: line, soft: false, act: still ? '' : 'giggle', align: 'end', below: false });
        if (!(await jump(16, 380, g))) return;
        if (!(await wait(1300, g))) return;
        show({ pose: 'front', bubble: null, act: '' });
      });
    };
    const body = moverEl.querySelector<HTMLElement>('[data-rufo-body]');
    const onEnter = (e: PointerEvent) => {
      hovering = true;
      if (e.pointerType === 'mouse') kick(-1.8); // a little stretch, like he perks up
    };
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
    setAt(0, still ? 0 : home().height + 40);
    void run('trick', async (g) => {
      if (!still) {
        if (!(await wait(600, g))) return;
        show({ pose: 'surprised' });
        if (!(await travel(0, 0, 620, g))) return;
        kick(2.8);
        show({ pose: 'front' });
      }
      if (greeted) return;
      show({ pose: 'happy', bubble: copyRef.current.hello });
      if (!(await wait(1800, g))) return;
      show({ pose: 'front', bubble: null });
    });
    blinkTimer = window.setTimeout(blink, 3000);
    armDoze();
    // In development, any trick on demand: window.__rufo('flip').
    if (process.env.NODE_ENV !== 'production') {
      const named: Record<string, (g: number) => Promise<unknown>> = {
        lookAround, hop, spin, flip, wander, peekaboo, dance, stretch, shake, chat,
      };
      (window as unknown as { __rufo?: (name: string) => void }).__rufo = (name) => {
        if (name === 'doze') doze();
        else if (named[name]) void run('trick', named[name]);
      };
    }

    return () => {
      gen++;
      path = null;
      jumping = null;
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(trickTimer);
      window.clearTimeout(idleTimer);
      window.clearTimeout(dozeTimer);
      window.clearTimeout(blinkTimer);
      window.clearTimeout(gazeHold);
      if (gazeFrame) cancelAnimationFrame(gazeFrame);
      if (frame) cancelAnimationFrame(frame);
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
        <div className={styles.ground} data-rufo-ground="">
          <div className={styles.shadow} />
        </div>
        <div
          className={styles.bubble}
          data-show={view.bubble ? '' : undefined}
          data-soft={view.soft ? '' : undefined}
          data-align={view.align}
          data-below={view.below ? '' : undefined}
        >
          {view.bubble ?? lastWords.current}
        </div>
        <div className={styles.air} data-rufo-air="">
          <div className={styles.tilt} data-rufo-tilt="">
            <div className={styles.float}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
