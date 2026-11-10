import { demoOffer } from '../../lib/demo-offer';
import { Language, legalRouteFor, routeFor } from '../../lib/locales';
import { freeEvaluation } from '../../lib/free-evaluation';
import HospitalityAnalytics from '../hospitality/HospitalityAnalytics';
import Hero from './hero/Hero';
import Adapt from './sections/Adapt';
import Contexts from './sections/Contexts';
import HowItWorks from './sections/HowItWorks';
import CountUp from './CountUp';
import { CASE_URL, CUSTOMERS, HOME_CONTENT, TESTIMONIALS } from './content';
import styles from './HomePage.module.css';

/*
 * Home page: Whagons adapts to the business, not the other way around.
 * Hero (operations mosaic → the product), how it adapts, the same system in
 * different operations, what each person does in it, customers, questions
 * and the next step.
 */
export default function HomePage({ lang }: { lang: Language }) {
  const t = HOME_CONTENT[lang];
  const demo = demoOffer[lang];
  const evaluation = freeEvaluation[lang];
  const demoHref = routeFor(lang, 'demo');
  const evaluationHref = routeFor(lang, 'evaluation');
  const testimonials = TESTIMONIALS[lang];

  return (
    <main className={styles.page}>
      <Hero
        lang={lang}
        copy={{
          badge: t.hero.badge,
          titleA: t.hero.titleA,
          titleB: t.hero.titleB,
          lead: t.hero.lead,
          primary: { label: demo.cta, href: demoHref, track: 'demo_hero_click' },
          secondary: { label: evaluation.cta, href: evaluationHref, track: 'evaluation_hero_click' },
          mosaicLabel: t.hero.mosaicLabel,
          pause: t.hero.pause,
          play: t.hero.play,
        }}
      />

      {/* ── Customers ─────────────────────────────── */}
      <section className={styles.clients} aria-label={t.clients.label}>
        <span>{t.clients.label}</span>
        <div className={styles.marquee}>
          <ul>{CUSTOMERS.map((name) => <li key={name}>{name}</li>)}</ul>
          <ul aria-hidden="true">{CUSTOMERS.map((name) => <li key={name}>{name}</li>)}</ul>
        </div>
        <p className={styles.award}><span aria-hidden="true">★</span>{t.clients.award}</p>
      </section>

      <Adapt lang={lang} />
      <Contexts lang={lang} />
      <HowItWorks lang={lang} />

      {/* ── Proof ─────────────────────────────────── */}
      <section className={styles.proof} aria-labelledby="proof-title">
        <div className={styles.proofHead} data-reveal="">
          <p className={styles.eyebrow}>{t.proof.eyebrow}</p>
          <h2 id="proof-title">{t.proof.title}</h2>
        </div>
        <figure className={styles.feature} data-reveal="">
          <blockquote>{testimonials[1].quote}</blockquote>
          <figcaption><strong>{testimonials[1].name}</strong><span>{testimonials[1].role}</span></figcaption>
        </figure>
        <div className={styles.quotes}>
          {testimonials.filter((_, i) => i !== 1).map((item, i) => (
            <figure key={item.name} className={styles.quote} data-reveal="" style={{ ['--d' as string]: `${(i % 3) * 0.06}s` }}>
              <blockquote>{item.quote}</blockquote>
              <figcaption><strong>{item.name}</strong><span>{item.role}</span></figcaption>
            </figure>
          ))}
        </div>
        <p className={styles.source}>{demo.source}</p>

        <article className={styles.case} data-reveal="">
          <div>
            <p className={styles.eyebrow}>{t.proof.caseLabel}</p>
            <h3>{t.proof.caseTitle}</h3>
            <p>{t.proof.caseText}</p>
            <a href={CASE_URL} target="_blank" rel="noreferrer">{t.proof.caseLink} <span aria-hidden="true">↗</span></a>
          </div>
          <dl>
            {t.proof.caseMetrics.map(([value, label]) => (
              <div key={label}><dt>{label}</dt><dd><CountUp value={value} /></dd></div>
            ))}
          </dl>
        </article>
      </section>

      {/* ── FAQ ───────────────────────────────────── */}
      <section className={styles.faq} id="faq" aria-labelledby="faq-title">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: t.faq.items.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
          }) }}
        />
        <div className={styles.faqIntro} data-reveal="">
          <p className={styles.eyebrow}>{t.faq.eyebrow}</p>
          <h2 id="faq-title">{t.faq.title}</h2>
          <p>{t.faq.lead}</p>
          <div className={styles.faqContact}>
            <a className={styles.btnSecondary} href="#chat" data-chat-open="" data-track="chat_faq_click">{t.faq.chat}</a>
            <a href="mailto:hello@whagons.com">hello@whagons.com</a>
          </div>
        </div>
        <div className={styles.faqList} data-reveal="" style={{ ['--d' as string]: '.06s' }}>
          {t.faq.items.map(([question, answer], index) => (
            <details key={question} className={styles.faqItem}>
              <summary>{question}<span className={styles.faqIcon} aria-hidden="true" /></summary>
              <p>
                {answer}
                {index === t.faq.items.length - 1 && <> <a href={legalRouteFor(lang, 'security')}>{t.faq.security}</a></>}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Next step ─────────────────────────────── */}
      <section className={styles.final} aria-labelledby="final-title">
        <div className={styles.finalInner} data-reveal="">
          <p className={styles.finalEyebrow}>{t.final.eyebrow}</p>
          <h2 id="final-title">{t.final.title}</h2>
          <p className={styles.finalText}>{t.final.text}</p>
          <div className={styles.finalActions}>
            <a className={styles.btnPrimary} href={demoHref} data-track="demo_final_click">{demo.cta}<Arrow /></a>
            <a className={styles.btnGhost} href={evaluationHref} data-track="evaluation_final_click">{evaluation.cta}</a>
            <a className={styles.chatLink} href="#chat" data-chat-open="" data-track="chat_final_click">{t.final.chat}</a>
          </div>
          <p className={styles.finalNote}>{t.final.note}</p>
        </div>
      </section>

      <HospitalityAnalytics page="home" market={lang === 'es' ? 'latam' : 'us'} />
    </main>
  );
}

function Arrow() {
  return (
    <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
