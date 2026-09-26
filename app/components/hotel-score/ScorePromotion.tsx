import { Language, routeFor } from '../../lib/locales';
import styles from './Score.module.css';

const copy = {
  es: {
    title: '¿Dónde se están escapando los pendientes de tu hotel?',
    text: 'Responde diez preguntas y descubre qué conviene ordenar primero: solicitudes, turnos, mantenimiento y más. Recibe tu resultado por correo en las siguientes 24 horas, con acciones concretas.',
    cta: 'Descubrir mi score gratis',
    small: '10 preguntas · Diagnóstico por correo · Sin costo',
    stepsLabel: 'De las respuestas a la acción',
    steps: ['Evalúa cómo trabajan hoy tus equipos', 'Identifica tus prioridades de mejora', 'Recibe tu plan y cómo aplicarlo con Whagons'],
  },
  en: {
    title: 'Where is your hotel losing track of the work?',
    text: 'Answer ten questions to discover what to organize first: requests, shifts, maintenance and more. Receive your results by email within the next 24 hours, with concrete actions.',
    cta: 'Discover my free score',
    small: '10 questions · Assessment by email · Free',
    stepsLabel: 'From answers to action',
    steps: ['Assess how your teams work today', 'Identify your improvement priorities', 'Receive your plan and how to apply it with Whagons'],
  },
} as const;

export default function ScorePromotion({ lang }: { lang: Language }) {
  const t = copy[lang];
  return (
    <section className={styles.promotion} aria-labelledby="score-promo-title">
      <div className={`wrap g12 ${styles.promoGrid}`} data-reveal="">
        <p className={`lbl ${styles.promoLabel}`}>Whagons Hotel Operations Score</p>
        <div className={styles.promoCopy}>
          <h2 id="score-promo-title">{t.title}</h2>
          <p>{t.text}</p>
          <a className="btn" data-track="hotel_score_promotion_click" href={routeFor(lang, 'hotelScore')}>
            {t.cta} <span aria-hidden="true">→</span>
          </a>
          <small>{t.small}</small>
        </div>
        <div className={styles.promoSteps}>
          <p className="lbl">{t.stepsLabel}</p>
          <ol>
            {t.steps.map((step, index) => (
              <li key={step}><span>[{index + 1}]</span>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
