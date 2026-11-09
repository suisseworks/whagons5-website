import { getReleases } from '../../../lib/news';
import { newsFeedResponse } from '../../../components/news/NewsPages';

export const dynamic = 'force-static';
export const dynamicParams = false;

// Only built once the language has a visible release; otherwise a 404.
export function generateStaticParams() {
  return getReleases('es').length > 0 ? [{ lang: 'es' }] : [];
}

export function GET(_request: Request, { params }: { params: { lang: string } }) {
  if (params.lang !== 'es') return new Response('Not found', { status: 404 });
  return newsFeedResponse('es');
}
