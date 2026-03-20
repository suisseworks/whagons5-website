import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGS = ['es', 'en'];
const DEFAULT_LANG = 'es';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths, API routes, static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname === '/whagons.svg' ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
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
  const acceptLang = request.headers.get('accept-language') || '';
  const preferredLang = acceptLang.startsWith('en') ? 'en' : DEFAULT_LANG;

  // Redirect to language-prefixed path
  const newUrl = new URL(`/${preferredLang}${pathname === '/' ? '' : pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|whagons.svg|images/).*)'],
};
