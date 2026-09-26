'use client';

import { useState } from 'react';
import type { Language } from '../../lib/locales';
import type { FeedPost } from './feed';
import PostFeed from './PostFeed';

const copy = {
  es: {
    lead: 'Guías prácticas para sacarle provecho a cada powerup de Whagons, paso a paso y con animaciones.',
    min: 'min de lectura',
  },
  en: {
    lead: 'Practical guides to getting the most out of each Whagons powerup, step by step, with animations.',
    min: 'min read',
  },
} as const;

export default function BlogIndex({ lang, posts: allPosts }: { lang: Language; posts: FeedPost[] }) {
  const t = copy[lang];
  // The featured post leads the list; the rest stay newest first.
  const featured = allPosts.find((post) => post.featured);
  const posts = featured ? [featured, ...allPosts.filter((post) => post !== featured)] : allPosts;
  const withCover = posts.filter((post) => post.cover);
  const [preview, setPreview] = useState<FeedPost | undefined>(withCover.find((post) => post.featured) ?? withCover[0]);

  return (
    <div className="wrap g12 bi">
      <header className="bi-hd" data-rise="">
        <h1 className="bi-title">whagons<span>/</span>blog</h1>
        <p className="bi-lead">{t.lead}</p>
        {withCover.length > 0 && (
          <div aria-hidden="true">
            <div className="bi-preview">
              {withCover.map((post) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={post.href} src={post.cover} alt="" className={preview?.href === post.href ? 'on' : undefined} loading="lazy" decoding="async" />
              ))}
            </div>
            {preview && (
              <div className="bi-preview-cap"><span>{preview.categoryLabel}</span><span>{preview.readingMinutes} {t.min}</span></div>
            )}
          </div>
        )}
      </header>
      <div className="bi-list" data-rise="" style={{ ['--d' as string]: '.08s' }}>
        <PostFeed
          lang={lang}
          posts={posts}
          featureFirst
          onFocusPost={(post) => { if (post.cover) setPreview(post); }}
        />
      </div>
    </div>
  );
}
