'use client';

import Image from 'next/image';
import { translations, Language } from '../../lib/i18n';

const INDUSTRY_IMAGES: Record<string, string> = {
  hoteleria: '/images/industries/hoteleria.jpg',
  retail: '/images/industries/retail.jpg',
  mantenimiento: '/images/industries/mantenimiento.jpg',
  farmaceutica: '/images/industries/farmaceutica.jpg',
  'salud-educacion': '/images/industries/salud-educacion.jpg',
  construccion: '/images/industries/construccion.jpg',
};

const INDUSTRY_DETAILS: Record<string, { es: { features: string[]; useCases: string[] }; en: { features: string[]; useCases: string[] } }> = {
  hoteleria: {
    es: {
      features: ['Gestión de experiencia del huésped', 'Checklists de habitaciones y áreas comunes', 'SLAs de respuesta a solicitudes', 'Mantenimiento preventivo de instalaciones', 'Auditoría de estándares de servicio'],
      useCases: ['Hoteles boutique y cadenas hoteleras', 'Resorts y centros de convenciones', 'Restaurantes y catering', 'Clubes y centros recreativos'],
    },
    en: {
      features: ['Guest experience management', 'Room and common area checklists', 'Request response SLAs', 'Preventive facility maintenance', 'Service standards auditing'],
      useCases: ['Boutique hotels and hotel chains', 'Resorts and convention centers', 'Restaurants and catering', 'Clubs and recreational centers'],
    },
  },
  retail: {
    es: {
      features: ['Operaciones unificadas multi-sede', 'Auditoría de visual merchandising', 'Gestión de inventario y activos', 'Flujos de aprobación centralizados', 'KPIs por tienda en tiempo real'],
      useCases: ['Cadenas de tiendas departamentales', 'Franquicias de comida rápida', 'Supermercados y autoservicios', 'Tiendas de conveniencia'],
    },
    en: {
      features: ['Unified multi-site operations', 'Visual merchandising audits', 'Inventory and asset management', 'Centralized approval workflows', 'Per-store real-time KPIs'],
      useCases: ['Department store chains', 'Fast food franchises', 'Supermarkets and grocery stores', 'Convenience stores'],
    },
  },
  mantenimiento: {
    es: {
      features: ['Mantenimiento preventivo automatizado', 'Órdenes de trabajo inteligentes', 'Gestión de activos con depreciación', 'Inspecciones con escaneo QR', 'Analítica predictiva de fallas'],
      useCases: ['Plantas industriales', 'Flotas de vehículos', 'Edificios comerciales', 'Infraestructura pública'],
    },
    en: {
      features: ['Automated preventive maintenance', 'Smart work orders', 'Asset management with depreciation', 'QR scanning inspections', 'Predictive failure analytics'],
      useCases: ['Industrial plants', 'Vehicle fleets', 'Commercial buildings', 'Public infrastructure'],
    },
  },
  farmaceutica: {
    es: {
      features: ['Trazabilidad de cadena de custodia', 'Control de temperatura y condiciones', 'Cumplimiento de normativas FDA/INVIMA', 'Registros de lote auditables', 'Firmas digitales certificadas'],
      useCases: ['Laboratorios farmacéuticos', 'Plantas de alimentos', 'Distribuidoras de medicamentos', 'Cadenas de frío'],
    },
    en: {
      features: ['Chain of custody traceability', 'Temperature and condition control', 'FDA/regulatory compliance', 'Auditable batch records', 'Certified digital signatures'],
      useCases: ['Pharmaceutical labs', 'Food processing plants', 'Drug distributors', 'Cold chain operations'],
    },
  },
  'salud-educacion': {
    es: {
      features: ['Protocolos de seguridad institucional', 'Gestión de certificaciones del personal', 'Auditoría de cumplimiento normativo', 'Flujos de incidentes y emergencias', 'Reportes para acreditaciones'],
      useCases: ['Colegios y universidades', 'Hospitales y clínicas', 'Centros de cuidado infantil', 'Instituciones de formación técnica'],
    },
    en: {
      features: ['Institutional safety protocols', 'Staff certification management', 'Regulatory compliance auditing', 'Incident and emergency workflows', 'Accreditation reporting'],
      useCases: ['Schools and universities', 'Hospitals and clinics', 'Childcare centers', 'Technical training institutions'],
    },
  },
  construccion: {
    es: {
      features: ['Seguimiento de avance en tiempo real', 'Checklists de seguridad en obra', 'Gestión de subcontratistas', 'Control de calidad de materiales', 'Documentación fotográfica geolocalizada'],
      useCases: ['Desarrollos inmobiliarios', 'Proyectos de infraestructura', 'Remodelaciones comerciales', 'Obras civiles'],
    },
    en: {
      features: ['Real-time progress tracking', 'Construction site safety checklists', 'Subcontractor management', 'Material quality control', 'Geolocated photo documentation'],
      useCases: ['Real estate developments', 'Infrastructure projects', 'Commercial renovations', 'Civil works'],
    },
  },
};

/* Industry names are stored in caps in i18n; render them in sentence case
   so they match the light design system (no uppercase display type). */
function sentenceCase(value: string) {
  const lower = value.toLocaleLowerCase();
  return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function IndustriasPageClient({ lang }: { lang: Language }) {
  const t = translations[lang];
  const otherMarkets = t.industries.filter((industry: any) => industry.slug !== 'hoteleria');
  const eyebrow = lang === 'es' ? 'Industrias' : 'Industries';
  const featuresLabel = lang === 'es' ? 'Funcionalidades clave' : 'Key features';
  const useCasesLabel = lang === 'es' ? 'Casos de uso' : 'Use cases';

  return (
    <main className="pg">
      <section className="pg-hero pg-hero-center">
        <div className="pg-hero-inner">
          <div className="pg-hero-copy">
            <p className="pg-eyebrow">{eyebrow}</p>
            <h1>{t.indPageTitle}</h1>
            <p className="pg-lead">{t.indPageDesc}</p>
          </div>
        </div>
      </section>

      <section className="pg-section pg-industries">
        {otherMarkets.map((ind: any, idx: number) => {
          const details = INDUSTRY_DETAILS[ind.slug]?.[lang];
          const imageSrc = INDUSTRY_IMAGES[ind.slug];
          const isReversed = idx % 2 === 1;
          return (
            <article
              className={`pg-split${isReversed ? ' pg-split-reverse' : ''}`}
              key={ind.num}
              id={ind.slug}
            >
              {imageSrc && (
                <div className="pg-photo">
                  <Image
                    src={imageSrc}
                    alt={ind.name}
                    width={600}
                    height={400}
                    sizes="(max-width: 1000px) 100vw, 560px"
                  />
                </div>
              )}
              <div>
                <span className="pg-num">{String(idx + 1).padStart(2, '0')}</span>
                <h2 style={{ marginTop: 16 }}>{sentenceCase(ind.name)}</h2>
                <p className="pg-text" style={{ marginTop: 14 }}>{ind.desc}</p>
                {details && (
                  <div className="pg-grid-2" style={{ marginTop: 28, gap: 24 }}>
                    <div>
                      <h3 className="pg-small" style={{ marginBottom: 12, fontWeight: 600, color: 'var(--ink)' }}>{featuresLabel}</h3>
                      <ul className="pg-checks">
                        {details.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h3 className="pg-small" style={{ marginBottom: 12, fontWeight: 600, color: 'var(--ink)' }}>{useCasesLabel}</h3>
                      <ul className="pg-checks">
                        {details.useCases.map((u, i) => <li key={i}>{u}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="pg-cta">
        <div>
          <h2>{t.indPageCta}</h2>
          <div className="pg-actions">
            <a href={`/${lang}/demo`} className="pg-btn">{t.demoSubmit}<Arrow /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
