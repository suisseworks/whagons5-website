'use client';

import { useState, FormEvent, useEffect } from 'react';
import { translations, Language } from '../lib/i18n';

interface SignupFormProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

// Auto-detect country from browser
const getCountryFromBrowser = (): string => {
  if (typeof window === 'undefined') return 'Unknown';
  
  try {
    // Try to get country from browser locale
    const locale = navigator.language || (navigator as any).userLanguage;
    const region = new Intl.Locale(locale).region;
    if (region) {
      // Get country name from region code
      return new Intl.DisplayNames(['en'], { type: 'region' }).of(region) || 'Unknown';
    }
  } catch (error) {
    // Fallback to timezone-based detection
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Simple mapping for common timezones (can be expanded)
      const timezoneToCountry: { [key: string]: string } = {
        'America/New_York': 'United States',
        'America/Los_Angeles': 'United States',
        'America/Chicago': 'United States',
        'America/Denver': 'United States',
        'Europe/Madrid': 'Spain',
        'Europe/London': 'United Kingdom',
        'Europe/Paris': 'France',
        'Europe/Berlin': 'Germany',
        'America/Mexico_City': 'Mexico',
        'America/Buenos_Aires': 'Argentina',
        'America/Santiago': 'Chile',
        'America/Bogota': 'Colombia',
      };
      return timezoneToCountry[timezone] || 'Unknown';
    } catch (e) {
      return 'Unknown';
    }
  }
  return 'Unknown';
};

export default function SignupForm({ language, isOpen, onClose }: SignupFormProps) {
  const t = translations[language];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Auto-detect country when form opens
  useEffect(() => {
    if (isOpen && !country) {
      const detectedCountry = getCountryFromBrowser();
      setCountry(detectedCountry);
    }
  }, [isOpen, country]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setStatus('error');
      return;
    }
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }

    if (!company.trim()) {
      setStatus('error');
      return;
    }

    if (!industry) {
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      // Call Next.js API route instead of Zapier
      const response = await fetch('/api/flowdesk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          industry: industry,
          country: country || 'Unknown',
          language: language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setCompany('');
        setIndustry('');
        setCountry('');
        // Close form after 2 seconds
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="signup-form-overlay" onClick={handleOverlayClick}>
      <div className="signup-form-modal">
        <button 
          className="signup-form-close" 
          onClick={onClose}
          aria-label={t.formCancelButton}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="signup-form-content">
          <h2 className="signup-form-title">{t.formTitle}</h2>
          <p className="signup-form-subtitle">{t.formSubtitle}</p>

          {status === 'success' ? (
            <div className="signup-form-success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p>{t.formSuccessMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="signup-form-field">
                <label htmlFor="name" className="signup-form-label">
                  {t.formNameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="signup-form-input"
                  placeholder={t.formNameLabel}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="signup-form-field">
                <label htmlFor="email" className="signup-form-label">
                  {t.formEmailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="signup-form-input"
                  placeholder={t.formEmailLabel}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="signup-form-field">
                <label htmlFor="company" className="signup-form-label">
                  {t.formCompanyLabel}
                </label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="signup-form-input"
                  placeholder={t.formCompanyLabel}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="signup-form-field">
                <label htmlFor="industry" className="signup-form-label">
                  {t.formIndustryLabel}
                </label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="signup-form-select"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">{t.formIndustryPlaceholder}</option>
                  <option value="technology">{t.industries.technology}</option>
                  <option value="healthcare">{t.industries.healthcare}</option>
                  <option value="finance">{t.industries.finance}</option>
                  <option value="education">{t.industries.education}</option>
                  <option value="manufacturing">{t.industries.manufacturing}</option>
                  <option value="retail">{t.industries.retail}</option>
                  <option value="consulting">{t.industries.consulting}</option>
                  <option value="realEstate">{t.industries.realEstate}</option>
                  <option value="construction">{t.industries.construction}</option>
                  <option value="hospitality">{t.industries.hospitality}</option>
                  <option value="media">{t.industries.media}</option>
                  <option value="logistics">{t.industries.logistics}</option>
                  <option value="energy">{t.industries.energy}</option>
                  <option value="legal">{t.industries.legal}</option>
                  <option value="other">{t.industries.other}</option>
                </select>
              </div>

              {status === 'error' && (
                <div className="signup-form-error">
                  {t.formErrorMessage}
                </div>
              )}

              <div className="signup-form-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="signup-form-cancel"
                  disabled={isSubmitting}
                >
                  {t.formCancelButton}
                </button>
                <button
                  type="submit"
                  className="signup-form-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '...' : t.formSubmitButton}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
