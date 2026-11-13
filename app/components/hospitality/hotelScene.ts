import type { MosaicTile } from '../home/hero/media';
import { SCENE_COPY, type Kpis, type SceneCopy } from '../home/hero/scenarios';

/*
 * What the hotel page's hero shows: a mosaic of hotel scenes only, and the
 * Whagons screen it turns into, with a hotel's departments as spaces and three
 * requests (a leak, a departure clean, a room audit). As on the home page, the
 * screen follows the app and the data is sample data, which the scene says.
 */

/** Same pinwheel as the home page (A is the large tile; phones show A, C, D and G). */
export const HOTEL_TILES: MosaicTile[] = [
  { id: 'a', pool: ['hotelProperty', 'hotelRoomService', 'hotelLobby'], sizes: '(max-width: 767px) 92vw, (max-width: 1099px) 46vw, 28vw' },
  { id: 'b', pool: ['hotelRestaurant', 'guestService'], sizes: '(max-width: 1099px) 46vw, 28vw' },
  { id: 'c', pool: ['hotelBathroom', 'hotelElectrical'], sizes: '(max-width: 767px) 46vw, (max-width: 1099px) 23vw, 14vw' },
  { id: 'd', pool: ['housekeeping', 'hotelGardens'], sizes: '(max-width: 767px) 46vw, (max-width: 1099px) 23vw, 14vw' },
  { id: 'e', pool: ['guestRoom', 'electrician'], sizes: '(max-width: 1099px) 23vw, 14vw' },
  { id: 'f', pool: ['hotelKitchen', 'plumbing'], sizes: '(max-width: 1099px) 46vw, 28vw' },
  { id: 'g', pool: ['hotelCafe', 'roomInspection'], sizes: '(max-width: 767px) 46vw, 14vw' },
  { id: 'h', pool: ['hotelTeam', 'hotelBakery'], sizes: '28vw' },
];

const KPIS: Kpis[] = [
  { created: [9, 12, 8, 11, 10, 13, 11], done: 44, total: 51, avgTrend: [52, 49, 47, 48, 44, 41, 40], avgAfter: 38, byStatus: { todo: 6, doing: 3, done: 8 } },
  { created: [24, 27, 22, 29, 26, 28, 25], done: 96, total: 104, avgTrend: [36, 35, 33, 34, 31, 30, 29], avgAfter: 28, byStatus: { todo: 9, doing: 5, done: 14 } },
  { created: [4, 6, 3, 5, 5, 6, 4], done: 19, total: 22, avgTrend: [44, 42, 43, 40, 38, 37, 36], avgAfter: 35, byStatus: { todo: 3, doing: 1, done: 4 } },
];

export const HOTEL_SCENE: SceneCopy = {
  spaces: [
    { name: 'Ama de llaves', icon: 'bed', tone: 'teal', count: 14 },
    { name: 'Mantenimiento', icon: 'wrench', tone: 'blue', count: 7 },
    { name: 'Recepción', icon: 'bell', tone: 'amber', count: 9 },
    { name: 'Calidad', icon: 'shield', tone: 'pink', count: 4 },
    { name: 'Alimentos y bebidas', icon: 'utensils', tone: 'orange', count: 6 },
    { name: 'Gerencia', icon: 'chart', tone: 'violet', count: 3 },
  ],
  scenarios: [
    {
      space: 1,
      task: { id: 2042, title: 'Fuga en el lavamanos', spot: 'Habitación 204', due: 'Hoy 09:40', priority: 'Alta', high: true, who: 'JM', whoFull: 'Javier M.', tone: 'blue', tag: { name: 'Plomería', tone: 'blue' } },
      checklist: ['Cerrar la llave de paso', 'Cambiar el empaque', 'Probar sin fugas'],
      evidence: 'photo', evidencePhoto: '/images/photos/maintenance.jpg',
      cards: [
        { id: 2041, title: 'Aire acondicionado no enfría', spot: 'Habitación 118', status: 'todo', who: 'RC', tone: 'teal', tag: { name: 'Climatización', tone: 'teal' }, notes: 1 },
        { id: 2039, title: 'Cerradura no lee la tarjeta', spot: 'Habitación 310', status: 'todo', priority: 'high', who: 'JM', tone: 'blue', tag: { name: 'Correctivo', tone: 'orange' }, notes: 2, files: 1 },
        { id: 2036, title: 'Luminaria del pasillo', spot: 'Piso 2 · Pasillo norte', status: 'doing', who: 'SV', tone: 'violet', tag: { name: 'Eléctrico', tone: 'amber' }, notes: 1 },
        { id: 2031, title: 'Preventivo de la caldera', spot: 'Cuarto de máquinas', status: 'done', who: 'RC', tone: 'teal', tag: { name: 'Preventivo', tone: 'blue' }, files: 3 },
        { id: 2029, title: 'Revisión de la piscina', spot: 'Piscina', status: 'done', who: 'SV', tone: 'violet', tag: { name: 'Rutina', tone: 'green' }, files: 2 },
        { id: 2027, title: 'Televisor sin señal', spot: 'Habitación 207', status: 'done', who: 'JM', tone: 'blue', tag: { name: 'Correctivo', tone: 'orange' }, notes: 1, files: 1 },
      ],
      kpis: KPIS[0],
    },
    {
      space: 0,
      task: { id: 3127, title: 'Limpieza de salida', spot: 'Habitación 312', due: 'Hoy 13:00', priority: 'Alta', high: true, who: 'LC', whoFull: 'Lucía C.', tone: 'teal', tag: { name: 'Salida', tone: 'teal' } },
      checklist: ['Cama y blancos', 'Baño y amenidades', 'Minibar y detalles'],
      evidence: 'photo', evidencePhoto: '/images/photos/room-readiness.jpg',
      cards: [
        { id: 3125, title: 'Toallas adicionales', spot: 'Habitación 118', status: 'todo', who: 'PG', tone: 'pink', tag: { name: 'Huésped', tone: 'pink' }, notes: 1 },
        { id: 3123, title: 'Cuna para bebé', spot: 'Habitación 221', status: 'todo', priority: 'high', who: 'LC', tone: 'teal', tag: { name: 'Huésped', tone: 'pink' }, notes: 2 },
        { id: 3121, title: 'Limpieza de estancia', spot: 'Habitación 305', status: 'doing', who: 'MR', tone: 'amber', tag: { name: 'Estancia', tone: 'violet' }, files: 1 },
        { id: 3118, title: 'Inspección de habitación', spot: 'Habitación 210', status: 'done', who: 'PG', tone: 'pink', tag: { name: 'Inspección', tone: 'green' }, files: 4 },
        { id: 3115, title: 'Lobby y pasillos', spot: 'Áreas públicas', status: 'done', who: 'MR', tone: 'amber', tag: { name: 'Áreas públicas', tone: 'amber' }, files: 2 },
        { id: 3112, title: 'Limpieza de salida', spot: 'Habitación 109', status: 'done', who: 'LC', tone: 'teal', tag: { name: 'Salida', tone: 'teal' }, notes: 1, files: 3 },
      ],
      kpis: KPIS[1],
    },
    {
      space: 3,
      task: { id: 4016, title: 'Auditoría de habitación', spot: 'Piso 3 · Habitación 305', due: 'Hoy 16:00', priority: 'Normal', high: false, who: 'AV', whoFull: 'Andrea V.', tone: 'pink', tag: { name: 'Auditoría', tone: 'pink' } },
      checklist: ['Limpieza', 'Mantenimiento', 'Presentación'],
      evidence: 'signature',
      cards: [
        { id: 4014, title: 'Auditoría de cocina', spot: 'Restaurante', status: 'todo', who: 'AV', tone: 'pink', tag: { name: 'Auditoría', tone: 'pink' }, notes: 1 },
        { id: 4012, title: 'Estándar de bienvenida', spot: 'Recepción', status: 'todo', who: 'DT', tone: 'green', tag: { name: 'Estándares', tone: 'violet' } },
        { id: 4010, title: 'Hallazgo: cortina manchada', spot: 'Habitación 214', status: 'doing', priority: 'high', who: 'DT', tone: 'green', tag: { name: 'Hallazgo', tone: 'orange' }, notes: 2, files: 1 },
        { id: 4007, title: 'Auditoría de áreas públicas', spot: 'Lobby y pasillos', status: 'done', who: 'AV', tone: 'pink', tag: { name: 'Auditoría', tone: 'pink' }, files: 5 },
        { id: 4005, title: 'Hallazgo: señalética', spot: 'Piso 1', status: 'done', who: 'DT', tone: 'green', tag: { name: 'Hallazgo', tone: 'orange' }, notes: 1, files: 2 },
        { id: 4002, title: 'Ronda nocturna', spot: 'Todo el hotel', status: 'done', who: 'AV', tone: 'pink', tag: { name: 'Ronda', tone: 'green' }, files: 3 },
      ],
      kpis: KPIS[2],
    },
  ],
  ui: { ...SCENE_COPY.es.ui, signature: 'Firma de la supervisora' },
};
