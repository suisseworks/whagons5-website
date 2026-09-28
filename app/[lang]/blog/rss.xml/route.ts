import { getPosts, postPath } from '../../../lib/blog';
import { HTML_LANG, SUPPORTED_LANGS, isLanguage } from '../../../lib/locales';

const SITE = 'https://whagons.com';

const channel = {
  es: { title: 'Blog de Whagons', description: 'Guías prácticas sobre powerups y operaciones con Whagons.' },
  en: { title: 'Whagons Blog', description: 'Practical guides to Whagons powerups and operations.' },
} as const;

export const dynamic = 'force-static';

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET(_request: Request, { params }: { params: { lang: string } }) {
  if (!isLanguage(params.lang)) return new Response('Not found', { status: 404 });
  const lang = params.lang;
  const items = getPosts(lang).map((post) => {
    const url = `${SITE}${postPath(post)}`;
    return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.standfirst)}</description>
      <category>${escape(post.category)}</category>
      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${channel[lang].title}</title>
    <link>${SITE}/${lang}/blog</link>
    <description>${channel[lang].description}</description>
    <language>${HTML_LANG[lang]}</language>
    <atom:link href="${SITE}/${lang}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
