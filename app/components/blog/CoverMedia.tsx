'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cover image that becomes a muted looping animation when one is available
 * and the visitor has not asked for reduced motion.
 */
export default function CoverMedia({ image, video, alt = '', className, eager }: {
  image: string;
  video?: string;
  alt?: string;
  className?: string;
  eager?: boolean;
}) {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAnimate(!query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [video]);

  // Re-run when the source changes: the <video> element is replaced then.
  useEffect(() => {
    const el = ref.current;
    if (!el || !animate || !video) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => undefined);
      else el.pause();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [animate, video]);

  if (video && animate) {
    return (
      <video ref={ref} className={className} src={video} poster={image} muted loop playsInline preload="metadata" aria-label={alt || undefined} aria-hidden={alt ? undefined : true} />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={image} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}
