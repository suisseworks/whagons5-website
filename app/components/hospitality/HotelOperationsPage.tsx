'use client';

import { useState } from 'react';
import Image from 'next/image';
import HospitalityAnalytics from './HospitalityAnalytics';
import OperationsHeroDemo from '../home/OperationsHeroDemo';
import { shotsFor } from '../../lib/shots';
import s from './HotelOperationsPage.module.css';

type Language = 'en' | 'es';
const copy = {
  es: {
    eyebrow: 'WHAGONS PARA HOSPITALIDAD', brand: 'Whagons · Hospitalidad', title: 'Una gran estadía empieza', accent: 'detrás de escena.',
    lead: 'Conecta recepción, ama de llaves y mantenimiento para que cada solicitud tenga responsable y cada turno sepa qué sigue.',
    demo: 'Conversemos sobre tu hotel', explore: 'Ver cómo se conecta', photo: 'Hotel con piscina y palmeras al atardecer',
    ribbon: ['Cada solicitud, con responsable', 'Cada lugar, con historial', 'Cada turno, con contexto'],
    example: 'EJEMPLO DE OPERACIÓN', room: 'Habitación 204', roomNote: 'Una habitación. Varios equipos. Un mismo contexto.',
    teamsTitle: 'El huésped ve un hotel. Tu equipo también debería.', teamsLead: 'Explora cómo cada equipo participa en la atención de una misma habitación.',
    teams: [
      {id:'front-desk', name:'Recepción', title:'La solicitud no termina al pasar el mensaje.', text:'Registra lo que necesita el huésped y consulta el avance para darle seguimiento sin perseguir respuestas.', time:'09:10', action:'El huésped reporta una fuga en el baño.', status:'Solicitud registrada', next:'Mantenimiento recibe la ubicación y el detalle.'},
      {id:'engineering', name:'Mantenimiento', title:'Llega al lugar con el contexto completo.', text:'Consulta qué se reparó antes, registra lo que encontraste y deja evidencia del trabajo para la próxima visita.', time:'09:18', action:'Revisión de la fuga y del historial de reparaciones.', status:'En atención', next:'El técnico registra la reparación y avisa al equipo.'},
      {id:'housekeeping', name:'Ama de llaves', title:'Sabe cuándo puede continuar.', text:'Coordina la limpieza después de una reparación y deja constancia de la revisión de la habitación.', time:'09:40', action:'Revisión y limpieza después de la reparación.', status:'Lista para revisión', next:'Recepción puede consultar el resultado.'},
      {id:'operations-leaders', name:'Gerencia', title:'Ve dónde hace falta intervenir.', text:'Consulta pendientes, reportes recurrentes y responsables para decidir qué necesita atención.', time:'10:00', action:'Verificación del cierre y seguimiento al huésped.', status:'Caso verificado', next:'El historial queda disponible para futuras incidencias.'},
    ],
    next:'SIGUIENTE PASO', history:'Historial del lugar', historyDetail:'Reporte → reparación → revisión → seguimiento',
    captureLabel:'DESDE EL LUGAR DONDE PASA', captureTitle:'Reportar debería ser la parte fácil.', captureText:'Una nota de voz, un código en la habitación o una etiqueta en el equipo. Explora distintas formas de iniciar el trabajo con su ubicación y contexto.',
    productLabel:'EL TRABAJO, A LA VISTA', productTitle:'Menos preguntas sobre el estado. Más claridad para actuar.', productText:'Organiza tareas por equipo, ubicación y prioridad. El siguiente turno puede retomar los pendientes y consultar lo que ya se hizo.', shotAlt:'Tabla de tareas de mantenimiento en Whagons, con ubicaciones, prioridades y responsables', platform:'Explorar la plataforma',
    rollout:'DE UNA PROPIEDAD A VARIAS', rolloutTitle:'Empieza por un día real de tu hotel.', rolloutText:'Una solicitud frecuente, los equipos involucrados y un resultado que puedas revisar. Desde ahí, amplía el flujo a más áreas o propiedades.',
    endTitle:'Que el buen servicio se note. Y el trabajo detrás también.', endNote:'Te mostramos cómo organizar un flujo de tu operación.',
  },
  en: {
    eyebrow:'WHAGONS FOR HOSPITALITY', brand:'Whagons · Hospitality', title:'A great stay starts', accent:'behind the scenes.',
    lead:'Connect front desk, housekeeping and maintenance so every request has an owner and every shift knows what comes next.',
    demo:'Let’s talk about your hotel', explore:'See how it connects', photo:'Hotel pool and palm trees at sunset',
    ribbon:['Every request, with an owner', 'Every place, with a history', 'Every shift, with context'],
    example:'ILLUSTRATIVE WORKFLOW', room:'Room 204', roomNote:'One room. Several teams. Shared context.',
    teamsTitle:'Guests see one hotel. Your team should, too.', teamsLead:'Explore how each team helps resolve an issue in the same room.',
    teams:[
      {id:'front-desk',name:'Front desk',title:'A request goes beyond passing a message.',text:'Record what the guest needs and check progress to follow up without chasing replies.',time:'09:10',action:'The guest reports a bathroom leak.',status:'Request recorded',next:'Maintenance receives the location and details.'},
      {id:'engineering',name:'Maintenance',title:'Arrive with the full context.',text:'Check previous repairs, record what you find and leave evidence of your work for the next visit.',time:'09:18',action:'Inspecting the leak and reviewing previous repairs.',status:'In progress',next:'The technician records the repair and notifies the team.'},
      {id:'housekeeping',name:'Housekeeping',title:'Know when it is your turn.',text:'Coordinate cleaning after a repair and record the room inspection.',time:'09:40',action:'Room inspection and cleaning after the repair.',status:'Ready for review',next:'Front desk can check the outcome.'},
      {id:'operations-leaders',name:'Management',title:'See where you need to step in.',text:'Review open work, recurring reports and ownership to decide what needs attention.',time:'10:00',action:'Verifying completion and guest follow-up.',status:'Case verified',next:'The history stays available for future issues.'},
    ],
    next:'NEXT STEP',history:'Location history',historyDetail:'Report → repair → inspection → follow-up',
    captureLabel:'WHERE THE WORK HAPPENS',captureTitle:'Reporting should be the easy part.',captureText:'A voice note, a room code or a tag on a piece of equipment. Explore ways to start work with its location and context.',
    productLabel:'WORK IN VIEW',productTitle:'Fewer questions about status. More clarity to act.',productText:'Organize tasks by team, location and priority. The next shift can pick up open work and check what has already been done.',shotAlt:'Whagons maintenance task grid with locations, priorities and assignees',platform:'Explore the platform',
    rollout:'FROM ONE PROPERTY TO SEVERAL',rolloutTitle:'Start with a real day at your hotel.',rolloutText:'A frequent request, the teams involved and an outcome you can review. Then extend the workflow to more areas or properties.',
    endTitle:'Make great service visible. And the work behind it, too.',endNote:'See how a workflow from your operation could work.',
  },
} as const;

export default function HotelOperationsPage({lang='en'}:{lang?:Language}) {
  const t=copy[lang];
  const [selected,setSelected]=useState(0);
  const team=t.teams[selected];
  const shot=shotsFor(lang).grid;
  const platform=lang==='es'?'/es/plataforma':'/en/platform';
  const market=lang==='es'?'latam':'us';
  return <>
    <HospitalityAnalytics page={`${market}_hotel_operations`} market={market}/>
    <main className={s.page}>
      <section className={s.hero}>
        <div className={s.heroCopy}><p className={s.eyebrow}>{t.eyebrow}</p><h1>{t.title} <em>{t.accent}</em></h1><p className={s.lead}>{t.lead}</p><div className={s.actions}><a className={s.button} href={`/${lang}/demo`} data-track="operations_demo_click">{t.demo} <span aria-hidden="true">↗</span></a><a className={s.textLink} href="#hotel-workflow">{t.explore} ↓</a></div></div>
        <figure className={s.heroPhoto}><Image src="/images/industries/hoteleria.jpg" alt={t.photo} fill priority sizes="(max-width: 800px) 100vw, 50vw"/><figcaption><span>{t.brand}</span><strong>{t.roomNote}</strong></figcaption></figure>
      </section>
      <div className={s.ribbon}>{t.ribbon.map((item,i)=><span key={item}><b>0{i+1}</b>{item}</span>)}</div>
      <section className={s.workflow} id="hotel-workflow">
        <div className={s.sectionIntro} id="guest-requests"><p className={s.eyebrow}>{t.example}</p><h2>{t.teamsTitle}</h2><p>{t.teamsLead}</p></div>
        <div className={s.teamButtons} aria-label={lang==='es'?'Explorar por equipo':'Explore by team'}>{t.teams.map((item,i)=><button key={item.id} id={item.id} type="button" aria-pressed={selected===i} aria-controls="hotel-team-example" onClick={()=>setSelected(i)}><span>0{i+1}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div>
        <div className={s.teamScene} id="hotel-team-example" aria-live="polite" aria-atomic="true"><div className={s.teamCopy}><span className={s.eyebrow}>{team.name}</span><h3>{team.title}</h3><p>{team.text}</p><a className={s.textLink} href={platform}>{t.platform} →</a></div><div className={s.room} id="room-readiness"><div className={s.roomHeader}><span>{t.room}</span><span className={s.status}>{team.status}</span></div><div className={s.event}><span className={s.time}>{team.time}</span><strong>{team.action}</strong></div><div className={s.next}><span>{t.next}</span><p>{team.next}</p></div><div className={s.history} id="inspection-correction"><span aria-hidden="true">↺</span><div><strong>{t.history}</strong><p>{t.historyDetail}</p></div></div></div></div>
      </section>
      <section className={s.capture}><div><p className={s.eyebrow}>{t.captureLabel}</p><h2>{t.captureTitle}</h2><p>{t.captureText}</p><div className={s.captureWords} aria-hidden="true"><span>{lang==='es'?'Voz':'Voice'}</span><span>QR</span><span>NFC</span></div></div><OperationsHeroDemo lang={lang}/></section>
      <section className={s.product} id="shift-handoff"><div className={s.productIntro}><div><p className={s.eyebrow}>{t.productLabel}</p><h2>{t.productTitle}</h2></div><div><p>{t.productText}</p><a className={s.textLink} href={platform}>{t.platform} →</a></div></div><figure className={`${s.screenshot} tech-frame`}><div><span aria-hidden="true">● ● ●</span> Whagons · Hotel Premium</div><Image src={shot.src} width={shot.width} height={shot.height} alt={t.shotAlt} sizes="(max-width: 1200px) 94vw, 1140px"/></figure></section>
      <section className={s.rollout} id="regional-teams"><p className={s.eyebrow}>{t.rollout}</p><h2>{t.rolloutTitle}</h2><p>{t.rolloutText}</p></section>
      <section className={s.final}><p className={s.eyebrow}>{t.brand}</p><h2>{t.endTitle}</h2><a className={s.button} href={`/${lang}/demo`} data-track="operations_final_demo_click">{t.demo} ↗</a><p>{t.endNote}</p></section>
    </main>
  </>;
}
