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
      title: 'Solicitar Demo — Software de Operaciones Hoteleras',
      description: 'Agenda un demo de Whagons enfocado en un flujo real de tu hotel: huéspedes, habitaciones, mantenimiento, inspecciones o turnos.',
      keywords: [
        'demo software de operaciones hoteleras',
        'plataforma de operaciones para hoteles',
        'software de mantenimiento hotelero',
        'gestión de solicitudes de huéspedes',
      ],
      alternates: {
        canonical: 'https://whagons.com/es/demo',
        languages: { en: 'https://whagons.com/en/demo', es: 'https://whagons.com/es/demo' },
      },
    },
    en: {
      title: 'Request a Demo — Hotel Operations Software',
      description: 'Schedule a Whagons demo focused on one real hotel workflow across guest requests, rooms, maintenance, inspections, or shifts.',
      keywords: [
        'hotel operations software demo',
        'hotel workflow platform demo',
        'hotel maintenance software',
        'guest request management software',
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
