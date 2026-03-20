'use client';

import { MDXRemote } from 'next-mdx-remote';
import { translations, Language } from '../../../lib/i18n';
import ScrollReveal from '../../../components/ScrollReveal';
import type { BlogPost } from '../../../lib/blog';

interface BlogPostClientProps {
  post: BlogPost;
  lang: Language;
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
          <div className="blog-post-meta">
            <span>{post.author}</span>
            <span>{formattedDate}</span>
            <span>{post.readingTime} {t.blogReadTime}</span>
          </div>
        </header>

        <div className="blog-post-body r d1">
          <BlogContent content={post.content} />
        </div>

        <footer className="blog-post-footer r d2">
          <a href={`/${lang}/blog`} className="blog-back">{t.blogBack}</a>
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
