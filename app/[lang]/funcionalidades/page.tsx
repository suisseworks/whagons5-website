import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import FeaturesPage from '../../components/features/FeaturesPage';
import FeaturesStructuredData from '../../components/features/FeaturesStructuredData';

export const metadata: Metadata = {
  title: 'Funcionalidades para Operaciones Hoteleras',
  description:
    'Explora funcionalidades de Whagons para flujos hoteleros, ejecución móvil, inspecciones, procedimientos, analítica, escalamientos e integraciones.',
  keywords: [
    'funcionalidades software hotelero',
    'gestión de operaciones hoteleras',
    'software de mantenimiento hotelero',
    'software de inspecciones hoteleras',
  ],
  alternates: {
    canonical: 'https://whagons.com/es/funcionalidades',
    languages: {
      'en-US': 'https://whagons.com/en/features',
      'es-419': 'https://whagons.com/es/funcionalidades',
      'x-default': 'https://whagons.com/en/features',
    },
  },
  openGraph: {
    title: 'Funcionalidades para Operaciones Hoteleras | Whagons',
    description:
      'Controla flujos hoteleros desde la primera señal hasta un resultado verificado, con ejecución móvil, estándares, visibilidad e integraciones.',
    url: 'https://whagons.com/es/funcionalidades',
    locale: 'es_419',
    alternateLocale: ['en_US'],
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Funcionalidades para Operaciones Hoteleras | Whagons',
    description: 'Control de flujos, ejecución móvil, estándares, visibilidad e integraciones para equipos hoteleros.',
    images: ['/images/industries/hoteleria.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'es' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'es') redirect('/en/features');
  return (
    <>
      <FeaturesStructuredData lang="es" />
      <FeaturesPage lang="es" />
    </>
  );
}
