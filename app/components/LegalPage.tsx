import Link from 'next/link';
import { Language } from '../lib/i18n';
import { LegalPageContent } from '../lib/legal';

interface LegalPageProps {
  lang: Language;
  content: LegalPageContent;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function LegalPage({ lang, content }: LegalPageProps) {
  const sections = content.sections.map((section, index) => ({ ...section, id: `${index + 1}-${slugify(section.title)}` }));

  return (
    <main className="pg">
      <section className="pg-hero">
        <div className="pg-hero-inner">
          <div className="pg-hero-copy">
            <p className="pg-eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p className="pg-lead">{content.intro}</p>
            <div className="pg-meta">
              <span>{content.updatedLabel}</span>
              <span>{content.updatedDate}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pg-section pg-section-tight pg-legal">
        <nav className="pg-toc" aria-label={lang === 'en' ? 'Contents' : 'Contenido'}>
          {sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>{section.title}</a>
          ))}
        </nav>
        <div className="pg-prose">
          {sections.map((section) => (
            <article id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="pg-cta">
        <div>
          <h2>{content.ctaTitle}</h2>
          <p className="pg-text">{content.ctaDescription}</p>
          <div className="pg-actions">
            <Link href={lang === 'en' ? '/en/handoff-scan' : `/${lang}/demo`} className="pg-btn">
              {lang === 'en' ? 'Request a hotel handoff scan' : content.primaryCta} &rarr;
            </Link>
            <a href="mailto:hello@whagons.com" className="pg-btn-secondary">
              {content.secondaryCta} {'↗'}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
