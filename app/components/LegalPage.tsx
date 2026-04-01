import Link from 'next/link';
import { Language } from '../lib/i18n';
import { LegalPageContent } from '../lib/legal';

interface LegalPageProps {
  lang: Language;
  content: LegalPageContent;
}

export default function LegalPage({ lang, content }: LegalPageProps) {
  return (
    <>
      <section className="page-hero legal-hero">
        <div className="page-hero-inner legal-hero-inner">
          <p className="eyebrow legal-eyebrow">{content.eyebrow}</p>
          <h1 className="page-hero-title">{content.title}</h1>
          <p className="page-hero-desc legal-intro">{content.intro}</p>
          <div className="legal-meta">
            <span>{content.updatedLabel}</span>
            <span>{content.updatedDate}</span>
          </div>
        </div>
      </section>

      <main className="legal-page">
        <div className="legal-content">
          {content.sections.map((section) => (
            <article className="legal-section" key={section.title}>
              <h2 className="legal-section-title">{section.title}</h2>
              <div className="prose legal-prose">
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
              </div>
            </article>
          ))}
        </div>
      </main>

      <section className="cta-bottom-section legal-cta">
        <div className="cta-bottom-inner">
          <h2 className="cta-bottom-title">{content.ctaTitle}</h2>
          <p className="cta-bottom-desc">{content.ctaDescription}</p>
          <div className="page-hero-ctas legal-cta-links">
            <Link href={`/${lang}/demo`} className="cta-primary">
              {content.primaryCta} &rarr;
            </Link>
            <a href="mailto:info@whagons.com" className="cta-ghost">
              {content.secondaryCta} {'\u2197'}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
