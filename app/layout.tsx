import { Bebas_Neue, Cormorant_Garamond, Instrument_Sans } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${bebasNeue.variable} ${cormorantGaramond.variable} ${instrumentSans.variable}`}>
      <head>
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
                  description: 'Software de gestión operativa con inteligencia artificial para empresas con operaciones complejas. AI-powered operations management software.',
                  foundingDate: '2021',
                  sameAs: [],
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://whagons.com/#software',
                  name: 'Whagons',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web, iOS, Android',
                  description: 'Software de gestión operativa y automatización de procesos empresariales. Plataforma con IA para control de operaciones, flujos de trabajo inteligentes y analítica en tiempo real.',
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
                  inLanguage: ['es', 'en'],
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
