import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import BlogPostClient from '../../blog/[slug]/BlogPostClient';
import { getBlogPost, getBlogPosts, getSlugTranslationMap } from '../../../lib/blog';
import BlogPostStructuredData from '../../../components/BlogPostStructuredData';

interface PageProps {
  params: { lang: string; slug: string };
}

export function generateStaticParams() {
  return getBlogPosts('en').map((post) => ({ lang: 'en', slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost('en', params.slug);
  if (!post) return { title: 'Resource not found' };
  const canonicalPath = `/en/resources/${params.slug}`;
  const translationPath = getSlugTranslationMap()[canonicalPath];
  const coverImage = post.coverImage || '/images/industries/hoteleria.jpg';
  const coverImageAlt = post.coverImageAlt || '';

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: {
      canonical: `https://whagons.com${canonicalPath}`,
      languages: translationPath
        ? {
            'en-US': `https://whagons.com${canonicalPath}`,
            'es-419': `https://whagons.com${translationPath}`,
          }
        : undefined,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      locale: 'en_US',
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
  };
}

export default function Page({ params }: PageProps) {
  if (params.lang !== 'en') redirect('/es/blog');
  const post = getBlogPost('en', params.slug);
  if (!post) notFound();
  const canonicalPath = `/en/resources/${params.slug}`;

  return (
    <>
      <BlogPostStructuredData post={post} canonicalPath={canonicalPath} language="en-US" />
      <BlogPostClient post={post} lang="en" />
    </>
  );
}
