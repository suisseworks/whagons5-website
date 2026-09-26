'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import type { Shot, ShotLang } from '../../lib/shots';
import styles from './AnnotatedScreenshot.module.css';

const annotations = {
  es: [
    { title: 'Espacios', text: 'Organiza el trabajo por departamento, como Mantenimiento o Ama de llaves.', x: 17.2, y: 25.5 },
    { title: 'Vistas', text: 'Consulta el espacio como lista de tareas, calendario, mapa o tablero Kanban.', x: 33.8, y: 21 },
    { title: 'Filtros', text: 'Filtra las tareas por estado, prioridad, ubicación o responsable.', x: 74, y: 21 },
    { title: 'Ubicaciones', text: 'Identifica la habitación, el piso o el área asociada a cada tarea.', x: 81, y: 28.7 },
  ],
  en: [
    { title: 'Spaces', text: 'Organize work by department, such as Maintenance or Housekeeping.', x: 17.2, y: 25.5 },
    { title: 'Views', text: 'See the workspace as a task list, calendar, map, or Kanban board.', x: 33.8, y: 21 },
    { title: 'Filters', text: 'Narrow tasks by status, priority, location, or assignee.', x: 74, y: 21 },
    { title: 'Locations', text: 'Identify the room, floor, or area associated with each task.', x: 81, y: 28.7 },
  ],
};

export default function AnnotatedScreenshot({ lang, shot, alt, caption }: {
  lang: ShotLang; shot: Shot; alt: string; caption: string;
}) {
  const [selected, setSelected] = useState(0);
  const panelId = useId();
  const items = annotations[lang];
  const active = items[selected];
  const groupLabel = lang === 'es' ? 'Explorar la pantalla de Whagons' : 'Explore the Whagons screen';

  function controls(mobile: boolean) {
    return <div className={mobile ? styles.mobileControls : styles.markers} role="group" aria-label={groupLabel}>
      {items.map((item, index) => <button
        key={item.title}
        type="button"
        className={styles.marker}
        style={mobile ? undefined : { left: `${item.x}%`, top: `${item.y}%` }}
        aria-label={`${index + 1}. ${item.title}`}
        aria-pressed={selected === index}
        aria-controls={panelId}
        onClick={() => setSelected(index)}
      ><span>{index + 1}</span>{mobile && <span className={styles.mobileLabel}>{item.title}</span>}</button>)}
    </div>;
  }

  return <figure className={styles.figure}>
    <div className={styles.bar} aria-hidden="true"><i /><i /><i /><span>{caption}</span></div>
    <div className={styles.image}>
      <Image src={shot.src} alt={alt} width={shot.width} height={shot.height} priority sizes="(max-width: 1480px) 92vw, 1320px" quality={90} />
      {controls(false)}
    </div>
    <figcaption className={styles.caption}>
      <p className={styles.hint}>{lang === 'es' ? 'Explora la pantalla' : 'Explore the screen'}<span>{lang === 'es' ? 'Selecciona un número para conocer más.' : 'Select a number to learn more.'}</span></p>
      {controls(true)}
      <div id={panelId} className={styles.explanation} aria-live="polite" aria-atomic="true">
        <span className={styles.activeNumber} aria-hidden="true">{selected + 1}</span>
        <div><strong>{active.title}</strong><p>{active.text}</p></div>
      </div>
    </figcaption>
  </figure>;
}
