import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { businessEvaluation } from '../../lib/free-evaluation';
import EvaluationPageClient from '../evaluation/EvaluationPageClient';

const copy = businessEvaluation.en;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: 'https://whagons.com/en/business-evaluation',
    languages: { en: 'https://whagons.com/en/business-evaluation', es: 'https://whagons.com/es/evaluacion-empresa' },
  },
  openGraph: {
    title: copy.metaTitle,
    description: copy.metaDescription,
    url: 'https://whagons.com/en/business-evaluation',
    locale: 'en_US',
    type: 'website',
    images: ['/images/industries/mantenimiento.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${copy.metaTitle} | Whagons`,
    description: copy.metaDescription,
    images: ['/images/industries/mantenimiento.jpg'],
  },
};

export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/evaluacion-empresa');
  return <EvaluationPageClient lang="en" variant="business" />;
}
