import { NextRequest, NextResponse } from 'next/server';

const BRIEF_PDF_PATH = '/9af3877fd2b65a3c/whagons-brief-2026.pdf';

function redirect(request: NextRequest, pathname: string, status = 308) {
  const destination = request.nextUrl.clone();
  destination.pathname = pathname;
  return NextResponse.redirect(destination, status);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(?:es|en|pt|de|it)\//.test(pathname) && pathname.endsWith(BRIEF_PDF_PATH)) {
    return NextResponse.rewrite(new URL(BRIEF_PDF_PATH, request.url));
  }
  if (pathname === BRIEF_PDF_PATH || /\.[^/]+$/.test(pathname) ||
      /^\/(?:_next|api|images|media)(?:\/|$)/.test(pathname)) return NextResponse.next();

  // Retired locales move directly to equivalent English pages, retaining queries.
  const retired = pathname.match(/^\/(pt|de|it)(\/.*)?$/);
  if (retired) {
    const suffix = (retired[2] || '').replace(/\/$/, '');
    const equivalents: Record<string, string> = {
      '': '', '/hospitality': '', '/plataforma': '/platform',
      '/funcionalidades': '/features', '/operaciones-hoteleras': '/hotel-operations',
      '/industrias': '/industries', '/hospitality/handoff-scan': '/handoff-scan',
    };
    return redirect(request, `/en${equivalents[suffix] ?? suffix}`);
  }

  const legacy: Record<string, string> = {
    '/en/hospitality': '/en',
    '/en/hospitality/handoff-scan': '/en/handoff-scan',
    '/en/plataforma': '/en/platform',
    '/en/industrias': '/en/industries',
    '/demow5': '/es/demo',
    '/what-is-whagons': '/es',
  };
  if (legacy[pathname]) return redirect(request, legacy[pathname]);
  if (/^\/(es|en)(\/|$)/.test(pathname)) return NextResponse.next();

  // Explicit /es and /en URLs never redirect. Only language-less URLs pick a
  // language: saved preference, then device language, then visitor country.
  const lang = detectLanguage(request);
  const response = redirect(request, pathname === '/' ? `/${lang}` : `/${lang}${pathname}`, 307);
  // The redirect depends on these request headers; keep CDN caches per-visitor.
  response.headers.set('Vary', 'Accept-Language, Cookie');
  return response;
}

// Countries where Spanish is the primary language. Used only when the device
// language is neither Spanish nor English.
const SPANISH_COUNTRIES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ', 'GT', 'HN',
  'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE',
]);

function detectLanguage(request: NextRequest): 'es' | 'en' {
  // 1. A language the visitor chose in the nav (cookie set by NavBar, 1 year).
  const saved = request.cookies.get('whagons-lang')?.value;
  if (saved === 'es' || saved === 'en') return saved;

  // 2. Device / browser language, in the order the browser prefers it.
  const accept = request.headers.get('accept-language') || '';
  for (const part of accept.split(',')) {
    const tag = part.split(';')[0].trim().toLowerCase();
    if (!tag) continue;
    if (tag.startsWith('es')) return 'es';
    if (tag.startsWith('en')) return 'en';
  }

  // 3. Visitor country from the CDN (Cloudflare) or reverse proxy.
  const country = (
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country-code') ||
    request.geo?.country ||
    ''
  ).toUpperCase();
  if (country && country !== 'XX' && country !== 'T1') {
    return SPANISH_COUNTRIES.has(country) ? 'es' : 'en';
  }

  // 4. Stable fallback for crawlers and unknown clients.
  return 'es';
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|whagons.svg|images/|media/).*)'],
};
