import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NewsIndexPage, newsIndexMetadata } from '../../components/news/NewsPages';
import '../../styles/blog.css';
import '../../styles/news.css';

// Novedades (Spanish) index. In the other language this path redirects to /en/whats-new.
export function generateStaticParams() {
  return [{ lang: 'es' }];
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return params.lang === 'es' ? newsIndexMetadata('es') : {};
}

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'es') redirect('/en/whats-new');
  return <NewsIndexPage lang="es" />;
}
