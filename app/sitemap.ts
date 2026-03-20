import { MetadataRoute } from 'next';
import { getAllBlogSlugs } from './lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://whagons.com';
  const now = new Date();

  const staticPages = [
    { path: '', priority: 1, freq: 'weekly' as const },
    { path: '/plataforma', priority: 0.9, freq: 'monthly' as const },
    { path: '/industrias', priority: 0.9, freq: 'monthly' as const },
    { path: '/demo', priority: 0.9, freq: 'monthly' as const },
    { path: '/blog', priority: 0.8, freq: 'weekly' as const },
  ];

  const langs = ['es', 'en'];

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of langs) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${lang}${page.path}`,
        lastModified: now,
        changeFrequency: page.freq,
        priority: page.priority,
        alternates: {
          languages: {
            es: `${baseUrl}/es${page.path}`,
            en: `${baseUrl}/en${page.path}`,
          },
        },
      });
    }
  }

  const blogSlugs = getAllBlogSlugs();
  for (const { lang, slug } of blogSlugs) {
    entries.push({
      url: `${baseUrl}/${lang}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
