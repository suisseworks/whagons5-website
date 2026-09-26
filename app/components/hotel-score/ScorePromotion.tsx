import { Language, routeFor } from '../../lib/locales';
import styles from './ScorePromotion.module.css';

export default function ScorePromotion({ lang }: { lang: Language }) {
  const es = lang === 'es';
  const benefits = es
    ? ['Evalúa cómo trabajan hoy tus equipos', 'Identifica tus prioridades de mejora', 'Recibe acciones concretas para tu hotel']
    : ['Assess how your teams work today', 'Identify your improvement priorities', 'Get practical actions for your hotel'];
  const priorities = es
    ? [
      { area: 'Cambios de turno', action: 'Dejar cada pendiente con un responsable.' },
      { area: 'Mantenimiento', action: 'Programar y dar seguimiento a las revisiones.' },
      { area: 'Solicitudes de huéspedes', action: 'Confirmar el cierre con recepción.' },
    ]
    : [
      { area: 'Shift handovers', action: 'Give every open task a clear owner.' },
      { area: 'Maintenance', action: 'Schedule inspections and track follow-through.' },
      { area: 'Guest requests', action: 'Confirm completion with the front desk.' },
    ];

  return <section id="hotel-score" className={styles.promotion} aria-labelledby="score-promo-title">
    <div className={styles.panel}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 18V12m8 6V6m8 12V3M2 22h20" /></svg>WHAGONS HOTEL OPERATIONS SCORE</p>
        <h2 id="score-promo-title">{es ? 'Conoce el estado de tu operación.' : 'See where your hotel stands.'} <em>{es ? 'Decide por dónde empezar.' : 'Know where to start.'}</em></h2>
        <p className={styles.description}>{es ? 'Diez preguntas para detectar dónde se pierden los pendientes y qué conviene ordenar primero en tu hotel.' : 'Ten questions to uncover where work falls through the cracks and what to organize first at your hotel.'}</p>
        <ul className={styles.benefits}>{benefits.map(benefit => <li key={benefit}><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>{benefit}</li>)}</ul>
        <a className={styles.primary} data-track="hotel_score_promotion_click" href={routeFor(lang, 'hotelScore')}>{es ? 'Descubrir mi score gratis' : 'Discover my free score'}<span aria-hidden="true">↗</span></a>
        <p className={styles.delivery}>{es ? 'Sin costo. Tu diagnóstico por correo en 24 horas.' : 'Free. Your assessment by email within 24 hours.'}</p>
      </div>
      <div className={styles.report} aria-label={es ? 'Ejemplo ilustrativo de un diagnóstico, no es el resultado de tu hotel' : 'Illustrative assessment, not your hotel’s result'}>
        <div className={styles.reportHeader}><span>HOTEL OPERATIONS<br /><strong>SCORE</strong></span><span className={styles.example}>{es ? 'Ejemplo de resultado' : 'Sample result'}</span></div>
        <div className={styles.scoreOverview}>
          <div className={styles.gauge}>
            <svg viewBox="0 0 160 160" aria-hidden="true"><circle className={styles.track} cx="80" cy="80" r="68" /><circle className={styles.fill} cx="80" cy="80" r="68" pathLength="100" strokeDasharray="60 100" /></svg>
            <div><strong>60</strong><span>{es ? 'de 100' : 'out of 100'}</span></div>
          </div>
          <div className={styles.scoreLabel}><span>{es ? 'Estado operativo' : 'Operational status'}</span><strong>{es ? 'Bajo control' : 'Under control'}</strong><p>{es ? 'El siguiente paso: trabajar en tus prioridades de mejora.' : 'Next step: focus on your improvement priorities.'}</p></div>
        </div>
        <div className={styles.prioritiesHeader}><h3>{es ? 'Tu plan empieza aquí' : 'Your plan starts here'}</h3><span>{es ? '3 prioridades' : '3 priorities'}</span></div>
        <ol className={styles.priorities}>{priorities.map((priority, index) => <li key={priority.area}><span className={styles.number}>{String(index + 1).padStart(2, '0')}</span><div><strong>{priority.area}</strong><p>{priority.action}</p></div></li>)}</ol>
        <p className={styles.reportNote}>{es ? 'Tu score y tus recomendaciones se basan en tus respuestas.' : 'Your score and recommendations are based on your answers.'}</p>
      </div>
    </div>
    <div className={styles.footer}><span><strong>10</strong>{es ? 'preguntas sobre tu operación' : 'questions about your operations'}</span><span><strong>3</strong>{es ? 'prioridades para enfocar tu esfuerzo' : 'priorities to focus your effort'}</span><span><strong>24 h</strong>{es ? 'para recibir tu diagnóstico' : 'to receive your assessment'}</span></div>
  </section>;
}
