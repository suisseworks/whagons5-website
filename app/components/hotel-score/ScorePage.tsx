'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { questions, SCORE_VERSION, validAnswers } from '../../lib/hotel-score.mjs';
import { Language, legalRouteFor, routeFor } from '../../lib/locales';
import { trackHospitalityEvent } from '../hospitality/HospitalityAnalytics';
import styles from './Score.module.css';

type Answer = number | 'unknown' | 'na' | null;
const STORAGE_KEY = 'whagons-hotel-score-v1';
const copy = {
  es: {eyebrow:'DIAGNÓSTICO GRATUITO / 10 PREGUNTAS', title:'Tu hotel. Una operación más clara.',intro:'Descubre qué conviene ordenar primero. Completa las diez preguntas y recibe tu score y un plan de mejora por correo en las siguientes 24 horas.', question:'Pregunta', of:'de', next:'Continuar', back:'Anterior', unknown:'No lo sé', na:'No aplica', hint:'Elige la opción que mejor describe lo que ocurre habitualmente.', toolsTitle:'Con las herramientas que ya usan', toolsNote:'Puede ser WhatsApp, Excel, un PMS, otro software, papel o una combinación. Responde según el seguimiento que logran con ellos; la herramienta no determina el puntaje.', footer:'Sin respuestas perfectas. Solo una imagen honesta de tu operación.', finish:'Recibir mi diagnóstico', checkoutTitle:'¿A dónde enviamos tu diagnóstico?',checkoutText:'En las siguientes 24 horas recibirás tu score, hasta tres oportunidades prioritarias y una ficha práctica para empezar con tu equipo.', email:'Tu correo', send:'Enviarme mi resultado', sending:'Registrando tu solicitud…', privacy:'Guardaremos tu correo y tus respuestas en Flodesk para preparar tu diagnóstico y darle seguimiento.', privacyLink:'Privacidad', marketing:'También quiero recibir consejos y novedades de Whagons. (Opcional)', error:'No pudimos confirmar el registro. Tus respuestas se conservan; inténtalo de nuevo.', rateError:'Has hecho varios intentos. Espera diez minutos antes de volver a enviar.', unavailable:'El registro no está disponible en este momento. Conservamos tus respuestas en esta pestaña para que puedas intentarlo de nuevo.', sentTitle:'Tu solicitud quedó registrada.',sentText:'Guardamos tu correo',sentNote:'Nuestro equipo preparará tu diagnóstico personalizado y te lo enviará en las siguientes 24 horas. Recibirás un correo de confirmación; revisa también la carpeta de spam.', marketingError:'El diagnóstico fue aceptado para envío, pero no pudimos registrar la suscripción opcional a novedades.', edit:'Revisar mis respuestas', restart:'Empezar de nuevo', home:'Volver al inicio', benefitTitle:'Lo que llega a tu correo', benefits:['Tu score de control operativo','Tus prioridades, con acciones concretas','Las funcionalidades de Whagons para aplicarlas'], note:'Autoevaluación orientativa basada en tus respuestas. No es una auditoría ni una comparación con otros hoteles.', progress:'Progreso del diagnóstico', completed:'10 preguntas completadas', saving:'Tus respuestas se guardan en esta pestaña durante 24 horas.', choose:'Selecciona una respuesta para continuar.'},
  en: {eyebrow:'FREE ASSESSMENT / 10 QUESTIONS',title:'Your hotel. A clearer operation.',intro:'Discover what to organize first. Complete the ten questions to receive your score and improvement plan by email within the next 24 hours.',question:'Question',of:'of',next:'Continue',back:'Back',unknown:'Not sure',na:'Not applicable',hint:'Choose the option that best describes what usually happens.', toolsTitle:'With the tools you already use', toolsNote:'You may use WhatsApp, Excel, a PMS, other software, paper or a combination. Answer based on the follow-up you achieve with them; the tool does not determine your score.',footer:'No perfect answers. Just an honest picture of your operation.',finish:'Get my assessment',checkoutTitle:'Where should we send your assessment?',checkoutText:'Within the next 24 hours, receive your score, up to three priority opportunities and a practical worksheet to get started with your team.',email:'Your email',send:'Email my results',sending:'Saving your request…',privacy:'We save your email and answers in Flodesk to prepare and follow up on your assessment.',privacyLink:'Privacy',marketing:'Also send me Whagons tips and news. (Optional)',error:'We could not confirm registration. Your answers are saved; please try again.',rateError:'You have made several attempts. Please wait ten minutes before trying again.',unavailable:'Registration is currently unavailable. Your answers are saved in this tab so you can try again.',sentTitle:'Your request has been saved.',sentText:'We saved your email',sentNote:'Our team will prepare your personalized assessment and email it within the next 24 hours. You will receive a confirmation email; please also check your spam folder.',marketingError:'Your assessment was accepted for sending, but we could not save the optional newsletter subscription.',edit:'Review my answers',restart:'Start again',home:'Back to home',benefitTitle:'Inside your email',benefits:['Your operational control score','Your priorities, with concrete actions','Whagons features to put them into practice'],note:'An indicative self-assessment based on your answers. Not an audit or a comparison with other hotels.',progress:'Assessment progress',completed:'10 questions completed',saving:'Your answers stay in this tab for 24 hours.',choose:'Choose an answer to continue.'},
};

export default function ScorePage({lang}:{lang:Language}) {
  const t=copy[lang]; const qs=questions[lang];
  const [answers,setAnswers]=useState<Answer[]>(Array(10).fill(null));
  const [step,setStep]=useState(0); const [ready,setReady]=useState(false);
  const [pending,setPending]=useState(false); const [error,setError]=useState('');
  const [marketingOptIn,setMarketingOptIn]=useState(false);
  const [emailDraft,setEmailDraft]=useState('');
  const [captureAvailable,setCaptureAvailable]=useState<boolean|null>(null);
  const [sent,setSent]=useState(''); const [analysisFailed,setAnalysisFailed]=useState(false);
  const navigation=useRef<HTMLDivElement>(null); const heading=useRef<HTMLHeadingElement>(null); const requestId=useRef(''); const began=useRef(false);
  const track=(event:string, properties:Record<string,unknown>={})=>trackHospitalityEvent(event,{language:lang,version:SCORE_VERSION,...properties},lang==='es'?'latam':'us');
  useEffect(()=>{
    try { const raw=sessionStorage.getItem(STORAGE_KEY); if(raw){const saved=JSON.parse(raw);if(saved.version===SCORE_VERSION && Date.now()-saved.time<86400000 && Array.isArray(saved.answers) && saved.answers.length===10 && saved.answers.every((v:Answer)=>v===null||v==='unknown'||v==='na'||(Number.isInteger(v)&&Number(v)>=0&&Number(v)<=3))){setAnswers(saved.answers);setStep(Number.isInteger(saved.step)?(saved.step===10&&saved.answers.includes(null)?saved.answers.indexOf(null):Math.min(Math.max(saved.step,0),10)):0);}}} catch { /* Storage may be disabled. */ }
    setReady(true); trackHospitalityEvent('hotel_score_view',{language:lang,version:SCORE_VERSION},lang==='es'?'latam':'us');
    const controller=new AbortController();
    fetch(`/api/hotel-score?language=${lang}`,{cache:'no-store',signal:controller.signal}).then(r=>r.json()).then(d=>setCaptureAvailable(d.captureAvailable===true)).catch(()=>{});
    return ()=>controller.abort();
  },[lang]);
  useEffect(()=>{if(ready && !sent){try {sessionStorage.setItem(STORAGE_KEY,JSON.stringify({version:SCORE_VERSION,answers,step,time:Date.now()}));}catch{}}},[ready,answers,step,sent]);
  useEffect(()=>{if(ready){heading.current?.focus({preventScroll:true});}},[step,ready,sent]);
  const move=(next:number)=>{
    const target=next===10&&!validAnswers(answers)?answers.indexOf(null):next;
    setStep(Math.max(0,Math.min(target,10)));setError('');
    requestAnimationFrame(()=>{(navigation.current??heading.current)?.scrollIntoView({block:'start',behavior:'instant'});});
  };
  function answer(value:Answer){if(!began.current){track('hotel_score_start');began.current=true;}setAnswers(old=>old.map((v,i)=>i===step?value:v));requestId.current='';}
  function advance(){
    if(answers[step]!==null)track('hotel_score_question_complete',{question:step+1});
    if(step===9&&validAnswers(answers))track('hotel_score_complete');
    move(step+1);
  }
  function next(event:FormEvent){event.preventDefault();advance();}
  function reset(){setAnswers(Array(10).fill(null));setSent('');setEmailDraft('');setAnalysisFailed(false);setMarketingOptIn(false);requestId.current='';began.current=false;move(0);}
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); if(pending || !validAnswers(answers))return;
    const fields=new FormData(event.currentTarget);const email=String(fields.get('email')||'').trim();
    setPending(true);setError('');setEmailDraft(email);requestId.current ||= crypto.randomUUID();track('hotel_score_email_request');
    try {
      const response=await fetch('/api/hotel-score',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,language:lang,answers,website:fields.get('website'),marketingOptIn,requestId:requestId.current}),signal:AbortSignal.timeout(35000)});
      const result=await response.json();
      if(!response.ok||!result.success){setError(response.status===429?t.rateError:response.status===503?t.unavailable:t.error);track('hotel_score_email_error',{status:response.status});return;}
      setSent(email);setAnalysisFailed(result.analysisSaved===false);track('hotel_score_lead_saved');
      if(result.analysisSaved){try{sessionStorage.removeItem(STORAGE_KEY);}catch{}}
    } catch {setError(t.error);track('hotel_score_email_error',{status:'network'});}finally{setPending(false);}
  }
  const answeredCount = answers.filter(value => value !== null).length;
  const stages = lang === 'es' ? ['Tu operación', 'Tu correo', 'Confirmación'] : ['Your operations', 'Your email', 'Confirmation'];
  const currentStage = sent ? 2 : step < 10 ? 0 : 1;
  const nextLabel=step===9?(answeredCount===10?t.finish:(lang==='es'?'Ir a pendientes':'Go to unanswered')):(lang==='es'?'Siguiente':'Next');
  const questionControls=<><button type="button" className={styles.previousButton} disabled={step===0||!ready} onClick={()=>move(step-1)}><span aria-hidden="true">←</span>{lang==='es'?'Anterior':'Back'}</button><span className={styles.position}>{step+1} / 10</span><button type="button" className="pg-btn" disabled={!ready} onClick={advance}>{nextLabel}<span aria-hidden="true">→</span></button></>;

  return <main id="main-content" className={`pg ${styles.page}`}>
    <div className={styles.topbar}><a className={`pg-btn-text ${styles.backHome}`} href={routeFor(lang,'home')}>← {t.home}</a><span>WHAGONS <b>HOTEL OPERATIONS SCORE</b></span></div>
    <div className={styles.layout}>
      <aside className={styles.intro}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className={styles.lead}>{t.intro}</p>
        <div className={styles.progressCard}>
          <div className={styles.dial} aria-hidden="true"><svg viewBox="0 0 100 100"><circle className={styles.dialTrack} cx="50" cy="50" r="42" /><circle className={styles.dialValue} cx="50" cy="50" r="42" pathLength="100" strokeDasharray={`${answeredCount * 10} 100`} /></svg><strong>{answeredCount}<small>/10</small></strong></div>
          <div><strong>{lang === 'es' ? 'Tu progreso' : 'Your progress'}</strong><p>{answeredCount} {lang === 'es' ? 'de 10 preguntas respondidas' : 'of 10 questions answered'}</p><span>{lang === 'es' ? 'Un paso más cerca de tu diagnóstico.' : 'One step closer to your assessment.'}</span></div>
        </div>
        <div className={styles.promise}>
          <h2>{t.benefitTitle}</h2>
          <ol className={styles.benefits}>{t.benefits.map((v,i)=><li key={v}><span aria-hidden="true">0{i+1}</span>{v}</li>)}</ol>
        </div>
        <p className={styles.assessmentNote}>{t.note}</p>
      </aside>
      <section className={`pg-panel ${styles.assessment}`} aria-busy={pending}>
        <ol className={styles.journey} aria-label={lang === 'es' ? 'Etapas del diagnóstico' : 'Assessment stages'}>{stages.map((stage, index) => <li key={stage} aria-current={currentStage === index ? 'step' : undefined} data-complete={currentStage > index}><span aria-hidden="true">{currentStage > index ? '✓' : index + 1}</span>{stage}</li>)}</ol>
        {!sent && <div role="navigation" ref={navigation} className={styles.questionNav} aria-label={lang==='es'?'Navegación entre preguntas':'Question navigation'}>
          <div className={styles.navHeading}><strong>{lang==='es'?'Ir a una pregunta':'Go to a question'}</strong><span>{answeredCount}/10 {lang==='es'?'respondidas':'answered'}</span></div>
          <div className={styles.questionNumbers}>{qs.map((q,index)=><button type="button" key={q.id} disabled={!ready||pending} aria-current={step===index?'step':undefined} data-answered={answers[index]!==null} title={q.area} aria-label={`${t.question} ${index+1}: ${q.area}. ${answers[index]!==null?(lang==='es'?'Respondida':'Answered'):(lang==='es'?'Sin responder':'Unanswered')}`} onClick={()=>move(index)}><span>{index+1}</span></button>)}</div>
          <p>{lang==='es'?'Las preguntas con fondo verde ya están respondidas. El borde naranja indica la pregunta actual. Puedes tocar cualquier número para volver o avanzar.':'Green questions are answered. The orange outline marks the current question. Select any number to go back or move ahead.'}</p>
          {step<10&&<div className={styles.topActions}>{questionControls}</div>}
          {step<10&&answeredCount===10&&<button type="button" className={styles.emailLink} disabled={!ready||pending} onClick={()=>move(10)}>{lang==='es'?'Continuar al correo':'Continue to email'} →</button>}
        </div>}
        {sent ? <div className={`pg-success ${styles.success}`}>
          <span className="pg-success-icon" aria-hidden="true">{analysisFailed?'!':'✓'}</span>
          <h2 ref={heading} tabIndex={-1}>{analysisFailed?(lang==='es'?'Necesitamos guardar tus respuestas.':'We need to save your answers.'):t.sentTitle}</h2>
          <p role="status">{t.sentText} <strong>{sent}</strong>.</p>
          {analysisFailed ? <>
            <p role="status">{lang==='es'?'Tu correo se guardó, pero no pudimos guardar todas las respuestas para preparar el diagnóstico. Conservamos tu progreso en esta pestaña; vuelve a enviarlas.':'Your email was saved, but we could not save all answers needed to prepare your assessment. Your progress remains in this tab; please submit again.'}</p>
            <button type="button" className="pg-btn" onClick={()=>{setSent('');setAnalysisFailed(false);move(10);}}>{lang==='es'?'Volver a enviar mis respuestas':'Submit my answers again'} →</button>
          </> : <>
            <p>{t.sentNote}</p>
            <a className="pg-btn" href={routeFor(lang,'home')}>{t.home} →</a>
            <button type="button" className="pg-btn-text" onClick={reset}>{t.restart}</button>
          </>}
        </div>
        : step < 10 ? <form onSubmit={next}>
          <div className={styles.progressLabel}><span>{t.question} {step+1} {t.of} 10</span><span>{Math.round(answeredCount / 10 * 100)}%</span></div>
          <progress className="pg-progress" value={answeredCount} max={10} aria-label={t.progress}/>
          <div className={styles.toolsNote}><strong>{t.toolsTitle}</strong><p>{t.toolsNote}</p></div>
          <p className={styles.area}>{qs[step].area}</p><h2 ref={heading} tabIndex={-1} id="score-question">{qs[step].question}</h2><p className={`pg-small ${styles.hint}`}>{t.hint}</p>
          {qs[step].id === 'reporting' && <p className={styles.reportingExamples}>{lang === 'es' ? 'Por voz puedes dictar el problema; un QR o una etiqueta NFC puede abrir el reporte asociado al lugar. Si usan WhatsApp, otro software o un formulario, evalúa qué tan fácil resulta con ese medio.' : 'Voice lets you dictate the problem; a QR code or NFC tag can open the report linked to the location. If you use WhatsApp, other software or a form, assess how easy reporting is with that method.'}</p>}
          <fieldset className={styles.answers} aria-labelledby="score-question">
            {qs[step].answers.map((label:string,i:number)=><label key={`${step}-${i}`} className="pg-option" data-selected={answers[step]===i?'true':'false'}><input type="radio" name="answer" value={i} checked={answers[step]===i} onChange={()=>answer(i)} required/><span className="pg-option-letter" aria-hidden="true">{'ABCD'[i]}</span><span>{label}</span><span className="pg-option-radio" aria-hidden="true"/></label>)}
            <div className={styles.skipAnswers}>{(['unknown','na'] as const).map(v=><label key={v} className="pg-check" data-selected={answers[step]===v}><input type="radio" name="answer" value={v} checked={answers[step]===v} onChange={()=>answer(v)}/>{v==='unknown'?t.unknown:t.na}</label>)}</div>
          </fieldset>
          <div className={styles.actions}>{questionControls}</div>
          <p className={`pg-note ${styles.footnote}`}>{t.footer}</p>
        </form> : <div>
          <div className={styles.emailIcon} aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg></div>
          <p className={styles.area}>✓ {t.completed}</p><h2 ref={heading} tabIndex={-1}>{t.checkoutTitle}</h2><p className={`pg-small ${styles.hint}`}>{t.checkoutText}</p>
          <form className={`pg-form ${styles.emailForm}`} onSubmit={submit}><div className="pg-field"><label htmlFor="score-email">{t.email}</label><input id="score-email" name="email" type="email" value={emailDraft} onChange={event=>setEmailDraft(event.target.value)} required autoComplete="email" maxLength={254} placeholder={lang==='es'?'tu@tuhotel.com':'you@yourhotel.com'} aria-describedby="score-privacy" disabled={pending}/></div><div className="hp-field" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="pg-check"><input type="checkbox" name="marketing" checked={marketingOptIn} onChange={event=>setMarketingOptIn(event.target.checked)} disabled={pending}/><span>{t.marketing}</span></label><button type="submit" className="pg-btn" disabled={pending||captureAvailable===false}>{pending?t.sending:t.send}<span aria-hidden="true">→</span></button><p className="pg-note" id="score-privacy">{t.privacy} <a href={legalRouteFor(lang,'privacy')}>{t.privacyLink}</a></p>{captureAvailable===false&&<p className="pg-alert" role="status">{t.unavailable}</p>}{error&&<p className="pg-alert" role="alert">{error}</p>}</form>
          <button type="button" className="pg-btn-text" disabled={pending} onClick={()=>move(0)}>← {t.edit}</button>
        </div>}
      </section>
    </div><p className={`pg-small ${styles.storage}`}>{t.saving}</p>
  </main>;
}
