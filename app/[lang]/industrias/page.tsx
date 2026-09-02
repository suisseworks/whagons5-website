import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
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
      title: 'Software para Hoteles y Otras Industrias',
      description: 'Explora cómo Whagons coordina operaciones en hoteles y se adapta a retail, mantenimiento, sectores regulados, salud, educación y construcción.',
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
        languages: { 'en-US': 'https://whagons.com/en/industries', 'es-419': 'https://whagons.com/es/industrias' },
      },
      openGraph: {
        title: 'Whagons para hotelería y otros mercados operativos',
        description: 'Hotelería es el foco, con flujos configurables para retail, mantenimiento, sectores regulados, salud, educación y construcción.',
        url: 'https://whagons.com/es/industrias',
        locale: 'es_419',
        type: 'website',
        images: ['/images/industries/hoteleria.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Whagons para Hotelería y Otros Mercados',
        description: 'Hotelería es el foco, con flujos configurables para otros equipos operativos.',
        images: ['/images/industries/hoteleria.jpg'],
      },
    },
    en: {
      title: 'Operations Software for Hotels & Other Industries',
      description: 'Explore hotel-first Whagons workflows for hospitality, retail, industrial maintenance, regulated operations, health, education, and construction.',
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
        canonical: 'https://whagons.com/en/industries',
        languages: { 'en-US': 'https://whagons.com/en/industries', 'es-419': 'https://whagons.com/es/industrias' },
      },
      openGraph: {
        title: 'Whagons for Hospitality and Other Operational Markets',
        description: 'Hospitality comes first, with configurable workflows for retail, maintenance, regulated industries, health, education, and construction.',
        url: 'https://whagons.com/en/industries',
        locale: 'en_US',
        type: 'website',
        images: ['/images/industries/hoteleria.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Whagons for Hospitality and Other Markets',
        description: 'Hospitality comes first, with configurable workflows for other operating teams.',
        images: ['/images/industries/hoteleria.jpg'],
      },
    },
  };

  return meta[lang] || meta.es;
}

export default function IndustriasPage({ params }: PageProps) {
  if (params.lang === 'en') redirect('/en/industries');
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  return <IndustriasPageClient lang={lang} />;
}
