'use client';

import { translations, Language } from '../../lib/i18n';
import ScrollReveal from '../../components/ScrollReveal';
import ProofSection from '../../components/ProofSection';

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

export default function IndustriasPageClient({ lang }: { lang: Language }) {
  const t = translations[lang];

  return (
    <>
      <ScrollReveal />

      <section className="page-hero">
        <div className="page-hero-inner r">
          <h1 className="page-hero-title">{t.indPageTitle}</h1>
          <p className="page-hero-desc">{t.indPageDesc}</p>
        </div>
      </section>

      <section className="industries-detail">
        {t.industries.map((ind: any) => {
          const details = INDUSTRY_DETAILS[ind.slug]?.[lang];
          return (
            <div className="ind-detail-card r" key={ind.num} id={ind.slug}>
              <div className="ind-detail-header">
                <span className="ind-detail-num">{ind.num}</span>
                <h2 className="ind-detail-name">{ind.name}</h2>
              </div>
              <p className="ind-detail-desc">{ind.desc}</p>
              {details && (
                <div className="ind-detail-grid">
                  <div className="ind-detail-col">
                    <h3 className="ind-detail-subtitle">
                      {lang === 'es' ? 'Funcionalidades clave' : 'Key features'}
                    </h3>
                    <ul className="ind-detail-list">
                      {details.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                  <div className="ind-detail-col">
                    <h3 className="ind-detail-subtitle">
                      {lang === 'es' ? 'Casos de uso' : 'Use cases'}
                    </h3>
                    <ul className="ind-detail-list">
                      {details.useCases.map((u, i) => <li key={i}>{u}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <ProofSection t={t} />

      <section className="cta-bottom-section">
        <div className="cta-bottom-inner r">
          <h2 className="cta-bottom-title">{t.indPageCta}</h2>
          <a href={`/${lang}/demo`} className="cta-primary">{t.demoSubmit} &rarr;</a>
        </div>
      </section>
    </>
  );
}
