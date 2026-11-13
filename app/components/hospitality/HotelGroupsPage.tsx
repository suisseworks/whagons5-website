import Image from 'next/image';
import HospitalityAnalytics from './HospitalityAnalytics';
import OperationsHeroDemo from '../home/OperationsHeroDemo';
import TaskGridMock from '../product/TaskGridMock';
import PhoneCrop from '../product/PhoneCrop';
import { freeEvaluation } from '../../lib/free-evaluation';
import { routeFor } from '../../lib/locales';
import s from './HotelGroupsPage.module.css';

/*
 * The hotel page for hotels and hotel groups (/es/operaciones-hoteleras).
 * Spanish only for now: /en/hotel-operations keeps HotelOperationsPage until
 * this version is approved and translated.
 *
 * The page shows no prices or plans and does not link to the pricing page.
 * Every mention of the PMS says that Whagons integrates with it and does not
 * replace it. The only customer figures are the published refrigeration case.
 */

type Headline = [plain: string, accent: string];

const copy = {
  es: {
    eyebrow: 'Whagons para hoteles y grupos hoteleros',
    title: ['Una gran estadía empieza', 'detrás de escena.'] as Headline,
    lead: 'Conecta recepción, ama de llaves, mantenimiento y calidad para que cada solicitud tenga responsable y cada turno sepa qué sigue. En un hotel o en todos los de tu grupo.',
    demo: 'Conversemos sobre tu hotel',
    brand: 'Whagons · Hospitalidad',
    photoAlt: 'Hotel con piscina y palmeras al atardecer',
    photoNote: 'Una habitación. Varios equipos. Un mismo contexto.',
    ribbon: ['Cada solicitud, con responsable', 'Cada lugar, con historial', 'Cada turno, con contexto'],
    sectionsLabel: 'Secciones de la página',
    sections: [
      ['#departamentos', 'Departamentos'],
      ['#grupos', 'Grupos hoteleros'],
      ['#integraciones', 'Integraciones'],
      ['#empezar', 'Cómo empezar'],
    ],
    problem: {
      eyebrow: 'Lo que pasa hoy',
      title: ['El huésped no ve el desorden.', 'Pero lo siente.'] as Headline,
      cards: [
        ['La solicitud se pierde', 'Sale de recepción por radio o por chat y nadie sabe quién la tomó ni cuándo queda.'],
        ['El turno empieza a ciegas', 'Los pendientes se entregan de palabra. Lo que no se dijo, no se hace.'],
        ['La avería vuelve', 'Sin historial de la habitación ni del equipo, se repara lo mismo una y otra vez.'],
        ['Cada hotel mide distinto', 'La dirección recibe reportes que no se pueden comparar, y los recibe tarde.'],
      ],
    },
    flow: {
      eyebrow: 'Ejemplo de operación',
      title: ['El huésped ve un hotel.', 'Tu equipo también debería.'] as Headline,
      lead: 'Una fuga en la habitación 204, de principio a fin.',
      steps: [
        ['09:10 · Recepción', 'Registra', 'El huésped reporta la fuga. Recepción la registra y ve el avance sin perseguir respuestas.'],
        ['Mantenimiento', 'Repara', 'El técnico recibe ubicación y detalle en su teléfono. Cierra con evidencia.'],
        ['Ama de llaves', 'Revisa', 'La supervisora inspecciona y libera la habitación para la siguiente llegada.'],
        ['Gerencia', 'Ve el conjunto', 'El caso queda en el historial de la 204 y suma a los indicadores del hotel.'],
      ],
    },
    departments: {
      eyebrow: 'Por departamento',
      title: ['Cada equipo trabaja a su manera.', 'Todos en el mismo lugar.'] as Headline,
      cards: [
        ['Ama de llaves', ['Limpieza e inspección de habitaciones y áreas públicas', 'Checklists con evidencia de cierre', 'Solicitudes de huésped con plazo']],
        ['Mantenimiento', ['Averías con ubicación, prioridad y estado', 'Activos con historial y planes preventivos', 'Rutinas que crean sus tareas a tiempo']],
        ['Recepción', ['Registro de lo que pide el huésped', 'Avance visible sin llamar a nadie', 'Aviso cuando algo está por vencer']],
        ['Calidad', ['Estándares y documentos al alcance de cada puesto', 'Auditorías programadas', 'Hallazgos que se convierten en tareas']],
        ['Alimentos y bebidas', ['Checklists de apertura y cierre', 'Rutinas de limpieza por estación', 'Reportes de equipo de cocina']],
        ['Gerencia', ['Tarjetas KPI por área', 'Vencidas, en curso y completadas hoy', 'Metas por equipo']],
      ] as [string, string[]][],
    },
    product: {
      eyebrow: 'El trabajo, a la vista',
      title: ['Menos preguntas sobre el estado.', 'Más claridad para actuar.'] as Headline,
      lead: 'Organiza tareas por equipo, ubicación y prioridad. El siguiente turno puede retomar los pendientes y consultar lo que ya se hizo.',
      shotAlt: 'Tabla de tareas de mantenimiento en Whagons, con ubicaciones, prioridades y responsables',
    },
    capture: {
      eyebrow: 'Desde el lugar donde pasa',
      title: ['Reportar debería ser', 'la parte fácil.'] as Headline,
      cards: [
        ['Voz', 'Repórtalo', 'Dicta la incidencia en tus palabras y revisa el texto antes de enviarlo.'],
        ['QR', 'Identifícalo', 'Escanea el código de la habitación o del equipo. El lugar ya queda registrado.'],
        ['NFC', 'Confirma en sitio', 'Acerca el teléfono a la etiqueta para confirmar que la ronda se hizo ahí.'],
      ],
    },
    groups: {
      eyebrow: 'Para grupos hoteleros',
      title: ['Un estándar.', 'Todas tus propiedades.'] as Headline,
      lead: 'Define cómo se trabaja una vez y llévalo a cada hotel. Compara propiedades con los mismos indicadores.',
      cards: [
        ['Una plantilla por marca', 'Espacios, estados, formularios y rutinas configurados una vez y replicados en cada propiedad.'],
        ['La misma medida para todos', 'Los mismos indicadores en cada hotel, con reportes consolidados del grupo.'],
        ['Cada quien ve lo suyo', 'Acceso según el rol: el hotel ve su operación y corporativo ve el conjunto.'],
      ],
    },
    integrations: {
      eyebrow: 'Integraciones',
      title: ['Tu PMS sigue mandando.', 'Whagons se conecta.'] as Headline,
      lead: 'Whagons no reemplaza tu PMS ni tu ERP. Se integra con Cloudbeds, OPERA Cloud y Mews, y con cualquier otro PMS por API.',
      pmsLabel: 'PMS con los que se integra',
      pms: ['Cloudbeds', 'OPERA Cloud', 'Mews'],
      anyPms: 'Cualquier otro PMS, por API',
      cards: [
        ['Asistentes de IA', 'Un agente sugiere quién toma cada tarea nueva. El asistente responde preguntas sobre tu operación.'],
        ['Herramientas a la medida', 'Si tu hotel tiene un proceso propio, lo configuramos: formularios, flujos, tableros y desarrollos específicos.'],
        ['Powerups', 'Suma personal, abastecimiento, movilidad o capacitación cuando los necesites.'],
      ],
    },
    // A third figure, from a hotel, joins these two when that case exists.
    results: {
      eyebrow: 'Resultados',
      title: ['Lo que cambia cuando', 'el trabajo queda a la vista.'] as Headline,
      stats: [
        ['80 % menos', 'Visitas repetidas en un equipo de mantenimiento de refrigeración, en 60 días.'],
        ['De 2 días a 4 horas', 'Tiempo de resolución en ese mismo equipo.'],
      ],
    },
    start: {
      eyebrow: 'Cómo empezar',
      title: ['Empieza por un día real', 'de tu hotel.'] as Headline,
      steps: [
        ['01 · Evaluación', 'Evaluamos tu hotel', 'Revisamos una solicitud frecuente, los equipos que intervienen y dónde se pierde tiempo.'],
        ['02 · 90 días', 'Piloto con metas', 'De uno a tres hoteles, con indicadores que tú defines sobre tu propia línea base.'],
        ['03 · A tu ritmo', 'Más áreas y propiedades', 'Lo que funcionó se replica en el resto del grupo con la configuración ya probada.'],
      ],
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: ['Lo que nos preguntan', 'los hoteleros.'] as Headline,
      items: [
        ['¿Whagons reemplaza mi PMS?', 'No. Tu PMS sigue siendo el registro principal. Whagons coordina el trabajo operativo y se integra con Cloudbeds, OPERA Cloud, Mews o el PMS que uses, por API.'],
        ['¿Funciona donde no hay señal?', 'Sí. Tu equipo consulta la información guardada sin conexión, y los cambios compatibles se sincronizan cuando vuelve la señal.'],
        ['¿Mi personal necesita un teléfono especial?', 'No. Whagons funciona en el teléfono y en la web, y el acceso depende del rol de cada persona.'],
        ['¿Cómo es la implementación?', 'Por etapas. Configuramos tu operación, capacitamos al equipo y acompañamos la puesta en marcha, empezando por un flujo concreto.'],
        ['¿Sirve para un solo hotel?', 'Sí. Puedes empezar con una propiedad y ampliar a más áreas o más hoteles cuando quieras.'],
      ],
    },
    final: {
      title: ['Que el buen servicio se note.', 'Y el trabajo detrás también.'] as Headline,
    },
  },
} as const;

type Language = keyof typeof copy;

function Title({ text }: { text: Readonly<Headline> }) {
  return <h2>{text[0]} <em>{text[1]}</em></h2>;
}

export default function HotelGroupsPage({ lang = 'es' }: { lang?: Language }) {
  const t = copy[lang];
  const market = lang === 'es' ? 'latam' : 'us';
  const actions = (place: 'hero' | 'final') => (
    <div className={s.actions}>
      <a className={s.button} href={routeFor(lang, 'demo')} data-track={place === 'hero' ? 'operations_demo_click' : 'operations_final_demo_click'}>
        {t.demo} <span aria-hidden="true">↗</span>
      </a>
      <a className={s.textLink} href={routeFor(lang, 'evaluation')} data-track={`hotel_evaluation_${place}_click`}>
        {freeEvaluation[lang].cta} <span aria-hidden="true">→</span>
      </a>
    </div>
  );

  return <>
    <HospitalityAnalytics page={`${market}_hotel_operations`} market={market} />
    <main className={s.page}>
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <p className={s.eyebrow}>{t.eyebrow}</p>
          <h1>{t.title[0]} <em>{t.title[1]}</em></h1>
          <p className={s.lead}>{t.lead}</p>
          {actions('hero')}
        </div>
        <figure className={s.heroPhoto}>
          <Image src="/images/industries/hoteleria.jpg" alt={t.photoAlt} fill priority sizes="(max-width: 820px) 100vw, 50vw" />
          <figcaption><span>{t.brand}</span><strong>{t.photoNote}</strong></figcaption>
        </figure>
      </section>

      <div className={s.ribbon}>{t.ribbon.map((item, i) => <span key={item}><b>0{i + 1}</b>{item}</span>)}</div>

      {/* Not a <nav> element: the site styles every <nav> as the fixed top bar. */}
      <div className={s.sections} role="navigation" aria-label={t.sectionsLabel}>
        {t.sections.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </div>

      <section className={s.section}>
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.problem.eyebrow}</p>
          <Title text={t.problem.title} />
          <div className={`${s.grid} ${s.four}`}>
            {t.problem.cards.map(([title, text], i) => (
              <article className={s.card} key={title}><span className={s.tag}>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.flow.eyebrow}</p>
          <Title text={t.flow.title} />
          <p className={s.lead}>{t.flow.lead}</p>
          <ol className={s.flow}>
            {t.flow.steps.map(([label, title, text]) => (
              <li key={title}><span className={s.tag}>{label}</span><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className={s.section} id="departamentos">
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.departments.eyebrow}</p>
          <Title text={t.departments.title} />
          <div className={`${s.grid} ${s.three}`}>
            {t.departments.cards.map(([name, points]) => (
              <article className={s.card} key={name}><h3>{name}</h3><ul>{points.map((point) => <li key={point}>{point}</li>)}</ul></article>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap} data-reveal-kids="">
          <div className={s.split}>
            <div><p className={s.eyebrow}>{t.product.eyebrow}</p><Title text={t.product.title} /></div>
            <p className={s.lead}>{t.product.lead}</p>
          </div>
          <figure className={s.screenshot}>
            <div className={s.screenshotBar}><span aria-hidden="true">● ● ●</span> Whagons · Hotel Premium</div>
            <PhoneCrop><TaskGridMock lang={lang} label={t.product.shotAlt} /></PhoneCrop>
          </figure>
        </div>
      </section>

      <section className={`${s.section} ${s.tinted}`}>
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.capture.eyebrow}</p>
          <Title text={t.capture.title} />
          <div className={`${s.grid} ${s.three}`}>
            {t.capture.cards.map(([label, title, text]) => (
              <article className={s.card} key={label}><span className={s.tag}>{label}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
          <div className={s.demo}><OperationsHeroDemo lang={lang} /></div>
        </div>
      </section>

      <section className={`${s.section} ${s.dark}`} id="grupos">
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.groups.eyebrow}</p>
          <Title text={t.groups.title} />
          <p className={s.lead}>{t.groups.lead}</p>
          <div className={`${s.grid} ${s.three}`}>
            {t.groups.cards.map(([title, text]) => (
              <article className={s.card} key={title}><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section} id="integraciones">
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.integrations.eyebrow}</p>
          <Title text={t.integrations.title} />
          <p className={s.lead}>{t.integrations.lead}</p>
          <ul className={s.pms} aria-label={t.integrations.pmsLabel}>
            {t.integrations.pms.map((name) => <li key={name}>{name}</li>)}
            <li className={s.anyPms}>{t.integrations.anyPms}</li>
          </ul>
          <div className={`${s.grid} ${s.three}`}>
            {t.integrations.cards.map(([title, text]) => (
              <article className={s.card} key={title}><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.results.eyebrow}</p>
          <Title text={t.results.title} />
          <dl className={s.stats}>
            {t.results.stats.map(([figure, text]) => <div key={figure}><dt>{figure}</dt><dd>{text}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className={s.section} id="empezar">
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.start.eyebrow}</p>
          <Title text={t.start.title} />
          <ol className={`${s.grid} ${s.three} ${s.steps}`}>
            {t.start.steps.map(([label, title, text]) => (
              <li className={s.card} key={title}><span className={s.tag}>{label}</span><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className={s.section}>
        <div className={`${s.wrap} ${s.faq}`} data-reveal-kids="">
          <div><p className={s.eyebrow}>{t.faq.eyebrow}</p><Title text={t.faq.title} /></div>
          <div className={s.questions}>
            {t.faq.items.map(([question, answer], i) => (
              <details key={question} open={i === 0}><summary>{question}</summary><p>{answer}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.section} ${s.final}`} id="contacto">
        <div className={s.wrap} data-reveal-kids="">
          <p className={s.eyebrow}>{t.brand}</p>
          <Title text={t.final.title} />
          {actions('final')}
        </div>
      </section>
    </main>
  </>;
}
