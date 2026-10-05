import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer } from 'node:net';
import { questions } from '../app/lib/hotel-score.mjs';

test('production HTTP route sends all answers and handles invalid requests, retries and delivery failures', {timeout:60000}, async t => {
  const socket = createServer();
  await new Promise(resolve => socket.listen(0,'127.0.0.1',resolve));
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const dir = await mkdtemp(join(tmpdir(),'score-api-'));
  const log = join(dir,'emails.jsonl');
  const mapping = Object.fromEntries(['score','language','answers','requestedAt','marketing','delivery', ...[1,2,3].flatMap(i => [`priority${i}`,`priority${i}Features`,`priority${i}Review`])].map(k => [k,k]));
  const child = spawn(process.execPath, ['--require',resolve('tests/fixtures/score-upstream.cjs'),resolve('node_modules/next/dist/bin/next'),'start','-p',String(port),'-H','127.0.0.1'], {
    env:{...process.env,SCORE_TEST_EMAIL_LOG:log,RESEND_API_KEY:'test',DEMO_NOTIFICATION_FROM:'test@example.com',FLODESK_API_KEY:'test',FLODESK_SEGMENT_SCORE_EN_ID:'score',FLODESK_SEGMENT_SCORE_ES_ID:'score',FLODESK_SCORE_FIELDS:JSON.stringify(mapping)},
    stdio:['ignore','pipe','pipe'],
  });
  let output='';
  child.stdout.on('data', chunk => {output += chunk;});
  child.stderr.on('data', chunk => {output += chunk;});
  t.after(async () => {
    if (child.exitCode === null) {
      const closed = new Promise(resolve => child.once('exit',resolve));
      child.kill('SIGTERM'); await closed;
    }
    await rm(dir,{recursive:true,force:true});
  });
  const base = `http://127.0.0.1:${port}`;
  let ready=false; let lastResponse='';
  for(let i=0;i<100;i++) {
    try { const r=await fetch(`${base}/api/hotel-score?language=en`); lastResponse=await r.text(); if(r.ok){assert.equal(JSON.parse(lastResponse).captureAvailable,true);ready=true;break;} } catch {}
    if(child.exitCode !== null) break;
    await new Promise(resolve => setTimeout(resolve,100));
  }
  assert(ready,output + lastResponse);
  let ip=1;
  const post = (data,headers={}) => fetch(`${base}/api/hotel-score`,{method:'POST',headers:{'content-type':'application/json','origin':base,'x-real-ip':`192.0.2.${ip++}`,...headers},body:JSON.stringify(data)});
  const data={email:'person@example.com',language:'en',answers:[0,1,2,3,0,1,2,3,'unknown','na'],requestId:'12345678-1234-4123-8123-123456789012',marketingOptIn:false};
  for(const language of ['en','es']) {
    const r=await post({...data,language});assert.equal(r.status,200);assert.equal((await r.json()).analysisSaved,true);
  }
  await post(data);
  const sent=(await readFile(log,'utf8')).trim().split('\n').map(JSON.parse);
  assert.equal(sent.length,3);
  assert.equal(sent[0].key,sent[2].key);
  for(const [index,language] of ['en','es'].entries()) {
    assert.deepEqual(sent[index].message.to,['marketing@whagons.com']);
    for(const q of questions[language]) assert(sent[index].message.text.includes(q.question));
  }
  assert.equal((await post({...data,answers:[]})).status,400);
  assert.equal((await post({...data,website:'bot'})).status,400);
  assert.equal((await post(data,{origin:'https://other.example'})).status,403);
  assert.equal((await post(data,{'content-type':'text/plain'})).status,415);
  assert.equal((await post({...data,email:'failure@example.com'})).status,502);
  const final=(await readFile(log,'utf8')).trim().split('\n').map(JSON.parse);
  assert.equal(final.length,5);
  assert.equal(final[3].key,final[4].key);
});
