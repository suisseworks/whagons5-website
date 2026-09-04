import type { Metadata } from 'next';
import { demoOffer } from '../../lib/demo-offer';
import { Language, OPEN_GRAPH_LOCALE, SUPPORTED_LANGS, isLanguage, localizedAlternates } from '../../lib/locales';
import DemoPageClient from './DemoPageClient';

interface PageProps {
  params: { lang: string };
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang: Language = isLanguage(params.lang) ? params.lang : 'es';

  const sharedAlternates = localizedAlternates('/demo');
  const meta: Record<Language, Metadata> = {
    es: {
      title: 'Demo de Software para Operaciones Hoteleras',
      description: 'Agenda un demo de Whagons enfocado en un flujo real de tu hotel: huéspedes, habitaciones, mantenimiento, inspecciones o turnos.',
      keywords: ['demo software de operaciones hoteleras', 'plataforma de operaciones para hoteles', 'software de mantenimiento hotelero', 'gestión de solicitudes de huéspedes'],
      alternates: { canonical: 'https://whagons.com/es/demo', languages: sharedAlternates },
      openGraph: { title: 'Mira Whagons aplicado a la operación de tu hotel', description: 'Agenda un demo alrededor de un flujo real de huéspedes, habitaciones, mantenimiento, inspecciones o turnos.', url: 'https://whagons.com/es/demo', locale: OPEN_GRAPH_LOCALE.es, type: 'website', images: ['/images/industries/hoteleria.jpg'] },
      twitter: { card: 'summary_large_image', title: 'Demo de operaciones hoteleras | Whagons', description: 'Mira Whagons aplicado a un flujo real de tu hotel.', images: ['/images/industries/hoteleria.jpg'] },
    },
    en: {
      title: 'Hotel Operations Software Demo',
      description: 'Schedule a Whagons demo focused on one real hotel workflow across guest requests, rooms, maintenance, inspections, or shifts.',
      keywords: ['hotel operations software demo', 'hotel workflow platform demo', 'hotel maintenance software', 'guest request management software'],
      alternates: { canonical: 'https://whagons.com/en/demo', languages: sharedAlternates },
      openGraph: { title: 'See Whagons Around Your Hotel Operation', description: 'Schedule a demo around one real guest, room, maintenance, inspection, or shift workflow.', url: 'https://whagons.com/en/demo', locale: OPEN_GRAPH_LOCALE.en, type: 'website', images: ['/images/industries/hoteleria.jpg'] },
      twitter: { card: 'summary_large_image', title: 'Hotel Operations Demo | Whagons', description: 'See Whagons applied to one real workflow from your hotel.', images: ['/images/industries/hoteleria.jpg'] },
    },
  };

  const offer = demoOffer[lang];
  return {
    ...meta[lang],
    title: offer.cta,
    description: offer.description,
    openGraph: { ...meta[lang].openGraph, title: offer.cta, description: offer.description },
    twitter: { ...meta[lang].twitter, title: offer.cta, description: offer.description },
  };
}

export default function DemoPage({ params }: PageProps) {
  const lang: Language = isLanguage(params.lang) ? params.lang : 'es';
  return <DemoPageClient lang={lang} />;
}
