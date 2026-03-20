'use client';

import Image from 'next/image';

const CLOSING_IMAGES = [
  '/images/costa-rica-beach.jpg',
  '/images/tropical-waterfall.jpg',
  '/images/colorful-toucan.jpg',
  '/images/golden-sunset.jpg',
  '/images/toucan-portrait.jpg',
  '/images/coffee-beans.jpg',
];

interface ClosingSectionProps {
  t: any;
  quoteIndex: number;
  imageIndex: number;
}

export default function ClosingSection({ t, quoteIndex, imageIndex }: ClosingSectionProps) {
  const closingImageUrl = CLOSING_IMAGES[imageIndex];

  return (
    <section id="closing">
      <div className="closing-inner r">
        <div className="closing-img-wrap">
          <Image
            src={closingImageUrl}
            alt={t.closingImageAlt}
            className="closing-img"
            width={1200}
            height={675}
            loading="lazy"
          />
          <div className="closing-overlay" />
          <blockquote className="closing-quote">
            <p className="closing-text">&ldquo;{t.closingQuotes[quoteIndex].text}&rdquo;</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
