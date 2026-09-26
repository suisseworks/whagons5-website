'use client';

import { useState } from 'react';
import type { Language } from '../../lib/locales';
import type { FeedPost } from '../blog/feed';
import CoverMedia from '../blog/CoverMedia';
import styles from './HomePage.module.css';

const copy = {
  es: { min: 'min' },
  en: { min: 'min' },
} as const;

/** Powerup guides on the home page: hovering a row swaps the preview. */
export default function HomeGuides({ lang, guides, label, allHref, allLabel }: {
  lang: Language;
  guides: FeedPost[];
  label: string;
  allHref: string;
  allLabel: string;
}) {
  const [active, setActive] = useState(0);
  const current = guides[active] ?? guides[0];

  return (
    <div className={`g12 ${styles.guides}`} data-reveal="">
      <a className={styles.guidePreview} href={current.href} tabIndex={-1} aria-hidden="true">
        {guides.map((guide, index) => guide.cover && (
          <span key={guide.href} className={`${styles.guideMedia}${index === active ? ` ${styles.guideMediaOn}` : ''}`}>
            <CoverMedia image={guide.cover} video={index === active ? guide.coverVideo : undefined} />
          </span>
        ))}
      </a>
      <div className={styles.guideList}>
        <p className="lbl">{label}</p>
        <div className="feed">
          {guides.map((guide, index) => (
            <a
              key={guide.href}
              className={`frow ${styles.guideRow}`}
              href={guide.href}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <span className={styles.guideTitle}>{guide.title}</span>
              <span className={styles.guideStd}>{guide.standfirst}</span>
              <span className={styles.guideMeta}>{guide.dateLabel} · {guide.readingMinutes} {copy[lang].min}</span>
            </a>
          ))}
        </div>
        <a className={`tlink ${styles.guideAll}`} href={allHref}>{allLabel} <span className="arr" aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}
