export const SUPPORTED_LANGS = ['es', 'en'] as const;

export type Language = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Language = 'es';

export const HTML_LANG: Record<Language, string> = {
  es: 'es-419',
  en: 'en-US',
};

export const OPEN_GRAPH_LOCALE: Record<Language, string> = {
  es: 'es_419',
  en: 'en_US',
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  es: 'Español',
  en: 'English',
};

export const ALTERNATE_LANGUAGES = {
  es: 'https://whagons.com/es',
  en: 'https://whagons.com/en',
  'x-default': 'https://whagons.com/en',
};

export function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGS.some((lang) => lang === value);
}

export function localizedAlternates(path = '') {
  return Object.fromEntries(
    Object.entries(ALTERNATE_LANGUAGES).map(([locale, url]) => [
      locale,
      locale === 'x-default' ? `${url}${path}` : `${url}${path}`,
    ])
  );
}

export type CoreRoute =
  | 'home'
  | 'platform'
  | 'features'
  | 'hotels'
  | 'markets'
  | 'demo';

const FULL_PAGE_ROUTES: Record<'es' | 'en', Record<CoreRoute, string>> = {
  es: {
    home: '/es',
    platform: '/es/plataforma',
    features: '/es/funcionalidades',
    hotels: '/es/operaciones-hoteleras',
    markets: '/es/industrias',
    demo: '/es/demo',
  },
  en: {
    home: '/en',
    platform: '/en/platform',
    features: '/en/features',
    hotels: '/en/hotel-operations',
    markets: '/en/industries',
    demo: '/en/demo',
  },
};

export function routeFor(lang: Language, route: CoreRoute): string {
  return FULL_PAGE_ROUTES[lang][route];
}

export function legalRouteFor(lang: Language, page: 'privacy' | 'terms' | 'security'): string {
  return `/${lang === 'es' ? 'es' : 'en'}/${page}`;
}

export function routeKeyFromPath(pathname: string): CoreRoute | null {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const pathWithoutLanguage = normalized.replace(/^\/(?:es|en)/, '') || '/';

  if (pathWithoutLanguage === '/') return 'home';
  if (pathWithoutLanguage === '/demo' || pathWithoutLanguage === '/handoff-scan') return 'demo';
  if (pathWithoutLanguage === '/platform' || pathWithoutLanguage === '/plataforma') return 'platform';
  if (pathWithoutLanguage === '/features' || pathWithoutLanguage === '/funcionalidades') return 'features';
  if (pathWithoutLanguage === '/hotel-operations' || pathWithoutLanguage === '/operaciones-hoteleras') return 'hotels';
  if (pathWithoutLanguage === '/industries' || pathWithoutLanguage === '/industrias') return 'markets';
  return null;
}
