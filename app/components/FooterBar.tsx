'use client';

import { translations, Language } from '../lib/i18n';

interface FooterBarProps {
  lang: Language;
}

export default function FooterBar({ lang }: FooterBarProps) {
  const t = translations[lang];
  const isHospitality = lang === 'en';
  const privacyLabel = lang === 'es' ? 'Privacidad' : 'Privacy';
  const termsLabel = lang === 'es' ? 'Términos' : 'Terms';
  const securityLabel = lang === 'es' ? 'Seguridad' : 'Security';

  return (
    <footer className={isHospitality ? 'hospitality-footer' : undefined}>
      <a href={isHospitality ? '/en' : `/${lang}`} className="f-logo" aria-label={isHospitality ? 'Whagons Hospitality' : 'Whagons'}>
        <div className="f-logo-stack">
          <span className="f-logo-icon" aria-hidden="true" />
          <span className="f-logo-name">Whagons</span>
        </div>
        <span className={isHospitality ? 'logo-market' : 'logo-ver'}>{isHospitality ? 'Hospitality' : '5.0.0'}</span>
      </a>
      <div className="f-links">
        {isHospitality ? (
          <>
            <a href="/en/platform">Platform</a>
            <a href="/en/hotel-operations">Hotel operations</a>
            <a href="/en/resources">Resources</a>
            <a href="/en/handoff-scan">Free scan</a>
          </>
        ) : (
          <>
            <a href={`/${lang}/plataforma`}>{t.navPlatform}</a>
            <a href={`/${lang}/industrias`}>{t.navIndustries}</a>
            <a href={`/${lang}/blog`}>Blog</a>
            <a href={`/${lang}/demo`}>{t.navDemo}</a>
          </>
        )}
        <a href={`/${lang}/privacy`}>{privacyLabel}</a>
        <a href={`/${lang}/terms`}>{termsLabel}</a>
        <a href={`/${lang}/security`}>{securityLabel}</a>
      </div>
      <div className="f-tag">{isHospitality ? 'Hotel operations under control. Powered by Whagons.' : t.footerTag}</div>
      <div className="f-copy">{isHospitality ? '\u00A9 2026 Whagons Systems LLC' : t.footerCopy}</div>
    </footer>
  );
}
