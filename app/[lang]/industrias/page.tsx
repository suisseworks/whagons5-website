import type { Metadata } from 'next';
import { translations, Language } from '../../lib/i18n';
import IndustriasPageClient from './IndustriasPageClient';

const SUPPORTED_LANGS = ['es', 'en'] as const;

interface PageProps {
  params: { lang: string };
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  const meta: Record<string, Metadata> = {
    es: {
      title: 'Software de Gestión Operativa por Industria — Hotelería, Retail, Mantenimiento y Más',
      description: 'Descubre cómo el software de gestión operativa Whagons se adapta a hotelería, retail, mantenimiento industrial, farmacéutica, salud, educación y construcción. Soluciones específicas por sector.',
      keywords: [
        'software para hoteles',
        'software para retail',
        'software de mantenimiento preventivo',
        'software para farmacéuticas',
        'software de gestión educativa',
        'software para construcción',
        'gestión operativa por industria',
        'software de operaciones multi-sede',
      ],
      alternates: {
        canonical: 'https://whagons.com/es/industrias',
        languages: { en: 'https://whagons.com/en/industrias', es: 'https://whagons.com/es/industrias' },
      },
    },
    en: {
      title: 'Operations Management Software by Industry — Hospitality, Retail, Maintenance & More',
      description: 'Discover how Whagons operations management software adapts to hospitality, retail, industrial maintenance, pharma, health, education, and construction. Industry-specific solutions.',
      keywords: [
        'hotel management software',
        'retail operations software',
        'preventive maintenance software',
        'pharmaceutical management software',
        'education management software',
        'construction management software',
        'operations management by industry',
        'multi-site operations software',
      ],
      alternates: {
        canonical: 'https://whagons.com/en/industrias',
        languages: { en: 'https://whagons.com/en/industrias', es: 'https://whagons.com/es/industrias' },
      },
    },
  };

  return meta[lang] || meta.es;
}

export default function IndustriasPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  return <IndustriasPageClient lang={lang} />;
}
