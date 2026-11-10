'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { routeFor, type Language } from '../../../lib/locales';
import { groups, type GroupId } from '../../../lib/pricing';
import styles from './Powerups.module.css';

/*
 * Powerups: the groups sold on the pricing page, drawn like the app's powerup
 * settings. Daily operations is part of every plan and starts on; the rest
 * switch on one after another when the section comes into view. The switches
 * are a demo: visitors can flip them, nothing is saved.
 */

const copy = {
  es: {
    eyebrow: 'Powerups',
    title: 'Activa lo que tu operación necesita.',
    lead: 'Whagons empieza con tareas, espacios y equipos. Cuando lo necesites, activas powerups para activos, inventario, personal, NFC, inteligencia artificial y más.',
    link: 'Ver powerups y precios',
    settings: 'Configuración',
    active: (on: number, all: number) => `${on} de ${all} activos`,
    included: 'Incluido',
    note: 'Los powerups se agregan por grupo. Algunos grupos vienen incluidos según tu plan.',
  },
  en: {
    eyebrow: 'Powerups',
    title: 'Turn on what your operation needs.',
    lead: 'Whagons starts with tasks, spaces and teams. When you need more, you turn on powerups for assets, inventory, people, NFC, AI and more.',
    link: 'See powerups and pricing',
    settings: 'Settings',
    active: (on: number, all: number) => `${on} of ${all} on`,
    included: 'Included',
    note: 'Powerups are added by group. Some groups come included with your plan.',
  },
};

/** Icon tile colors, close to the app's powerup colors. */
const COLORS: Record<GroupId, string> = {
  daily: '#e8890c',
  maintenance: '#2563eb',
  compliance: '#0d9488',
  people: '#e11d48',
  supply: '#7c3aed',
  mobility: '#16a34a',
  sales: '#ea580c',
  ai: '#d4310a',
};

/** Billing notes in the pricing data that are not features. */
const NOT_A_MODULE = /por separado|billed separately/i;

const ALWAYS_ON: GroupId = 'daily';
const STAGGER_MS = 170;

export default function Powerups({ lang }: { lang: Language }) {
  const t = copy[lang];
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<Set<GroupId>>(() => new Set([ALWAYS_ON]));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const allOn = () => setOn(new Set(groups.map(g => g.id)));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      allOn();
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      setStarted(true);
    }, { threshold: 0.3 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Switch the groups on one after another, in grid order.
  useEffect(() => {
    if (!started) return;
    const timers = groups
      .filter(g => g.id !== ALWAYS_ON)
      .map((g, i) => window.setTimeout(() => setOn(prev => new Set(prev).add(g.id)), 300 + i * STAGGER_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [started]);

  const toggle = (id: GroupId) => {
    if (id === ALWAYS_ON) return;
    setOn(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return <section className={styles.section} id="powerups" aria-labelledby="powerups-title">
    <div className={styles.head} data-reveal="">
      <div>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 id="powerups-title">{t.title}</h2>
      </div>
      <div className={styles.headSide}>
        <p className={styles.lead}>{t.lead}</p>
        <a className={styles.link} href={routeFor(lang, 'pricing')}>{t.link} <span aria-hidden="true">→</span></a>
      </div>
    </div>

    <div ref={ref} className={styles.window} data-reveal="" style={{ ['--d' as string]: '.08s' }}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.crumb}>{t.settings} <span aria-hidden="true">›</span> <b>Powerups</b></span>
        <span className={styles.count}>
          <i style={{ ['--p' as string]: on.size / groups.length } as CSSProperties} aria-hidden="true" />
          {t.active(on.size, groups.length)}
        </span>
      </div>

      <ul className={styles.grid}>
        {groups.map(group => {
          const g = group[lang];
          const checked = on.has(group.id);
          const locked = group.id === ALWAYS_ON;
          const modules = g.modules.filter(m => !NOT_A_MODULE.test(m) && m !== g.name);
          const nameId = `powerup-${group.id}`;
          return <li
            key={group.id}
            className={styles.card}
            data-on={checked || undefined}
            data-ai={group.id === 'ai' || undefined}
            style={{ ['--c' as string]: COLORS[group.id] } as CSSProperties}
          >
            <div className={styles.cardTop}>
              <span className={styles.tile}><Icon name={group.icon} /></span>
              {locked && <span className={styles.included}>{t.included}</span>}
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-labelledby={nameId}
                aria-disabled={locked || undefined}
                className={styles.switch}
                onClick={() => toggle(group.id)}
              ><i /></button>
            </div>
            <h3 id={nameId}>{g.name}</h3>
            <p>{g.description}</p>
            {modules.length > 0
              ? <ul className={styles.modules}>{modules.map(m => <li key={m}>{m}</li>)}</ul>
              : <span className={styles.thinking} aria-hidden="true"><Icon name="spark" /><i /><i /><i /></span>}
          </li>;
        })}
      </ul>

      <p className={styles.note}>{t.note}</p>
    </div>
  </section>;
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    tool: <path d="m14 6 4 4 3-3a6 6 0 0 1-7 8l-6 6a3 3 0 0 1-4-4l6-6a6 6 0 0 1 8-7l-4 2Z" />,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2" /></>,
    box: <><path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M8 5l9 5" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    chart: <><path d="M4 3v17h17M8 15l4-5 4 2 5-7M16 5h5v5" /></>,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
