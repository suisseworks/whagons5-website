'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Language } from '../../../lib/locales';
import { HOME_CONTENT, type AdaptSector } from '../content';
import styles from './Adapt.module.css';

const SECTORS: AdaptSector[] = ['cleaning', 'maintenance', 'logistics', 'retail'];
const ROTATE_MS = 6500;

/**
 * "How it adapts": the same building blocks (spaces, spots, statuses,
 * close-out, routines, view) filled in for four operations. It moves on to
 * the next example while it's on screen, until the visitor picks one.
 */
export default function Adapt({ lang }: { lang: Language }) {
  const t = HOME_CONTENT[lang].adapt;
  const [active, setActive] = useState<AdaptSector>('cleaning');
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(false);
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView) return;
    const timer = window.setTimeout(() => setActive(a => SECTORS[(SECTORS.indexOf(a) + 1) % SECTORS.length]), ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [active, auto, inView]);

  const pick = (sector: AdaptSector, focus = false) => {
    setAuto(false);
    setActive(sector);
    if (focus) tabs.current[SECTORS.indexOf(sector)]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = SECTORS.indexOf(active);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick(SECTORS[(i + 1) % SECTORS.length], true); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(SECTORS[(i + SECTORS.length - 1) % SECTORS.length], true); }
    if (e.key === 'Home') { e.preventDefault(); pick(SECTORS[0], true); }
    if (e.key === 'End') { e.preventDefault(); pick(SECTORS[SECTORS.length - 1], true); }
  };

  return <section ref={ref} className={styles.section} id={lang === 'es' ? 'como-se-adapta' : 'how-it-adapts'} aria-labelledby="adapt-title">
    <div className={styles.intro} data-reveal="">
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <h2 id="adapt-title">{t.title}</h2>
      <p className={styles.lead}>{t.lead}</p>
      <ol className={styles.principles}>
        {t.principles.map(([title, text], i) => <li key={title}><span>0{i + 1}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}
      </ol>
    </div>

    <div className={styles.config} data-reveal="" style={{ ['--d' as string]: '.08s' }}>
      <div className={styles.tabs} role="tablist" aria-label={t.tabsLabel}>
        {SECTORS.map((sector, i) => <button
          key={sector}
          ref={el => { tabs.current[i] = el; }}
          type="button"
          role="tab"
          id={`adapt-tab-${sector}`}
          aria-selected={active === sector}
          aria-controls="adapt-panel"
          tabIndex={active === sector ? 0 : -1}
          onClick={() => pick(sector)}
          onKeyDown={onKey}
        >
          {t.sectors[sector]}
          {active === sector && auto && inView && <i key={sector} className={styles.timer} style={{ animationDuration: `${ROTATE_MS}ms` }} aria-hidden="true" />}
        </button>)}
      </div>
      <div id="adapt-panel" className={styles.sheet} role="tabpanel" aria-labelledby={`adapt-tab-${active}`} key={active}>
        {t.rows.map((row, i) => {
          const value = row.values[active];
          return <div key={row.label} className={styles.row} style={{ ['--i' as string]: i }}>
            <div className={styles.rowLabel}><span>{row.label}</span><small>{row.hint}</small></div>
            <div className={styles.rowValue}>
              {Array.isArray(value)
                ? row.kind === 'flow'
                  ? <ol className={styles.flow}>{value.map((v, j) => <li key={v} style={{ ['--j' as string]: j }}><i />{v}</li>)}</ol>
                  : <ul className={styles.chips}>{value.map(v => <li key={v}>{v}</li>)}</ul>
                : <p>{value}</p>}
            </div>
          </div>;
        })}
      </div>
      <p className={styles.note}>{t.note}</p>
    </div>
  </section>;
}
