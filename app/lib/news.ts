// "What's new" / "Novedades": one MDX file per release in
// content/news/<lang>/<slug>.mdx with YAML frontmatter. A release and its
// translation share the same `translationKey`. Everything here runs at build
// time; the pages are fully static.
//
// Drafts (`draft: true`) are hidden unless NEWS_DRAFTS=1, the same way the blog
// uses BLOG_DRAFTS=1. While no release is published, the section does not
// exist on the site: the index and feed 404, and the footer and blog links are
// not rendered (see newsLangs.js).

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Language, SUPPORTED_LANGS } from './locales';

export interface ReleaseMeta {
  lang: Language;
  slug: string;
  title: string;
  /** One or two sentences; the index summary and the meta description. */
  summary: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  updated?: string;
  translationKey: string;
  /** Short label above the title, e.g. "Powerup" or "Improvement". */
  tag?: string;
  /** Product screenshot, 16:10 works best. A placeholder is shown in draft previews. */
  screenshot?: string;
  screenshotAlt?: string;
  /** 1200×630 social card. Falls back to the screenshot. */
  ogImage?: string;
  draft: boolean;
  /** Notes for the reviewer, shown on draft previews only. */
  reviewNotes: string[];
}

export interface Release extends ReleaseMeta {
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'news');
const SHOW_DRAFTS = process.env.NEWS_DRAFTS === '1';
export const NEWS_FALLBACK_IMAGE = '/images/industries/hoteleria.jpg';

function str(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function required(data: Record<string, unknown>, key: string, file: string): string {
  const value = str(data[key]);
  if (!value) throw new Error(`Release ${file} is missing frontmatter "${key}"`);
  return value;
}

function readRelease(lang: Language, file: string): Release | null {
  const { data, content } = matter(fs.readFileSync(path.join(CONTENT_DIR, lang, file), 'utf8'));
  const draft = data.draft === true;
  if (draft && !SHOW_DRAFTS) return null;
  const relative = `${lang}/${file}`;
  const date = required(data, 'date', relative);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Release ${relative} needs date as YYYY-MM-DD, got "${date}"`);
  }
  const notes = Array.isArray(data.reviewNotes) ? data.reviewNotes.map(String) : [];
  return {
    lang,
    slug: file.replace(/\.mdx$/, ''),
    title: required(data, 'title', relative),
    summary: required(data, 'summary', relative),
    date,
    updated: str(data.updated),
    translationKey: required(data, 'translationKey', relative),
    tag: str(data.tag),
    screenshot: str(data.screenshot),
    screenshotAlt: str(data.screenshotAlt),
    ogImage: str(data.ogImage),
    draft,
    reviewNotes: notes,
    body: content,
  };
}

const cache = new Map<Language, Release[]>();

function allReleases(lang: Language): Release[] {
  const cached = cache.get(lang);
  if (cached && process.env.NODE_ENV === 'production') return cached;
  const dir = path.join(CONTENT_DIR, lang);
  const releases = fs.existsSync(dir)
    ? fs.readdirSync(dir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => readRelease(lang, file))
      .filter((release): release is Release => release !== null)
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    : [];
  cache.set(lang, releases);
  return releases;
}

function meta(release: Release): ReleaseMeta {
  const { body: _body, ...rest } = release;
  return rest;
}

/** Newest first. */
export function getReleases(lang: Language): ReleaseMeta[] {
  return allReleases(lang).map(meta);
}

export function getRelease(lang: Language, slug: string): Release | null {
  return allReleases(lang).find((release) => release.slug === slug) ?? null;
}

export function getReleaseTranslations(release: ReleaseMeta): Partial<Record<Language, ReleaseMeta>> {
  const found: Partial<Record<Language, ReleaseMeta>> = {};
  for (const lang of SUPPORTED_LANGS) {
    if (lang === release.lang) continue;
    const match = allReleases(lang).find((candidate) => candidate.translationKey === release.translationKey);
    if (match) found[lang] = meta(match);
  }
  return found;
}

/** Index path per language: /en/whats-new and /es/novedades. */
export function newsIndexPath(lang: Language): string {
  return lang === 'es' ? '/es/novedades' : '/en/whats-new';
}

export function releasePath(release: Pick<ReleaseMeta, 'lang' | 'slug'>): string {
  return `${newsIndexPath(release.lang)}/${release.slug}`;
}

export function newsFeedPath(lang: Language): string {
  return `${newsIndexPath(lang)}/rss.xml`;
}
