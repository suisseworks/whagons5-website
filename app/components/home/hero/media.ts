import type { Language } from '../../../lib/locales';

/*
 * Every photo and clip in the home hero mosaic, and the tiles that show them.
 *
 * To replace an asset, drop the new file in public/media/home/ (clips: 6 s,
 * muted H.264 MP4 plus a JPG poster of its first frame) or public/images/, then
 * change `src`/`poster` below. Sources, licences and the shots still missing
 * are listed in docs/home-hero-media.md.
 */

export type MediaKind = 'video' | 'image';

export interface MosaicMedia {
  kind: MediaKind;
  src: string;
  /** First frame of a clip, shown until it plays and whenever it can't. */
  poster?: string;
  /** object-position for the crop. */
  focus?: string;
  /** Sector caption shown on the tile. */
  label: Record<Language, string>;
}

const clip = (name: string, focus: string, es: string, en: string): MosaicMedia => ({
  kind: 'video', src: `/media/home/${name}.mp4`, poster: `/media/home/${name}.jpg`, focus, label: { es, en },
});
const photo = (src: string, focus: string, es: string, en: string): MosaicMedia => ({
  kind: 'image', src, focus, label: { es, en },
});

export const MEDIA = {
  warehouseInventory: clip('warehouse-inventory', '64% 40%', 'Almacén · Inventario', 'Warehouse · Inventory'),
  portCargo: clip('port-cargo', '50% 62%', 'Logística · Puerto', 'Logistics · Port'),
  pharmaCapsules: clip('pharma-capsules', '50% 50%', 'Industria · Producción', 'Industry · Production'),
  mechanicEngine: clip('mechanic-engine', '48% 50%', 'Flota · Mantenimiento', 'Fleet · Maintenance'),
  cleaningBathroom: clip('cleaning-bathroom', '38% 40%', 'Limpieza · Baños', 'Cleaning · Restrooms'),
  packingTape: clip('packing-tape', '50% 45%', 'Almacén · Empaque', 'Warehouse · Packing'),
  labScientist: clip('lab-scientist', '40% 40%', 'Laboratorio · Calidad', 'Lab · Quality'),
  breweryTank: clip('brewery-tank', '50% 35%', 'Alimentos · Planta', 'Food · Plant'),
  deliverySignature: clip('delivery-signature', '50% 50%', 'Entregas · Firma', 'Delivery · Signature'),
  deliveryBoxes: clip('delivery-boxes', '58% 55%', 'Entregas · Carga', 'Delivery · Loading'),
  deliveryWalk: clip('delivery-walk', '50% 42%', 'Equipos en ruta', 'Teams on the road'),
  parcelsCarry: clip('parcels-carry', '66% 50%', 'Entregas · Última milla', 'Delivery · Last mile'),
  mechanicMotorcycle: clip('mechanic-motorcycle', '50% 50%', 'Taller · Mantenimiento', 'Workshop · Maintenance'),
  constructionFrame: clip('construction-frame', '62% 45%', 'Obra · Equipos de campo', 'Construction · Field crews'),

  housekeeping: photo('/images/photos/room-readiness.jpg', '50% 40%', 'Hotelería · Limpieza', 'Hospitality · Housekeeping'),
  electrician: photo('/images/photos/engineering.jpg', '40% 30%', 'Mantenimiento · Instalaciones', 'Maintenance · Facilities'),
  portSupervisors: photo('/images/photos/industries-hero.jpg', '46% 55%', 'Logística · Supervisión', 'Logistics · Supervision'),
  retail: photo('/images/industries/retail.jpg', '62% 50%', 'Comercio · Tienda', 'Retail · Store'),
  constructionAerial: photo('/images/industries/construccion.jpg', '50% 50%', 'Obra · Cuadrillas', 'Construction · Crews'),
  guestService: photo('/images/photos/guest-requests.jpg', '58% 45%', 'Hotelería · Servicio', 'Hospitality · Service'),
  electricalPanel: photo('/images/photos/hero-maintenance.jpg', '52% 40%', 'Edificios · Electricidad', 'Buildings · Electrical'),
  roomInspection: photo('/images/photos/quality.jpg', '46% 40%', 'Hotelería · Inspección', 'Hospitality · Inspection'),
  guestRoom: photo('/images/photos/hero-woman.jpg', '60% 35%', 'Hotelería · Habitaciones', 'Hospitality · Rooms'),
  plumbing: photo('/images/photos/maintenance.jpg', '72% 45%', 'Mantenimiento · Plomería', 'Maintenance · Plumbing'),
} satisfies Record<string, MosaicMedia>;

export type MediaKey = keyof typeof MEDIA;

export interface MosaicTile {
  /** Grid area name; the layouts live in Hero.module.css. */
  id: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
  /** Shown in order; the first is what the page opens with. */
  pool: MediaKey[];
  /** Rough rendered width, for responsive image sizes. */
  sizes: string;
}

/*
 * Desktop is a pinwheel on a 4 × 4 grid (A is the big square, B/F/H wide,
 * D/E tall, C/G small). Tablets keep A–F, phones A, C, D and G. Hospitality is
 * one scene among many: it opens in D only.
 */
export const TILES: MosaicTile[] = [
  { id: 'a', pool: ['warehouseInventory', 'portSupervisors', 'parcelsCarry'], sizes: '(max-width: 767px) 92vw, (max-width: 1099px) 46vw, 28vw' },
  { id: 'b', pool: ['portCargo', 'deliverySignature', 'guestService'], sizes: '(max-width: 1099px) 46vw, 28vw' },
  { id: 'c', pool: ['pharmaCapsules', 'cleaningBathroom', 'electricalPanel'], sizes: '(max-width: 767px) 46vw, (max-width: 1099px) 23vw, 14vw' },
  { id: 'd', pool: ['housekeeping', 'packingTape', 'roomInspection'], sizes: '(max-width: 767px) 46vw, (max-width: 1099px) 23vw, 14vw' },
  { id: 'e', pool: ['electrician', 'labScientist', 'guestRoom'], sizes: '(max-width: 1099px) 23vw, 14vw' },
  { id: 'f', pool: ['mechanicEngine', 'breweryTank', 'plumbing'], sizes: '(max-width: 1099px) 46vw, 28vw' },
  { id: 'g', pool: ['retail', 'mechanicMotorcycle', 'deliveryBoxes'], sizes: '(max-width: 767px) 46vw, 14vw' },
  { id: 'h', pool: ['constructionAerial', 'deliveryWalk', 'constructionFrame'], sizes: '28vw' },
];
