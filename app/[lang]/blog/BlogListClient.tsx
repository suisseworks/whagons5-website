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
  const [featured, ...rest] = posts;

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
          <>
            {featured && (
              <a
                href={`/${lang}/blog/${featured.slug}`}
                className="blog-featured r"
              >
                {featured.coverImage && (
                  <div className="blog-featured-img">
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      loading="eager"
                    />
                  </div>
                )}
                <div className="blog-featured-content">
                  <div className="blog-card-tags">
                    {featured.tags.map((tag) => (
                      <span className="blog-tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                  <h2 className="blog-featured-title">{featured.title}</h2>
                  <p className="blog-featured-desc">{featured.description}</p>
                  <div className="blog-card-meta">
                    <span>{new Date(featured.date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>{featured.readingTime} {t.blogReadTime}</span>
                  </div>
                  <span className="blog-card-cta">{t.blogReadMore} &rarr;</span>
                </div>
              </a>
            )}

            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map((post, i) => (
                  <a
                    href={`/${lang}/blog/${post.slug}`}
                    className={`blog-card r${i > 0 ? ` d${Math.min(i, 2)}` : ''}`}
                    key={post.slug}
                  >
                    {post.coverImage && (
                      <div className="blog-card-img">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="blog-card-body">
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
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
