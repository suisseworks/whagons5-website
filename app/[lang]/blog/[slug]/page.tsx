import type { Metadata } from 'next';
import { Language } from '../../../lib/i18n';
import { getBlogPost, getBlogPosts, getSlugTranslationMap } from '../../../lib/blog';
import { notFound, redirect } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import BlogPostStructuredData from '../../../components/BlogPostStructuredData';

const SUPPORTED_LANGS = ['es', 'en'] as const;

interface PageProps {
  params: { lang: string; slug: string };
}

export async function generateStaticParams() {
  const translationMap = getSlugTranslationMap();

  return getBlogPosts('es')
    .filter(({ slug }) => translationMap[`/es/blog/${slug}`])
    .map(({ slug }) => ({ lang: 'es', slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const post = getBlogPost(lang, params.slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  const canonicalPath = lang === 'en'
    ? `/en/resources/${params.slug}`
    : `/es/blog/${params.slug}`;
  const translationPath = getSlugTranslationMap()[canonicalPath];
  const coverImage = post.coverImage || '/images/industries/hoteleria.jpg';
  const coverImageAlt = post.coverImageAlt || '';

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
      url: `https://whagons.com${canonicalPath}`,
      images: [{
        url: coverImage,
        width: 800,
        height: 533,
        alt: coverImageAlt,
        type: 'image/jpeg',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [{ url: coverImage, alt: coverImageAlt }],
    },
    alternates: {
      canonical: `https://whagons.com${canonicalPath}`,
      languages: translationPath
        ? {
            [lang === 'es' ? 'es-419' : 'en-US']: `https://whagons.com${canonicalPath}`,
            [lang === 'es' ? 'en-US' : 'es-419']: `https://whagons.com${translationPath}`,
          }
        : undefined,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  if (params.lang === 'en') redirect(`/en/resources/${params.slug}`);
  const lang = (SUPPORTED_LANGS.includes(params.lang as any) ? params.lang : 'es') as Language;
  const post = getBlogPost(lang, params.slug);

  if (!post) {
    notFound();
  }

  const canonicalPath = `/es/blog/${params.slug}`;

  return (
    <>
      <BlogPostStructuredData post={post} canonicalPath={canonicalPath} language="es-419" />
      <BlogPostClient post={post} lang={lang} />
    </>
  );
}
