'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  CoreRoute,
  Language,
  SUPPORTED_LANGS,
  legalRouteFor,
  routeFor,
  routeKeyFromPath,
} from '../lib/locales';

interface NavBarProps {
  lang: Language;
}

const navContent = {
  en: {
    platform: 'Platform', hotels: 'Hotels', markets: 'Industries', blog: 'Blog', score: 'Hotel Score',
    login: 'Log in', loginShort: 'Log in', demo: 'Request demo', menu: 'Toggle menu', primaryNav: 'Primary navigation',
    language: 'Language', market: 'Hotel operations', skip: 'Skip to content',
  },
  es: {
    platform: 'Plataforma', hotels: 'Hoteles', markets: 'Industrias', blog: 'Blog', score: 'Hotel Score',
    login: 'Iniciar sesión', loginShort: 'Ingresar', demo: 'Solicitar demo', menu: 'Abrir o cerrar menú', primaryNav: 'Navegación principal',
    language: 'Idioma', market: 'Operaciones hoteleras', skip: 'Saltar al contenido',
  },
} as const;

// Single-letter shortcuts, shown as [P] next to each item like a terminal menu.
const ITEMS: { key: string; route: CoreRoute; label: 'platform' | 'hotels' | 'markets' | 'blog' | 'score' }[] = [
  { key: 'P', route: 'platform', label: 'platform' },
  { key: 'H', route: 'hotels', label: 'hotels' },
  { key: 'I', route: 'markets', label: 'markets' },
  { key: 'B', route: 'blog', label: 'blog' },
  { key: 'S', route: 'hotelScore', label: 'score' },
];

const LANG_SHORT: Record<Language, string> = { es: 'ES', en: 'EN' };

export default function NavBar({ lang }: NavBarProps) {
  const t = navContent[lang];
  const pathname = usePathname() || `/${lang}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [hit, setHit] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Partial<Record<Language, string>>>({});
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const hrefFor = (route: CoreRoute) => routeFor(lang, route);

  // Blog posts declare their translation with <link rel="alternate">; the
  // language switch follows it instead of falling back to the blog index.
  useEffect(() => {
    if (routeKeyFromPath(pathname) !== 'blog') {
      setTranslations({});
      return;
    }
    const found: Partial<Record<Language, string>> = {};
    for (const language of SUPPORTED_LANGS) {
      const link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${language}"]`);
      if (link?.href) {
        try { found[language] = new URL(link.href).pathname; } catch { /* ignore malformed */ }
      }
    }
    setTranslations(found);
  }, [pathname]);

  const languageDestination = (nextLang: Language) => {
    if (translations[nextLang]) return translations[nextLang] as string;
    const legalMatch = pathname.match(/^\/(?:en|es)\/(privacy|terms|security)$/);
    if (legalMatch) {
      return legalRouteFor(nextLang, legalMatch[1] as 'privacy' | 'terms' | 'security');
    }
    return routeFor(nextLang, routeKeyFromPath(pathname) || 'home');
  };

  const rememberLanguage = (nextLang: Language) => {
    document.cookie = `whagons-lang=${nextLang}; path=/; max-age=31536000; samesite=lax`;
  };

  const closeMenu = useCallback(() => {
    if (menuOpen) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
    setMenuOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Hide the bar while reading down the page, bring it back on the way up.
  useEffect(() => {
    const root = document.documentElement;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      let state = root.dataset.nav || 'top';
      if (y < 12) state = 'top';
      else if (y > last + 6 && y > 180) state = 'hidden';
      else if (y < last - 6) state = 'shown';
      else if (state === 'top') state = 'shown';
      root.dataset.nav = state;
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Letter shortcuts only fire while nothing is focused, so they never
  // interfere with forms, links or assistive technology.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.repeat) return;
      const active = document.activeElement;
      if (active && active !== document.body && active !== document.documentElement) return;
      const item = ITEMS.find((candidate) => candidate.key.toLowerCase() === event.key.toLowerCase());
      if (!item) return;
      event.preventDefault();
      setHit(item.key);
      window.location.assign(routeFor(lang, item.route));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lang]);

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
    const desktopQuery = window.matchMedia('(min-width: 1181px)');
    const closeAtDesktopWidth = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener('change', closeAtDesktopWidth);
    return () => desktopQuery.removeEventListener('change', closeAtDesktopWidth);
  }, []);

  const isActive = (href: string) =>
    href !== `/${lang}` && (pathname === href || pathname.startsWith(`${href}/`));

  const languageLinks = (
    <span className="lang-switch" role="group" aria-label={t.language}>
      {SUPPORTED_LANGS.map((language, index) => (
        <span key={language}>
          {index > 0 && <span aria-hidden="true">/ </span>}
          <a
            href={languageDestination(language)}
            hrefLang={language}
            lang={language}
            aria-current={language === lang ? 'true' : undefined}
            onClick={() => rememberLanguage(language)}
          >
            {LANG_SHORT[language]}
          </a>
        </span>
      ))}
    </span>
  );

  return (
    <header className={`nav${menuOpen ? ' is-open' : ''}`}>
      <a className="skip-link" href="#main">{t.skip}</a>
      <div className="wrap nav-in">
        <a href={hrefFor('home')} onClick={closeMenu} className="nav-brand" aria-label={`Whagons — ${t.market}`}>
          <span className="logo-icon" aria-hidden="true" />
          <span className="nav-word">Whagons</span>
        </a>
        <nav className="nav-links" aria-label={t.primaryNav}>
          {ITEMS.map((item) => {
            const href = hrefFor(item.route);
            return (
              <a
                key={item.key}
                href={href}
                className={hit === item.key ? 'is-hit' : undefined}
                aria-current={isActive(href) ? 'page' : undefined}
                aria-keyshortcuts={item.key}
              >
                <span className="k" aria-hidden="true">[{item.key}]</span>
                {t[item.label]}
              </a>
            );
          })}
        </nav>
        <div className="nav-cta">
          {languageLinks}
          <a href="https://app.whagons.com/" className="nav-login">{t.loginShort}</a>
          <a href={hrefFor('demo')} className="btn">{t.demo}</a>
        </div>
        <button
          className="nav-burger"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          aria-label={t.menu}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation-panel"
        >
          <i /><i /><i />
        </button>
      </div>
      <div className="nav-panel" id="primary-navigation-panel" ref={menuPanelRef} hidden={!menuOpen}>
        <div className="nav-panel-in">
          {ITEMS.map((item) => {
            const href = hrefFor(item.route);
            return (
              <a key={item.key} href={href} onClick={closeMenu} className="nav-item" aria-current={isActive(href) ? 'page' : undefined}>
                <span className="k" aria-hidden="true">[{item.key}]</span>
                {t[item.label]}
              </a>
            );
          })}
          <div className="nav-panel-foot">
            {languageLinks}
            <a href="https://app.whagons.com/" className="nav-login">{t.login}</a>
            <a href={hrefFor('demo')} onClick={closeMenu} className="btn">{t.demo}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
