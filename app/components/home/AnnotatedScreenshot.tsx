'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import type { Shot, ShotLang } from '../../lib/shots';
import styles from './AnnotatedScreenshot.module.css';

// Positions are percentages of the screenshot. `area` is the highlighted region,
// `marker` the numbered button, and `card` where the callout sits: `side: 'right'`
// puts the card's left edge at `x`, `side: 'left'` puts its right edge there.
interface Annotation {
  title: string;
  text: string;
  area: { x: number; y: number; w: number; h: number };
  marker: { x: number; y: number };
  card: { x: number; y: number; side: 'left' | 'right' };
}

const annotations: Record<ShotLang, Annotation[]> = {
  es: [
    { title: 'Espacios', text: 'Organiza el trabajo por departamento, como Mantenimiento o Ama de llaves.', area: { x: 2, y: 23.6, w: 14.6, h: 36.6 }, marker: { x: 17, y: 25.6 }, card: { x: 19, y: 31, side: 'right' } },
    { title: 'Vistas', text: 'Consulta el espacio como lista de tareas, calendario, mapa o tablero Kanban.', area: { x: 20.6, y: 21.2, w: 21, h: 5.2 }, marker: { x: 33.8, y: 21.2 }, card: { x: 21.5, y: 29, side: 'right' } },
    { title: 'Filtros', text: 'Filtra las tareas por estado, prioridad, ubicación o responsable.', area: { x: 72.9, y: 21.4, w: 6.8, h: 4.6 }, marker: { x: 79.7, y: 21.4 }, card: { x: 79.7, y: 28.5, side: 'left' } },
    { title: 'Ubicaciones', text: 'Identifica la habitación, el piso o el área asociada a cada tarea.', area: { x: 77.2, y: 26.6, w: 11.8, h: 70.4 }, marker: { x: 84.5, y: 28.6 }, card: { x: 75.6, y: 34, side: 'left' } },
  ],
  en: [
    { title: 'Spaces', text: 'Organize work by department, such as Maintenance or Housekeeping.', area: { x: 2, y: 23.6, w: 15, h: 36.6 }, marker: { x: 17.2, y: 25.6 }, card: { x: 19, y: 31, side: 'right' } },
    { title: 'Views', text: 'See the workspace as a task list, calendar, map, or Kanban board.', area: { x: 21, y: 21.2, w: 20.6, h: 5.2 }, marker: { x: 33.8, y: 21.2 }, card: { x: 21.5, y: 29, side: 'right' } },
    { title: 'Filters', text: 'Narrow tasks by status, priority, location, or assignee.', area: { x: 72.7, y: 21.4, w: 6.8, h: 4.6 }, marker: { x: 79.5, y: 21.4 }, card: { x: 79.5, y: 28.5, side: 'left' } },
    { title: 'Locations', text: 'Identify the room, floor, or area associated with each task.', area: { x: 73.6, y: 26.6, w: 11.6, h: 70.4 }, marker: { x: 81, y: 28.6 }, card: { x: 72, y: 34, side: 'left' } },
  ],
};

const copy = {
  es: { group: 'Explorar la pantalla de Whagons', hint: 'Explora la pantalla', hintMore: 'Selecciona un número para conocer más.', prev: 'Anterior', next: 'Siguiente' },
  en: { group: 'Explore the Whagons screen', hint: 'Explore the screen', hintMore: 'Select a number to learn more.', prev: 'Previous', next: 'Next' },
};

const pct = (n: number) => `${n}%`;

export default function AnnotatedScreenshot({ lang, shot, alt, caption }: {
  lang: ShotLang; shot: Shot; alt: string; caption: string;
}) {
  const [selected, setSelected] = useState(0);
  // Tours itself while on screen until the visitor takes over.
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const cardId = useId();
  const panelId = useId();
  const items = annotations[lang];
  const t = copy[lang];
  const active = items[selected];
  const count = items.length;

  useEffect(() => {
    const node = figureRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.55 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function choose(index: number) {
    setAutoplay(false);
    setSelected((index + count) % count);
  }

  const step = <span className={styles.step}>{String(selected + 1).padStart(2, '0')}<i>/</i>{String(count).padStart(2, '0')}</span>;
  // Its animation is the autoplay timer; reduced motion hides it, which stops the tour.
  const progress = autoplay && <span key={`progress-${selected}`} className={styles.progress} aria-hidden="true" onAnimationEnd={() => setSelected((selected + 1) % count)} />;
  const body = <div key={`body-${selected}`} className={styles.body}><strong>{active.title}</strong><p>{active.text}</p></div>;

  function markers(mobile: boolean) {
    return <div className={mobile ? styles.mobileControls : styles.markers} role="group" aria-label={t.group}>
      {items.map((item, index) => <button
        key={item.title}
        type="button"
        className={styles.marker}
        style={mobile ? undefined : { left: pct(item.marker.x), top: pct(item.marker.y) }}
        aria-label={`${index + 1}. ${item.title}`}
        aria-pressed={selected === index}
        aria-controls={mobile ? panelId : cardId}
        onClick={() => choose(index)}
      ><span>{index + 1}</span>{mobile && <span className={styles.mobileLabel}>{item.title}</span>}</button>)}
    </div>;
  }

  const { area, card } = active;

  return <figure
    ref={figureRef}
    className={styles.figure}
    data-paused={!inView || hovered || undefined}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
    <div className={styles.bar}>
      <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
      <span aria-hidden="true">{caption}</span>
      <em className={styles.barHint}>{t.hintMore}</em>
    </div>
    <div className={styles.image}>
      <Image src={shot.src} alt={alt} width={shot.width} height={shot.height} priority sizes="(max-width: 1240px) 100vw, 1180px" quality={90} />
      <div className={styles.spotlight} aria-hidden="true" style={{ left: pct(area.x), top: pct(area.y), width: pct(area.w), height: pct(area.h) }} />
      {markers(false)}
      <div
        id={cardId}
        className={styles.card}
        data-side={card.side}
        style={{ left: pct(card.x), top: pct(card.y) } as CSSProperties}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={styles.cardHead}>
          {step}
          <div className={styles.nav}>
            <button type="button" aria-label={t.prev} onClick={() => choose(selected - 1)}><Chevron dir="left" /></button>
            <button type="button" aria-label={t.next} onClick={() => choose(selected + 1)}><Chevron dir="right" /></button>
          </div>
        </div>
        {body}
        {progress}
      </div>
    </div>
    <figcaption className={styles.caption}>
      <p className={styles.hint}>{t.hint}<span>{t.hintMore}</span></p>
      {markers(true)}
      <div id={panelId} className={styles.explanation} aria-live="polite" aria-atomic="true">
        <span className={styles.activeNumber} aria-hidden="true">{selected + 1}</span>
        {body}
        {progress}
      </div>
    </figcaption>
  </figure>;
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>;
}
