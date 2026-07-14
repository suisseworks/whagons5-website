import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGS = ['es', 'en'];
const DEFAULT_LANG = 'es';
const BRIEF_PDF_PATH = '/9af3877fd2b65a3c/whagons-brief-2026.pdf';
const MARKET_COOKIE = 'whagons-market';
const LATAM_SPANISH_COUNTRIES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT',
  'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE',
]);

function countryCode(request: NextRequest): string {
  return (
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    ''
  ).trim().toUpperCase();
}

function rootDestination(request: NextRequest): string {
  const savedMarket = request.cookies.get(MARKET_COOKIE)?.value;
  if (savedMarket === 'us-hospitality') return '/en';
  if (savedMarket === 'latam-es') return '/es';
  if (savedMarket === 'global-en') return '/en';

  const userAgent = request.headers.get('user-agent') || '';
  if (/bot|crawler|spider|slurp/i.test(userAgent)) return '/en';

  const country = countryCode(request);
  if (country === 'US') return '/en';
  if (LATAM_SPANISH_COUNTRIES.has(country)) return '/es';

  const acceptLang = request.headers.get('accept-language') || '';
  return acceptLang.toLowerCase().startsWith('en') ? '/en' : `/${DEFAULT_LANG}`;
}

function redirectPreservingQuery(request: NextRequest, pathname: string, status = 307) {
  const destination = request.nextUrl.clone();
  destination.pathname = pathname;
  const response = NextResponse.redirect(destination, status);
  response.headers.set(
    'Vary',
    'Accept-Language, User-Agent, Cookie, CF-IPCountry, X-Vercel-IP-Country'
  );
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === BRIEF_PDF_PATH) {
    return NextResponse.next();
  }

  if (pathname === `/en${BRIEF_PDF_PATH}` || pathname === `/es${BRIEF_PDF_PATH}`) {
    return NextResponse.rewrite(new URL(BRIEF_PDF_PATH, request.url));
  }

  // Skip internal paths, API routes, static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.svg' ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  const legacyEnglishRoutes: Record<string, string> = {
    '/en/hospitality': '/en',
    '/en/hospitality/handoff-scan': '/en/handoff-scan',
    '/en/plataforma': '/en/platform',
    '/en/industrias': '/en/hotel-operations',
    '/en/demo': '/en/handoff-scan',
    '/en/blog': '/en/resources',
  };

  const legacyDestination = legacyEnglishRoutes[pathname];
  if (legacyDestination) {
    return redirectPreservingQuery(request, legacyDestination, 308);
  }

  if (pathname.startsWith('/en/blog/')) {
    return redirectPreservingQuery(
      request,
      pathname.replace('/en/blog/', '/en/resources/'),
      308
    );
  }

  // Check if pathname already has a supported language prefix
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  if (SUPPORTED_LANGS.includes(firstSegment)) {
    return NextResponse.next();
  }

  // Legacy redirects
  if (pathname === '/demow5') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANG}/demo`, request.url));
  }
  if (pathname === '/what-is-whagons') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANG}`, request.url));
  }

  // Detect preferred language from Accept-Language header
  if (pathname === '/') {
    return redirectPreservingQuery(request, rootDestination(request));
  }

  const acceptLang = request.headers.get('accept-language') || '';
  const preferredLang = acceptLang.startsWith('en') ? 'en' : DEFAULT_LANG;

  // Redirect to language-prefixed path
  return redirectPreservingQuery(request, `/${preferredLang}${pathname}`);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|whagons.svg|images/).*)'],
};
