'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Language } from '../../../lib/locales';
import { HOME_CONTENT, type AdaptSector, type AdaptTask } from '../content';
import styles from './Adapt.module.css';

const SECTORS: AdaptSector[] = ['cleaning', 'maintenance', 'logistics', 'retail'];
const ROTATE_MS = 6500;

const MOVE_MS = 2000;
const SPACE_COLORS = ['#d4310a', '#2563eb', '#10b981'];

function ProofIcon({ kind }: { kind: NonNullable<AdaptTask['proof']> }) {
  const path = {
    photo: 'M4 7h3l1.5-2h7L17 7h3v12H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    check: 'M9 5h10M9 12h10M9 19h10M4 5l1 1 2-2M4 12l1 1 2-2M4 19l1 1 2-2',
    sign: 'M3 19c3-1 4-6 6-6s0 5 3 5 3-4 5-4 2 3 4 3M14 4l4 4-7 7H7v-4z',
  }[kind];
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg>;
}

/**
 * "How it adapts": the same building blocks (spaces, statuses, spots,
 * close-out, routines, view) filled in for four operations and drawn as a
 * small Whagons window: one task moves on a status while it's shown. It
 * moves on to the next example while it's on screen, until the visitor
 * picks one.
 */
export default function Adapt({ lang }: { lang: Language }) {
  const t = HOME_CONTENT[lang].adapt;
  const [active, setActive] = useState<AdaptSector>('cleaning');
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [moved, setMoved] = useState(false);
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

  useEffect(() => {
    setMoved(false);
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setMoved(true), MOVE_MS);
    return () => window.clearTimeout(timer);
  }, [active, inView]);

  const setup = t.setups[active];
  const tasks = setup.tasks.map((task, i) => i === setup.mover && moved ? { ...task, col: Math.min(task.col + 1, 3) } : task);
  const [total, doing, done, late] = setup.kpis;
  const kpis = moved ? [total, doing - 1, done + 1, late] : setup.kpis;

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
      <div id="adapt-panel" className={styles.panel} role="tabpanel" aria-labelledby={`adapt-tab-${active}`}>
        <div className={styles.app} key={active} aria-label={`${t.ui.window} ${t.sectors[active]}`} role="group">
          <div className={styles.bar}>
            <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
            <span className={styles.crumb}><b>Whagons</b> / {setup.spaces[0]}</span>
            <span className={styles.view}>{setup.view}</span>
          </div>
          <div className={styles.body}>
            <div className={styles.side}>
              <small>{t.ui.spaces}</small>
              <ul>{setup.spaces.map((space, i) => <li key={space} className={i === 0 ? styles.on : undefined} style={{ ['--i' as string]: i }}>
                <i style={{ background: SPACE_COLORS[i] }} aria-hidden="true" />{space}
              </li>)}</ul>
            </div>
            <div className={styles.main}>
              <dl className={styles.kpis}>{t.ui.kpis.map((label, i) => <div key={label} className={i === 3 ? styles.late : undefined}>
                <dt>{label}</dt><dd key={`${active}-${kpis[i]}`}>{kpis[i]}</dd>
              </div>)}</dl>
              <div className={styles.board}>
                {setup.statuses.map((status, c) => {
                  const inCol = tasks.map((task, i) => ({ task, i })).filter(({ task }) => task.col === c);
                  return <div key={status} className={styles.col} style={{ ['--c' as string]: c }}>
                    <p className={styles.colHead}><i aria-hidden="true" /><em>{status}</em><span>{inCol.length}</span></p>
                    {inCol.map(({ task, i }) => <article
                      key={task.title}
                      className={`${styles.card}${i === setup.mover && moved ? ` ${styles.arrived}` : ''}`}
                      style={{ ['--k' as string]: c + i * 0.5 }}
                    >
                      <strong>{task.title}</strong>
                      <span className={styles.spot}>{task.spot}</span>
                      <span className={styles.meta}>
                        <b className={styles.avatar} aria-hidden="true">{task.who}</b>
                        {task.due && <time>{task.due}</time>}
                        {task.proof && <ProofIcon kind={task.proof} />}
                      </span>
                    </article>)}
                  </div>;
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.floats} key={`f-${active}`}>
          <div className={styles.float}>
            <span className={styles.thumb}><Image src={setup.photo} alt="" fill sizes="64px" /></span>
            <div><small>{t.ui.closeout}</small><p>{setup.closeout}</p></div>
          </div>
          <div className={styles.float}>
            <span className={styles.loop} aria-hidden="true">↻</span>
            <div><small>{t.ui.routine}</small><p>{setup.routine}</p></div>
          </div>
        </div>
      </div>
      <p className={styles.note}>{t.note}</p>
    </div>
  </section>;
}
