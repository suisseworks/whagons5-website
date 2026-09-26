'use client';

import { useMemo, useState } from 'react';
import type { Language } from '../../lib/locales';
import type { FeedPost } from './feed';

const copy = {
  es: { all: 'Todo', featured: 'Destacado', min: 'min', filter: 'Filtrar por categoría', empty: 'Todavía no hay artículos en esta categoría.' },
  en: { all: 'All', featured: 'Featured', min: 'min', filter: 'Filter by category', empty: 'No posts in this category yet.' },
} as const;

export function FeedRow({ post, lang, rich, onFocus }: {
  post: FeedPost;
  lang: Language;
  rich?: boolean;
  onFocus?: () => void;
}) {
  const t = copy[lang];
  if (rich) {
    return (
      <a className="frow is-featured" href={post.href} onMouseEnter={onFocus} onFocus={onFocus}>
        <span className="f-l">{post.dateLabel}</span>
        <span className="f-t">
          <span className="chip chip-accent">{t.featured}</span>
          <span style={{ display: 'block' }}>{post.title}</span>
          <span className="f-std">{post.standfirst}</span>
          <span className="f-sub"><span>{post.author}</span><span>{post.categoryLabel}</span></span>
        </span>
        <span className="f-d">{post.readingMinutes} {t.min}</span>
      </a>
    );
  }
  return (
    <a className="frow" href={post.href} onMouseEnter={onFocus} onFocus={onFocus}>
      <span className="f-l">{post.dateLabel}</span>
      <span className="f-t">{post.title}</span>
      <span className="f-d">{post.readingMinutes} {t.min}</span>
    </a>
  );
}

/** Category tabs plus feed rows. Used for related posts and the home page. */
export default function PostFeed({ lang, posts, tabs = true, onFocusPost, featureFirst = false }: {
  lang: Language;
  posts: FeedPost[];
  tabs?: boolean;
  featureFirst?: boolean;
  onFocusPost?: (post: FeedPost) => void;
}) {
  const t = copy[lang];
  const [filter, setFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const seen = new Map<string, { label: string; count: number }>();
    for (const post of posts) {
      const entry = seen.get(post.category) ?? { label: post.categoryLabel, count: 0 };
      entry.count += 1;
      seen.set(post.category, entry);
    }
    return Array.from(seen.entries());
  }, [posts]);

  const visible = filter === 'all' ? posts : posts.filter((post) => post.category === filter);

  return (
    <div>
      {tabs && (
        <div className="tabs-line">
          <div className="tabs" role="group" aria-label={t.filter}>
            <button type="button" className="tab" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
              {t.all}<span className="n">{posts.length}</span>
            </button>
            {categories.map(([category, { label, count }]) => (
              <button key={category} type="button" className="tab" aria-pressed={filter === category} onClick={() => setFilter(category)}>
                {label}<span className="n">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="feed">
        {visible.length === 0 && <div className="bi-empty">{t.empty}</div>}
        {visible.map((post, index) => (
          <FeedRow
            key={post.href}
            post={post}
            lang={lang}
            rich={featureFirst && filter === 'all' && index === 0 && post.featured}
            onFocus={onFocusPost ? () => onFocusPost(post) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
