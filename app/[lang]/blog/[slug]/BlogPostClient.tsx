'use client';

import { useState, useCallback } from 'react';
import { translations, Language } from '../../../lib/i18n';
import ScrollReveal from '../../../components/ScrollReveal';
import type { BlogPost } from '../../../lib/blog';

interface BlogPostClientProps {
  post: BlogPost;
  lang: Language;
}

function ShareButtons({ title, lang }: { title: string; lang: Language }) {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [url]);

  const openShare = useCallback((shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  }, []);

  return (
    <div className="blog-share">
      <span className="blog-share-label">{t.blogShare}</span>
      <div className="blog-share-buttons">
        <button
          className="blog-share-btn"
          onClick={() => openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
          aria-label="Share on LinkedIn"
          title="LinkedIn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </button>
        <button
          className="blog-share-btn"
          onClick={() => openShare(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`)}
          aria-label="Share on X"
          title="X"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
        <button
          className="blog-share-btn"
          onClick={copyLink}
          aria-label={t.blogShare}
          title={copied ? t.blogCopied : t.blogShare}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BlogPostClient({ post, lang }: BlogPostClientProps) {
  const t = translations[lang];

  const formattedDate = new Date(post.date).toLocaleDateString(
    lang === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      <ScrollReveal />

      <article className="blog-post">
        <header className="blog-post-header r">
          <a href={`/${lang}/blog`} className="blog-back">{t.blogBack}</a>
          <div className="blog-post-tags">
            {post.tags.map((tag) => (
              <span className="blog-tag" key={tag}>{tag}</span>
            ))}
          </div>
          <h1 className="blog-post-title">{post.title}</h1>
          <p className="blog-post-desc">{post.description}</p>
          <div className="blog-post-meta-row">
            <div className="blog-post-meta">
              <span>{post.author}</span>
              <span>{formattedDate}</span>
              <span>{post.readingTime} {t.blogReadTime}</span>
            </div>
            <ShareButtons title={post.title} lang={lang} />
          </div>
        </header>

        {post.coverImage && (
          <div className="blog-post-hero r d1">
            <img
              src={post.coverImage}
              alt={post.title}
              loading="eager"
            />
          </div>
        )}

        <div className={`blog-post-body r ${post.coverImage ? 'd2' : 'd1'}`}>
          <BlogContent content={post.content} />
        </div>

        <footer className="blog-post-footer r d2">
          <a href={`/${lang}/blog`} className="blog-back">{t.blogBack}</a>
          <ShareButtons title={post.title} lang={lang} />
          <a href={`/${lang}/demo`} className="cta-primary">
            {lang === 'es' ? 'Solicitar demo' : 'Request demo'} &rarr;
          </a>
        </footer>
      </article>
    </>
  );
}

function BlogContent({ content }: { content: string }) {
  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: mdxToHtml(content) }} />
  );
}

function mdxToHtml(mdx: string): string {
  let html = mdx;

  // Images — must come before links to avoid conflict with ![...](...)
  html = html.replace(
    /^!\[([^\]]*)\]\(([^)]+)\)\s*$/gm,
    '<figure class="prose-figure"><img src="$2" alt="$1" loading="lazy" /><figcaption>$1</figcaption></figure>'
  );

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Paragraphs — wrap standalone lines that aren't already HTML
  html = html.replace(/^(?!<[a-z/])((?!^\s*$).+)$/gm, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}
