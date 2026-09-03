import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes, randomUUID } from 'node:crypto';

import {
  DEMO_SEGMENT_NAMES,
  buildFlodeskCustomFields,
  findFlodeskSegmentId,
  resolveApproximateLocation,
  resolveLeadDeliveryOutcome,
  sendDemoNotification,
  upsertFlodeskSubscriber,
} from '../../lib/demo-delivery.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type FormType = 'brief' | 'demo';
type Language = 'en' | 'es' | 'pt' | 'de' | 'it';

const BRIEF_SEGMENT_NAME = 'Whagons5-Brief';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;
const SEGMENT_CACHE_TTL = 60 * 60 * 1000;
const FAILED_SEGMENT_CACHE_TTL = 5 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const RATE_LIMIT_MAX_BUCKETS = 5000;
const RATE_LIMIT_SALT = randomBytes(32);

const segmentCache = new Map<string, { id: string | null; expiresAt: number }>();
const requestBuckets = new Map<string, { count: number; resetAt: number }>();
let rateLimitChecks = 0;

function sanitize(value: unknown, maxLength = MAX_FIELD_LENGTH): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function resolvedSegmentIdFromEnv(formType: FormType, lang: Language): string | undefined {
  if (formType === 'brief') {
    const sharedBrief = process.env.FLODESK_SEGMENT_BRIEF_ID?.trim();
    if (sharedBrief) return sharedBrief;
    const localizedBrief = lang === 'es'
      ? process.env.FLODESK_SEGMENT_BRIEF_ES_ID
      : process.env.FLODESK_SEGMENT_BRIEF_EN_ID;
    return localizedBrief?.trim() || undefined;
  }

  const localizedDemo = lang === 'es'
    ? process.env.FLODESK_SEGMENT_DEMO_ES_ID
    : lang === 'en'
      ? process.env.FLODESK_SEGMENT_DEMO_EN_ID
      : process.env.FLODESK_SEGMENT_DEMO_OTHER_ID;

  return localizedDemo?.trim() || undefined;
}

function resolvedSegmentName(formType: FormType, lang: Language): string {
  if (formType === 'brief') {
    const localized =
      lang === 'es'
        ? process.env.FLODESK_SEGMENT_BRIEF_ES?.trim()
        : process.env.FLODESK_SEGMENT_BRIEF_EN?.trim();
    return localized || BRIEF_SEGMENT_NAME;
  }

  return DEMO_SEGMENT_NAMES[lang];
}

function requestId(request: NextRequest): string {
  const cloudflareRay = request.headers.get('cf-ray')?.split('-')[0]?.trim();
  if (cloudflareRay && /^[a-zA-Z0-9-]{8,64}$/.test(cloudflareRay)) {
    return cloudflareRay;
  }
  return randomUUID();
}

function clientAddress(request: NextRequest): string | null {
  const cloudflare = request.headers.get('cf-connecting-ip')?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return cloudflare || realIp || forwarded || null;
}

function clientAddressKey(request: NextRequest): string | null {
  const address = clientAddress(request);
  if (!address) return null;
  return createHash('sha256')
    .update(RATE_LIMIT_SALT)
    .update(address)
    .digest('hex')
    .slice(0, 32);
}

function isRateLimited(request: NextRequest): boolean {
  const addressKey = clientAddressKey(request);
  if (!addressKey) return false;

  const now = Date.now();
  rateLimitChecks += 1;
  if (rateLimitChecks % 100 === 0) {
    for (const [key, value] of requestBuckets) {
      if (now >= value.resetAt) requestBuckets.delete(key);
    }
  }
  const bucket = requestBuckets.get(addressKey);
  if (!bucket || now >= bucket.resetAt) {
    if (!bucket && requestBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
      const oldestKey = requestBuckets.keys().next().value;
      if (oldestKey) requestBuckets.delete(oldestKey);
    }
    requestBuckets.set(addressKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

function logDelivery(
  id: string,
  channel: 'segment' | 'flodesk' | 'email',
  result: { ok?: boolean; code?: string; status?: number; attempts?: number },
  elapsedMs: number
) {
  console.info(
    JSON.stringify({
      event: 'lead_delivery',
      requestId: id,
      channel,
      ok: Boolean(result.ok),
      code: result.code || null,
      status: result.status || null,
      attempts: result.attempts || null,
      elapsedMs,
    })
  );
}

async function resolveSegmentId(
  apiKey: string,
  formType: FormType,
  lang: Language,
  id: string
): Promise<string | undefined> {
  const configured = resolvedSegmentIdFromEnv(formType, lang);
  if (configured) return configured;

  const name = resolvedSegmentName(formType, lang);
  const cached = segmentCache.get(name);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.id || undefined;
  }

  const startedAt = Date.now();
  const result = await findFlodeskSegmentId({
    apiKey,
    segmentName: name,
    timeoutMs: 900,
  });
  logDelivery(id, 'segment', result, Date.now() - startedAt);

  segmentCache.set(name, {
    id: result.id,
    expiresAt:
      Date.now() + (result.ok ? SEGMENT_CACHE_TTL : FAILED_SEGMENT_CACHE_TTL),
  });
  return result.id || undefined;
}

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  const id = requestId(request);

  try {
    const body = await request.json();

    // Quietly accept bot submissions so the honeypot cannot be used to probe validation.
    if (sanitize(body.website)) {
      return noStoreJson({ success: true });
    }

    const cleanEmail = sanitize(body.email).toLowerCase();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return noStoreJson(
        { error: cleanEmail ? 'Invalid email address' : 'Missing required fields' },
        400
      );
    }

    const cleanName = sanitize(body.name);
    const cleanCompany = sanitize(body.company);
    const cleanIndustry = sanitize(body.industry);
    const submittedLanguage = sanitize(body.language, 2).toLowerCase();
    const cleanLanguage: Language = ['en', 'es', 'pt', 'de', 'it'].includes(submittedLanguage)
      ? submittedLanguage as Language
      : 'en';
    const cleanFormType: FormType = body.formType === 'brief' ? 'brief' : 'demo';
    const cleanPhone = sanitize(body.phone, 60);
    const cleanTeamSize = sanitize(body.teamSize);

    if (cleanFormType === 'demo') {
      if (!cleanName || !cleanCompany || !cleanIndustry || !cleanTeamSize) {
        return noStoreJson({ error: 'Missing required fields' }, 400);
      }
    } else if (!cleanIndustry) {
      return noStoreJson({ error: 'Missing required fields' }, 400);
    }

    if (isRateLimited(request)) {
      return NextResponse.json(
        { success: false, message: 'Please wait a few minutes before trying again.' },
        {
          status: 429,
          headers: { 'Cache-Control': 'no-store', 'Retry-After': '600' },
        }
      );
    }

    const apiKey = process.env.FLODESK_API_KEY?.trim() || '';
    const [location, targetSegment] = await Promise.all([
      resolveApproximateLocation({
        edgeCountry:
          request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country'),
        edgeCity: request.headers.get('cf-ipcity') || request.headers.get('x-vercel-ip-city'),
        ip: clientAddress(request),
        submittedCountry: sanitize(body.country, 60),
        submittedCity: sanitize(body.city, 80),
      }),
      apiKey ? resolveSegmentId(apiKey, cleanFormType, cleanLanguage, id) : undefined,
    ]);
    const cleanCountry = location.country;
    const cleanCity = location.city;
    const subscriberName = cleanName || cleanEmail.split('@')[0] || 'Subscriber';
    const nameParts = subscriberName.split(/\s+/);
    const lead = {
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany,
      industry: cleanIndustry,
      country: cleanCountry,
      city: cleanCity,
      language: cleanLanguage,
      phone: cleanPhone,
      teamSize: cleanTeamSize,
    };

    const baseFlodeskPayload = {
      email: cleanEmail,
      first_name: nameParts[0] || subscriberName,
      last_name: nameParts.slice(1).join(' '),
      custom_fields: buildFlodeskCustomFields(lead),
    };

    let flodeskPayload = targetSegment
      ? { ...baseFlodeskPayload, segment_ids: [targetSegment] }
      : baseFlodeskPayload;
    let startedAt = Date.now();
    let flodeskResult = await upsertFlodeskSubscriber({
      apiKey,
      payload: flodeskPayload,
    });
    logDelivery(id, 'flodesk', flodeskResult, Date.now() - startedAt);

    // A stale segment ID must not discard an otherwise valid lead.
    if (!flodeskResult.ok && flodeskResult.status === 400 && targetSegment) {
      flodeskPayload = baseFlodeskPayload;
      startedAt = Date.now();
      flodeskResult = await upsertFlodeskSubscriber({
        apiKey,
        payload: flodeskPayload,
        maxAttempts: 1,
      });
      logDelivery(id, 'flodesk', flodeskResult, Date.now() - startedAt);
    }

    const emailResult =
      cleanFormType === 'demo'
        ? await (async () => {
            const emailStartedAt = Date.now();
            const result = await sendDemoNotification({
              resendApiKey: process.env.RESEND_API_KEY,
              from: process.env.DEMO_NOTIFICATION_FROM,
              lead,
              flodeskOk: flodeskResult.ok,
              requestId: id,
            });
            logDelivery(id, 'email', result, Date.now() - emailStartedAt);
            return result;
          })()
        : { ok: false, configured: false, code: 'EMAIL_NOT_APPLICABLE' };

    const deliveryOutcome = resolveLeadDeliveryOutcome({
      formType: cleanFormType,
      flodeskResult,
      emailResult,
    });

    if (deliveryOutcome.success) {
      return noStoreJson({
        success: true,
        message: "Thank you! We'll be in touch soon.",
        requestId: id,
      });
    }

    return noStoreJson(
      {
        success: false,
        message: 'Submission could not be completed. Please try again in a few minutes.',
        requestId: id,
      },
      deliveryOutcome.status
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'lead_delivery_unhandled',
        requestId: id,
        error: error instanceof Error ? error.name : 'UnknownError',
      })
    );
    return noStoreJson(
      {
        success: false,
        message: 'Submission could not be completed. Please try again in a few minutes.',
        requestId: id,
      },
      500
    );
  }
}
