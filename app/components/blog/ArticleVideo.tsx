'use client';

import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../lib/locales';

const copy = {
  es: { pause: 'Pausar', play: 'Reproducir', start: 'Ver animación' },
  en: { pause: 'Pause', play: 'Play', start: 'Play animation' },
} as const;

export interface ArticleVideoProps {
  lang: Language;
  /** File name without extension under /media/blog/<lang>/. */
  name: string;
  /** Figure letter shown in the caption, e.g. "A". */
  fig?: string;
  caption?: string;
  /** Spoken description of what the animation shows. */
  label: string;
  /** CSS aspect ratio of the video, e.g. "16 / 9". */
  ratio?: string;
  wide?: boolean;
}

/**
 * Looping, muted explainer animation. Plays while it is on screen and pauses
 * when scrolled away. With reduced motion it waits for a click.
 */
export default function ArticleVideo({ lang, name, fig, caption, label, ratio = '16 / 9', wide }: ArticleVideoProps) {
  const t = copy[lang];
  const base = `/media/blog/${lang}/${name}`;
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const figure = figureRef.current;
    if (!video || !figure) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      userPaused.current = true;
      setWaiting(true);
    }

    let frame = 0;
    const tick = () => {
      if (video.duration) figure.style.setProperty('--p', String(video.currentTime / video.duration));
      frame = window.requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      window.cancelAnimationFrame(frame);
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused.current) {
        video.play().catch(() => setWaiting(true));
      } else if (!entry.isIntersecting && !video.paused) {
        video.pause();
      }
    }, { threshold: 0.45 });
    io.observe(figure);

    return () => {
      io.disconnect();
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      setWaiting(false);
      video.play().catch(() => setWaiting(true));
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <figure ref={figureRef} className={`art-fig art-video${wide ? ' wide' : ''}`}>
      <div className="art-anim-box" style={{ ['--ratio' as string]: ratio }}>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={`${base}.jpg`}
          aria-label={label}
          onClick={toggle}
        >
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
        <button type="button" className="art-anim-play" hidden={!waiting || playing} onClick={toggle}>
          <span className="art-anim-pill"><span aria-hidden="true">▶</span>{t.start}</span>
        </button>
      </div>
      <figcaption className="cap">
        {fig && <b>FIG {fig}</b>}
        <button type="button" className="art-anim-toggle" onClick={toggle}>
          {playing ? t.pause : t.play}
        </button>
        {caption && <span>{caption}</span>}
      </figcaption>
    </figure>
  );
}
