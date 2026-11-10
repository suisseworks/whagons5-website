import type { Metadata } from 'next';
import { Language, OPEN_GRAPH_LOCALE, isLanguage } from '../lib/locales';
import HomePage from '../components/home/HomePage';

// The home page speaks to every operation; the hotel pages keep the layout's hotel defaults.
const metadataByLang: Record<Language, { title: string; description: string; ogTitle: string; keywords: string[] }> = {
  es: {
    title: 'Whagons — Software de operaciones que se adapta a tu empresa',
    description: 'Coordina personas, tareas y operaciones en un solo lugar: limpieza, mantenimiento, logística, comercio, hotelería e industria. Espacios, estados, formularios y rutinas configurados según cómo trabaja tu equipo.',
    ogTitle: 'Whagons se adapta a tu empresa. Y no al revés.',
    keywords: [
      'software de operaciones',
      'gestión de tareas operativas',
      'software de mantenimiento',
      'software de limpieza',
      'gestión de operaciones logísticas',
      'checklists digitales',
      'software de operaciones hoteleras',
      'coordinación de equipos de campo',
    ],
  },
  en: {
    title: 'Whagons — Operations software that adapts to your business',
    description: 'Coordinate people, tasks and operations in one place: cleaning, maintenance, logistics, retail, hospitality and industry. Spaces, statuses, forms and routines set up around how your team works.',
    ogTitle: 'Whagons adapts to your business. Not the other way around.',
    keywords: [
      'operations software',
      'operational task management',
      'maintenance software',
      'cleaning operations software',
      'logistics operations',
      'digital checklists',
      'hotel operations software',
      'field team coordination',
    ],
  },
};

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Language = isLanguage(params.lang) ? params.lang : 'es';
  const t = metadataByLang[lang];
  const image = '/images/photos/industries-hero.jpg';
  return {
    title: { absolute: t.title },
    description: t.description,
    keywords: t.keywords,
    openGraph: {
      title: t.ogTitle,
      description: t.description,
      url: `https://whagons.com/${lang}`,
      siteName: 'Whagons',
      type: 'website',
      locale: OPEN_GRAPH_LOCALE[lang],
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: t.ogTitle, description: t.description, images: [image] },
  };
}

export default function Home({ params }: { params: { lang: string } }) {
  const lang: Language = isLanguage(params.lang) ? params.lang : 'es';
  return <HomePage lang={lang} />;
}
