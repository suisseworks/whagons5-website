'use client';

import { useState, useCallback, useEffect } from 'react';
import { translations, Language } from '../lib/i18n';
import ThemeToggle, { Theme } from './ThemeToggle';
import { useRouter, usePathname } from 'next/navigation';

interface NavBarProps {
  lang: Language;
  blogSlugMap?: Record<string, string>;
}

export default function NavBar({ lang }: NavBarProps) {
  const t = translations[lang];
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const isHospitality = lang === 'en';
  const hospitalityHome = '/en';

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const switchLanguage = () => {
    if (isHospitality) {
      document.cookie = 'whagons-market=latam-es; path=/; max-age=31536000; samesite=lax';
      router.push('/es');
      return;
    }

    document.cookie = 'whagons-market=us-hospitality; path=/; max-age=31536000; samesite=lax';
    router.push('/en');
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (section: string) => pathname.startsWith(`/${lang}/${section}`);

  return (
    <nav className={isHospitality ? 'hospitality-nav' : undefined}>
      <a href={isHospitality ? hospitalityHome : `/${lang}`} className="logo">
        <span className="logo-icon" aria-hidden="true" />
        Whagons
        {isHospitality ? (
          <span className="logo-market">Hospitality</span>
        ) : (
          <span className="logo-ver">5.0.0</span>
        )}
      </a>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
        <span className={`hamburger-line${menuOpen ? ' open' : ''}`} />
      </button>
      <div className={`nav-r${menuOpen ? ' nav-open' : ''}`}>
        {isHospitality ? (
          <>
            <a href="/en/platform" className={`nl${pathname.startsWith('/en/platform') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="/en/hotel-operations" className={`nl${pathname.startsWith('/en/hotel-operations') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>Hotel operations</a>
            <a href="/en/resources" className={`nl${pathname.startsWith('/en/resources') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>Resources</a>
            <a href="https://whagons5.whagons.com/" className="nl" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Log in</a>
            <a href="/en/handoff-scan" className="nd" data-track="nav_scan_click" onClick={() => setMenuOpen(false)}>Request scan &rarr;</a>
            <button onClick={switchLanguage} className="lang-btn market-btn" aria-label="Switch to the Latin America Spanish site">
              LATAM / ES
            </button>
          </>
        ) : (
          <>
            <a href={`/${lang}/plataforma`} className={`nl${isActive('plataforma') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>{t.navPlatform}</a>
            <a href={`/${lang}/industrias`} className={`nl${isActive('industrias') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>{t.navIndustries}</a>
            <a href={`/${lang}/blog`} className={`nl${isActive('blog') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>Blog</a>
            <a href="https://whagons5.whagons.com/" className="nl" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>{t.navLogin}</a>
            <a href={`/${lang}/demo`} className="nd" onClick={() => setMenuOpen(false)}>{t.navDemo} &rarr;</a>
            <ThemeToggle onThemeChange={handleThemeChange} />
            <button onClick={switchLanguage} className="lang-btn" aria-label="Switch language">
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
