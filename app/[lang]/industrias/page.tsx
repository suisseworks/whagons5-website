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
      title: 'Software de Operaciones para Retail, Mantenimiento y Más',
      description: 'Coordina responsables, tiempos, escalamientos y evidencia en retail, mantenimiento industrial, sectores regulados, salud, educación y construcción.',
      keywords: [
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
        languages: { en: 'https://whagons.com/en/industries', es: 'https://whagons.com/es/industrias' },
      },
      openGraph: {
        title: 'Whagons para mercados con operaciones complejas',
        description: 'Un estándar operativo claro para retail, mantenimiento, sectores regulados, salud, educación y construcción.',
        url: 'https://whagons.com/es/industrias',
        locale: 'es_419',
        type: 'website',
        images: ['/images/industries/retail.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Whagons para Otros Mercados Operativos',
        description: 'Operaciones complejas coordinadas con responsables, tiempos, escalamientos y evidencia.',
        images: ['/images/industries/retail.jpg'],
      },
    },
    en: {
      title: 'Operations Software for Retail, Maintenance & More',
      description: 'Coordinate ownership, timing, escalation, and evidence across retail, industrial maintenance, regulated sectors, health, education, and construction.',
      keywords: [
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
        languages: { en: 'https://whagons.com/en/industries', es: 'https://whagons.com/es/industrias' },
      },
      openGraph: {
        title: 'Whagons for Complex Operational Markets',
        description: 'One clear operating standard for retail, maintenance, regulated industries, health, education, and construction.',
        url: 'https://whagons.com/en/industries',
        locale: 'en_US',
        type: 'website',
        images: ['/images/industries/retail.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Whagons for Other Operational Markets',
        description: 'Complex operations coordinated through ownership, timing, escalation, and evidence.',
        images: ['/images/industries/retail.jpg'],
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
