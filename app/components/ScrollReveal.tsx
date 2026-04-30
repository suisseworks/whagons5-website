'use client';

import { useEffect } from 'react';

/**
 * ScrollReveal — initializes IntersectionObserver for elements with class `.r`
 * When they enter the viewport, adds `.in` to trigger CSS transitions.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px 12% 0px' }
    );

    const vh = window.innerHeight;

    document.querySelectorAll('.r').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const fullyAbove = rect.bottom <= 0;
      const intersectsViewport = rect.top < vh && rect.bottom > 0;
      if (fullyAbove || intersectsViewport) {
        el.classList.add('in');
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
