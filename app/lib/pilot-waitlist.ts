// Pilot program copy, shared by the home page, the nav and the waitlist page
// (/en/pilot, /es/piloto). Signups use the demo form and its delivery; this tag
// only changes the internal email (see app/lib/demo-delivery.mjs).
export const PILOT_WAITLIST_SOURCE = 'pilot-waitlist';

export const pilotWaitlist = {
  en: {
    badge: 'Now accepting pilot customers',
    reason: 'We set up each rollout hands-on with your team, so we take on a limited number of pilots at a time.',
    cta: 'Join the waitlist',
    eyebrow: 'Pilot program',
    title: 'A pilot built around your operation.',
    description: 'We start with one real workflow, configure it with your team, train everyone who uses it and support the rollout. Join the waitlist and we’ll reach out personally.',
    demoPrompt: 'Prefer to see it first?',
    pageTitle: 'Join the pilot waitlist.',
    pageLead: 'Each pilot is set up hands-on with your team, around how your operation already works. That’s why we take on a limited number at a time.',
    perks: [
      'One real workflow to start: guest requests, rooms, maintenance, inspections or shifts.',
      'We configure the scope with you, train your team and support the rollout.',
      'Your PMS and current systems stay. Whagons coordinates the work between them.',
      'Not a hotel? Other operational teams are welcome too.',
    ],
    formIntro: 'Tell us about your operation. We read every signup and reply personally.',
    note: 'Joining doesn’t commit you to anything.',
    successEyebrow: 'You’re on the list',
    success: 'Thank you. We’ll contact you personally to learn about your operation and see when we can start.',
    metaTitle: 'Pilot program waitlist',
    metaDescription: 'Whagons is onboarding a limited number of pilot customers, each set up hands-on with their team. Join the waitlist.',
  },
  es: {
    badge: 'Abiertos a clientes piloto',
    reason: 'Configuramos cada implementación junto con tu equipo, por eso trabajamos con un número limitado de pilotos a la vez.',
    cta: 'Unirse a la lista de espera',
    eyebrow: 'Programa piloto',
    title: 'Un piloto a la medida de tu operación.',
    description: 'Empezamos con un flujo real, lo configuramos con tu equipo, capacitamos a quienes lo usan y acompañamos la puesta en marcha. Únete a la lista de espera y te contactaremos personalmente.',
    demoPrompt: '¿Prefieres verlo primero?',
    pageTitle: 'Únete a la lista de espera.',
    pageLead: 'Configuramos cada piloto junto con tu equipo, según cómo ya funciona tu operación. Por eso trabajamos con un número limitado de clientes a la vez.',
    perks: [
      'Un flujo real para empezar: solicitudes de huéspedes, habitaciones, mantenimiento, inspecciones o turnos.',
      'Definimos el alcance contigo, capacitamos a tu equipo y acompañamos la puesta en marcha.',
      'Tu PMS y tus sistemas actuales se mantienen; Whagons coordina el trabajo entre ellos.',
      '¿No eres un hotel? Otros equipos operativos también son bienvenidos.',
    ],
    formIntro: 'Cuéntanos sobre tu operación. Leemos cada solicitud y te respondemos personalmente.',
    note: 'Unirte a la lista no te compromete a nada.',
    successEyebrow: 'Ya estás en la lista',
    success: 'Gracias. Te contactaremos personalmente para conocer tu operación y ver cuándo podemos empezar.',
    metaTitle: 'Lista de espera del programa piloto',
    metaDescription: 'Whagons está incorporando un número limitado de clientes piloto, cada uno configurado junto con su equipo. Únete a la lista de espera.',
  },
} as const;
