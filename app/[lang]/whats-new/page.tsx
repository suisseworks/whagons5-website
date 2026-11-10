import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NewsIndexPage, newsIndexMetadata } from '../../components/news/NewsPages';
import '../../styles/blog.css';
import '../../styles/news.css';

// What's new (English) index. In the other language this path redirects to /es/novedades.
export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  return params.lang === 'en' ? newsIndexMetadata('en') : {};
}

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  if (params.lang !== 'en') redirect('/es/novedades');
  return <NewsIndexPage lang="en" />;
}
