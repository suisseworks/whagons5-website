import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HotelOperationsPage from '../../components/hospitality/HotelOperationsPage';

export const metadata: Metadata = {
  title: 'Hotel Operations Workflows by Department | Whagons Hospitality',
  description:
    'Coordinate guest issues, maintenance, room readiness, inspections, and shift handoffs across front desk, housekeeping, engineering, and hotel operations leaders.',
  keywords: ['hotel department workflow', 'hotel shift handoff', 'hotel maintenance request workflow', 'room readiness workflow'],
  alternates: { canonical: 'https://whagons.com/en/hotel-operations' },
  openGraph: {
    title: 'One Operating Layer Across Hotel Departments',
    description: 'Make work between front desk, housekeeping, engineering, and managers visible.',
    url: 'https://whagons.com/en/hotel-operations',
    locale: 'en_US',
    type: 'website',
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/industrias');
  return <HotelOperationsPage />;
}
