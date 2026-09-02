import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';
import { Language } from '../../lib/i18n';
import { securityContent } from '../../lib/legal';

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
      title: 'Política de Seguridad',
      description:
        'Conoce el enfoque de Whagons para seguridad, control de acceso, protección de datos, monitoreo e incident response.',
      alternates: {
        canonical: 'https://whagons.com/es/security',
        languages: { 'en-US': 'https://whagons.com/en/security', 'es-419': 'https://whagons.com/es/security' },
      },
    },
    en: {
      title: 'Security Policy',
      description:
        'Learn about Whagons Systems LLC security practices for the U.S. hospitality website and Whagons operations platform.',
      alternates: {
        canonical: 'https://whagons.com/en/security',
        languages: { 'en-US': 'https://whagons.com/en/security', 'es-419': 'https://whagons.com/es/security' },
      },
    },
  };

  const selected = meta[lang];
  const title = selected.title as string;
  const description = selected.description as string;
  const url = `https://whagons.com/${lang}/security`;
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

export default function SecurityPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  return <LegalPage lang={lang} content={securityContent[lang]} />;
}
