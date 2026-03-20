'use client';

import { useState, useCallback, useEffect } from 'react';
import { translations, Language } from './lib/i18n';
import CustomCursor from './components/CustomCursor';
import ScrollReveal from './components/ScrollReveal';
import ThemeToggle, { Theme } from './components/ThemeToggle';
import FogEffect from './components/FogEffect';
import HeroSection from './components/HeroSection';
import StatementSection from './components/StatementSection';
import CapabilitiesSection from './components/CapabilitiesSection';
import ColorsSection from './components/ColorsSection';
import IndustriesSection from './components/IndustriesSection';
import ProofSection from './components/ProofSection';
import BriefSection from './components/BriefSection';
import DemoSection from './components/DemoSection';
import ContactSection from './components/ContactSection';
import ClosingSection from './components/ClosingSection';

const ACCENT_COLORS = [
  { color: '#D4310A', name: 'Vermillion' },
  { color: '#2D8C3C', name: 'Forest' },
  { color: '#E67E22', name: 'Amber' },
  { color: '#1A6BB5', name: 'Ocean' },
];

export default function Home() {
  const [language, setLanguage] = useState<Language>('es');
  const [theme, setTheme] = useState<Theme>('light');
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].color);

  // Restore accent color from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('whagons-accent');
    if (stored) {
      setAccentColor(stored);
      document.documentElement.style.setProperty('--red', stored);
    }
  }, []);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Random quote and image -- deferred to client to avoid hydration mismatch
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * translations.es.closingQuotes.length));
    setImageIndex(Math.floor(Math.random() * 6));
  }, []);

  const selectAccentColor = useCallback((color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--red', color);
    localStorage.setItem('whagons-accent', color);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  // Dynamic lang attribute for SEO
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <>
      {theme === 'magic' && <CustomCursor />}
      <ScrollReveal />
      {theme === 'magic' && <FogEffect intensity="reduced" />}

      {/* NAV */}
      <nav>
        <a href="/" className="logo">
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
          <a href="#how" className="nl" onClick={() => setMenuOpen(false)}>{t.navPlatform}</a>
          <a href="#industries" className="nl" onClick={() => setMenuOpen(false)}>{t.navIndustries}</a>
          <a href="#brief" className="nl" onClick={() => setMenuOpen(false)}>{t.navBrief}</a>
          <a href="#demo" className="nd" onClick={() => setMenuOpen(false)}>{t.navDemo} &rarr;</a>
          <ThemeToggle onThemeChange={handleThemeChange} />
          <button onClick={toggleLanguage} className="lang-btn" aria-label="Switch language">
            {language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </nav>

      <HeroSection t={t} />
      <StatementSection t={t} />
      <CapabilitiesSection t={t} />
      <ColorsSection
        t={t}
        language={language}
        accentColor={accentColor}
        accentColors={ACCENT_COLORS}
        onSelectColor={selectAccentColor}
      />
      <IndustriesSection t={t} />
      <ProofSection t={t} />
      <BriefSection t={t} language={language} />
      <DemoSection t={t} language={language} />
      <ContactSection t={t} language={language} />
      <ClosingSection t={t} quoteIndex={quoteIndex} imageIndex={imageIndex} />

      {/* FOOTER */}
      <footer>
        <div className="f-logo">Whagons <span className="logo-ver">5.0.0</span></div>
        <div className="f-tag">{t.footerTag}</div>
        <div className="f-copy">{t.footerCopy}</div>
      </footer>
    </>
  );
}
