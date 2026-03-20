import type { Metadata } from 'next';
import { translations, Language } from '../../lib/i18n';
import DemoPageClient from './DemoPageClient';

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
      title: 'Solicitar Demo — Software de Gestión Operativa con IA',
      description: 'Agenda una demostración personalizada del software de gestión operativa Whagons. Te mostramos cómo automatizar procesos empresariales y controlar operaciones con inteligencia artificial.',
      keywords: [
        'demo software de gestión operativa',
        'demostración plataforma de operaciones',
        'probar software de automatización',
        'demo software empresarial con IA',
      ],
      alternates: {
        canonical: 'https://whagons.com/es/demo',
        languages: { en: 'https://whagons.com/en/demo', es: 'https://whagons.com/es/demo' },
      },
    },
    en: {
      title: 'Request a Demo — AI-Powered Operations Management Software',
      description: 'Schedule a personalized demo of Whagons operations management software. We\'ll show you how to automate business processes and control operations with AI.',
      keywords: [
        'operations management software demo',
        'operations platform demonstration',
        'try automation software',
        'AI business software demo',
      ],
      alternates: {
        canonical: 'https://whagons.com/en/demo',
        languages: { en: 'https://whagons.com/en/demo', es: 'https://whagons.com/es/demo' },
      },
    },
  };

  return meta[lang] || meta.es;
}

export default function DemoPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  return <DemoPageClient lang={lang} />;
}
