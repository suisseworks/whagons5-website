import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HandoffScanPage from '../../components/hospitality/HandoffScanPage';

export const metadata: Metadata = {
  title: 'Free 20-Minute Hotel Handoff Leak Scan',
  description:
    'Map one guest issue, maintenance request, room-readiness problem, inspection finding, or shift handoff and receive a one-page hotel handoff score.',
  alternates: { canonical: 'https://whagons.com/en/handoff-scan' },
  openGraph: {
    title: 'Find Where One Hotel Handoff Breaks in 20 Minutes',
    description: 'Score ownership, due time, escalation, proof, and manager visibility.',
    url: 'https://whagons.com/en/handoff-scan',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: '/images/industries/hoteleria.jpg',
      width: 800,
      height: 533,
      alt: 'Hotel guest areas at sunset',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Where One Hotel Handoff Breaks',
    description: 'Score ownership, due time, escalation, proof, and manager visibility in one hotel workflow.',
    images: [{ url: '/images/industries/hoteleria.jpg', alt: 'Hotel guest areas at sunset' }],
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/demo');
  return <HandoffScanPage />;
}
