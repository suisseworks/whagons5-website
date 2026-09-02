'use client';

import { Language } from '../lib/i18n';

const footerContent = {
  en: {
    market: 'Hotel operations',
    platform: 'Platform',
    hotels: 'Hotels',
    markets: 'Other markets',
    resources: 'Resources',
    demo: 'Request demo',
    privacy: 'Privacy',
    terms: 'Terms',
    security: 'Security',
    tag: 'Make every hotel handoff visible.',
  },
  es: {
    market: 'Operaciones hoteleras',
    platform: 'Plataforma',
    hotels: 'Hoteles',
    markets: 'Otros mercados',
    resources: 'Recursos',
    demo: 'Solicitar demo',
    privacy: 'Privacidad',
    terms: 'Términos',
    security: 'Seguridad',
    tag: 'Haz visible cada entrega operativa del hotel.',
  },
} as const;

export default function FooterBar({ lang }: { lang: Language }) {
  const t = footerContent[lang];
  const hrefs = lang === 'en'
    ? { home: '/en', platform: '/en/platform', hotels: '/en/hotel-operations', markets: '/en/industries', resources: '/en/resources', demo: '/en/demo' }
    : { home: '/es', platform: '/es/plataforma', hotels: '/es/industrias#hoteleria', markets: '/es/industrias', resources: '/es/blog', demo: '/es/demo' };

  return (
    <footer className="hospitality-footer">
      <a href={hrefs.home} className="f-logo" aria-label={`Whagons — ${t.market}`}>
        <div className="f-logo-stack">
          <span className="f-logo-icon" aria-hidden="true" />
          <span className="f-logo-name">Whagons</span>
        </div>
        <span className="logo-market">{t.market}</span>
      </a>
      <div className="f-links">
        <a href={hrefs.platform}>{t.platform}</a>
        <a href={hrefs.hotels}>{t.hotels}</a>
        <a href={hrefs.markets}>{t.markets}</a>
        <a href={hrefs.resources}>{t.resources}</a>
        <a href={hrefs.demo}>{t.demo}</a>
        <a href="https://www.linkedin.com/company/whagons/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a href="https://wa.me/50684102321" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
        <a href={`/${lang}/privacy`}>{t.privacy}</a>
        <a href={`/${lang}/terms`}>{t.terms}</a>
        <a href={`/${lang}/security`}>{t.security}</a>
      </div>
      <div className="f-tag">{t.tag}</div>
      <div className="f-copy">© 2026 Whagons International</div>
    </footer>
  );
}
