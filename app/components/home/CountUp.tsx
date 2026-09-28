'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts a figure such as "−80%" up from zero the first time it scrolls into
 * view. Values with more than one number, such as "2 días → 4 h", stay as
 * they are. Screen readers always get the final value.
 */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)(\d+)(\D*)$/);
    const el = ref.current;
    if (!match || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    let frame = 0;
    setShown(`${prefix}0${suffix}`);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - progress, 3);
        setShown(`${prefix}${Math.round(target * eased)}${suffix}`);
        if (progress < 1) frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true">{shown}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}
