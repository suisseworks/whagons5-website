'use client';

import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../../lib/locales';
import { routeFor } from '../../../lib/locales';
import { videoSrc } from '../../../lib/media';
import { HOME_CONTENT } from '../content';
import styles from './HowItWorks.module.css';

/**
 * "How it works": one step per role. On wide screens the product animation
 * stays pinned while the steps scroll past and the one in the middle of the
 * screen plays; on narrow screens each step carries its own animation.
 */
export default function HowItWorks({ lang }: { lang: Language }) {
  const t = HOME_CONTENT[lang].how;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [wide, setWide] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const steps = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
    const query = window.matchMedia('(min-width: 1000px)');
    const onWidth = () => setWide(query.matches);
    onWidth();
    query.addEventListener('change', onWidth);
    const section = sectionRef.current;
    if (!section) return;
    const seen = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    seen.observe(section);
    const centre = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
      }
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.current.forEach(step => step && centre.observe(step));
    return () => { seen.disconnect(); centre.disconnect(); query.removeEventListener('change', onWidth); };
  }, []);

  const play = inView && !paused;
  return <section ref={sectionRef} className={styles.section} id={lang === 'es' ? 'como-funciona' : 'how-it-works'} aria-labelledby="how-title">
    <div className={styles.head} data-reveal="">
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <h2 id="how-title">{t.title}</h2>
      <p className={styles.lead}>{t.lead}</p>
    </div>

    <div className={styles.body}>
      <figure className={styles.stage} aria-label={t.steps[active].label}>
        <div className={styles.screen}>
          {t.steps.map((step, i) => <Clip key={step.video} lang={lang} name={step.video} shown={i === active} play={play && wide && i === active} label={step.label} />)}
        </div>
        <figcaption className={styles.caption}>
          <span>{String(active + 1).padStart(2, '0')} / {String(t.steps.length).padStart(2, '0')} · {t.figure}</span>
          <button type="button" onClick={() => setPaused(p => !p)} aria-pressed={paused}>{paused ? t.play : t.pause}</button>
        </figcaption>
      </figure>

      <ol className={styles.steps} aria-label={t.stepsLabel}>
        {t.steps.map((step, i) => <li
          key={step.video}
          ref={el => { steps.current[i] = el; }}
          data-step={i}
          className={styles.step}
          data-active={active === i || undefined}
        >
          <div className={styles.inline} aria-hidden="true">
            <Clip lang={lang} name={step.video} shown play={play && !wide && active === i} label={step.label} />
          </div>
          <p className={styles.role}><span>0{i + 1}</span>{step.role}</p>
          <h3>{step.title}</h3>
          <p className={styles.text}>{step.text}</p>
          {step.guide && <a className={styles.guide} href={step.guide.href}>{step.guide.label}<span aria-hidden="true">→</span></a>}
        </li>)}
      </ol>
    </div>

    <div className={styles.links} data-reveal="">
      <a className={styles.primaryLink} href={routeFor(lang, 'platform')}>{t.platform}<span aria-hidden="true">→</span></a>
      <a href={routeFor(lang, 'features')}>{t.features}<span aria-hidden="true">→</span></a>
    </div>
  </section>;
}

function Clip({ lang, name, shown, play, label }: { lang: Language; name: string; shown: boolean; play: boolean; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) {
      if (!v.getAttribute('src')) { v.src = videoSrc(`/media/blog/${lang}/${name}.mp4`); v.load(); }
      v.muted = true;
      v.play().catch(() => {});
    } else v.pause();
  }, [play, lang, name]);
  return <video
    ref={ref}
    className={styles.clip}
    data-shown={shown || undefined}
    poster={`/media/blog/${lang}/${name}.jpg`}
    muted
    playsInline
    loop
    preload="none"
    aria-label={label}
  />;
}
