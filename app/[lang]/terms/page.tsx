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
        languages: {
          es: 'https://whagons.com/es/terms',
          en: 'https://whagons.com/en/terms',
        },
      },
    },
    en: {
      title: 'Terms & Conditions',
      description:
        'Review the terms that apply to using the Whagons website and its operations management, automation, and AI platform.',
      alternates: {
        canonical: 'https://whagons.com/en/terms',
        languages: {
          es: 'https://whagons.com/es/terms',
          en: 'https://whagons.com/en/terms',
        },
      },
    },
  };

  return meta[lang];
}

export default function TermsPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  return <LegalPage lang={lang} content={termsContent[lang]} />;
}
