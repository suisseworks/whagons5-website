import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Language, routeFor } from '../../lib/locales';
import IndustryMap from '../../components/industries/IndustryMap';
import { INDUSTRY_COLORS, industriesContent } from '../../components/industries/content';
import s from '../../components/industries/IndustriesPage.module.css';

// One page for every industry beyond hotels (which also has its own page):
// a live map of an example day, the four rules that never change, then one
// chapter per industry with the problem, a day in Whagons and what it tracks.

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="currentColor" opacity=".14" />
      <path d="M5.5 9.2 8 11.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function IndustriasPageClient({ lang }: { lang: Language }) {
  const t = industriesContent[lang === 'en' ? 'en' : 'es'];
  const demoHref = routeFor(lang, 'demo');
  const hotelHref = routeFor(lang, 'hotels');

  return (
    <main className={`pg ${s.page}`}>
      {/* ── Hero and live map ─────────────────────────── */}
      <section className={s.hero}>
        <div className={s.heroPhoto}>
          <Image src="/images/photos/industries-hero.jpg" alt={t.hero.photoAlt} fill priority sizes="(max-width: 900px) 100vw, 64vw" />
        </div>
        <div className={s.heroCopy}>
          <p className={s.eyebrow} data-rise=""><span aria-hidden="true" />{t.hero.eyebrow}</p>
          <h1 data-rise="" style={{ ['--d' as string]: '.05s' }}>{t.hero.title[0]} <em>{t.hero.title[1]}</em></h1>
          <p className={s.lead} data-rise="" style={{ ['--d' as string]: '.1s' }}>{t.hero.lead}</p>
          <div className={s.actions} data-rise="" style={{ ['--d' as string]: '.15s' }}>
            <a className={s.btnPrimary} href={demoHref}>{t.hero.cta}<Arrow /></a>
            <a className={s.btnGhost} href="#industry-list">{t.hero.jump}<span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <div className={s.mapIntro} data-reveal="">
          <div>
            <p className={s.mapEyebrow}>{t.map.eyebrow}</p>
            <h2>{t.map.title}</h2>
          </div>
          <p>{t.map.text}</p>
        </div>
        <div data-reveal="" style={{ ['--d' as string]: '.08s' }}>
          <IndustryMap t={t} ago={t.ago} />
        </div>
        <div className={s.points}>
          {t.map.points.map(([title, text], index) => (
            <article key={title} data-reveal="" style={{ ['--d' as string]: `${index * 0.08}s` }}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── What stays the same ───────────────────────── */}
      <section className={s.principles}>
        <div className={s.sectionIntro} data-reveal="">
          <p className={s.kicker}>{t.principles.eyebrow}</p>
          <h2>{t.principles.title}</h2>
        </div>
        <ol className={s.rules}>
          {t.principles.items.map(([name, rule, text], index) => (
            <li key={name} data-reveal="" style={{ ['--d' as string]: `${index * 0.07}s` }}>
              <span className={s.ruleNum}>0{index + 1}</span>
              <p className={s.ruleName}>{name}</p>
              <h3>{rule}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Industry chapters ─────────────────────────── */}
      <nav className={s.jump} aria-label={t.labels.nav}>
        {t.industries.map((industry) => (
          <a key={industry.slug} href={`#${industry.slug}`} style={{ '--c': INDUSTRY_COLORS[industry.slug] } as CSSProperties}><i aria-hidden="true" />{industry.short}</a>
        ))}
      </nav>

      <div id="industry-list">
        {t.industries.map((industry, index) => (
          <section key={industry.slug} id={industry.slug} className={s.chapter} style={{ '--c': INDUSTRY_COLORS[industry.slug] } as CSSProperties}>
            <header className={s.chapterHead} data-reveal="">
              <p className={s.chapterName}><span>0{index + 1}</span><i aria-hidden="true" />{industry.name}</p>
              <h2>{industry.headline}</h2>
              <p className={s.who}>{industry.who}</p>
            </header>

            <div className={s.chapterGrid}>
              <figure className={s.visual} data-reveal="">
                <Image src={`/images/industries/${industry.slug}.jpg`} alt="" fill sizes="(max-width: 900px) 100vw, 560px" />
                <div className={s.taskCard}>
                  <div className={s.taskTop}><span>{t.labels.task}</span><em>{industry.task.status}</em></div>
                  <strong>{industry.task.title}</strong>
                  <p className={s.taskPlace}>{industry.task.place}</p>
                  <dl>
                    <div><dt>{t.labels.owner}</dt><dd>{industry.task.owner}</dd></div>
                    <div><dt>{t.labels.due}</dt><dd>{industry.task.due}</dd></div>
                    <div><dt>{t.labels.evidence}</dt><dd>{industry.task.evidence}</dd></div>
                  </dl>
                </div>
              </figure>

              <div className={s.story} data-reveal="" style={{ ['--d' as string]: '.08s' }}>
                <div className={s.pain}>
                  <p className={s.label}>{t.labels.today}</p>
                  <p>{industry.pain}</p>
                </div>
                <p className={s.label}>{t.labels.day}</p>
                <ol className={s.timeline}>
                  {industry.day.map(([time, text]) => (
                    <li key={time}><time>{time}</time><p>{text}</p></li>
                  ))}
                </ol>
              </div>
            </div>

            <div className={s.facts} data-reveal="">
              <div>
                <h3>{t.labels.workflows}</h3>
                <ul className={s.checks}>{industry.workflows.map((item) => <li key={item}><Check />{item}</li>)}</ul>
              </div>
              <div>
                <h3>{t.labels.kpis}</h3>
                <ul className={s.tags}>{industry.kpis.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h3>{t.labels.capabilities}</h3>
                <ul className={s.tags} data-tone="solid">{industry.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h3>{t.labels.applications}</h3>
                <ul className={s.plain}>{industry.applications.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>

            {(industry.proof || industry.link) && (
              <div className={s.chapterFoot}>
                {industry.proof && <p className={s.proof}><Check />{industry.proof}</p>}
                {industry.link && <a className={s.link} href={hotelHref}>{industry.link}<Arrow /></a>}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className={s.cta}>
        <div className={s.ctaPanel} data-reveal="">
          <p className={s.mapEyebrow}>{t.cta.eyebrow}</p>
          <h2>{t.cta.title}</h2>
          <p>{t.cta.text}</p>
          <div className={s.actions}>
            <a className={s.btnPrimary} href={demoHref}>{t.cta.demo}<Arrow /></a>
            <a className={s.btnGhost} href="https://wa.me/50670717099" data-track="whatsapp_industries_click">{t.cta.whatsapp}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
