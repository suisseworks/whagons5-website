import type { BlogPost } from '../lib/blog';

export default function BlogPostStructuredData({
  post,
  canonicalPath,
  language,
}: {
  post: BlogPost;
  canonicalPath: string;
  language: 'en-US' | 'es-419';
}) {
  const baseUrl = 'https://whagons.com';
  const coverImage = post.coverImage || '/images/industries/hoteleria.jpg';
  const imageUrl = /^https?:\/\//i.test(coverImage) ? coverImage : `${baseUrl}${coverImage}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: language,
    mainEntityOfPage: `${baseUrl}${canonicalPath}`,
    image: imageUrl,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: baseUrl,
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
