import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';
import { Language } from '../../lib/i18n';
import { termsContent } from '../../lib/legal';

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
      title: 'Términos y Condiciones',
      description:
        'Revisa los términos aplicables al uso del sitio web de Whagons y de la plataforma de gestión operativa, automatización e inteligencia artificial.',
      alternates: {
        canonical: 'https://whagons.com/es/terms',
        languages: { en: 'https://whagons.com/en/terms', es: 'https://whagons.com/es/terms' },
      },
    },
    en: {
      title: 'Terms & Conditions',
      description:
        'Review the terms that apply to the U.S. Whagons Hospitality website and the Whagons operations platform offered by Whagons Systems LLC.',
      alternates: {
        canonical: 'https://whagons.com/en/terms',
        languages: { en: 'https://whagons.com/en/terms', es: 'https://whagons.com/es/terms' },
      },
    },
  };

  const selected = meta[lang];
  const title = selected.title as string;
  const description = selected.description as string;
  const url = `https://whagons.com/${lang}/terms`;
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

export default function TermsPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  return <LegalPage lang={lang} content={termsContent[lang]} />;
}
