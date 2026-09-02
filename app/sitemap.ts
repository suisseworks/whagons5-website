import { MetadataRoute } from 'next';
import { getBlogPosts, getSlugTranslationMap } from './lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://whagons.com';
  const entries: MetadataRoute.Sitemap = [];

  const markets = [
    {
      lang: 'es',
      pages: [
        { path: '', priority: 1, freq: 'weekly' as const },
        { path: '/plataforma', priority: 0.9, freq: 'monthly' as const },
        { path: '/funcionalidades', priority: 0.9, freq: 'monthly' as const },
        { path: '/operaciones-hoteleras', priority: 0.9, freq: 'monthly' as const },
        { path: '/industrias', priority: 0.9, freq: 'monthly' as const },
        { path: '/demo', priority: 0.9, freq: 'monthly' as const },
        { path: '/blog', priority: 0.8, freq: 'weekly' as const },
        { path: '/privacy', priority: 0.4, freq: 'monthly' as const },
        { path: '/terms', priority: 0.4, freq: 'monthly' as const },
        { path: '/security', priority: 0.4, freq: 'monthly' as const },
      ],
    },
    {
      lang: 'en',
      pages: [
        { path: '', priority: 1, freq: 'weekly' as const },
        { path: '/platform', priority: 0.9, freq: 'monthly' as const },
        { path: '/features', priority: 0.9, freq: 'monthly' as const },
        { path: '/hotel-operations', priority: 0.9, freq: 'monthly' as const },
        { path: '/industries', priority: 0.7, freq: 'monthly' as const },
        { path: '/demo', priority: 0.9, freq: 'monthly' as const },
        { path: '/handoff-scan', priority: 0.9, freq: 'monthly' as const },
        { path: '/resources', priority: 0.8, freq: 'weekly' as const },
        { path: '/privacy', priority: 0.4, freq: 'monthly' as const },
        { path: '/terms', priority: 0.4, freq: 'monthly' as const },
        { path: '/security', priority: 0.4, freq: 'monthly' as const },
      ],
    },
  ];

  for (const market of markets) {
    for (const page of market.pages) {
      entries.push({
        url: `${baseUrl}/${market.lang}${page.path}`,
        changeFrequency: page.freq,
        priority: page.priority,
      });
    }
  }

  const blogPosts = [...getBlogPosts('en'), ...getBlogPosts('es')];
  const translationMap = getSlugTranslationMap();
  for (const post of blogPosts) {
    const articlePath = post.lang === 'en' ? `/en/resources/${post.slug}` : `/es/blog/${post.slug}`;
    if (post.lang === 'es' && !translationMap[articlePath]) continue;

    entries.push({
      url: `${baseUrl}${articlePath}`,
      lastModified: post.date,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
