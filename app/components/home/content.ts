import type { Language } from '../../lib/locales';
import type { MediaKey } from './hero/media';

/*
 * Home page copy. Every capability named here is one the product has and the
 * site already describes (spaces, spots, custom statuses, forms and
 * checklists, photos and signatures, QR/NFC/voice capture, work plans, the
 * cleaning powerup, KPI cards, approvals, maps, mobile + web, offline, API).
 * Examples are labelled as examples.
 */

export interface AdaptRow { label: string; hint: string; kind: 'chips' | 'flow' | 'text'; values: Record<AdaptSector, string | string[]> }
export type AdaptSector = 'cleaning' | 'maintenance' | 'logistics' | 'retail';

export interface Context {
  slug: string;
  name: string;
  who: string;
  media: MediaKey;
  alt: string;
  day: [string, string][];
  uses: string[];
  link?: { label: string; href: string };
}

export interface Step { role: string; title: string; text: string; video: string; label: string; guide?: { label: string; href: string } }

const es = {
  hero: {
    badge: 'Las demos ya están abiertas',
    titleA: 'Whagons se adapta a tu empresa.',
    titleB: 'Y no al revés.',
    lead: 'Coordina personas, tareas y operaciones en un solo lugar. Espacios, estados, formularios y rutinas se configuran según cómo trabaja tu equipo, en el teléfono y en la web.',
    mosaicLabel: 'Mosaico de operaciones reales: almacenes, logística, limpieza, mantenimiento, comercio, industria y hotelería. Después todos los cuadros giran y forman una animación de la interfaz de Whagons en la que se crea una tarea, se asigna, cambia de estado y se actualizan los indicadores.',
    pause: 'Pausar la animación',
    play: 'Reanudar la animación',
  },
  clients: { label: 'Equipos que ya trabajan con Whagons', award: 'Producto Innovador del Año 2017' },
  adapt: {
    eyebrow: 'Cómo se adapta',
    title: 'Tu operación pone la estructura. Whagons la sigue.',
    lead: 'No tienes que cambiar tu forma de trabajar para usar Whagons. Configuramos contigo los equipos, los lugares, los pasos y la evidencia que tu operación ya usa.',
    principles: [
      ['Tus nombres', 'Espacios, estados y campos con el vocabulario de tu equipo.'],
      ['Tus reglas', 'Responsables, plazos, aprobaciones y escalamientos según tu operación.'],
      ['Tus sistemas', 'Funciona junto a lo que ya usas, con API e integraciones definidas contigo.'],
    ] as [string, string][],
    tabsLabel: 'Ver un ejemplo de configuración',
    sectors: { cleaning: 'Limpieza', maintenance: 'Mantenimiento', logistics: 'Logística', retail: 'Comercio' } as Record<AdaptSector, string>,
    rows: [
      { label: 'Espacios', kind: 'chips', hint: 'Cada equipo, su espacio', values: { cleaning: ['Ama de llaves', 'Lavandería', 'Áreas comunes'], maintenance: ['Correctivos', 'Preventivos', 'Proveedores'], logistics: ['Despacho', 'Rutas', 'Almacén'], retail: ['Tiendas', 'Auditorías', 'Mantenimiento'] } },
      { label: 'Spots', kind: 'chips', hint: 'Dónde ocurre el trabajo', values: { cleaning: ['Habitaciones', 'Pisos', 'Baños del lobby'], maintenance: ['Plantas', 'Máquinas', 'Vehículos'], logistics: ['Muelles', 'Clientes', 'Unidades'], retail: ['Tiendas', 'Bodegas', 'Cámaras de frío'] } },
      { label: 'Estados', kind: 'flow', hint: 'Tus pasos, con tus nombres', values: { cleaning: ['Sucia', 'En limpieza', 'Limpia', 'Inspeccionada'], maintenance: ['Reportada', 'Asignada', 'En reparación', 'Verificada'], logistics: ['Programada', 'En ruta', 'Entregada', 'Firmada'], retail: ['Pendiente', 'En revisión', 'Corregida', 'Aprobada'] } },
      { label: 'Cierre', kind: 'text', hint: 'La evidencia que pides', values: { cleaning: 'Checklist de habitación y foto del baño', maintenance: 'Repuestos usados y fotos de antes y después', logistics: 'Foto de la carga y firma de quien recibe', retail: 'Fotos de góndola y puntaje de la auditoría' } },
      { label: 'Rutinas', kind: 'text', hint: 'Lo que se repite, solo', values: { cleaning: 'Todos los días a las 7:00, una tarea por habitación', maintenance: 'Cada mes, una tarea por equipo', logistics: 'Antes de cada salida, la revisión de la unidad', retail: 'Apertura y cierre, en cada tienda' } },
      { label: 'Vista', kind: 'text', hint: 'Cómo lo ve tu equipo', values: { cleaning: 'Tablero de habitaciones', maintenance: 'Kanban y calendario', logistics: 'Mapa y lista del día', retail: 'Lista por tienda y tarjetas KPI' } },
    ] as AdaptRow[],
    note: 'Ejemplos de configuración. Los nombres, campos y pasos los defines con nuestro equipo durante la puesta en marcha.',
  },
  contexts: {
    eyebrow: 'En distintos contextos',
    title: 'El mismo sistema, en operaciones muy distintas.',
    lead: 'Un día con Whagons en algunos de los equipos con los que trabajamos.',
    listLabel: 'Elegir un contexto',
    dayLabel: 'Un día con Whagons',
    usesLabel: 'Lo que usa',
    missing: '¿Tu operación no aparece?',
    missingLink: 'Cuéntanos cómo trabaja tu equipo',
    allLink: 'Ver todas las industrias',
    items: [
      { slug: 'limpieza', name: 'Limpieza', who: 'Hoteles, oficinas, hospitales y edificios', media: 'housekeeping', alt: 'Una camarista con su carro en el pasillo de un hotel',
        day: [['07:00', 'Whagons crea la ronda del día: una tarea por habitación o baño, con su responsable.'], ['10:30', 'Cada habitación pasa de sucia a en limpieza y a limpia; supervisión ve el avance del turno.'], ['15:00', 'Una inspección falla y se convierte en una tarea correctiva con plazo.']],
        uses: ['Planes de trabajo', 'Limpieza', 'Checklists', 'Tarjetas KPI'] },
      { slug: 'mantenimiento', name: 'Mantenimiento', who: 'Plantas, edificios, flotas y hoteles', media: 'mechanicEngine', alt: 'Un mecánico revisando el motor de un vehículo',
        day: [['06:00', 'Los preventivos del turno aparecen solos, por equipo y por ubicación.'], ['08:20', 'Un operario escanea el QR de una bomba y reporta una fuga; llega al técnico de turno.'], ['11:45', 'El técnico registra los repuestos y cierra con fotos de antes y después.']],
        uses: ['QR y NFC', 'Activos', 'Planes de trabajo', 'Fotos'] },
      { slug: 'logistica', name: 'Logística', who: 'Centros de distribución, almacenes y reparto', media: 'warehouseInventory', alt: 'Un trabajador revisa el inventario entre estanterías de un almacén',
        day: [['05:30', 'La unidad sale después de su checklist de revisión.'], ['09:10', 'Cada entrega es una tarea con cliente, hora y responsable.'], ['12:40', 'La entrega se cierra con foto de la carga y firma de quien recibe.']],
        uses: ['Checklists', 'Firmas', 'Fotos', 'Mapa'] },
      { slug: 'comercio', name: 'Comercio', who: 'Cadenas de tiendas, supermercados y franquicias', media: 'retail', alt: 'Dos personas en el mostrador de una tienda',
        day: [['06:30', 'Cada tienda hace su checklist de apertura; la oficina central ve cuáles van tarde.'], ['10:00', 'Una auditoría de góndola con fotos genera tareas con fecha.'], ['13:15', 'Falla un congelador en la tienda 14: se asigna al técnico y la tienda sigue el estado.']],
        uses: ['Planes de trabajo', 'Formularios', 'Tarjetas KPI', 'Ubicaciones'] },
      { slug: 'hoteleria', name: 'Hotelería', who: 'Hoteles, resorts y hoteles boutique', media: 'roomInspection', alt: 'Una supervisora revisa una tableta en el pasillo de un hotel',
        day: [['07:10', 'Recepción reporta por voz una fuga en la 204; mantenimiento la recibe con la ubicación.'], ['09:30', 'Ama de llaves limpia, supervisión inspecciona con checklist y la habitación se libera.'], ['14:00', 'Toallas extra para la 312, con un objetivo de 15 minutos.']],
        uses: ['Solicitudes', 'Limpieza', 'Voz y QR', 'Checklists'], link: { label: 'Ver operaciones hoteleras', href: '/es/operaciones-hoteleras' } },
      { slug: 'industria', name: 'Industria y alimentos', who: 'Plantas de alimentos, laboratorios y manufactura', media: 'breweryTank', alt: 'Un operario abre un tanque de acero en una planta de bebidas',
        day: [['06:00', 'Controles de temperatura y sanitización en cada turno, con su formulario.'], ['11:00', 'Una desviación se convierte en acción correctiva con responsable y plazo.'], ['16:00', 'Los registros quedan listos para la auditoría.']],
        uses: ['Formularios', 'Acciones correctivas', 'Aprobaciones', 'Historial'] },
    ] as Context[],
  },
  how: {
    eyebrow: 'Cómo funciona',
    title: 'Lo que hace cada persona, en una sola herramienta.',
    lead: 'De quien reporta en el piso a quien revisa los números del turno. Animaciones de pantallas de Whagons con datos de ejemplo.',
    stepsLabel: 'Pasos',
    steps: [
      { role: 'Quien reporta', title: 'Reporta en segundos', text: 'Crear Tarea, un nombre claro, el spot y una foto. También se puede empezar desde un QR, una etiqueta NFC o por voz.', video: 'first-day-create', label: 'Se abre Crear Nueva Tarea, se escribe el nombre, se elige el spot, se adjunta una foto y la tarea aparece en la lista del equipo.' },
      { role: 'Quien ejecuta', title: 'Avanza y deja rastro', text: 'Quien tiene la tarea cambia el estado cuando empieza, comenta y adjunta fotos. El siguiente turno lee la tarea, no el chat.', video: 'first-day-status', label: 'El estado de una tarea pasa de Pendiente a En progreso y a Completada, y se deja un comentario con foto.' },
      { role: 'Supervisión', title: 'Programa lo que se repite', text: 'Define una vez la rutina, sus spots y su frecuencia. Whagons crea cada tarea a su hora, con su responsable.', video: 'work-plans-schedule', label: 'Se configura un plan de trabajo y, a la hora programada, aparecen solas sus tareas.', guide: { label: 'Guía de Planes de Trabajo', href: '/es/blog/planes-de-trabajo' } },
      { role: 'Gerencia', title: 'Ve el turno de un vistazo', text: 'Las tarjetas KPI muestran arriba de cada espacio el total, lo que está en progreso, lo terminado hoy y lo vencido.', video: 'kpi-cards-template', label: 'Se crean tarjetas KPI desde una plantilla y aparecen arriba del espacio con los datos del momento.', guide: { label: 'Guía de Tarjetas KPI', href: '/es/blog/tarjetas-kpi' } },
    ] as Step[],
    platform: 'Explorar la plataforma',
    features: 'Ver todas las funcionalidades',
    play: 'Reproducir',
    pause: 'Pausar',
    figure: 'Animación de producto',
  },
  proof: {
    eyebrow: 'Clientes',
    title: 'Equipos de distintos sectores ya coordinan su operación así.',
    caseLabel: 'Caso anonimizado publicado por Whagons',
    caseTitle: 'De visitas repetidas a un historial digital de equipos.',
    caseText: 'Un equipo de mantenimiento de refrigeración cambió su flujo operativo en 60 días.',
    caseMetrics: [['−80%', 'visitas repetidas'], ['2 días → 4 h', 'tiempo de resolución'], ['100%', 'historial digital de equipos']] as [string, string][],
    caseLink: 'Leer el caso publicado',
  },
  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Lo que suelen preguntarnos.',
    lead: 'Si tu pregunta no está aquí, escríbenos a hello@whagons.com y te respondemos en un día hábil.',
    items: [
      ['¿Whagons sirve para mi tipo de empresa?', 'Whagons está pensado para operaciones con trabajo que pasa entre personas, turnos y lugares: limpieza, mantenimiento, logística, comercio, hotelería e industria, entre otras. En una conversación revisamos tu caso y te decimos con claridad si encaja.'],
      ['¿Tenemos que cambiar nuestra forma de trabajar?', 'No. Configuramos los espacios, los estados, los formularios y las rutinas con los nombres y los pasos que tu equipo ya usa. Empiezas con un flujo y amplías desde ahí.'],
      ['¿Reemplaza nuestros sistemas actuales?', 'No. Tu ERP, tu PMS u otros sistemas siguen siendo el registro principal. Whagons coordina el trabajo a su alrededor y se conecta mediante API e integraciones definidas para tu operación.'],
      ['¿Funciona en el teléfono y sin conexión?', 'Sí. Tu equipo usa Whagons en el teléfono y en la web. Sin conexión puede consultar la información guardada, y los cambios compatibles se sincronizan al volver la conexión.'],
      ['¿Cómo empezamos?', 'Con un flujo real de tu operación. Configuramos el alcance, capacitamos al equipo y acompañamos la puesta en marcha por etapas. Los cupos de implementación se coordinan según la capacidad real de nuestro equipo.'],
      ['¿Cómo se protege la información?', 'El acceso sigue el rol de cada persona, y nuestra política de seguridad describe los controles que aplicamos.'],
    ] as [string, string][],
    security: 'Leer la política de seguridad',
  },
  final: {
    eyebrow: 'Cómo trabajamos',
    title: 'Empieza con un proceso real de tu operación.',
    text: 'Implementamos por etapas, junto con tu equipo y con acompañamiento personalizado. Cada etapa se adapta a tu operación. Las demos ya están abiertas.',
    note: 'Los cupos de implementación son limitados y se coordinan según la capacidad real de nuestro equipo.',
  },
};

type HomeContent = typeof es;

const en: HomeContent = {
  hero: {
    badge: 'Demos are open now',
    titleA: 'Whagons adapts to your business.',
    titleB: 'Not the other way around.',
    lead: 'Coordinate people, tasks and operations in one place. Spaces, statuses, forms and routines are set up around how your team works, on phones and on the web.',
    mosaicLabel: 'A mosaic of real operations: warehouses, logistics, cleaning, maintenance, retail, industry and hospitality. Then every tile turns over and together they form an animation of the Whagons interface, where a task is created, assigned, moves through its statuses and the indicators update.',
    pause: 'Pause the animation',
    play: 'Resume the animation',
  },
  clients: { label: 'Teams already working with Whagons', award: 'Innovative Product of the Year 2017' },
  adapt: {
    eyebrow: 'How it adapts',
    title: 'Your operation sets the structure. Whagons follows it.',
    lead: 'You don’t have to change how you work to use Whagons. We set up the teams, places, steps and evidence your operation already uses, together with you.',
    principles: [
      ['Your names', 'Spaces, statuses and fields in your team’s own words.'],
      ['Your rules', 'Owners, due times, approvals and escalations that match your operation.'],
      ['Your systems', 'Works alongside what you already use, with an API and integrations defined with you.'],
    ],
    tabsLabel: 'See an example setup',
    sectors: { cleaning: 'Cleaning', maintenance: 'Maintenance', logistics: 'Logistics', retail: 'Retail' },
    rows: [
      { label: 'Spaces', kind: 'chips', hint: 'Each team, its own space', values: { cleaning: ['Housekeeping', 'Laundry', 'Public areas'], maintenance: ['Corrective', 'Preventive', 'Vendors'], logistics: ['Dispatch', 'Routes', 'Warehouse'], retail: ['Stores', 'Audits', 'Maintenance'] } },
      { label: 'Spots', kind: 'chips', hint: 'Where the work happens', values: { cleaning: ['Rooms', 'Floors', 'Lobby restrooms'], maintenance: ['Plants', 'Machines', 'Vehicles'], logistics: ['Docks', 'Customers', 'Trucks'], retail: ['Stores', 'Stockrooms', 'Cold rooms'] } },
      { label: 'Statuses', kind: 'flow', hint: 'Your steps, your names', values: { cleaning: ['Dirty', 'Cleaning', 'Clean', 'Inspected'], maintenance: ['Reported', 'Assigned', 'In repair', 'Verified'], logistics: ['Scheduled', 'On route', 'Delivered', 'Signed'], retail: ['Pending', 'In review', 'Fixed', 'Approved'] } },
      { label: 'Close-out', kind: 'text', hint: 'The evidence you ask for', values: { cleaning: 'Room checklist and a photo of the bathroom', maintenance: 'Parts used and before-and-after photos', logistics: 'A photo of the load and the recipient’s signature', retail: 'Shelf photos and the audit score' } },
      { label: 'Routines', kind: 'text', hint: 'What repeats, on its own', values: { cleaning: 'Every day at 7:00, one task per room', maintenance: 'Every month, one task per machine', logistics: 'Before every departure, the truck check', retail: 'Opening and closing, in every store' } },
      { label: 'View', kind: 'text', hint: 'How your team sees it', values: { cleaning: 'Room board', maintenance: 'Kanban and calendar', logistics: 'Map and today’s list', retail: 'List by store and KPI cards' } },
    ],
    note: 'Example setups. You define the names, fields and steps with our team during rollout.',
  },
  contexts: {
    eyebrow: 'In different contexts',
    title: 'One system, very different operations.',
    lead: 'A day with Whagons in some of the teams we work with.',
    listLabel: 'Choose a context',
    dayLabel: 'A day with Whagons',
    usesLabel: 'What it uses',
    missing: 'Don’t see your operation?',
    missingLink: 'Tell us how your team works',
    allLink: 'See all industries',
    items: [
      { slug: 'cleaning', name: 'Cleaning', who: 'Hotels, offices, hospitals and buildings', media: 'housekeeping', alt: 'A room attendant with her cart in a hotel corridor',
        day: [['07:00', 'Whagons creates the day’s round: one task per room or restroom, each with its owner.'], ['10:30', 'Each room moves from dirty to cleaning to clean; supervisors see the shift’s progress.'], ['15:00', 'A failed inspection becomes a corrective task with a due time.']],
        uses: ['Work plans', 'Cleaning', 'Checklists', 'KPI cards'] },
      { slug: 'maintenance', name: 'Maintenance', who: 'Plants, buildings, fleets and hotels', media: 'mechanicEngine', alt: 'A mechanic checking a vehicle engine',
        day: [['06:00', 'The shift’s preventive work appears on its own, by team and by location.'], ['08:20', 'An operator scans a pump’s QR code and reports a leak; it reaches the technician on shift.'], ['11:45', 'The technician records the parts used and closes with before-and-after photos.']],
        uses: ['QR and NFC', 'Assets', 'Work plans', 'Photos'] },
      { slug: 'logistics', name: 'Logistics', who: 'Distribution centers, warehouses and delivery', media: 'warehouseInventory', alt: 'A worker checks inventory between warehouse shelves',
        day: [['05:30', 'The truck leaves after its inspection checklist.'], ['09:10', 'Each delivery is a task with a customer, a time and an owner.'], ['12:40', 'The delivery closes with a photo of the load and the recipient’s signature.']],
        uses: ['Checklists', 'Signatures', 'Photos', 'Map'] },
      { slug: 'retail', name: 'Retail', who: 'Store chains, supermarkets and franchises', media: 'retail', alt: 'Two people at a store counter',
        day: [['06:30', 'Every store runs its opening checklist; head office sees which ones are late.'], ['10:00', 'A shelf audit with photos creates tasks with due dates.'], ['13:15', 'A freezer fails at store 14: it goes to the technician and the store follows the status.']],
        uses: ['Work plans', 'Forms', 'KPI cards', 'Locations'] },
      { slug: 'hospitality', name: 'Hospitality', who: 'Hotels, resorts and boutique properties', media: 'roomInspection', alt: 'A supervisor checks a tablet in a hotel corridor',
        day: [['07:10', 'Front desk reports a leak in 204 by voice; maintenance gets it with the location.'], ['09:30', 'Housekeeping cleans, a supervisor inspects with a checklist and the room is released.'], ['14:00', 'Extra towels for 312, with a 15-minute target.']],
        uses: ['Requests', 'Cleaning', 'Voice and QR', 'Checklists'], link: { label: 'Explore hotel operations', href: '/en/hotel-operations' } },
      { slug: 'industry', name: 'Industry and food', who: 'Food plants, labs and manufacturing', media: 'breweryTank', alt: 'An operator opens a steel tank in a beverage plant',
        day: [['06:00', 'Temperature and sanitation checks every shift, each with its form.'], ['11:00', 'A deviation becomes a corrective action with an owner and a due time.'], ['16:00', 'The records are ready for the audit.']],
        uses: ['Forms', 'Corrective actions', 'Approvals', 'History'] },
    ],
  },
  how: {
    eyebrow: 'How it works',
    title: 'What each person does, in one tool.',
    lead: 'From whoever reports on the floor to whoever reviews the shift’s numbers. Animations of Whagons screens with sample data.',
    stepsLabel: 'Steps',
    steps: [
      { role: 'Whoever reports', title: 'Report it in seconds', text: 'Create Task, a clear name, the spot and a photo. Work can also start from a QR code, an NFC tag or your voice.', video: 'first-day-create', label: 'Create New Task opens, the name is typed, the spot is chosen, a photo is attached and the task appears in the team’s list.' },
      { role: 'Whoever does it', title: 'Move it forward, leave a trail', text: 'The person on the task changes its status when they start, comments and adds photos. The next shift reads the task, not the chat.', video: 'first-day-status', label: 'A task moves from Pending to In progress to Completed, with a comment and a photo.' },
      { role: 'Supervisors', title: 'Schedule what repeats', text: 'Set up the routine, its spots and how often it repeats once. Whagons creates every task on time, with its owner.', video: 'work-plans-schedule', label: 'A work plan is set up and, at the scheduled time, its tasks appear on their own.', guide: { label: 'Work Plans guide', href: '/en/blog/work-plans' } },
      { role: 'Managers', title: 'See the shift at a glance', text: 'KPI cards show the total, what is in progress, what finished today and what is overdue at the top of every space.', video: 'kpi-cards-template', label: 'KPI cards are created from a template and appear at the top of the space with live numbers.', guide: { label: 'KPI Cards guide', href: '/en/blog/kpi-cards' } },
    ],
    platform: 'Explore the platform',
    features: 'See all features',
    play: 'Play',
    pause: 'Pause',
    figure: 'Product animation',
  },
  proof: {
    eyebrow: 'Customers',
    title: 'Teams in different industries already coordinate their work this way.',
    caseLabel: 'Anonymized case published by Whagons',
    caseTitle: 'From repeat visits to a digital equipment history.',
    caseText: 'A refrigeration maintenance team changed its operating flow in 60 days.',
    caseMetrics: [['−80%', 'repeat visits'], ['2 days → 4 h', 'resolution time'], ['100%', 'digital equipment history']],
    caseLink: 'Read the published case',
  },
  faq: {
    eyebrow: 'Frequently asked questions',
    title: 'What people usually ask us.',
    lead: 'If your question isn’t here, write to hello@whagons.com and we’ll answer within one business day.',
    items: [
      ['Does Whagons fit my kind of business?', 'Whagons is built for operations where work passes between people, shifts and places: cleaning, maintenance, logistics, retail, hospitality and industry, among others. In one conversation we review your case and tell you plainly whether it fits.'],
      ['Do we have to change how we work?', 'No. We set up spaces, statuses, forms and routines with the names and steps your team already uses. You start with one workflow and grow from there.'],
      ['Does it replace our current systems?', 'No. Your ERP, PMS or other systems stay the main record. Whagons coordinates the work around them and connects through an API and integrations defined for your operation.'],
      ['Does it work on phones and offline?', 'Yes. Your team uses Whagons on phones and on the web. Offline, they can check saved information, and supported changes sync once the connection is back.'],
      ['How do we get started?', 'With one real workflow from your operation. We configure the scope, train your team and support the rollout in stages. Implementation slots are scheduled according to our team’s real capacity.'],
      ['How is our information protected?', 'Access follows each person’s role, and our security policy describes the controls we apply.'],
    ],
    security: 'Read the security policy',
  },
  final: {
    eyebrow: 'How we work',
    title: 'Start with one real process from your operation.',
    text: 'We implement in stages, together with your team and with hands-on support. Each stage is set up around your operation. Demos are open now.',
    note: 'Implementation slots are limited and scheduled according to our team’s real capacity.',
  },
};

export const HOME_CONTENT: Record<Language, HomeContent> = { es, en };

export const CUSTOMERS = ['Grupo El Lagar', 'Colegio Humboldt', 'Rythmia', 'IQS', 'Grupo Colono', 'Refritec'];

export const TESTIMONIALS: Record<Language, { quote: string; name: string; role: string }[]> = {
  es: [
    { quote: 'Facilita tener un control sobre los procesos del día a día. Es una herramienta muy útil y sencilla de utilizar.', name: 'Leela Wernscheid', role: 'Gerente de Operaciones · Colegio Humboldt' },
    { quote: 'De mi parte estoy muy satisfecho, porque controlar más de 1.500 empleados en una disciplina no es sencillo.', name: 'Guido Tenorio', role: 'Gerente de Operaciones · Grupo El Lagar' },
    { quote: 'Recomiendo Whagons al 100%. Creo en la herramienta y en la gente que trabaja para Whagons.', name: 'Jorge Varela', role: 'Gerente General · Rythmia' },
    { quote: 'Con Whagons, la certificación ISO 9001:2015 se ha facilitado.', name: 'Isaac Mena Chacón', role: 'Gerente de Calidad · IQS' },
    { quote: 'Whagons ha sido de gran importancia porque nos permite monitorear las diferentes áreas de la empresa.', name: 'William Ulate Loaiza', role: 'Gerente de Operaciones · Grupo Colono' },
    { quote: 'En Refritec estamos 100% satisfechos con Whagons por la experiencia vivida y las mejoras logradas con la implementación de esta herramienta.', name: 'Jonathan Gaitán', role: 'Gerente · Refritec' },
  ],
  en: [
    { quote: 'Whagons makes it easier to control day-to-day processes. It is a very useful and easy-to-use tool.', name: 'Leela Wernscheid', role: 'Operations Manager · Colegio Humboldt' },
    { quote: 'I am very satisfied, because keeping more than 1,500 employees aligned around one discipline is not easy.', name: 'Guido Tenorio', role: 'Operations Manager · Grupo El Lagar' },
    { quote: 'I recommend Whagons 100%. I believe in the tool and in the people behind Whagons.', name: 'Jorge Varela', role: 'General Manager · Rythmia' },
    { quote: 'Whagons has made ISO 9001:2015 certification easier.', name: 'Isaac Mena Chacón', role: 'Quality Manager · IQS' },
    { quote: 'Whagons has been very important because it allows us to monitor the company’s different areas.', name: 'William Ulate Loaiza', role: 'Operations Manager · Grupo Colono' },
    { quote: 'At Refritec we are 100% satisfied with Whagons because of our experience and the improvements achieved through its implementation.', name: 'Jonathan Gaitán', role: 'Manager · Refritec' },
  ],
};

export const CASE_URL = 'https://es.linkedin.com/posts/whagons_mantenimientoindustrial-gesti%C3%B3noperativa-activity-7470803294903312384-VFou';
