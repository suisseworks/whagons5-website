import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'node:crypto';
import { captureScoreLead, scoreSegmentForLanguage, scoreCaptureAvailable, scoreFieldMapping } from '../../lib/hotel-score-capture.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const buckets = new Map<string, { count: number; expires: number }>();
const salt = randomBytes(32);
const json = (body: object, status = 200) => NextResponse.json(body, {status, headers:{'Cache-Control':'no-store'}});
export function GET(request: NextRequest) {
  const language=request.nextUrl.searchParams.get('language');
  return json({captureAvailable:scoreCaptureAvailable(language)});
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (request.headers.get('sec-fetch-site') === 'cross-site') return json({success:false},403);
  if (origin) {
    try { const source = new URL(origin); if (!['http:','https:'].includes(source.protocol) || source.host !== (request.headers.get('host') || request.nextUrl.host)) return json({success:false},403); }
    catch { return json({success:false},403); }
  }
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const key = createHash('sha256').update(salt).update(ip).digest('hex');
  const now = Date.now();
  for (const [id, entry] of buckets) if (entry.expires <= now) buckets.delete(id);
  const bucket = buckets.get(key) || {count:0,expires:now+600000};
  if (++bucket.count > 5) return NextResponse.json({success:false},{status:429,headers:{'Cache-Control':'no-store','Retry-After':'600'}});
  if (buckets.size >= 5000) buckets.delete(buckets.keys().next().value!);
  buckets.set(key,bucket);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({success:false},415);
  let data;
  try {
    const reader = request.body?.getReader(); if (!reader) return json({success:false},400);
    const chunks: Uint8Array[] = []; let size=0;
    while (true) { const {done,value}=await reader.read(); if(done) break; size+=value.length; if(size>4096){await reader.cancel();return json({success:false},413);} chunks.push(value); }
    data=JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return json({success:false},400); }
  const captured=await captureScoreLead({data,apiKey:process.env.FLODESK_API_KEY,segmentId:scoreSegmentForLanguage(data?.language),fieldMapping:scoreFieldMapping()});
  if(!captured.ok)return json({success:false},captured.status);
  // Flodesk sends the acknowledgement from the language-specific workflow.
  // The team prepares the personalized report separately within 24 hours.
  return json({success:true,leadSaved:true,analysisSaved:captured.analysisSaved,delivery:'pending'});
}
