// Blog content: MDX files in content/blog/<lang>/<slug>.mdx with YAML
// frontmatter. A post and its translation share the same `translationKey`.
// Everything here runs at build time; blog pages are fully static.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { Language, SUPPORTED_LANGS } from './locales';

export const BLOG_CATEGORIES = ['powerups', 'guides', 'product'] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

const CATEGORY_LABELS: Record<Language, Record<BlogCategory, string>> = {
  es: { powerups: 'Powerups', guides: 'Guías', product: 'Producto' },
  en: { powerups: 'Powerups', guides: 'Guides', product: 'Product' },
};

export interface PostMeta {
  lang: Language;
  slug: string;
  title: string;
  /** One or two sentences under the title; also the meta description. */
  standfirst: string;
  category: BlogCategory;
  author: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  updated?: string;
  translationKey: string;
  /** Powerup id from the app catalog, e.g. "nfc". */
  powerup?: string;
  /** 4:3 image shown next to the title. */
  cover?: string;
  /** Optional 4:3 looping animation for the cover; the image is its poster. */
  coverVideo?: string;
  coverAlt?: string;
  /** 1200×630 social card. Falls back to the cover. */
  ogImage?: string;
  featured?: boolean;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const SHOW_DRAFTS = process.env.BLOG_DRAFTS === '1';

function required(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  throw new Error(`Blog post ${file} is missing frontmatter "${key}"`);
}

function optional(data: Record<string, unknown>, key: string): string | undefined {
  const value = data[key];
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readPost(lang: Language, file: string): Post | null {
  const fullPath = path.join(CONTENT_DIR, lang, file);
  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
  if (data.draft === true && !SHOW_DRAFTS) return null;

  const relative = `${lang}/${file}`;
  const category = required(data, 'category', relative) as BlogCategory;
  if (!BLOG_CATEGORIES.includes(category)) {
    throw new Error(`Blog post ${relative} has unknown category "${category}"`);
  }
  const date = required(data, 'date', relative);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Blog post ${relative} needs date as YYYY-MM-DD, got "${date}"`);
  }

  return {
    lang,
    slug: file.replace(/\.mdx$/, ''),
    title: required(data, 'title', relative),
    standfirst: required(data, 'standfirst', relative),
    category,
    author: required(data, 'author', relative),
    date,
    updated: optional(data, 'updated'),
    translationKey: required(data, 'translationKey', relative),
    powerup: optional(data, 'powerup'),
    cover: optional(data, 'cover'),
    coverVideo: optional(data, 'coverVideo'),
    coverAlt: optional(data, 'coverAlt'),
    ogImage: optional(data, 'ogImage'),
    featured: data.featured === true,
    readingMinutes: Math.max(1, Math.round(readingTime(content, { wordsPerMinute: 210 }).minutes)),
    body: content,
  };
}

const cache = new Map<Language, Post[]>();

function allPosts(lang: Language): Post[] {
  const cached = cache.get(lang);
  if (cached && process.env.NODE_ENV === 'production') return cached;
  const dir = path.join(CONTENT_DIR, lang);
  const posts = fs.existsSync(dir)
    ? fs.readdirSync(dir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => readPost(lang, file))
      .filter((post): post is Post => post !== null)
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    : [];
  cache.set(lang, posts);
  return posts;
}

function meta(post: Post): PostMeta {
  const { body: _body, ...rest } = post;
  return rest;
}

/** Newest first. */
export function getPosts(lang: Language): PostMeta[] {
  return allPosts(lang).map(meta);
}

export function getPost(lang: Language, slug: string): Post | null {
  return allPosts(lang).find((post) => post.slug === slug) ?? null;
}

/** The same post in another language, if it has been translated. */
export function getTranslations(post: PostMeta): Partial<Record<Language, PostMeta>> {
  const found: Partial<Record<Language, PostMeta>> = {};
  for (const lang of SUPPORTED_LANGS) {
    if (lang === post.lang) continue;
    const match = allPosts(lang).find((candidate) => candidate.translationKey === post.translationKey);
    if (match) found[lang] = meta(match);
  }
  return found;
}

export function categoryLabel(lang: Language, category: BlogCategory): string {
  return CATEGORY_LABELS[lang][category];
}

export function postPath(post: Pick<PostMeta, 'lang' | 'slug'>): string {
  return `/${post.lang}/blog/${post.slug}`;
}

export function formatPostDate(lang: Language, iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-419' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date).replace('.', '');
}

/** Heading ids: lowercase ASCII, accents dropped, words joined by dashes. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'section';
}
