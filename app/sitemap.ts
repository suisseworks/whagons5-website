import { MetadataRoute } from 'next';

const base = 'https://whagons.com';
const pairs = [
  ['/es', '/en'],
  ['/es/plataforma', '/en/platform'],
  ['/es/funcionalidades', '/en/features'],
  ['/es/operaciones-hoteleras', '/en/hotel-operations'],
  ['/es/industrias', '/en/industries'],
  ['/es/demo', '/en/demo'],
  ['/es/privacy', '/en/privacy'],
  ['/es/terms', '/en/terms'],
  ['/es/security', '/en/security'],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pairs.flatMap(([es, en]) => [es, en].map((path) => ({
      url: `${base}${path}`,
      alternates: { languages: { es: `${base}${es}`, en: `${base}${en}` } },
    }))),
    { url: `${base}/en/handoff-scan` },
  ];
}
