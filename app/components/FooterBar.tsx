'use client';

import { translations, Language } from '../lib/i18n';

interface FooterBarProps {
  lang: Language;
}

export default function FooterBar({ lang }: FooterBarProps) {
  const t = translations[lang];
  const privacyLabel = lang === 'es' ? 'Privacidad' : 'Privacy';
  const termsLabel = lang === 'es' ? 'Términos' : 'Terms';
  const securityLabel = lang === 'es' ? 'Seguridad' : 'Security';

  return (
    <footer>
      <div className="f-logo">Whagons <span className="logo-ver">5.0.0</span></div>
      <div className="f-links">
        <a href={`/${lang}/plataforma`}>{t.navPlatform}</a>
        <a href={`/${lang}/industrias`}>{t.navIndustries}</a>
        <a href={`/${lang}/blog`}>Blog</a>
        <a href={`/${lang}/demo`}>{t.navDemo}</a>
        <a href={`/${lang}/privacy`}>{privacyLabel}</a>
        <a href={`/${lang}/terms`}>{termsLabel}</a>
        <a href={`/${lang}/security`}>{securityLabel}</a>
      </div>
      <div className="f-tag">{t.footerTag}</div>
      <div className="f-copy">{t.footerCopy}</div>
    </footer>
  );
}
