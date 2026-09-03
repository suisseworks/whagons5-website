import type { Metadata } from 'next';
import { Bebas_Neue, Cormorant_Garamond, Instrument_Sans } from 'next/font/google';
import {
  ALTERNATE_LANGUAGES,
  HTML_LANG,
  Language,
  SUPPORTED_LANGS,
  isLanguage,
} from '../lib/locales';
import { getSlugTranslationMap } from '../lib/blog';
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
  pt: {
    title: { default: 'Whagons — Software para Operações Hoteleiras', template: '%s | Whagons' },
    description: 'Conecte solicitações de hóspedes, quartos, manutenção, inspeções e turnos em uma plataforma de operações hoteleiras com responsáveis, prazos e evidências.',
    icons: '/favicon.svg',
    openGraph: {
      title: 'Whagons — Cada entrega do hotel sob controle',
      description: 'Coordene solicitações, quartos, manutenção e inspeções entre equipes, turnos e propriedades.',
      url: 'https://whagons.com/pt', siteName: 'Whagons', type: 'website', locale: 'pt_BR',
      images: ['/images/industries/hoteleria.jpg'],
    },
    twitter: { card: 'summary_large_image', title: 'Whagons — Operações hoteleiras sob controle', description: 'Torne visíveis responsáveis, prazos, escalonamentos e conclusões verificadas.', images: ['/images/industries/hoteleria.jpg'] },
    keywords: ['software para operações hoteleiras', 'software para hotéis', 'gestão de solicitações de hóspedes', 'manutenção hoteleira', 'gestão de turnos em hotéis'],
    alternates: { canonical: 'https://whagons.com/pt', languages: ALTERNATE_LANGUAGES },
  },
  de: {
    title: { default: 'Whagons — Software für den Hotelbetrieb', template: '%s | Whagons' },
    description: 'Verbinden Sie Gästeanfragen, Zimmerbereitschaft, Wartung, Inspektionen und Schichten in einer Plattform für den Hotelbetrieb.',
    icons: '/favicon.svg',
    openGraph: {
      title: 'Whagons — Jede operative Hotelübergabe unter Kontrolle',
      description: 'Koordinieren Sie Anfragen, Zimmer, Wartung und Inspektionen über Teams, Schichten und Standorte hinweg.',
      url: 'https://whagons.com/de', siteName: 'Whagons', type: 'website', locale: 'de_DE',
      images: ['/images/industries/hoteleria.jpg'],
    },
    twitter: { card: 'summary_large_image', title: 'Whagons — Hotelbetrieb unter Kontrolle', description: 'Machen Sie Verantwortliche, Fristen, Eskalationen und geprüfte Abschlüsse sichtbar.', images: ['/images/industries/hoteleria.jpg'] },
    keywords: ['Software für Hotelbetrieb', 'Hotel Operations Software', 'Gästeanfragen verwalten', 'Hotelwartung Software', 'Schichtübergabe Hotel'],
    alternates: { canonical: 'https://whagons.com/de', languages: ALTERNATE_LANGUAGES },
  },
  it: {
    title: { default: 'Whagons — Software per Operazioni Alberghiere', template: '%s | Whagons' },
    description: 'Collega richieste degli ospiti, camere, manutenzione, ispezioni e turni in una piattaforma per le operazioni alberghiere.',
    icons: '/favicon.svg',
    openGraph: {
      title: 'Whagons — Ogni passaggio operativo dell’hotel sotto controllo',
      description: 'Coordina richieste, camere, manutenzione e ispezioni tra team, turni e strutture.',
      url: 'https://whagons.com/it', siteName: 'Whagons', type: 'website', locale: 'it_IT',
      images: ['/images/industries/hoteleria.jpg'],
    },
    twitter: { card: 'summary_large_image', title: 'Whagons — Operazioni alberghiere sotto controllo', description: 'Rendi visibili responsabili, scadenze, escalation e completamenti verificati.', images: ['/images/industries/hoteleria.jpg'] },
    keywords: ['software operazioni alberghiere', 'software per hotel', 'gestione richieste ospiti', 'manutenzione alberghiera', 'gestione turni hotel'],
    alternates: { canonical: 'https://whagons.com/it', languages: ALTERNATE_LANGUAGES },
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
  const lang = isLanguage(params.lang) ? params.lang : 'es';
  const documentLang = HTML_LANG[lang];
  const blogSlugMap = getSlugTranslationMap();
  const siteUrl = 'https://whagons.com';
  const descriptions: Record<Language, string> = {
    es: 'Software de operaciones hoteleras para coordinar responsables, plazos, escalamientos y evidencia entre equipos y turnos.',
    en: 'Hotel operations software for coordinating owners, due times, escalation, and completion evidence across teams and shifts.',
    pt: 'Software de operações hoteleiras para coordenar responsáveis, prazos, escalonamentos e evidências entre equipes e turnos.',
    de: 'Software für den Hotelbetrieb zur Koordination von Verantwortlichen, Fristen, Eskalationen und Nachweisen über Teams und Schichten hinweg.',
    it: 'Software per operazioni alberghiere che coordina responsabili, scadenze, escalation e prove tra team e turni.',
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
        sameAs: ['https://www.linkedin.com/company/whagons/'],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Whagons',
        inLanguage: Object.values(HTML_LANG),
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
        <NavBar lang={lang} blogSlugMap={blogSlugMap} />
        {children}
        <FooterBar lang={lang} />
      </body>
    </html>
  );
}
