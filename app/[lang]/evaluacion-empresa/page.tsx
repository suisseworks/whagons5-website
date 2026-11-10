import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { businessEvaluation } from '../../lib/free-evaluation';
import EvaluationPageClient from '../evaluation/EvaluationPageClient';

const copy = businessEvaluation.es;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: 'https://whagons.com/es/evaluacion-empresa',
    languages: { en: 'https://whagons.com/en/business-evaluation', es: 'https://whagons.com/es/evaluacion-empresa' },
  },
  openGraph: {
    title: copy.metaTitle,
    description: copy.metaDescription,
    url: 'https://whagons.com/es/evaluacion-empresa',
    locale: 'es_419',
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
  return [{ lang: 'es' }];
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'es') redirect('/en/business-evaluation');
  return <EvaluationPageClient lang="es" variant="business" />;
}
