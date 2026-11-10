// The free hotel evaluation: the secondary button on the home page (hero and
// closing section) and its page (/en/evaluation, /es/evaluacion). Requests use
// the demo form and its delivery; this tag only changes the internal email
// (see app/lib/demo-delivery.mjs).
export const FREE_EVALUATION_SOURCE = 'free-evaluation';

export const freeEvaluation = {
  en: {
    cta: 'Evaluate my hotel for free',
    eyebrow: 'Free evaluation',
    title: 'See where work slips between your teams.',
    lead: 'We review how your hotel runs today and show you where tasks lose their owner, due time or proof.',
    perks: [
      'We look at the workflows that matter most: guest requests, rooms, maintenance, inspections or shifts.',
      'We go through them with your team, around how your hotel already works.',
      'You get a clear recommendation on where to start, with or without Whagons.',
    ],
    formIntro: 'Tell us about your hotel. We’ll contact you personally to arrange the evaluation.',
    note: 'Free, with no commitment.',
    successEyebrow: 'Request received',
    success: 'Thank you. We’ll contact you personally to arrange your evaluation.',
    metaTitle: 'Free Hotel Evaluation',
    metaDescription: 'See where work slips between your hotel’s teams. A free evaluation of guest requests, rooms, maintenance, inspections and shifts, with no commitment.',
  },
  es: {
    cta: 'Evaluar mi hotel gratis',
    eyebrow: 'Evaluación gratuita',
    title: 'Descubre dónde se pierde el trabajo entre tus equipos.',
    lead: 'Revisamos cómo funciona hoy tu hotel y te mostramos dónde las tareas pierden responsable, plazo o evidencia.',
    perks: [
      'Revisamos los flujos que más importan: solicitudes de huéspedes, habitaciones, mantenimiento, inspecciones o turnos.',
      'Lo hacemos junto con tu equipo, según cómo ya funciona tu hotel.',
      'Recibes una recomendación clara de por dónde empezar, con o sin Whagons.',
    ],
    formIntro: 'Cuéntanos sobre tu hotel. Te contactaremos personalmente para coordinar la evaluación.',
    note: 'Gratis y sin compromiso.',
    successEyebrow: 'Solicitud recibida',
    success: 'Gracias. Te contactaremos personalmente para coordinar tu evaluación.',
    metaTitle: 'Evaluación Gratuita para Hoteles',
    metaDescription: 'Descubre dónde se pierde el trabajo entre los equipos de tu hotel. Una evaluación gratuita de solicitudes, habitaciones, mantenimiento, inspecciones y turnos, sin compromiso.',
  },
} as const;
