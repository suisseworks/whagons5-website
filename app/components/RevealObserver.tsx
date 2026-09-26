'use client';

import { useEffect } from 'react';

declare global {
  interface Window { __whReveal?: boolean }
}

/** Adds `is-in` to every [data-reveal] element once it scrolls into view. */
export default function RevealObserver() {
  useEffect(() => {
    window.__whReveal = true;
    const root = document.documentElement;
    if (!('IntersectionObserver' in window)) {
      root.classList.add('no-reveal');
      return;
    }
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    // Client-side navigations (next/link) mount new content later.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
