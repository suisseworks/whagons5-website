import { MetadataRoute } from 'next';
import { getPosts, getTranslations, postPath } from './lib/blog';
import { getReleaseTranslations, getReleases, newsIndexPath, releasePath } from './lib/news';

const base = 'https://whagons.com';
const pairs = [
  ['/es', '/en'],
  ['/es/plataforma', '/en/platform'],
  ['/es/funcionalidades', '/en/features'],
  ['/es/operaciones-hoteleras', '/en/hotel-operations'],
  ['/es/industrias', '/en/industries'],
  ['/es/demo', '/en/demo'],
  ['/es/evaluacion', '/en/evaluation'],
  ['/es/blog', '/en/blog'],
  ['/es/privacy', '/en/privacy'],
  ['/es/terms', '/en/terms'],
  ['/es/security', '/en/security'],
  ['/es/data-retention', '/en/data-retention'],
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

// "What's new" / "Novedades": the index of each language with a published
// release, plus every published release. Drafts never appear, even in a
// NEWS_DRAFTS=1 preview build.
function newsEntries(): MetadataRoute.Sitemap {
  const langs = (['es', 'en'] as const).filter((lang) => getReleases(lang).some((release) => !release.draft));
  const indexLanguages = Object.fromEntries(langs.map((lang) => [lang, `${base}${newsIndexPath(lang)}`]));
  const indexes = langs.map((lang) => ({
    url: `${base}${newsIndexPath(lang)}`,
    lastModified: getReleases(lang).find((release) => !release.draft)!.date,
    alternates: { languages: indexLanguages },
  }));
  const releases = langs.flatMap((lang) => getReleases(lang).filter((release) => !release.draft).map((release) => {
    const languages: Record<string, string> = { [lang]: `${base}${releasePath(release)}` };
    for (const [language, translation] of Object.entries(getReleaseTranslations(release))) {
      if (translation && !translation.draft) languages[language] = `${base}${releasePath(translation)}`;
    }
    return {
      url: `${base}${releasePath(release)}`,
      lastModified: release.updated ?? release.date,
      alternates: { languages },
    };
  }));
  return [...indexes, ...releases];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pairs.flatMap(([es, en]) => [es, en].map((path) => ({
      url: `${base}${path}`,
      alternates: { languages: { es: `${base}${es}`, en: `${base}${en}` } },
    }))),
    ...blogEntries(),
    ...newsEntries(),
    { url: `${base}/en/handoff-scan` },
  ];
}
