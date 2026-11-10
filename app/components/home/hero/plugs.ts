import type { Language } from '../../../lib/locales';

/*
 * Outlet and plug standards for the hero's socket, by country. Geometry is in
 * millimetres, measured on the outlet face (x right, y down from the socket
 * centre); the plug uses the same frame, so its pins land in the holes.
 */

export type PlugType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'L' | 'M' | 'N';
export const ALL_TYPES: PlugType[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N'];

/** Standards in use per country (IEC World Plugs); the first one is drawn by default. */
export const COUNTRY_PLUGS: Record<string, PlugType[]> = {
  // Latin America and the Caribbean
  AR: ['I', 'C'], BO: ['C', 'A'], BR: ['N', 'C'], BZ: ['B', 'A', 'G'], CL: ['L', 'C'], CO: ['B', 'A'], CR: ['B', 'A'],
  CU: ['A', 'B', 'C', 'L'], DO: ['A', 'B', 'C'], EC: ['B', 'A'], GT: ['B', 'A'], HN: ['B', 'A'], HT: ['B', 'A'], JM: ['B', 'A'],
  MX: ['B', 'A'], NI: ['B', 'A'], PA: ['B', 'A'], PE: ['C', 'A'], PR: ['B', 'A'], PY: ['C'], SV: ['B', 'A'], TT: ['B', 'A'],
  UY: ['F', 'C', 'I', 'L'], VE: ['B', 'A'],
  // North America and Europe
  US: ['B', 'A'], CA: ['B', 'A'], ES: ['F', 'C'], PT: ['F', 'C'], FR: ['E', 'C'], BE: ['E', 'C'], DE: ['F', 'C'], AT: ['F', 'C'],
  NL: ['F', 'C'], IT: ['L', 'F', 'C'], CH: ['J', 'C'], GB: ['G'], IE: ['G'],
  // Elsewhere
  AU: ['I'], NZ: ['I'], CN: ['I', 'A', 'C'], JP: ['A', 'B'], IN: ['D', 'C', 'M'], ZA: ['M', 'N', 'C'], IL: ['H', 'C'],
  AE: ['G', 'C', 'D'], SA: ['G', 'A', 'B'], KR: ['F', 'C'], PH: ['A', 'B', 'C'], SG: ['G'],
};

/** Shown when the country can't be told: the main market for each language (Costa Rica, United States; both A/B). */
export const DEFAULT_COUNTRY: Record<Language, string> = { es: 'CR', en: 'US' };
export const OTHER = 'ZZ';

const ZONES: Record<string, string> = {
  'America/Costa_Rica': 'CR', 'America/Guatemala': 'GT', 'America/El_Salvador': 'SV', 'America/Tegucigalpa': 'HN',
  'America/Managua': 'NI', 'America/Panama': 'PA', 'America/Bogota': 'CO', 'America/Caracas': 'VE', 'America/Guayaquil': 'EC',
  'Pacific/Galapagos': 'EC', 'America/Lima': 'PE', 'America/La_Paz': 'BO', 'America/Santiago': 'CL', 'America/Punta_Arenas': 'CL',
  'Pacific/Easter': 'CL', 'America/Montevideo': 'UY', 'America/Asuncion': 'PY', 'America/Havana': 'CU', 'America/Santo_Domingo': 'DO',
  'America/Puerto_Rico': 'PR', 'America/Belize': 'BZ', 'America/Port-au-Prince': 'HT', 'America/Jamaica': 'JM', 'America/Port_of_Spain': 'TT',
  'America/Buenos_Aires': 'AR', 'America/Cordoba': 'AR', 'America/Mendoza': 'AR',
  'Europe/Madrid': 'ES', 'Atlantic/Canary': 'ES', 'Africa/Ceuta': 'ES', 'Europe/Lisbon': 'PT', 'Atlantic/Madeira': 'PT', 'Atlantic/Azores': 'PT',
  'Europe/Paris': 'FR', 'Europe/Brussels': 'BE', 'Europe/Berlin': 'DE', 'Europe/Vienna': 'AT', 'Europe/Amsterdam': 'NL', 'Europe/Rome': 'IT',
  'Europe/Zurich': 'CH', 'Europe/London': 'GB', 'Europe/Dublin': 'IE',
  'Pacific/Auckland': 'NZ', 'Asia/Shanghai': 'CN', 'Asia/Tokyo': 'JP', 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
  'Africa/Johannesburg': 'ZA', 'Asia/Jerusalem': 'IL', 'Asia/Tel_Aviv': 'IL', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA',
  'Asia/Seoul': 'KR', 'Asia/Manila': 'PH', 'Asia/Singapore': 'SG',
};
const ZONE_PREFIXES: [string, string][] = [
  ['America/Argentina/', 'AR'], ['America/Indiana/', 'US'], ['America/Kentucky/', 'US'], ['America/North_Dakota/', 'US'], ['Australia/', 'AU'],
];
const MEXICO = ['Mexico_City', 'Cancun', 'Merida', 'Monterrey', 'Matamoros', 'Chihuahua', 'Ciudad_Juarez', 'Ojinaga', 'Mazatlan', 'Bahia_Banderas', 'Hermosillo', 'Tijuana'];
const USA = ['New_York', 'Chicago', 'Denver', 'Los_Angeles', 'Phoenix', 'Anchorage', 'Detroit', 'Boise', 'Juneau', 'Sitka', 'Nome', 'Menominee', 'Adak'];
const CANADA = ['Toronto', 'Vancouver', 'Edmonton', 'Winnipeg', 'Halifax', 'St_Johns', 'Regina', 'Montreal', 'Moncton', 'Whitehorse', 'Iqaluit', 'Yellowknife'];
const BRAZIL = ['Sao_Paulo', 'Bahia', 'Fortaleza', 'Recife', 'Belem', 'Manaus', 'Cuiaba', 'Campo_Grande', 'Porto_Velho', 'Boa_Vista', 'Rio_Branco', 'Araguaina', 'Maceio', 'Santarem', 'Noronha'];

function countryFromZone(zone: string): string | null {
  if (ZONES[zone]) return ZONES[zone];
  for (const [prefix, country] of ZONE_PREFIXES) if (zone.startsWith(prefix)) return country;
  if (zone === 'Pacific/Honolulu') return 'US';
  const city = zone.split('/')[1] ?? '';
  if (zone.startsWith('America/')) {
    if (MEXICO.includes(city)) return 'MX';
    if (USA.includes(city)) return 'US';
    if (CANADA.includes(city)) return 'CA';
    if (BRAZIL.includes(city)) return 'BR';
  }
  return null;
}

/** An approximate country from the device's time zone, then its language region. Never asks for location. */
export function guessCountry(): string | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fromZone = zone ? countryFromZone(zone) : null;
    if (fromZone) return fromZone;
  } catch { /* no Intl time zone */ }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const region = tag?.split('-')[1]?.toUpperCase();
    if (region && COUNTRY_PLUGS[region]) return region;
  }
  return null;
}

export const typesFor = (country: string): PlugType[] => COUNTRY_PLUGS[country] ?? ALL_TYPES;

/* ── Geometry ─────────────────────────────────────────── */

export type Plate = { w: number; h: number; r: number };
export type Shape =
  | { kind: 'rect'; w: number; h: number; r: number }
  | { kind: 'circle'; d: number }
  | { kind: 'flatCircle'; d: number; flat: number }
  | { kind: 'hex'; w: number; h: number; r: number };
export interface Hole { x: number; y: number; kind: 'round' | 'slot' | 'ground'; w: number; h: number; rot?: number }
export interface Pin { x: number; y: number; kind: 'round' | 'blade'; w: number; h: number; len: number; rot?: number }
export interface Standard {
  plate: Plate;
  /** A sunken socket the plug sits inside, or a flat face it rests on. */
  socket: { shape: Shape; recessed: boolean };
  holes: Hole[];
  /** Type E: the outlet's protruding earth pin. */
  earthPin?: { x: number; y: number; d: number };
  /** Type F: earth clips at the top and bottom of the recess. */
  clips?: boolean;
  body: { shape: Shape; depth: number };
  pins: Pin[];
}

const US_PLATE: Plate = { w: 70, h: 114, r: 6 };
const SQ_PLATE: Plate = { w: 82, h: 82, r: 11 };
const UK_PLATE: Plate = { w: 86, h: 86, r: 5 };

const round = (x: number, y: number, d: number): Hole => ({ x, y, kind: 'round', w: d, h: d });
const roundPin = (x: number, y: number, d: number, len = 19): Pin => ({ x, y, kind: 'round', w: d, h: d, len });

export const STANDARDS: Record<PlugType, Standard> = {
  A: {
    plate: US_PLATE, socket: { shape: { kind: 'rect', w: 34, h: 38, r: 7 }, recessed: false },
    holes: [{ x: -6.35, y: 0, kind: 'slot', w: 2.2, h: 8.6 }, { x: 6.35, y: 0, kind: 'slot', w: 2.2, h: 7 }],
    body: { shape: { kind: 'rect', w: 26, h: 20, r: 5 }, depth: 18 },
    pins: [{ x: -6.35, y: 0, kind: 'blade', w: 1.5, h: 7.9, len: 16 }, { x: 6.35, y: 0, kind: 'blade', w: 1.5, h: 6.3, len: 16 }],
  },
  B: {
    plate: US_PLATE, socket: { shape: { kind: 'rect', w: 34, h: 40, r: 7 }, recessed: false },
    holes: [{ x: -6.35, y: -4.5, kind: 'slot', w: 2.2, h: 8.6 }, { x: 6.35, y: -4.5, kind: 'slot', w: 2.2, h: 7 }, { x: 0, y: 8, kind: 'ground', w: 5.2, h: 5.6 }],
    body: { shape: { kind: 'rect', w: 29, h: 28, r: 6 }, depth: 22 },
    pins: [{ x: -6.35, y: -4.5, kind: 'blade', w: 1.5, h: 7.9, len: 16 }, { x: 6.35, y: -4.5, kind: 'blade', w: 1.5, h: 6.3, len: 16 }, roundPin(0, 8, 4.8)],
  },
  C: {
    plate: SQ_PLATE, socket: { shape: { kind: 'circle', d: 40 }, recessed: true },
    holes: [round(-9.5, 0, 4.8), round(9.5, 0, 4.8)],
    body: { shape: { kind: 'rect', w: 33, h: 15, r: 7.5 }, depth: 22 },
    pins: [roundPin(-9.5, 0, 4), roundPin(9.5, 0, 4)],
  },
  E: {
    plate: SQ_PLATE, socket: { shape: { kind: 'circle', d: 41 }, recessed: true },
    holes: [round(-9.5, 0, 4.8), round(9.5, 0, 4.8)], earthPin: { x: 0, y: -10.5, d: 4.8 },
    body: { shape: { kind: 'circle', d: 37 }, depth: 30 },
    pins: [roundPin(-9.5, 0, 4.8), roundPin(9.5, 0, 4.8)],
  },
  F: {
    plate: SQ_PLATE, socket: { shape: { kind: 'circle', d: 41 }, recessed: true },
    holes: [round(-9.5, 0, 4.8), round(9.5, 0, 4.8)], clips: true,
    body: { shape: { kind: 'flatCircle', d: 37, flat: 31 }, depth: 30 },
    pins: [roundPin(-9.5, 0, 4.8), roundPin(9.5, 0, 4.8)],
  },
  G: {
    plate: UK_PLATE, socket: { shape: { kind: 'rect', w: 44, h: 46, r: 4 }, recessed: false },
    holes: [{ x: 0, y: -11.6, kind: 'slot', w: 4.4, h: 8.4 }, { x: -11.1, y: 10.6, kind: 'slot', w: 6.8, h: 4.4 }, { x: 11.1, y: 10.6, kind: 'slot', w: 6.8, h: 4.4 }],
    body: { shape: { kind: 'rect', w: 44, h: 50, r: 7 }, depth: 26 },
    pins: [{ x: 0, y: -11.6, kind: 'blade', w: 4, h: 8, len: 22 }, { x: -11.1, y: 10.6, kind: 'blade', w: 6.35, h: 4, len: 17.7 }, { x: 11.1, y: 10.6, kind: 'blade', w: 6.35, h: 4, len: 17.7 }],
  },
  I: {
    plate: US_PLATE, socket: { shape: { kind: 'rect', w: 36, h: 40, r: 6 }, recessed: false },
    holes: [{ x: -7.2, y: -3, kind: 'slot', w: 2.2, h: 7.4, rot: 30 }, { x: 7.2, y: -3, kind: 'slot', w: 2.2, h: 7.4, rot: -30 }, { x: 0, y: 9, kind: 'slot', w: 2.2, h: 8.4 }],
    body: { shape: { kind: 'rect', w: 32, h: 30, r: 6 }, depth: 22 },
    pins: [{ x: -7.2, y: -3, kind: 'blade', w: 1.6, h: 6.5, len: 17, rot: 30 }, { x: 7.2, y: -3, kind: 'blade', w: 1.6, h: 6.5, len: 17, rot: -30 }, { x: 0, y: 9, kind: 'blade', w: 1.6, h: 8, len: 20 }],
  },
  J: {
    plate: SQ_PLATE, socket: { shape: { kind: 'hex', w: 34, h: 26, r: 3 }, recessed: true },
    holes: [round(-9.5, -1.5, 4.2), round(9.5, -1.5, 4.2), round(0, 3.5, 4.2)],
    body: { shape: { kind: 'hex', w: 31, h: 23, r: 3 }, depth: 24 },
    pins: [roundPin(-9.5, -1.5, 4), roundPin(9.5, -1.5, 4), roundPin(0, 3.5, 4)],
  },
  L: {
    plate: SQ_PLATE, socket: { shape: { kind: 'rect', w: 36, h: 20, r: 10 }, recessed: true },
    holes: [round(-9.5, 0, 4.4), round(0, 0, 4.4), round(9.5, 0, 4.4)],
    body: { shape: { kind: 'rect', w: 33, h: 17, r: 8.5 }, depth: 24 },
    pins: [roundPin(-9.5, 0, 4), roundPin(0, 0, 4), roundPin(9.5, 0, 4)],
  },
  N: {
    plate: SQ_PLATE, socket: { shape: { kind: 'hex', w: 36, h: 30, r: 6 }, recessed: true },
    holes: [round(-9.5, -1.5, 4.4), round(9.5, -1.5, 4.4), round(0, 1.5, 4.4)],
    body: { shape: { kind: 'hex', w: 33, h: 27, r: 6 }, depth: 26 },
    pins: [roundPin(-9.5, -1.5, 4), roundPin(9.5, -1.5, 4), roundPin(0, 1.5, 4)],
  },
  D: {
    plate: UK_PLATE, socket: { shape: { kind: 'rect', w: 42, h: 46, r: 8 }, recessed: false },
    holes: [round(-9.5, 6, 5.4), round(9.5, 6, 5.4), round(0, -12, 7.4)],
    body: { shape: { kind: 'rect', w: 36, h: 40, r: 10 }, depth: 26 },
    pins: [roundPin(-9.5, 6, 5, 15), roundPin(9.5, 6, 5, 15), roundPin(0, -12, 7, 21)],
  },
  M: {
    plate: UK_PLATE, socket: { shape: { kind: 'rect', w: 50, h: 54, r: 9 }, recessed: false },
    holes: [round(-12.7, 7, 9), round(12.7, 7, 9), round(0, -15, 9)],
    body: { shape: { kind: 'rect', w: 46, h: 50, r: 11 }, depth: 30 },
    pins: [roundPin(-12.7, 7, 7, 18.6), roundPin(12.7, 7, 7, 18.6), roundPin(0, -15, 8.7, 28)],
  },
  H: {
    plate: SQ_PLATE, socket: { shape: { kind: 'circle', d: 36 }, recessed: false },
    holes: [round(-9.5, 3, 4.8), round(9.5, 3, 4.8), round(0, -7.5, 4.8)],
    body: { shape: { kind: 'rect', w: 31, h: 29, r: 7 }, depth: 24 },
    pins: [roundPin(-9.5, 3, 4.5), roundPin(9.5, 3, 4.5), roundPin(0, -7.5, 4.5)],
  },
};

/** Cable boot on the back of the plug. */
export const BOOT = { len: 11, d: 8.4 };

/** Outline of a shape as points (mm), centred on 0,0. */
export function outline(shape: Shape, steps = 7): [number, number][] {
  if (shape.kind === 'circle' || shape.kind === 'flatCircle') {
    const r = shape.d / 2;
    const flat = shape.kind === 'flatCircle' ? shape.flat / 2 : Infinity;
    const pts: [number, number][] = [];
    for (let i = 0; i < 44; i++) {
      const a = (i / 44) * Math.PI * 2;
      pts.push([Math.cos(a) * r, Math.max(-flat, Math.min(flat, Math.sin(a) * r))]);
    }
    return pts;
  }
  if (shape.kind === 'hex') {
    const { w, h } = shape;
    const corners: [number, number][] = [[-w / 2, 0], [-w / 4, -h / 2], [w / 4, -h / 2], [w / 2, 0], [w / 4, h / 2], [-w / 4, h / 2]];
    return roundPolygon(corners, shape.r, steps);
  }
  const { w, h, r } = shape;
  const pts: [number, number][] = [];
  const corner = (cx: number, cy: number, start: number) => {
    for (let i = 0; i <= steps; i++) {
      const a = start + (i / steps) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  corner(w / 2 - r, h / 2 - r, 0);
  corner(-w / 2 + r, h / 2 - r, Math.PI / 2);
  corner(-w / 2 + r, -h / 2 + r, Math.PI);
  corner(w / 2 - r, -h / 2 + r, Math.PI * 1.5);
  return pts;
}

function roundPolygon(corners: [number, number][], r: number, steps: number): [number, number][] {
  const pts: [number, number][] = [];
  const n = corners.length;
  for (let i = 0; i < n; i++) {
    const [px, py] = corners[(i - 1 + n) % n];
    const [cx, cy] = corners[i];
    const [nx, ny] = corners[(i + 1) % n];
    const d1 = Math.hypot(px - cx, py - cy);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const a: [number, number] = [cx + ((px - cx) / d1) * r, cy + ((py - cy) / d1) * r];
    const b: [number, number] = [cx + ((nx - cx) / d2) * r, cy + ((ny - cy) / d2) * r];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      // Quadratic Bézier through the corner.
      const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0];
      const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1];
      pts.push([x, y]);
    }
  }
  return pts;
}

export const toPath = (pts: [number, number][]) => pts.length ? `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z` : '';

/** Convex hull (monotone chain). */
export function hull(points: [number, number][]): [number, number][] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length < 3) return pts;
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

/** Cross-section of a pin (mm, centred on the pin). */
export function pinSection(pin: Pin): [number, number][] {
  if (pin.kind === 'round') return outline({ kind: 'circle', d: pin.w });
  const rot = ((pin.rot ?? 0) * Math.PI) / 180;
  const c = Math.cos(rot), s = Math.sin(rot);
  return ([[-pin.w / 2, -pin.h / 2], [pin.w / 2, -pin.h / 2], [pin.w / 2, pin.h / 2], [-pin.w / 2, pin.h / 2]] as [number, number][])
    .map(([x, y]) => [x * c - y * s, x * s + y * c] as [number, number]);
}

export interface PlugDrawing {
  /** Side walls of the body (the extrusion between the rear and front outlines). */
  side: string;
  rear: string;
  boot: string;
  bootEnd: string;
  pins: string[];
  /** Local box, for floor contact. */
  box: { x0: number; x1: number; y0: number; y1: number };
}

/**
 * The plug in a pseudo-3D view, in px. `theta` tilts the pins from facing the
 * wall (0, seen from the back) to pointing down (90, seen from the side).
 * Origin: the centre of the pin face; the cable boot ends at
 * y = -(depth + boot) * sin(theta).
 */
export function drawPlug(type: PlugType, theta: number, k: number): PlugDrawing {
  const std = STANDARDS[type];
  const sin = Math.sin((theta * Math.PI) / 180);
  const cos = Math.cos((theta * Math.PI) / 180);
  const project = (pts: [number, number][], z: number): [number, number][] => pts.map(([x, y]) => [x * k, (y * cos + z * sin) * k]);
  const section = outline(std.body.shape);
  const D = std.body.depth;
  const rear = project(section, -D);
  const front = project(section, 0);
  const side = hull([...rear, ...front]);
  const bootSection = outline({ kind: 'circle', d: BOOT.d });
  const bootStart = project(bootSection.map(([x, y]) => [x, y] as [number, number]), -D);
  const bootEndPts = project(bootSection.map(([x, y]) => [x * 0.86, y * 0.86] as [number, number]), -D - BOOT.len);
  const pins = std.pins.map(pin => {
    const sec = pinSection(pin).map(([x, y]) => [x + pin.x, y + pin.y] as [number, number]);
    return toPath(hull([...project(sec, 0), ...project(sec, pin.len)]));
  });
  const all = [...side, ...std.pins.flatMap(pin => project([[pin.x, pin.y]], pin.len))];
  const xs = all.map(p => p[0]);
  const ys = all.map(p => p[1]);
  return {
    side: toPath(side),
    rear: toPath(rear),
    boot: toPath(hull([...bootStart, ...bootEndPts])),
    bootEnd: toPath(bootEndPts),
    pins,
    box: { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys, -(D + BOOT.len) * sin * k), y1: Math.max(...ys) },
  };
}
