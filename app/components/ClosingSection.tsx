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
          <div className="closing-topline">
            <div className="closing-brand">
              <Image
                src="/whagons.svg"
                alt="Whagons"
                className="closing-logo"
                width={55}
                height={21}
                loading="lazy"
              />
              <span className="closing-brand-name">Whagons</span>
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
      </div>
    </section>
  );
}
