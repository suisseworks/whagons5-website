import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NewsIndexPage, newsIndexMetadata } from '../../components/news/NewsPages';
import '../../styles/blog.css';
import '../../styles/news.css';

// What's new (English) index. In the other language this path redirects to /es/novedades.
export function generateStaticParams() {
  return [{ lang: 'en' }];
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return params.lang === 'en' ? newsIndexMetadata('en') : {};
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es/novedades');
  return <NewsIndexPage lang="en" />;
}
