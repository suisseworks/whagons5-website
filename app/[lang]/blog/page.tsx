import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { translations, Language } from '../../lib/i18n';
import { getBlogPosts, getSlugTranslationMap } from '../../lib/blog';
import HospitalityResourcesPage from '../../components/hospitality/HospitalityResourcesPage';

const SUPPORTED_LANGS = ['es', 'en'] as const;

interface PageProps {
  params: { lang: string };
}

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const t = translations[lang];
  const canonical = lang === 'en' ? 'https://whagons.com/en/resources' : 'https://whagons.com/es/blog';

  return {
    title: t.blogPageTitle,
    description: t.blogPageDesc,
    alternates: {
      canonical,
      languages: { 'en-US': 'https://whagons.com/en/resources', 'es-419': 'https://whagons.com/es/blog' },
    },
    openGraph: {
      title: t.blogPageTitle,
      description: t.blogPageDesc,
      url: canonical,
      locale: lang === 'es' ? 'es_419' : 'en_US',
      type: 'website',
      images: ['/images/industries/hoteleria.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.blogPageTitle,
      description: t.blogPageDesc,
      images: ['/images/industries/hoteleria.jpg'],
    },
  };
}

export default function BlogPage({ params }: PageProps) {
  if (params.lang === 'en') redirect('/en/resources');
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const posts = getBlogPosts(lang);
  const translationMap = getSlugTranslationMap();
  const visiblePosts = lang === 'es'
    ? posts.filter((post) => translationMap[`/es/blog/${post.slug}`])
    : posts;

  return <HospitalityResourcesPage lang={lang} posts={visiblePosts} />;
}
