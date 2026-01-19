'use client';

import { useState, useEffect } from 'react';
import SignupForm from './components/SignupForm';
import { translations, Language } from './lib/i18n';
import Link from 'next/link';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  useEffect(() => {
    // Set dark mode permanently
    document.documentElement.classList.add('dark');
  }, []);

  const t = translations[language];

  return (
    <div className="app">
      {/* Sun element - light is coming */}
      <div className="sun"></div>
      
      {/* Language Switcher */}
      <button onClick={toggleLanguage} className="language-switcher" aria-label="Switch language">
        {language === 'en' ? 'ES' : 'EN'}
      </button>

      {/* Years Badge - Top Left */}
      <p className="years-badge years-animate">{t.yearsInMarket}</p>

      {/* Hero Section with Mountain */}
      <section className="hero-section">
        <img 
          src="https://images.unsplash.com/photo-1502126324834-38f8e02d7160?auto=format&fit=crop&w=1920&q=80" 
          alt="Person climbing a mountain" 
          className="hero-background-image"
        />
        <div className="hero-content-wrapper">
          <div className="content">
            <h1 className="title-animate">
              {t.title} <span className="brand-number">5</span>
            </h1>
            <div className="hero-badges">
              <p className="launch-date date-animate">{t.launchDate}</p>
            </div>
            <div className="hero-buttons">
              <button 
                onClick={() => setIsFormOpen(true)} 
                className="cta-button button-animate"
              >
                {t.ctaButton}
              </button>
              <Link href="/what-is-whagons" className="what-is-button button-animate">
                {t.whatIsWhagonsButton}
              </Link>
            </div>
          </div>
          <div className="hero-quote-container">
            <p className="hero-motivation-quote">"{t.heroQuote}"</p>
            <p className="hero-motivation-author">— {t.heroQuoteAuthor}</p>
          </div>
          <div className="hero-organic-growth">
            <p className="hero-organic-growth-text">{t.organicGrowthText}</p>
          </div>
        </div>
      </section>
      
      <SignupForm 
        language={language} 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  );
}
