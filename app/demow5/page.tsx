'use client';

import { useState, FormEvent, useEffect } from 'react';
import { translations, Language } from '../lib/i18n';
import FogEffect from '../components/FogEffect';

// Auto-detect country from browser
const getCountryFromBrowser = (): string => {
  if (typeof window === 'undefined') return 'Unknown';
  
  try {
    const locale = navigator.language || (navigator as any).userLanguage;
    const region = new Intl.Locale(locale).region;
    if (region) {
      return new Intl.DisplayNames(['en'], { type: 'region' }).of(region) || 'Unknown';
    }
  } catch (error) {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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

export default function DemoRequestPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
    if (!country) {
      const detectedCountry = getCountryFromBrowser();
      setCountry(detectedCountry);
    }
  }, [country]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || !email.trim() || !company.trim() || !industry) {
      setStatus('error');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const FLODESK_API_KEY = process.env.NEXT_PUBLIC_FLODESK_API_KEY;
      
      if (!FLODESK_API_KEY) {
        console.error('Flodesk API key not configured');
        setStatus('error');
        setIsSubmitting(false);
        return;
      }

      // Flodesk uses Basic Auth: username = API key, password = blank
      // Encode API key with empty password for Basic auth
      const authHeader = `Basic ${btoa(`${FLODESK_API_KEY}:`)}`;

      // Step 1: Get segment ID by name (same as main page form)
      // Use language-based segments: 'Whagons5-waitlist-ENGLISH' or 'Whagons5-waitlist-ESPANOL'
      const segmentNameEnglish = 'Whagons5-waitlist-ENGLISH';
      const segmentNameSpanish = 'Whagons5-waitlist-ESPANOL';
      const targetSegmentName = language === 'es' ? segmentNameSpanish : segmentNameEnglish;

      const segmentsResponse = await fetch('https://api.flodesk.com/v1/segments', {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      let segmentId = null;
      if (segmentsResponse.ok) {
        const segments = await segmentsResponse.json();
        // Fetch all pages if needed
        let allSegments = segments.data || [];
        let page = 1;
        let hasMore = segments.meta && page < segments.meta.total_pages;

        while (hasMore) {
          const nextPageResponse = await fetch(`https://api.flodesk.com/v1/segments?page=${page + 1}&per_page=50`, {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          });

          if (nextPageResponse.ok) {
            const nextPageData = await nextPageResponse.json();
            if (nextPageData.data && Array.isArray(nextPageData.data)) {
              allSegments = allSegments.concat(nextPageData.data);
              page++;
              hasMore = nextPageData.meta && page < nextPageData.meta.total_pages;
            } else {
              hasMore = false;
            }
          } else {
            hasMore = false;
          }
        }

        const targetSegment = allSegments.find((seg: any) => seg.name === targetSegmentName);
        if (targetSegment) {
          segmentId = targetSegment.id;
        }
      }

      // Step 2: Create or update subscriber with segment (same as main page form)
      const subscriberData: any = {
        email: email.trim(),
        first_name: name.trim().split(' ')[0],
        last_name: name.trim().split(' ').slice(1).join(' ') || '',
        custom_fields: {
          company: company.trim(),
          industry: industry,
          country: country || 'Unknown',
        }
      };

      // Add segment_ids if available (same as main page form)
      if (segmentId) {
        subscriberData.segment_ids = [segmentId];
      }

      const subscriberResponse = await fetch('https://api.flodesk.com/v1/subscribers', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriberData),
      });

      if (!subscriberResponse.ok && subscriberResponse.status !== 409) {
        // 409 means subscriber already exists, which is fine
        const errorText = await subscriberResponse.text().catch(() => 'Unknown error');
        console.error('Flodesk API error:', subscriberResponse.status, errorText);
        throw new Error(`Failed to create subscriber: ${subscriberResponse.status}`);
      }

      setStatus('success');
      setName('');
      setEmail('');
      setCompany('');
      setIndustry('');
      setCountry('');
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = translations[language];

  return (
    <div className="demo-request-page">
      <div className="sun"></div>
      <FogEffect intensity="normal" />
      
      {/* Language Switcher */}
      <button onClick={toggleLanguage} className="language-switcher" aria-label="Switch language">
        {language === 'en' ? 'ES' : 'EN'}
      </button>

      <div className="demo-request-container">
        <div className="demo-request-content">
          <h1 className="demo-request-title">{t.demoRequestTitle}</h1>
          <p className="demo-request-subtitle">{t.demoRequestSubtitle}</p>

          {status === 'success' ? (
            <div className="demo-request-success">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h2>{t.demoRequestSuccessTitle}</h2>
              <p>{t.demoRequestSuccessMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="demo-request-form">
              <div className="demo-request-field">
                <label htmlFor="demo-name" className="demo-request-label">
                  {t.formNameLabel}
                </label>
                <input
                  type="text"
                  id="demo-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="demo-request-input"
                  placeholder={t.formNameLabel}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="demo-request-field">
                <label htmlFor="demo-email" className="demo-request-label">
                  {t.formEmailLabel}
                </label>
                <input
                  type="email"
                  id="demo-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="demo-request-input"
                  placeholder={t.formEmailLabel}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="demo-request-field">
                <label htmlFor="demo-company" className="demo-request-label">
                  {t.formCompanyLabel}
                </label>
                <input
                  type="text"
                  id="demo-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="demo-request-input"
                  placeholder={t.formCompanyLabel}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="demo-request-field">
                <label htmlFor="demo-industry" className="demo-request-label">
                  {t.formIndustryLabel}
                </label>
                <select
                  id="demo-industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="demo-request-select"
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
                <div className="demo-request-error">
                  {t.formErrorMessage}
                </div>
              )}

              <button
                type="submit"
                className="demo-request-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '...' : t.demoRequestSubmitButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
