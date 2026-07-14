import { MetadataRoute } from 'next';
import { getAllBlogSlugs } from './lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://whagons.com';
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const markets = [
    {
      lang: 'es',
      pages: [
        { path: '', priority: 1, freq: 'weekly' as const },
        { path: '/plataforma', priority: 0.9, freq: 'monthly' as const },
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
        { path: '/hotel-operations', priority: 0.9, freq: 'monthly' as const },
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
        lastModified: now,
        changeFrequency: page.freq,
        priority: page.priority,
      });
    }
  }

  const blogSlugs = getAllBlogSlugs();
  for (const { lang, slug } of blogSlugs) {
    entries.push({
      url: lang === 'en'
        ? `${baseUrl}/en/resources/${slug}`
        : `${baseUrl}/es/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
