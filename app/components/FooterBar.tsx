import { Language } from '../lib/i18n';

const footerContent = {
  en: {
    market: 'Hotel operations',
    platform: 'Platform',
    features: 'Features',
    hotels: 'Hotels',
    markets: 'Other markets',
    resources: 'Resources',
    demo: 'Request demo',
    privacy: 'Privacy',
    terms: 'Terms',
    security: 'Security',
    email: 'Email',
    tag: 'Make every hotel handoff visible.',
  },
  es: {
    market: 'Operaciones hoteleras',
    platform: 'Plataforma',
    features: 'Funcionalidades',
    hotels: 'Hoteles',
    markets: 'Otros mercados',
    resources: 'Recursos',
    demo: 'Solicitar demo',
    privacy: 'Privacidad',
    terms: 'Términos',
    security: 'Seguridad',
    email: 'Correo',
    tag: 'Haz visible cada entrega operativa del hotel.',
  },
} as const;

export default function FooterBar({ lang }: { lang: Language }) {
  const t = footerContent[lang];
  const hrefs = lang === 'en'
    ? { home: '/en', platform: '/en/platform', features: '/en/features', hotels: '/en/hotel-operations', markets: '/en/industries', resources: '/en/resources', demo: '/en/demo' }
    : { home: '/es', platform: '/es/plataforma', features: '/es/funcionalidades', hotels: '/es/operaciones-hoteleras', markets: '/es/industrias', resources: '/es/blog', demo: '/es/demo' };

  return (
    <footer id="site-footer" className="hospitality-footer">
      <a href={hrefs.home} className="f-logo" aria-label={`Whagons — ${t.market}`}>
        <div className="f-logo-stack">
          <span className="f-logo-icon" aria-hidden="true" />
          <span className="f-logo-name">Whagons</span>
        </div>
        <span className="logo-market">{t.market}</span>
      </a>
      <div className="f-links" role="navigation" aria-label={lang === 'es' ? 'Enlaces del sitio' : 'Site links'}>
        <a href={hrefs.platform}>{t.platform}</a>
        <a href={hrefs.features}>{t.features}</a>
        <a href={hrefs.hotels}>{t.hotels}</a>
        <a href={hrefs.markets}>{t.markets}</a>
        <a href={hrefs.resources}>{t.resources}</a>
        <a href={hrefs.demo}>{t.demo}</a>
        <a href="mailto:info@whagons.com">{t.email} ↗</a>
        <a href="https://www.linkedin.com/company/whagons/">LinkedIn ↗</a>
        <a href="https://wa.me/50684102321">WhatsApp ↗</a>
        <a href={`/${lang}/privacy`}>{t.privacy}</a>
        <a href={`/${lang}/terms`}>{t.terms}</a>
        <a href={`/${lang}/security`}>{t.security}</a>
      </div>
      <div className="f-tag">{t.tag}</div>
      <div className="f-copy">© 2026 Whagons</div>
    </footer>
  );
}
