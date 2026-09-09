import test from 'node:test';
import assert from 'node:assert/strict';
import {captureScoreLead,buildScoreFields,scoreSegmentForLanguage,scoreCaptureAvailable,scoreFieldMapping} from '../app/lib/hotel-score-capture.mjs';
test('score language routing never falls back to the shared or opposite-language segment',()=>{
  const env={FLODESK_SEGMENT_SCORE_ES_ID:' spanish ',FLODESK_SEGMENT_SCORE_EN_ID:'english',FLODESK_SEGMENT_SCORE_ID:'legacy'};
  assert.equal(scoreSegmentForLanguage('es',env),'spanish');
  assert.equal(scoreSegmentForLanguage('en',env),'english');
  assert.equal(scoreSegmentForLanguage('fr',env),'');
  assert.equal(scoreSegmentForLanguage('en',{...env,FLODESK_SEGMENT_SCORE_EN_ID:''}),'');
});
const mapping=Object.fromEntries(['score','language','answers','priority1','priority2','priority3','requestedAt','marketing','delivery',...Array.from({length:3},(_,i)=>[`priority${i+1}Features`,`priority${i+1}Review`]).flat()].map(k=>[k,k]));
const data={email:' Person@Example.com ',language:'es',answers:[0,1,2,3,0,1,2,3,'unknown','na'],requestId:'12345678-1234-4123-8123-123456789012',marketingOptIn:false};
test('capture readiness requires every report field and the requested language segment',()=>{
  const env={FLODESK_API_KEY:'test',FLODESK_SEGMENT_SCORE_ES_ID:'spanish',FLODESK_SEGMENT_SCORE_EN_ID:'english',FLODESK_SCORE_FIELDS:JSON.stringify(mapping)};
  assert.equal(scoreCaptureAvailable('es',env),true);
  assert.equal(scoreCaptureAvailable(null,env),true);
  assert.equal(scoreCaptureAvailable('fr',env),false);
  assert.equal(scoreCaptureAvailable('en',{...env,FLODESK_SEGMENT_SCORE_EN_ID:''}),false);
  for(const fields of ['{}','invalid',JSON.stringify({...mapping,answers:''}),JSON.stringify({...mapping,answers:mapping.score})]) {
    assert.equal(scoreCaptureAvailable('es',{...env,FLODESK_SCORE_FIELDS:fields}),false);
    assert.deepEqual(scoreFieldMapping({...env,FLODESK_SCORE_FIELDS:fields}),{});
  }
});
test('missing report configuration preserves answers without registering an incomplete request',async()=>{
  let called=false;
  const result=await captureScoreLead({data,apiKey:'test',segmentId:'score',fieldMapping:{},fetchImpl:async()=>{called=true;return Response.json({});}});
  assert.equal(result.status,503);assert.equal(called,false);
});
function upstream({rejectFields=false,missingSegment=false,dropFields=false}={}){const calls=[];let fields={};return {calls,fetchImpl:async(url,init)=>{calls.push({url,init});if(init.method==='POST'){const body=JSON.parse(init.body);if(body.custom_fields&&rejectFields)return Response.json({}, {status:400});fields={...fields,...body.custom_fields};}return Response.json({id:'test',status:'active',segments:missingSegment?[]:[{id:'score'}],custom_fields:dropFields?{}:fields});}};}
test('score registration succeeds without Resend and confirms segment and personalized fields',async()=>{const u=upstream();const r=await captureScoreLead({data,apiKey:'test',segmentId:'score',fieldMapping:mapping,fetchImpl:u.fetchImpl});assert(r.ok);assert(r.analysisSaved);assert.equal(r.delivery,'pending');assert(u.calls.every(c=>c.url.startsWith('https://api.flodesk.com/v1/')));const first=JSON.parse(u.calls[0].init.body);assert.deepEqual(first,{email:'person@example.com',segment_ids:['score']});});
test('email stays registered even if saving analysis fails',async()=>{const u=upstream({rejectFields:true});const r=await captureScoreLead({data,apiKey:'test',segmentId:'score',fieldMapping:mapping,fetchImpl:u.fetchImpl});assert(r.ok);assert.equal(r.analysisSaved,false);});
test('successful HTTP upsert without readback membership cannot claim capture',async()=>{const u=upstream({missingSegment:true});const r=await captureScoreLead({data,apiKey:'test',segmentId:'score',fieldMapping:mapping,fetchImpl:u.fetchImpl});assert.equal(r.ok,false);});
test('silent custom-field rejection is detected',async()=>{const u=upstream({dropFields:true});const r=await captureScoreLead({data,apiKey:'test',segmentId:'score',fieldMapping:mapping,fetchImpl:u.fetchImpl});assert(r.ok);assert.equal(r.analysisSaved,false);});
test('fields recompute score and preserve raw answers and explicit consent',()=>{const fields=buildScoreFields(data,mapping);assert.match(fields.score,/50\/100/);assert.equal(fields.marketing,'no');assert.deepEqual(JSON.parse(fields.answers),data.answers);assert.match(fields.priority1Features,/Whagons:/);assert.equal(buildScoreFields({...data,marketingOptIn:true},mapping).marketing,'yes');});
test('every recommendation fits the live Flodesk 256-character field limit without truncation',()=>{for(const language of ['es','en'])for(let q=0;q<10;q++)for(let answer=0;answer<=3;answer++){const answers=Array(10).fill(3);answers[q]=answer;const fields=buildScoreFields({...data,language,answers},mapping);assert.equal(Object.keys(fields).length,15);for(const value of Object.values(fields))assert(value.length<=256);}});
test('invalid data never contacts Flodesk',async()=>{const u=upstream();for(const invalid of [null,{...data,email:'bad'},{...data,answers:[]},{...data,website:'bot'},{...data,language:'fr'},{...data,marketingOptIn:'true'}])assert.equal((await captureScoreLead({data:invalid,apiKey:'test',segmentId:'score',fieldMapping:mapping,fetchImpl:u.fetchImpl})).status,400);assert.equal(u.calls.length,0);});
