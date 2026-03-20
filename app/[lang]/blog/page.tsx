import type { Metadata } from 'next';
import { translations, Language } from '../../lib/i18n';
import { getBlogPosts } from '../../lib/blog';
import BlogListClient from './BlogListClient';

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

  return {
    title: t.blogPageTitle,
    description: t.blogPageDesc,
    alternates: {
      canonical: `https://whagons.com/${lang}/blog`,
      languages: { en: 'https://whagons.com/en/blog', es: 'https://whagons.com/es/blog' },
    },
  };
}

export default function BlogPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const posts = getBlogPosts(lang);

  return <BlogListClient lang={lang} posts={posts} />;
}
