'use client';

import { useState, type DragEvent } from 'react';
import type { Language } from '../../lib/locales';
import { calculatePrice, groups, groupPrice, includedUsers, planNames, plans, rates, type GroupId, type Market, type Plan } from '../../lib/pricing';
import styles from './PricingPage.module.css';

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    tool: <path d="m14 6 4 4 3-3a6 6 0 0 1-7 8l-6 6a3 3 0 0 1-4-4l6-6a6 6 0 0 1 8-7l-4 2Z" />,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2" /></>,
    box: <><path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M8 5l9 5" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    chart: <><path d="M4 3v17h17M8 15l4-5 4 2 5-7M16 5h5v5" /></>,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4" /></>,
  };
  return <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function PricingPage({ lang }: { lang: Language }) {
  const es = lang === 'es';
  const [market, setMarket] = useState<Market>(es ? 'cr' : 'us');
  const [plan, setPlan] = useState<Plan>('professional');
  const [usersInput, setUsersInput] = useState('40');
  const [selected, setSelected] = useState<GroupId[]>([]);
  const [copyStatus, setCopyStatus] = useState('');
  const [draggedGroup, setDraggedGroup] = useState<GroupId | null>(null);
  const [overPackage, setOverPackage] = useState(false);
  const [groupStatus, setGroupStatus] = useState('');
  const users = Number(usersInput);
  const validUsers = usersInput.trim() !== '' && Number.isSafeInteger(users) && users > 0;
  const total = validUsers ? calculatePrice(market, plan, users, selected) : null;
  const planIndex = plans.indexOf(plan);
  const rate = rates[market];
  const money = (value: number) => new Intl.NumberFormat(es ? 'es-CR' : 'en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value);
  const marketNames = { cr: 'Costa Rica', us: es ? 'Estados Unidos' : 'United States', ca: es ? 'Centroamérica' : 'Central America' };
  const included = es ? 'Incluido' : 'Included';
  const perMonth = es ? '/mes' : '/mo';
  const from = plan === 'enterprise' ? (es ? 'Desde ' : 'From ') : '';
  const quote = es ? 'Por cotizar' : 'Custom quote';
  const activeGroups = groups.filter(group => groupPrice(group, market, plan) === 0 || selected.includes(group.id));
  const extraGroups = activeGroups.filter(group => groupPrice(group, market, plan) > 0);
  const includedGroups = activeGroups.filter(group => groupPrice(group, market, plan) === 0);
  const extrasTotal = Math.round(extraGroups.reduce((sum, group) => sum + groupPrice(group, market, plan), 0) * 100) / 100;
  const descriptions = es
    ? ['Orden para el trabajo de cada día.', 'Más control. Menos imprevistos.', 'Toda tu operación, conectada.']
    : ['Bring order to everyday work.', 'More control. Fewer surprises.', 'Your entire operation, connected.'];
  const features = es ? [
    ['20 usuarios incluidos', 'Operación diaria', 'Reportes básicos', 'Soporte estándar'],
    ['40 usuarios incluidos', 'Todo Essential + mantenimiento', 'Cumplimiento y capacitación', 'KPI y revisión inicial de adopción'],
    ['60 usuarios incluidos', 'Todo Professional + personal', 'Abastecimiento y movilidad', 'Reportes consolidados y soporte prioritario'],
  ] : [
    ['20 users included', 'Daily operations', 'Basic reporting', 'Standard support'],
    ['40 users included', 'Everything in Essential + maintenance', 'Compliance and training', 'KPIs and initial adoption review'],
    ['60 users included', 'Everything in Professional + people', 'Procurement and mobility', 'Consolidated reporting and priority support'],
  ];
  function update() { setCopyStatus(''); }
  function toggle(id: GroupId) {
    const group = groups.find(item => item.id === id);
    if (!group || groupPrice(group, market, plan) === 0) return;
    update();
    setGroupStatus(`${group[lang].name}: ${selected.includes(id) ? (es ? 'quitado de tu paquete.' : 'removed from your package.') : (es ? 'agregado a tu paquete.' : 'added to your package.')}`);
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }
  function startDrag(event: DragEvent<HTMLElement>, id: GroupId) {
    const group = groups.find(item => item.id === id);
    if (!group || selected.includes(id) || groupPrice(group, market, plan) === 0) { event.preventDefault(); return; }
    event.dataTransfer.setData('application/x-whagons-powerup', id);
    event.dataTransfer.effectAllowed = 'copy';
    setDraggedGroup(id);
  }
  function endDrag() { setDraggedGroup(null); setOverPackage(false); }
  function dropGroup(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const id = event.dataTransfer.getData('application/x-whagons-powerup');
    const group = groups.find(item => item.id === id);
    if (group && group.id === draggedGroup && groupPrice(group, market, plan) > 0) {
      update();
      setSelected(current => current.includes(group.id) ? current : [...current, group.id]);
      setGroupStatus(`${group[lang].name}: ${es ? 'agregado a tu paquete.' : 'added to your package.'}`);
    }
    endDrag();
  }
  async function copyConfiguration() {
    if (!total) return;
    const lines = [
      `Whagons · ${planNames[plan]} · ${marketNames[market]}`,
      `${es ? 'Usuarios' : 'Users'}: ${users}`,
      `${es ? 'Plan base' : 'Base plan'}: ${money(total.base)} ${perMonth}`,
      `${es ? 'Usuarios adicionales' : 'Additional users'}: ${total.extraUsers} × ${money(rate.user)} = ${money(total.userTotal)} ${perMonth}`,
      ...activeGroups.map(group => `${group[lang].name}: ${groupPrice(group, market, plan) === 0 ? included : `${money(groupPrice(group, market, plan))} ${perMonth}`}`),
      `${es ? 'Total mensual' : 'Monthly total'}: ${from}${money(total.monthly)} USD`,
      `${es ? 'Implementación y capacitación inicial, pago único' : 'Implementation and initial training, one-time fee'}: ${total.implementation === null ? quote : `${from}${money(total.implementation)} USD`}`,
      `${es ? 'Primer mes + implementación' : 'First month + implementation'}: ${total.firstMonth === null ? quote : `${from}${money(total.firstMonth)} USD`}`,
      es ? 'Estimación para clientes nuevos. Impuestos, integraciones y consumo variable no incluidos. Enterprise sujeto a alcance.' : 'Estimate for new customers. Taxes, integrations and variable usage excluded. Enterprise subject to scope.',
    ];
    try { await navigator.clipboard.writeText(lines.join('\n')); setCopyStatus(es ? 'Configuración copiada.' : 'Configuration copied.'); }
    catch { setCopyStatus(es ? 'No se pudo copiar. Puedes seleccionar y copiar el resumen.' : 'Could not copy. You can select and copy the summary.'); }
  }

  return <main className={styles.page}>
    <header className={styles.hero}>
      <div className={styles.eyebrow}><span />{es ? 'PLANES E INVERSIÓN' : 'PLANS & PRICING'}</div>
      <h1>{es ? 'Tu operación.' : 'Your operation.'}<br /><span>{es ? 'Tu plan.' : 'Your plan.'}</span></h1>
      <p>{es ? 'Empieza con lo que necesitas. Suma posibilidades a medida que creces.' : 'Start with what you need. Add possibilities as you grow.'}</p>
      <div className={styles.heroBottom}><span>{es ? '01 Elige tu plan' : '01 Choose your plan'}</span><i /><span>{es ? '02 Personalízalo' : '02 Make it yours'}</span><i /><span>{es ? '03 Conoce tu inversión' : '03 See your investment'}</span></div>
      <div className={styles.orbit} aria-hidden="true"><div /><div /><div /><span>W<span>+</span></span></div>
    </header>

    <div className={styles.content}>
      <div className={styles.marketBar}>
        <div><span className={styles.kicker}>{es ? 'HECHO PARA TU EQUIPO' : 'BUILT FOR YOUR TEAM'}</span><h2>{es ? 'Un buen comienzo para cada operación.' : 'A good start for every operation.'}</h2></div>
        <label className={styles.marketLabel}>{es ? 'Mercado · precios en USD' : 'Market · prices in USD'}<select value={market} onChange={event => { setMarket(event.target.value as Market); update(); }} aria-label={es ? 'Mercado' : 'Market'}>{Object.entries(marketNames).map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label>
      </div>
      {market === 'ca' && <p className={styles.marketNote}>{es ? 'Centroamérica, excepto Costa Rica. Tarifas regionales en dólares estadounidenses.' : 'Central America, excluding Costa Rica. Regional rates in US dollars.'}</p>}

      <fieldset className={styles.plans}><legend className="sr-only">{es ? 'Elige tu plan' : 'Choose your plan'}</legend>
        {plans.map((id, index) => <label key={id} className={`${styles.plan} ${plan === id ? styles.planSelected : ''}`}>
          <input type="radio" name="plan" value={id} checked={plan === id} onChange={() => { setPlan(id); update(); }} />
          <div className={styles.planTop}><span className={styles.planName}>{planNames[id]}</span><span className={styles.radio} aria-hidden="true" /></div>
          <p className={styles.planDesc}>{descriptions[index]}</p>
          <div className={styles.planPrice}>{index === 2 && <small>{es ? 'Desde' : 'From'}</small>}<strong>{money(rate.base[index])}</strong><span>{perMonth}</span></div>
          <ul>{features[index].map(feature => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
          <div className={styles.choose}>{plan === id ? (es ? 'Plan seleccionado' : 'Selected plan') : (es ? 'Elegir plan' : 'Choose plan')}<span aria-hidden="true">{plan === id ? '✓' : '↗'}</span></div>
        </label>)}
      </fieldset>
      <div className={styles.foundation}><span className={styles.foundationCheck} aria-hidden="true">✓</span><p>{es ? 'Siempre incluidos' : 'Always included'}<span>{es ? 'Tareas, responsables, evidencias, checklists y seguimiento de averías.' : 'Tasks, owners, evidence, checklists and issue tracking.'}</span></p><span className={styles.foundationTag}>{es ? 'La base de Whagons' : 'The Whagons foundation'}</span></div>

      <div className={styles.builder}>
        <div className={styles.options}>
          <section className={styles.usersSection} aria-labelledby="team-title">
            <div className={styles.sectionHeading}><span className={styles.step}>01</span><div><h2 id="team-title">{es ? 'Dale espacio a tu equipo.' : 'Make room for your team.'}</h2><p>{es ? 'Cada persona cuenta una sola vez.' : 'Each person is counted just once.'}</p></div></div>
            <div className={styles.userControls}><label htmlFor="user-count">{es ? 'Usuarios totales' : 'Total users'}<small>{includedUsers[plan]} {es ? 'incluidos en tu plan' : 'included in your plan'}</small></label><div className={styles.stepper}><button type="button" aria-label={es ? 'Quitar un usuario' : 'Remove one user'} disabled={!validUsers || users <= 1} onClick={() => { setUsersInput(String(users - 1)); update(); }}>−</button><input id="user-count" type="number" min="1" step="1" value={usersInput} aria-invalid={!validUsers} aria-describedby="user-help" onChange={event => { setUsersInput(event.target.value); update(); }} /><button type="button" aria-label={es ? 'Agregar un usuario' : 'Add one user'} disabled={!validUsers || users >= Number.MAX_SAFE_INTEGER} onClick={() => { setUsersInput(String(users + 1)); update(); }}>+</button></div></div>
            <input className={styles.slider} type="range" min="1" max="200" step="1" value={validUsers ? Math.min(users, 200) : 1} aria-label={es ? 'Ajustar cantidad de usuarios' : 'Adjust user count'} onChange={event => { setUsersInput(event.target.value); update(); }} />
            <div className={styles.rangeLabels}><span>1 {es ? 'usuario' : 'user'}</span><span>200 {es ? 'usuarios' : 'users'}</span></div>
            <p id="user-help" className={!validUsers ? styles.error : styles.helper}>{!validUsers ? (es ? 'Ingresa un número entero de usuarios mayor que cero.' : 'Enter a positive whole number of users.') : `${money(rate.user)} ${es ? 'por usuario adicional al mes. Para más de 200, escribe la cantidad.' : 'per additional user per month. For more than 200, enter the number.'}`}</p>
          </section>

          <section className={styles.powerups} aria-labelledby="powerups-title">
            <div className={styles.sectionHeading}><span className={styles.step}>02</span><div><h2 id="powerups-title">{es ? 'Más posibilidades. A tu medida.' : 'More possibilities. Your way.'}</h2><p>{es ? 'Agrega grupos de powerups. Lo incluido en tu plan no se cobra de nuevo.' : 'Add powerup groups. Features included in your plan are never charged twice.'}</p></div></div>
            <div className={styles.catalogIntro}><span>{es ? 'ELIGE TUS POWERUPS' : 'CHOOSE YOUR POWERUPS'}</span><p><span className={styles.dragInstruction}>{es ? 'Arrastra una tarjeta a Tu paquete o usa el botón Agregar.' : 'Drag a card into Your package or use the Add button.'}</span><span className={styles.touchInstruction}>{es ? 'Toca Agregar para sumar un grupo a tu paquete.' : 'Tap Add to put a group in your package.'}</span></p></div>
            <div className={styles.groupGrid}>{groups.map(group => {
              const price = groupPrice(group, market, plan);
              const isIncluded = price === 0;
              const checked = isIncluded || selected.includes(group.id);
              return <article key={group.id} data-group={group.id} data-dragging={draggedGroup === group.id} draggable={!checked} onDragStart={event => startDrag(event, group.id)} onDragEnd={endDrag} className={`${styles.group} ${checked ? styles.groupSelected : ''} ${isIncluded ? styles.groupIncluded : ''}`}>
                <div className={styles.groupTop}><span className={styles.groupIcon}><Icon name={group.icon} /></span>{checked ? <span className={styles.cardStatus}>{isIncluded ? included : (es ? 'En tu paquete' : 'In your package')}</span> : <span className={styles.dragHandle} aria-hidden="true">⠿</span>}</div>
                <h3>{group[lang].name}</h3><p>{group[lang].description}</p>
                <ul>{group[lang].modules.map(module => <li key={module}>{module}</li>)}</ul>
                <div className={styles.groupBottom}><span>{isIncluded ? <strong>{es ? 'Sin costo extra' : 'No extra charge'}</strong> : <><strong>+{money(price)}</strong> {perMonth}</>}</span></div>
                <button type="button" className={styles.groupAction} disabled={isIncluded} aria-pressed={checked} aria-label={`${isIncluded ? included : checked ? (es ? 'Quitar' : 'Remove') : (es ? 'Agregar' : 'Add')} ${group[lang].name}`} onClick={() => toggle(group.id)}><span>{isIncluded ? (es ? 'Incluido en tu plan' : 'Included in your plan') : checked ? (es ? 'Quitar del paquete' : 'Remove from package') : (es ? 'Agregar al paquete' : 'Add to package')}</span><span aria-hidden="true">{isIncluded ? '✓' : checked ? '−' : '+'}</span></button>
              </article>;
            })}</div>
            <span className="sr-only" role="status" aria-live="polite">{groupStatus}</span>
            <div className={styles.custom}><Icon name="spark" /><div><h3>Microsoft 365 Automations</h3><p>{es ? 'Automatizaciones e integraciones adaptadas a tu operación.' : 'Automations and integrations tailored to your operations.'}</p></div><span>{es ? 'Por proyecto' : 'Per project'}</span></div>
          </section>

          <section className={styles.onboarding} aria-labelledby="onboarding-title">
            <div className={styles.sectionHeading}><span className={styles.step}>03</span><div><h2 id="onboarding-title">{es ? 'Empecemos bien.' : 'Start on the right foot.'}</h2><p>{es ? 'Implementación y capacitación inicial, en un solo pago.' : 'Implementation and initial training, in one payment.'}</p></div></div>
            <div className={styles.onboardingCard}><div className={styles.onboardingIntro}><span className={styles.kicker}>{es ? 'PUESTA EN MARCHA' : 'GETTING STARTED'}</span><strong>{rate.implementation[planIndex] === null ? quote : `${from}${money(rate.implementation[planIndex]!)}`}</strong><span>{es ? 'Pago único' : 'One-time fee'}</span></div><div className={styles.onboardingDetails}><div><span aria-hidden="true">01</span><p><strong>{es ? 'Implementación' : 'Implementation'}</strong>{es ? 'Configuración inicial de la plataforma.' : 'Initial platform configuration.'}</p></div><div><span aria-hidden="true">02</span><p><strong>{es ? 'Capacitación inicial' : 'Initial training'}</strong>{es ? 'Incluida en la puesta en marcha, sin cargo adicional.' : 'Included in onboarding, at no additional charge.'}</p></div></div></div>
            <p className={styles.helper}>{es ? 'Sesiones adicionales, integraciones con PMS y otros sistemas se cotizan según alcance. El powerup Capacitación es un módulo del software, distinto de la formación inicial del equipo.' : 'Additional sessions, PMS and other integrations are quoted according to scope. The Training powerup is a software module, separate from your team’s initial onboarding.'}</p>
          </section>
        </div>

        <aside id="plan-summary" className={styles.summaryWrap} data-drag-active={draggedGroup !== null} data-drag-over={overPackage} onDragOver={event => { if (draggedGroup) { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; setOverPackage(true); } }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOverPackage(false); }} onDrop={dropGroup} aria-label={es ? 'Resumen de tu inversión' : 'Your investment summary'}>
          <div className={styles.summary}>
            <div className={styles.summaryHeader}><span className={styles.kicker}>{es ? 'TU CONFIGURACIÓN' : 'YOUR CONFIGURATION'}</span><span className={styles.live}><i />{es ? 'En vivo' : 'Live'}</span></div>
            <h2>{es ? 'Así se ve tu plan.' : 'Here’s your plan.'}</h2>
            <section className={styles.packageZone} data-filled={extraGroups.length > 0} aria-labelledby="package-title">
              <div className={styles.packageHeading}><div><span>{es ? 'PERSONALÍZALO' : 'MAKE IT YOURS'}</span><h3 id="package-title">{es ? 'Tu paquete' : 'Your package'}</h3></div><span className={styles.packageCount}>{extraGroups.length}<small>extras</small></span></div>
              <div className={styles.dropPrompt}><span aria-hidden="true">{overPackage ? '↓' : '+'}</span><p className={styles.dragInstruction}>{overPackage ? (es ? 'Suelta para agregar' : 'Drop to add') : (es ? 'Arrastra tus powerups aquí' : 'Drop your powerups here')}</p><p className={styles.touchInstruction}>{es ? 'Tus powerups, juntos aquí' : 'Your powerups, together here'}</p><small>{es ? 'También puedes usar Agregar en cada tarjeta.' : 'You can also use Add on each card.'}</small></div>
              {extraGroups.length > 0 && <ul className={styles.packageItems}>{extraGroups.map(group => <li key={group.id}><span className={styles.packageIcon}><Icon name={group.icon} /></span><div><strong>{group[lang].name}</strong><small>+{money(groupPrice(group, market, plan))} {perMonth}</small></div><button type="button" onClick={() => toggle(group.id)} aria-label={`${es ? 'Quitar' : 'Remove'} ${group[lang].name} ${es ? 'de tu paquete' : 'from your package'}`}>×</button></li>)}</ul>}
              <div className={styles.packageSubtotal}><span>{es ? 'Powerups adicionales' : 'Additional powerups'}</span><strong>+{money(extrasTotal)}<small>{perMonth}</small></strong></div>
              <details className={styles.packageIncluded}><summary>{includedGroups.length} {es ? 'grupos ya incluidos en' : 'groups already included in'} {planNames[plan]}</summary><ul>{includedGroups.map(group => <li key={group.id}><span aria-hidden="true">✓</span>{group[lang].name}</li>)}</ul></details>
            </section>
            <div className={styles.total} aria-live="polite" aria-atomic="true"><span>{es ? 'Total mensual' : 'Monthly total'}</span><div><small>{from}</small><strong data-testid="monthly-total">{total ? money(total.monthly) : '—'}</strong><span> USD{perMonth}</span></div></div>
            <div className={styles.summaryPlan}><span>{planNames[plan]}</span><small>{marketNames[market]} · USD</small></div>
            <dl className={styles.breakdown}><div><dt>{es ? 'Plan base' : 'Base plan'}<small>{includedUsers[plan]} {es ? 'usuarios incluidos' : 'users included'}</small></dt><dd>{money(rate.base[planIndex])}</dd></div><div><dt>{es ? 'Usuarios adicionales' : 'Additional users'}<small>{total ? `${total.extraUsers} × ${money(rate.user)}` : '—'}</small></dt><dd>{total ? money(total.userTotal) : '—'}</dd></div>
              {activeGroups.map(group => <div className={styles.addonLine} key={group.id}><dt>{group[lang].name}</dt><dd>{groupPrice(group, market, plan) === 0 ? <span className={styles.free}>{included}</span> : money(groupPrice(group, market, plan))}</dd></div>)}
            </dl>

            <dl className={styles.setupBreakdown}><div><dt>{es ? 'Implementación' : 'Implementation'}<small>{es ? 'Pago único' : 'One-time fee'}</small></dt><dd>{rate.implementation[planIndex] === null ? quote : `${from}${money(rate.implementation[planIndex]!)}`}</dd></div><div><dt>{es ? 'Capacitación inicial' : 'Initial training'}</dt><dd>{es ? 'Incluida' : 'Included'}</dd></div><div className={styles.firstMonth}><dt>{es ? 'Primer mes + puesta en marcha' : 'First month + onboarding'}</dt><dd data-testid="first-month-total">{!total ? '—' : total.firstMonth === null ? quote : `${from}${money(total.firstMonth)}`}</dd></div></dl>
            {market === 'us' && <p className={styles.quoteNote}>{es ? 'La mensualidad está calculada. El total inicial queda pendiente de cotizar la implementación.' : 'Your monthly cost is calculated. Your starting total is pending an implementation quote.'}</p>}
            <button className={styles.copyButton} type="button" onClick={copyConfiguration} disabled={!total}>{es ? 'Copiar mi configuración' : 'Copy my configuration'}<span aria-hidden="true">↗</span></button>
            <span role="status" className={styles.copyStatus}>{copyStatus}</span>
            <a className={styles.talk} href={`/${lang}/demo`}>{es ? 'Conversemos sobre tu plan' : 'Let’s talk about your plan'} <span aria-hidden="true">→</span></a>
            <p className={styles.summaryNote}>{es ? 'Estimación para clientes nuevos, antes de impuestos. Enterprise: importes desde, sujetos a alcance.' : 'Estimate for new customers, before taxes. Enterprise rates start at the amounts shown and depend on scope.'}</p>
          </div>
          <p className={styles.belowSummary}>{es ? 'Tu plan crece contigo. Prueba distintas combinaciones y encuentra la que encaje con tu operación.' : 'Your plan grows with you. Try different combinations and find the fit for your operation.'}</p>
        </aside>
      </div>

      <section className={styles.faq} aria-labelledby="details-title"><div><span className={styles.kicker}>{es ? 'ANTES DE EMPEZAR' : 'BEFORE YOU BEGIN'}</span><h2 id="details-title">{es ? 'Las cuentas, claras.' : 'A clear view of the costs.'}</h2></div><div>
        {(es ? [
          ['¿Cómo se cuentan los usuarios?', 'Se cuenta cada cuenta habilitada, incluidos los administradores. Una persona se cuenta una sola vez aunque use varios powerups. Los formularios públicos sin inicio de sesión no generan una licencia.'],
          ['¿Qué se paga una sola vez?', 'La implementación incluye la configuración y la capacitación inicial. Se suma a la primera mensualidad. La formación adicional se cotiza por separado; en Estados Unidos la puesta en marcha completa se cotiza según alcance.'],
          ['¿Qué no incluye esta estimación?', 'Impuestos, integraciones y consumo variable de telefonía, investigación e IA. Microsoft 365 Automations se cotiza por proyecto. Las propiedades, disponibilidad y condiciones del servicio se definen en el contrato.'],
          ['¿Estos precios aplican a clientes actuales?', 'Estos son precios propuestos para clientes nuevos. Los clientes actuales conservan su tarifa Legacy individual. Enterprise se cotiza desde los valores mostrados, según el alcance contratado.'],
        ] : [
          ['How are users counted?', 'Each enabled account counts, including administrators. A person is counted just once even when using multiple powerups. Public forms that do not require a login do not generate a user license.'],
          ['What is paid only once?', 'Implementation includes configuration and initial training. It is added to your first monthly payment. Extra training is quoted separately; US onboarding is quoted according to scope.'],
          ['What is excluded from this estimate?', 'Taxes, integrations and variable usage for calling, research and AI. Microsoft 365 Automations is quoted per project. Properties, availability and service terms are defined in your contract.'],
          ['Do these rates apply to existing customers?', 'These are proposed rates for new customers. Existing customers retain their individual Legacy rate. Enterprise starts at the amounts shown and is quoted according to scope.'],
        ]).map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
      </div></section>
    </div>
    <div className={styles.mobileTotal}><div><span>{es ? 'Total mensual · USD' : 'Monthly total · USD'}</span><strong>{from}{total ? money(total.monthly) : '—'}<small>{perMonth}</small></strong></div><a href="#plan-summary">{es ? 'Ver desglose' : 'View breakdown'} <span aria-hidden="true">↑</span></a></div>
  </main>;
}
