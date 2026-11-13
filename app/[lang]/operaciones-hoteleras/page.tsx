import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HotelGroupsPage from '../../components/hospitality/HotelGroupsPage';

const title = 'Software de operaciones para hoteles y grupos hoteleros';
const description =
  'Conecta recepción, ama de llaves, mantenimiento y calidad en cada hotel de tu grupo. Cada solicitud con responsable, cada lugar con historial, cada turno con contexto.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'software de operaciones hoteleras',
    'software para grupos hoteleros',
    'gestión operativa hotelera',
    'mantenimiento de hoteles',
    'ama de llaves',
    'integración con PMS',
  ],
  alternates: {
    canonical: 'https://whagons.com/es/operaciones-hoteleras',
    languages: {
      en: 'https://whagons.com/en/hotel-operations',
      es: 'https://whagons.com/es/operaciones-hoteleras',
    },
  },
  openGraph: {
    title: `${title} | Whagons`,
    description,
    url: 'https://whagons.com/es/operaciones-hoteleras',
    locale: 'es_419',
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | Whagons`,
    description,
    images: ['/images/industries/hoteleria.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'es' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'es') redirect('/en/hotel-operations');
  return <HotelGroupsPage lang="es" />;
}
