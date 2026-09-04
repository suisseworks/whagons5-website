import { Language, legalRouteFor, routeFor } from '../lib/locales';

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
  pt: {
    market: 'Operações hoteleiras', platform: 'Plataforma', features: 'Funcionalidades',
    hotels: 'Hotéis', markets: 'Outros mercados', resources: 'Recursos (EN)',
    demo: 'Solicitar demo', privacy: 'Privacidade (EN)', terms: 'Termos (EN)',
    security: 'Segurança (EN)', email: 'E-mail', tag: 'Torne visível cada entrega operacional do hotel.',
  },
  de: {
    market: 'Hotelbetrieb', platform: 'Plattform', features: 'Funktionen',
    hotels: 'Hotels', markets: 'Weitere Märkte', resources: 'Ressourcen (EN)',
    demo: 'Demo anfordern', privacy: 'Datenschutz (EN)', terms: 'Bedingungen (EN)',
    security: 'Sicherheit (EN)', email: 'E-Mail', tag: 'Machen Sie jede operative Hotelübergabe sichtbar.',
  },
  it: {
    market: 'Operazioni alberghiere', platform: 'Piattaforma', features: 'Funzionalità',
    hotels: 'Hotel', markets: 'Altri mercati', resources: 'Risorse (EN)',
    demo: 'Richiedi demo', privacy: 'Privacy (EN)', terms: 'Termini (EN)',
    security: 'Sicurezza (EN)', email: 'E-mail', tag: 'Rendi visibile ogni passaggio operativo dell’hotel.',
  },
} as const;

export default function FooterBar({ lang }: { lang: Language }) {
  const t = footerContent[lang];
  const hrefs = {
    home: routeFor(lang, 'home'),
    platform: routeFor(lang, 'platform'),
    features: routeFor(lang, 'features'),
    hotels: routeFor(lang, 'hotels'),
    markets: routeFor(lang, 'markets'),
    resources: routeFor(lang, 'resources'),
    demo: routeFor(lang, 'demo'),
  };
  const siteLinksLabel: Record<Language, string> = {
    es: 'Enlaces del sitio', en: 'Site links', pt: 'Links do site', de: 'Website-Links', it: 'Link del sito',
  };
  const whatsAppLabel: Record<Language, string> = {
    es: 'WhatsApp de ventas: +506 7071-7099', en: 'Sales WhatsApp: +506 7071-7099',
    pt: 'WhatsApp de vendas: +506 7071-7099', de: 'Vertrieb per WhatsApp: +506 7071-7099',
    it: 'WhatsApp commerciale: +506 7071-7099',
  };

  return (
    <footer id="site-footer" className="hospitality-footer">
      <a href={hrefs.home} className="f-logo" aria-label={`Whagons — ${t.market}`}>
        <div className="f-logo-stack">
          <span className="f-logo-icon" aria-hidden="true" />
          <span className="f-logo-name">Whagons</span>
        </div>
        <span className="logo-market">{t.market}</span>
      </a>
      <div className="f-links" role="navigation" aria-label={siteLinksLabel[lang]}>
        <a href={hrefs.platform}>{t.platform}</a>
        <a href={hrefs.features}>{t.features}</a>
        <a href={hrefs.hotels}>{t.hotels}</a>
        <a href={hrefs.markets}>{t.markets}</a>
        <a href={hrefs.resources}>{t.resources}</a>
        <a href={hrefs.demo}>{t.demo}</a>
        <a href="mailto:hello@whagons.com">{t.email} ↗</a>
        <a
          href="https://www.linkedin.com/company/whagons/"
          className="f-social-link f-social-primary"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn — Whagons"
        >
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://www.facebook.com/whagons/"
          className="f-social-link"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook — Whagons"
        >
          Facebook <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://www.instagram.com/whagons/"
          className="f-social-link"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram — Whagons"
        >
          Instagram <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://wa.me/50670717099"
          aria-label={whatsAppLabel[lang]}
        >
          WhatsApp ↗
        </a>
        <a href={legalRouteFor(lang, 'privacy')}>{t.privacy}</a>
        <a href={legalRouteFor(lang, 'terms')}>{t.terms}</a>
        <a href={legalRouteFor(lang, 'security')}>{t.security}</a>
      </div>
      <div className="f-tag">{t.tag}</div>
      <div className="f-copy">© 2026 Whagons</div>
    </footer>
  );
}
