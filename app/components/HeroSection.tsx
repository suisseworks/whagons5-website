'use client';

import { Language } from '../lib/i18n';

interface HeroSectionProps {
  t: any;
  lang?: Language;
}

export default function HeroSection({ t, lang = 'es' }: HeroSectionProps) {
  return (
    <section id="hero">
      <div className="hero-bg-word" aria-hidden="true">{t.heroBgWord}</div>

      <div className="hero-ticker" aria-hidden="true">
        <span>{t.heroTicker1}</span>
        <span className="ticker-dot">&#9679;</span>
        <span>{t.heroTicker2}</span>
        <span className="ticker-dot">&#9679;</span>
        <span>{t.heroTicker3}</span>
      </div>

      <div className="hero-stamp">{t.heroStamp}</div>

      <div className="hero-scroll">
        <div className="scroll-line"></div>
        <div className="scroll-label">{t.heroScroll}</div>
      </div>

      <h1 className="hero-headline">
        <span className="hl-line"><span>{t.heroLine1}</span></span>
        <span className="hl-line outline"><span>{t.heroLine2}</span></span>
        <span className="hl-line accent"><span>{t.heroLine3}</span></span>
      </h1>

      <div className="hero-foot">
        <p className="hero-desc">{t.heroDesc}</p>
        <div className="hero-ctas">
          <a href="#brief" className="cta-primary">{t.heroCta1} &rarr;</a>
          <a href={`/${lang}/demo`} className="cta-ghost">{t.heroCta2} <span>{'\u2197'}</span></a>
        </div>
      </div>
    </section>
  );
}
