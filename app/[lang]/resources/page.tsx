import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HospitalityResourcesPage from '../../components/hospitality/HospitalityResourcesPage';
import { getBlogPosts } from '../../lib/blog';

export const metadata: Metadata = {
  title: 'Hotel Operations Resources',
  description:
    'Practical guides for hotel shift handoffs, guest-issue ownership, maintenance response, room readiness, inspections, and frontline workflow adoption.',
  alternates: {
    canonical: 'https://whagons.com/en/resources',
    languages: { 'en-US': 'https://whagons.com/en/resources', 'es-419': 'https://whagons.com/es/blog' },
  },
  openGraph: {
    title: 'Hotel Operations Field Notes from Whagons Hospitality',
    description: 'Practical control for real hotel handoffs.',
    url: 'https://whagons.com/en/resources',
    locale: 'en_US',
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Operations Field Notes | Whagons',
    description: 'Practical control for real hotel handoffs.',
    images: ['/images/industries/hoteleria.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/blog');
  return <HospitalityResourcesPage posts={getBlogPosts('en')} lang="en" />;
}
