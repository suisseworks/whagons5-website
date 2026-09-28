import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts } from '../../lib/blog';
import { Language, OPEN_GRAPH_LOCALE, SUPPORTED_LANGS, isLanguage } from '../../lib/locales';
import BlogIndex from '../../components/blog/BlogIndex';
import { toFeedPost } from '../../components/blog/feed';
import '../../styles/blog.css';

const meta: Record<Language, { title: string; description: string }> = {
  es: {
    title: 'Blog: guías de powerups y operaciones',
    description: 'Guías prácticas para configurar y aprovechar cada powerup de Whagons en hoteles y equipos operativos, con animaciones paso a paso.',
  },
  en: {
    title: 'Blog: powerup guides and operations playbooks',
    description: 'Practical guides to setting up and getting the most out of each Whagons powerup in hotels and operations teams, with step-by-step animations.',
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Language = isLanguage(params.lang) ? params.lang : 'es';
  const url = `https://whagons.com/${lang}/blog`;
  const posts = getPosts(lang);
  const lead = posts.find((post) => post.featured) ?? posts[0];
  const image = lead?.ogImage ?? lead?.cover ?? '/images/industries/hoteleria.jpg';
  return {
    title: meta[lang].title,
    description: meta[lang].description,
    alternates: {
      canonical: url,
      languages: { es: 'https://whagons.com/es/blog', en: 'https://whagons.com/en/blog', 'x-default': 'https://whagons.com/en/blog' },
      types: { 'application/rss+xml': `https://whagons.com/${lang}/blog/rss.xml` },
    },
    openGraph: {
      title: `${meta[lang].title} | Whagons`,
      description: meta[lang].description,
      url,
      type: 'website',
      locale: OPEN_GRAPH_LOCALE[lang],
      siteName: 'Whagons',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta[lang].title} | Whagons`,
      description: meta[lang].description,
      images: [image],
    },
  };
}

export default function BlogPage({ params }: { params: { lang: string } }) {
  if (!isLanguage(params.lang)) notFound();
  const lang = params.lang;
  const posts = getPosts(lang).map((post) => toFeedPost(lang, post));
  return (
    <main className="blog">
      <BlogIndex lang={lang} posts={posts} />
    </main>
  );
}
