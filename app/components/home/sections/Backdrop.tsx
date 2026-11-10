'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Backdrop.module.css';

/**
 * A muted clip behind a dark band. It loads and plays only while the band is
 * on screen; with reduced motion or Save-Data the poster stays.
 */
export default function Backdrop({ src, poster, focus = '50% 50%' }: { src: string; poster: string; focus?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = wrap.current;
    const v = video.current;
    if (!node || !v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!v.getAttribute('src')) { v.src = src; v.load(); }
        v.muted = true;
        v.play().catch(() => setPlaying(false));
      } else v.pause();
    }, { threshold: 0.15 });
    io.observe(node);
    return () => io.disconnect();
  }, [src]);

  return <div ref={wrap} className={styles.backdrop} aria-hidden="true">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={poster} alt="" loading="lazy" decoding="async" style={{ objectPosition: focus }} />
    <video ref={video} muted playsInline loop preload="none" data-playing={playing || undefined} onPlaying={() => setPlaying(true)} style={{ objectPosition: focus }} />
  </div>;
}
