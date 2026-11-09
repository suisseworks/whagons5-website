import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { pilotWaitlist } from '../../lib/pilot-waitlist';
import PilotPageClient from './PilotPageClient';

const copy = pilotWaitlist.en;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: 'https://whagons.com/en/pilot',
    languages: { en: 'https://whagons.com/en/pilot', es: 'https://whagons.com/es/piloto' },
  },
  openGraph: {
    title: copy.metaTitle,
    description: copy.metaDescription,
    url: 'https://whagons.com/en/pilot',
    locale: 'en_US',
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
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/piloto');
  return <PilotPageClient lang="en" />;
}
