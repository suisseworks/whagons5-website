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
      title: 'Demo de Software para Operaciones Hoteleras',
      description: 'Agenda un demo de Whagons enfocado en un flujo real de tu hotel: huéspedes, habitaciones, mantenimiento, inspecciones o turnos.',
      keywords: [
        'demo software de operaciones hoteleras',
        'plataforma de operaciones para hoteles',
        'software de mantenimiento hotelero',
        'gestión de solicitudes de huéspedes',
      ],
      alternates: {
        canonical: 'https://whagons.com/es/demo',
        languages: { 'en-US': 'https://whagons.com/en/demo', 'es-419': 'https://whagons.com/es/demo' },
      },
      openGraph: {
        title: 'Mira Whagons aplicado a la operación de tu hotel',
        description: 'Agenda un demo alrededor de un flujo real de huéspedes, habitaciones, mantenimiento, inspecciones o turnos.',
        url: 'https://whagons.com/es/demo',
        locale: 'es_419',
        type: 'website',
        images: ['/images/industries/hoteleria.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Demo de operaciones hoteleras | Whagons',
        description: 'Mira Whagons aplicado a un flujo real de tu hotel.',
        images: ['/images/industries/hoteleria.jpg'],
      },
    },
    en: {
      title: 'Hotel Operations Software Demo',
      description: 'Schedule a Whagons demo focused on one real hotel workflow across guest requests, rooms, maintenance, inspections, or shifts.',
      keywords: [
        'hotel operations software demo',
        'hotel workflow platform demo',
        'hotel maintenance software',
        'guest request management software',
      ],
      alternates: {
        canonical: 'https://whagons.com/en/demo',
        languages: { 'en-US': 'https://whagons.com/en/demo', 'es-419': 'https://whagons.com/es/demo' },
      },
      openGraph: {
        title: 'See Whagons Around Your Hotel Operation',
        description: 'Schedule a demo around one real guest, room, maintenance, inspection, or shift workflow.',
        url: 'https://whagons.com/en/demo',
        locale: 'en_US',
        type: 'website',
        images: ['/images/industries/hoteleria.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Hotel Operations Demo | Whagons',
        description: 'See Whagons applied to one real workflow from your hotel.',
        images: ['/images/industries/hoteleria.jpg'],
      },
    },
  };

  return meta[lang] || meta.es;
}

export default function DemoPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  return <DemoPageClient lang={lang} />;
}
