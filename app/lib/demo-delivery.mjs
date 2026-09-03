import { isIP } from 'node:net';

const APP_USER_AGENT = 'Whagons Website (whagons.com)';
const DEFAULT_TIMEOUT_MS = 6000;
const DEFAULT_ATTEMPTS = 2;
const DEFAULT_GEO_TIMEOUT_MS = 1800;

export const FLODESK_SUBSCRIBERS_URL = 'https://api.flodesk.com/v1/subscribers';
export const FLODESK_SEGMENTS_URL = 'https://api.flodesk.com/v1/segments';
export const RESEND_EMAILS_URL = 'https://api.resend.com/emails';
export const DEMO_SEGMENT_NAMES = Object.freeze({
  en: 'Whagons-Demo-EN',
  es: 'Whagons-Demo-ES',
  pt: 'Whagons-Demo-EN',
  de: 'Whagons-Demo-EN',
  it: 'Whagons-Demo-EN',
});
export const DEMO_NOTIFICATION_RECIPIENTS = Object.freeze([
  'hello@whagons.com',
  'business@whagons.com',
]);

export function buildFlodeskCustomFields({ company, industry, country, city, phone }) {
  const fields = {};
  const cleanCompany = typeof company === 'string' ? company.trim() : '';
  const cleanIndustry = typeof industry === 'string' ? industry.trim() : '';
  const cleanCountry = typeof country === 'string' ? country.trim() : '';
  const cleanCity = typeof city === 'string' ? city.trim() : '';
  const cleanPhone = typeof phone === 'string' ? phone.trim() : '';

  // These keys come from the Whagons Flodesk account's custom-field API.
  // Flodesk accepts unknown keys without updating the visible custom fields,
  // so their spelling and capitalization are intentionally explicit here.
  if (cleanCompany) fields.empresa = cleanCompany;
  if (cleanIndustry) fields.sector = cleanIndustry;
  if (cleanCountry) fields.pais = cleanCountry;
  if (cleanCity && cleanCity !== 'Unknown') fields.ciudad = cleanCity;
  if (cleanPhone) fields.telFono = cleanPhone;

  return fields;
}

function cleanLocationValue(value, maxLength = 80) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    return decodeURIComponent(trimmed.replaceAll('+', ' ')).trim().slice(0, maxLength);
  } catch {
    return trimmed.slice(0, maxLength);
  }
}

function normalizedCountry(value) {
  const clean = cleanLocationValue(value, 60);
  if (!clean) return '';
  const upper = clean.toUpperCase();
  return /^[A-Z]{2}$/.test(upper) && upper !== 'XX' ? upper : clean;
}

function isPublicIpAddress(value) {
  if (typeof value !== 'string') return false;
  const clean = value.trim().split('%')[0];
  const version = isIP(clean);
  if (!version) return false;

  if (version === 4) {
    const [a, b] = clean.split('.').map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }

  const lower = clean.toLowerCase();
  if (lower.startsWith('::ffff:')) return isPublicIpAddress(lower.slice(7));
  return !(
    lower === '::' ||
    lower === '::1' ||
    lower.startsWith('fc') ||
    lower.startsWith('fd') ||
    /^fe[89ab]/.test(lower)
  );
}

export async function resolveApproximateLocation({
  edgeCountry,
  edgeCity,
  ip,
  submittedCountry,
  submittedCity,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_GEO_TIMEOUT_MS,
}) {
  const headerCountry = normalizedCountry(edgeCountry);
  const headerCity = cleanLocationValue(edgeCity);
  const fallbackCountry = normalizedCountry(submittedCountry);
  const fallbackCity = cleanLocationValue(submittedCity);

  if (headerCity || fallbackCity) {
    return {
      country: headerCountry || fallbackCountry || 'Unknown',
      city: headerCity || fallbackCity,
    };
  }

  if (isPublicIpAddress(ip)) {
    try {
      const response = await fetchWithTimeout(
        fetchImpl,
        `https://ipwho.is/${encodeURIComponent(ip.trim())}?fields=success,city,country_code`,
        { headers: { 'User-Agent': APP_USER_AGENT } },
        timeoutMs
      );
      if (response.ok) {
        const data = await response.json();
        if (data?.success) {
          return {
            country: headerCountry || normalizedCountry(data.country_code) || fallbackCountry || 'Unknown',
            city: cleanLocationValue(data.city) || 'Unknown',
          };
        }
      }
    } catch {
      // Geolocation is optional and must never prevent a demo submission.
    }
  }

  return {
    country: headerCountry || fallbackCountry || 'Unknown',
    city: 'Unknown',
  };
}

export function resolveLeadDeliveryOutcome({ formType, flodeskResult, emailResult }) {
  const emailApplies = formType === 'demo';
  const success = Boolean(flodeskResult?.ok || (emailApplies && emailResult?.ok));
  if (success) return { success: true, status: 200 };

  const noChannelConfigured =
    !flodeskResult?.configured && (!emailApplies || !emailResult?.configured);
  return { success: false, status: noChannelConfigured ? 503 : 502 };
}

function wait(ms) {
  if (!ms) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

async function discardResponseBody(response) {
  try {
    await response.arrayBuffer();
  } catch {
    // A diagnostic response body must never prevent a retry.
  }
}

async function fetchWithTimeout(fetchImpl, url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetchImpl(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry({
  fetchImpl,
  url,
  init,
  timeoutMs,
  maxAttempts,
  retryDelayMs,
}) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(fetchImpl, url, init, timeoutMs);
      if (!isRetryableStatus(response.status) || attempt === maxAttempts) {
        return { response, attempts: attempt };
      }
      await discardResponseBody(response);
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        return { error, attempts: attempt };
      }
    }

    await wait(retryDelayMs * attempt);
  }

  return { error: lastError || new Error('Upstream request failed') };
}

function basicAuth(apiKey) {
  return `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
}

export async function upsertFlodeskSubscriber({
  apiKey,
  payload,
  // Kept in the signature to make accidental reintroduction of a configurable
  // upstream testable. The destination is intentionally fixed to Flodesk.
  apiUrl: _ignoredApiUrl = undefined,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxAttempts = DEFAULT_ATTEMPTS,
  retryDelayMs = 150,
}) {
  const cleanApiKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!cleanApiKey) {
    return {
      ok: false,
      configured: false,
      code: 'FLODESK_NOT_CONFIGURED',
      attempts: 0,
    };
  }

  const outcome = await fetchWithRetry({
    fetchImpl,
    url: FLODESK_SUBSCRIBERS_URL,
    init: {
      method: 'POST',
      headers: {
        Authorization: basicAuth(cleanApiKey),
        'Content-Type': 'application/json',
        'User-Agent': APP_USER_AGENT,
      },
      body: JSON.stringify(payload),
    },
    timeoutMs,
    maxAttempts,
    retryDelayMs,
  });

  if (outcome.error) {
    return {
      ok: false,
      configured: true,
      code: 'FLODESK_UNAVAILABLE',
      attempts: outcome.attempts || maxAttempts,
    };
  }

  const { response } = outcome;
  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      code: isRetryableStatus(response.status)
        ? 'FLODESK_UNAVAILABLE'
        : 'FLODESK_REJECTED',
      status: response.status,
      attempts: outcome.attempts,
    };
  }

  return {
    ok: true,
    configured: true,
    status: response.status,
    attempts: outcome.attempts,
  };
}

export async function findFlodeskSegmentId({
  apiKey,
  segmentName,
  fetchImpl = fetch,
  timeoutMs = 1400,
  maxPages = 3,
}) {
  const cleanApiKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  const cleanName = typeof segmentName === 'string' ? segmentName.trim() : '';
  if (!cleanApiKey || !cleanName) {
    return { ok: false, id: null, code: 'SEGMENT_LOOKUP_NOT_CONFIGURED' };
  }

  for (let page = 1; page <= maxPages; page += 1) {
    const outcome = await fetchWithRetry({
      fetchImpl,
      url: `${FLODESK_SEGMENTS_URL}?page=${page}&per_page=50`,
      init: {
        method: 'GET',
        headers: {
          Authorization: basicAuth(cleanApiKey),
          'Content-Type': 'application/json',
          'User-Agent': APP_USER_AGENT,
        },
      },
      timeoutMs,
      maxAttempts: 1,
      retryDelayMs: 0,
    });

    if (outcome.error || !outcome.response?.ok) {
      return {
        ok: false,
        id: null,
        code: outcome.error ? 'SEGMENT_LOOKUP_UNAVAILABLE' : 'SEGMENT_LOOKUP_REJECTED',
        status: outcome.response?.status,
      };
    }

    let data;
    try {
      data = await outcome.response.json();
    } catch {
      return { ok: false, id: null, code: 'SEGMENT_LOOKUP_INVALID_RESPONSE' };
    }

    const segments = Array.isArray(data?.data) ? data.data : [];
    const match = segments.find(
      (segment) => segment && segment.name === cleanName && typeof segment.id === 'string'
    );
    if (match) {
      return { ok: true, id: match.id };
    }

    const totalPages = Number(data?.meta?.total_pages || 1);
    if (!Number.isFinite(totalPages) || page >= totalPages) break;
  }

  return { ok: false, id: null, code: 'SEGMENT_NOT_FOUND' };
}

function cleanHeaderText(value, fallback) {
  const clean = typeof value === 'string' ? value.replace(/[\r\n]+/g, ' ').trim() : '';
  return (clean || fallback).slice(0, 120);
}

function displayValue(value) {
  if (typeof value !== 'string') return 'Not provided';
  const clean = value.trim();
  return clean || 'Not provided';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildNotificationContent(lead, flodeskOk, requestId) {
  const company = cleanHeaderText(lead.company, 'Company not provided');
  const name = cleanHeaderText(lead.name, 'Name not provided');
  const subject = `[Whagons] New demo request - ${company}`;
  const flodeskStatus = flodeskOk ? 'Captured successfully' : 'Needs manual follow-up';
  const fields = [
    ['Name', name],
    ['Hotel / company', displayValue(lead.company)],
    ['Email', displayValue(lead.email)],
    ['Phone', displayValue(lead.phone)],
    ['Industry', displayValue(lead.industry)],
    ['People on the floor', displayValue(lead.teamSize)],
    ['Language', displayValue(lead.language).toUpperCase()],
    ['City', displayValue(lead.city)],
    ['Country', displayValue(lead.country)],
    ['Flodesk', flodeskStatus],
    ['Request ID', displayValue(requestId)],
  ];

  const text = [
    'A new demo request was submitted on whagons.com.',
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Reply to this email to contact the prospect.',
  ].join('\n');

  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 14px 6px 0;color:#5f625f;font-weight:600">${escapeHtml(label)}</th><td style="padding:6px 0;color:#111">${escapeHtml(value)}</td></tr>`
    )
    .join('');
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;line-height:1.5;color:#111"><h1 style="font-size:22px">New Whagons demo request</h1><p>A visitor submitted the demo form on whagons.com.</p><table role="presentation" cellspacing="0" cellpadding="0">${rows}</table><p style="margin-top:24px">Reply to this email to contact the prospect.</p></body></html>`;

  return { subject, text, html };
}

export async function sendDemoNotification({
  resendApiKey,
  from,
  lead,
  flodeskOk,
  requestId,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxAttempts = DEFAULT_ATTEMPTS,
  retryDelayMs = 150,
}) {
  const cleanApiKey = typeof resendApiKey === 'string' ? resendApiKey.trim() : '';
  const cleanFrom = typeof from === 'string' ? from.trim() : '';
  if (!cleanApiKey || !cleanFrom) {
    return { ok: false, configured: false, code: 'EMAIL_NOT_CONFIGURED', attempts: 0 };
  }

  const cleanRequestId = cleanHeaderText(requestId, 'unknown');
  const content = buildNotificationContent(lead, Boolean(flodeskOk), cleanRequestId);
  const outcome = await fetchWithRetry({
    fetchImpl,
    url: RESEND_EMAILS_URL,
    init: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `demo-request/${cleanRequestId}`,
        'User-Agent': APP_USER_AGENT,
      },
      body: JSON.stringify({
        from: cleanFrom,
        to: [...DEMO_NOTIFICATION_RECIPIENTS],
        subject: content.subject,
        text: content.text,
        html: content.html,
        reply_to: lead.email,
      }),
    },
    timeoutMs,
    maxAttempts,
    retryDelayMs,
  });

  if (outcome.error) {
    return {
      ok: false,
      configured: true,
      code: 'EMAIL_UNAVAILABLE',
      attempts: outcome.attempts || maxAttempts,
    };
  }

  const { response } = outcome;
  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      code: isRetryableStatus(response.status) ? 'EMAIL_UNAVAILABLE' : 'EMAIL_REJECTED',
      status: response.status,
      attempts: outcome.attempts,
    };
  }

  return {
    ok: true,
    configured: true,
    status: response.status,
    attempts: outcome.attempts,
  };
}
