// Shared pages for "What's new" (/en/whats-new) and "Novedades" (/es/novedades).
// The route files under app/[lang] are thin wrappers around these.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { formatPostDate } from '../../lib/blog';
import { HTML_LANG, Language, OPEN_GRAPH_LOCALE, routeFor } from '../../lib/locales';
import {
  NEWS_FALLBACK_IMAGE,
  ReleaseMeta,
  getRelease,
  getReleaseTranslations,
  getReleases,
  newsFeedPath,
  newsIndexPath,
  releasePath,
} from '../../lib/news';
import { articleComponents } from '../blog/mdxComponents';

const SITE = 'https://whagons.com';

const copy = {
  es: {
    section: 'Novedades',
    handle: 'novedades',
    title: 'Novedades de Whagons: lanzamientos y mejoras',
    description: 'Lo nuevo en Whagons, la plataforma de operaciones hoteleras: nuevas funciones, powerups y mejoras, con fecha y una explicación corta de cada cambio.',
    lead: 'Lo nuevo en Whagons: funciones, powerups y mejoras, cada uno con su fecha y lo que cambia para tu equipo.',
    rss: 'Suscribirse por RSS',
    read: 'Ver la novedad',
    published: 'Publicado',
    updated: 'Actualizado',
    type: 'Tipo',
    shotPending: 'Captura de pantalla pendiente',
    endLabel: 'Míralo en tu operación',
    endTitle: '¿Quieres verlo con tu equipo?',
    endText: 'En una demo lo configuramos con tus áreas, turnos y ubicaciones reales, y te mostramos qué ve cada rol.',
    demo: 'Solicitar una demo',
    all: 'Todas las novedades',
    blog: 'Ir al blog',
    home: 'Inicio',
    draftTitle: 'Borrador, no publicado',
    draftText: 'Esta página solo se ve en la vista previa de borradores. Revisa los datos antes de publicarla.',
    draftIndex: 'Vista previa con borradores: las novedades marcadas como borrador no están publicadas.',
    draftChip: 'Borrador',
  },
  en: {
    section: "What's new",
    handle: 'whats-new',
    title: "What's new in Whagons: releases and improvements",
    description: 'The latest in Whagons, the hotel operations platform: new features, powerups and improvements, each with its date and a short explanation of what changed.',
    lead: "What's new in Whagons: features, powerups and improvements, each with its date and what it changes for your team.",
    rss: 'Subscribe via RSS',
    read: 'Read the release',
    published: 'Published',
    updated: 'Updated',
    type: 'Type',
    shotPending: 'Screenshot pending',
    endLabel: 'See it in your operation',
    endTitle: 'Want to see it with your team?',
    endText: 'In a demo we set it up with your real departments, shifts and locations, and show what each role sees.',
    demo: 'Request a demo',
    all: 'All releases',
    blog: 'Go to the blog',
    home: 'Home',
    draftTitle: 'Draft, not published',
    draftText: 'This page only shows in the drafts preview. Check the facts before it goes live.',
    draftIndex: 'Drafts preview: releases marked as drafts are not published.',
    draftChip: 'Draft',
  },
} as const;

const otherLang = (lang: Language): Language => (lang === 'es' ? 'en' : 'es');

function absolute(src: string) {
  return src.startsWith('http') ? src : `${SITE}${src}`;
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

function Screenshot({ lang, release, eager }: { lang: Language; release: ReleaseMeta; eager?: boolean }) {
  if (release.screenshot) {
    return (
      <figure className="nw-shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={release.screenshot} alt={release.screenshotAlt ?? ''} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </figure>
    );
  }
  // Published releases without a screenshot simply leave the slot out.
  if (!release.draft) return null;
  return (
    <figure className="nw-shot nw-shot-empty" aria-label={copy[lang].shotPending}>
      <span className="lbl">{copy[lang].shotPending}</span>
      <span className="nw-shot-dim">1600 × 1000</span>
    </figure>
  );
}

function DraftNotice({ lang, notes }: { lang: Language; notes: string[] }) {
  const t = copy[lang];
  return (
    <aside className="nw-draft" role="note">
      <p className="nw-draft-title"><span className="chip chip-accent">{t.draftChip}</span>{t.draftTitle}</p>
      <p>{t.draftText}</p>
      {notes.length > 0 && <ul>{notes.map((note) => <li key={note}>{note}</li>)}</ul>}
    </aside>
  );
}

function DemoCta({ lang, track }: { lang: Language; track: string }) {
  const t = copy[lang];
  return (
    <aside className="art-end nw-end" data-reveal="">
      <div className="lbl">{t.endLabel}</div>
      <p className="art-end-title">{t.endTitle}</p>
      <p>{t.endText}</p>
      <div className="acts">
        <a className="btn" href={routeFor(lang, 'demo')} data-track={track}>{t.demo}<Arrow /></a>
        <a className="tlink" href={newsIndexPath(lang)}>{t.all} <span className="arr" aria-hidden="true">→</span></a>
      </div>
    </aside>
  );
}

// ── Index ───────────────────────────────────────────────

export function newsIndexMetadata(lang: Language): Metadata {
  const t = copy[lang];
  const releases = getReleases(lang);
  const url = `${SITE}${newsIndexPath(lang)}`;
  const lead = releases[0];
  const image = lead?.ogImage ?? lead?.screenshot ?? NEWS_FALLBACK_IMAGE;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: url,
      languages: {
        [lang]: url,
        [otherLang(lang)]: `${SITE}${newsIndexPath(otherLang(lang))}`,
        'x-default': `${SITE}${newsIndexPath('en')}`,
      },
      types: { 'application/rss+xml': `${SITE}${newsFeedPath(lang)}` },
    },
    ...(releases.some((release) => release.draft) ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: `${t.title} | Whagons`,
      description: t.description,
      url,
      type: 'website',
      locale: OPEN_GRAPH_LOCALE[lang],
      siteName: 'Whagons',
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: `${t.title} | Whagons`, description: t.description, images: [image] },
  };
}

export function NewsIndexPage({ lang }: { lang: Language }) {
  const t = copy[lang];
  const releases = getReleases(lang);
  // Nothing published yet: the section does not exist.
  if (releases.length === 0) notFound();
  const url = `${SITE}${newsIndexPath(lang)}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: t.title,
        description: t.description,
        inLanguage: HTML_LANG[lang],
        publisher: { '@id': `${SITE}/#organization` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: releases.map((release, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE}${releasePath(release)}`,
            name: release.title,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: `${SITE}${routeFor(lang, 'home')}` },
          { '@type': 'ListItem', position: 2, name: t.section, item: url },
        ],
      },
    ],
  };

  return (
    <main className="blog nw">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="wrap g12 bi">
        <header className="bi-hd nw-hd" data-rise="">
          <h1 className="bi-title">whagons<span>/</span>{t.handle}</h1>
          <p className="bi-lead">{t.lead}</p>
          <div className="nw-hd-acts">
            <a className="btn" href={routeFor(lang, 'demo')} data-track="news_index_demo_click">{t.demo}<Arrow /></a>
            <a className="tlink" href={newsFeedPath(lang)}>{t.rss} <span className="arr" aria-hidden="true">→</span></a>
            <a className="tlink" href={routeFor(lang, 'blog')}>{t.blog} <span className="arr" aria-hidden="true">→</span></a>
          </div>
        </header>
        <div className="bi-list nw-list" data-rise="" style={{ ['--d' as string]: '.08s' }}>
          {releases.some((release) => release.draft) && <p className="nw-draft-strip">{t.draftIndex}</p>}
          <ol className="nw-items">
            {releases.map((release) => (
              <li key={release.slug} className="nw-item">
                <a href={releasePath(release)} className="nw-card">
                  <span className="nw-date lbl"><time dateTime={release.date}>{formatPostDate(lang, release.date)}</time></span>
                  <span className="nw-main">
                    <span className="nw-chips">
                      {release.tag && <span className="chip">{release.tag}</span>}
                      {release.draft && <span className="chip chip-accent">{t.draftChip}</span>}
                    </span>
                    <span className="nw-title">{release.title}</span>
                    <span className="nw-sum">{release.summary}</span>
                    <span className="nw-more">{t.read} <span className="arr" aria-hidden="true">→</span></span>
                  </span>
                  <span className="nw-thumb"><Screenshot lang={lang} release={release} /></span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}

// ── One release ─────────────────────────────────────────

export function releaseParams(lang: Language) {
  return getReleases(lang).map((release) => ({ lang, slug: release.slug }));
}

export function releaseMetadata(lang: Language, slug: string): Metadata {
  const release = getRelease(lang, slug);
  if (!release) return {};
  const url = `${SITE}${releasePath(release)}`;
  const languages: Record<string, string> = { [lang]: url };
  for (const [language, translation] of Object.entries(getReleaseTranslations(release))) {
    if (translation) languages[language] = `${SITE}${releasePath(translation)}`;
  }
  const image = release.ogImage ?? release.screenshot ?? NEWS_FALLBACK_IMAGE;
  return {
    title: release.title,
    description: release.summary,
    alternates: { canonical: url, languages, types: { 'application/rss+xml': `${SITE}${newsFeedPath(lang)}` } },
    ...(release.draft ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: 'article',
      title: release.title,
      description: release.summary,
      url,
      siteName: 'Whagons',
      locale: OPEN_GRAPH_LOCALE[lang],
      publishedTime: release.date,
      modifiedTime: release.updated ?? release.date,
      section: copy[lang].section,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: release.title, description: release.summary, images: [image] },
  };
}

export async function ReleasePage({ lang, slug }: { lang: Language; slug: string }) {
  const release = getRelease(lang, slug);
  if (!release) notFound();
  const t = copy[lang];
  const { content } = await compileMDX({
    source: release.body,
    components: articleComponents(lang),
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  const url = `${SITE}${releasePath(release)}`;
  const image = absolute(release.screenshot ?? release.ogImage ?? NEWS_FALLBACK_IMAGE);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        headline: release.title,
        description: release.summary,
        inLanguage: HTML_LANG[lang],
        datePublished: release.date,
        dateModified: release.updated ?? release.date,
        image: [image],
        author: { '@type': 'Organization', name: 'Whagons', url: SITE },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE}/#organization`,
          name: 'Whagons',
          url: SITE,
          logo: { '@type': 'ImageObject', url: `${SITE}/images/logo-whagons-horizontal.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        articleSection: t.section,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: `${SITE}${routeFor(lang, 'home')}` },
          { '@type': 'ListItem', position: 2, name: t.section, item: `${SITE}${newsIndexPath(lang)}` },
          { '@type': 'ListItem', position: 3, name: release.title, item: url },
        ],
      },
    ],
  };
  const others = getReleases(lang).filter((candidate) => candidate.slug !== release.slug).slice(0, 4);

  return (
    <main className="blog art nw">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="wrap">
        <header className="nw-hero g12">
          <div className="nw-hero-hd">
            <div className="nw-crumbs lbl">
              <a href={newsIndexPath(lang)}>{t.section}</a><span aria-hidden="true">/</span><span>{release.tag ?? t.section}</span>
            </div>
            {release.draft && <DraftNotice lang={lang} notes={release.reviewNotes} />}
            <h1 id="art-title" data-rise="">{release.title}</h1>
            <p className="standfirst" data-rise="" style={{ ['--d' as string]: '.1s' }}>{release.summary}</p>
            <div className="art-meta" data-rise="" style={{ ['--d' as string]: '.16s' }}>
              <div className="m1"><div className="lbl">{t.published}</div><div className="vv"><span className="br" aria-hidden="true" /><time dateTime={release.date}>{formatPostDate(lang, release.date)}</time></div></div>
              {release.updated && (
                <div className="m2"><div className="lbl">{t.updated}</div><div className="vv"><span className="br" aria-hidden="true" /><time dateTime={release.updated}>{formatPostDate(lang, release.updated)}</time></div></div>
              )}
              {release.tag && (
                <div className="m3"><div className="lbl">{t.type}</div><div className="vv"><span className="br" aria-hidden="true" />{release.tag}</div></div>
              )}
            </div>
          </div>
          <div className="nw-hero-shot" data-rise="" style={{ ['--d' as string]: '.12s' }}>
            <Screenshot lang={lang} release={release} eager />
          </div>
        </header>

        <div className="body-grid g12">
          <article className="prose nw-prose" id="body">
            {content}
            <DemoCta lang={lang} track="news_release_demo_click" />
          </article>
        </div>

        {others.length > 0 && (
          <section className="more-sec" aria-labelledby="more-news" data-reveal="">
            <h2 className="rel-lbl" id="more-news">{t.all}</h2>
            <div className="feed">
              {others.map((other) => (
                <a key={other.slug} className="frow" href={releasePath(other)}>
                  <span className="f-l">{formatPostDate(lang, other.date)}</span>
                  <span className="f-t">{other.title}</span>
                  <span className="f-d">{other.tag ?? ''}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ── RSS ─────────────────────────────────────────────────

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function newsFeedResponse(lang: Language): Response {
  const t = copy[lang];
  const releases = getReleases(lang);
  if (releases.length === 0) return new Response('Not found', { status: 404 });
  const items = releases.map((release) => {
    const url = `${SITE}${releasePath(release)}`;
    return `    <item>
      <title>${escape(release.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(release.summary)}</description>
${release.tag ? `      <category>${escape(release.tag)}</category>\n` : ''}      <pubDate>${new Date(`${release.date}T12:00:00Z`).toUTCString()}</pubDate>
    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${t.section} · Whagons`)}</title>
    <link>${SITE}${newsIndexPath(lang)}</link>
    <description>${escape(t.description)}</description>
    <language>${HTML_LANG[lang]}</language>
    <lastBuildDate>${new Date(`${releases[0].updated ?? releases[0].date}T12:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}${newsFeedPath(lang)}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
