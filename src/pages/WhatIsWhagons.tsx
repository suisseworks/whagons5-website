import { Link } from 'react-router-dom';
import { translations, Language } from '../i18n';
import FogEffect from '../components/FogEffect';

interface WhatIsWhagonsProps {
  language: Language;
  toggleLanguage: () => void;
}

export default function WhatIsWhagons({ language, toggleLanguage }: WhatIsWhagonsProps) {
  const t = translations[language];

  return (
    <div className="what-is-whagons-page">
      <div className="what-is-background-image"></div>
      <div className="what-is-overlay"></div>
      <FogEffect intensity="reduced" />
      
      {/* Language Switcher */}
      <button onClick={toggleLanguage} className="language-switcher" aria-label="Switch language">
        {language === 'en' ? 'ES' : 'EN'}
      </button>
      
      <div className="what-is-content">
        <Link to="/" className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {t.backToHome}
        </Link>

        <h1 className="what-is-title">{t.whatIsWhagonsTitle}</h1>
        
        <div className="what-is-bullets">
          {t.whatIsWhagonsBullets.map((bullet, index) => (
            <div key={index} className="bullet-item">
              <div className="bullet-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <p className="bullet-text">{bullet}</p>
            </div>
          ))}
        </div>

        <div className="organic-growth-section">
          <h2 className="organic-growth-title">{t.organicGrowthTitle}</h2>
          <p className="organic-growth-text">{t.organicGrowthText}</p>
        </div>
      </div>
    </div>
  );
}
