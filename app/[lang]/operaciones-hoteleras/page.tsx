import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HotelOperationsPage from '../../components/hospitality/HotelOperationsPage';

export const metadata: Metadata = {
  title: 'Software de Operaciones Hoteleras por Departamento',
  description:
    'Coordina solicitudes de huéspedes, habitaciones, mantenimiento, inspecciones y entregas entre turnos con responsables, plazos, escalamientos y evidencia.',
  keywords: [
    'software de operaciones hoteleras',
    'gestión operativa hotelera',
    'flujo de trabajo hotelero',
    'mantenimiento de hoteles',
    'habitaciones listas',
  ],
  alternates: {
    canonical: 'https://whagons.com/es/operaciones-hoteleras',
    languages: {
      'en-US': 'https://whagons.com/en/hotel-operations',
      'es-419': 'https://whagons.com/es/operaciones-hoteleras',
    },
  },
  openGraph: {
    title: 'Una Capa Operativa para Todos los Departamentos del Hotel',
    description:
      'Haz visible el trabajo entre recepción, ama de llaves, ingeniería, gerencia y cada turno del hotel.',
    url: 'https://whagons.com/es/operaciones-hoteleras',
    locale: 'es_419',
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software de Operaciones Hoteleras | Whagons',
    description:
      'Coordina el trabajo entre recepción, ama de llaves, ingeniería, gerencia y cada turno del hotel.',
    images: ['/images/industries/hoteleria.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'es' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'es') redirect('/en/hotel-operations');
  return <HotelOperationsPage lang="es" />;
}
