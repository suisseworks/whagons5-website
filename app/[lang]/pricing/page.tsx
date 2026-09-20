import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PricingPage from '../../components/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Plans & pricing',
  description: 'Build your Whagons plan. Choose powerups and users, and see your monthly and onboarding costs.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/en/pricing', languages: { en: '/en/pricing', es: '/es/planes' } },
};
export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang === 'es') redirect('/es/planes');
  return <PricingPage lang="en" />;
}
