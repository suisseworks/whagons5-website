'use client';

import { useState, useCallback, useEffect } from 'react';
import { translations, Language } from '../lib/i18n';
import { useParams } from 'next/navigation';
import CustomCursor from '../components/CustomCursor';
import ScrollReveal from '../components/ScrollReveal';
import { Theme } from '../components/ThemeToggle';
import FogEffect from '../components/FogEffect';
import HeroSection from '../components/HeroSection';
import StatementSection from '../components/StatementSection';
import CapabilitiesSection from '../components/CapabilitiesSection';
import ColorsSection from '../components/ColorsSection';
import IndustriesSection from '../components/IndustriesSection';
import ProofSection from '../components/ProofSection';
import BriefSection from '../components/BriefSection';
import ContactSection from '../components/ContactSection';
import ClosingSection from '../components/ClosingSection';

const ACCENT_COLORS = [
  { color: '#D4310A', name: 'Vermillion' },
  { color: '#2D8C3C', name: 'Forest' },
  { color: '#E67E22', name: 'Amber' },
  { color: '#1A6BB5', name: 'Ocean' },
];

export default function Home() {
  const params = useParams();
  const lang = (params.lang as Language) || 'es';
  const [theme, setTheme] = useState<Theme>('light');
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].color);

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

  const t = translations[lang];

  return (
    <>
      {theme === 'magic' && <CustomCursor />}
      <ScrollReveal />
      {theme === 'magic' && <FogEffect intensity="reduced" />}

      <HeroSection t={t} lang={lang} />
      <StatementSection t={t} />
      <CapabilitiesSection t={t} lang={lang} />
      <ColorsSection
        t={t}
        language={lang}
        accentColor={accentColor}
        accentColors={ACCENT_COLORS}
        onSelectColor={selectAccentColor}
      />
      <IndustriesSection t={t} lang={lang} />
      <ProofSection t={t} />
      <BriefSection t={t} language={lang} />
      <ContactSection t={t} language={lang} />
      <ClosingSection t={t} quoteIndex={quoteIndex} imageIndex={imageIndex} />
    </>
  );
}
