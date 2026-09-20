import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PricingPage from '../../components/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Planes e inversión',
  description: 'Arma tu plan Whagons. Elige powerups y usuarios y conoce tu mensualidad y costos de implementación.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/es/planes', languages: { en: '/en/pricing', es: '/es/planes' } },
  openGraph: {
    title: 'Planes e inversión | Whagons',
    description: 'Elige tu plan, powerups y usuarios. Consulta la mensualidad y los costos de implementación.',
    url: '/es/planes',
    locale: 'es_419',
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planes e inversión | Whagons',
    description: 'Elige tu plan, powerups y usuarios. Consulta la mensualidad y los costos de implementación.',
    images: ['/images/industries/hoteleria.jpg'],
  },
};
export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang === 'en') redirect('/en/pricing');
  return <PricingPage lang="es" />;
}
