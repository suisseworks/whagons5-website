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
      title: 'Plataforma de Gestión Operativa y Automatización',
      description: 'Coordina plantas, cuadrillas de campo, almacenes, obras y edificios: reportes por voz, QR o NFC, agentes de IA, flujos con responsables y plazos, evidencia, tarjetas KPI y powerups.',
      keywords: [
        'software de gestión operativa',
        'automatización de procesos empresariales',
        'software de control de operaciones',
        'software de servicio en campo',
        'software de mantenimiento preventivo',
        'automatización de flujos de trabajo',
        'software de cumplimiento y auditoría',
        'gestión de activos empresariales',
        'plataforma SLA empresarial',
        'software de gestión de tareas',
      ],
      alternates: {
        canonical: 'https://whagons.com/es/plataforma',
        languages: { en: 'https://whagons.com/en/platform', es: 'https://whagons.com/es/plataforma' },
      },
      openGraph: {
        title: 'La plataforma Whagons: cada equipo conectado',
        description: 'Del primer reporte al trabajo verificado: responsables, plazos, evidencia y visibilidad para cualquier operación, junto a los sistemas que ya usas.',
        url: 'https://whagons.com/es/plataforma',
        locale: 'es_419',
        type: 'website',
        images: ['/images/industries/mantenimiento.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Plataforma de Gestión Operativa | Whagons',
        description: 'Del primer reporte al trabajo verificado, para cualquier operación y junto a los sistemas que ya usas.',
        images: ['/images/industries/mantenimiento.jpg'],
      },
    },
    en: {
      title: 'Operations Management Platform & Workflow Automation',
      description: 'Coordinate plants, field crews, warehouses, sites and buildings: reports by voice, QR or NFC, AI agents, workflows with owners and due times, evidence, KPI cards and powerups.',
      keywords: [
        'operations management software',
        'business process automation',
        'operations control software',
        'field service management software',
        'preventive maintenance software',
        'workflow automation software',
        'compliance and audit software',
        'enterprise asset management',
        'SLA management platform',
        'task management software',
      ],
      alternates: {
        canonical: 'https://whagons.com/en/platform',
        languages: { en: 'https://whagons.com/en/platform', es: 'https://whagons.com/es/plataforma' },
      },
      openGraph: {
        title: 'The Whagons platform: every team connected',
        description: 'From the first report to verified work: owners, due times, evidence and visibility for any operation, next to the systems you already use.',
        url: 'https://whagons.com/en/platform',
        locale: 'en_US',
        type: 'website',
        images: ['/images/industries/mantenimiento.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Operations Management Platform | Whagons',
        description: 'From the first report to verified work, for any operation and next to the systems you already use.',
        images: ['/images/industries/mantenimiento.jpg'],
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
