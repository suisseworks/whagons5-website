import type { FeaturesLanguage } from './FeaturesPage';

const content = {
  en: {
    language: 'en-US',
    url: 'https://whagons.com/en/features',
    description: 'Hotel operations software for visible workflows, mobile execution, standards, escalation, evidence, analytics, and integrations.',
    features: ['Hotel workflow control', 'Mobile execution', 'Inspections and corrective actions', 'SOPs at the point of work', 'Operations analytics', 'API and integrations'],
  },
  es: {
    language: 'es-419',
    url: 'https://whagons.com/es/funcionalidades',
    description: 'Software de operaciones hoteleras para flujos visibles, ejecución móvil, estándares, escalamientos, evidencia, analítica e integraciones.',
    features: ['Control de flujos hoteleros', 'Ejecución móvil', 'Inspecciones y acciones correctivas', 'Procedimientos en el punto de trabajo', 'Analítica operativa', 'API e integraciones'],
  },
} as const;

export default function FeaturesStructuredData({ lang }: { lang: FeaturesLanguage }) {
  const copy = content[lang];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': 'https://whagons.com/#software',
    name: 'Whagons',
    url: copy.url,
    inLanguage: copy.language,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: copy.description,
    featureList: copy.features,
    provider: { '@id': 'https://whagons.com/#organization' },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
