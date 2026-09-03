export const SUPPORTED_LANGS = ['es', 'en', 'pt', 'de', 'it'] as const;

export type Language = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Language = 'es';

export const HTML_LANG: Record<Language, string> = {
  es: 'es-419',
  en: 'en-US',
  pt: 'pt-BR',
  de: 'de-DE',
  it: 'it-IT',
};

export const OPEN_GRAPH_LOCALE: Record<Language, string> = {
  es: 'es_419',
  en: 'en_US',
  pt: 'pt_BR',
  de: 'de_DE',
  it: 'it_IT',
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  de: 'Deutsch',
  it: 'Italiano',
};

export const ALTERNATE_LANGUAGES = {
  'es-419': 'https://whagons.com/es',
  'en-US': 'https://whagons.com/en',
  'pt-BR': 'https://whagons.com/pt',
  'de-DE': 'https://whagons.com/de',
  'it-IT': 'https://whagons.com/it',
  'x-default': 'https://whagons.com/en',
};

export function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGS.includes(value as Language);
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
  | 'resources'
  | 'demo';

const FULL_PAGE_ROUTES: Record<'es' | 'en', Record<CoreRoute, string>> = {
  es: {
    home: '/es',
    platform: '/es/plataforma',
    features: '/es/funcionalidades',
    hotels: '/es/operaciones-hoteleras',
    markets: '/es/industrias',
    resources: '/es/blog',
    demo: '/es/demo',
  },
  en: {
    home: '/en',
    platform: '/en/platform',
    features: '/en/features',
    hotels: '/en/hotel-operations',
    markets: '/en/industries',
    resources: '/en/resources',
    demo: '/en/demo',
  },
};

const HOME_SECTION_ROUTES: Record<Exclude<Language, 'es' | 'en'>, Record<CoreRoute, string>> = {
  pt: {
    home: '/pt',
    platform: '/pt#how-it-works',
    features: '/pt#features',
    hotels: '/pt#hotel-operations',
    markets: '/pt#markets',
    resources: '/en/resources',
    demo: '/pt/demo',
  },
  de: {
    home: '/de',
    platform: '/de#how-it-works',
    features: '/de#features',
    hotels: '/de#hotel-operations',
    markets: '/de#markets',
    resources: '/en/resources',
    demo: '/de/demo',
  },
  it: {
    home: '/it',
    platform: '/it#how-it-works',
    features: '/it#features',
    hotels: '/it#hotel-operations',
    markets: '/it#markets',
    resources: '/en/resources',
    demo: '/it/demo',
  },
};

export function routeFor(lang: Language, route: CoreRoute): string {
  return lang === 'es' || lang === 'en'
    ? FULL_PAGE_ROUTES[lang][route]
    : HOME_SECTION_ROUTES[lang][route];
}

export function legalRouteFor(lang: Language, page: 'privacy' | 'terms' | 'security'): string {
  return `/${lang === 'es' ? 'es' : 'en'}/${page}`;
}

export function routeKeyFromPath(pathname: string): CoreRoute | null {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const pathWithoutLanguage = normalized.replace(/^\/(?:es|en|pt|de|it)/, '') || '/';

  if (pathWithoutLanguage === '/') return 'home';
  if (pathWithoutLanguage === '/demo' || pathWithoutLanguage === '/handoff-scan') return 'demo';
  if (pathWithoutLanguage === '/platform' || pathWithoutLanguage === '/plataforma') return 'platform';
  if (pathWithoutLanguage === '/features' || pathWithoutLanguage === '/funcionalidades') return 'features';
  if (pathWithoutLanguage === '/hotel-operations' || pathWithoutLanguage === '/operaciones-hoteleras') return 'hotels';
  if (pathWithoutLanguage === '/industries' || pathWithoutLanguage === '/industrias') return 'markets';
  if (pathWithoutLanguage === '/resources' || pathWithoutLanguage === '/blog') return 'resources';
  return null;
}
