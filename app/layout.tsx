import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Whagons — Operational Intelligence Platform | AI-Powered Business Optimization',
  description: 'Transform operational complexity into strategic clarity. AI-powered platform for workflow automation, real-time analytics, SLA management, and operational excellence across industries.',
  icons: {
    icon: '/whagons.svg',
  },
  openGraph: {
    title: 'Whagons — Decisions That Drive Results',
    description: 'AI-powered operational intelligence platform. Turn complexity into clarity with intelligent workflows, real-time analytics, and predictive asset management.',
    siteName: 'Whagons',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whagons — Decisions That Drive Results',
    description: 'AI-powered operational intelligence platform. Turn complexity into clarity with intelligent workflows, real-time analytics, and predictive asset management.',
  },
  keywords: [
    'operational intelligence platform',
    'business operations optimization',
    'AI operations management',
    'real-time operations analytics',
    'workflow automation software',
    'SLA management platform',
    'asset management software',
    'compliance management system',
    'operational visibility',
    'business process intelligence',
    'field operations platform',
    'multi-site operations management',
    'operational excellence software',
    'inteligencia operativa',
    'optimización de operaciones',
    'gestión de operaciones con IA',
    'plataforma de inteligencia de negocio',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Instrument+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://whagons.com/#organization',
                  name: 'Whagons International',
                  url: 'https://whagons.com',
                  logo: 'https://whagons.com/whagons.svg',
                  description: 'AI-powered operational intelligence platform for organizations with complex on-the-ground operations.',
                  foundingDate: '2021',
                  sameAs: [],
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://whagons.com/#software',
                  name: 'Whagons',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web, iOS, Android',
                  description: 'Operational intelligence platform that transforms operational complexity into strategic clarity with AI-powered workflows, real-time analytics, and predictive asset management.',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                    description: 'Contact for pricing',
                  },
                  provider: {
                    '@type': 'Organization',
                    '@id': 'https://whagons.com/#organization',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://whagons.com/#website',
                  url: 'https://whagons.com',
                  name: 'Whagons',
                  publisher: {
                    '@type': 'Organization',
                    '@id': 'https://whagons.com/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://whagons.com/?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
