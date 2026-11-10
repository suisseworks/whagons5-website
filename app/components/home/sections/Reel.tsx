'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Language } from '../../../lib/locales';
import { MEDIA, type MediaKey } from '../hero/media';
import styles from './Reel.module.css';

/*
 * "Built for work away from a desk": a wall of short clips and photos from
 * operations the hero doesn't open with. Each clip loads and plays only while
 * its tile is on screen; with reduced motion or Save-Data the posters stay.
 */
const copy = {
  es: {
    eyebrow: 'Donde se hace el trabajo',
    title: 'Hecho para el trabajo que no se hace en un escritorio.',
    lead: 'Cocinas, clínicas, aeropuertos, obras, cafeterías, jardines y hoteles: equipos que se mueven todo el día y necesitan ver lo mismo, al mismo tiempo.',
    note: 'Imágenes de referencia de distintos sectores.',
  },
  en: {
    eyebrow: 'Where the work happens',
    title: 'Built for work that doesn’t happen at a desk.',
    lead: 'Kitchens, clinics, airports, building sites, coffee shops, grounds and hotels: teams on the move all day who need to see the same thing at the same time.',
    note: 'Reference footage from different sectors.',
  },
} as const;

type Shape = 'big' | 'wide' | 'tall' | 'small';
const TILES: { key: MediaKey; shape: Shape; alt: Record<Language, string> }[] = [
  { key: 'airportRamp', shape: 'big', alt: { es: 'Un avión en la puerta de embarque, con la pasarela y un tractor de remolque en la rampa', en: 'A plane at the gate, with the jet bridge and a tug on the ramp' } },
  { key: 'kitchenGrill', shape: 'small', alt: { es: 'Un cocinero en la plancha de un restaurante', en: 'A cook at a restaurant grill' } },
  { key: 'welderHeight', shape: 'tall', alt: { es: 'Un soldador con arnés trabajando en altura', en: 'A welder in a harness working at height' } },
  { key: 'clinicReception', shape: 'small', alt: { es: 'Personal de una clínica reunido en la recepción', en: 'Clinic staff gathered at the reception desk' } },
  { key: 'restaurantService', shape: 'wide', alt: { es: 'Un mesero sirve platos en la barra de un restaurante', en: 'A server plates dishes at a restaurant counter' } },
  { key: 'roomInspection', shape: 'small', alt: { es: 'Una supervisora revisa una habitación de hotel', en: 'A supervisor checks a hotel room' } },
  { key: 'baristaShift', shape: 'small', alt: { es: 'Un barista prepara un café en la máquina', en: 'A barista makes a coffee at the machine' } },
  { key: 'hotelRoomService', shape: 'wide', alt: { es: 'Una habitación de hotel lista, con el desayuno servido', en: 'A hotel room ready, with breakfast served' } },
  { key: 'gardenerPlants', shape: 'small', alt: { es: 'Manos con guantes trasplantan una planta', en: 'Gloved hands repot a plant' } },
  { key: 'electrician', shape: 'small', alt: { es: 'Un técnico revisa una instalación eléctrica', en: 'A technician checks an electrical installation' } },
];

export default function Reel({ lang }: { lang: Language }) {
  const t = copy[lang];
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setMotion(!reduce.matches && !connection?.saveData);
    update();
    reduce.addEventListener('change', update);
    return () => reduce.removeEventListener('change', update);
  }, []);

  return <section className={styles.section} aria-labelledby="reel-title">
    <div className={styles.head} data-reveal="">
      <div>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 id="reel-title">{t.title}</h2>
      </div>
      <p className={styles.lead}>{t.lead}</p>
    </div>
    <ul className={styles.grid} data-reveal-kids="">
      {TILES.map(tile => <Tile key={tile.key} mediaKey={tile.key} shape={tile.shape} alt={tile.alt[lang]} lang={lang} motion={motion} />)}
    </ul>
    <p className={styles.note}>{t.note}</p>
  </section>;
}

function Tile({ mediaKey, shape, alt, lang, motion }: { mediaKey: MediaKey; shape: Shape; alt: string; lang: Language; motion: boolean }) {
  const m = MEDIA[mediaKey];
  const ref = useRef<HTMLLIElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (motion && inView) {
      if (!v.getAttribute('src')) { v.src = m.src; v.load(); }
      v.muted = true;
      v.play().catch(() => setPlaying(false));
    } else v.pause();
  }, [motion, inView, m.src]);

  const sizes = shape === 'big' || shape === 'wide' ? '(max-width: 640px) 92vw, (max-width: 999px) 92vw, 46vw' : '(max-width: 640px) 46vw, (max-width: 999px) 46vw, 23vw';
  return <li ref={ref} className={styles.tile} data-shape={shape}>
    {m.kind === 'video'
      ? <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.poster} alt={alt} loading="lazy" decoding="async" style={{ objectPosition: m.focus }} />
        <video ref={video} muted playsInline loop preload="none" data-playing={playing || undefined} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} style={{ objectPosition: m.focus }} aria-hidden="true" />
      </>
      : <Image src={m.src} alt={alt} fill sizes={sizes} className={styles.still} style={{ objectPosition: m.focus }} />}
    <span className={styles.label}>{m.label[lang]}</span>
  </li>;
}
