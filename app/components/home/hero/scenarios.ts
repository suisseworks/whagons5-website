import type { Language } from '../../../lib/locales';

/*
 * What the hero's product animation shows: the same flow in three field and
 * industrial operations. Someone creates a task with its spot, assignee,
 * priority and due time; the assignee gets it on their phone, starts it,
 * completes the checklist with a photo or signature and closes it; the board
 * and the KPI cards follow (created today, completion rate, average
 * completion time and tasks by status, drawn the way the app's KPI cards draw
 * them). Labels and statuses follow the app (Crear Tarea, Spot, Pendiente…);
 * the data is sample data and the scene says so.
 */

export type SpaceIcon = 'wrench' | 'zap' | 'truck' | 'package' | 'clipboard' | 'hardhat' | 'bed' | 'bell' | 'shield' | 'utensils' | 'chart';
export type Status = 'todo' | 'doing' | 'done';
export type Tone = 'blue' | 'violet' | 'amber' | 'teal' | 'pink' | 'green' | 'orange';

export interface Space { name: string; icon: SpaceIcon; tone: Tone; count: number }
export interface Tag { name: string; tone: Tone }
/** A task on the board. `notes` and `files` are its comment and attachment counts. */
export interface Card { id: number; title: string; spot: string; status: Status; priority?: 'high' | 'normal'; who: string; tone: Tone; tag?: Tag; notes?: number; files?: number }
/**
 * The space's KPI cards before the new task. The new task adds itself: one
 * more created today, one more task this week, its status in the breakdown,
 * and, once closed, one more finished and the lower average.
 */
export interface Kpis {
  /** Tasks created per day over the last seven days; the last is today. */
  created: number[];
  /** Finished and total tasks this week, for the completion rate. */
  done: number;
  total: number;
  /** Average completion time per day over the last seven days, in minutes; the last is today. */
  avgTrend: number[];
  /** Today's average once the new task is closed. */
  avgAfter: number;
  /** Today's tasks by status. */
  byStatus: Record<Status, number>;
}
export interface Scenario {
  space: number;
  task: { id: number; title: string; spot: string; due: string; priority: string; high: boolean; who: string; whoFull: string; tone: Tone; tag: Tag };
  checklist: [string, string, string];
  evidence: 'photo' | 'signature';
  evidencePhoto?: string;
  cards: Card[];
  kpis: Kpis;
}

export interface SceneCopy {
  spaces: Space[];
  scenarios: Scenario[];
  ui: {
    spacesTitle: string; search: string; create: string; panelTitle: string; name: string; spot: string; assignees: string;
    priority: string; due: string; cancel: string; statuses: Record<Status, string>; kpis: [string, string, string, string];
    week: string; taskUnit: string; minutes: string;
    notifyTitle: string; start: string; complete: string; completed: string; checklist: string; photo: string; signature: string;
    sample: string; seen: string; now: string; tasks: string; high: string; attachments: string; drop: string;
  };
}

const KPIS: Kpis[] = [
  { created: [11, 14, 9, 13, 12, 15, 12], done: 41, total: 48, avgTrend: [58, 55, 52, 54, 49, 47, 46], avgAfter: 44, byStatus: { todo: 8, doing: 3, done: 7 } },
  { created: [7, 9, 6, 10, 8, 9, 8], done: 52, total: 58, avgTrend: [104, 98, 95, 99, 92, 88, 86], avgAfter: 83, byStatus: { todo: 9, doing: 4, done: 11 } },
  { created: [16, 19, 14, 21, 18, 20, 17], done: 63, total: 71, avgTrend: [47, 45, 44, 41, 42, 39, 38], avgAfter: 37, byStatus: { todo: 7, doing: 2, done: 6 } },
];

const ES: SceneCopy = {
  spaces: [
    { name: 'Mantenimiento', icon: 'wrench', tone: 'blue', count: 7 },
    { name: 'Servicio en campo', icon: 'zap', tone: 'violet', count: 12 },
    { name: 'Logística', icon: 'truck', tone: 'amber', count: 9 },
    { name: 'Almacén', icon: 'package', tone: 'teal', count: 5 },
    { name: 'Calidad', icon: 'clipboard', tone: 'pink', count: 3 },
    { name: 'Seguridad', icon: 'hardhat', tone: 'green', count: 8 },
  ],
  scenarios: [
    {
      space: 0,
      task: { id: 2042, title: 'Revisar montacargas 3', spot: 'Almacén B · Pasillo 4', due: 'Hoy 14:00', priority: 'Alta', high: true, who: 'DR', whoFull: 'Diego R.', tone: 'blue', tag: { name: 'Preventivo', tone: 'blue' } },
      checklist: ['Frenos y bocina', 'Horquillas', 'Nivel de batería'],
      evidence: 'photo', evidencePhoto: '/media/home/mechanic-engine.jpg',
      cards: [
        { id: 2041, title: 'Cambiar luminaria', spot: 'Pasillo 2', status: 'todo', who: 'AM', tone: 'orange', tag: { name: 'Eléctrico', tone: 'amber' }, notes: 1 },
        { id: 2039, title: 'Puerta rápida del muelle 3', spot: 'Muelle 3', status: 'todo', priority: 'high', who: 'JP', tone: 'teal', tag: { name: 'Correctivo', tone: 'orange' }, notes: 3, files: 2 },
        { id: 2036, title: 'Ajustar banda transportadora', spot: 'Línea 1', status: 'doing', who: 'SV', tone: 'violet', tag: { name: 'Mecánico', tone: 'violet' }, notes: 2, files: 1 },
        { id: 2031, title: 'Inspección de extintores', spot: 'Nave A', status: 'done', who: 'AM', tone: 'orange', tag: { name: 'Seguridad', tone: 'green' }, files: 4 },
        { id: 2029, title: 'Cambio de filtros · Compresor 2', spot: 'Sala de máquinas', status: 'done', who: 'JP', tone: 'teal', tag: { name: 'Preventivo', tone: 'blue' }, notes: 1, files: 2 },
        { id: 2027, title: 'Ronda de seguridad', spot: 'Patio de maniobras', status: 'done', who: 'SV', tone: 'violet', tag: { name: 'Seguridad', tone: 'green' }, files: 3 },
      ],
      kpis: KPIS[0],
    },
    {
      space: 1,
      task: { id: 3118, title: 'Falla en generador G-2', spot: 'Torre B · Sótano 2', due: 'Hoy 13:00', priority: 'Alta', high: true, who: 'LM', whoFull: 'Luis M.', tone: 'violet', tag: { name: 'Eléctrico', tone: 'amber' } },
      checklist: ['Voltaje y frecuencia', 'Nivel de combustible', 'Prueba con carga'],
      evidence: 'photo', evidencePhoto: '/images/photos/engineering.jpg',
      cards: [
        { id: 3116, title: 'Mantenimiento de UPS', spot: 'Centro de datos · Sala 1', status: 'todo', who: 'RC', tone: 'pink', tag: { name: 'Preventivo', tone: 'blue' }, notes: 1 },
        { id: 3114, title: 'Revisar tablero eléctrico', spot: 'Planta Norte · Nave 3', status: 'todo', priority: 'high', who: 'LM', tone: 'violet', tag: { name: 'Eléctrico', tone: 'amber' }, notes: 2, files: 1 },
        { id: 3112, title: 'Calibrar sensores de presión', spot: 'Línea 2', status: 'doing', who: 'EV', tone: 'green', tag: { name: 'Instrumentación', tone: 'teal' }, notes: 4, files: 2 },
        { id: 3109, title: 'Inspección de transformador', spot: 'Subestación A', status: 'done', who: 'RC', tone: 'pink', tag: { name: 'Eléctrico', tone: 'amber' }, files: 3 },
        { id: 3105, title: 'Rodamientos · Bomba 4', spot: 'Planta Sur', status: 'done', who: 'EV', tone: 'green', tag: { name: 'Mecánico', tone: 'violet' }, notes: 2, files: 2 },
        { id: 3101, title: 'Termografía de motores', spot: 'Nave 1', status: 'done', who: 'RC', tone: 'pink', tag: { name: 'Predictivo', tone: 'pink' }, files: 6 },
      ],
      kpis: KPIS[1],
    },
    {
      space: 2,
      task: { id: 4207, title: 'Entrega en Planta Norte', spot: 'Planta Norte · Andén 2', due: 'Hoy 11:30', priority: 'Alta', high: true, who: 'MP', whoFull: 'Marco P.', tone: 'amber', tag: { name: 'Ruta norte', tone: 'amber' } },
      checklist: ['Carga verificada', 'Foto de la entrega', 'Firma de recepción'],
      evidence: 'signature',
      cards: [
        { id: 4205, title: 'Recoger devoluciones', spot: 'CD Sur', status: 'todo', who: 'JP', tone: 'teal', tag: { name: 'Ruta sur', tone: 'teal' }, notes: 1 },
        { id: 4203, title: 'Revisión de la unidad 07', spot: 'Patio', status: 'todo', priority: 'high', who: 'AM', tone: 'orange', tag: { name: 'Flota', tone: 'orange' }, notes: 2, files: 1 },
        { id: 4201, title: 'Ruta norte · 6 paradas', spot: 'Zona norte', status: 'doing', who: 'MP', tone: 'amber', tag: { name: 'Ruta norte', tone: 'amber' }, notes: 3, files: 4 },
        { id: 4198, title: 'Entrega en Obra Torre B', spot: 'Obra Torre B', status: 'done', who: 'SV', tone: 'violet', tag: { name: 'Materiales', tone: 'violet' }, files: 2 },
        { id: 4196, title: 'Checklist de salida · U03', spot: 'Patio', status: 'done', who: 'JP', tone: 'teal', tag: { name: 'Flota', tone: 'orange' }, files: 1 },
        { id: 4193, title: 'Conteo del muelle 2', spot: 'Muelle 2', status: 'done', who: 'AM', tone: 'orange', tag: { name: 'Inventario', tone: 'blue' }, notes: 1, files: 1 },
      ],
      kpis: KPIS[2],
    },
  ],
  ui: {
    spacesTitle: 'Espacios', search: 'Buscar', create: 'Crear Tarea', panelTitle: 'Crear Nueva Tarea', name: 'Nombre', spot: 'Spot',
    assignees: 'Asignados', priority: 'Prioridad', due: 'Vence', cancel: 'Cancelar',
    statuses: { todo: 'Pendiente', doing: 'En progreso', done: 'Completada' },
    kpis: ['Creadas hoy', 'Cumplimiento', 'Tiempo promedio', 'Por estado'],
    week: 'esta semana', taskUnit: 'tareas', minutes: 'min',
    notifyTitle: 'Nueva tarea asignada', start: 'Iniciar', complete: 'Completar', completed: 'Completada', checklist: 'Checklist',
    photo: 'Foto adjunta', signature: 'Firma de quien recibe', sample: 'Interfaz de Whagons · datos de ejemplo', seen: 'Visto', now: 'ahora', tasks: 'Tareas', high: 'Alta', attachments: 'Adjuntos', drop: 'Arrastra archivos aquí o haz clic para adjuntar',
  },
};

const EN: SceneCopy = {
  spaces: [
    { name: 'Maintenance', icon: 'wrench', tone: 'blue', count: 7 },
    { name: 'Field service', icon: 'zap', tone: 'violet', count: 12 },
    { name: 'Logistics', icon: 'truck', tone: 'amber', count: 9 },
    { name: 'Warehouse', icon: 'package', tone: 'teal', count: 5 },
    { name: 'Quality', icon: 'clipboard', tone: 'pink', count: 3 },
    { name: 'Safety', icon: 'hardhat', tone: 'green', count: 8 },
  ],
  scenarios: [
    {
      space: 0,
      task: { id: 2042, title: 'Check forklift 3', spot: 'Warehouse B · Aisle 4', due: 'Today 2:00 PM', priority: 'High', high: true, who: 'DR', whoFull: 'Diego R.', tone: 'blue', tag: { name: 'Preventive', tone: 'blue' } },
      checklist: ['Brakes and horn', 'Forks', 'Battery level'],
      evidence: 'photo', evidencePhoto: '/media/home/mechanic-engine.jpg',
      cards: [
        { id: 2041, title: 'Replace light fixture', spot: 'Aisle 2', status: 'todo', who: 'AM', tone: 'orange', tag: { name: 'Electrical', tone: 'amber' }, notes: 1 },
        { id: 2039, title: 'Dock 3 rapid door', spot: 'Dock 3', status: 'todo', priority: 'high', who: 'JP', tone: 'teal', tag: { name: 'Corrective', tone: 'orange' }, notes: 3, files: 2 },
        { id: 2036, title: 'Adjust conveyor belt', spot: 'Line 1', status: 'doing', who: 'SV', tone: 'violet', tag: { name: 'Mechanical', tone: 'violet' }, notes: 2, files: 1 },
        { id: 2031, title: 'Fire extinguisher check', spot: 'Bay A', status: 'done', who: 'AM', tone: 'orange', tag: { name: 'Safety', tone: 'green' }, files: 4 },
        { id: 2029, title: 'Filter change · Compressor 2', spot: 'Machine room', status: 'done', who: 'JP', tone: 'teal', tag: { name: 'Preventive', tone: 'blue' }, notes: 1, files: 2 },
        { id: 2027, title: 'Safety round', spot: 'Truck yard', status: 'done', who: 'SV', tone: 'violet', tag: { name: 'Safety', tone: 'green' }, files: 3 },
      ],
      kpis: KPIS[0],
    },
    {
      space: 1,
      task: { id: 3118, title: 'Generator G-2 failure', spot: 'Tower B · Basement 2', due: 'Today 1:00 PM', priority: 'High', high: true, who: 'LM', whoFull: 'Luis M.', tone: 'violet', tag: { name: 'Electrical', tone: 'amber' } },
      checklist: ['Voltage and frequency', 'Fuel level', 'Load test'],
      evidence: 'photo', evidencePhoto: '/images/photos/engineering.jpg',
      cards: [
        { id: 3116, title: 'UPS maintenance', spot: 'Data center · Room 1', status: 'todo', who: 'RC', tone: 'pink', tag: { name: 'Preventive', tone: 'blue' }, notes: 1 },
        { id: 3114, title: 'Inspect electrical panel', spot: 'North plant · Bay 3', status: 'todo', priority: 'high', who: 'LM', tone: 'violet', tag: { name: 'Electrical', tone: 'amber' }, notes: 2, files: 1 },
        { id: 3112, title: 'Calibrate pressure sensors', spot: 'Line 2', status: 'doing', who: 'EV', tone: 'green', tag: { name: 'Instrumentation', tone: 'teal' }, notes: 4, files: 2 },
        { id: 3109, title: 'Transformer inspection', spot: 'Substation A', status: 'done', who: 'RC', tone: 'pink', tag: { name: 'Electrical', tone: 'amber' }, files: 3 },
        { id: 3105, title: 'Bearings · Pump 4', spot: 'South plant', status: 'done', who: 'EV', tone: 'green', tag: { name: 'Mechanical', tone: 'violet' }, notes: 2, files: 2 },
        { id: 3101, title: 'Motor thermography', spot: 'Bay 1', status: 'done', who: 'RC', tone: 'pink', tag: { name: 'Predictive', tone: 'pink' }, files: 6 },
      ],
      kpis: KPIS[1],
    },
    {
      space: 2,
      task: { id: 4207, title: 'Delivery to North plant', spot: 'North plant · Dock 2', due: 'Today 11:30 AM', priority: 'High', high: true, who: 'MP', whoFull: 'Marco P.', tone: 'amber', tag: { name: 'North route', tone: 'amber' } },
      checklist: ['Load verified', 'Delivery photo', 'Recipient signature'],
      evidence: 'signature',
      cards: [
        { id: 4205, title: 'Collect returns', spot: 'South DC', status: 'todo', who: 'JP', tone: 'teal', tag: { name: 'South route', tone: 'teal' }, notes: 1 },
        { id: 4203, title: 'Truck 07 inspection', spot: 'Yard', status: 'todo', priority: 'high', who: 'AM', tone: 'orange', tag: { name: 'Fleet', tone: 'orange' }, notes: 2, files: 1 },
        { id: 4201, title: 'North route · 6 stops', spot: 'North zone', status: 'doing', who: 'MP', tone: 'amber', tag: { name: 'North route', tone: 'amber' }, notes: 3, files: 4 },
        { id: 4198, title: 'Delivery to Tower B site', spot: 'Tower B site', status: 'done', who: 'SV', tone: 'violet', tag: { name: 'Materials', tone: 'violet' }, files: 2 },
        { id: 4196, title: 'Departure checklist · T03', spot: 'Yard', status: 'done', who: 'JP', tone: 'teal', tag: { name: 'Fleet', tone: 'orange' }, files: 1 },
        { id: 4193, title: 'Dock 2 count', spot: 'Dock 2', status: 'done', who: 'AM', tone: 'orange', tag: { name: 'Inventory', tone: 'blue' }, notes: 1, files: 1 },
      ],
      kpis: KPIS[2],
    },
  ],
  ui: {
    spacesTitle: 'Spaces', search: 'Search', create: 'Create Task', panelTitle: 'Create New Task', name: 'Name', spot: 'Spot',
    assignees: 'Assignees', priority: 'Priority', due: 'Due', cancel: 'Cancel',
    statuses: { todo: 'Pending', doing: 'In progress', done: 'Completed' },
    kpis: ['Created today', 'Completion rate', 'Avg. completion', 'By status'],
    week: 'this week', taskUnit: 'tasks', minutes: 'min',
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
