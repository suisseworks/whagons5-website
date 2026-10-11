import Image from 'next/image';
import type { Language } from '../../lib/locales';
import styles from './HeroVisual.module.css';

// Product moments floating over the hero photo: a housekeeping request and
// a maintenance job in progress. They are illustrations, so screen readers
// get the technician's photo only.
const copy = {
  en: {
    request: 'New request',
    now: 'Now',
    requestTitle: 'Extra towels · Room 312',
    requestOwner: 'Lucía · Housekeeping',
    requestDue: 'Due in 15 min',
    techAlt: 'A maintenance technician checking an electrical panel',
    techStatus: 'In progress',
    techTitle: 'Power outage · Room 118',
    techOwner: 'Diego · Maintenance',
    ready: 'Room 204 is ready',
    readyMeta: 'Cleaned · Inspected',
  },
  es: {
    request: 'Nueva solicitud',
    now: 'Ahora',
    requestTitle: 'Toallas extra · Hab. 312',
    requestOwner: 'Lucía · Ama de llaves',
    requestDue: 'Vence en 15 min',
    techAlt: 'Un técnico de mantenimiento revisando un tablero eléctrico',
    techStatus: 'En progreso',
    techTitle: 'Sin electricidad · Hab. 118',
    techOwner: 'Diego · Mantenimiento',
    ready: 'Habitación 204 lista',
    readyMeta: 'Limpieza · Inspección',
  },
} as const;

export default function HeroVisual({ lang }: { lang: Language }) {
  const t = copy[lang];
  return (
    <div className={styles.visual}>
      <div className={`${styles.card} ${styles.ready}`} aria-hidden="true">
        <span className={styles.check}>
          <svg width="16" height="16" viewBox="0 0 18 18"><path d="M4.5 9.4 7.6 12.3 13.5 5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span className={styles.cardText}><strong>{t.ready}</strong><small>{t.readyMeta}</small></span>
      </div>

      <div className={`${styles.card} ${styles.request}`} aria-hidden="true">
        <span className={styles.requestHead}><i className={styles.live} />{t.request}<time>{t.now}</time></span>
        <strong className={styles.requestTitle}>{t.requestTitle}</strong>
        <span className={styles.requestFoot}><span className={styles.avatar}>L</span>{t.requestOwner}<em>{t.requestDue}</em></span>
      </div>

      <div className={`${styles.card} ${styles.tech}`}>
        <div className={styles.techPhoto}>
          <Image src="/images/photos/hero-maintenance.jpg" alt={t.techAlt} fill sizes="240px" />
          <span className={styles.techStatus} aria-hidden="true"><i />{t.techStatus}</span>
        </div>
        <span className={styles.techBody} aria-hidden="true">
          <strong>{t.techTitle}</strong>
          <span className={styles.techMeta}><span className={styles.avatar} data-tone="blue">D</span>{t.techOwner}</span>
        </span>
      </div>
    </div>
  );
}
