import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { pilotWaitlist } from '../../lib/pilot-waitlist';
import PilotPageClient from '../pilot/PilotPageClient';

const copy = pilotWaitlist.es;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: 'https://whagons.com/es/piloto',
    languages: { en: 'https://whagons.com/en/pilot', es: 'https://whagons.com/es/piloto' },
  },
  openGraph: {
    title: copy.metaTitle,
    description: copy.metaDescription,
    url: 'https://whagons.com/es/piloto',
    locale: 'es_419',
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${copy.metaTitle} | Whagons`,
    description: copy.metaDescription,
    images: ['/images/industries/hoteleria.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'es' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'es') redirect('/en/pilot');
  return <PilotPageClient lang="es" />;
}
