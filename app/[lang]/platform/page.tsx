import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PlatformPageClient from '../plataforma/PlatformPageClient';

export const metadata: Metadata = {
  title: 'Hotel Operations Platform & Workflow Automation',
  description:
    'Connect guest requests, maintenance, inspections, and shifts with workflows, owners, due times, automation, evidence, and manager visibility.',
  keywords: ['hotel operations software', 'hotel workflow software', 'hotel handoff management', 'hotel task escalation'],
  alternates: {
    canonical: 'https://whagons.com/en/platform',
    languages: { 'en-US': 'https://whagons.com/en/platform', 'es-419': 'https://whagons.com/es/plataforma' },
  },
  openGraph: {
    title: 'Hotel Workflow Control Platform',
    description: 'Coordinate owners, due times, escalation, and evidence without replacing the hotel PMS.',
    url: 'https://whagons.com/en/platform',
    locale: 'en_US',
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Workflow Control Platform | Whagons',
    description: 'Coordinate owners, due times, escalation, and evidence without replacing the PMS.',
    images: ['/images/industries/hoteleria.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/plataforma');
  return <PlatformPageClient lang="en" />;
}
