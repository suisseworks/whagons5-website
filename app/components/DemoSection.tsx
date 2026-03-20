'use client';

import { useState, FormEvent } from 'react';

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

  const submitDemo = async (e: FormEvent) => {
    e.preventDefault();
    if (!demoName || !demoEmail || !demoIndustry) return;

    setDemoSubmitting(true);
    try {
      await fetch('/api/flodesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: demoName.trim(),
          email: demoEmail.trim(),
          company: demoCompany.trim(),
          industry: demoIndustry,
          country: 'Unknown',
          language,
          formType: 'demo',
          phone: demoPhone.trim(),
          teamSize: demoTeamSize,
        }),
      });
      setDemoSuccess(true);
    } catch {
      setDemoSuccess(true);
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
        <div className="r d1">
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
                    value={demoTeamSize}
                    onChange={(e) => setDemoTeamSize(e.target.value)}
                    disabled={demoSubmitting}
                  >
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
                <p className="f-note">{t.demoNote}</p>
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
