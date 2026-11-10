'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import type { Language } from '../../../lib/locales';
import { HOME_CONTENT, type AdaptChannel, type AdaptMap, type AdaptSector, type AdaptSetup, type AdaptTask, type AdaptView } from '../content';
import styles from './Adapt.module.css';

const SECTORS: AdaptSector[] = ['industry', 'field', 'construction', 'logistics'];
const ROTATE_MS = 10500;
/**
 * When each beat starts after a sector is shown: (1) the report comes in,
 * (2) it becomes a task, (3) the triage agent runs, (4) it suggests a
 * category and owner, (5) the suggestion is approved, (6) another task moves
 * on a status with a new comment and attachment.
 */
const BEATS = [900, 2300, 3400, 4500, 5900, 7200];
const LAST_BEAT = BEATS.length;
const STATUS_COLORS = ['#64748b', '#2563eb', '#10b981', '#0f766e'];
const SPACE_COLORS = ['#d4310a', '#2563eb', '#10b981'];
const CHANNEL_COLORS: Record<AdaptChannel, string> = { voice: '#ea580c', nfc: '#0891b2', qr: '#334155', form: '#0d9488', plan: '#4f46e5', agent: '#7c3aed' };
const AVATAR_COLORS = ['#3b8fa8', '#7c3aed', '#ea580c', '#16a34a', '#db2777', '#0891b2', '#ca8a04'];
const SECTOR_GLYPH: Record<AdaptSector, GlyphName> = { industry: 'factory', field: 'wrench', construction: 'hardhat', logistics: 'truck' };
const VIEW_ORDER: AdaptView[] = ['grid', 'kanban', 'map'];

type Row = AdaptTask & { fresh?: boolean; bumped?: boolean; suggested?: string };

/**
 * "How it adapts": the same building blocks filled in for four field and
 * industrial operations, drawn as a small Whagons window. The grid is the
 * main view (Kanban is one click away; logistics opens on a map of today's
 * routes with the trucks moving). While a sector is shown, a report
 * comes in by voice, NFC, QR or a public form, the triage agent suggests who
 * takes it, and another task moves on with new evidence. It moves on to the
 * next sector while it's on screen, until the visitor picks one.
 */
export default function Adapt({ lang, bare = false }: { lang: Language; bare?: boolean }) {
  const t = HOME_CONTENT[lang].adapt;
  const [active, setActive] = useState<AdaptSector>('industry');
  const [auto, setAuto] = useState(true);
  const [still, setStill] = useState(false);
  const [inView, setInView] = useState(false);
  // Latched once the window has been on screen, so the sequence doesn't restart when the visitor scrolls a little.
  const [seen, setSeen] = useState(false);
  const [beat, setBeat] = useState(0);
  // The view a visitor picked, for the sector they picked it in; other sectors open on their default.
  const [picked, setPicked] = useState<{ sector: AdaptSector; view: AdaptView } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStill(true); setAuto(false); }
    const node = ref.current;
    if (!node) return;
    // On screen means the window crosses the middle of the viewport. Watching the window, not the whole
    // section, keeps this steady while the window's height changes during the sequence.
    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setSeen(true);
    }, { rootMargin: '-30% 0px -30% 0px' });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView) return;
    const timer = window.setTimeout(() => setActive(a => SECTORS[(SECTORS.indexOf(a) + 1) % SECTORS.length]), ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [active, auto, inView]);

  useEffect(() => {
    if (still) { setBeat(LAST_BEAT); return; }
    setBeat(0);
    if (!seen) return;
    const timers = BEATS.map((ms, i) => window.setTimeout(() => setBeat(i + 1), ms));
    return () => timers.forEach(window.clearTimeout);
  }, [active, seen, still]);

  const pick = (sector: AdaptSector, focus = false) => {
    setAuto(false);
    setActive(sector);
    if (focus) tabs.current[SECTORS.indexOf(sector)]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = SECTORS.indexOf(active);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick(SECTORS[(i + 1) % SECTORS.length], true); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(SECTORS[(i + SECTORS.length - 1) % SECTORS.length], true); }
    if (e.key === 'Home') { e.preventDefault(); pick(SECTORS[0], true); }
    if (e.key === 'End') { e.preventDefault(); pick(SECTORS[SECTORS.length - 1], true); }
  };

  const s = t.setups[active];
  const ui = t.ui;
  const views = VIEW_ORDER.filter(v => v !== 'map' || s.map);
  const view: AdaptView = picked && picked.sector === active && views.includes(picked.view) ? picked.view : s.defaultView ?? 'grid';
  const at = (n: number) => beat >= n;
  const rows = buildRows(s, at(2), at(4), at(5), at(6));
  const created = s.kpis.created.map((v, i) => i === s.kpis.created.length - 1 && at(2) ? v + 1 : v);
  const rate = s.kpis.rate + (at(6) ? 1 : 0);
  const capture = s.incoming.capture;

  const windowEl = <div ref={ref} className={styles.config} data-reveal="" style={{ ['--d' as string]: '.08s' }}>
      <div className={styles.tabs} role="tablist" aria-label={t.tabsLabel}>
        {SECTORS.map((sector, i) => <button
          key={sector}
          ref={el => { tabs.current[i] = el; }}
          type="button"
          role="tab"
          id={`adapt-tab-${sector}`}
          aria-selected={active === sector}
          aria-controls="adapt-panel"
          tabIndex={active === sector ? 0 : -1}
          onClick={() => pick(sector)}
          onKeyDown={onKey}
        >
          {t.sectors[sector]}
          {active === sector && auto && inView && <i key={sector} className={styles.timer} style={{ animationDuration: `${ROTATE_MS}ms` }} aria-hidden="true" />}
        </button>)}
      </div>

      <div id="adapt-panel" className={styles.panel} role="tabpanel" aria-labelledby={`adapt-tab-${active}`}>
        <div className={styles.app} key={active} role="group" aria-label={`${ui.window} ${t.sectors[active]}`}>
          <div className={styles.bar}>
            <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
            <span className={styles.crumb}><b>Whagons</b> / {s.spaces[0]}</span>
            <span className={styles.views}>
              {views.map(v => <button key={v} type="button" aria-pressed={view === v} onClick={() => setPicked({ sector: active, view: v })}>
                <Glyph name={v} />{ui.views[VIEW_ORDER.indexOf(v)]}
              </button>)}
            </span>
          </div>

          <div className={styles.body}>
            <div className={styles.side}>
              <small>{ui.spaces}</small>
              <ul>{s.spaces.map((space, i) => <li key={space} className={i === 0 ? styles.on : undefined} style={{ ['--i' as string]: i }}>
                <i style={{ background: SPACE_COLORS[i] }} aria-hidden="true" />{space}
              </li>)}</ul>
              <small className={styles.sideLabel}><Glyph name="zap" />{ui.powerups}</small>
              <ul className={styles.powerups}>{s.powerups.map((p, i) => <li key={p} style={{ ['--i' as string]: i + 3 }}><i aria-hidden="true" />{p}</li>)}</ul>
            </div>

            <div className={styles.main}>
              <ul className={styles.kpis}>
                <li>
                  <span className={styles.kpiLabel}>{ui.kpis.created}</span>
                  <b key={`c${created[created.length - 1]}`}>{created[created.length - 1]}</b>
                  <Spark values={created} />
                </li>
                <li className={styles.kpiRing}>
                  <Ring value={rate} />
                  <span><span className={styles.kpiLabel}>{ui.kpis.rate}</span><b key={`r${rate}`}>{rate}%</b></span>
                </li>
                <li>
                  <span className={styles.kpiLabel}>{ui.kpis.avg}</span>
                  <b>{s.kpis.avg}</b>
                  <Columns values={s.kpis.avgBars} />
                </li>
                <li className={styles.kpiLate}>
                  <span className={styles.kpiLabel}>{ui.kpis.late}</span>
                  <b>{s.kpis.late}</b>
                  <span className={styles.meter} aria-hidden="true"><i style={{ width: `${Math.round(s.kpis.late / s.kpis.open * 100)}%` }} /></span>
                </li>
              </ul>

              {view === 'map' && s.map
                ? <RouteMap map={s.map} setup={s} rows={rows} created={at(2)} approved={at(5)} inView={inView} still={still} />
                : view === 'kanban'
                  ? <Board rows={rows} setup={s} ui={ui} />
                  : <Grid rows={rows} setup={s} ui={ui} glyph={SECTOR_GLYPH[active]} />}
            </div>
          </div>
        </div>

        <div className={styles.floats} key={`f-${active}`}>
          <div className={styles.float} data-beat={Math.min(beat, 2)}>
            <span className={styles.capIcon} data-capture={capture} data-live={(at(0) && !at(2)) || undefined} style={{ ['--c' as string]: CHANNEL_COLORS[capture] }}>
              <Glyph name={capture} />
              {capture === 'voice' && <span className={styles.wave} aria-hidden="true"><i /><i /><i /><i /><i /></span>}
            </span>
            <div className={styles.floatText}>
              <small style={{ color: CHANNEL_COLORS[capture] }}>{ui.capture[capture]}</small>
              {at(1)
                ? <p className={styles.said}>{s.incoming.said.split(' ').map((word, i) => <span key={i} style={{ ['--w' as string]: i }}>{word} </span>)}</p>
                : <p className={styles.waiting}>{ui.waiting[capture]}</p>}
              <span className={styles.hint} data-done={at(2) || undefined}>
                {at(2) ? <><Glyph name="check" />{ui.created} · #{s.incoming.task.id}</> : ui.hint[capture]}
              </span>
            </div>
          </div>

          <div className={styles.float} data-agent="">
            <span className={styles.agentIcon} data-live={(at(3) && !at(4)) || undefined}><Glyph name="agent" /></span>
            <div className={styles.floatText}>
              <small className={styles.agentLabel}>{ui.agent}</small>
              {!at(3) && <p className={styles.waiting}>{ui.agentIdle}</p>}
              {at(3) && !at(4) && <p className={styles.working}>{ui.agentWorking}</p>}
              {at(4) && <p className={styles.suggest}>
                <span>{ui.category} <b>{s.agent.category}</b></span>
                <span>{ui.owner} <b>{s.agent.whoFull}</b></span>
                {s.agent.duplicate && <span>{ui.duplicate} <b>{s.agent.duplicate}</b></span>}
              </p>}
            </div>
            {at(4) && <span className={styles.approve} data-done={at(5) || undefined}>{at(5) ? <><Glyph name="check" />{ui.approved}</> : ui.approve}</span>}
          </div>
        </div>
      </div>
      <p className={styles.note}>{t.note}</p>
    </div>;

  // On the platform page the window stands on its own, under that page's own heading.
  if (bare) return <div className={styles.bare}>{windowEl}</div>;

  return <section className={styles.section} id={lang === 'es' ? 'como-se-adapta' : 'how-it-adapts'} aria-labelledby="adapt-title">
    <div className={styles.intro} data-reveal="">
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <h2 id="adapt-title">{t.title}</h2>
      <p className={styles.lead}>{t.lead}</p>
      <ol className={styles.principles}>
        {t.principles.map(([title, text], i) => <li key={title}><span>0{i + 1}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}
      </ol>
    </div>

    {windowEl}
  </section>;
}

/** The new task on top once it exists (owner and tag once the agent's suggestion is approved), then the space's tasks, with `mover` advanced at the end. */
function buildRows(s: AdaptSetup, created: boolean, suggested: boolean, approved: boolean, advanced: boolean): Row[] {
  const incoming: Row[] = created ? [{
    ...s.incoming.task,
    fresh: true,
    who: approved ? s.agent.who : '',
    suggested: suggested && !approved ? s.agent.who : undefined,
    tags: approved ? [s.agent.tag] : [],
  }] : [];
  const rest = s.tasks.map((task, i): Row => i === s.mover && advanced
    ? { ...task, status: Math.min(task.status + 1, 3), notes: (task.notes ?? 0) + 1, files: (task.files ?? 0) + 1, bumped: true }
    : task);
  return [...incoming, ...rest];
}

type Ui = (typeof HOME_CONTENT)['es']['adapt']['ui'];

function Grid({ rows, setup, ui, glyph }: { rows: Row[]; setup: AdaptSetup; ui: Ui; glyph: GlyphName }) {
  return <div className={styles.grid} role="table" aria-label={ui.views[0]}>
    <div className={styles.gridHead} role="row">
      <span role="columnheader">{ui.head.task}</span>
      <span role="columnheader" aria-label={ui.head.notes}><Glyph name="note" /></span>
      <span role="columnheader">{ui.head.status}</span>
      <span role="columnheader" className={styles.spotCell}>{ui.head.spot}</span>
      <span role="columnheader" aria-label={ui.head.who}><Glyph name="user" /></span>
    </div>
    {rows.map((row, i) => <div
      key={row.id}
      role="row"
      className={styles.row}
      data-fresh={row.fresh || undefined}
      data-bumped={row.bumped || undefined}
      style={{ '--s': STATUS_COLORS[row.status], '--k': i } as CSSProperties}
    >
      <span role="cell" className={styles.nameCell}>
        <span className={styles.cat} aria-hidden="true"><Glyph name={glyph} /></span>
        <span className={styles.nameText}>
          <span className={styles.titleLine}>
            <b>{row.title}</b>
            {row.channel && <Chip channel={row.channel} label={ui.channels[row.channel]} />}
            {row.files ? <span key={`f${row.files}`} className={styles.clip}><Glyph name="clip" />{row.files}</span> : null}
          </span>
          <span className={styles.tagLine}>
            <em>#{row.id}</em>
            {(row.tags ?? []).map(tag => <span key={tag} className={styles.tag} style={{ ['--t' as string]: setup.tags[tag] ?? '#64748b' }}>{tag}</span>)}
          </span>
        </span>
      </span>
      <span role="cell" className={styles.notesCell} data-count={row.notes || undefined}>
        <Glyph name="note" />{row.notes ? <b key={`n${row.notes}`}>{row.notes}</b> : null}
      </span>
      <span role="cell"><span key={`s${row.status}`} className={styles.status}>{setup.statuses[row.status]}</span></span>
      <span role="cell" className={styles.spotCell}><Glyph name="pin" /><span>{row.spot}</span></span>
      <span role="cell"><Avatar who={row.who} suggested={row.suggested} /></span>
    </div>)}
  </div>;
}

function Board({ rows, setup, ui }: { rows: Row[]; setup: AdaptSetup; ui: Ui }) {
  return <div className={styles.board}>
    {setup.statuses.map((status, c) => {
      const inCol = rows.filter(row => row.status === c);
      return <div key={status} className={styles.col} style={{ '--s': STATUS_COLORS[c] } as CSSProperties}>
        <p className={styles.colHead}><i aria-hidden="true" /><em>{status}</em><span>{inCol.length}</span></p>
        {inCol.map((row, i) => <article key={row.id} className={styles.card} data-fresh={row.fresh || undefined} data-bumped={row.bumped || undefined} style={{ ['--k' as string]: c + i * 0.5 }}>
          <strong>{row.title}</strong>
          <span className={styles.spot}>{row.spot}</span>
          {row.tags && row.tags.length > 0 && <span className={styles.tag} style={{ ['--t' as string]: setup.tags[row.tags[0]] ?? '#64748b' }}>{row.tags[0]}</span>}
          <span className={styles.meta}>
            <Avatar who={row.who} suggested={row.suggested} />
            {row.channel && <Chip channel={row.channel} label={ui.channels[row.channel]} compact />}
            {row.notes ? <span className={styles.metaCount}><Glyph name="note" />{row.notes}</span> : null}
            {row.files ? <span className={styles.metaCount}><Glyph name="clip" />{row.files}</span> : null}
          </span>
        </article>)}
      </div>;
    })}
  </div>;
}

/* The sample city the logistics map is drawn on, in viewBox units. */
const MAP_W = 520;
const MAP_H = 290;
const AVENUES_X = [70, 180, 280, 380, 470];
const AVENUES_Y = [45, 120, 190, 255];
const STREETS_X = [125, 230, 330, 425, 498];
const STREETS_Y = [82, 155, 222, 275];
const PARKS = [[183, 123, 94, 64], [73, 193, 104, 59]] as const;
const RIVER = 'M406 -12 C 432 58, 390 108, 424 160 S 456 246, 430 302';
/** Delivery loops along the avenues (closed, so the trucks loop without a jump), nudged apart where they share a road. */
const ROUTES = [
  { color: '#d4310a', d: 'M70 255 L70 120 L280 120 L280 45 L470 45 L470 190 L380 190 L380 255 Z', dx: 0, dy: 0, dur: 19, begin: 0, at: [280, 82] },
  { color: '#2563eb', d: 'M180 190 L180 45 L380 45 L380 190 Z', dx: -3, dy: -3, dur: 13, begin: 5, at: [180, 150] },
  { color: '#0d9488', d: 'M280 255 L280 190 L470 190 L470 255 Z', dx: 3, dy: 3, dur: 11, begin: 2, at: [430, 255] },
] as const;
const DEPOT = { x: 70, y: 255 };
const STOPS = [{ x: 280, y: 45, side: 'right' }, { x: 470, y: 45, side: 'left' }] as const;
const ALERT = { x: 470, y: 190, side: 'left' } as const;
/** Building footprints: one or two per block, skipping parks and the river. */
const BUILDINGS: [number, number, number, number][] = (() => {
  const xs = [0, ...AVENUES_X, ...STREETS_X, MAP_W].sort((a, b) => a - b);
  const ys = [0, ...AVENUES_Y, ...STREETS_Y, MAP_H].sort((a, b) => a - b);
  const out: [number, number, number, number][] = [];
  xs.slice(0, -1).forEach((x0, i) => ys.slice(0, -1).forEach((y0, j) => {
    const x1 = xs[i + 1], y1 = ys[j + 1], cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    if (x1 - x0 < 24 || y1 - y0 < 20) return;
    if (cx > 392 && cx < 458) return;
    if (PARKS.some(([px, py, pw, ph]) => cx > px && cx < px + pw && cy > py && cy < py + ph)) return;
    const w = x1 - x0 - 14, h = y1 - y0 - 13;
    if ((i + j) % 3 === 0) {
      out.push([x0 + 7, y0 + 6.5, w * 0.55, h], [x0 + 7 + w * 0.55 + 4, y0 + 6.5, w * 0.45 - 4, h * 0.6]);
    } else {
      out.push([x0 + 7, y0 + 6.5, w, (i + j) % 2 ? h : h * 0.7]);
    }
  }));
  return out;
})();

const pct = (x: number, y: number): CSSProperties => ({ left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` });

/**
 * Today's routes on a map: three trucks loop their routes, the stops show
 * their task's status, and the reported damaged delivery appears as an alert
 * that gets its owner once the agent's suggestion is approved.
 */
function RouteMap({ map, setup, rows, created, approved, inView, still }: {
  map: AdaptMap; setup: AdaptSetup; rows: Row[]; created: boolean; approved: boolean; inView: boolean; still: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = svg.current;
    if (!node || still) return;
    if (inView) node.unpauseAnimations(); else node.pauseAnimations();
  }, [inView, still]);

  const stopStatus = (task: number) => {
    const row = rows.find(r => r.id === task);
    if (!row) return null;
    const last = row.status === setup.statuses.length - 1;
    return { label: `${setup.statuses[row.status]}${last ? ' ✓' : ''}`, color: STATUS_COLORS[row.status], status: row.status };
  };
  const incoming = setup.incoming.task;

  return <div className={styles.map} role="img" aria-label={map.label}>
    <svg ref={svg} viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width={MAP_W} height={MAP_H} className={styles.land} />
      {BUILDINGS.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="2" className={styles.building} />)}
      <g className={styles.streets}>
        {STREETS_X.map(x => <line key={`sx${x}`} x1={x} y1="0" x2={x} y2={MAP_H} />)}
        {STREETS_Y.map(y => <line key={`sy${y}`} x1="0" y1={y} x2={MAP_W} y2={y} />)}
      </g>
      <path d={RIVER} className={styles.river} />
      {PARKS.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="6" className={styles.park} />)}
      <g className={styles.avenueCasing}>
        {AVENUES_X.map(x => <line key={`ax${x}`} x1={x} y1="0" x2={x} y2={MAP_H} />)}
        {AVENUES_Y.map(y => <line key={`ay${y}`} x1="0" y1={y} x2={MAP_W} y2={y} />)}
      </g>
      <g className={styles.avenues}>
        {AVENUES_X.map(x => <line key={`ax${x}`} x1={x} y1="0" x2={x} y2={MAP_H} />)}
        {AVENUES_Y.map(y => <line key={`ay${y}`} x1="0" y1={y} x2={MAP_W} y2={y} />)}
      </g>

      {ROUTES.map((route, i) => <g key={i} transform={`translate(${route.dx} ${route.dy})`} style={{ ['--c' as string]: route.color }}>
        <path id={`${uid}-route-${i}`} d={route.d} className={styles.routeHalo} />
        <path d={route.d} className={styles.routeLine} />
      </g>)}

      <g transform={`translate(${DEPOT.x} ${DEPOT.y})`} className={styles.depot}>
        <rect x="-11" y="-11" width="22" height="22" rx="6" />
        <g transform="translate(-6.6 -6.6) scale(0.55)" className={styles.mapGlyph}>{GLYPHS.warehouse}</g>
      </g>
      {STOPS.map((stop, i) => {
        const status = stopStatus(map.stops[i]?.task ?? -1);
        return <g key={i} transform={`translate(${stop.x} ${stop.y})`} className={styles.stop} style={{ ['--c' as string]: status?.color ?? '#64748b' }}>
          <circle r="7.5" /><circle r="2.8" className={styles.stopDot} />
        </g>;
      })}
      {created && <g transform={`translate(${ALERT.x} ${ALERT.y})`} className={styles.alertPin}>
        {!still && <circle r="8" className={styles.alertRing} />}
        <circle r="8" /><circle r="2.8" className={styles.alertDot} />
      </g>}

      {ROUTES.map((route, i) => <g key={i} transform={`translate(${route.dx} ${route.dy})`}>
        <g className={styles.truck} transform={still ? `translate(${route.at[0]} ${route.at[1]})` : undefined} style={{ ['--c' as string]: route.color }}>
          {!still && <animateMotion dur={`${route.dur}s`} begin={route.begin ? `-${route.begin}s` : '0s'} repeatCount="indefinite">
            <mpath href={`#${uid}-route-${i}`} xlinkHref={`#${uid}-route-${i}`} />
          </animateMotion>}
          <circle r="11" />
          <g transform="translate(-6.5 -6.5) scale(0.54)" className={styles.mapGlyph}>{GLYPHS.truck}</g>
        </g>
      </g>)}
    </svg>

    <div className={styles.routes} aria-hidden="true">
      <small>{map.title}</small>
      {map.routes.map((route, i) => <span key={route.name} className={styles.routeRow} style={{ ['--c' as string]: ROUTES[i]?.color ?? '#64748b' }}>
        <i className={styles.routeDot} />
        <b>{route.name}</b>
        <span className={styles.routeWho} style={{ background: avatarColor(route.who) }}>{route.who}</span>
        <em>{route.done}/{route.total}</em>
        <span className={styles.routeBar}><i style={{ width: `${Math.round((route.done / route.total) * 100)}%` }} /></span>
      </span>)}
    </div>

    <span className={styles.mapLabel} data-side="right" style={pct(DEPOT.x, DEPOT.y)} aria-hidden="true">
      <b>{map.depot.name}</b><span>{map.depot.note}</span>
    </span>
    {STOPS.map((stop, i) => {
      const info = map.stops[i];
      const status = info ? stopStatus(info.task) : null;
      if (!info || !status) return null;
      return <span key={info.name} className={styles.mapLabel} data-side={stop.side} style={pct(stop.x, stop.y)} aria-hidden="true">
        <b>{info.name}</b>
        <span key={status.status} className={styles.mapStatus}><i style={{ background: status.color }} />{status.label}</span>
      </span>;
    })}
    {created && <span className={styles.mapLabel} data-side={ALERT.side} data-alert="" style={pct(ALERT.x, ALERT.y)} aria-hidden="true">
      <b>#{incoming.id} · {map.alert}</b>
      <span key={approved ? 'owner' : 'new'} className={styles.mapStatus}>{incoming.spot}{approved ? ` · ${setup.agent.whoFull}` : ''}</span>
    </span>}
  </div>;
}

function Chip({ channel, label, compact = false }: { channel: AdaptChannel; label: string; compact?: boolean }) {
  return <span className={styles.chip} data-compact={compact || undefined} style={{ ['--c' as string]: CHANNEL_COLORS[channel] }} title={label}>
    <Glyph name={channel} />{compact ? null : label}
  </span>;
}

function Avatar({ who, suggested }: { who: string; suggested?: string }) {
  if (who) return <span key={who} className={styles.avatar} style={{ background: avatarColor(who) }}>{who}</span>;
  if (suggested) return <span className={styles.avatar} data-suggested="">{suggested}<i><Glyph name="agent" /></i></span>;
  return <span className={styles.avatar} data-empty="" aria-hidden="true"><Glyph name="plus" /></span>;
}

function avatarColor(who: string) {
  let n = 0;
  for (const ch of who) n += ch.charCodeAt(0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

/** Created per day for the last week, today last. */
function Spark({ values }: { values: number[] }) {
  const w = 74, h = 24, max = Math.max(...values), min = Math.min(...values) - 2;
  const pts = values.map((v, i) => [i * (w / (values.length - 1)), h - 3 - ((v - min) / (max - min)) * (h - 6)] as const);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  return <svg className={styles.spark} viewBox={`-2 0 ${w + 4} ${h}`} aria-hidden="true">
    <polygon points={`0,${h} ${line} ${w},${h}`} />
    <polyline points={line} />
    <circle cx={lx} cy={ly} r="2.6" />
  </svg>;
}

function Ring({ value }: { value: number }) {
  const r = 14, c = 2 * Math.PI * r;
  return <svg className={styles.ring} viewBox="0 0 36 36" aria-hidden="true">
    <circle cx="18" cy="18" r={r} />
    <circle cx="18" cy="18" r={r} style={{ strokeDasharray: c, strokeDashoffset: c * (1 - value / 100) }} />
  </svg>;
}

function Columns({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return <span className={styles.columns} aria-hidden="true">
    {values.map((v, i) => <i key={i} style={{ height: `${Math.round((v / max) * 100)}%` }} />)}
  </span>;
}

type GlyphName = AdaptChannel | 'grid' | 'kanban' | 'map' | 'warehouse' | 'zap' | 'note' | 'clip' | 'pin' | 'user' | 'check' | 'plus' | 'factory' | 'wrench' | 'hardhat' | 'truck';

const GLYPHS: Record<GlyphName, ReactNode> = {
  voice: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" /></>,
  nfc: <><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" /><path d="M16.37 2a20.16 20.16 0 0 1 0 20" /></>,
  qr: <><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1" /></>,
  form: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" /></>,
  plan: <path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8" />,
  agent: <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z" />,
  grid: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" /></>,
  kanban: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 7v7M12 7v4M16 7v9" /></>,
  map: <><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" /><path d="M15 5.764v15M9 3.236v15" /></>,
  warehouse: <><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" /><path d="M6 18h12M6 14h12" /><rect width="12" height="12" x="6" y="10" /></>,
  zap: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  note: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  clip: <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />,
  pin: <><path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  plus: <path d="M5 12h14M12 5v14" />,
  factory: <><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M17 18h1M12 18h1M7 18h1" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  hardhat: <><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" /><path d="M14 6a6 6 0 0 1 6 6v3" /><path d="M4 15v-3a6 6 0 0 1 6-6" /><rect x="2" y="15" width="20" height="4" rx="1" /></>,
  truck: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>,
};

function Glyph({ name }: { name: GlyphName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{GLYPHS[name]}</svg>;
}
