import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HotelGroupsPage from '../../components/hospitality/HotelGroupsPage';

const title = 'Operations software for hotels and hotel groups';
const description =
  'Connect front desk, housekeeping, maintenance and quality in every hotel in your group. Every request with an owner, every place with a history, every shift with context.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'hotel operations software',
    'software for hotel groups',
    'hotel operations management',
    'hotel maintenance',
    'housekeeping',
    'PMS integration',
  ],
  alternates: {
    canonical: 'https://whagons.com/en/hotel-operations',
    languages: {
      en: 'https://whagons.com/en/hotel-operations',
      es: 'https://whagons.com/es/operaciones-hoteleras',
    },
  },
  openGraph: {
    title: `${title} | Whagons`,
    description,
    url: 'https://whagons.com/en/hotel-operations',
    locale: 'en_US',
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
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/operaciones-hoteleras');
  return <HotelGroupsPage lang="en" />;
}
