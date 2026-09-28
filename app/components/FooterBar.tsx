import { Language, legalRouteFor, routeFor } from '../lib/locales';

const footerContent = {
  en: {
    market: 'Hotel operations',
    tag: 'Make every hotel handoff visible: an owner, a due time and proof it was done.',
    award: 'Innovative Product of the Year · Exphore 2017',
    product: 'Product',
    resources: 'Resources',
    contact: 'Contact',
    platform: 'Platform',
    features: 'Features',
    hotels: 'Hospitality',
    markets: 'Industries',
    blog: 'Blog',
    hotelScore: 'Hotel operations assessment',
    demo: 'Request demo',
    login: 'Log in',
    privacy: 'Privacy',
    terms: 'Terms',
    security: 'Security',
    dataRetention: 'Data retention',
    legal: 'Legal',
    siteLinks: 'Site links',
    whatsApp: 'Sales WhatsApp: +506 7071-7099',
  },
  es: {
    market: 'Operaciones hoteleras',
    tag: 'Haz visible cada entrega operativa del hotel: responsable, plazo y evidencia de cierre.',
    award: 'Producto Innovador del Año · Exphore 2017',
    product: 'Producto',
    resources: 'Recursos',
    contact: 'Contacto',
    platform: 'Plataforma',
    features: 'Funcionalidades',
    hotels: 'Hospitalidad',
    markets: 'Industrias',
    blog: 'Blog',
    hotelScore: 'Diagnóstico hotelero',
    demo: 'Solicitar demo',
    login: 'Iniciar sesión',
    privacy: 'Privacidad',
    terms: 'Términos',
    security: 'Seguridad',
    dataRetention: 'Retención de datos',
    legal: 'Legal',
    siteLinks: 'Enlaces del sitio',
    whatsApp: 'WhatsApp de ventas: +506 7071-7099',
  },
} as const;

export default function FooterBar({ lang }: { lang: Language }) {
  const t = footerContent[lang];

  return (
    <footer id="site-footer" className="site-footer">
      <div className="sf-in">
        <div className="sf-brand">
          <a href={routeFor(lang, 'home')} className="f-logo" aria-label={`Whagons — ${t.market}`}>
            <div className="f-logo-stack">
              <span className="f-logo-icon" aria-hidden="true" />
              <span className="f-logo-name">Whagons</span>
            </div>
            <span className="logo-market">{t.market}</span>
          </a>
          <p className="sf-tag">{t.tag}</p>
          <p className="sf-award"><span aria-hidden="true">★</span>{t.award}</p>
        </div>
        <div className="sf-col" role="navigation" aria-label={`${t.siteLinks}: ${t.product}`}>
          <p className="sf-h">{t.product}</p>
          <a href={routeFor(lang, 'platform')}>{t.platform}</a>
          <a href={routeFor(lang, 'features')}>{t.features}</a>
          <a href={routeFor(lang, 'hotels')}>{t.hotels}</a>
          <a href={routeFor(lang, 'markets')}>{t.markets}</a>
        </div>
        <div className="sf-col" role="navigation" aria-label={`${t.siteLinks}: ${t.resources}`}>
          <p className="sf-h">{t.resources}</p>
          <a href={routeFor(lang, 'blog')}>{t.blog}</a>
          <a href={routeFor(lang, 'hotelScore')}>{t.hotelScore}</a>
          <a href={routeFor(lang, 'demo')}>{t.demo}</a>
          <a href="https://app.whagons.com/">{t.login} <span aria-hidden="true">↗</span></a>
        </div>
        <div className="sf-col" role="navigation" aria-label={`${t.siteLinks}: ${t.contact}`}>
          <p className="sf-h">{t.contact}</p>
          <a href="mailto:hello@whagons.com">hello@whagons.com</a>
          <a href="https://wa.me/50670717099" aria-label={t.whatsApp}>WhatsApp +506 7071-7099</a>
          <a href="https://www.linkedin.com/company/whagons/" target="_blank" rel="noreferrer" aria-label="LinkedIn — Whagons">LinkedIn <span aria-hidden="true">↗</span></a>
          <a href="https://www.facebook.com/whagons/" target="_blank" rel="noreferrer" aria-label="Facebook — Whagons">Facebook <span aria-hidden="true">↗</span></a>
          <a href="https://www.instagram.com/whagons/" target="_blank" rel="noreferrer" aria-label="Instagram — Whagons">Instagram <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="sf-bottom">
        <span>© 2026 Whagons</span>
        <div className="sf-legal" role="navigation" aria-label={t.legal}>
          <a href={legalRouteFor(lang, 'privacy')}>{t.privacy}</a>
          <a href={legalRouteFor(lang, 'terms')}>{t.terms}</a>
          <a href={legalRouteFor(lang, 'security')}>{t.security}</a>
          <a href={legalRouteFor(lang, 'data-retention')}>{t.dataRetention}</a>
        </div>
      </div>
    </footer>
  );
}
