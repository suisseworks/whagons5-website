'use client';

import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../lib/locales';
import styles from './SellingPoints.module.css';

interface Point {
  title: string;
  text: string;
  points: string[];
  guide: string;
  href: string;
  video: string;
  fig: string;
}

const copy: Record<Language, {
  eyebrow: string; title: string; lead: string; all: string; allHref: string;
  play: string; pause: string; choose: string; items: Point[];
}> = {
  es: {
    eyebrow: 'Whagons en acción',
    title: 'Menos seguimiento por WhatsApp. Más trabajo hecho a tiempo.',
    lead: 'Tres partes del día que hoy viven en hojas impresas, grupos de chat y la memoria de alguien. Así se ven en Whagons.',
    all: 'Ver todas las guías',
    allHref: '/es/blog',
    play: 'Reproducir',
    pause: 'Pausar',
    choose: 'Elegir qué ver en acción',
    items: [
      {
        title: 'Las rutinas se programan solas',
        text: 'Define una vez la ronda, sus lugares y cada cuánto se repite. Whagons crea cada tarea a su hora, con su responsable.',
        points: ['Una tarea por cada lugar', 'Diaria, semanal o mensual', 'Un calendario muestra qué se cumplió'],
        guide: 'Guía de Planes de Trabajo',
        href: '/es/blog/planes-de-trabajo',
        video: 'work-plans-schedule',
        fig: 'Planes de trabajo',
      },
      {
        title: 'Cada habitación, en tiempo real',
        text: 'Cada limpieza es una tarea, y cada habitación muestra si está sucia, en limpieza o limpia mientras avanza el turno.',
        points: ['Todas las habitaciones en un tablero', 'Quién la limpió y hace cuánto', 'El avance del turno en porcentaje'],
        guide: 'Guía de Limpieza',
        href: '/es/blog/limpieza',
        video: 'cleaning-board',
        fig: 'Limpieza',
      },
      {
        title: 'Los números del turno, a la vista',
        text: 'Las tarjetas KPI muestran arriba de cada espacio el total de tareas, lo que está en progreso, lo vencido y lo terminado hoy.',
        points: ['Plantillas listas en un par de minutos', 'En progreso filtra la grilla con un toque', 'Ordénalas como prefiera tu equipo'],
        guide: 'Guía de Tarjetas KPI',
        href: '/es/blog/tarjetas-kpi',
        video: 'kpi-cards-template',
        fig: 'Tarjetas KPI',
      },
    ],
  },
  en: {
    eyebrow: 'Whagons in action',
    title: 'Less chasing on WhatsApp. More work done on time.',
    lead: 'Three parts of the day that now live on printed sheets, chat groups and someone’s memory. Here they are in Whagons.',
    all: 'See all guides',
    allHref: '/en/blog',
    play: 'Play',
    pause: 'Pause',
    choose: 'Choose what to see in action',
    items: [
      {
        title: 'Routines schedule themselves',
        text: 'Set up the round, its spots and how often it repeats once. Whagons creates every task on time, with its owner.',
        points: ['One task for every spot', 'Daily, weekly or monthly', 'A calendar shows what got done'],
        guide: 'Work Plans guide',
        href: '/en/blog/work-plans',
        video: 'work-plans-schedule',
        fig: 'Work plans',
      },
      {
        title: 'Every room, in real time',
        text: 'Each cleaning is a task, and each room shows whether it is dirty, being cleaned or clean as the shift moves.',
        points: ['Every room on one board', 'Who cleaned it and when', 'Shift progress as a percentage'],
        guide: 'Cleaning guide',
        href: '/en/blog/cleaning',
        video: 'cleaning-board',
        fig: 'Cleaning',
      },
      {
        title: 'The shift’s numbers, in view',
        text: 'KPI cards show total tasks, work in progress, overdue work and what finished today at the top of every space.',
        points: ['Ready-made templates in minutes', 'In Progress filters the grid in one tap', 'Arrange them the way your team likes'],
        guide: 'KPI Cards guide',
        href: '/en/blog/kpi-cards',
        video: 'kpi-cards-template',
        fig: 'KPI cards',
      },
    ],
  },
};

/**
 * Product animations for the real selling points. The active one plays while
 * the section is on screen, fills its progress bar and hands over to the next
 * when it ends. With reduced motion nothing plays until the visitor asks.
 */
export default function SellingPoints({ lang }: { lang: Language }) {
  const t = copy[lang];
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (video && index !== active) video.pause();
    });
    const video = videos.current[active];
    if (!video) return;
    if (inView && !paused) video.play().catch(() => setPaused(true));
    else video.pause();
  }, [active, inView, paused]);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const video = videos.current[active];
      const bar = bars.current[active];
      if (video && bar && video.duration) bar.style.setProperty('--p', String(video.currentTime / video.duration));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  const show = (index: number) => {
    const video = videos.current[index];
    if (video) video.currentTime = 0;
    setActive(index);
    setPaused(false);
  };

  const current = t.items[active];

  return (
    <section ref={sectionRef} className={styles.section} id="in-action" aria-labelledby="in-action-title">
      <div className={styles.intro} data-reveal="">
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 id="in-action-title">{t.title}</h2>
        <p>{t.lead}</p>
      </div>
      <div className={styles.grid}>
        <div className={styles.list} role="group" aria-label={t.choose} data-reveal="">
          {t.items.map((item, index) => {
            const on = index === active;
            return (
              <div key={item.video} className={styles.item} data-active={on}>
                <button type="button" className={styles.tab} aria-expanded={on} aria-controls="in-action-stage" onClick={() => show(index)}>
                  <span className={styles.num}>0{index + 1}</span>
                  <span className={styles.tabTitle}>{item.title}</span>
                </button>
                <div className={styles.body} aria-hidden={!on}>
                  <div>
                    <p>{item.text}</p>
                    <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                    <a href={item.href} tabIndex={on ? undefined : -1}>{item.guide}<span aria-hidden="true">→</span></a>
                  </div>
                </div>
                <span className={styles.bar} ref={(el) => { bars.current[index] = el; }} aria-hidden="true" />
              </div>
            );
          })}
          <a className={styles.all} href={t.allHref}>{t.all}<span aria-hidden="true">→</span></a>
        </div>
        <figure className={styles.stage} id="in-action-stage" data-reveal="" style={{ ['--d' as string]: '.1s' }}>
          <div className={styles.screen}>
            {t.items.map((item, index) => (
              <video
                key={item.video}
                ref={(el) => { videos.current[index] = el; }}
                className={index === active ? styles.on : undefined}
                src={`/media/blog/${lang}/${item.video}.mp4`}
                poster={`/media/blog/${lang}/${item.video}.jpg`}
                muted
                playsInline
                preload={index === 0 ? 'auto' : 'metadata'}
                aria-label={item.title}
                aria-hidden={index !== active}
                onEnded={() => show((index + 1) % t.items.length)}
              />
            ))}
          </div>
          <figcaption className={styles.caption}>
            <span>FIG {String.fromCharCode(65 + active)} · {current.fig}</span>
            <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
              {paused ? t.play : t.pause}
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
