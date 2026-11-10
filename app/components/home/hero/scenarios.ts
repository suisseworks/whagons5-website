import type { Language } from '../../../lib/locales';

/*
 * What the hero's product animation shows: the same flow in three operations.
 * Someone creates a task with its spot, assignee, priority and due time; the
 * assignee gets it on their phone, starts it, completes the checklist with a
 * photo or signature and closes it; the board and the KPI cards follow.
 * Labels and statuses follow the app (Crear Tarea, Spot, Pendiente…); the
 * data is sample data and the scene says so.
 */

export type SpaceIcon = 'wrench' | 'sparkles' | 'truck' | 'package' | 'clipboard' | 'store';
export type Status = 'todo' | 'doing' | 'done';
export type Tone = 'blue' | 'violet' | 'amber' | 'teal' | 'pink' | 'green' | 'orange';

export interface Space { name: string; icon: SpaceIcon; tone: Tone; count: number }
export interface Card { id: number; title: string; spot: string; status: Status; priority?: 'high' | 'normal'; who: string; tone: Tone }
export interface Scenario {
  space: number;
  task: { id: number; title: string; spot: string; due: string; priority: string; high: boolean; who: string; whoFull: string; tone: Tone };
  checklist: [string, string, string];
  evidence: 'photo' | 'signature';
  evidencePhoto?: string;
  cards: Card[];
  kpis: { total: number; doing: number; doneToday: number; overdue: number };
}

export interface SceneCopy {
  spaces: Space[];
  scenarios: Scenario[];
  ui: {
    spacesTitle: string; search: string; create: string; panelTitle: string; name: string; spot: string; assignees: string;
    priority: string; due: string; cancel: string; statuses: Record<Status, string>; kpis: [string, string, string, string];
    notifyTitle: string; start: string; complete: string; completed: string; checklist: string; photo: string; signature: string;
    sample: string; seen: string; now: string; tasks: string; high: string; attachments: string; drop: string;
  };
}

const ES: SceneCopy = {
  spaces: [
    { name: 'Mantenimiento', icon: 'wrench', tone: 'blue', count: 7 },
    { name: 'Limpieza', icon: 'sparkles', tone: 'violet', count: 12 },
    { name: 'Logística', icon: 'truck', tone: 'amber', count: 9 },
    { name: 'Almacén', icon: 'package', tone: 'teal', count: 5 },
    { name: 'Calidad', icon: 'clipboard', tone: 'pink', count: 3 },
    { name: 'Tiendas', icon: 'store', tone: 'green', count: 8 },
  ],
  scenarios: [
    {
      space: 0,
      task: { id: 2042, title: 'Revisar montacargas 3', spot: 'Almacén B · Pasillo 4', due: 'Hoy 14:00', priority: 'Alta', high: true, who: 'DR', whoFull: 'Diego R.', tone: 'blue' },
      checklist: ['Frenos y bocina', 'Horquillas', 'Nivel de batería'],
      evidence: 'photo', evidencePhoto: '/media/home/mechanic-engine.jpg',
      cards: [
        { id: 2041, title: 'Cambiar luminaria', spot: 'Pasillo 2', status: 'todo', who: 'AM', tone: 'orange' },
        { id: 2039, title: 'Puerta rápida del muelle 3', spot: 'Muelle 3', status: 'todo', priority: 'high', who: 'JP', tone: 'teal' },
        { id: 2036, title: 'Ajustar banda transportadora', spot: 'Línea 1', status: 'doing', who: 'SV', tone: 'violet' },
        { id: 2031, title: 'Inspección de extintores', spot: 'Nave A', status: 'done', who: 'AM', tone: 'orange' },
        { id: 2029, title: 'Limpiar filtros de aire', spot: 'Oficinas', status: 'done', who: 'JP', tone: 'teal' },
        { id: 2027, title: 'Ronda de seguridad', spot: 'Patio de maniobras', status: 'done', who: 'SV', tone: 'violet' },
      ],
      kpis: { total: 18, doing: 3, doneToday: 7, overdue: 1 },
    },
    {
      space: 1,
      task: { id: 3118, title: 'Preparar habitación 204', spot: 'Hab. 204 · Piso 2', due: 'Hoy 13:00', priority: 'Normal', high: false, who: 'LM', whoFull: 'Lucía M.', tone: 'violet' },
      checklist: ['Cama y blancos', 'Baño desinfectado', 'Amenidades repuestas'],
      evidence: 'photo', evidencePhoto: '/images/photos/room-readiness.jpg',
      cards: [
        { id: 3116, title: 'Reponer toallas', spot: 'Carro piso 3', status: 'todo', who: 'RC', tone: 'pink' },
        { id: 3114, title: 'Limpieza profunda', spot: 'Hab. 118', status: 'todo', priority: 'high', who: 'LM', tone: 'violet' },
        { id: 3112, title: 'Salida · Hab. 305', spot: 'Hab. 305', status: 'doing', who: 'EV', tone: 'green' },
        { id: 3109, title: 'Ronda del lobby 10:00', spot: 'Lobby', status: 'done', who: 'RC', tone: 'pink' },
        { id: 3105, title: 'Salida · Hab. 210', spot: 'Hab. 210', status: 'done', who: 'EV', tone: 'green' },
        { id: 3101, title: 'Lavandería · Turno mañana', spot: 'Lavandería', status: 'done', who: 'RC', tone: 'pink' },
      ],
      kpis: { total: 24, doing: 4, doneToday: 11, overdue: 0 },
    },
    {
      space: 2,
      task: { id: 4207, title: 'Entrega en Tienda 14', spot: 'Tienda 14 · Zona norte', due: 'Hoy 11:30', priority: 'Alta', high: true, who: 'MP', whoFull: 'Marco P.', tone: 'amber' },
      checklist: ['Carga verificada', 'Foto de la entrega', 'Firma de recepción'],
      evidence: 'signature',
      cards: [
        { id: 4205, title: 'Recoger devoluciones', spot: 'CD Sur', status: 'todo', who: 'JP', tone: 'teal' },
        { id: 4203, title: 'Revisión de la unidad 07', spot: 'Patio', status: 'todo', priority: 'high', who: 'AM', tone: 'orange' },
        { id: 4201, title: 'Ruta norte · 6 paradas', spot: 'Zona norte', status: 'doing', who: 'MP', tone: 'amber' },
        { id: 4198, title: 'Entrega en Tienda 9', spot: 'Tienda 9', status: 'done', who: 'SV', tone: 'violet' },
        { id: 4196, title: 'Checklist de salida · U03', spot: 'Patio', status: 'done', who: 'JP', tone: 'teal' },
        { id: 4193, title: 'Conteo del muelle 2', spot: 'Muelle 2', status: 'done', who: 'AM', tone: 'orange' },
      ],
      kpis: { total: 15, doing: 2, doneToday: 6, overdue: 1 },
    },
  ],
  ui: {
    spacesTitle: 'Espacios', search: 'Buscar', create: 'Crear Tarea', panelTitle: 'Crear Nueva Tarea', name: 'Nombre', spot: 'Spot',
    assignees: 'Asignados', priority: 'Prioridad', due: 'Vence', cancel: 'Cancelar',
    statuses: { todo: 'Pendiente', doing: 'En progreso', done: 'Completada' },
    kpis: ['Total tareas', 'En progreso', 'Finalizadas hoy', 'Vencidas'],
    notifyTitle: 'Nueva tarea asignada', start: 'Iniciar', complete: 'Completar', completed: 'Completada', checklist: 'Checklist',
    photo: 'Foto adjunta', signature: 'Firma de quien recibe', sample: 'Interfaz de Whagons · datos de ejemplo', seen: 'Visto', now: 'ahora', tasks: 'Tareas', high: 'Alta', attachments: 'Adjuntos', drop: 'Arrastra archivos aquí o haz clic para adjuntar',
  },
};

const EN: SceneCopy = {
  spaces: [
    { name: 'Maintenance', icon: 'wrench', tone: 'blue', count: 7 },
    { name: 'Cleaning', icon: 'sparkles', tone: 'violet', count: 12 },
    { name: 'Logistics', icon: 'truck', tone: 'amber', count: 9 },
    { name: 'Warehouse', icon: 'package', tone: 'teal', count: 5 },
    { name: 'Quality', icon: 'clipboard', tone: 'pink', count: 3 },
    { name: 'Stores', icon: 'store', tone: 'green', count: 8 },
  ],
  scenarios: [
    {
      space: 0,
      task: { id: 2042, title: 'Check forklift 3', spot: 'Warehouse B · Aisle 4', due: 'Today 2:00 PM', priority: 'High', high: true, who: 'DR', whoFull: 'Diego R.', tone: 'blue' },
      checklist: ['Brakes and horn', 'Forks', 'Battery level'],
      evidence: 'photo', evidencePhoto: '/media/home/mechanic-engine.jpg',
      cards: [
        { id: 2041, title: 'Replace light fixture', spot: 'Aisle 2', status: 'todo', who: 'AM', tone: 'orange' },
        { id: 2039, title: 'Dock 3 rapid door', spot: 'Dock 3', status: 'todo', priority: 'high', who: 'JP', tone: 'teal' },
        { id: 2036, title: 'Adjust conveyor belt', spot: 'Line 1', status: 'doing', who: 'SV', tone: 'violet' },
        { id: 2031, title: 'Fire extinguisher check', spot: 'Bay A', status: 'done', who: 'AM', tone: 'orange' },
        { id: 2029, title: 'Clean air filters', spot: 'Offices', status: 'done', who: 'JP', tone: 'teal' },
        { id: 2027, title: 'Security round', spot: 'Truck yard', status: 'done', who: 'SV', tone: 'violet' },
      ],
      kpis: { total: 18, doing: 3, doneToday: 7, overdue: 1 },
    },
    {
      space: 1,
      task: { id: 3118, title: 'Prepare room 204', spot: 'Room 204 · Floor 2', due: 'Today 1:00 PM', priority: 'Normal', high: false, who: 'LM', whoFull: 'Lucía M.', tone: 'violet' },
      checklist: ['Bed and linens', 'Bathroom disinfected', 'Amenities restocked'],
      evidence: 'photo', evidencePhoto: '/images/photos/room-readiness.jpg',
      cards: [
        { id: 3116, title: 'Restock towels', spot: 'Floor 3 cart', status: 'todo', who: 'RC', tone: 'pink' },
        { id: 3114, title: 'Deep clean', spot: 'Room 118', status: 'todo', priority: 'high', who: 'LM', tone: 'violet' },
        { id: 3112, title: 'Checkout · Room 305', spot: 'Room 305', status: 'doing', who: 'EV', tone: 'green' },
        { id: 3109, title: 'Lobby round 10:00', spot: 'Lobby', status: 'done', who: 'RC', tone: 'pink' },
        { id: 3105, title: 'Checkout · Room 210', spot: 'Room 210', status: 'done', who: 'EV', tone: 'green' },
        { id: 3101, title: 'Laundry · Morning shift', spot: 'Laundry', status: 'done', who: 'RC', tone: 'pink' },
      ],
      kpis: { total: 24, doing: 4, doneToday: 11, overdue: 0 },
    },
    {
      space: 2,
      task: { id: 4207, title: 'Delivery to Store 14', spot: 'Store 14 · North zone', due: 'Today 11:30 AM', priority: 'High', high: true, who: 'MP', whoFull: 'Marco P.', tone: 'amber' },
      checklist: ['Load verified', 'Delivery photo', 'Recipient signature'],
      evidence: 'signature',
      cards: [
        { id: 4205, title: 'Collect returns', spot: 'South DC', status: 'todo', who: 'JP', tone: 'teal' },
        { id: 4203, title: 'Truck 07 inspection', spot: 'Yard', status: 'todo', priority: 'high', who: 'AM', tone: 'orange' },
        { id: 4201, title: 'North route · 6 stops', spot: 'North zone', status: 'doing', who: 'MP', tone: 'amber' },
        { id: 4198, title: 'Delivery to Store 9', spot: 'Store 9', status: 'done', who: 'SV', tone: 'violet' },
        { id: 4196, title: 'Departure checklist · T03', spot: 'Yard', status: 'done', who: 'JP', tone: 'teal' },
        { id: 4193, title: 'Dock 2 count', spot: 'Dock 2', status: 'done', who: 'AM', tone: 'orange' },
      ],
      kpis: { total: 15, doing: 2, doneToday: 6, overdue: 1 },
    },
  ],
  ui: {
    spacesTitle: 'Spaces', search: 'Search', create: 'Create Task', panelTitle: 'Create New Task', name: 'Name', spot: 'Spot',
    assignees: 'Assignees', priority: 'Priority', due: 'Due', cancel: 'Cancel',
    statuses: { todo: 'Pending', doing: 'In progress', done: 'Completed' },
    kpis: ['Total tasks', 'In progress', 'Done today', 'Overdue'],
    notifyTitle: 'New task assigned', start: 'Start', complete: 'Complete', completed: 'Completed', checklist: 'Checklist',
    photo: 'Photo attached', signature: 'Recipient signature', sample: 'Whagons interface · sample data', seen: 'Seen', now: 'now', tasks: 'Tasks', high: 'High', attachments: 'Attachments', drop: 'Drop files here or click to attach',
  },
};

export const SCENE_COPY: Record<Language, SceneCopy> = { es: ES, en: EN };

/** The animation's beats, in order. A frame of the scene is a function of the beat and the typed length. */
export const BEATS = [
  'idle', 'cursor', 'pressCreate', 'panel', 'typing', 'spot', 'assignee', 'priority', 'cursorSubmit', 'pressSubmit',
  'created', 'notify', 'start', 'check1', 'check2', 'check3', 'evidence', 'complete', 'settle', 'end',
] as const;
export type Beat = typeof BEATS[number];

/** When each beat starts, in ms from the start of the scene. Typing runs from `typing` to `spot`. */
export const SCRIPT: [number, Beat][] = [
  [0, 'idle'],
  [700, 'cursor'],
  [1750, 'pressCreate'],
  [2000, 'panel'],
  [2550, 'typing'],
  [3900, 'spot'],
  [4300, 'assignee'],
  [4700, 'priority'],
  [5150, 'cursorSubmit'],
  [5900, 'pressSubmit'],
  [6150, 'created'],
  [7000, 'notify'],
  [8500, 'start'],
  [9500, 'check1'],
  [9850, 'check2'],
  [10200, 'check3'],
  [10650, 'evidence'],
  [11700, 'complete'],
  [12900, 'settle'],
  [13600, 'end'],
];
export const SCENE_LENGTH = 13600;
export const TYPE_START = 2550;
export const TYPE_STEP = 52;

export const beatIndex = (beat: Beat) => BEATS.indexOf(beat);
