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
    icons: { icon: '/whagons.svg' },
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
      default: 'Whagons — Operations Management Software with AI | Business Process Automation',
      template: '%s | Whagons',
    },
    description: 'Operations management software for businesses. AI-powered platform for business process automation, workflow management, real-time analytics, and operational control across industries.',
    icons: { icon: '/whagons.svg' },
    openGraph: {
      title: 'Whagons — Operations Management Software with AI',
      description: 'Operations management platform for businesses. Automate processes, control operations in real time, and make decisions powered by AI.',
      siteName: 'Whagons',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Whagons — Operations Management Software with AI',
      description: 'Operations management platform for businesses. Automate processes, control operations in real time, and make decisions powered by AI.',
    },
    keywords: [
      'operations management software',
      'business process automation platform',
      'workflow automation software',
      'AI operations management',
      'operations control platform',
      'AI-powered business software',
      'task management software',
      'workflow management system',
      'preventive maintenance software',
      'SLA management platform',
      'enterprise asset management',
      'compliance and audit software',
      'real-time operational analytics',
      'hotel management software',
      'retail operations software',
      'multi-site management',
    ],
    alternates: {
      canonical: 'https://whagons.com/en',
      languages: { 'en': 'https://whagons.com/en', 'es': 'https://whagons.com/es' },
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

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${lang}";`,
        }}
      />
      <NavBar lang={lang} />
      {children}
      <FooterBar lang={lang} />
    </>
  );
}
