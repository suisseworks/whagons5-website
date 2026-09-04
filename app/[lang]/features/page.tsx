import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import FeaturesPage from '../../components/features/FeaturesPage';
import FeaturesStructuredData from '../../components/features/FeaturesStructuredData';

export const metadata: Metadata = {
  title: 'Hotel Operations Software Features',
  description:
    'Explore Whagons features for hotel workflow control, mobile execution, inspections, SOPs, analytics, escalation, and PMS-friendly integrations.',
  keywords: [
    'hotel operations software features',
    'hotel workflow management',
    'hotel maintenance software',
    'hotel inspection software',
  ],
  alternates: {
    canonical: 'https://whagons.com/en/features',
    languages: {
      en: 'https://whagons.com/en/features',
      es: 'https://whagons.com/es/funcionalidades',
      'x-default': 'https://whagons.com/en/features',
    },
  },
  openGraph: {
    title: 'Hotel Operations Software Features | Whagons',
    description:
      'Control hotel workflows from the first signal to a verified result—with mobile execution, standards, visibility, and integrations.',
    url: 'https://whagons.com/en/features',
    locale: 'en_US',
    alternateLocale: ['es_419'],
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Operations Software Features | Whagons',
    description: 'Workflow control, mobile execution, standards, visibility, and integrations for hotel teams.',
    images: ['/images/industries/hoteleria.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/funcionalidades');
  return (
    <>
      <FeaturesStructuredData lang="en" />
      <FeaturesPage lang="en" />
    </>
  );
}
