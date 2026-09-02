import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
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
      title: 'Plataforma y Automatización para Hoteles',
      description: 'Conecta solicitudes, mantenimiento, inspecciones y turnos con flujos, responsables, plazos, automatizaciones, evidencia y visibilidad gerencial.',
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
        languages: { 'en-US': 'https://whagons.com/en/platform', 'es-419': 'https://whagons.com/es/plataforma' },
      },
      openGraph: {
        title: 'Plataforma de control para operaciones hoteleras',
        description: 'Coordina responsables, plazos, escalamientos y evidencia sin reemplazar el PMS del hotel.',
        url: 'https://whagons.com/es/plataforma',
        locale: 'es_419',
        type: 'website',
        images: ['/images/industries/hoteleria.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Plataforma de Operaciones Hoteleras | Whagons',
        description: 'Coordina responsables, plazos, escalamientos y evidencia sin reemplazar el PMS.',
        images: ['/images/industries/hoteleria.jpg'],
      },
    },
    en: {
      title: 'Hotel Operations Platform & Workflow Automation',
      description: 'Connect guest requests, maintenance, inspections, and shifts with workflows, owners, due times, automation, evidence, and manager visibility.',
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
        canonical: 'https://whagons.com/en/platform',
        languages: { 'en-US': 'https://whagons.com/en/platform', 'es-419': 'https://whagons.com/es/plataforma' },
      },
      openGraph: {
        title: 'Hotel Workflow Control Platform',
        description: 'Coordinate owners, due times, escalation, and evidence without replacing the hotel PMS.',
        url: 'https://whagons.com/en/platform',
        locale: 'en_US',
        type: 'website',
        images: ['/images/industries/hoteleria.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Hotel Workflow Control Platform | Whagons',
        description: 'Coordinate owners, due times, escalation, and evidence without replacing the PMS.',
        images: ['/images/industries/hoteleria.jpg'],
      },
    },
  };

  return meta[lang] || meta.es;
}

export default function PlatformPage({ params }: PageProps) {
  if (params.lang === 'en') redirect('/en/platform');
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  return <PlatformPageClient lang={lang} />;
}
