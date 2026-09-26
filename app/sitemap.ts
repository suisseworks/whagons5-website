import { MetadataRoute } from 'next';
import { getPosts, getTranslations, postPath } from './lib/blog';

const base = 'https://whagons.com';
const pairs = [
  ['/es', '/en'],
  ['/es/plataforma', '/en/platform'],
  ['/es/funcionalidades', '/en/features'],
  ['/es/operaciones-hoteleras', '/en/hotel-operations'],
  ['/es/industrias', '/en/industries'],
  ['/es/demo', '/en/demo'],
  ['/es/hotel-operations-score', '/en/hotel-operations-score'],
  ['/es/blog', '/en/blog'],
  ['/es/privacy', '/en/privacy'],
  ['/es/terms', '/en/terms'],
  ['/es/security', '/en/security'],
];

function blogEntries(): MetadataRoute.Sitemap {
  return (['es', 'en'] as const).flatMap((lang) => getPosts(lang).map((post) => {
    const languages: Record<string, string> = { [lang]: `${base}${postPath(post)}` };
    for (const [language, translation] of Object.entries(getTranslations(post))) {
      if (translation) languages[language] = `${base}${postPath(translation)}`;
    }
    return {
      url: `${base}${postPath(post)}`,
      lastModified: post.updated ?? post.date,
      alternates: { languages },
    };
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pairs.flatMap(([es, en]) => [es, en].map((path) => ({
      url: `${base}${path}`,
      alternates: { languages: { es: `${base}${es}`, en: `${base}${en}` } },
    }))),
    ...blogEntries(),
    { url: `${base}/en/handoff-scan` },
  ];
}
