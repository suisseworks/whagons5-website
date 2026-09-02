import type { Metadata } from 'next';
import { Language } from '../lib/i18n';
import NavBar from '../components/NavBar';
import FooterBar from '../components/FooterBar';

const SUPPORTED_LANGS = ['es', 'en'] as const;

interface LangLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

const metadataByLang: Record<string, Metadata> = {
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
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Whagons — Operaciones hoteleras bajo control',
      description: 'Haz visible cada responsable, plazo, escalamiento y cierre en la operación del hotel.',
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
      languages: { 'en': 'https://whagons.com/en', 'es': 'https://whagons.com/es' },
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
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Whagons — Hotel Operations Under Control',
      description: 'Make every owner, due time, escalation, and verified completion visible.',
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
      languages: { 'en-US': 'https://whagons.com/en', 'es-419': 'https://whagons.com/es', 'x-default': 'https://whagons.com/en' },
    },
  },
};

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const lang = SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es';
  return metadataByLang[lang] || metadataByLang.es;
}

export default function LangLayout({ children, params }: LangLayoutProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const pageUrl = `https://whagons.com/${lang}`;
  const description = lang === 'es'
    ? 'Software de operaciones hoteleras para coordinar responsables, plazos, escalamientos y evidencia entre equipos y turnos.'
    : 'Hotel operations software for coordinating owners, due times, escalation, and completion evidence across teams and shifts.';
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${pageUrl}#organization`,
        name: 'Whagons',
        url: pageUrl,
        logo: 'https://whagons.com/images/logo-whagons-horizontal-red.svg',
        description,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${pageUrl}#software`,
        name: 'Whagons',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description,
        provider: { '@id': `${pageUrl}#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${pageUrl}#website`,
        url: pageUrl,
        name: 'Whagons',
        inLanguage: lang === 'es' ? 'es-419' : 'en-US',
        publisher: { '@id': `${pageUrl}#organization` },
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${lang}";`,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NavBar lang={lang} />
      {children}
      <FooterBar lang={lang} />
    </>
  );
}
