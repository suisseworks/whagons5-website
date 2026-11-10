'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Language } from '../../../lib/locales';
import { routeFor } from '../../../lib/locales';
import { HOME_CONTENT } from '../content';
import { MEDIA } from '../hero/media';
import styles from './Contexts.module.css';

/**
 * "In different contexts": an index of operations in large type. Choosing one
 * shows its footage, a day with Whagons and the features it relies on.
 */
export default function Contexts({ lang }: { lang: Language }) {
  const t = HOME_CONTENT[lang].contexts;
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [motion, setMotion] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const hover = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setMotion(!reduce && !connection?.saveData);
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = t.items.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select((active + 1) % n, true); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select((active + n - 1) % n, true); }
    if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    if (e.key === 'End') { e.preventDefault(); select(n - 1, true); }
  };
  const onEnter = (i: number) => {
    window.clearTimeout(hover.current);
    hover.current = window.setTimeout(() => setActive(i), 140);
  };

  const item = t.items[active];
  return <section ref={ref} className={styles.section} id={lang === 'es' ? 'contextos' : 'contexts'} aria-labelledby="contexts-title">
    <div className={styles.head} data-reveal="">
      <div>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 id="contexts-title">{t.title}</h2>
      </div>
      <p className={styles.lead}>{t.lead}</p>
    </div>

    <div className={styles.body}>
      <div className={styles.list} role="tablist" aria-orientation="vertical" aria-label={t.listLabel} data-reveal="" onMouseLeave={() => window.clearTimeout(hover.current)}>
        {t.items.map((context, i) => <button
          key={context.slug}
          ref={el => { tabs.current[i] = el; }}
          type="button"
          role="tab"
          id={`context-tab-${context.slug}`}
          aria-selected={active === i}
          aria-controls="context-panel"
          tabIndex={active === i ? 0 : -1}
          className={styles.tab}
          onClick={() => select(i)}
          onKeyDown={onKey}
          onMouseEnter={() => onEnter(i)}
        >
          <span className={styles.num} aria-hidden="true">0{i + 1}</span>
          <span className={styles.name}>{context.name}</span>
          <span className={styles.who}>{context.who}</span>
          <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>)}
      </div>

      <div className={styles.panel} id="context-panel" role="tabpanel" aria-labelledby={`context-tab-${item.slug}`} data-reveal="" style={{ ['--d' as string]: '.08s' }}>
        <div className={styles.media}>
          {t.items.map((context, i) => <ContextMedia key={context.slug} mediaKey={context.media} alt={context.alt} shown={i === active} play={motion && inView && i === active} />)}
          <span className={styles.tag}>{item.name}</span>
        </div>
        <div className={styles.details} key={item.slug}>
          <p className={styles.label}>{t.dayLabel}</p>
          <ol className={styles.day}>
            {item.day.map(([time, text]) => <li key={time}><time>{time}</time><p>{text}</p></li>)}
          </ol>
          <p className={styles.label}>{t.usesLabel}</p>
          <ul className={styles.uses}>{item.uses.map(use => <li key={use}>{use}</li>)}</ul>
          {item.link && <a className={styles.link} href={item.link.href}>{item.link.label}<span aria-hidden="true">→</span></a>}
        </div>
      </div>
    </div>

    <p className={styles.missing} data-reveal="">
      {t.missing} <a href={routeFor(lang, 'demo')} data-track="demo_contexts_click">{t.missingLink}</a>
      <span aria-hidden="true"> · </span>
      <a href={routeFor(lang, 'markets')}>{t.allLink}</a>
    </p>
  </section>;
}

function ContextMedia({ mediaKey, alt, shown, play }: { mediaKey: keyof typeof MEDIA; alt: string; shown: boolean; play: boolean }) {
  const m = MEDIA[mediaKey];
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (play) {
      if (!v.getAttribute('src')) { v.src = m.src; v.load(); }
      v.muted = true;
      v.play().catch(() => setPlaying(false));
    } else v.pause();
  }, [play, m.src]);
  return <div className={styles.layer} data-shown={shown || undefined} aria-hidden={!shown}>
    {m.kind === 'video'
      ? <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.poster} alt={alt} loading="lazy" decoding="async" style={{ objectPosition: m.focus }} />
        <video ref={video} muted playsInline loop preload="none" data-playing={playing || undefined} onPlaying={() => setPlaying(true)} style={{ objectPosition: m.focus }} aria-hidden="true" />
      </>
      : <Image src={m.src} alt={alt} fill sizes="(max-width: 900px) 92vw, 46vw" style={{ objectPosition: m.focus }} />}
  </div>;
}
