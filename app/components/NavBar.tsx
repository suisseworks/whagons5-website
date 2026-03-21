'use client';

import { useState, useCallback, useEffect } from 'react';
import { translations, Language } from '../lib/i18n';
import ThemeToggle, { Theme } from './ThemeToggle';
import { useRouter, usePathname } from 'next/navigation';

interface NavBarProps {
  lang: Language;
}

export default function NavBar({ lang }: NavBarProps) {
  const t = translations[lang];
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const switchLanguage = () => {
    const otherLang = lang === 'es' ? 'en' : 'es';
    const newPath = pathname.replace(`/${lang}`, `/${otherLang}`);
    router.push(newPath);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;

  return (
    <nav>
      <a href={`/${lang}`} className="logo">
        <span className="logo-icon" aria-hidden="true" />
        Whagons
        <span className="logo-ver">5.0.0</span>
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
        <a href={`/${lang}/plataforma`} className="nl" onClick={() => setMenuOpen(false)}>{t.navPlatform}</a>
        <a href={`/${lang}/industrias`} className="nl" onClick={() => setMenuOpen(false)}>{t.navIndustries}</a>
        <a href={`/${lang}/blog`} className="nl" onClick={() => setMenuOpen(false)}>Blog</a>
        <a href="https://whagons5.whagons.com/" className="nl" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>{t.navLogin}</a>
        <a href={`/${lang}/demo`} className="nd" onClick={() => setMenuOpen(false)}>{t.navDemo} &rarr;</a>
        <ThemeToggle onThemeChange={handleThemeChange} />
        <button onClick={switchLanguage} className="lang-btn" aria-label="Switch language">
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
    </nav>
  );
}
