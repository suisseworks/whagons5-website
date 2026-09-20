'use client';

import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../lib/locales';
import styles from './OperationsHeroDemo.module.css';

type Channel = 'voice' | 'qr' | 'nfc';
function ChannelIcon({ channel }: { channel: Channel }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {channel === 'voice' ? <><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></> : channel === 'qr' ? <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><path d="M15 15h3v3h3v3h-6v-3m6-6v3M3 12h4m5-9v5m0 4h4M12 19v2" /></> : <><path d="M6 7a8 8 0 0 1 0 10M10 4a12 12 0 0 1 0 16M15 2a15 15 0 0 1 0 20" /><circle cx="4" cy="12" r="1" /></>}
  </svg>;
}

const copy = {
  es: {
    appContext: 'Desde la app de Whagons, reporta por voz, escanea un QR o acerca tu teléfono a una etiqueta NFC.',
    eyebrow: 'DEL HOTEL A LA TAREA', title: 'Así empieza el trabajo.', example: 'Ejemplo interactivo',
    capture: 'Captura', review: 'Revisa', work: 'Organiza', preview: 'Vista previa', sample: 'Ejemplo de captura', ready: 'Siguiente paso', choose: 'Explorar formas de capturar trabajo', reset: 'Volver al ejemplo', note: 'Simulación sin usar micrófono, cámara ni lectores.',
    channels: {
      voice: { name: 'Voz', verb: 'Repórtalo', title: 'Una incidencia, en tus palabras.', description: 'Dicta el reporte y revisa el texto antes de enviarlo.', input: '“Hay una fuga en el baño de la habitación 204.”', context: 'Habitación 204', action: 'Ver reporte de ejemplo', result: 'Reporte listo para revisar', task: 'Revisar fuga en el baño', detail: 'Habitación 204 · Mantenimiento', status: 'Borrador', foot: 'Dictado y comandos según configuración y alcance.' },
      qr: { name: 'QR', verb: 'Identifícalo', title: 'Cada habitación, con su contexto.', description: 'Abre el formulario vinculado a una habitación o activo.', input: 'Habitación 204', context: 'Código vinculado a la ubicación', action: 'Ver formulario de ejemplo', result: 'Ubicación identificada', task: 'Reportar una incidencia', detail: 'Habitación 204 · Formulario de servicio', status: 'Por completar', foot: 'Códigos y formularios vinculados según configuración.' },
      nfc: { name: 'NFC', verb: 'Confirma en sitio', title: 'Un toque en el punto de trabajo.', description: 'Identifica el punto de control para iniciar o confirmar una tarea.', input: 'Punto de control · Piscina', context: 'Etiqueta NFC vinculada al lugar', action: 'Ver validación de ejemplo', result: 'Punto de control identificado', task: 'Revisar el área de piscina', detail: 'Piscina · Inspección de turno', status: 'Lista para iniciar', foot: 'Requiere etiquetas y dispositivos compatibles.' },
    },
  },
  en: {
    appContext: 'From the Whagons app, report by voice, scan a QR code, or tap an NFC tag.',
    eyebrow: 'FROM THE FLOOR TO THE TASK', title: 'This is where work starts.', example: 'Interactive example',
    capture: 'Capture', review: 'Review', work: 'Organize', preview: 'Preview', sample: 'Sample input', ready: 'Next step', choose: 'Explore ways to capture work', reset: 'Back to the example', note: 'Simulation without using a microphone, camera or reader.',
    channels: {
      voice: { name: 'Voice', verb: 'Report it', title: 'An issue, in your own words.', description: 'Dictate the report and review the text before sending it.', input: '“There is a leak in the bathroom in room 204.”', context: 'Room 204', action: 'See sample report', result: 'Report ready for review', task: 'Check the bathroom leak', detail: 'Room 204 · Maintenance', status: 'Draft', foot: 'Dictation and commands depend on configuration and scope.' },
      qr: { name: 'QR', verb: 'Identify it', title: 'Every room, with context.', description: 'Open the form linked to a room or asset.', input: 'Room 204', context: 'Code linked to the location', action: 'See sample form', result: 'Location identified', task: 'Report an issue', detail: 'Room 204 · Service form', status: 'To be completed', foot: 'Codes and linked forms depend on configuration.' },
      nfc: { name: 'NFC', verb: 'Confirm on site', title: 'One tap at the point of work.', description: 'Identify the checkpoint to start or confirm a task.', input: 'Checkpoint · Pool', context: 'NFC tag linked to the location', action: 'See sample check-in', result: 'Checkpoint identified', task: 'Inspect the pool area', detail: 'Pool · Shift inspection', status: 'Ready to start', foot: 'Requires compatible devices and tags.' },
    },
  },
} as const;

export default function OperationsHeroDemo({ lang }: { lang: Language }) {
  const [channel, setChannel] = useState<Channel>('voice');
  const [complete, setComplete] = useState(false);
  const [journey, setJourney] = useState(true);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(false);
  const [reduced, setReduced] = useState(true);
  const root = useRef<HTMLElement>(null);
  const remaining = useRef(4000);
  const generation = useRef(0);
  const [replayId, setReplayId] = useState(0);
  const es = lang === 'es';
  const steps = es ? ['Reporte', 'Responsable', 'Reparación', 'Cierre'] : ['Report', 'Owner', 'Repair', 'Closed'];
  const details = es ? [
    ['Incidencia reportada', '“Hay una fuga en el baño de la habitación 204.”', 'Recepción registra el reporte.'],
    ['Mantenimiento asignado', 'Un responsable y una prioridad visibles.', 'El equipo recibe la tarea y coordina la atención.'],
    ['Reparación registrada', 'Reparación terminada. Sin fuga en la revisión.', 'El equipo adjunta la evidencia del trabajo.'],
    ['Recepción informada', 'Cierre verificado y visible para el siguiente turno.', 'El reporte y su evidencia quedan en el historial.'],
  ] : [
    ['Issue reported', '“There is a leak in the bathroom in room 204.”', 'Reception records the report.'],
    ['Maintenance assigned', 'A clear owner and a visible priority.', 'The team receives the task and coordinates the work.'],
    ['Repair recorded', 'Repair finished. No leak found during the check.', 'The team attaches evidence of the work.'],
    ['Reception informed', 'Verified closure, visible to the next shift.', 'The report and its evidence remain in the history.'],
  ];
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => setReduced(media.matches);
    const visibility = () => setForeground(document.visibilityState === 'visible');
    preference(); visibility();
    media.addEventListener('change', preference);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .5), { threshold: [0, .5] });
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); media.removeEventListener('change', preference); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const running = journey && !paused && visible && foreground && !reduced && step < 3;
  useEffect(() => {
    if (!running) return;
    const started = performance.now();
    const currentGeneration = generation.current;
    let advanced = false;
    const timer = window.setTimeout(() => {
      advanced = true;
      remaining.current = 4000;
      setStep(value => Math.min(value + 1, 3));
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      if (!advanced && currentGeneration === generation.current) remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [running, step, replayId]);
  function replay() {
    generation.current += 1;
    setReplayId(value => value + 1);
    setJourney(true); setStep(0); setPaused(false); remaining.current = 4000;
  }
  const t = copy[lang];
  const current = t.channels[channel];
  return <section ref={root} className={`${styles.demo} tech-frame`} data-channel={channel} data-step={journey ? step : undefined} data-playing={running} aria-label={es ? 'Del reporte al cierre' : 'From report to resolution'}>
    <div className={styles.heading}><span>{t.eyebrow}</span><span className={styles.example}><i aria-hidden="true" />{t.example}</span></div>
    <h2>{es ? 'Del reporte al cierre.' : 'From report to resolution.'}</h2>
    <p className={styles.appContext}>{t.appContext}</p>
    <div className={styles.channels} role="group" aria-label={t.choose}>
      {(['voice', 'qr', 'nfc'] as Channel[]).map(id => <button key={id} type="button" aria-pressed={!journey && channel === id} onClick={() => { setJourney(false); setPaused(true); setChannel(id); setComplete(false); }}><span className={styles.channelIcon}><ChannelIcon channel={id} /></span><strong>{t.channels[id].name}</strong><small>{t.channels[id].verb}</small></button>)}
    </div>
    {journey ? <div className={styles.journey}>
      <ol className={styles.timeline} aria-label={es ? 'Recorrido de la incidencia' : 'Issue journey'}>
        {steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} data-done={index < step}><span>{index < step ? '✓' : `0${index + 1}`}</span>{label}</li>)}
      </ol>
      <div className={styles.journeyCard}>
        <div className={styles.cardIdentity}><span>{es ? 'HABITACIÓN 204' : 'ROOM 204'}</span><span>{es ? 'Ejemplo' : 'Example'} · 001</span></div>
        <h3>{es ? 'Fuga en el baño' : 'Bathroom leak'}</h3>
        <div className={styles.journeyDetail} key={step}>
          <span className={styles.stateBadge}>{step === 3 ? '✓ ' : ''}{details[step][0]}</span>
          <p>{details[step][1]}</p>
          <small>{details[step][2]}</small>
          <div className={styles.evidence} data-ready={step >= 2}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="3" y="3" width="26" height="26" rx="6" stroke="currentColor"/><path d="m9 16 5 5 9-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span><strong>{step >= 2 ? (es ? 'Evidencia de cierre' : 'Completion evidence') : (es ? 'Seguimiento compartido' : 'Shared progress')}</strong><small>{step >= 2 ? (es ? 'Registro ilustrativo · Revisión sin fuga' : 'Illustrative record · No leak on inspection') : (es ? 'Recepción → Mantenimiento' : 'Reception → Maintenance')}</small></span>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        {reduced ? <button type="button" disabled={step === 3} onClick={() => { setStep(value => Math.min(value + 1, 3)); remaining.current = 4000; }}>{es ? 'Siguiente paso' : 'Next step'} →</button> : <button type="button" disabled={step === 3} onClick={() => setPaused(value => !value)}>{paused ? (es ? 'Continuar' : 'Resume') : (es ? 'Pausar' : 'Pause')}{paused ? ' ▷' : ' Ⅱ'}</button>}
        <button type="button" onClick={replay}>{es ? 'Repetir' : 'Replay'} ↺</button>
      </div>
      <p className={styles.journeyNote}>{es ? 'Ejemplo ilustrativo. Cada paso requiere la acción del equipo.' : 'Illustrative example. Each step requires action by the team.'}</p>
    </div> : <div className={styles.scenario}>
      <h3>{current.title}</h3><p>{current.description}</p>
      <div className={styles.progress} aria-hidden="true"><span data-active={!complete}><b>01</b>{t.capture}</span><i /><span data-active={complete}><b>02</b>{t.review}</span><i /><span><b>03</b>{t.work}</span></div>
      <div className={styles.stage} aria-live="polite" aria-atomic="true">
        <div className={styles.stageHeading}><span>{complete ? t.ready : t.sample}</span><span>{t.preview}</span></div>
        <div className={styles.stageContent} key={`${channel}-${complete}`}>

        {complete ? <div className={styles.result}><span className={styles.success}>✓ {current.result}</span><div className={styles.task}><span className={styles.taskIcon}><ChannelIcon channel={channel} /></span><div><strong>{current.task}</strong><small>{current.detail}</small></div></div><span className={styles.taskStatus}>{current.status}</span></div> : <div className={styles.input}>
          <div className={styles.signal} aria-hidden="true"><span className={styles.signalCenter}><ChannelIcon channel={channel} /></span>{channel === 'voice' ? <div className={styles.wave} aria-hidden="true">{[10,22,36,19,42,28,37,48,31,21,40,29,16,25,12].map((height, i) => <i key={i} style={{height}} />)}</div> : <span className={styles.scanFrame} />} </div>
          <strong>{current.input}</strong><small><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg>{current.context}</small>
        </div>}
        </div>
      </div>
      <button className={styles.tryButton} type="button" onClick={() => setComplete(value => !value)}>{complete ? t.reset : current.action}<span aria-hidden="true">{complete ? '↺' : '→'}</span></button>
      <p className={styles.scope}>{current.foot}</p>
    </div>
    }
    {!journey && <button type="button" className={styles.backToJourney} onClick={replay}>{es ? 'Ver recorrido completo' : 'See the full journey'} →</button>}
    <p className={styles.note}>{t.note}</p>
  </section>;
}
