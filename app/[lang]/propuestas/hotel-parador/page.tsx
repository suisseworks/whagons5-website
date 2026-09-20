import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ParadorOffer from '../../../components/pricing/ParadorOffer';

export const metadata: Metadata = {
  title: 'Hotel Parador · Propuesta Whagons',
  description: 'Una propuesta de operaciones hoteleras preparada para Hotel Parador, Manuel Antonio.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/es/propuestas/hotel-parador', languages: { es: '/es/propuestas/hotel-parador', en: '/en/proposals/hotel-parador' } },
  openGraph: { title: 'Hotel Parador · Propuesta Whagons', description: 'Coordinación de limpieza, mantenimiento y seguimiento operativo.', images: [] },
  twitter: { card: 'summary', title: 'Hotel Parador · Propuesta Whagons', description: 'Coordinación de limpieza, mantenimiento y seguimiento operativo.', images: [] },
};
export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang === 'en') redirect('/en/proposals/hotel-parador');
  return <ParadorOffer lang="es" />;
}
