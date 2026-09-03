'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Language,
  LANGUAGE_LABELS,
  SUPPORTED_LANGS,
  legalRouteFor,
  routeFor,
  routeKeyFromPath,
} from '../lib/locales';

interface NavBarProps {
  lang: Language;
  blogSlugMap?: Record<string, string>;
}

const navContent = {
  en: {
    market: 'Hotel operations', platform: 'Platform', hotels: 'Hotels', markets: 'Other markets',
    resources: 'Resources', login: 'Log in', demo: 'Request demo', menu: 'Toggle menu',
    closeMenu: 'Close menu', primaryNav: 'Primary navigation', language: 'Choose language',
  },
  es: {
    market: 'Operaciones hoteleras', platform: 'Plataforma', hotels: 'Hoteles', markets: 'Otros mercados',
    resources: 'Recursos', login: 'Iniciar sesión', demo: 'Solicitar demo', menu: 'Abrir o cerrar menú',
    closeMenu: 'Cerrar menú', primaryNav: 'Navegación principal', language: 'Elegir idioma',
  },
  pt: {
    market: 'Operações hoteleiras', platform: 'Plataforma', hotels: 'Hotéis', markets: 'Outros mercados',
    resources: 'Recursos (EN)', login: 'Entrar', demo: 'Solicitar demo', menu: 'Abrir ou fechar menu',
    closeMenu: 'Fechar menu', primaryNav: 'Navegação principal', language: 'Escolher idioma',
  },
  de: {
    market: 'Hotelbetrieb', platform: 'Plattform', hotels: 'Hotels', markets: 'Weitere Märkte',
    resources: 'Ressourcen (EN)', login: 'Anmelden', demo: 'Demo anfordern', menu: 'Menü öffnen oder schließen',
    closeMenu: 'Menü schließen', primaryNav: 'Hauptnavigation', language: 'Sprache auswählen',
  },
  it: {
    market: 'Operazioni alberghiere', platform: 'Piattaforma', hotels: 'Hotel', markets: 'Altri mercati',
    resources: 'Risorse (EN)', login: 'Accedi', demo: 'Richiedi demo', menu: 'Apri o chiudi menu',
    closeMenu: 'Chiudi menu', primaryNav: 'Navigazione principale', language: 'Scegli la lingua',
  },
} as const;

export default function NavBar({ lang, blogSlugMap = {} }: NavBarProps) {
  const t = navContent[lang];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const hrefs = {
    home: routeFor(lang, 'home'),
    platform: routeFor(lang, 'platform'),
    hotels: routeFor(lang, 'hotels'),
    markets: routeFor(lang, 'markets'),
    resources: routeFor(lang, 'resources'),
    demo: routeFor(lang, 'demo'),
  };

  const languageDestination = (nextLang: Language) => {
    const legalMatch = pathname.match(/^\/(?:en|es|pt|de|it)\/(privacy|terms|security)$/);
    if (legalMatch) {
      return legalRouteFor(nextLang, legalMatch[1] as 'privacy' | 'terms' | 'security');
    }

    const isResource = pathname.startsWith('/en/resources') || pathname.startsWith('/es/blog');
    if (isResource) {
      if ((nextLang === 'en' || nextLang === 'es') && blogSlugMap[pathname]) {
        return blogSlugMap[pathname];
      }
      return routeFor(nextLang, 'resources');
    }

    return routeFor(nextLang, routeKeyFromPath(pathname) || 'home');
  };

  const closeMenu = useCallback(() => {
    if (menuOpen) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
    setMenuOpen(false);
  }, [menuOpen]);

  const changeLanguage = (nextLang: Language) => {
    document.cookie = `whagons-lang=${nextLang}; path=/; max-age=31536000; samesite=lax`;
    window.location.assign(languageDestination(nextLang));
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = Array.from(
      menuPanelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), select:not([disabled])') ?? []
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

  const isActive = (href: string) => {
    const pathOnly = href.split('#')[0];
    return pathOnly !== `/${lang}` &&
      (pathname === pathOnly || pathname.startsWith(`${pathOnly}/`));
  };

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
        <label className="language-picker">
          <span className="sr-only">{t.language}</span>
          <select
            className="lang-btn market-btn"
            value={lang}
            onChange={(event) => changeLanguage(event.target.value as Language)}
            aria-label={t.language}
          >
            {SUPPORTED_LANGS.map((language) => (
              <option key={language} value={language}>{LANGUAGE_LABELS[language]}</option>
            ))}
          </select>
        </label>
      </div>
    </nav>
  );
}
