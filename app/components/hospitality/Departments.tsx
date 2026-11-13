'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import s from './HotelGroupsPage.module.css';

/*
 * "By department": the six teams as an index on the left and, on the right,
 * the chosen team's footage with its three points ticking off. It moves on by
 * itself while it is on screen, until someone chooses a team. Below 1000px it
 * is an accordion and stays still.
 */

export type DepartmentKey = 'housekeeping' | 'maintenance' | 'frontDesk' | 'quality' | 'food' | 'management';
export interface Department { key: DepartmentKey; name: string; points: readonly string[] }

type Visual =
  | { kind: 'image'; src: string; focus: string }
  | { kind: 'video'; src: string; poster: string; focus: string }
  /** A capture of the product on a dark stage, not a photo. */
  | { kind: 'screen'; src: string; width: number; height: number };

const VISUALS: Record<DepartmentKey, Visual> = {
  housekeeping: { kind: 'image', src: '/images/photos/room-readiness.jpg', focus: '50% 38%' },
  maintenance: { kind: 'image', src: '/images/photos/engineering.jpg', focus: '45% 30%' },
  frontDesk: { kind: 'image', src: '/images/photos/guest-requests.jpg', focus: '55% 40%' },
  quality: { kind: 'image', src: '/images/photos/faq-team.jpg', focus: '55% 30%' },
  food: { kind: 'video', src: '/media/home/kitchen-grill.mp4', poster: '/media/home/kitchen-grill.jpg', focus: '50% 60%' },
  management: { kind: 'screen', src: '/images/hotel-premium-analytics-es.jpg', width: 1170, height: 446 },
};

const ICONS: Record<DepartmentKey, ReactNode> = {
  housekeeping: <><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" /><path d="M3 15h18M6 10V7.5A1.5 1.5 0 0 1 7.5 6h9A1.5 1.5 0 0 1 18 7.5V10M3 18v1.5M21 18v1.5" /></>,
  maintenance: <path d="M14.6 6.4a4 4 0 0 0-5.2 5.2L4 17l3 3 5.4-5.4a4 4 0 0 0 5.2-5.2l-2.5 2.5-2.1-.5-.5-2.1 2.1-2.9Z" />,
  frontDesk: <><path d="M4 17h16M5.5 17a6.5 6.5 0 0 1 13 0M12 10.5V8M10 8h4" /><path d="M3 20h18" /></>,
  quality: <><path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6.2l-7-2.7Z" /><path d="m9 12 2.2 2.2L15.2 10" /></>,
  food: <><path d="M7 3.5v7M4.5 3.5v4a2.5 2.5 0 0 0 5 0v-4M7 10.5v10" /><path d="M17 20.5v-7h-2.5V8a4.5 4.5 0 0 1 2.5-4.5v10" /></>,
  management: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>,
};

function Icon({ name }: { name: DepartmentKey }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>;
}

export default function Departments({ items }: { items: readonly Department[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useRef(0);
  const [active, setActive] = useState(0);
  // Moves on by itself: wide screens only, and never against a reduced-motion preference.
  const [auto, setAuto] = useState(false);
  const [motion, setMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1000px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const update = () => { setMotion(!reduce.matches && !saveData); setAuto(a => a && wide.matches && !reduce.matches); };
    setMotion(!reduce.matches && !saveData);
    setAuto(wide.matches && !reduce.matches);
    wide.addEventListener('change', update);
    reduce.addEventListener('change', update);
    const node = ref.current;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    if (node) io.observe(node);
    return () => { wide.removeEventListener('change', update); reduce.removeEventListener('change', update); io.disconnect(); window.clearTimeout(hover.current); };
  }, []);

  const choose = (i: number, button: HTMLButtonElement) => {
    window.clearTimeout(hover.current);
    setActive(i);
    setAuto(false);
    // As an accordion, the team above closes and takes the tapped heading with it: bring it back.
    if (window.matchMedia('(max-width: 999px)').matches) {
      window.setTimeout(() => {
        const { top, bottom } = button.getBoundingClientRect();
        if (top < 140 || bottom > window.innerHeight - 40) button.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 540);
    }
  };
  const onEnter = (i: number) => {
    if (!window.matchMedia('(min-width: 1000px) and (hover: hover)').matches) return;
    window.clearTimeout(hover.current);
    hover.current = window.setTimeout(() => setActive(i), 150);
  };

  return <div
    ref={ref}
    className={s.depts}
    data-auto={auto && inView || undefined}
    data-hold={hold || undefined}
    data-reveal=""
    onMouseEnter={() => setHold(true)}
    onMouseLeave={() => { setHold(false); window.clearTimeout(hover.current); }}
    onFocus={() => setHold(true)}
    onBlur={() => setHold(false)}
  >
    {items.map((item, i) => {
      const on = i === active;
      const visual = VISUALS[item.key];
      return <article key={item.key} className={s.dept} data-active={on || undefined}>
        <h3 className={s.deptTitle}>
          <button type="button" id={`dept-${item.key}`} aria-expanded={on} aria-controls={`dept-${item.key}-panel`} onClick={e => choose(i, e.currentTarget)} onMouseEnter={() => onEnter(i)}>
            <span className={s.deptNum} aria-hidden="true">0{i + 1}</span>
            <span className={s.deptIcon}><Icon name={item.key} /></span>
            <span className={s.deptName}>{item.name}</span>
            <svg className={s.deptChevron} viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {on && <span className={s.deptProgress} aria-hidden="true" onAnimationEnd={() => setActive(a => (a + 1) % items.length)} />}
          </button>
        </h3>
        <div className={s.deptPanel} id={`dept-${item.key}-panel`} role="region" aria-labelledby={`dept-${item.key}`}>
          <div className={s.deptInner}>
            <div className={s.deptMedia} data-kind={visual.kind}>
              <DeptVisual visual={visual} play={motion && inView && on} eager={i === 0} />
            </div>
            <div className={s.deptSheet}>
              <p className={s.deptSheetHead} aria-hidden="true"><Icon name={item.key} />{item.name}</p>
              <ul>
                {item.points.map((point, j) => <li key={point} style={{ ['--i' as string]: j }}>
                  <i aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m4 8.4 2.6 2.6L12 5.6" pathLength={1} /></svg></i>
                  {point}
                </li>)}
              </ul>
            </div>
          </div>
        </div>
      </article>;
    })}
  </div>;
}

function DeptVisual({ visual, play, eager }: { visual: Visual; play: boolean; eager: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const src = visual.kind === 'video' ? visual.src : '';
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (play) {
      if (!v.getAttribute('src')) { v.src = src; v.load(); }
      v.muted = true;
      v.play().catch(() => setPlaying(false));
    } else v.pause();
  }, [play, src]);

  if (visual.kind === 'screen') return <Image className={s.deptScreen} src={visual.src} alt="" width={visual.width} height={visual.height} sizes="(max-width: 999px) 120vw, 60vw" />;
  if (visual.kind === 'video') return <>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={visual.poster} alt="" loading="lazy" decoding="async" style={{ objectPosition: visual.focus }} />
    <video ref={video} muted playsInline loop preload="none" data-playing={playing || undefined} onPlaying={() => setPlaying(true)} style={{ objectPosition: visual.focus }} aria-hidden="true" />
  </>;
  return <Image src={visual.src} alt="" fill sizes="(max-width: 999px) 92vw, 50vw" loading={eager ? undefined : 'lazy'} style={{ objectPosition: visual.focus }} />;
}
