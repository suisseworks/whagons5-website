import { Language, legalRouteFor, routeFor } from '../lib/locales';

const footerContent = {
  en: {
    market: 'Hotel operations',
    tag: 'Make every hotel handoff visible: owner, due time and proof of completion.',
    product: 'Product',
    resources: 'Resources',
    contact: 'Contact',
    platform: 'Platform',
    features: 'Features',
    hotels: 'Hotels',
    markets: 'Industries',
    blog: 'Blog',
    score: 'Hotel Operations Score',
    demo: 'Request demo',
    login: 'Log in',
    email: 'Email',
    privacy: 'Privacy',
    terms: 'Terms',
    security: 'Security',
    whatsApp: 'Sales WhatsApp: +506 7071-7099',
  },
  es: {
    market: 'Operaciones hoteleras',
    tag: 'Haz visible cada entrega operativa del hotel: responsable, plazo y evidencia de cierre.',
    product: 'Producto',
    resources: 'Recursos',
    contact: 'Contacto',
    platform: 'Plataforma',
    features: 'Funcionalidades',
    hotels: 'Hoteles',
    markets: 'Industrias',
    blog: 'Blog',
    score: 'Hotel Operations Score',
    demo: 'Solicitar demo',
    login: 'Iniciar sesión',
    email: 'Correo',
    privacy: 'Privacidad',
    terms: 'Términos',
    security: 'Seguridad',
    whatsApp: 'WhatsApp de ventas: +506 7071-7099',
  },
} as const;

function External() {
  return <span className="ext" aria-hidden="true"> ↗</span>;
}

export default function FooterBar({ lang }: { lang: Language }) {
  const t = footerContent[lang];

  return (
    <footer id="site-footer" className="foot">
      <div className="wrap g12 foot-in">
        <div className="foot-brand">
          <a href={routeFor(lang, 'home')} className="foot-logo" aria-label={`Whagons — ${t.market}`}>
            <span className="logo-icon" aria-hidden="true" />
            <span>whagons</span>
          </a>
          <p className="foot-tag">{t.tag}</p>
          <div className="foot-legal">
            <span>© 2026 Whagons</span>
            <a href={legalRouteFor(lang, 'privacy')}>{t.privacy}</a>
            <a href={legalRouteFor(lang, 'terms')}>{t.terms}</a>
            <a href={legalRouteFor(lang, 'security')}>{t.security}</a>
          </div>
        </div>
        <nav className="foot-col" aria-label={t.product}>
          <div className="lbl">{t.product}</div>
          <ul>
            <li><a href={routeFor(lang, 'platform')}>{t.platform}</a></li>
            <li><a href={routeFor(lang, 'features')}>{t.features}</a></li>
            <li><a href={routeFor(lang, 'hotels')}>{t.hotels}</a></li>
            <li><a href={routeFor(lang, 'markets')}>{t.markets}</a></li>
          </ul>
        </nav>
        <nav className="foot-col" aria-label={t.resources}>
          <div className="lbl">{t.resources}</div>
          <ul>
            <li><a href={routeFor(lang, 'blog')}>{t.blog}</a></li>
            <li><a href={routeFor(lang, 'hotelScore')}>{t.score}</a></li>
            <li><a href={routeFor(lang, 'demo')}>{t.demo}</a></li>
            <li><a href="https://app.whagons.com/">{t.login}<External /></a></li>
          </ul>
        </nav>
        <nav className="foot-col" aria-label={t.contact}>
          <div className="lbl">{t.contact}</div>
          <ul>
            <li><a href="mailto:hello@whagons.com">{t.email}<External /></a></li>
            <li><a href="https://wa.me/50670717099" aria-label={t.whatsApp}>WhatsApp<External /></a></li>
            <li><a href="https://www.linkedin.com/company/whagons/" target="_blank" rel="noreferrer">LinkedIn<External /></a></li>
            <li><a href="https://www.instagram.com/whagons/" target="_blank" rel="noreferrer">Instagram<External /></a></li>
            <li><a href="https://www.facebook.com/whagons/" target="_blank" rel="noreferrer">Facebook<External /></a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
