import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';
import { Language } from '../../lib/i18n';
import { dataRetentionContent } from '../../lib/legal';

const SUPPORTED_LANGS = ['es', 'en'] as const;

interface PageProps {
  params: { lang: string };
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  const meta: Record<Language, Metadata> = {
    es: {
      title: 'Política de Retención y Eliminación de Datos',
      description:
        'Controles actuales de retención, plazos propuestos y brechas de eliminación de Whagons Systems LLC, incluidos los datos financieros de Plaid.',
      alternates: {
        canonical: 'https://whagons.com/es/data-retention',
        languages: { en: 'https://whagons.com/en/data-retention', es: 'https://whagons.com/es/data-retention' },
      },
    },
    en: {
      title: 'Data Retention and Disposal Policy',
      description:
        'Current retention controls, proposed schedules and known deletion gaps at Whagons Systems LLC, including financial data received through Plaid.',
      alternates: {
        canonical: 'https://whagons.com/en/data-retention',
        languages: { en: 'https://whagons.com/en/data-retention', es: 'https://whagons.com/es/data-retention' },
      },
    },
  };

  const selected = meta[lang];
  const title = selected.title as string;
  const description = selected.description as string;
  const url = `https://whagons.com/${lang}/data-retention`;
  const imageAlt = lang === 'es' ? 'Áreas de huéspedes de un hotel al atardecer' : 'Hotel guest areas at sunset';

  return {
    ...selected,
    openGraph: {
      title,
      description,
      url,
      locale: lang === 'es' ? 'es_419' : 'en_US',
      type: 'website',
      images: [{ url: '/images/industries/hoteleria.jpg', width: 800, height: 533, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: '/images/industries/hoteleria.jpg', alt: imageAlt }],
    },
  };
}

export default function DataRetentionPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  return <LegalPage lang={lang} content={dataRetentionContent[lang]} />;
}
