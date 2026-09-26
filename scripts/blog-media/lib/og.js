// 1200×630 social card: brand, category, title, and a small piece of art
// supplied by the article (art(panel, s) draws into a 250×250 panel).
import { box, el } from './kit.js';

export function ogScene({ strings, art }) {
  return {
    size: [600, 315],
    duration: 1000,
    poster: 0,
    still: true,
    strings,
    build(stage, s) {
      stage.classList.add('dot-grid');
      const brand = box(stage, '', 34, 30, 300, 20);
      brand.style.cssText += ';display:flex;align-items:center;gap:10px';
      el('span', 'mark', brand);
      el('span', 'mono', brand, 'whagons/blog').style.cssText = 'font-size:13px;color:var(--ink)';
      const copy = box(stage, '', 34, 88, 300, 200);
      el('span', 'og-chip', copy, s.chip);
      el('div', 'og-title', copy, s.title).style.marginTop = '14px';
      const meta = box(stage, 'og-meta', 34, 272, 300, 16, s.meta);
      meta.style.whiteSpace = 'nowrap';
      const panel = box(stage, 'win', 336, 32, 236, 251);
      art(panel, s);
      return () => {};
    },
  };
}
