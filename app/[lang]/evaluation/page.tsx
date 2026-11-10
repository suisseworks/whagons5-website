import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { freeEvaluation } from '../../lib/free-evaluation';
import EvaluationPageClient from './EvaluationPageClient';

const copy = freeEvaluation.en;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: 'https://whagons.com/en/evaluation',
    languages: { en: 'https://whagons.com/en/evaluation', es: 'https://whagons.com/es/evaluacion' },
  },
  openGraph: {
    title: copy.metaTitle,
    description: copy.metaDescription,
    url: 'https://whagons.com/en/evaluation',
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
  if (params.lang !== 'en') redirect('/es/evaluacion');
  return <EvaluationPageClient lang="en" />;
}
