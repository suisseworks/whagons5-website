import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { freeEvaluation } from '../../lib/free-evaluation';
import EvaluationPageClient from '../evaluation/EvaluationPageClient';

const copy = freeEvaluation.es;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: 'https://whagons.com/es/evaluacion',
    languages: { en: 'https://whagons.com/en/evaluation', es: 'https://whagons.com/es/evaluacion' },
  },
  openGraph: {
    title: copy.metaTitle,
    description: copy.metaDescription,
    url: 'https://whagons.com/es/evaluacion',
    locale: 'es_419',
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
  return [{ lang: 'es' }];
}

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  if (params.lang !== 'es') redirect('/en/evaluation');
  return <EvaluationPageClient lang="es" />;
}
