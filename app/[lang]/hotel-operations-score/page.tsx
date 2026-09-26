import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ScorePage from '../../components/hotel-score/ScorePage';
import { isLanguage } from '../../lib/locales';

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const es = params.lang === 'es';
  const title = es ? 'Diagnóstico de operaciones hoteleras' : 'Hotel Operations Score';
  const description = es
    ? 'Responde diez preguntas y recibe tu puntaje de control operativo y un plan de mejora para tu hotel por correo.'
    : 'Answer ten questions and receive your operational control score and hotel improvement plan by email.';
  const url = `https://whagons.com/${es ? 'es' : 'en'}/hotel-operations-score`;
  const images = ['/images/industries/hoteleria.jpg'];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: 'https://whagons.com/es/hotel-operations-score',
        en: 'https://whagons.com/en/hotel-operations-score',
      },
    },
    openGraph: {
      title: `${title} | Whagons`, description, url, type: 'website',
      locale: es ? 'es_419' : 'en_US', images,
    },
    twitter: {
      card: 'summary_large_image', title: `${title} | Whagons`, description, images,
    },
  };
}

export default function Page({ params }: { params: { lang: string } }) {
  if (!isLanguage(params.lang)) notFound();
  return <ScorePage lang={params.lang} />;
}
