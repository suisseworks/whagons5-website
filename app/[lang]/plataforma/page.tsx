import type { Metadata } from 'next';
import { translations, Language } from '../../lib/i18n';
import PlatformPageClient from './PlatformPageClient';

const SUPPORTED_LANGS = ['es', 'en'] as const;

interface PageProps {
  params: { lang: string };
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const t = translations[lang];

  const meta: Record<string, Metadata> = {
    es: {
      title: 'Software de Gestión Operativa con IA — Módulos y Funcionalidades',
      description: 'Conoce todos los módulos de Whagons: automatización de flujos de trabajo, control de operaciones en tiempo real, gestión de activos, cumplimiento normativo, asistente con inteligencia artificial y más.',
      keywords: [
        'software de gestión operativa',
        'automatización de procesos empresariales',
        'software de control de operaciones',
        'herramienta con inteligencia artificial para empresas',
        'software de mantenimiento preventivo',
        'automatización de flujos de trabajo',
        'software de cumplimiento y auditoría',
        'gestión de activos empresariales',
        'plataforma SLA empresarial',
        'software de gestión de tareas',
      ],
      alternates: {
        canonical: 'https://whagons.com/es/plataforma',
        languages: { en: 'https://whagons.com/en/plataforma', es: 'https://whagons.com/es/plataforma' },
      },
    },
    en: {
      title: 'AI-Powered Operations Management Software — Modules & Features',
      description: 'Explore all Whagons modules: workflow automation, real-time operations control, asset management, compliance, AI business assistant and more.',
      keywords: [
        'operations management software',
        'business process automation',
        'operations control software',
        'AI-powered business tool',
        'preventive maintenance software',
        'workflow automation software',
        'compliance and audit software',
        'enterprise asset management',
        'SLA management platform',
        'task management software',
      ],
      alternates: {
        canonical: 'https://whagons.com/en/plataforma',
        languages: { en: 'https://whagons.com/en/plataforma', es: 'https://whagons.com/es/plataforma' },
      },
    },
  };

  return meta[lang] || meta.es;
}

export default function PlatformPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  return <PlatformPageClient lang={lang} />;
}
