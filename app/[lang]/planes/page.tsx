import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PricingPage from '../../components/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Planes e inversión',
  description: 'Arma tu plan Whagons. Elige powerups y usuarios y conoce tu mensualidad y costos de implementación.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/es/planes', languages: { en: '/en/pricing', es: '/es/planes' } },
};
export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang === 'en') redirect('/en/pricing');
  return <PricingPage lang="es" />;
}
