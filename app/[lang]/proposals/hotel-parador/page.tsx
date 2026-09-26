import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ParadorOffer from '../../../components/pricing/ParadorOffer';

export const metadata: Metadata = {
  title: 'Hotel Parador · Whagons proposal',
  description: 'A hotel operations proposal prepared for Hotel Parador, Manuel Antonio.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/en/proposals/hotel-parador', languages: { es: '/es/propuestas/hotel-parador', en: '/en/proposals/hotel-parador' } },
  openGraph: { title: 'Hotel Parador · Whagons proposal', description: 'Coordinate housekeeping, maintenance and operational follow-through.', images: [] },
  twitter: { card: 'summary', title: 'Hotel Parador · Whagons proposal', description: 'Coordinate housekeeping, maintenance and operational follow-through.', images: [] },
};
export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang === 'es') redirect('/es/propuestas/hotel-parador');
  return <ParadorOffer lang="en" />;
}
