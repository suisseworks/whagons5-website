import { NextRequest, NextResponse } from 'next/server';

const APP_USER_AGENT = 'Whagons Website (whagons.com)';
const COMMON_HEADERS = { 'User-Agent': APP_USER_AGENT } as const;

// Cache for segment IDs to avoid fetching on every request
let segmentCache: { [key: string]: string | null } = {};
let segmentCacheTimestamp = 0;
const SEGMENT_CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

type FormType = 'brief' | 'demo';

function resolvedSegmentIdFromEnv(formType: FormType, lang: 'en' | 'es'): string | undefined {
  if (formType === 'brief') {
    const briefAll = process.env.FLODESK_SEGMENT_BRIEF_ID?.trim();
    if (briefAll) return briefAll;
  }
  if (formType === 'demo') {
    const demoAll = process.env.FLODESK_SEGMENT_DEMO_ID?.trim();
    if (demoAll) return demoAll;
  }
  const id =
    lang === 'es'
      ? formType === 'brief'
        ? process.env.FLODESK_SEGMENT_BRIEF_ES_ID
        : process.env.FLODESK_SEGMENT_DEMO_ES_ID
      : formType === 'brief'
        ? process.env.FLODESK_SEGMENT_BRIEF_EN_ID
        : process.env.FLODESK_SEGMENT_DEMO_EN_ID;
  const trimmed = id?.trim();
  return trimmed || undefined;
}

const BRIEF_SEGMENT_NAME = 'Whagons5-Brief';
const DEMO_SEGMENT_NAME = 'Whagons5-Demo';

function resolvedSegmentName(formType: FormType, lang: 'en' | 'es'): string {
  if (formType === 'brief') {
    const name =
      lang === 'es'
        ? process.env.FLODESK_SEGMENT_BRIEF_ES?.trim()
        : process.env.FLODESK_SEGMENT_BRIEF_EN?.trim();
    return name || BRIEF_SEGMENT_NAME;
  }

  const unified = process.env.FLODESK_SEGMENT_DEMO?.trim();
  if (unified) return unified;

  const name =
    lang === 'es'
      ? process.env.FLODESK_SEGMENT_DEMO_ES?.trim()
      : process.env.FLODESK_SEGMENT_DEMO_EN?.trim();
  return name || DEMO_SEGMENT_NAME;
}

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return null;
}

async function resolveCountryFromRequest(request: NextRequest): Promise<string> {
  const cf = request.headers.get('cf-ipcountry')?.trim();
  if (cf && cf.length === 2 && cf.toUpperCase() !== 'XX') {
    return cf.toUpperCase();
  }

  const vercel = request.headers.get('x-vercel-ip-country')?.trim();
  if (vercel && vercel.length === 2) {
    return vercel.toUpperCase();
  }

  const ip = getClientIp(request);
  if (
    !ip ||
    ip === '::1' ||
    ip === '127.0.0.1' ||
    ip.startsWith('127.') ||
    ip === '0.0.0.0'
  ) {
    return 'Unknown';
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(
      `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code`,
      { signal: ctrl.signal, headers: { ...COMMON_HEADERS } }
    );
    clearTimeout(timer);
    if (!res.ok) return 'Unknown';
    const data = (await res.json()) as { success?: boolean; country_code?: string };
    if (data.success && data.country_code && typeof data.country_code === 'string') {
      return data.country_code.toUpperCase();
    }
  } catch {
    // ignore — optional enrichment
  }

  return 'Unknown';
}

/**
 * Fetch segment ID by name from Flodesk API
 */
async function getSegmentIdByName(
  apiKey: string,
  segmentName: string
): Promise<string | null> {
  // Check cache first
  if (segmentCache[segmentName] && Date.now() - segmentCacheTimestamp < SEGMENT_CACHE_TTL) {
    return segmentCache[segmentName];
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
    const segmentsUrl = 'https://api.flodesk.com/v1/segments';
    
    // Fetch all segments (may need pagination for many segments)
    let allSegments: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`${segmentsUrl}?page=${page}&per_page=50`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          ...COMMON_HEADERS,
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch segments: ${response.status}`);
        break;
      }

      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        allSegments = allSegments.concat(data.data);
        
        // Check if there are more pages
        if (data.meta && page < data.meta.total_pages) {
          page++;
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    // Find segment by name
    const segment = allSegments.find((s: any) => s.name === segmentName);
    const segmentId = segment?.id || null;

    // Update cache
    segmentCache[segmentName] = segmentId;
    segmentCacheTimestamp = Date.now();

    return segmentId;
  } catch (error) {
    console.error(`Error fetching segment "${segmentName}":`, error);
    return null;
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;

function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, industry, country, language, formType, phone, teamSize } = body;

    const cleanEmail = sanitize(email);

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: cleanEmail ? 'Invalid email address' : 'Missing required fields' },
        { status: 400 }
      );
    }

    const cleanName = sanitize(name);
    const cleanCompany = sanitize(company);
    const cleanIndustry = sanitize(industry);
    const cleanLanguage = language === 'es' ? 'es' : 'en';
    const cleanFormType: FormType = formType === 'brief' ? 'brief' : 'demo';
    const cleanPhone = sanitize(phone);
    const cleanTeamSize = sanitize(teamSize);

    if (cleanFormType === 'demo') {
      if (!cleanName || !cleanCompany || !cleanIndustry || !cleanTeamSize) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
    } else {
      if (!cleanIndustry) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
    }

    const geoCountry = await resolveCountryFromRequest(request);
    const bodyCountry = sanitize(country);
    const cleanCountry =
      geoCountry !== 'Unknown' ? geoCountry : bodyCountry || 'Unknown';

    // Get Flodesk API key from environment
    const apiKey = process.env.FLODESK_API_KEY;
    if (!apiKey) {
      console.error('FLODESK_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Flodesk API endpoint - https://api.flodesk.com/v1/subscribers
    const flodeskUrl = process.env.FLODESK_API_URL || 'https://api.flodesk.com/v1/subscribers';

    const lang: 'en' | 'es' = cleanLanguage === 'es' ? 'es' : 'en';

    let segmentId = resolvedSegmentIdFromEnv(cleanFormType, lang);
    const targetSegmentName = resolvedSegmentName(cleanFormType, lang);

    if (!segmentId) {
      segmentId = (await getSegmentIdByName(apiKey, targetSegmentName)) ?? undefined;
    }

    if (!segmentId) {
      console.warn(
        `Flodesk segment not resolved for "${targetSegmentName}" (form=${cleanFormType}, lang=${lang}). Subscriber will be created without that segment assignment.`
      );
    }

    // Prepare data for Flodesk API
    // Flodesk requires 'email' and optionally accepts first_name, last_name, custom_fields, segment_ids, etc.
    const subscriberName =
      cleanName || cleanEmail.split('@')[0] || 'Subscriber';

    const flodeskData: any = {
      email: cleanEmail,
      first_name: subscriberName.split(/\s+/)[0] || subscriberName,
      last_name: subscriberName.split(/\s+/).slice(1).join(' ') || '',
    };

    // Add segment_ids if available (subscriber is enrolled in Audiences segments)
    if (segmentId) {
      flodeskData.segment_ids = [segmentId];
    }

    // Add custom fields for additional data
    flodeskData.custom_fields = {
      company: cleanCompany,
      industry: cleanIndustry,
      country: cleanCountry,
      language: cleanLanguage,
      source: 'whagons-website',
      form_type: cleanFormType,
      ...(cleanPhone ? { phone: cleanPhone } : {}),
      ...(cleanTeamSize ? { team_size: cleanTeamSize } : {}),
    };

    // Flodesk uses Basic Auth: username = API key, password = blank
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

    // Call Flodesk API
    const response = await fetch(flodeskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        ...COMMON_HEADERS,
      },
      body: JSON.stringify(flodeskData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flodesk API error:', response.status, errorText);

      return NextResponse.json(
        {
          success: false,
          message: 'Submission could not be completed. Please try again in a few minutes.',
          ...(process.env.NODE_ENV === 'development' && { debug: errorText }),
        },
        { status: 502 }
      );
    }

    const result = await response.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll be in touch soon.',
      data: result,
    });
  } catch (error) {
    console.error('Error submitting to Flodesk:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Submission could not be completed. Please try again in a few minutes.',
        ...(process.env.NODE_ENV === 'development' && { error: String(error) }),
      },
      { status: 500 }
    );
  }
}
