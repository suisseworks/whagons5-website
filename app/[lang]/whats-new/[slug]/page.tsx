import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReleasePage, releaseMetadata, releaseParams } from '../../../components/news/NewsPages';
import '../../../styles/blog.css';
import '../../../styles/news.css';

interface PageProps {
  params: { lang: string; slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return releaseParams('en');
}

export function generateMetadata({ params }: PageProps): Metadata {
  return params.lang === 'en' ? releaseMetadata('en', params.slug) : {};
}

export default function Page({ params }: PageProps) {
  if (params.lang !== 'en') notFound();
  return <ReleasePage lang="en" slug={params.slug} />;
}
