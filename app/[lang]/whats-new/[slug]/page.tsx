import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReleasePage, releaseMetadata, releaseParams } from '../../../components/news/NewsPages';
import '../../../styles/blog.css';
import '../../../styles/news.css';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return releaseParams('en');
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  return params.lang === 'en' ? releaseMetadata('en', params.slug) : {};
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  if (params.lang !== 'en') notFound();
  return <ReleasePage lang="en" slug={params.slug} />;
}
