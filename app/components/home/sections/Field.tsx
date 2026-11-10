import Image from 'next/image';
import type { Language } from '../../../lib/locales';
import FieldCards from './FieldCards';
import styles from './Field.module.css';

/*
 * "On the floor": the photo and floating product cards from the earlier home
 * hero, as a full-bleed band between the customers and "How it adapts".
 */
const copy = {
  es: {
    eyebrow: 'En el piso, en tiempo real',
    title: <>Cada pedido llega <em>a quien lo resuelve.</em></>,
    lead: 'Una solicitud entra y Whagons la asigna con su responsable y su plazo. Aparece en el teléfono de quien está en turno y, cuando se cierra, todo el equipo lo ve.',
    points: ['En el teléfono y en la web', 'Responsable y plazo en cada tarea', 'Evidencia al cerrar'],
    photoAlt: 'Una colaboradora de un hotel sonriendo en una habitación',
  },
  en: {
    eyebrow: 'On the floor, in real time',
    title: <>Every request reaches <em>the person who handles it.</em></>,
    lead: 'A request comes in and Whagons assigns it with an owner and a due time. It shows up on the phone of whoever is on shift and, once it’s closed, the whole team sees it.',
    points: ['On phones and on the web', 'An owner and a due time for every task', 'Evidence at close-out'],
    photoAlt: 'A smiling member of a hotel team in a guest room',
  },
} as const;

export default function Field({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className={styles.section} aria-labelledby="field-title">
    <Image className={styles.photo} src="/images/photos/hero-woman.jpg" alt={t.photoAlt} fill sizes="100vw" />
    <div className={styles.inner}>
      <div className={styles.copy} data-reveal="">
        <p className={styles.eyebrow}><span aria-hidden="true" />{t.eyebrow}</p>
        <h2 id="field-title">{t.title}</h2>
        <p className={styles.lead}>{t.lead}</p>
        <ul className={styles.points}>
          {t.points.map(point => <li key={point}><svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true"><path d="M4.5 9.4 7.6 12.3 13.5 5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>{point}</li>)}
        </ul>
      </div>
      <div className={styles.visual}>
        <FieldCards lang={lang} />
      </div>
    </div>
  </section>;
}
