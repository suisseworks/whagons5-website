import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Bebas_Neue, Cormorant_Garamond, Instrument_Sans } from 'next/font/google';
import {
  ALTERNATE_LANGUAGES,
  HTML_LANG,
  Language,
  SUPPORTED_LANGS,
  isLanguage,
} from '../lib/locales';
import NavBar from '../components/NavBar';
import FooterBar from '../components/FooterBar';
import '../globals.css';

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

interface LangLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

const metadataByLang: Record<Language, Metadata> = {
  es: {
    title: {
      default: 'Whagons — Software de Operaciones Hoteleras',
      template: '%s | Whagons',
    },
    description: 'Conecta solicitudes de huéspedes, habitaciones, mantenimiento, inspecciones y turnos en una plataforma de operaciones hoteleras con responsables, plazos y evidencia.',
    icons: '/favicon.svg',
    openGraph: {
      title: 'Whagons — Cada entrega operativa del hotel bajo control',
      description: 'Coordina solicitudes, habitaciones, mantenimiento e inspecciones entre equipos, turnos y propiedades.',
      url: 'https://whagons.com/es',
      siteName: 'Whagons',
      type: 'website',
      locale: 'es_419',
      images: ['/images/industries/hoteleria.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Whagons — Operaciones hoteleras bajo control',
      description: 'Haz visible cada responsable, plazo, escalamiento y cierre en la operación del hotel.',
      images: ['/images/industries/hoteleria.jpg'],
    },
    keywords: [
      'software de operaciones hoteleras',
      'software para hoteles',
      'gestión de solicitudes de huéspedes',
      'mantenimiento hotelero',
      'alistamiento de habitaciones',
      'gestión de turnos hoteleros',
      'inspecciones hoteleras',
      'automatización de procesos hoteleros',
    ],
    alternates: {
      canonical: 'https://whagons.com/es',
      languages: ALTERNATE_LANGUAGES,
    },
  },
  en: {
    title: {
      default: 'Whagons — Hotel Operations Software',
      template: '%s | Whagons',
    },
    description: 'Connect guest requests, room readiness, maintenance, inspections, and shifts in one hotel operations platform with owners, due times, escalation, and evidence.',
    icons: '/favicon.svg',
    openGraph: {
      title: 'Whagons — Every Hotel Handoff Under Control',
      description: 'Coordinate guest requests, rooms, maintenance, and inspections across teams, shifts, and properties.',
      url: 'https://whagons.com/en',
      siteName: 'Whagons',
      type: 'website',
      locale: 'en_US',
      images: ['/images/industries/hoteleria.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Whagons — Hotel Operations Under Control',
      description: 'Make every owner, due time, escalation, and verified completion visible.',
      images: ['/images/industries/hoteleria.jpg'],
    },
    keywords: [
      'hotel operations software',
      'hotel workflow software',
      'hotel handoff management',
      'hotel maintenance workflow',
      'hotel shift handoff',
      'hotel task escalation',
      'room readiness workflow',
      'hotel inspections software',
    ],
    alternates: {
      canonical: 'https://whagons.com/en',
      languages: ALTERNATE_LANGUAGES,
    },
  },
};

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const lang = isLanguage(params.lang) ? params.lang : 'es';
  return {
    metadataBase: new URL('https://whagons.com'),
    ...(metadataByLang[lang] || metadataByLang.es),
  };
}

export default function LangLayout({ children, params }: LangLayoutProps) {
  if (!isLanguage(params.lang)) notFound();
  const lang = isLanguage(params.lang) ? params.lang : 'es';
  const documentLang = HTML_LANG[lang];
  const siteUrl = 'https://whagons.com';
  const descriptions: Record<Language, string> = {
    es: 'Software de operaciones hoteleras para coordinar responsables, plazos, escalamientos y evidencia entre equipos y turnos.',
    en: 'Hotel operations software for coordinating owners, due times, escalation, and completion evidence across teams and shifts.',
  };
  const description = descriptions[lang];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Whagons',
        url: siteUrl,
        logo: `${siteUrl}/images/logo-whagons-horizontal-red.svg`,
        description,
        sameAs: ['https://www.linkedin.com/company/whagons/', 'https://www.facebook.com/whagons/', 'https://www.instagram.com/whagons/'],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Whagons',
        inLanguage: SUPPORTED_LANGS.map((language) => HTML_LANG[language]),
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html
      lang={documentLang}
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${cormorantGaramond.variable} ${instrumentSans.variable}`}
    >
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NavBar lang={lang} />
        {children}
        <FooterBar lang={lang} />
      </body>
    </html>
  );
}
