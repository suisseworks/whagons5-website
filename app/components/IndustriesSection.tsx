'use client';

import { Language } from '../lib/i18n';

interface IndustriesSectionProps {
  t: any;
  lang?: Language;
}

export default function IndustriesSection({ t, lang = 'es' }: IndustriesSectionProps) {
  return (
    <section id="industries">
      <div className="ind-top r">
        <h2 className="ind-title">{t.indTitle}</h2>
        <div className="ind-sub">{t.indSub}</div>
      </div>
      <div className="r">
        {t.industries.map((ind: any) => (
          <div className="ind-row" key={ind.num}>
            <span className="i-n">{ind.num}</span>
            <span className="i-name">{ind.name}</span>
            <span className="i-desc">{ind.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
