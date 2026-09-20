// Source: Whagons_paquetes_de_precios.xlsx, Costa Rica / USA / Centroamérica,
// rows 6–9, 17–23, 57 and 62. Proposed new-customer rates, September 2026.
// Approved revision, September 17, 2026: Costa Rica implementation reduced 20%
// from workbook prices [750, 1250, 2000] to [600, 1000, 1600]. Other rates unchanged.
// Onboarding includes initial training. USA onboarding is not yet priced.
export type Market = 'cr' | 'us' | 'ca';
export type Plan = 'essential' | 'professional' | 'enterprise';
export const plans: Plan[] = ['essential', 'professional', 'enterprise'];
export const planNames: Record<Plan, string> = { essential: 'Essential', professional: 'Professional', enterprise: 'Enterprise' };
export const includedUsers: Record<Plan, number> = { essential: 20, professional: 40, enterprise: 60 };
export const rates = {
  cr: { base: [399, 699, 1200], implementation: [600, 1000, 1600], user: 5 },
  us: { base: [499, 899, 2500], implementation: [null, null, null], user: 8 },
  ca: { base: [359.1, 629.1, 1080], implementation: [675, 1125, 1800], user: 4.5 },
} as const;

export const groups = [
  { id: 'daily', icon: 'sun', included: 0, cr: 0, us: 0,
    es: { name: 'Operación diaria', description: 'Cada tarea, equipo y turno en el mismo lugar.', modules: ['Limpieza', 'Analítica', 'Comunicados', 'Difusiones', 'Motivación', 'Mesa de trabajo'] },
    en: { name: 'Daily operations', description: 'Every task, team and shift in one place.', modules: ['Housekeeping', 'Analytics', 'Announcements', 'Broadcasts', 'Motivation', 'Workbench'] } },
  { id: 'maintenance', icon: 'tool', included: 1, cr: 199, us: 299,
    es: { name: 'Control y mantenimiento', description: 'Anticípate a las averías y mide el avance.', modules: ['Activos', 'Planes de trabajo', 'Códigos QR', 'Tarjetas KPI', 'Metas'] },
    en: { name: 'Control & maintenance', description: 'Get ahead of breakdowns and measure progress.', modules: ['Assets', 'Work plans', 'QR codes', 'KPI cards', 'Goals'] } },
  { id: 'compliance', icon: 'shield', included: 1, cr: 149, us: 229,
    es: { name: 'Cumplimiento', description: 'Estándares claros y conocimiento compartido.', modules: ['Normas y documentos', 'Capacitación', 'Documentos profesionales'] },
    en: { name: 'Compliance', description: 'Clear standards and shared knowledge.', modules: ['Standards & documents', 'Training', 'Professional documents'] } },
  { id: 'people', icon: 'people', included: 2, cr: 149, us: 229,
    es: { name: 'Personal', description: 'Organiza el tiempo y reconoce a tu equipo.', modules: ['Horarios', 'Jornadas y ausencias', 'Marcación de asistencia', 'Gamificación'] },
    en: { name: 'People', description: 'Manage time and recognize your team.', modules: ['Schedules', 'Shifts & leave', 'Time tracking', 'Gamification'] } },
  { id: 'supply', icon: 'box', included: 2, cr: 199, us: 299,
    es: { name: 'Abastecimiento', description: 'Lo que necesitas, disponible y bajo control.', modules: ['Compras', 'Inventario', 'Herramientas', 'Costos'] },
    en: { name: 'Procurement', description: 'Keep what you need available and accounted for.', modules: ['Purchasing', 'Inventory', 'Tools', 'Costs'] } },
  { id: 'mobility', icon: 'pin', included: 2, cr: 59, us: 99,
    es: { name: 'Movilidad', description: 'Conecta el trabajo con el lugar donde sucede.', modules: ['Mapas y ubicación', 'NFC'] },
    en: { name: 'Mobility', description: 'Connect work to the place where it happens.', modules: ['Maps & location', 'NFC'] } },
  { id: 'sales', icon: 'chart', included: 3, cr: 199, us: 299,
    es: { name: 'Gestión comercial', description: 'De la primera conversación a la relación comercial.', modules: ['CRM', 'Investigación de empresas', 'Llamadas'] },
    en: { name: 'Sales management', description: 'From the first conversation to a customer relationship.', modules: ['CRM', 'Company research', 'Calling'] } },
  { id: 'ai', icon: 'spark', included: 3, cr: 149, us: 249,
    es: { name: 'Asistente de operaciones con IA', description: 'Asistencia inteligente para tu operación.', modules: ['Asistente de operaciones con IA', 'Consumo de IA por separado'] },
    en: { name: 'AI Operations Manager', description: 'Intelligent assistance for your operations.', modules: ['AI Operations Manager', 'AI usage billed separately'] } },
] as const;
export type GroupId = typeof groups[number]['id'];
export function groupPrice(group: typeof groups[number], market: Market, plan: Plan) {
  if (plans.indexOf(plan) >= group.included) return 0;
  return market === 'us' ? group.us : Math.round(group.cr * (market === 'ca' ? 90 : 100)) / 100;
}
export function calculatePrice(market: Market, plan: Plan, users: number, selected: readonly GroupId[]) {
  if (!Number.isSafeInteger(users) || users < 1) throw new RangeError('Users must be a positive whole number');
  const rate = rates[market];
  const index = plans.indexOf(plan);
  const extraUsers = Math.max(0, users - includedUsers[plan]);
  const userTotal = Math.round(extraUsers * rate.user * 100) / 100;
  const addons = Math.round(groups.reduce((sum, group) => sum + (selected.includes(group.id) ? groupPrice(group, market, plan) : 0), 0) * 100) / 100;
  const monthly = Math.round((rate.base[index] + userTotal + addons) * 100) / 100;
  const implementation = rate.implementation[index];
  return { base: rate.base[index], extraUsers, userTotal, addons, monthly, implementation, firstMonth: implementation === null ? null : Math.round((monthly + implementation) * 100) / 100 };
}
