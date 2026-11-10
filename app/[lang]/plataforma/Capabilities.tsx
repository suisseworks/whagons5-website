import type { CSSProperties, ReactNode } from 'react';
import styles from './Capabilities.module.css';

/*
 * The platform's capabilities as a bento of cards, each with a small product
 * visual drawn in HTML, CSS and inline SVG (sample data). Everything named
 * here is in the product and already described on the site: capture by
 * voice, NFC, QR and public forms, the triage and daily digest agents,
 * approvals and SLAs, work plans, forms and evidence, KPI cards, the grid,
 * Kanban, calendar and map views, procedures and training, the API, and the
 * mobile app with offline support.
 */

type Lang = 'es' | 'en';
type CardKey = 'capture' | 'agents' | 'flows' | 'plans' | 'evidence' | 'kpis' | 'views' | 'docs' | 'api' | 'mobile';

const ORDER: CardKey[] = ['capture', 'agents', 'flows', 'plans', 'evidence', 'kpis', 'views', 'docs', 'api', 'mobile'];
const WIDE: CardKey[] = ['capture', 'views'];

const COPY = {
  es: {
    eyebrow: 'Capacidades conectadas',
    title: 'Configura cómo trabaja tu operación.',
    lead: 'Empieza con lo que necesitas hoy y suma capacidades cuando tu operación las pida. Todo queda en la misma tarea, con su responsable y su historial.',
    note: 'Las vistas usan datos de ejemplo.',
    cards: {
      capture: ['Captura desde donde estés', 'El trabajo entra por voz, NFC, QR, formularios públicos sin cuenta, el teléfono o la web, con su lugar y sus fotos.'],
      agents: ['Agentes de IA', 'Un agente de triaje sugiere categoría y responsable y avisa posibles duplicados. Otro resume cada día lo vencido y lo bloqueado. Los cambios esperan tu aprobación.'],
      flows: ['Flujos, aprobaciones y SLA', 'Responsables, pasos de aprobación, reglas, plazos y alertas para cada tipo de trabajo.'],
      plans: ['Planes de trabajo', 'Lo recurrente, por equipo, área y calendario. Cada tarea aparece a su hora y con su responsable.'],
      evidence: ['Formularios y evidencia', 'Checklists, fotos y firmas quedan en la tarea, listas para revisar o auditar.'],
      kpis: ['Tarjetas KPI y analítica', 'Cumplimiento, tiempos, creadas contra terminadas y actividad por día, arriba de cada espacio.'],
      views: ['Vistas: tabla, Kanban, calendario y mapa', 'La misma información en la vista que necesita cada equipo, con etiquetas, comentarios y adjuntos.'],
      docs: ['Procedimientos y capacitación', 'Documentos, procedimientos y capacitación al alcance del equipo, con registro de lectura.'],
      api: ['Integraciones y API', 'Conecta tu ERP, RR. HH. y otros sistemas por API e integraciones definidas con tu equipo.'],
      mobile: ['Móvil y sin conexión', 'En el teléfono y en la web. Lo guardado sigue disponible y los cambios compatibles se sincronizan al reconectar.'],
    } as Record<CardKey, [string, string]>,
    ui: {
      channels: ['Voz', 'NFC', 'QR', 'Formulario público', 'Teléfono y web'],
      voice: 'Reporte por voz', transcript: '“La bomba P-3 vibra más de lo normal.”', created: 'Tarea #4815 creada · Bomba P-3',
      triage: 'Agente de triaje', category: 'Categoría', categoryValue: 'Mecánica', owner: 'Responsable', duplicate: 'Posible duplicado', approve: 'Aprobar',
      digest: 'Resumen diario · 3 vencidas, 2 bloqueadas',
      chain: ['Solicita', 'Supervisión', 'Gerencia'], sla: 'SLA 4 h · vence en 1 h 12 min', rule: 'Si vence, alerta a supervisión',
      days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], every: 'Cada lunes 7:00 · 12 equipos',
      checklist: 'Checklist', items: ['Bloqueo aplicado', 'Presión verificada', 'Área limpia'], photo: 'Foto', signature: 'Firma',
      rate: 'Cumplimiento', createdVsDone: 'Creadas vs. terminadas', createdKey: 'Creadas', doneKey: 'Terminadas', activity: 'Actividad',
      views: ['Tabla', 'Kanban', 'Calendario', 'Mapa'],
      rows: [
        { title: 'Cambio de rodamientos', spot: 'Motor M-12', tags: [['Preventivo', '#4f46e5'], ['Línea 2', '#0891b2']], notes: 3, files: 2, status: 'En reparación', color: '#10b981', who: 'DR' },
        { title: 'Fuga de aceite', spot: 'Prensa P-4', tags: [['Crítico', '#dc2626']], notes: 1, files: 1, status: 'Asignada', color: '#2563eb', who: 'JT' },
        { title: 'Inspección de andamios', spot: 'Fachada este', tags: [['Seguridad', '#dc2626']], notes: 1, files: 4, status: 'Por revisar', color: '#d97706', who: 'RC' },
      ],
      doc: 'SOP-014 · Bloqueo y etiquetado (LOTO)', docMeta: 'PDF · v3 · Seguridad', readBy: 'Leído por', training: 'Capacitación · 2 pendientes',
      systems: ['ERP', 'RR. HH.', 'Tus sistemas'], hub: 'Trabajo coordinado',
      offline: 'Sin conexión', phoneTask: 'Revisión de unidad 08', phoneMeta: 'Patio · Checklist 2/3', pending: '3 cambios por sincronizar',
    },
  },
  en: {
    eyebrow: 'Connected capabilities',
    title: 'Configure how your operation works.',
    lead: 'Start with what you need today and add capabilities when your operation asks for them. Everything stays on the same task, with its owner and its history.',
    note: 'Visuals use sample data.',
    cards: {
      capture: ['Capture from anywhere', 'Work comes in by voice, NFC, QR, public forms without an account, the phone or the web, with its place and photos.'],
      agents: ['AI agents', 'A triage agent suggests the category and owner and flags possible duplicates. Another sums up what is overdue and blocked every day. Changes wait for your approval.'],
      flows: ['Workflows, approvals & SLAs', 'Owners, approval steps, rules, due times and alerts for each type of work.'],
      plans: ['Work plans', 'Recurring work by team, area and calendar. Each task appears on time, with its owner.'],
      evidence: ['Forms & evidence', 'Checklists, photos and signatures stay on the task, ready to review or audit.'],
      kpis: ['KPI cards & analytics', 'Completion, times, created versus finished and daily activity, at the top of every space.'],
      views: ['Views: grid, Kanban, calendar and map', 'The same work in the view each team needs, with tags, comments and attachments.'],
      docs: ['Procedures & training', 'Documents, procedures and training within the team’s reach, with read acknowledgments.'],
      api: ['Integrations & API', 'Connect your ERP, HR and other systems through an API and integrations defined with your team.'],
      mobile: ['Mobile & offline', 'On the phone and the web. Saved information stays available and supported changes sync when you reconnect.'],
    } as Record<CardKey, [string, string]>,
    ui: {
      channels: ['Voice', 'NFC', 'QR', 'Public form', 'Phone & web'],
      voice: 'Voice report', transcript: '“Pump P-3 is vibrating more than usual.”', created: 'Task #4815 created · Pump P-3',
      triage: 'Triage agent', category: 'Category', categoryValue: 'Mechanical', owner: 'Owner', duplicate: 'Possible duplicate', approve: 'Approve',
      digest: 'Daily digest · 3 overdue, 2 blocked',
      chain: ['Requested', 'Supervisor', 'Manager'], sla: '4 h SLA · due in 1 h 12 min', rule: 'If overdue, alert the supervisor',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], every: 'Every Monday 7:00 · 12 machines',
      checklist: 'Checklist', items: ['Lockout applied', 'Pressure checked', 'Area clean'], photo: 'Photo', signature: 'Signature',
      rate: 'Completion', createdVsDone: 'Created vs. finished', createdKey: 'Created', doneKey: 'Finished', activity: 'Activity',
      views: ['Grid', 'Kanban', 'Calendar', 'Map'],
      rows: [
        { title: 'Replace bearings', spot: 'Motor M-12', tags: [['Preventive', '#4f46e5'], ['Line 2', '#0891b2']], notes: 3, files: 2, status: 'In repair', color: '#10b981', who: 'DR' },
        { title: 'Oil leak', spot: 'Press P-4', tags: [['Critical', '#dc2626']], notes: 1, files: 1, status: 'Assigned', color: '#2563eb', who: 'JT' },
        { title: 'Scaffolding inspection', spot: 'East façade', tags: [['Safety', '#dc2626']], notes: 1, files: 4, status: 'To review', color: '#d97706', who: 'RC' },
      ],
      doc: 'SOP-014 · Lockout/tagout (LOTO)', docMeta: 'PDF · v3 · Safety', readBy: 'Read by', training: 'Training · 2 pending',
      systems: ['ERP', 'HR', 'Your systems'], hub: 'Coordinated work',
      offline: 'Offline', phoneTask: 'Truck 08 check', phoneMeta: 'Yard · Checklist 2/3', pending: '3 changes to sync',
    },
  },
};

type Ui = (typeof COPY)['es']['ui'];

const CHANNEL_STYLE: { icon: IconName; color: string }[] = [
  { icon: 'mic', color: '#ea580c' },
  { icon: 'nfc', color: '#0891b2' },
  { icon: 'qr', color: '#334155' },
  { icon: 'form', color: '#0d9488' },
  { icon: 'phone', color: '#2563eb' },
];
const AVATAR_COLORS: Record<string, string> = { DR: '#16a34a', JT: '#db2777', SV: '#7c3aed', GM: '#0891b2', RC: '#ea580c', AM: '#ca8a04' };
/* Tasks per day on the work-plan week, and the share of each day's activity in the heatmap (sample data). */
const WEEK = [3, 1, 2, 1, 2, 0, 1];
const HEAT = [2, 3, 1, 4, 3, 0, 1, 3, 4, 2, 4, 3, 1, 0, 2, 4, 3, 4, 2, 1, 1, 3, 2, 4, 4, 3, 0, 0, 4, 3, 2, 3, 4, 1, 0, 2, 3, 4, 4, 2, 1, 1];
const CREATED = [14, 18, 15, 21, 19, 24, 22];
const DONE = [11, 15, 16, 18, 20, 21, 23];

export default function Capabilities({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const visuals: Record<CardKey, ReactNode> = {
    capture: <Capture ui={t.ui} />,
    agents: <Agents ui={t.ui} />,
    flows: <Flows ui={t.ui} />,
    plans: <Plans ui={t.ui} />,
    evidence: <Evidence ui={t.ui} />,
    kpis: <Kpis ui={t.ui} />,
    views: <Views ui={t.ui} />,
    docs: <Docs ui={t.ui} />,
    api: <Api ui={t.ui} />,
    mobile: <Mobile ui={t.ui} />,
  };

  return <section className={styles.section} id="platform-capabilities" aria-labelledby="capabilities-title">
    <div className={styles.head} data-reveal="">
      <div>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 id="capabilities-title">{t.title}</h2>
      </div>
      <p className={styles.lead}>{t.lead}</p>
    </div>

    <ul className={styles.grid} data-reveal-kids="">
      {ORDER.map((key, i) => <li key={key} className={styles.card} data-card={key} data-wide={WIDE.includes(key) || undefined}>
        <div className={styles.visual} aria-hidden="true">{visuals[key]}</div>
        <div className={styles.text}>
          <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
          <h3>{t.cards[key][0]}</h3>
          <p>{t.cards[key][1]}</p>
        </div>
      </li>)}
    </ul>
    <p className={styles.note}>{t.note}</p>
  </section>;
}

function Capture({ ui }: { ui: Ui }) {
  return <div className={styles.capture}>
    <ul className={styles.channels}>
      {ui.channels.map((label, i) => <li key={label} style={{ '--c': CHANNEL_STYLE[i].color } as CSSProperties}><Icon name={CHANNEL_STYLE[i].icon} />{label}</li>)}
    </ul>
    <div className={styles.voiceCard}>
      <span className={styles.micTile}><Icon name="mic" /><span className={styles.wave}><i /><i /><i /><i /><i /><i /><i /></span></span>
      <div className={styles.voiceText}>
        <small>{ui.voice}</small>
        <p>{ui.transcript}</p>
        <span className={styles.ok}><Icon name="check" />{ui.created}</span>
      </div>
    </div>
  </div>;
}

function Agents({ ui }: { ui: Ui }) {
  return <div className={styles.agents}>
    <div className={styles.agentCard}>
      <div className={styles.agentHead}>
        <span className={styles.agentIcon}><Icon name="sparkles" /></span>
        <small>{ui.triage}</small>
        <em>#4815</em>
      </div>
      <dl className={styles.suggest}>
        <div><dt>{ui.category}</dt><dd>{ui.categoryValue}</dd></div>
        <div><dt>{ui.owner}</dt><dd><Avatar who="DR" />Diego R.</dd></div>
        <div><dt>{ui.duplicate}</dt><dd>#4809</dd></div>
      </dl>
      <span className={styles.approve}>{ui.approve}</span>
    </div>
    <span className={styles.digest}><Icon name="sparkles" />{ui.digest}</span>
  </div>;
}

function Flows({ ui }: { ui: Ui }) {
  const who = ['JT', 'SV', 'GM'];
  return <div className={styles.flows}>
    <ol className={styles.chain}>
      {ui.chain.map((label, i) => <li key={label} data-done={i < 2 || undefined}>
        <span className={styles.chainAvatar}><Avatar who={who[i]} />{i < 2 ? <i><Icon name="check" /></i> : null}</span>
        <small>{label}</small>
      </li>)}
    </ol>
    <div className={styles.slaRow}>
      <span className={styles.sla}><i />{ui.sla}</span>
      <span className={styles.rule}><Icon name="bell" />{ui.rule}</span>
    </div>
  </div>;
}

function Plans({ ui }: { ui: Ui }) {
  return <div className={styles.plans}>
    <div className={styles.week}>
      {ui.days.map((day, i) => <div key={day} className={styles.day} data-today={i === 2 || undefined}>
        <small>{day}</small>
        <b>{10 + i}</b>
        <span className={styles.slots}>{Array.from({ length: WEEK[i] }, (_, j) => <i key={j} data-plan={i === 0 || undefined} />)}</span>
      </div>)}
    </div>
    <span className={styles.repeat}><Icon name="repeat" />{ui.every}</span>
  </div>;
}

function Evidence({ ui }: { ui: Ui }) {
  return <div className={styles.evidence}>
    <div className={styles.checklist}>
      <div className={styles.checkHead}><small>{ui.checklist}</small><b>3/3</b></div>
      <ul>{ui.items.map(item => <li key={item}><i><Icon name="check" /></i>{item}</li>)}</ul>
    </div>
    <div className={styles.proofs}>
      <span className={styles.photo}><Icon name="camera" /><small>{ui.photo}</small></span>
      <span className={styles.signature}>
        <svg viewBox="0 0 120 40"><path d="M4 28c10-14 18-22 22-18s-8 20-2 20 14-24 20-22-6 18 0 18 10-12 16-14 4 10 10 10 12-8 18-12 8 6 14 4 8-6 14-8" /></svg>
        <small>{ui.signature}</small>
      </span>
    </div>
  </div>;
}

function Kpis({ ui }: { ui: Ui }) {
  const r = 22, c = 2 * Math.PI * r, rate = 87;
  const w = 140, h = 44, max = Math.max(...CREATED, ...DONE), min = Math.min(...CREATED, ...DONE) - 2;
  const line = (values: number[]) => `M${values.map((v, i) => `${(i * w / (values.length - 1)).toFixed(1)},${(h - 4 - ((v - min) / (max - min)) * (h - 8)).toFixed(1)}`).join(' L')}`;
  return <div className={styles.kpis}>
    <div className={styles.kpiTop}>
      <span className={styles.ringWrap}>
        <svg viewBox="0 0 56 56" className={styles.ring}>
          <circle cx="28" cy="28" r={r} />
          <circle cx="28" cy="28" r={r} className={styles.ringValue} style={{ strokeDasharray: c, strokeDashoffset: c * (1 - rate / 100), '--len': c } as CSSProperties} />
        </svg>
        <span><b>{rate}%</b><small>{ui.rate}</small></span>
      </span>
      <span className={styles.sparkWrap}>
        <small>{ui.createdVsDone}</small>
        <svg viewBox={`-2 0 ${w + 4} ${h}`} className={styles.spark}>
          <path d={line(CREATED)} pathLength={1} className={styles.sparkCreated} />
          <path d={line(DONE)} pathLength={1} className={styles.sparkDone} />
        </svg>
        <span className={styles.legend}><i data-key="created" />{ui.createdKey}<i data-key="done" />{ui.doneKey}</span>
      </span>
    </div>
    <div className={styles.heat}>
      <small>{ui.activity}</small>
      <span className={styles.heatGrid}>{HEAT.map((v, i) => <i key={i} data-level={v} />)}</span>
    </div>
  </div>;
}

function Views({ ui }: { ui: Ui }) {
  const icons: IconName[] = ['grid', 'kanban', 'calendar', 'map'];
  return <div className={styles.views}>
    <div className={styles.switcher}>{ui.views.map((v, i) => <span key={v} data-on={i === 0 || undefined}><Icon name={icons[i]} />{v}</span>)}</div>
    <div className={styles.table}>
      {ui.rows.map(row => <div key={row.title} className={styles.row} style={{ '--s': row.color } as CSSProperties}>
        <span className={styles.rowName}><b>{row.title}</b><em>{row.spot}</em></span>
        <span className={styles.rowTags}>{row.tags.map(([tag, color]) => <i key={tag} style={{ '--t': color } as CSSProperties}>{tag}</i>)}</span>
        <span className={styles.rowCount} data-kind="notes"><Icon name="note" />{row.notes}</span>
        <span className={styles.rowCount} data-kind="files"><Icon name="clip" />{row.files}</span>
        <span className={styles.rowStatus}>{row.status}</span>
        <Avatar who={row.who} />
      </div>)}
    </div>
  </div>;
}

function Docs({ ui }: { ui: Ui }) {
  return <div className={styles.docs}>
    <div className={styles.doc}>
      <div className={styles.docHead}>
        <span className={styles.docIcon}><Icon name="file" /></span>
        <span><b>{ui.doc}</b><small>{ui.docMeta}</small></span>
      </div>
      <div className={styles.read}><span>{ui.readBy}</span><b>18/20</b></div>
      <span className={styles.readBar}><i /></span>
      <span className={styles.readers}>{['DR', 'JT', 'SV', 'AM'].map(who => <Avatar key={who} who={who} />)}<em>+14</em></span>
    </div>
    <span className={styles.training}><Icon name="training" />{ui.training}</span>
  </div>;
}

function Api({ ui }: { ui: Ui }) {
  return <div className={styles.api}>
    <ul className={styles.systems}>{ui.systems.map(s => <li key={s}><Icon name="box" />{s}</li>)}</ul>
    <svg className={styles.wires} viewBox="0 0 70 124" preserveAspectRatio="none">
      <path d="M0 14 C35 14 35 62 70 62" />
      <path d="M0 62 L70 62" />
      <path d="M0 110 C35 110 35 62 70 62" />
    </svg>
    <div className={styles.hub}>
      <span className={styles.hubMark}><svg viewBox="0 0 24 24"><path d="M3 6l4.5 12L12 8l4.5 10L21 6" /></svg></span>
      <b>Whagons</b>
      <small>{ui.hub}</small>
      <em>API</em>
    </div>
  </div>;
}

function Mobile({ ui }: { ui: Ui }) {
  return <div className={styles.mobile}>
    <div className={styles.phone}>
      <span className={styles.phoneBar}><b>9:41</b><i /></span>
      <span className={styles.offline}><Icon name="wifiOff" />{ui.offline}</span>
      <span className={styles.phoneTask}><b>{ui.phoneTask}</b><small>{ui.phoneMeta}</small><span className={styles.phoneChecks}><i data-on="" /><i data-on="" /><i /></span></span>
      <span className={styles.sync}><Icon name="sync" />{ui.pending}</span>
    </div>
  </div>;
}

function Avatar({ who }: { who: string }) {
  return <b className={styles.avatar} style={{ background: AVATAR_COLORS[who] ?? '#64748b' }}>{who}</b>;
}

type IconName = 'mic' | 'nfc' | 'qr' | 'form' | 'phone' | 'check' | 'sparkles' | 'bell' | 'repeat' | 'camera' | 'grid' | 'kanban' | 'calendar' | 'map' | 'note' | 'clip' | 'file' | 'training' | 'box' | 'wifiOff' | 'sync';

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    mic: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" /></>,
    nfc: <><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" /><path d="M16.37 2a20.16 20.16 0 0 1 0 20" /></>,
    qr: <><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1" /></>,
    form: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" /></>,
    phone: <><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></>,
    check: <path d="M20 6 9 17l-5-5" />,
    sparkles: <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z" />,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
    repeat: <><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>,
    camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>,
    grid: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" /></>,
    kanban: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 7v7M12 7v4M16 7v9" /></>,
    calendar: <><path d="M8 2v4M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>,
    map: <><path d="M14.1 6.4 9.9 4.3a2 2 0 0 0-1.8 0L3.6 6.5A1 1 0 0 0 3 7.4v12.2a1 1 0 0 0 1.4.9l3.7-1.9a2 2 0 0 1 1.8 0l4.2 2.1a2 2 0 0 0 1.8 0l4.5-2.2a1 1 0 0 0 .6-.9V5.4a1 1 0 0 0-1.4-.9l-3.7 1.9a2 2 0 0 1-1.8 0" /><path d="M15 5.8v15M9 3.2v15" /></>,
    note: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    clip: <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />,
    file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M9 15l2 2 4-4" /></>,
    training: <><path d="M21.42 10.92a1 1 0 0 0-.02-1.84l-8.57-3.9a2 2 0 0 0-1.66 0l-8.57 3.9a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z" /><path d="M22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></>,
    box: <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
    wifiOff: <><path d="M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M5 12.86a10 10 0 0 1 5.17-2.69M19 12.86a10 10 0 0 0-2.01-1.52M2 8.82a15 15 0 0 1 4.18-2.65M22 8.82a15 15 0 0 0-11.29-3.76M2 2l20 20" /></>,
    sync: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>,
  };
  return <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
