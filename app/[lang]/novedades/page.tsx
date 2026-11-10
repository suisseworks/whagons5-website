import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NewsIndexPage, newsIndexMetadata } from '../../components/news/NewsPages';
import '../../styles/blog.css';
import '../../styles/news.css';

// Novedades (Spanish) index. In the other language this path redirects to /en/whats-new.
export function generateStaticParams() {
  return [{ lang: 'es' }];
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  return params.lang === 'es' ? newsIndexMetadata('es') : {};
}

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  if (params.lang !== 'es') redirect('/en/whats-new');
  return <NewsIndexPage lang="es" />;
}
