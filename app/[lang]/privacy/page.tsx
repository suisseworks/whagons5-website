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
      alternates: { canonical: 'https://whagons.com/es/privacy' },
    },
    en: {
      title: 'Privacy Policy',
      description:
        'Learn how Whagons Systems LLC collects, uses, and protects information from the U.S. hospitality website, Hotel Handoff Leak Scan, and operations platform.',
      alternates: { canonical: 'https://whagons.com/en/privacy' },
    },
  };

  return meta[lang];
}

export default function PrivacyPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  return <LegalPage lang={lang} content={privacyContent[lang]} />;
}
