import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import BlogPostClient from '../../blog/[slug]/BlogPostClient';
import { getBlogPost, getBlogPosts } from '../../../lib/blog';

interface PageProps {
  params: { lang: string; slug: string };
}

export function generateStaticParams() {
  return getBlogPosts('en').map((post) => ({ lang: 'en', slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost('en', params.slug);
  if (!post) return { title: 'Resource not found' };

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: { canonical: `https://whagons.com/en/resources/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      locale: 'en_US',
    },
  };
}

export default function Page({ params }: PageProps) {
  if (params.lang !== 'en') redirect('/es/blog');
  const post = getBlogPost('en', params.slug);
  if (!post) notFound();
  return <BlogPostClient post={post} lang="en" />;
}
