'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
    closeMenu: 'Close menu',
    primaryNav: 'Primary navigation',
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
    closeMenu: 'Cerrar menú',
    primaryNav: 'Navegación principal',
    language: 'Switch to English',
  },
} as const;

export default function NavBar({ lang, blogSlugMap = {} }: NavBarProps) {
  const t = navContent[lang];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const hrefs = lang === 'en'
    ? { home: '/en', platform: '/en/platform', hotels: '/en/hotel-operations', markets: '/en/industries', resources: '/en/resources', demo: '/en/demo' }
    : { home: '/es', platform: '/es/plataforma', hotels: '/es/operaciones-hoteleras', markets: '/es/industrias', resources: '/es/blog', demo: '/es/demo' };

  const languageRoutes: Record<string, string> = lang === 'en'
    ? {
        '/en': '/es',
        '/en/platform': '/es/plataforma',
        '/en/features': '/es/funcionalidades',
        '/en/hotel-operations': '/es/operaciones-hoteleras',
        '/en/industries': '/es/industrias',
        '/en/resources': '/es/blog',
        '/en/handoff-scan': '/es/demo',
        '/en/demo': '/es/demo',
      }
    : {
        '/es': '/en',
        '/es/plataforma': '/en/platform',
        '/es/funcionalidades': '/en/features',
        '/es/operaciones-hoteleras': '/en/hotel-operations',
        '/es/industrias': '/en/industries',
        '/es/blog': '/en/resources',
        '/es/demo': '/en/demo',
      };
  const legalMatch = pathname.match(/^\/(?:en|es)\/(privacy|terms|security)$/);
  const articleLibrary = pathname.startsWith('/en/resources/')
    ? '/es/blog'
    : pathname.startsWith('/es/blog/')
      ? '/en/resources'
      : undefined;
  const languageHref = blogSlugMap[pathname]
    || languageRoutes[pathname]
    || articleLibrary
    || (legalMatch ? `/${lang === 'en' ? 'es' : 'en'}/${legalMatch[1]}` : `/${lang === 'en' ? 'es' : 'en'}`);

  const closeMenu = useCallback(() => {
    if (menuOpen) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
    setMenuOpen(false);
  }, [menuOpen]);

  const rememberLanguage = () => {
    document.cookie = `whagons-market=${lang === 'en' ? 'latam-es' : 'global-en'}; path=/; max-age=31536000; samesite=lax`;
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusable = Array.from(
      menuPanelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []
    );
    const focusFrame = window.requestAnimationFrame(() => focusable[0]?.focus());

    const containFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', containFocus);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', containFocus);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeMenu, menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1231px)');
    const closeAtDesktopWidth = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopQuery.addEventListener('change', closeAtDesktopWidth);
    return () => desktopQuery.removeEventListener('change', closeAtDesktopWidth);
  }, []);

  const isActive = (href: string) => pathname === href || (href !== `/${lang}` && pathname.startsWith(href));

  return (
    <nav className="hospitality-nav" aria-label={t.primaryNav}>
      <a href={hrefs.home} onClick={closeMenu} className="logo" aria-label={`Whagons — ${t.market}`}>
        <span className="logo-icon" aria-hidden="true" />
        Whagons
        <span className="logo-market">{t.market}</span>
      </a>
      <button
        className="hamburger"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        ref={menuButtonRef}
        aria-label={t.menu}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
      >
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
      </button>
      <button
        className={`nav-scrim${menuOpen ? ' is-open' : ''}`}
        type="button"
        onClick={closeMenu}
        aria-label={t.closeMenu}
        tabIndex={menuOpen ? 0 : -1}
      />
      <div id="primary-navigation" ref={menuPanelRef} className={`nav-r${menuOpen ? ' nav-open' : ''}`}>
        <a href={hrefs.platform} onClick={closeMenu} aria-current={isActive(hrefs.platform) ? 'page' : undefined} className={`nl${isActive(hrefs.platform) ? ' nl-active' : ''}`}>{t.platform}</a>
        <a href={hrefs.hotels} onClick={closeMenu} aria-current={isActive(hrefs.hotels) ? 'page' : undefined} className={`nl${isActive(hrefs.hotels) ? ' nl-active' : ''}`}>{t.hotels}</a>
        <a href={hrefs.markets} onClick={closeMenu} aria-current={isActive(hrefs.markets) ? 'page' : undefined} className={`nl${isActive(hrefs.markets) ? ' nl-active' : ''}`}>{t.markets}</a>
        <a href={hrefs.resources} onClick={closeMenu} aria-current={isActive(hrefs.resources) ? 'page' : undefined} className={`nl${isActive(hrefs.resources) ? ' nl-active' : ''}`}>{t.resources}</a>
        <a href="https://app.whagons.com/" onClick={closeMenu} className="nl">{t.login}</a>
        <a href={hrefs.demo} onClick={closeMenu} className="nd">{t.demo} <span aria-hidden="true">→</span></a>
        <a
          href={languageHref}
          onClick={() => {
            rememberLanguage();
            closeMenu();
          }}
          className="lang-btn market-btn"
          aria-label={t.language}
        >
          {lang === 'es' ? 'EN' : 'ES'}
        </a>
      </div>
    </nav>
  );
}
