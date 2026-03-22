'use client';

import { useState, useCallback, useEffect } from 'react';
import { translations, Language } from '../lib/i18n';
import ThemeToggle, { Theme } from './ThemeToggle';
import { useRouter, usePathname } from 'next/navigation';

interface NavBarProps {
  lang: Language;
  blogSlugMap?: Record<string, string>;
}

export default function NavBar({ lang, blogSlugMap }: NavBarProps) {
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

    const blogMatch = pathname.match(/^\/[a-z]{2}\/blog\/(.+)$/);
    if (blogMatch && blogSlugMap) {
      const currentSlug = blogMatch[1];
      const translated = blogSlugMap[`${lang}/${currentSlug}`];
      if (translated) {
        router.push(translated);
        return;
      }
    }

    const newPath = pathname.replace(`/${lang}`, `/${otherLang}`);
    router.push(newPath);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (section: string) => pathname.startsWith(`/${lang}/${section}`);

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
        <a href={`/${lang}/plataforma`} className={`nl${isActive('plataforma') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>{t.navPlatform}</a>
        <a href={`/${lang}/industrias`} className={`nl${isActive('industrias') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>{t.navIndustries}</a>
        <a href={`/${lang}/blog`} className={`nl${isActive('blog') ? ' nl-active' : ''}`} onClick={() => setMenuOpen(false)}>Blog</a>
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
