import type { Metadata } from 'next';
import { Language } from '../../../lib/i18n';
import { getBlogPost, getAllBlogSlugs } from '../../../lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

const SUPPORTED_LANGS = ['es', 'en'] as const;

interface PageProps {
  params: { lang: string; slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map(({ lang, slug }) => ({ lang, slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const post = getBlogPost(lang, params.slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      locale: lang === 'es' ? 'es_419' : 'en_US',
    },
    alternates: {
      canonical: `https://whagons.com/${lang}/blog/${params.slug}`,
      languages: post.translationSlug
        ? {
            [lang === 'es' ? 'en' : 'es']: `https://whagons.com/${lang === 'es' ? 'en' : 'es'}/blog/${post.translationSlug}`,
            [lang]: `https://whagons.com/${lang}/blog/${params.slug}`,
          }
        : undefined,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const post = getBlogPost(lang, params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} lang={lang} />;
}
