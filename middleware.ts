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
      /^\/(?:_next|api|images)(?:\/|$)/.test(pathname)) return NextResponse.next();

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

  // Stable fallback for visitors and crawlers; explicit language URLs never
  // redirect based on IP, browser language, or user agent.
  if (pathname === '/') return redirect(request, '/es', 307);
  return redirect(request, `/es${pathname}`, 307);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|whagons.svg|images/).*)'],
};
