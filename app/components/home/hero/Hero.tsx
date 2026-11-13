'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ComponentType, type RefObject } from 'react';
import type { Language } from '../../../lib/locales';
import { appFont } from '../../product/appFont';
import ProductScene, { type SceneFrame } from './ProductScene';
import Socket from './Socket';
import { MEDIA, TILES as HOME_TILES, type MediaKey, type MosaicTile } from './media';
import { SCENE_COPY, SCENE_LENGTH, SCRIPT, TYPE_START, TYPE_STEP, type SceneCopy } from './scenarios';
import styles from './Hero.module.css';

/*
 * The home hero. A mosaic of real operations (photos and short silent clips)
 * changes one tile at a time, then every tile turns over in a cascade and the
 * backs line up into one Whagons screen, where a task is created, assigned,
 * started and closed. After a quiet hold it turns back to new footage.
 *
 * Plugging the cable into the socket sends a pulse into the mosaic and
 * starts the reveal from wherever the sequence is. Every timing runs on a
 * clock that stops while paused, off screen or in a background tab.
 *
 * The hotel page uses the same hero with its own tiles, its own screen and a
 * key card in place of the plug (hospitality/HotelHero.tsx).
 */

export interface HeroCopy {
  badge: string;
  titleA: string;
  titleB: string;
  lead: string;
  primary: { label: string; href: string; track: string };
  secondary: { label: string; href: string; track: string };
  mosaicLabel: string;
  pause: string;
  play: string;
}

/** What the hero gives the control that connects it: the home page's socket, the hotel page's key card. */
export interface ConnectorProps {
  lang: Language;
  connected: boolean;
  onConnect: (via: 'drag' | 'click' | 'keyboard') => void;
  onDisconnect: () => void;
  heroRef: RefObject<HTMLElement>;
  /** Where the connection enters the mosaic. */
  portRef: RefObject<HTMLElement>;
  reducedMotion: boolean;
  /** Increments to send a pulse of light towards the mosaic. */
  pulse: number;
  onPulseArrive: () => void;
}

interface Props {
  lang: Language;
  copy: HeroCopy;
  /** The mosaic's tiles and their media. */
  tiles?: MosaicTile[];
  /** The screen the mosaic turns into. */
  scene?: SceneCopy;
  Connector?: ComponentType<ConnectorProps>;
}

type Phase = 'intro' | 'mosaic' | 'charge' | 'flip' | 'scene' | 'hold' | 'return';
type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const VISIBLE: Record<Breakpoint, MosaicTile['id'][]> = {
  mobile: ['a', 'c', 'd', 'g'],
  tablet: ['a', 'b', 'c', 'd', 'e', 'f'],
  desktop: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
};
const VIDEO_CAP: Record<Breakpoint, number> = { mobile: 2, tablet: 3, desktop: 4 };
const FLIP_MS = 1150;
const CASCADE_MS = 560;
const FADE_MS = 480;

class Clock {
  now = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private seq = 0;
  private tasks: { at: number; fn: () => void; id: number; group: string }[] = [];
  setRunning(on: boolean) {
    if (on === this.running) return;
    this.running = on;
    cancelAnimationFrame(this.raf);
    if (on) { this.last = performance.now(); this.raf = requestAnimationFrame(this.tick); }
  }
  private tick = (ts: number) => {
    this.now += Math.min(64, Math.max(0, ts - this.last));
    this.last = ts;
    const due = this.tasks.filter(t => t.at <= this.now).sort((a, b) => a.at - b.at || a.id - b.id);
    if (due.length) {
      this.tasks = this.tasks.filter(t => t.at > this.now);
      due.forEach(t => t.fn());
    }
    if (this.running) this.raf = requestAnimationFrame(this.tick);
  };
  after(delay: number, fn: () => void, group = 'main') { this.tasks.push({ at: this.now + delay, fn, id: ++this.seq, group }); }
  cancel(group: string) { this.tasks = this.tasks.filter(t => t.group !== group); }
  dispose() { cancelAnimationFrame(this.raf); this.tasks = []; this.running = false; }
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function Hero({ lang, copy, tiles = HOME_TILES, scene, Connector = Socket }: Props) {
  const sceneCopy = scene ?? SCENE_COPY[lang];
  const scenarios = sceneCopy.scenarios;
  const heroRef = useRef<HTMLElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const portRef = useRef<HTMLSpanElement>(null);
  const clock = useRef<Clock | null>(null);
  if (!clock.current) clock.current = new Clock();

  const [phase, setPhase] = useState<Phase>('intro');
  const phaseRef = useRef<Phase>('intro');
  const go = (next: Phase) => { phaseRef.current = next; setPhase(next); };

  const [indices, setIndices] = useState<number[]>(() => tiles.map(() => 0));
  const indicesRef = useRef(indices);
  indicesRef.current = indices;
  const [face, setFace] = useState<0 | 180 | 360>(0);
  const [instant, setInstant] = useState(false);
  const [lift, setLift] = useState<'' | 'a' | 'b'>('');
  const [glow, setGlow] = useState<'' | 'a' | 'b'>('');
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [frame, setFrame] = useState<SceneFrame>({ scenario: 0, beat: 'idle', typed: 0 });
  const frameRef = useRef(frame);
  frameRef.current = frame;
  const [slice, setSlice] = useState<SceneFrame>({ scenario: 0, beat: 'idle', typed: 0 });
  const [sceneOn, setSceneOn] = useState(false);
  const [sceneFade, setSceneFade] = useState(false);
  const scenarioRef = useRef(0);

  const [connected, setConnected] = useState(false);
  const connectedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);
  // Nothing plays until the motion and data preferences are known.
  const [envReady, setEnvReady] = useState(false);
  const [bp, setBp] = useState<Breakpoint>('desktop');
  const bpRef = useRef<Breakpoint>('desktop');
  bpRef.current = bp;
  const [cablePulse, setCablePulse] = useState(0);
  const [scenePulse, setScenePulse] = useState(0);
  const [geo, setGeo] = useState<{ w: number; h: number; tiles: Record<string, { x: number; y: number; w: number; h: number }> }>({ w: 0, h: 0, tiles: {} });
  const lastSwap = useRef<string>('');
  const turningBack = useRef(false);

  /* ── Environment ──────────────────────────────────── */
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');
    const tablet = window.matchMedia('(max-width: 1099px)');
    const update = () => {
      setReducedMotion(motion.matches);
      setBp(mobile.matches ? 'mobile' : tablet.matches ? 'tablet' : 'desktop');
    };
    update();
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    setSaveData(!!connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ''));
    setEnvReady(true);
    motion.addEventListener('change', update);
    mobile.addEventListener('change', update);
    tablet.addEventListener('change', update);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.12 });
    if (heroRef.current) io.observe(heroRef.current);
    return () => {
      motion.removeEventListener('change', update);
      mobile.removeEventListener('change', update);
      tablet.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, []);

  // Tile positions inside the mosaic, for the scene slices on their backs.
  useEffect(() => {
    const mosaic = mosaicRef.current;
    if (!mosaic) return;
    const measure = () => {
      const tiles: Record<string, { x: number; y: number; w: number; h: number }> = {};
      mosaic.querySelectorAll<HTMLElement>('[data-tile]').forEach(el => {
        tiles[el.dataset.tile!] = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
      });
      setGeo({ w: mosaic.clientWidth, h: mosaic.clientHeight, tiles });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(mosaic);
    return () => ro.disconnect();
  }, []);

  const running = inView && pageVisible && !paused && !reducedMotion;
  useEffect(() => { clock.current!.setRunning(running); }, [running]);
  useEffect(() => () => clock.current!.dispose(), []);

  /* ── The sequence ─────────────────────────────────── */
  const visibleTiles = useCallback(() => tiles.filter(t => VISIBLE[bpRef.current].includes(t.id)), [tiles]);
  const isVideo = (tile: MosaicTile, index: number) => MEDIA[tile.pool[index % tile.pool.length]].kind === 'video';
  const isHotel = (tile: MosaicTile, index: number) => MEDIA[tile.pool[index % tile.pool.length]].label.en.startsWith('Hospitality');

  /** The tile's next item, skipping hospitality while another visible tile already shows it. */
  const nextFor = useCallback((tile: MosaicTile, idx: number[]) => {
    const i = tiles.indexOf(tile);
    const others = visibleTiles().filter(t => t !== tile);
    const hotelShown = others.some(t => isHotel(t, idx[tiles.indexOf(t)]));
    for (let step = 1; step <= tile.pool.length; step++) {
      if (!hotelShown || !isHotel(tile, idx[i] + step)) return idx[i] + step;
    }
    return idx[i] + 1;
  }, [tiles, visibleTiles]);

  const swapOne = useCallback(() => {
    const shown = visibleTiles();
    const idx = indicesRef.current;
    const videos = shown.filter(t => isVideo(t, idx[tiles.indexOf(t)])).length;
    const options = shown.filter(t => t.id !== lastSwap.current);
    for (let attempt = 0; attempt < 6; attempt++) {
      const tile = options[Math.floor(Math.random() * options.length)];
      if (!tile) return;
      const i = tiles.indexOf(tile);
      const next = nextFor(tile, idx);
      const adds = isVideo(tile, next) && !isVideo(tile, idx[i]);
      if (adds && videos >= VIDEO_CAP[bpRef.current]) continue;
      lastSwap.current = tile.id;
      setIndices(prev => prev.map((v, j) => j === i ? next : v));
      return;
    }
  }, [tiles, nextFor, visibleTiles]);

  const tileDelay = useCallback((o: { x: number; y: number }) => {
    const entries = Object.entries(geo.tiles);
    const dist = (t: { x: number; y: number; w: number; h: number }) => Math.hypot(t.x + t.w / 2 - o.x, t.y + t.h / 2 - o.y);
    const max = Math.max(1, ...entries.map(([, t]) => dist(t)));
    return Object.fromEntries(entries.map(([id, t]) => [id, Math.round((dist(t) / max) * CASCADE_MS)]));
  }, [geo]);

  const startMosaic = useCallback((first: boolean) => {
    const c = clock.current!;
    go('mosaic');
    c.cancel('mosaic');
    const swap = () => { if (phaseRef.current !== 'mosaic') return; swapOne(); c.after(rand(2300, 3400), swap, 'mosaic'); };
    c.after(first ? 1500 : 1900, swap, 'mosaic');
    c.after(first ? 14500 : 13500, () => flipToScene('auto'), 'mosaic');
  }, [swapOne]); // eslint-disable-line react-hooks/exhaustive-deps

  const playScene = useCallback(() => {
    const c = clock.current!;
    c.cancel('scene');
    const scenario = scenarioRef.current;
    const title = scenarios[scenario].task.title;
    setFrame({ scenario, beat: 'idle', typed: 0 });
    for (const [at, beat] of SCRIPT) c.after(at, () => setFrame(f => ({ ...f, scenario, beat })), 'scene');
    for (let i = 1; i <= title.length; i++) c.after(TYPE_START + i * TYPE_STEP, () => setFrame(f => ({ ...f, typed: i })), 'scene');
    c.after(SCENE_LENGTH, () => {
      go('hold');
      c.after(connectedRef.current ? 6500 : 7800, () => connectedRef.current ? nextInPlace() : returnToMosaic(), 'scene');
    }, 'scene');
  }, [scenarios]); // eslint-disable-line react-hooks/exhaustive-deps

  /** While plugged in, the screen moves on to another team instead of turning back. */
  const nextInPlace = useCallback(() => {
    const c = clock.current!;
    setSceneFade(true);
    c.after(420, () => {
      scenarioRef.current = (scenarioRef.current + 1) % scenarios.length;
      setFrame({ scenario: scenarioRef.current, beat: 'idle', typed: 0 });
      setSceneFade(false);
      go('scene');
      c.after(700, playScene, 'scene');
    }, 'scene');
  }, [scenarios, playScene]);

  const flipToScene = useCallback((source: 'auto' | 'plug') => {
    const c = clock.current!;
    if (phaseRef.current !== 'mosaic' && phaseRef.current !== 'intro') return;
    c.cancel('mosaic');
    const scenario = scenarioRef.current;
    const start: SceneFrame = { scenario, beat: 'idle', typed: 0 };
    setSlice(start);
    setFrame(start);
    const port = portRef.current?.getBoundingClientRect();
    const mosaic = mosaicRef.current?.getBoundingClientRect();
    const o = source === 'plug' && port && mosaic
      ? { x: port.left - mosaic.left + port.width / 2, y: port.top - mosaic.top }
      : { x: 0, y: 0 };
    setOrigin(o);
    const turn = () => {
      setLift(l => l === 'a' ? 'b' : 'a');
      setFace(180);
      go('flip');
      c.after(FLIP_MS + CASCADE_MS + 60, () => {
        setSceneOn(true);
        c.after(FADE_MS, () => { go('scene'); playScene(); }, 'flip');
      }, 'flip');
    };
    if (source === 'plug') {
      go('charge');
      setGlow(g => g === 'a' ? 'b' : 'a');
      c.after(640, turn, 'flip');
    } else turn();
  }, [playScene]);

  const returnToMosaic = useCallback(() => {
    const c = clock.current!;
    c.cancel('scene');
    go('return');
    const unfinished = frameRef.current.beat !== 'end';
    const end = () => {
      const scenario = scenarioRef.current;
      setSlice({ scenario, beat: 'end', typed: 99 });
      setSceneOn(false);
      c.after(FADE_MS, () => {
        turningBack.current = true;
        // New footage on every front while the tiles still show their backs.
        setIndices(prev => {
          const next = [...prev];
          for (const tile of tiles) next[tiles.indexOf(tile)] = nextFor(tile, next);
          return next;
        });
        const m = mosaicRef.current;
        setOrigin({ x: m?.clientWidth ?? 0, y: m?.clientHeight ?? 0 });
        setLift(l => l === 'a' ? 'b' : 'a');
        setFace(360);
        c.after(FLIP_MS + CASCADE_MS + 80, () => {
          turningBack.current = false;
          setInstant(true);
          setFace(0);
          requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
          scenarioRef.current = (scenario + 1) % scenarios.length;
          startMosaic(false);
        }, 'return');
      }, 'return');
    };
    if (unfinished) {
      setFrame(f => ({ ...f, beat: 'end', typed: 99 }));
      c.after(800, end, 'return');
    } else end();
  }, [tiles, scenarios, nextFor, startMosaic]);

  const reverseReturn = useCallback(() => {
    const c = clock.current!;
    c.cancel('return');
    if (!turningBack.current) {
      // Still on the backs: just bring the screen back.
      setSceneOn(true);
      go('hold');
      c.after(5200, nextInPlace, 'scene');
      return;
    }
    turningBack.current = false;
    setLift(l => l === 'a' ? 'b' : 'a');
    setFace(180);
    go('flip');
    c.after(FLIP_MS + 120, () => {
      setSceneOn(true);
      c.after(FADE_MS, () => { go('hold'); c.after(5200, nextInPlace, 'scene'); }, 'flip');
    }, 'flip');
  }, [nextInPlace]);

  // Opening: the tiles rise in, then the mosaic starts to change.
  useEffect(() => {
    if (reducedMotion) { go('mosaic'); return; }
    const c = clock.current!;
    c.after(1500, () => startMosaic(true), 'intro');
    return () => c.cancel('intro');
  }, [reducedMotion, startMosaic]);

  /* ── The plug ─────────────────────────────────────── */
  const onConnect = useCallback(() => {
    // Plugged straight back in: the screen stays.
    clock.current!.cancel('leave');
    connectedRef.current = true;
    setConnected(true);
    setPaused(false);
    setCablePulse(p => p + 1);
  }, []);

  const onPulseArrive = useCallback(() => {
    if (reducedMotion) {
      setFrame({ scenario: 0, beat: 'end', typed: 99 });
      setSceneOn(true);
      return;
    }
    const c = clock.current!;
    switch (phaseRef.current) {
      case 'intro':
      case 'mosaic':
        c.cancel('intro');
        flipToScene('plug');
        break;
      case 'scene':
        setScenePulse(p => p + 1);
        break;
      case 'hold':
        setScenePulse(p => p + 1);
        c.cancel('scene');
        c.after(6000, nextInPlace, 'scene');
        break;
      case 'return':
        reverseReturn();
        break;
      default:
        break; // already turning over
    }
  }, [flipToScene, nextInPlace, reducedMotion, reverseReturn]);

  const onDisconnect = useCallback(() => {
    connectedRef.current = false;
    setConnected(false);
    if (reducedMotion) { setSceneOn(false); return; }
    if (phaseRef.current === 'scene' || phaseRef.current === 'hold') {
      clock.current!.after(1400, () => { if (!connectedRef.current) returnToMosaic(); }, 'leave');
    }
  }, [reducedMotion, returnToMosaic]);

  /* ── Rendering ────────────────────────────────────── */
  const delays = useMemo(() => tileDelay(origin), [origin, tileDelay]);
  const visible = VISIBLE[bp];
  const playable = useMemo(() => {
    const allowed = envReady && !reducedMotion && !saveData && running && !sceneOn && phase !== 'scene' && phase !== 'hold';
    const set = new Set<string>();
    if (!allowed) return set;
    for (const tile of tiles) {
      if (!visible.includes(tile.id)) continue;
      const media = MEDIA[tile.pool[indices[tiles.indexOf(tile)] % tile.pool.length]];
      if (media.kind === 'video' && set.size < VIDEO_CAP[bp]) set.add(tile.id);
    }
    return set;
  }, [tiles, bp, envReady, indices, phase, reducedMotion, running, saveData, sceneOn, visible]);

  return <section
    ref={heroRef}
    className={styles.hero}
    aria-labelledby="hero-title"
    data-phase={phase}
    data-connected={connected || undefined}
  >
    <div className={styles.copy}>
      <p className={styles.badge} data-rise=""><span aria-hidden="true" />{copy.badge}</p>
      <h1 id="hero-title" className={styles.title} data-rise="" style={{ ['--d' as string]: '.05s' }}>
        <span>{copy.titleA}</span> <em>{copy.titleB}</em>
      </h1>
      <p className={styles.lead} data-rise="" style={{ ['--d' as string]: '.12s' }}>{copy.lead}</p>
      <div className={styles.actions} data-rise="" style={{ ['--d' as string]: '.18s' }}>
        <a className={styles.primary} href={copy.primary.href} data-track={copy.primary.track}>{copy.primary.label}<Arrow /></a>
        <a className={styles.secondary} href={copy.secondary.href} data-track={copy.secondary.track}>{copy.secondary.label}</a>
      </div>
    </div>

    <div className={styles.socket} data-rise="" style={{ ['--d' as string]: '.3s' }}>
      <Connector
        lang={lang}
        connected={connected}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        heroRef={heroRef}
        portRef={portRef}
        reducedMotion={reducedMotion}
        pulse={cablePulse}
        onPulseArrive={onPulseArrive}
      />
    </div>

    <div className={styles.stage}>
      <div
        ref={mosaicRef}
        className={styles.mosaic}
        role="img"
        aria-label={copy.mosaicLabel}
        data-face={face}
        data-instant={instant || undefined}
        data-lift={lift || undefined}
        data-glow={glow || undefined}
      >
        {tiles.map((tile, i) => {
          const g = geo.tiles[tile.id];
          return <div
            key={tile.id}
            className={styles.tile}
            data-tile={tile.id}
            style={{ gridArea: tile.id, '--delay': `${delays[tile.id] ?? 0}ms`, '--i': i, '--gx': g ? `${origin.x - g.x}px` : '0px', '--gy': g ? `${origin.y - g.y}px` : '0px' } as CSSProperties}
          >
            <div className={styles.card}>
              <div className={styles.front}>
                <TileMedia tile={tile} index={indices[i]} lang={lang} play={playable.has(tile.id)} eager={i === 0} />
                <span className={styles.glow} />
              </div>
              <div className={`${styles.back} ${appFont.className}`}>
                {g && geo.w > 0 && <div className={styles.slice} style={{ width: geo.w, height: geo.h, transform: `translate(${-g.x}px, ${-g.y}px)` }}>
                  <ProductScene lang={lang} frame={slice} copy={sceneCopy} />
                </div>}
              </div>
            </div>
          </div>;
        })}
        <div className={`${styles.sceneLayer} ${appFont.className}`} data-on={sceneOn || undefined} data-fade={sceneFade || undefined}>
          <ProductScene lang={lang} frame={frame} live pulse={scenePulse} copy={sceneCopy} />
        </div>
      </div>
      <span ref={portRef} className={styles.port} aria-hidden="true" />
      {!reducedMotion && <button type="button" className={styles.pause} onClick={() => setPaused(p => !p)} aria-pressed={paused}>
        {paused
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5h2.6v13H8zM13.4 5.5H16v13h-2.6z" fill="currentColor" /></svg>}
        <span>{paused ? copy.play : copy.pause}</span>
      </button>}
    </div>
  </section>;
}

/** One tile's media: the current photo or clip, crossfading from the last once the new one has loaded. */
function TileMedia({ tile, index, lang, play, eager }: { tile: MosaicTile; index: number; lang: Language; play: boolean; eager: boolean }) {
  const key = tile.pool[index % tile.pool.length];
  const [layers, setLayers] = useState<{ key: MediaKey; ready: boolean }[]>([{ key, ready: true }]);
  const current = useRef<MediaKey>(key);

  useEffect(() => {
    if (current.current === key) return;
    current.current = key;
    setLayers(ls => [...ls.filter(l => l.ready).slice(-1), { key, ready: false }]);
    const giveUp = window.setTimeout(() => setLayers(ls => ls.filter(l => l.ready || l.key !== key)), 6000);
    return () => window.clearTimeout(giveUp);
  }, [key]);

  const onReady = useCallback((ready: MediaKey) => {
    setLayers(ls => ls.map(l => l.key === ready ? { ...l, ready: true } : l));
    window.setTimeout(() => setLayers(ls => {
      const last = ls.filter(l => l.ready).pop();
      return last ? ls.filter(l => l === last || !l.ready) : ls;
    }), 1700);
  }, []);

  const top = layers.filter(l => l.ready).pop()?.key;
  return <>
    {layers.map(layer => <MediaLayer
      key={layer.key}
      media={layer.key}
      lang={lang}
      sizes={tile.sizes}
      shown={layer.ready}
      play={play && layer.key === top}
      eager={eager && layer.key === tile.pool[0]}
      onReady={onReady}
    />)}
  </>;
}

function MediaLayer({ media, lang, sizes, shown, play, eager, onReady }: {
  media: MediaKey; lang: Language; sizes: string; shown: boolean; play: boolean; eager: boolean; onReady: (key: MediaKey) => void;
}) {
  const m = MEDIA[media];
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const notified = useRef(false);
  const ready = useCallback(() => { if (!notified.current) { notified.current = true; onReady(media); } }, [media, onReady]);
  const imgRef = useCallback((img: HTMLImageElement | null) => { if (img?.complete && img.naturalWidth) ready(); }, [ready]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (play) {
      if (!v.getAttribute('src')) { v.src = m.src; v.load(); }
      v.muted = true;
      v.play().catch(() => setPlaying(false));
    } else v.pause();
  }, [play, m.src]);

  const style = { '--focus': m.focus ?? '50% 50%' } as CSSProperties;
  return <div className={styles.media} data-shown={shown || undefined} style={style}>
    {m.kind === 'video'
      ? <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={m.poster} alt="" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" onLoad={ready} onError={ready} />
        <video ref={video} muted playsInline loop preload="none" data-playing={playing || undefined} onPlaying={() => setPlaying(true)} aria-hidden="true" />
      </>
      : <Image src={m.src} alt="" fill sizes={sizes} priority={eager} onLoad={ready} onError={ready} ref={imgRef} />}
    <span className={styles.caption}>{m.label[lang]}</span>
  </div>;
}

function Arrow() {
  return <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
