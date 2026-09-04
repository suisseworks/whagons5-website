import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import IndustriasPageClient from '../industrias/IndustriasPageClient';

export const metadata: Metadata = {
  title: 'Operations Software for Retail, Maintenance & More',
  description:
    'Coordinate ownership, timing, escalation, and evidence across retail, industrial maintenance, regulated sectors, health, education, and construction.',
  keywords: [
    'retail operations software',
    'industrial maintenance software',
    'pharma compliance workflows',
    'construction operations software',
  ],
  alternates: {
    canonical: 'https://whagons.com/en/industries',
    languages: { en: 'https://whagons.com/en/industries', es: 'https://whagons.com/es/industrias' },
  },
  openGraph: {
    title: 'Operations Software by Industry',
    description: 'One clear operating standard for retail, maintenance, regulated industries, health, education, and construction.',
    url: 'https://whagons.com/en/industries',
    locale: 'en_US',
    type: 'website',
    images: ['/images/industries/retail.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Operations Software by Industry | Whagons',
    description: 'Complex operations coordinated through ownership, timing, escalation, and evidence.',
    images: ['/images/industries/retail.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function IndustriesPage({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/industrias');
  return <IndustriasPageClient lang="en" />;
}
