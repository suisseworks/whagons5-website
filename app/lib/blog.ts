import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { Language } from './i18n';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
  readingTime: string;
  content: string;
  lang: Language;
  translationSlug?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
  readingTime: string;
  lang: Language;
  translationSlug?: string;
}

export function getBlogPosts(lang: Language): BlogPostMeta[] {
  const langDir = path.join(CONTENT_DIR, lang);

  if (!fs.existsSync(langDir)) {
    return [];
  }

  const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.mdx', '');
    const filePath = path.join(langDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || '',
      author: data.author || 'Whagons',
      tags: data.tags || [],
      coverImage: data.coverImage || undefined,
      coverImageAlt: data.coverImageAlt || undefined,
      readingTime: Math.ceil(stats.minutes).toString(),
      lang,
      translationSlug: data.translationSlug || undefined,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(lang: Language, slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, lang, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || '',
    author: data.author || 'Whagons',
    tags: data.tags || [],
    coverImage: data.coverImage || undefined,
    coverImageAlt: data.coverImageAlt || undefined,
    readingTime: Math.ceil(stats.minutes).toString(),
    content,
    lang,
    translationSlug: data.translationSlug || undefined,
  };
}

/**
 * Builds a bidirectional route map from frontmatter `translationSlug` fields.
 * English resources use `/en/resources`; Spanish articles use `/es/blog`.
 */
export function getSlugTranslationMap(): Record<string, string> {
  const map: Record<string, string> = {};

  for (const lang of ['es', 'en'] as Language[]) {
    const otherLang = lang === 'es' ? 'en' : 'es';
    const langDir = path.join(CONTENT_DIR, lang);
    if (!fs.existsSync(langDir)) continue;

    const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.mdx'));
    for (const file of files) {
      const slug = file.replace('.mdx', '');
      const filePath = path.join(langDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      if (data.translationSlug) {
        const targetFile = path.join(CONTENT_DIR, otherLang, `${data.translationSlug}.mdx`);
        if (!fs.existsSync(targetFile)) continue;

        const targetData = matter(fs.readFileSync(targetFile, 'utf-8')).data;
        if (targetData.translationSlug !== slug) continue;

        const sourcePath = lang === 'en' ? `/en/resources/${slug}` : `/es/blog/${slug}`;
        const targetPath = otherLang === 'en'
          ? `/en/resources/${data.translationSlug}`
          : `/es/blog/${data.translationSlug}`;

        map[sourcePath] = targetPath;
        if (!map[targetPath]) map[targetPath] = sourcePath;
      }
    }
  }

  return map;
}
