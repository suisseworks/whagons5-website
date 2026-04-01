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
        languages: {
          es: 'https://whagons.com/es/security',
          en: 'https://whagons.com/en/security',
        },
      },
    },
    en: {
      title: 'Security Policy',
      description:
        'Learn about Whagons approach to security, access control, data protection, monitoring, and incident response.',
      alternates: {
        canonical: 'https://whagons.com/en/security',
        languages: {
          es: 'https://whagons.com/es/security',
          en: 'https://whagons.com/en/security',
        },
      },
    },
  };

  return meta[lang];
}

export default function SecurityPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;

  return <LegalPage lang={lang} content={securityContent[lang]} />;
}
