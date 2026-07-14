import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HospitalityResourcesPage from '../../components/hospitality/HospitalityResourcesPage';
import { getBlogPosts } from '../../lib/blog';

export const metadata: Metadata = {
  title: 'Hotel Operations Resources | Whagons Hospitality',
  description:
    'Practical guides for hotel shift handoffs, guest-issue ownership, maintenance response, room readiness, inspections, and frontline workflow adoption.',
  alternates: { canonical: 'https://whagons.com/en/resources' },
  openGraph: {
    title: 'Hotel Operations Field Notes from Whagons Hospitality',
    description: 'Practical control for real hotel handoffs.',
    url: 'https://whagons.com/en/resources',
    locale: 'en_US',
    type: 'website',
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/blog');
  return <HospitalityResourcesPage posts={getBlogPosts('en')} />;
}
