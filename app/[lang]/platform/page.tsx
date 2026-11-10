import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PlatformPageClient from '../plataforma/PlatformPageClient';

export const metadata: Metadata = {
  title: 'Operations Management Platform & Workflow Automation',
  description:
    'Coordinate plants, field crews, warehouses, sites and buildings: reports by voice, QR or NFC, AI agents, workflows with owners and due times, evidence, KPI cards and powerups.',
  keywords: ['operations management software', 'workflow automation software', 'field service management software', 'preventive maintenance software', 'task management software'],
  alternates: {
    canonical: 'https://whagons.com/en/platform',
    languages: { en: 'https://whagons.com/en/platform', es: 'https://whagons.com/es/plataforma' },
  },
  openGraph: {
    title: 'The Whagons platform: every team connected',
    description: 'From the first report to verified work: owners, due times, evidence and visibility for any operation, next to the systems you already use.',
    url: 'https://whagons.com/en/platform',
    locale: 'en_US',
    type: 'website',
    images: ['/images/industries/mantenimiento.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Operations Management Platform | Whagons',
    description: 'From the first report to verified work, for any operation and next to the systems you already use.',
    images: ['/images/industries/mantenimiento.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/plataforma');
  return <PlatformPageClient lang="en" />;
}
