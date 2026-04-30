'use client';

import Image from 'next/image';

interface ClosingSectionProps {
  t: any;
  quoteIndex: number;
}

export default function ClosingSection({ t, quoteIndex }: ClosingSectionProps) {
  return (
    <section id="closing">
      <div className="closing-inner r">
        <div className="closing-panel">
          <div className="closing-glow closing-glow--one" />
          <div className="closing-glow closing-glow--two" />
          <div className="closing-grid" />
          <div className="closing-shell">
            <div className="closing-main">
              <div className="closing-topline">
                <div className="closing-brand">
                  <Image
                    src="/images/logo-whagons-horizontal-red.svg"
                    alt="Whagons"
                    className="closing-logo"
                    width={800}
                    height={200}
                    sizes="200px"
                    loading="lazy"
                  />
                </div>
                <div className="closing-tags" aria-hidden="true">
                  <span>KPI</span>
                  <span>SLA</span>
                  <span>AI</span>
                  <span>API</span>
                </div>
              </div>
              <blockquote className="closing-quote">
                <p className="closing-text">&ldquo;{t.closingQuotes[quoteIndex].text}&rdquo;</p>
                <cite className="closing-author">{t.closingQuotes[quoteIndex].author}</cite>
              </blockquote>
            </div>
            <aside className="closing-viz" aria-hidden="true">
              <div className="closing-viz-head">
                <span className="closing-viz-dot" />
                <span>{t.closingLiveLabel}</span>
              </div>
              <div className="closing-viz-meter">
                {Array.from({ length: 14 }, (_, i) => (
                  <span
                    key={i}
                    className="closing-viz-bar"
                    style={{ animationDelay: `${i * 0.07}s` }}
                  />
                ))}
              </div>
              <div className="closing-viz-foot">
                <span className="closing-viz-spark" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
