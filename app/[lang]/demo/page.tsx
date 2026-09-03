import type { Metadata } from 'next';
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
    pt: {
      title: 'Demo de Software para Operações Hoteleiras',
      description: 'Agende uma demo do Whagons focada em um fluxo real do seu hotel: hóspedes, quartos, manutenção, inspeções ou turnos.',
      keywords: ['demo software para hotéis', 'software de operações hoteleiras', 'manutenção hoteleira'],
      alternates: { canonical: 'https://whagons.com/pt/demo', languages: sharedAlternates },
      openGraph: { title: 'Veja o Whagons aplicado à operação do seu hotel', description: 'Agende uma demo em torno de um fluxo real do seu hotel.', url: 'https://whagons.com/pt/demo', locale: OPEN_GRAPH_LOCALE.pt, type: 'website', images: ['/images/industries/hoteleria.jpg'] },
      twitter: { card: 'summary_large_image', title: 'Demo de operações hoteleiras | Whagons', description: 'Veja o Whagons aplicado a um fluxo real do seu hotel.', images: ['/images/industries/hoteleria.jpg'] },
    },
    de: {
      title: 'Demo für Software im Hotelbetrieb',
      description: 'Vereinbaren Sie eine Whagons-Demo anhand eines echten Hotelablaufs für Gäste, Zimmer, Wartung, Inspektionen oder Schichten.',
      keywords: ['Demo Software Hotelbetrieb', 'Hotel Operations Software', 'Hotelwartung Software'],
      alternates: { canonical: 'https://whagons.com/de/demo', languages: sharedAlternates },
      openGraph: { title: 'Erleben Sie Whagons in Ihrem Hotelbetrieb', description: 'Vereinbaren Sie eine Demo anhand eines echten Ablaufs Ihres Hotels.', url: 'https://whagons.com/de/demo', locale: OPEN_GRAPH_LOCALE.de, type: 'website', images: ['/images/industries/hoteleria.jpg'] },
      twitter: { card: 'summary_large_image', title: 'Demo für den Hotelbetrieb | Whagons', description: 'Erleben Sie Whagons anhand eines echten Hotelablaufs.', images: ['/images/industries/hoteleria.jpg'] },
    },
    it: {
      title: 'Demo del Software per Operazioni Alberghiere',
      description: 'Prenota una demo Whagons su un flusso reale del tuo hotel: ospiti, camere, manutenzione, ispezioni o turni.',
      keywords: ['demo software per hotel', 'software operazioni alberghiere', 'manutenzione alberghiera'],
      alternates: { canonical: 'https://whagons.com/it/demo', languages: sharedAlternates },
      openGraph: { title: 'Scopri Whagons applicato alle operazioni del tuo hotel', description: 'Prenota una demo su un flusso reale del tuo hotel.', url: 'https://whagons.com/it/demo', locale: OPEN_GRAPH_LOCALE.it, type: 'website', images: ['/images/industries/hoteleria.jpg'] },
      twitter: { card: 'summary_large_image', title: 'Demo per operazioni alberghiere | Whagons', description: 'Scopri Whagons applicato a un flusso reale del tuo hotel.', images: ['/images/industries/hoteleria.jpg'] },
    },
  };

  return meta[lang];
}

export default function DemoPage({ params }: PageProps) {
  const lang: Language = isLanguage(params.lang) ? params.lang : 'es';
  return <DemoPageClient lang={lang} />;
}
