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
      features: ['Rutinas de apertura y cierre por tienda', 'Inspecciones con evidencia fotográfica', 'Pendientes y responsables por sede'],
      useCases: ['Cadenas de tiendas departamentales', 'Franquicias de comida rápida', 'Supermercados y autoservicios', 'Tiendas de conveniencia'],
    },
    en: {
      features: ['Store opening and closing routines', 'Inspections with photographic evidence', 'Open work and owners by location'],
      useCases: ['Department store chains', 'Fast food franchises', 'Supermarkets and grocery stores', 'Convenience stores'],
    },
  },
  mantenimiento: {
    es: {
      features: ['Rutinas de mantenimiento programadas', 'Órdenes de trabajo con responsable e historial', 'Inspecciones con formularios vinculados por QR'],
      useCases: ['Plantas industriales', 'Flotas de vehículos', 'Edificios comerciales', 'Infraestructura pública'],
    },
    en: {
      features: ['Scheduled maintenance routines', 'Work orders with ownership and history', 'Inspections with QR-linked forms'],
      useCases: ['Industrial plants', 'Vehicle fleets', 'Commercial buildings', 'Public infrastructure'],
    },
  },
  farmaceutica: {
    es: {
      features: ['Registro de controles y observaciones', 'Procedimientos y evidencia de ejecución', 'Seguimiento de hallazgos y acciones correctivas'],
      useCases: ['Laboratorios farmacéuticos', 'Plantas de alimentos', 'Distribuidoras de medicamentos', 'Cadenas de frío'],
    },
    en: {
      features: ['Records of checks and observations', 'Procedures and evidence of completion', 'Findings and corrective-action tracking'],
      useCases: ['Pharmaceutical labs', 'Food processing plants', 'Drug distributors', 'Cold chain operations'],
    },
  },
  'salud-educacion': {
    es: {
      features: ['Inspecciones de instalaciones y áreas comunes', 'Reporte y seguimiento de incidencias', 'Procedimientos disponibles para el equipo'],
      useCases: ['Colegios y universidades', 'Hospitales y clínicas', 'Centros de cuidado infantil', 'Instituciones de formación técnica'],
    },
    en: {
      features: ['Facility and common-area inspections', 'Issue reporting and follow-up', 'Procedures available to the team'],
      useCases: ['Schools and universities', 'Hospitals and clinics', 'Childcare centers', 'Technical training institutions'],
    },
  },
  construccion: {
    es: {
      features: ['Tareas de obra con responsables y plazos', 'Listas de revisión por área o etapa', 'Documentación fotográfica de avances'],
      useCases: ['Desarrollos inmobiliarios', 'Proyectos de infraestructura', 'Remodelaciones comerciales', 'Obras civiles'],
    },
    en: {
      features: ['Site tasks with owners and deadlines', 'Checklists by area or stage', 'Photographic progress records'],
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
  const featuresLabel = lang === 'es' ? 'Flujos que puedes configurar' : 'Workflows you can configure';
  const useCasesLabel = lang === 'es' ? 'Aplicaciones' : 'Applications';

  return (
    <main className="pg">
      <section className="pg-hero pg-hero-center">
        <div className="pg-hero-inner">
          <div className="pg-hero-copy">
            <p className="pg-eyebrow">{eyebrow}</p>
            <h1>{t.indPageTitle}</h1>
            <p className="pg-lead">{t.indPageDesc}</p>
            <div className="industry-jump" aria-label={lang === 'es' ? 'Explorar industrias' : 'Explore industries'}>{otherMarkets.map((industry) => <a href={`#${industry.slug}`} key={industry.slug}>{sentenceCase(industry.name)} <span aria-hidden="true">↗</span></a>)}</div>
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
                      <ul className="industry-applications">
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
