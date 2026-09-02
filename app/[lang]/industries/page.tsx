import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import IndustriasPageClient from '../industrias/IndustriasPageClient';

export const metadata: Metadata = {
  title: 'Operations Software by Industry — Hospitality, Retail, Maintenance and More',
  description:
    'Explore Whagons for hospitality, retail, industrial maintenance, pharma and food, health and education, and construction operations.',
  keywords: [
    'hotel operations software',
    'retail operations software',
    'industrial maintenance software',
    'pharma compliance workflows',
    'construction operations software',
  ],
  alternates: {
    canonical: 'https://whagons.com/en/industries',
    languages: { en: 'https://whagons.com/en/industries', es: 'https://whagons.com/es/industrias' },
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function IndustriesPage({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/industrias');
  return <IndustriasPageClient lang="en" />;
}
