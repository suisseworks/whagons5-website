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
      default: 'Whagons — Software de Gestión Operativa con IA | Automatización de Procesos Empresariales',
      template: '%s | Whagons',
    },
    description: 'Software de gestión operativa para empresas. Plataforma con inteligencia artificial para automatización de procesos, control de operaciones, flujos de trabajo y analítica en tiempo real.',
    icons: '/favicon.svg',
    openGraph: {
      title: 'Whagons — Software de Gestión Operativa con Inteligencia Artificial',
      description: 'Plataforma de gestión operativa para empresas. Automatiza procesos, controla operaciones en tiempo real y toma decisiones con IA.',
      siteName: 'Whagons',
      type: 'website',
      locale: 'es_419',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Whagons — Software de Gestión Operativa con IA',
      description: 'Plataforma de gestión operativa para empresas. Automatiza procesos, controla operaciones en tiempo real y toma decisiones con IA.',
    },
    keywords: [
      'software de gestión operativa',
      'plataforma de gestión de operaciones',
      'automatización de procesos empresariales',
      'control de operaciones',
      'software para gestionar operaciones de empresas',
      'herramienta con inteligencia artificial para empresas',
      'software de gestión de tareas',
      'automatización de flujos de trabajo',
      'software de mantenimiento preventivo',
      'plataforma SLA empresarial',
      'gestión de activos empresariales',
      'software de cumplimiento y auditoría',
      'analítica operativa en tiempo real',
      'software para hoteles',
      'software para retail',
      'gestión multi-sede',
    ],
    alternates: {
      canonical: 'https://whagons.com/es',
      languages: { 'en': 'https://whagons.com/en', 'es': 'https://whagons.com/es' },
    },
  },
  en: {
    title: {
      default: 'Whagons Hospitality — Hotel Operations and Handoff Control',
      template: '%s | Whagons Hospitality',
    },
    description: 'Hotel operations software for visible ownership, due times, escalation, completion proof, and manager visibility without replacing the property management system.',
    icons: '/favicon.svg',
    openGraph: {
      title: 'Whagons Hospitality — Hotel Operations Under Control',
      description: 'Know what is owned, what is late, and what is done to standard across hotel handoffs.',
      url: 'https://whagons.com/en',
      siteName: 'Whagons Hospitality',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Whagons Hospitality — Hotel Operations Under Control',
      description: 'Control hotel handoffs with ownership, due times, escalation, proof, and manager visibility.',
    },
    keywords: [
      'hotel operations software',
      'hotel workflow software',
      'hotel handoff management',
      'hotel maintenance workflow',
      'hotel shift handoff',
      'hotel task escalation',
      'room readiness workflow',
      'hotel operations Sacramento',
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
  const structuredData = lang === 'en'
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://whagons.com/en#organization',
            name: 'Whagons Systems LLC',
            alternateName: 'Whagons Hospitality',
            url: 'https://whagons.com/en',
            logo: 'https://whagons.com/images/logo-whagons-horizontal-red.svg',
            areaServed: 'US',
            description: 'Hotel operations and handoff control software for U.S. hospitality teams.',
          },
          {
            '@type': 'SoftwareApplication',
            '@id': 'https://whagons.com/en#software',
            name: 'Whagons Hospitality',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Hotel workflow control for ownership, due times, escalation, completion proof, and manager visibility.',
            provider: { '@id': 'https://whagons.com/en#organization' },
          },
          {
            '@type': 'WebSite',
            '@id': 'https://whagons.com/en#website',
            url: 'https://whagons.com/en',
            name: 'Whagons Hospitality',
            inLanguage: 'en-US',
            publisher: { '@id': 'https://whagons.com/en#organization' },
          },
        ],
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://whagons.com/es',
        name: 'Whagons',
        inLanguage: 'es-419',
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
