'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import Image from 'next/image';
import { demoOffer } from '../lib/demo-offer';
import { isLanguage, legalRouteFor } from '../lib/locales';
import { shotsFor } from '../lib/shots';

interface DemoSectionProps {
  t: any;
  language: string;
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DemoSection({ t, language }: DemoSectionProps) {
  const lang = isLanguage(language) ? language : 'es';
  const shots = shotsFor(lang);
  const offer = demoOffer[lang];
  const [demoName, setDemoName] = useState('');
  const [demoCompany, setDemoCompany] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoWebsite, setDemoWebsite] = useState('');
  const [demoIndustry, setDemoIndustry] = useState('');
  const [demoTeamSize, setDemoTeamSize] = useState('');
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoError, setDemoError] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!demoSuccess || !successRef.current) return;

    successRef.current.focus({ preventScroll: true });
    successRef.current.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [demoSuccess]);

  const submitDemo = async (e: FormEvent) => {
    e.preventDefault();
    const name = demoName.trim();
    const email = demoEmail.trim();
    const company = demoCompany.trim();
    if (!name || !email || !company || !demoIndustry || !demoTeamSize) return;

    setDemoSubmitting(true);
    setDemoError(false);
    try {
      const res = await fetch('/api/flodesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          industry: demoIndustry,
          language,
          formType: 'demo',
          phone: demoPhone.trim(),
          teamSize: demoTeamSize,
          website: demoWebsite,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setDemoSuccess(true);
      } else {
        setDemoError(true);
      }
    } catch {
      setDemoError(true);
    } finally {
      setDemoSubmitting(false);
    }
  };

  return (
    <>
      <section id="demo" className="pg-hero pg-demo-hero">
        <div className="pg-hero-inner pg-hero-split">
          <div className="pg-hero-copy">
            <p className="pg-eyebrow">Demo</p>
            <h1>{offer.title}</h1>
            <p className="pg-lead">{offer.description}</p>
            <ul className="pg-checks">
              {t.demoPerks.map((perk: string, i: number) => (
                <li key={i}>{perk}</li>
              ))}
            </ul>
          </div>

          <div className="pg-panel">
            {!demoSuccess ? (
              <form onSubmit={submitDemo} className="pg-form">
                <p className="pg-text" style={{ fontSize: '0.95rem' }}>{t.demoSub}</p>
                <label className="hp-field" aria-hidden="true">
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={demoWebsite}
                    onChange={(e) => setDemoWebsite(e.target.value)}
                  />
                </label>
                <div className="pg-form-grid">
                  <div className="pg-field">
                    <label htmlFor="d-name">{t.demoNameLabel}</label>
                    <input
                      id="d-name"
                      name="name"
                      autoComplete="name"
                      type="text"
                      placeholder={t.demoNamePlaceholder}
                      required
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      disabled={demoSubmitting}
                    />
                  </div>
                  <div className="pg-field">
                    <label htmlFor="d-company">{t.demoCompanyLabel}</label>
                    <input
                      id="d-company"
                      name="company"
                      autoComplete="organization"
                      type="text"
                      placeholder={t.demoCompanyPlaceholder}
                      required
                      value={demoCompany}
                      onChange={(e) => setDemoCompany(e.target.value)}
                      disabled={demoSubmitting}
                    />
                  </div>
                  <div className="pg-field">
                    <label htmlFor="d-email">{t.demoEmailLabel}</label>
                    <input
                      id="d-email"
                      name="email"
                      autoComplete="email"
                      type="email"
                      placeholder={t.demoEmailPlaceholder}
                      required
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      disabled={demoSubmitting}
                    />
                  </div>
                  <div className="pg-field">
                    <label htmlFor="d-phone">{t.demoPhoneLabel}</label>
                    <input
                      id="d-phone"
                      name="phone"
                      autoComplete="tel"
                      type="tel"
                      placeholder={t.demoPhonePlaceholder}
                      value={demoPhone}
                      onChange={(e) => setDemoPhone(e.target.value)}
                      disabled={demoSubmitting}
                    />
                  </div>
                  <div className="pg-field pg-field-span">
                    <label htmlFor="d-industry">{t.demoIndustryLabel}</label>
                    <select
                      id="d-industry"
                      name="industry"
                      required
                      value={demoIndustry}
                      onChange={(e) => setDemoIndustry(e.target.value)}
                      disabled={demoSubmitting}
                    >
                      <option value="" disabled>{t.briefIndustryPlaceholder}</option>
                      {t.industryOptions.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="pg-field pg-field-span">
                    <label htmlFor="d-teamsize">{t.demoTeamSizeLabel}</label>
                    <select
                      id="d-teamsize"
                      name="teamSize"
                      required
                      value={demoTeamSize}
                      onChange={(e) => setDemoTeamSize(e.target.value)}
                      disabled={demoSubmitting}
                    >
                      <option value="" disabled>{t.briefIndustryPlaceholder}</option>
                      {t.teamSizeOptions.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {demoError && (
                  <p className="pg-alert" role="alert">{t.demoError}</p>
                )}
                <div className="pg-form-actions">
                  <button type="submit" className="pg-btn" disabled={demoSubmitting}>
                    {demoSubmitting ? '...' : t.demoSubmit}
                    {!demoSubmitting && <Arrow />}
                  </button>
                  {!demoError && <p className="pg-note">{t.demoNote}</p>}
                </div>
                <p className="pg-note">
                  {offer.privacy}{' '}
                  <a href={legalRouteFor(lang, 'privacy')}>{offer.privacyLink}</a>
                </p>
              </form>
            ) : (
              <div
                ref={successRef}
                className="pg-success"
                role="status"
                aria-live="polite"
                tabIndex={-1}
              >
                <span className="pg-success-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" role="img">
                    <path d="m6.5 12.5 3.4 3.4 7.6-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="pg-eyebrow" style={{ marginBottom: 6 }}>{t.demoSuccessEyebrow}</p>
                  <p>{t.demoSuccess}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pg-section">
        <figure className="pg-shot">
          <div className="pg-shot-bar" aria-hidden="true"><i /><i /><i /><span>{lang === 'es' ? 'Housekeeping · Whagons' : 'Maintenance board · Whagons'}</span></div>
          <a href={shots.board.src} target="_blank" rel="noopener noreferrer" aria-label={lang === 'es' ? 'Ver tablero completo de Housekeeping' : 'View the full maintenance board'}>
            <Image
              src={shots.boardDetail.src}
              quality={90}
              alt={lang === 'es' ? 'Ejemplo de Housekeeping en Whagons: tareas en revisión y en espera. Datos de demostración.' : 'Whagons maintenance board example: tasks to do, in review and in progress. Demo data.'}
              width={shots.boardDetail.width}
              height={shots.boardDetail.height}
              sizes="(max-width: 1180px) 100vw, 1180px"
              priority={false}
            />
          </a>
          <figcaption>{lang === 'es' ? 'Housekeeping · Datos de demostración · Abre la imagen para ver el tablero completo ↗' : 'Maintenance · Demo data · Open the image to view the full board ↗'}</figcaption>
        </figure>
      </section>
    </>
  );
}
