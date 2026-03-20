'use client';

import { useState, FormEvent } from 'react';

interface BriefSectionProps {
  t: any;
  language: string;
}

export default function BriefSection({ t, language }: BriefSectionProps) {
  const [briefEmail, setBriefEmail] = useState('');
  const [briefIndustry, setBriefIndustry] = useState('');
  const [briefSubmitting, setBriefSubmitting] = useState(false);
  const [briefSuccess, setBriefSuccess] = useState(false);

  const submitBrief = async (e: FormEvent) => {
    e.preventDefault();
    if (!briefEmail || !briefIndustry) return;

    setBriefSubmitting(true);
    try {
      await fetch('/api/flodesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: briefEmail.split('@')[0],
          email: briefEmail.trim(),
          company: '',
          industry: briefIndustry,
          country: 'Unknown',
          language,
          formType: 'brief',
        }),
      });
      setBriefSuccess(true);
    } catch {
      setBriefSuccess(true);
    } finally {
      setBriefSubmitting(false);
    }
  };

  return (
    <section id="brief">
      <div className="brief-top r">
        <div className="brief-title">{t.briefTitle1}<br />{t.briefTitle2}</div>
        <p className="brief-sub">{t.briefSub}</p>
      </div>
      <div className="brief-body">
        <div className="brief-info r">
          <p>{t.briefInfo}</p>
          <ul>
            {t.briefBullets.map((bullet: string, i: number) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
        <div className="r d1">
          {!briefSuccess ? (
            <form onSubmit={submitBrief}>
              <div className="f-line">
                <label className="f-lbl" htmlFor="b-email">{t.briefEmailLabel}</label>
                <input
                  className="f-inp"
                  id="b-email"
                  type="email"
                  placeholder={t.briefEmailPlaceholder}
                  required
                  value={briefEmail}
                  onChange={(e) => setBriefEmail(e.target.value)}
                  disabled={briefSubmitting}
                />
              </div>
              <div className="f-line">
                <label className="f-lbl" htmlFor="b-ind">{t.briefIndustryLabel}</label>
                <select
                  className="f-inp"
                  id="b-ind"
                  required
                  value={briefIndustry}
                  onChange={(e) => setBriefIndustry(e.target.value)}
                  disabled={briefSubmitting}
                >
                  <option value="" disabled>{t.briefIndustryPlaceholder}</option>
                  {t.industryOptions.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="f-actions">
                <button type="submit" className="btn-black" disabled={briefSubmitting}>
                  {briefSubmitting ? '...' : `${t.briefSubmit} \u2192`}
                </button>
                <p className="f-note">{t.briefNote}</p>
              </div>
            </form>
          ) : (
            <div className="f-success show" role="status" aria-live="polite">{t.briefSuccess}</div>
          )}
        </div>
      </div>
    </section>
  );
}
