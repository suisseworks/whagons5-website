import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PricingPage from '../../components/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Plans & pricing',
  description: 'Build your Whagons plan. Choose powerups and users, and see your monthly and onboarding costs.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/en/pricing', languages: { en: '/en/pricing', es: '/es/planes' } },
  openGraph: {
    title: 'Plans & pricing | Whagons',
    description: 'Choose your plan, powerups and users. See monthly subscription and implementation costs.',
    url: '/en/pricing',
    locale: 'en_US',
    type: 'website',
    images: ['/images/industries/hoteleria.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plans & pricing | Whagons',
    description: 'Choose your plan, powerups and users. See monthly subscription and implementation costs.',
    images: ['/images/industries/hoteleria.jpg'],
  },
};
export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang === 'es') redirect('/es/planes');
  return <PricingPage lang="en" />;
}
