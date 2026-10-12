'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { CR_PATH, MAP_H, MAP_W, NEIGHBOUR_PATHS } from './crPath';
import { INDUSTRY_COLORS, type IndustriesContent, type IndustrySlug } from './content';
import styles from './IndustryMap.module.css';

// Live map, after the one on whagons.ch: sites of six industries across Costa
// Rica, field teams driving between them, and a feed of what they report.
// Coordinates share the frame of CR_PATH; the Central Valley sites are spread
// a little so their markers do not overlap.

type Focus = IndustrySlug | 'all';

const SITES: [IndustrySlug, string, number, number][] = [
  ['hoteleria', 'Tamarindo', 59, 287],
  ['hoteleria', 'La Fortuna', 393, 239],
  ['hoteleria', 'Jacó', 395, 479],
  ['retail', 'Escazú', 520, 404],
  ['retail', 'Liberia', 170, 194],
  ['retail', 'Pérez Zeledón', 654, 549],
  ['retail', 'Alajuela', 498, 356],
  ['mantenimiento', 'Limón', 840, 372],
  ['mantenimiento', 'Cartago', 606, 420],
  ['mantenimiento', 'Puntarenas', 340, 377],
  ['farmaceutica', 'Heredia', 548, 350],
  ['farmaceutica', 'Ciudad Quesada', 451, 281],
  ['salud-educacion', 'San José', 568, 392],
  ['salud-educacion', 'Nicoya', 168, 329],
  ['construccion', 'Guápiles', 632, 313],
  ['construccion', 'Golfito', 804, 755],
];

// Labels for orientation; the rest of the sites are named in the feed.
const LABELS: [string, number, number, 'l' | 'r'][] = [
  ['Liberia', 170, 194, 'r'],
  ['Tamarindo', 59, 287, 'r'],
  ['La Fortuna', 393, 239, 'r'],
  ['Puntarenas', 340, 377, 'l'],
  ['San José', 568, 392, 'r'],
  ['Limón', 840, 372, 'l'],
  ['Pérez Zeledón', 654, 549, 'r'],
  ['Golfito', 804, 755, 'l'],
];

const VEHICLES: { id: string; slug: IndustrySlug; route: string; dur: number }[] = [
  { id: 'M-02', slug: 'mantenimiento', route: 'M548 392L590 330L632 313L740 330L840 372', dur: 26 },
  { id: 'R-07', slug: 'retail', route: 'M498 356L430 372L340 377L260 300L170 194', dur: 28 },
  { id: 'C-03', slug: 'construccion', route: 'M606 420L620 470L654 549L730 650L804 755', dur: 30 },
  { id: 'F-04', slug: 'farmaceutica', route: 'M548 350L500 320L451 281L393 239', dur: 20 },
  { id: 'H-01', slug: 'hoteleria', route: 'M170 194L110 240L59 287', dur: 16 },
  { id: 'M-01', slug: 'mantenimiento', route: 'M498 356L450 420L395 479', dur: 18 },
];

const ROADS = [...VEHICLES.map((v) => v.route), 'M170 194L168 329'];
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
    const [slug, place, text] = events[k % events.length];
    return { key: `${focus}-${k}`, slug, place, text, when };
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
          <span>{t.map.sites} <b>{SITES.filter(([slug]) => shown(slug)).length}</b></span>
          <span>{t.map.onRoad} <b>{VEHICLES.filter((v) => shown(v.slug)).length}</b></span>
          <span>{t.map.closed} <b>{CLOSED_TODAY + tick}</b></span>
          <span className={styles.live}><i />{t.map.live}</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.canvas}>
          <svg ref={svgRef} viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={t.map.label}>
            <defs>
              <pattern id="cr-dots" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="1.4" fill="rgba(255,255,255,.2)" />
              </pattern>
              <clipPath id="cr-clip"><path d={CR_PATH} /></clipPath>
            </defs>
            {NEIGHBOUR_PATHS.map((d) => <path key={d.slice(0, 24)} d={d} className={styles.neighbour} />)}
            <path d={CR_PATH} className={styles.land} />
            <rect width={MAP_W} height={MAP_H} fill="url(#cr-dots)" clipPath="url(#cr-clip)" />
            <path d={CR_PATH} className={styles.border} />
            {ROADS.map((d) => <path key={d} d={d} className={styles.road} />)}
            {LABELS.map(([name, x, y, side]) => (
              <text key={name} className={styles.label} x={side === 'r' ? x + 18 : x - 18} y={y - 14} textAnchor={side === 'r' ? 'start' : 'end'}>{name}</text>
            ))}
            {SITES.map(([slug, place, x, y], i) => (
              <g key={place} transform={`translate(${x} ${y})`} data-dim={!shown(slug) || undefined} className={styles.siteWrap}>
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
