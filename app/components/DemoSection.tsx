'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

interface DemoSectionProps {
  t: any;
  language: string;
}

export default function DemoSection({ t, language }: DemoSectionProps) {
  const [demoName, setDemoName] = useState('');
  const [demoCompany, setDemoCompany] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoIndustry, setDemoIndustry] = useState('');
  const [demoTeamSize, setDemoTeamSize] = useState('');
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoError, setDemoError] = useState(false);

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
    <section id="demo">
      <div className="demo-top r">
        <div className="demo-title">{t.demoTitle1}<br />{t.demoTitle2}</div>
        <p className="demo-sub">{t.demoSub}</p>
      </div>
      <div className="demo-body">
        <div className="demo-left">
          <div className="r">
            <ul className="demo-perks">
              {t.demoPerks.map((perk: string, i: number) => (
                <li className="demo-perk" key={i}>
                  <span className="dp-n">0{i + 1}</span>
                  <span className="dp-t">{perk}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="demo-preview r d1">
            <Image
              src="/images/whagons-analytics-dashboard.png"
              alt={t.demoPreviewAlt}
              width={1024}
              height={515}
              sizes="(max-width: 860px) 100vw, 50vw"
              className="demo-preview-img"
              priority={false}
            />
          </figure>
        </div>
        <div className="r d2">
          {!demoSuccess ? (
            <form onSubmit={submitDemo}>
              <div className="demo-form-grid">
                <div className="f-line">
                  <label className="f-lbl" htmlFor="d-name">{t.demoNameLabel}</label>
                  <input
                    className="f-inp"
                    id="d-name"
                    type="text"
                    placeholder={t.demoNamePlaceholder}
                    required
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    disabled={demoSubmitting}
                  />
                </div>
                <div className="f-line">
                  <label className="f-lbl" htmlFor="d-company">{t.demoCompanyLabel}</label>
                  <input
                    className="f-inp"
                    id="d-company"
                    type="text"
                    placeholder={t.demoCompanyPlaceholder}
                    required
                    value={demoCompany}
                    onChange={(e) => setDemoCompany(e.target.value)}
                    disabled={demoSubmitting}
                  />
                </div>
                <div className="f-line">
                  <label className="f-lbl" htmlFor="d-email">{t.demoEmailLabel}</label>
                  <input
                    className="f-inp"
                    id="d-email"
                    type="email"
                    placeholder={t.demoEmailPlaceholder}
                    required
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    disabled={demoSubmitting}
                  />
                </div>
                <div className="f-line">
                  <label className="f-lbl" htmlFor="d-phone">{t.demoPhoneLabel}</label>
                  <input
                    className="f-inp"
                    id="d-phone"
                    type="tel"
                    placeholder={t.demoPhonePlaceholder}
                    value={demoPhone}
                    onChange={(e) => setDemoPhone(e.target.value)}
                    disabled={demoSubmitting}
                  />
                </div>
                <div className="f-line span2">
                  <label className="f-lbl" htmlFor="d-industry">{t.demoIndustryLabel}</label>
                  <select
                    className="f-inp"
                    id="d-industry"
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
                <div className="f-line span2">
                  <label className="f-lbl" htmlFor="d-teamsize">{t.demoTeamSizeLabel}</label>
                  <select
                    className="f-inp"
                    id="d-teamsize"
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
              <div className="f-actions" style={{ marginTop: 40 }}>
                <button type="submit" className="btn-black" disabled={demoSubmitting}>
                  {demoSubmitting ? '...' : `${t.demoSubmit} \u2192`}
                </button>
                {demoError ? (
                  <p className="f-note" role="alert">{t.demoError}</p>
                ) : (
                  <p className="f-note">{t.demoNote}</p>
                )}
              </div>
            </form>
          ) : (
            <div className="f-success show" role="status" aria-live="polite">{t.demoSuccess}</div>
          )}
        </div>
      </div>
    </section>
  );
}
