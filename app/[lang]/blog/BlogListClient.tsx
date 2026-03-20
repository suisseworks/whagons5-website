'use client';

import { translations, Language } from '../../lib/i18n';
import ScrollReveal from '../../components/ScrollReveal';
import type { BlogPostMeta } from '../../lib/blog';

interface BlogListClientProps {
  lang: Language;
  posts: BlogPostMeta[];
}

export default function BlogListClient({ lang, posts }: BlogListClientProps) {
  const t = translations[lang];

  return (
    <>
      <ScrollReveal />

      <section className="page-hero">
        <div className="page-hero-inner r">
          <h1 className="page-hero-title">{t.blogTitle}</h1>
          <p className="page-hero-desc">{t.blogSub}</p>
        </div>
      </section>

      <section className="blog-list">
        {posts.length === 0 ? (
          <p className="blog-empty">
            {lang === 'es'
              ? 'Próximamente publicaremos artículos sobre gestión operativa y automatización de procesos.'
              : 'Coming soon — articles on operations management and business process automation.'}
          </p>
        ) : (
          <div className="blog-grid">
            {posts.map((post, i) => (
              <a
                href={`/${lang}/blog/${post.slug}`}
                className={`blog-card r${i > 0 ? ` d${Math.min(i, 2)}` : ''}`}
                key={post.slug}
              >
                <div className="blog-card-tags">
                  {post.tags.map((tag) => (
                    <span className="blog-tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-desc">{post.description}</p>
                <div className="blog-card-meta">
                  <span>{new Date(post.date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>{post.readingTime} {t.blogReadTime}</span>
                </div>
                <span className="blog-card-cta">{t.blogReadMore} &rarr;</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
