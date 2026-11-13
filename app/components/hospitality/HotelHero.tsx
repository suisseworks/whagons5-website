'use client';

import Hero, { type HeroCopy } from '../home/hero/Hero';
import type { Language } from '../../lib/locales';
import KeyCard from './KeyCard';
import { HOTEL_SCENE, HOTEL_TILES } from './hotelScene';

/**
 * The hotel page's hero: the home page's living mosaic with hotel scenes, a
 * hotel's screen behind it and the room's key card in place of the plug.
 */
export default function HotelHero({ lang, copy }: { lang: Language; copy: HeroCopy }) {
  return <Hero lang={lang} copy={copy} tiles={HOTEL_TILES} scene={HOTEL_SCENE} Connector={KeyCard} />;
}
