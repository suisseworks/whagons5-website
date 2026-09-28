import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {
  categoryLabel,
  formatPostDate,
  getPost,
  getPosts,
  getTranslations,
  postPath,
} from '../../../lib/blog';
import { HTML_LANG, Language, OPEN_GRAPH_LOCALE, SUPPORTED_LANGS, isLanguage, routeFor } from '../../../lib/locales';
import rehypeArticle, { type TocItem } from '../../../lib/rehype-article';
import ArticleRail from '../../../components/blog/ArticleRail';
import CoverMedia from '../../../components/blog/CoverMedia';
import PostFeed from '../../../components/blog/PostFeed';
import { toFeedPost } from '../../../components/blog/feed';
import { articleComponents } from '../../../components/blog/mdxComponents';
import '../../../styles/blog.css';

const SITE = 'https://whagons.com';

const copy = {
  es: {
    author: 'Autor', published: 'Publicado', reading: 'Lectura', powerup: 'Powerup', related: 'Más del blog',
    endLabel: 'Pruébalo en tu operación',
    endTitle: (name?: string) => (name ? `¿Quieres ver ${name} con tu equipo?` : '¿Quieres verlo con tu equipo?'),
    endText: 'En una demo configuramos el ejemplo con tus áreas, turnos y ubicaciones reales, y te mostramos qué ve cada rol.',
    demo: 'Solicitar una demo', all: 'Ver todos los artículos',
  },
  en: {
    author: 'Author', published: 'Published', reading: 'Reading time', powerup: 'Powerup', related: 'More from the blog',
    endLabel: 'Try it in your operation',
    endTitle: (name?: string) => (name ? `Want to see ${name} with your team?` : 'Want to see it with your team?'),
    endText: 'In a demo we set the example up with your real departments, shifts and locations, and show what each role sees.',
    demo: 'Request a demo', all: 'See all posts',
  },
} as const;

interface PageProps {
  params: { lang: string; slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) => getPosts(lang).map((post) => ({ lang, slug: post.slug })));
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isLanguage(params.lang)) return {};
  const post = getPost(params.lang, params.slug);
  if (!post) return {};
  const url = `${SITE}${postPath(post)}`;
  const languages: Record<string, string> = { [post.lang]: url };
  for (const [language, translation] of Object.entries(getTranslations(post))) {
    if (translation) languages[language] = `${SITE}${postPath(translation)}`;
  }
  const image = post.ogImage ?? post.cover;
  return {
    title: post.title,
    description: post.standfirst,
    authors: [{ name: post.author }],
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.standfirst,
      url,
      siteName: 'Whagons',
      locale: OPEN_GRAPH_LOCALE[post.lang],
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      section: categoryLabel(post.lang, post.category),
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.standfirst,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  if (!isLanguage(params.lang)) notFound();
  const lang: Language = params.lang;
  const post = getPost(lang, params.slug);
  if (!post) notFound();

  const t = copy[lang];
  const toc: TocItem[] = [];
  const { content } = await compileMDX({
    source: post.body,
    components: articleComponents(lang),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypeArticle, { toc, prefix: post.slug }]],
      },
    },
  });

  const url = `${SITE}${postPath(post)}`;
  const related = getPosts(lang)
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => toFeedPost(lang, candidate));
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.standfirst,
    inLanguage: HTML_LANG[lang],
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { '@type': 'Organization', name: post.author, url: SITE },
    publisher: { '@id': `${SITE}/#organization` },
    mainEntityOfPage: url,
    articleSection: categoryLabel(lang, post.category),
    ...(post.cover ? { image: `${SITE}${post.cover}` } : {}),
  };

  return (
    <main className="blog art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div id="topProg" aria-hidden="true" />
      <div className="wrap">
        <header className="art-hero g12">
          {post.cover && (
            <div className="art-cover" data-rise="">
              <CoverMedia image={post.cover} video={post.coverVideo} alt={post.coverAlt} eager />
            </div>
          )}
          <div className="art-hd">
            <a className="chip" href={routeFor(lang, 'blog')} data-rise="">{categoryLabel(lang, post.category)}</a>
            <h1 id="art-title" data-rise="" style={{ ['--d' as string]: '.04s' }}>{post.title}</h1>
            <p className="standfirst" data-rise="" style={{ ['--d' as string]: '.1s' }}>{post.standfirst}</p>
            <div className="art-meta" data-rise="" style={{ ['--d' as string]: '.16s' }}>
              <div className="m1"><div className="lbl">{t.author}</div><div className="vv"><span className="br" aria-hidden="true" />{post.author}</div></div>
              <div className="m2"><div className="lbl">{t.published}</div><div className="vv"><span className="br" aria-hidden="true" /><time dateTime={post.date}>{formatPostDate(lang, post.date)}</time></div></div>
              <div className="m3"><div className="lbl">{t.reading}</div><div className="vv"><span className="br" aria-hidden="true" />{post.readingMinutes} min</div></div>
              {post.powerup && (
                <div className="m4"><div className="lbl">{t.powerup}</div><div className="vv"><span className="br" aria-hidden="true" />{post.powerup}</div></div>
              )}
            </div>
          </div>
        </header>

        <div className="body-grid g12">
          <ArticleRail lang={lang} title={post.title} toc={toc} url={url} />
          <article className="prose" id="body">
            {content}
            <aside className="art-end" data-reveal="">
              <div className="lbl">{t.endLabel}</div>
              <p className="art-end-title">{t.endTitle(post.powerup)}</p>
              <p>{t.endText}</p>
              <div className="acts">
                <a className="btn" href={routeFor(lang, 'demo')} data-track="blog_article_demo_click">
                  {t.demo}
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <a className="tlink" href={routeFor(lang, 'blog')}>{t.all} <span className="arr" aria-hidden="true">→</span></a>
              </div>
            </aside>
          </article>
        </div>

        {related.length > 0 && (
          <section className="more-sec" aria-labelledby="related-title" data-reveal="">
            <h2 className="rel-lbl" id="related-title">{t.related}</h2>
            <PostFeed lang={lang} posts={related} />
          </section>
        )}
      </div>
    </main>
  );
}
