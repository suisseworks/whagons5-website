import { categoryLabel, formatPostDate, postPath, type BlogCategory, type PostMeta } from '../../lib/blog';
import type { Language } from '../../lib/locales';

/** Serializable post summary for client feed components. */
export interface FeedPost {
  href: string;
  title: string;
  standfirst: string;
  category: BlogCategory;
  categoryLabel: string;
  dateLabel: string;
  readingMinutes: number;
  author: string;
  featured: boolean;
  cover?: string;
  coverVideo?: string;
  coverAlt?: string;
}

export function toFeedPost(lang: Language, post: PostMeta): FeedPost {
  return {
    href: postPath(post),
    title: post.title,
    standfirst: post.standfirst,
    category: post.category,
    categoryLabel: categoryLabel(lang, post.category),
    dateLabel: formatPostDate(lang, post.date),
    readingMinutes: post.readingMinutes,
    author: post.author,
    featured: Boolean(post.featured),
    cover: post.cover,
    coverVideo: post.coverVideo,
    coverAlt: post.coverAlt,
  };
}
