'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import s from './HotelGroupsPage.module.css';

/*
 * The room 204 example: the photo and the four steps. While it is on screen
 * the request moves from one team to the next, and the card on the photo says
 * whose turn it is. All four steps stay readable throughout; hovering a step
 * stops on it. With reduced motion nothing moves and every step is lit.
 */

type Step = readonly [label: string, title: string, text: string];
const STEP_MS = 2800;

export default function FlowSteps({ steps, photo, alt, focus, caption }: { steps: readonly Step[]; photo: string; alt: string; focus?: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [motion, setMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotion(!reduce.matches);
    update();
    reduce.addEventListener('change', update);
    const node = ref.current;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    if (node) io.observe(node);
    return () => { reduce.removeEventListener('change', update); io.disconnect(); };
  }, []);

  const playing = motion && inView;
  useEffect(() => {
    if (!playing || hold) return;
    const id = window.setInterval(() => setStep(v => (v + 1) % steps.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, hold, steps.length]);

  const now = steps[step];
  return <div ref={ref} className={s.flow} data-playing={playing || undefined}>
    <figure className={s.flowPhoto} data-reveal="">
      <Image src={photo} alt={alt} fill sizes="(max-width: 1099px) 92vw, 44vw" style={{ objectPosition: focus }} />
      <figcaption>{caption}</figcaption>
      {motion && <div className={s.flowNow} aria-hidden="true">
        <span key={step} className={s.flowNowText}>
          <span className={s.tag}>{now[0]}</span>
          <strong>{now[1]}</strong>
        </span>
        <span className={s.flowBars}>{steps.map((item, i) => <i key={item[1]} data-state={i < step ? 'done' : i === step ? 'now' : undefined} />)}</span>
      </div>}
    </figure>
    <ol className={s.timeline} onMouseLeave={() => setHold(false)}>
      {steps.map(([label, title, text], i) => (
        <li
          key={title}
          data-reveal=""
          data-state={!playing ? undefined : i < step ? 'done' : i === step ? 'now' : 'next'}
          style={{ ['--d' as string]: `${i * 0.07}s` }}
          onMouseEnter={() => { if (playing) { setHold(true); setStep(i); } }}
        >
          <span className={s.tag}>{label}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  </div>;
}
