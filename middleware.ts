import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGS = ['es', 'en', 'pt', 'de', 'it'] as const;
type Language = (typeof SUPPORTED_LANGS)[number];
const DEFAULT_LANG = 'es';
const BRIEF_PDF_PATH = '/9af3877fd2b65a3c/whagons-brief-2026.pdf';
const MARKET_COOKIE = 'whagons-market';
const LANGUAGE_COOKIE = 'whagons-lang';
const LATAM_SPANISH_COUNTRIES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT',
  'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE',
]);
const PORTUGUESE_COUNTRIES = new Set(['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL']);
const GERMAN_COUNTRIES = new Set(['DE', 'AT', 'LI']);
const ITALIAN_COUNTRIES = new Set(['IT', 'SM', 'VA']);

function countryCode(request: NextRequest): string {
  return (
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    ''
  ).trim().toUpperCase();
}

function preferredLanguage(request: NextRequest): Language {
  const savedLanguage = request.cookies.get(LANGUAGE_COOKIE)?.value || '';
  if (SUPPORTED_LANGS.includes(savedLanguage as Language)) return savedLanguage as Language;

  const savedMarket = request.cookies.get(MARKET_COOKIE)?.value;
  if (savedMarket === 'us-hospitality') return 'en';
  if (savedMarket === 'latam-es') return 'es';
  if (savedMarket === 'global-en') return 'en';

  const userAgent = request.headers.get('user-agent') || '';
  if (/bot|crawler|spider|slurp/i.test(userAgent)) return 'en';

  const acceptedLanguages = (request.headers.get('accept-language') || '')
    .split(',')
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().toLowerCase().split(';');
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
      const quality = qualityParameter ? Number.parseFloat(qualityParameter.split('=')[1]) : 1;
      return { language: tag.split('-')[0], quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.language && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  const accepted = acceptedLanguages.find((entry) =>
    SUPPORTED_LANGS.includes(entry.language as Language)
  );
  if (accepted) return accepted.language as Language;

  const country = countryCode(request);
  if (PORTUGUESE_COUNTRIES.has(country)) return 'pt';
  if (GERMAN_COUNTRIES.has(country)) return 'de';
  if (ITALIAN_COUNTRIES.has(country)) return 'it';
  if (country === 'US') return 'en';
  if (LATAM_SPANISH_COUNTRIES.has(country)) return 'es';

  return DEFAULT_LANG;
}

function rootDestination(request: NextRequest): string {
  return `/${preferredLanguage(request)}`;
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

function redirectToHomeSection(request: NextRequest, lang: string, hash: string) {
  const destination = request.nextUrl.clone();
  destination.pathname = `/${lang}`;
  destination.hash = hash;
  return NextResponse.redirect(destination, 308);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === BRIEF_PDF_PATH) {
    return NextResponse.next();
  }

  if (SUPPORTED_LANGS.some((lang) => pathname === `/${lang}${BRIEF_PDF_PATH}`)) {
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
    '/en/industrias': '/en/industries',
    '/en/blog': '/en/resources',
  };

  const legacyDestination = legacyEnglishRoutes[pathname];
  if (legacyDestination) {
    return redirectPreservingQuery(request, legacyDestination, 308);
  }

  const legacySpanishArticles: Record<string, string> = {
    '/es/blog/errores-comunes-gestion-operaciones': '/es/blog/errores-en-entregas-operativas-hoteleras',
    '/es/blog/como-automatizar-procesos-empresas': '/es/blog/como-automatizar-un-flujo-operativo-hotelero',
    '/es/blog/como-mejorar-eficiencia-operativa': '/es/blog/visibilidad-operativa-hotelera-tablero-gerencial',
  };
  const legacySpanishArticleDestination = legacySpanishArticles[pathname];
  if (legacySpanishArticleDestination) {
    return redirectPreservingQuery(request, legacySpanishArticleDestination, 308);
  }

  if (pathname.startsWith('/en/blog/')) {
    return redirectPreservingQuery(
      request,
      pathname.replace('/en/blog/', '/en/resources/'),
      308
    );
  }

  // Portuguese, German, and Italian launch as fully localized commercial
  // homepages plus demo pages. Keep direct legacy/deep URLs in the same language
  // instead of allowing their English-only route components to fall back to Spanish.
  const newLocaleMatch = pathname.match(/^\/(pt|de|it)(\/.*)?$/);
  if (newLocaleMatch) {
    const [, lang, suffix = ''] = newLocaleMatch;
    const sectionByPath: Record<string, string> = {
      '/platform': 'how-it-works',
      '/plataforma': 'how-it-works',
      '/features': 'features',
      '/funcionalidades': 'features',
      '/hotel-operations': 'hotel-operations',
      '/operaciones-hoteleras': 'hotel-operations',
      '/industries': 'markets',
      '/industrias': 'markets',
    };
    if (sectionByPath[suffix]) {
      return redirectToHomeSection(request, lang, sectionByPath[suffix]);
    }
    if (suffix === '/hospitality') {
      return redirectPreservingQuery(request, `/${lang}`, 308);
    }
    if (suffix === '/handoff-scan' || suffix === '/hospitality/handoff-scan') {
      return redirectPreservingQuery(request, `/${lang}/demo`, 308);
    }
    if (suffix === '/privacy' || suffix === '/terms' || suffix === '/security') {
      return redirectPreservingQuery(request, `/en${suffix}`, 308);
    }
    if (suffix === '/resources' || suffix === '/blog') {
      return redirectPreservingQuery(request, '/en/resources', 308);
    }
  }

  // Check if pathname already has a supported language prefix
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  if (SUPPORTED_LANGS.includes(firstSegment as Language)) {
    return NextResponse.next();
  }

  // Legacy redirects
  if (pathname === '/demow5') {
    return redirectPreservingQuery(request, `/${DEFAULT_LANG}/demo`, 308);
  }

  if (pathname === '/what-is-whagons') {
    return redirectPreservingQuery(request, `/${DEFAULT_LANG}`, 308);
  }

  // Detect preferred language from Accept-Language header
  if (pathname === '/') {
    return redirectPreservingQuery(request, rootDestination(request));
  }

  const preferredLang = preferredLanguage(request);

  // Redirect to language-prefixed path
  return redirectPreservingQuery(request, `/${preferredLang}${pathname}`);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|whagons.svg|images/).*)'],
};
