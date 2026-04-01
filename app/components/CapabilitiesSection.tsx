'use client';

import { Language } from '../lib/i18n';

interface CapabilitiesSectionProps {
  t: any;
  lang?: Language;
}

export default function CapabilitiesSection({ t, lang = 'es' }: CapabilitiesSectionProps) {
  return (
    <section id="how">
      <div className="cap-top r">
        <h2 className="cap-title">{t.capTitle}</h2>
        <div className="cap-sub">{t.capSub}</div>
      </div>
      <div className="cap-grid">
        {t.capabilities.map((cap: any, i: number) => (
          <div className={`cap-item r${i > 0 && i <= 2 ? ` d${i}` : ''}`} key={cap.num}>
            <div className="cap-num">{cap.num}</div>
            <h3 className="cap-name">{cap.name}</h3>
            <p className="cap-desc">{cap.desc}</p>
            {cap.tags?.length ? (
              <div className="cap-tags" aria-label={`${cap.name} capabilities`}>
                {cap.tags.map((tag: string) => (
                  <span className="cap-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <a href={`/${lang}/demo`} className="cap-item cap-cta">
          <div
            className="cap-cta-logo"
            style={{
              mask: 'url(/whagons.svg) no-repeat center / contain',
              WebkitMask: 'url(/whagons.svg) no-repeat center / contain',
            }}
          />
          <div className="cap-cta-text">{t.capMore}</div>
        </a>
      </div>
    </section>
  );
}
