import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes, randomUUID } from 'node:crypto';

import {
  cronusSenderAddress,
  sendCronusContact,
  validateCronusContact,
} from '../../lib/cronus-contact.mjs';

// Contact form for the Cronus client site (/clients/cronus2). Messages go to
// info@cronustec.com through the site's Resend account; see DEMO_REQUEST_SETUP.md.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const ALLOWED_ORIGINS = new Set(['https://whagons.com', 'https://www.whagons.com']);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_MAX_BUCKETS = 5000;
const RATE_LIMIT_SALT = randomBytes(32);

const requestBuckets = new Map<string, { count: number; resetAt: number }>();
let rateLimitChecks = 0;

function noStoreJson(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

function requestId(request: NextRequest): string {
  const cloudflareRay = request.headers.get('cf-ray')?.split('-')[0]?.trim();
  if (cloudflareRay && /^[a-zA-Z0-9-]{8,64}$/.test(cloudflareRay)) return cloudflareRay;
  return randomUUID();
}

function clientAddressKey(request: NextRequest): string | null {
  const address =
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!address) return null;
  return createHash('sha256').update(RATE_LIMIT_SALT).update(address).digest('hex').slice(0, 32);
}

function isRateLimited(request: NextRequest): boolean {
  const key = clientAddressKey(request);
  if (!key) return false;
  const now = Date.now();
  rateLimitChecks += 1;
  if (rateLimitChecks % 100 === 0) {
    for (const [bucketKey, value] of requestBuckets) {
      if (now >= value.resetAt) requestBuckets.delete(bucketKey);
    }
  }
  const bucket = requestBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    if (!bucket && requestBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
      const oldestKey = requestBuckets.keys().next().value;
      if (oldestKey) requestBuckets.delete(oldestKey);
    }
    requestBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

function originAllowed(origin: string | null): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return process.env.NODE_ENV !== 'production' && /^http:\/\/localhost(:\d+)?$/.test(origin);
}

// Reports whether delivery is configured, without sending anything.
export async function GET() {
  const configured = Boolean(process.env.RESEND_API_KEY?.trim() && cronusSenderAddress(process.env));
  return noStoreJson({ configured });
}

export async function POST(request: NextRequest) {
  const id = requestId(request);
  if (!originAllowed(request.headers.get('origin'))) return noStoreJson({ error: 'FORBIDDEN' }, 403);
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
    return noStoreJson({ error: 'TOO_LARGE' }, 413);
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return noStoreJson({ error: 'TOO_LARGE' }, 413);
    body = JSON.parse(raw);
  } catch {
    return noStoreJson({ error: 'INVALID' }, 400);
  }

  const result = validateCronusContact(body);
  // Quietly accept bot submissions so the honeypot can't be used to probe validation.
  if (!result.ok) return result.code === 'SPAM' ? noStoreJson({ ok: true }) : noStoreJson({ error: 'INVALID' }, 400);

  if (isRateLimited(request)) {
    return noStoreJson({ error: 'RATE_LIMITED' }, 429, { 'Retry-After': String(RATE_LIMIT_WINDOW_MS / 1000) });
  }

  const started = Date.now();
  const sent = await sendCronusContact({
    resendApiKey: process.env.RESEND_API_KEY,
    from: cronusSenderAddress(process.env),
    inquiry: result.inquiry,
    requestId: id,
  });
  console.info(
    JSON.stringify({
      event: 'cronus_contact',
      requestId: id,
      ok: sent.ok,
      code: sent.code,
      status: sent.status,
      attempts: sent.attempts,
      elapsedMs: Date.now() - started,
    })
  );

  if (sent.ok) return noStoreJson({ ok: true, requestId: id });
  return noStoreJson({ error: sent.configured ? 'UNAVAILABLE' : 'NOT_CONFIGURED', requestId: id }, 503);
}
