import {calculateScore,questions,validAnswers} from './hotel-score.mjs';
import {upsertFlodeskSubscriber} from './demo-delivery.mjs';

export function scoreSegmentForLanguage(language,env=process.env) {
  if(!['es','en'].includes(language))return '';
  return env[`FLODESK_SEGMENT_SCORE_${language.toUpperCase()}_ID`]?.trim()||'';
}

const SCORE_FIELD_KEYS = ['score','language','answers','requestedAt','marketing','delivery',...Array.from({length:3},(_,i)=>[`priority${i+1}`,`priority${i+1}Features`,`priority${i+1}Review`]).flat()];
function validFieldMapping(mapping) {
  return mapping && typeof mapping==='object' && !Array.isArray(mapping)
    && SCORE_FIELD_KEYS.every(key=>typeof mapping[key]==='string'&&mapping[key].trim())
    && new Set(SCORE_FIELD_KEYS.map(key=>mapping[key].trim())).size===SCORE_FIELD_KEYS.length;
}
export function scoreFieldMapping(env=process.env) {
  try {
    const mapping=JSON.parse(env.FLODESK_SCORE_FIELDS||'{}');
    return validFieldMapping(mapping)?Object.fromEntries(SCORE_FIELD_KEYS.map(key=>[key,mapping[key].trim()])):{};
  } catch { return {}; }
}
export function scoreCaptureAvailable(language,env=process.env) {
  const segmentsReady=language===null||language===undefined
    ? scoreSegmentForLanguage('es',env)&&scoreSegmentForLanguage('en',env)
    : scoreSegmentForLanguage(language,env);
  return Boolean(env.FLODESK_API_KEY?.trim()&&segmentsReady&&validFieldMapping(scoreFieldMapping(env)));
}

export function buildScoreFields(data,mapping,now=new Date()) {
  const result=calculateScore(data.answers);const es=data.language==='es';const qs=questions[data.language];
  const levels=es?['Operación reactiva','En organización','Bajo control','Mejora continua']:['Reactive operations','Getting organized','Under control','Continuous improvement'];
  const score=result.score===null?(es?'Sin datos evaluables':'No evaluated answers'):`${result.score}/100 · ${levels[result.level]} · ${result.evaluated}/10${result.partial?(es?' · Parcial':' · Partial'):''}`;
  const priorities=result.opportunities.map(i=>{const q=qs[i];return {action:`${q.area}. ${data.answers[i]===2?q.improve:q.action}`,features:`Whagons: ${q.features.join(', ')}.`,review:`${es?'Revisar':'Review'}: ${q.metric}${q.note?` ${q.note}`:''}`};});
  const noGap=es?'No se identificó otra oportunidad prioritaria en tus respuestas.':'No additional priority opportunity was identified in your answers.';
  const values={score,language:data.language,answers:JSON.stringify(data.answers),requestedAt:now.toISOString(),marketing:data.marketingOptIn===true?'yes':'no',delivery:'pending'};
  for(let i=1;i<=3;i++){values[`priority${i}`]=priorities[i-1]?.action||noGap;values[`priority${i}Features`]=priorities[i-1]?.features||'—';values[`priority${i}Review`]=priorities[i-1]?.review||'—';}
  if(Object.values(values).some(v=>v.length>256))throw new Error('Flodesk custom field exceeds 256 characters');
  return Object.fromEntries(Object.entries(values).filter(([key])=>typeof mapping?.[key]==='string'&&mapping[key]).map(([key,value])=>[mapping[key],value]));
}

export async function captureScoreLead({data,apiKey,segmentId,fieldMapping={},fetchImpl=fetch}) {
  if(!data||typeof data!=='object'||Array.isArray(data)||data.website||typeof data.email!=='string'||data.email.trim().length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())||!['es','en'].includes(data.language)||!validAnswers(data.answers)||(data.marketingOptIn!==undefined&&typeof data.marketingOptIn!=='boolean')||typeof data.requestId!=='string'||!/^[a-f0-9-]{36}$/i.test(data.requestId))return {ok:false,status:400};
  if(!apiKey?.trim()||!segmentId?.trim()||!validFieldMapping(fieldMapping))return {ok:false,status:503};
  const email=data.email.trim().toLowerCase();
  const read=async()=>{const path=encodeURIComponent(email).replace(/%40/gi,'@');const r=await fetchImpl(`https://api.flodesk.com/v1/subscribers/${path}`,{method:'GET',headers:{Authorization:`Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`},signal:AbortSignal.timeout(4000)});if(!r.ok)throw new Error('Subscriber readback failed');return r.json();};
  // Capture is independent of report generation and all outbound email services.
  // Additive upsert preserves names, other segments and suppressed subscription status.
  try{
    const saved=await upsertFlodeskSubscriber({apiKey,payload:{email,segment_ids:[segmentId.trim()]},fetchImpl,timeoutMs:4000,maxAttempts:2});
    if(!saved.ok)return {ok:false,status:502};
    const subscriber=await read();
    if(!subscriber.segments?.some(s=>s.id===segmentId.trim()))return {ok:false,status:502};
  }catch{return {ok:false,status:502};}
  let analysisSaved=false;
  try{
    const fields=buildScoreFields(data,fieldMapping);
    if(Object.keys(fields).length===15){
      const updated=await upsertFlodeskSubscriber({apiKey,payload:{email,custom_fields:fields},fetchImpl,timeoutMs:4000,maxAttempts:1});
      if(updated.ok){const subscriber=await read();analysisSaved=Object.entries(fields).every(([key,value])=>subscriber.custom_fields?.[key]===value);}
    }
  }catch{/* Lead capture remains successful even when analysis storage fails. */}
  return {ok:true,status:200,leadSaved:true,analysisSaved,delivery:'pending'};
}
