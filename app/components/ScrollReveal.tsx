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
      { threshold: 0.08 }
    );

    document.querySelectorAll('.r').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
