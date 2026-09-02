'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Language } from '../lib/i18n';

interface NavBarProps {
  lang: Language;
  blogSlugMap?: Record<string, string>;
}

const navContent = {
  en: {
    market: 'Hotel operations',
    platform: 'Platform',
    hotels: 'Hotels',
    markets: 'Other markets',
    resources: 'Resources',
    login: 'Log in',
    demo: 'Request demo',
    menu: 'Toggle menu',
    language: 'Cambiar a español',
  },
  es: {
    market: 'Operaciones hoteleras',
    platform: 'Plataforma',
    hotels: 'Hoteles',
    markets: 'Otros mercados',
    resources: 'Recursos',
    login: 'Iniciar sesión',
    demo: 'Solicitar demo',
    menu: 'Abrir o cerrar menú',
    language: 'Switch to English',
  },
} as const;

export default function NavBar({ lang }: NavBarProps) {
  const t = navContent[lang];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const hrefs = lang === 'en'
    ? { home: '/en', platform: '/en/platform', hotels: '/en/hotel-operations', markets: '/en/industries', resources: '/en/resources', demo: '/en/demo' }
    : { home: '/es', platform: '/es/plataforma', hotels: '/es/industrias#hoteleria', markets: '/es/industrias', resources: '/es/blog', demo: '/es/demo' };

  const languageRoutes: Record<string, string> = lang === 'en'
    ? {
        '/en': '/es',
        '/en/platform': '/es/plataforma',
        '/en/hotel-operations': '/es/industrias#hoteleria',
        '/en/industries': '/es/industrias',
        '/en/resources': '/es/blog',
        '/en/handoff-scan': '/es/demo',
        '/en/demo': '/es/demo',
      }
    : {
        '/es': '/en',
        '/es/plataforma': '/en/platform',
        '/es/industrias': '/en/industries',
        '/es/blog': '/en/resources',
        '/es/demo': '/en/demo',
      };
  const legalMatch = pathname.match(/^\/(?:en|es)\/(privacy|terms|security)$/);
  const languageHref = languageRoutes[pathname]
    || (legalMatch ? `/${lang === 'en' ? 'es' : 'en'}/${legalMatch[1]}` : `/${lang === 'en' ? 'es' : 'en'}`);

  const rememberLanguage = () => {
    document.cookie = `whagons-market=${lang === 'en' ? 'latam-es' : 'global-en'}; path=/; max-age=31536000; samesite=lax`;
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || (href !== `/${lang}` && pathname.startsWith(href));

  return (
    <nav className="hospitality-nav">
      <a href={hrefs.home} className="logo" aria-label={`Whagons — ${t.market}`}>
        <span className="logo-icon" aria-hidden="true" />
        Whagons
        <span className="logo-market">{t.market}</span>
      </a>
      <button
        className="hamburger"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={t.menu}
        aria-expanded={menuOpen}
      >
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
      </button>
      <div className={`nav-r${menuOpen ? ' nav-open' : ''}`}>
        <a href={hrefs.platform} className={`nl${isActive(hrefs.platform) ? ' nl-active' : ''}`}>{t.platform}</a>
        <a href={hrefs.hotels} className={`nl${isActive(lang === 'en' ? '/en/hotel-operations' : '/es/industrias') ? ' nl-active' : ''}`}>{t.hotels}</a>
        <a href={hrefs.markets} className={`nl${isActive(hrefs.markets) ? ' nl-active' : ''}`}>{t.markets}</a>
        <a href={hrefs.resources} className={`nl${isActive(hrefs.resources) ? ' nl-active' : ''}`}>{t.resources}</a>
        <a href="https://app.whagons.com/" className="nl">{t.login}</a>
        <a href={hrefs.demo} className="nd">{t.demo} <span aria-hidden="true">↗</span></a>
        <a href={languageHref} onClick={rememberLanguage} className="lang-btn market-btn" aria-label={t.language}>
          {lang === 'es' ? 'EN' : 'ES'}
        </a>
      </div>
    </nav>
  );
}
