import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import IndustriasPageClient from '../industrias/IndustriasPageClient';

export const metadata: Metadata = {
  title: 'Operations Software for Hotels & Other Industries',
  description:
    'Explore hotel-first Whagons workflows for hospitality, retail, industrial maintenance, regulated operations, health, education, and construction.',
  keywords: [
    'hotel operations software',
    'retail operations software',
    'industrial maintenance software',
    'pharma compliance workflows',
    'construction operations software',
  ],
  alternates: {
    canonical: 'https://whagons.com/en/industries',
    languages: { 'en-US': 'https://whagons.com/en/industries', 'es-419': 'https://whagons.com/es/industrias' },
  },
  openGraph: {
    title: 'Operations Software by Industry',
    description: 'Hotel-first operations software that also supports complex work across retail, maintenance, regulated industries, health, education, and construction.',
    url: 'https://whagons.com/en/industries',
    locale: 'en_US',
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Operations Software by Industry | Whagons',
    description: 'Hotel-first operations software for hospitality and other complex operating teams.',
    images: ['/images/industries/hoteleria.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function IndustriesPage({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/industrias');
  return <IndustriasPageClient lang="en" />;
}
