import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';
import { Language } from '../../lib/i18n';
import { privacyContent } from '../../lib/legal';

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
      title: 'Política de Privacidad',
      description:
        'Conoce cómo Whagons recopila, utiliza y protege datos del sitio web, formularios de demo y brief, y de la plataforma de gestión operativa.',
      alternates: {
        canonical: 'https://whagons.com/es/privacy',
        languages: {
          es: 'https://whagons.com/es/privacy',
          en: 'https://whagons.com/en/privacy',
        },
      },
    },
    en: {
      title: 'Privacy Policy',
      description:
        'Learn how Whagons collects, uses, and protects data from the website, demo and brief forms, and the operations management platform.',
      alternates: {
        canonical: 'https://whagons.com/en/privacy',
        languages: {
          es: 'https://whagons.com/es/privacy',
          en: 'https://whagons.com/en/privacy',
        },
      },
    },
  };

  return meta[lang];
}

export default function PrivacyPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  return <LegalPage lang={lang} content={privacyContent[lang]} />;
}
