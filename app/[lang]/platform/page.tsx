import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HospitalityPlatformPage from '../../components/hospitality/HospitalityPlatformPage';

export const metadata: Metadata = {
  title: 'Hotel Workflow Control Platform | Whagons Hospitality',
  description:
    'Control hotel handoffs with visible ownership, due times, escalation, completion proof, and manager review without replacing the property management system.',
  keywords: ['hotel operations software', 'hotel workflow software', 'hotel handoff management', 'hotel task escalation'],
  alternates: { canonical: 'https://whagons.com/en/platform' },
  openGraph: {
    title: 'Whagons Hospitality Hotel Workflow Control Platform',
    description: 'Make selected hotel workflows accountable from request to manager verification.',
    url: 'https://whagons.com/en/platform',
    locale: 'en_US',
    type: 'website',
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/plataforma');
  return <HospitalityPlatformPage />;
}
