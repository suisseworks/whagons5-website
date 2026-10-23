import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes, randomUUID } from 'node:crypto';

// Request plumbing shared by the Cronus client-site forms (/api/cronus-contact
// and /api/cronus-careers).

const ALLOWED_ORIGINS = new Set(['https://whagons.com', 'https://www.whagons.com']);
const SALT = randomBytes(32);

export function noStoreJson(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export function requestId(request: NextRequest): string {
  const cloudflareRay = request.headers.get('cf-ray')?.split('-')[0]?.trim();
  if (cloudflareRay && /^[a-zA-Z0-9-]{8,64}$/.test(cloudflareRay)) return cloudflareRay;
  return randomUUID();
}

export function clientAddress(request: NextRequest): string | null {
  return (
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    null
  );
}

export function originAllowed(origin: string | null): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return process.env.NODE_ENV !== 'production' && /^http:\/\/localhost(:\d+)?$/.test(origin);
}

// A per-visitor rate limit kept in memory, keyed by a salted hash of the IP.
export function createRateLimiter(windowMs: number, max: number, maxBuckets = 5000) {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  let checks = 0;
  return {
    windowSeconds: Math.round(windowMs / 1000),
    limited(request: NextRequest): boolean {
      const address = clientAddress(request);
      if (!address) return false;
      const key = createHash('sha256').update(SALT).update(address).digest('hex').slice(0, 32);
      const now = Date.now();
      checks += 1;
      if (checks % 100 === 0) {
        for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
      }
      const bucket = buckets.get(key);
      if (!bucket || now >= bucket.resetAt) {
        if (!bucket && buckets.size >= maxBuckets) {
          const oldest = buckets.keys().next().value;
          if (oldest) buckets.delete(oldest);
        }
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return false;
      }
      bucket.count += 1;
      return bucket.count > max;
    },
  };
}

// Reads the request body, stopping as soon as it passes `max` bytes.
export async function readBody(request: NextRequest, max: number): Promise<Uint8Array | null> {
  if (Number(request.headers.get('content-length') || 0) > max) return null;
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}
