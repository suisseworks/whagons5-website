import { getReleases } from '../../../lib/news';
import { newsFeedResponse } from '../../../components/news/NewsPages';

export const dynamic = 'force-static';
export const dynamicParams = false;

// Only built once the language has a visible release; otherwise a 404.
export function generateStaticParams() {
  return getReleases('en').length > 0 ? [{ lang: 'en' }] : [];
}

export function GET(_request: Request, { params }: { params: { lang: string } }) {
  if (params.lang !== 'en') return new Response('Not found', { status: 404 });
  return newsFeedResponse('en');
}
