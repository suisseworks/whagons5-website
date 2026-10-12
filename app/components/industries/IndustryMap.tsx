'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { INDUSTRY_COLORS, type IndustriesContent, type IndustrySlug } from './content';
import styles from './IndustryMap.module.css';

// Live map, after the one on whagons.ch: sites of six industries, field teams
// driving between them, and a feed of what they report. The ground is an
// abstract dot field with six zones and curved roads, so it reads as any
// operation rather than a real country or city.

type Focus = IndustrySlug | 'all';

const MAP_W = 1000;
const MAP_H = 640;

// Zone centres, in the order of t.zones.
const ZONES: [number, number][] = [[470, 110], [150, 330], [500, 330], [820, 210], [830, 520], [420, 540]];

// Site id (named in t.sites), industry, position.
const SITES: [string, IndustrySlug, number, number][] = [
  ['hotel-beach', 'hoteleria', 110, 300],
  ['hotel-lodge', 'hoteleria', 360, 100],
  ['hotel-city', 'hoteleria', 450, 290],
  ['store-14', 'retail', 210, 395],
  ['store-3', 'retail', 545, 360],
  ['store-8', 'retail', 575, 85],
  ['store-21', 'retail', 330, 530],
  ['port', 'mantenimiento', 870, 530],
  ['plant-2', 'mantenimiento', 790, 215],
  ['pumps', 'mantenimiento', 545, 565],
  ['dc', 'farmaceutica', 885, 300],
  ['food-plant', 'farmaceutica', 745, 470],
  ['campus', 'salud-educacion', 565, 275],
  ['clinic', 'salud-educacion', 235, 215],
  ['tower', 'construccion', 640, 250],
  ['bridge', 'construccion', 685, 410],
];

const VEHICLES: { id: string; slug: IndustrySlug; route: string; dur: number }[] = [
  { id: 'M-02', slug: 'mantenimiento', route: 'M545 360C620 300 700 220 790 215S900 420 870 530', dur: 26 },
  { id: 'R-07', slug: 'retail', route: 'M545 360C440 400 320 420 210 395S130 330 110 300', dur: 26 },
  { id: 'C-03', slug: 'construccion', route: 'M640 250C670 320 690 360 685 410S600 540 545 565', dur: 22 },
  { id: 'F-04', slug: 'farmaceutica', route: 'M885 300C860 380 800 440 745 470', dur: 16 },
  { id: 'H-01', slug: 'hoteleria', route: 'M360 100C300 140 260 190 235 215S140 270 110 300', dur: 18 },
  { id: 'M-01', slug: 'mantenimiento', route: 'M790 215C700 150 640 100 575 85', dur: 16 },
];

const ROADS = [
  ...VEHICLES.map((v) => v.route),
  'M450 290C410 220 390 150 360 100',
  'M330 530C390 470 430 400 450 290',
  'M565 275C560 305 552 335 545 360',
  'M745 470C790 500 830 515 870 530',
];

const CLOSED_TODAY = 312;
const TICK_MS = 2800;

export default function IndustryMap({ t, ago }: { t: IndustriesContent; ago: string[] }) {
  const [focus, setFocus] = useState<Focus>('all');
  const [tick, setTick] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      svgRef.current?.pauseAnimations();
      return;
    }
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) svgRef.current?.unpauseAnimations();
      else svgRef.current?.pauseAnimations();
    });
    if (wrapRef.current) io.observe(wrapRef.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setTick((n) => n + 1);
    }, TICK_MS);
    return () => { window.clearInterval(timer); io.disconnect(); };
  }, []);

  const shown = (slug: IndustrySlug) => focus === 'all' || focus === slug;
  const events = t.events.filter(([slug]) => shown(slug));
  // The feed rolls, so ages belong to the row rather than to the event. A
  // single industry has fewer updates than rows, so it shows each one once.
  const rows = Math.min(ago.length, events.length);
  const feed = ago.slice(0, rows).map((when, i) => {
    const k = tick + rows - 1 - i;
    const [slug, site, text] = events[k % events.length];
    return { key: `${focus}-${k}`, slug, place: t.sites[site], text, when };
  });
  const names = Object.fromEntries(t.industries.map((industry) => [industry.slug, industry.short])) as Record<IndustrySlug, string>;

  return (
    <div className={styles.map} ref={wrapRef} data-focus={focus}>
      <div className={styles.top}>
        <div className={styles.chips} role="group" aria-label={t.labels.nav}>
          <button type="button" aria-pressed={focus === 'all'} onClick={() => setFocus('all')}>{t.map.all}</button>
          {t.industries.map((industry) => (
            <button key={industry.slug} type="button" aria-pressed={focus === industry.slug} onClick={() => setFocus(industry.slug)} style={{ '--c': INDUSTRY_COLORS[industry.slug] } as CSSProperties}>
              <i aria-hidden="true" />{industry.short}
            </button>
          ))}
        </div>
        <div className={styles.kpis} aria-hidden="true">
          <span>{t.map.sites} <b>{SITES.filter(([, slug]) => shown(slug)).length}</b></span>
          <span>{t.map.onRoad} <b>{VEHICLES.filter((v) => shown(v.slug)).length}</b></span>
          <span>{t.map.closed} <b>{CLOSED_TODAY + tick}</b></span>
          <span className={styles.live}><i />{t.map.live}</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.canvas}>
          <svg ref={svgRef} viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={t.map.label}>
            <defs>
              <pattern id="ops-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="7" cy="7" r="1.4" fill="rgba(255,255,255,.16)" />
              </pattern>
              <radialGradient id="ops-fade" cx="50%" cy="50%" r="60%">
                <stop offset="55%" stopColor="#fff" />
                <stop offset="100%" stopColor="#000" />
              </radialGradient>
              <mask id="ops-mask"><rect width={MAP_W} height={MAP_H} fill="url(#ops-fade)" /></mask>
              <radialGradient id="ops-zone">
                <stop offset="0%" stopColor="rgba(255,255,255,.09)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            <rect width={MAP_W} height={MAP_H} fill="url(#ops-dots)" mask="url(#ops-mask)" />
            {ZONES.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="150" fill="url(#ops-zone)" />
                <circle cx={x} cy={y} r="112" className={styles.zoneRing} />
              </g>
            ))}
            {ROADS.map((d) => <path key={d} d={d} className={styles.road} />)}
            {ZONES.map(([x, y], i) => (
              <text key={t.zones[i]} className={styles.label} x={x} y={y - 92} textAnchor="middle">{t.zones[i]}</text>
            ))}
            {SITES.map(([id, slug, x, y], i) => (
              <g key={id} transform={`translate(${x} ${y})`} data-dim={!shown(slug) || undefined} className={styles.siteWrap}>
                <title>{t.sites[id]}</title>
                <g className={styles.site} style={{ '--c': INDUSTRY_COLORS[slug] } as CSSProperties}>
                  <circle r="11" className={styles.pulse} style={{ animationDelay: `${(i % 6) * 0.45}s` }} />
                  <circle r="11" className={styles.dot} />
                  <circle r="4" className={styles.core} />
                </g>
              </g>
            ))}
            {VEHICLES.map((v, i) => (
              <g key={v.id} className={styles.vehicle} data-dim={!shown(v.slug) || undefined} style={{ '--c': INDUSTRY_COLORS[v.slug] } as CSSProperties}>
                <g>
                  <rect x="-30" y="-15" width="60" height="30" rx="15" />
                  <text y="5.5" textAnchor="middle">{v.id}</text>
                </g>
                <animateMotion dur={`${v.dur}s`} begin={`-${i * 4}s`} repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;0.45;0.5;0.95;1" calcMode="linear" path={v.route} />
              </g>
            ))}
          </svg>
        </div>

        <aside className={styles.feed} aria-label={t.map.feed}>
          <p className={styles.feedHead}>{t.map.feed}</p>
          <ol aria-live="off">
            {feed.map((item) => (
              <li key={item.key} style={{ '--c': INDUSTRY_COLORS[item.slug] } as CSSProperties}>
                <time>{item.when}</time>
                <span>
                  <em><i aria-hidden="true" />{names[item.slug]} · {item.place}</em>
                  {item.text}
                </span>
              </li>
            ))}
          </ol>
          <p className={styles.note}>{t.map.note}</p>
        </aside>
      </div>
    </div>
  );
}
