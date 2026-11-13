import { routeFor, type Language } from './locales.ts';

// hospitality.whagons.com is a second address for the hotel page. It serves
// only that page, in either language; every other page lives on whagons.com.
// The page's canonical URL stays on whagons.com, so search engines keep one copy.
export const MAIN_SITE = 'https://whagons.com';

/** Whether the request arrived on the hospitality subdomain (any domain, so it also works locally). */
export function isHospitalityHost(host: string | null | undefined): boolean {
  return /^hospitality\./i.test((host || '').trim());
}

/**
 * Where a page request on the hospitality subdomain goes.
 * `null`: serve the path as it is (the hotel page). A path: redirect to it on
 * the same host. A full URL: redirect to the main site.
 */
export function hospitalityDestination(pathname: string, detected: Language): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === routeFor('es', 'hotels') || path === routeFor('en', 'hotels')) return null;
  if (path === '/') return routeFor(detected, 'hotels');
  if (path === '/es' || path === '/en') return routeFor(path.slice(1) as Language, 'hotels');
  return `${MAIN_SITE}${path}`;
}
