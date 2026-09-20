'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Language } from '../../lib/locales';
import { groups, groupPrice, includedUsers, planNames, plans, rates, type GroupId } from '../../lib/pricing';
import { calculateOffer, defaultOffer, isOfferDraft, type OfferDraft, type GroupMode } from '../../lib/parador-offer';
import styles from './ParadorOffer.module.css';

const STORAGE_KEY = 'whagons.parador.offer.v1';
type Channel = 'voice' | 'qr' | 'nfc';

function ChannelIcon({ channel }: { channel: Channel }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {channel === 'voice' ? <><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></> : channel === 'qr' ? <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><path d="M15 15h3v3h3v3h-6v-3m6-6v3M3 12h4m5-9v5m0 4h4M12 19v2" /></> : <><path d="M6 7a8 8 0 0 1 0 10M10 4a12 12 0 0 1 0 16M15 2a15 15 0 0 1 0 20" /><circle cx="4" cy="12" r="1" /></>}
  </svg>;
}

export default function ParadorOffer({ lang }: { lang: Language }) {
  const es = lang === 'es';
  const [draft, setDraft] = useState<OfferDraft>(defaultOffer);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [dirty, setDirty] = useState(false);
  const [channel, setChannel] = useState<Channel>('voice');
  const [demoComplete, setDemoComplete] = useState(false);
  const valid = isOfferDraft(draft);
  const offer = valid ? calculateOffer(draft) : null;
  const money = (value: number) => new Intl.NumberFormat(es ? 'es-CR' : 'en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value);
  const t = (spanish: string, english: string) => es ? spanish : english;
  const monthlyLabel = t('/mes', '/mo');
  const from = draft.plan === 'enterprise' ? t('Desde ', 'From ') : '';
  const hasMonthlyBenefits = offer !== null && offer.monthlySavings > 0;
  const duration = Number(draft.promoMonths) === 0
    ? t('Mientras se mantenga este alcance', 'While this scope remains unchanged')
    : Number(draft.promoMonths) === 1
      ? t('Primer mes desde la activación', 'First month from activation')
      : t(`Primeros ${draft.promoMonths} meses desde la activación`, `First ${draft.promoMonths} months from activation`);
  const expiry = draft.validUntil && /^\d{4}-\d{2}-\d{2}$/.test(draft.validUntil) && Number.isFinite(Date.parse(draft.validUntil)) ? new Intl.DateTimeFormat(es ? 'es-CR' : 'en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(draft.validUntil)) : t('Por definir', 'To be agreed');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed: unknown = JSON.parse(saved);
      if (isOfferDraft(parsed)) { setDraft(parsed); setStatus(es ? 'Borrador guardado recuperado de este navegador.' : 'Saved draft restored from this browser.'); }
      else setStatus(es ? 'El borrador guardado no es válido. Se muestran las condiciones iniciales.' : 'The saved draft is invalid. Initial terms are shown.');
    } catch { setStatus(es ? 'No se pudo recuperar el borrador local.' : 'The local draft could not be restored.'); }
  }, [es]);

  function update<K extends keyof OfferDraft>(key: K, value: OfferDraft[K]) {
    setDraft(current => ({ ...current, [key]: value })); setDirty(true); setStatus('');
  }
  function setGroup(id: GroupId, mode: GroupMode) { update('groupModes', { ...draft.groupModes, [id]: mode }); }
  function save() {
    if (!valid) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); setDirty(false); setStatus(t('Borrador guardado en este navegador.', 'Draft saved in this browser.')); }
    catch { setStatus(t('No se pudo guardar. Copia la propuesta para conservarla.', 'Could not save. Copy the proposal to keep it.')); }
  }
  async function copy() {
    if (!offer) return;
    const text = [
      t('Propuesta Whagons para Hotel Parador', 'Whagons proposal for Hotel Parador'),
      'Manuel Antonio, Costa Rica · USD',
      `${planNames[draft.plan]} · ${draft.users} ${t('usuarios', 'users')}`,
      `${t('Precio regular mensual', 'Regular monthly price')}: ${from}${money(offer.regular.monthly)}`,
      ...offer.active.map(group => {
        const price = groupPrice(group, 'cr', draft.plan);
        const terms = price === 0 ? t('incluido en el plan', 'included in plan') : draft.groupModes[group.id] === 'gift' ? `${t('de cortesía', 'complimentary')} (${money(price)}${monthlyLabel})` : `${money(price)}${monthlyLabel}`;
        return `${group[lang].name}: ${terms}`;
      }),
      `${t('Usuarios adicionales bonificados', 'Complimentary additional users')}: ${offer.effectiveBonusUsers}`,
      `${t('Descuento mensual aplicado', 'Applied monthly discount')}: ${money(offer.discount)}`,
      `${t('Mensualidad de la propuesta', 'Proposed monthly price')}: ${from}${money(offer.monthly)}`,
      ...(hasMonthlyBenefits ? [`${t('Duración de beneficios mensuales', 'Monthly benefit duration')}: ${duration}`] : []),
      ...(hasMonthlyBenefits && offer.promoMonths > 0 ? [`${t('Desde el mes', 'From month')} ${offer.promoMonths + 1}: ${from}${money(offer.regular.monthly)}${monthlyLabel} ${t('con el mismo alcance', 'with the same scope')}`] : []),
      `${t('Implementación y capacitación inicial, pago único', 'Implementation and initial training, one-time fee')}: ${from}${money(offer.implementation)} (${t('regular', 'regular')} ${money(offer.implementationRegular)})`,
      `${t('Primer mes + implementación', 'First month + implementation')}: ${from}${money(offer.firstMonth)}`,
      `${t('Inversión en 12 meses, incluida implementación', '12-month investment including implementation')}: ${from}${money(offer.firstYear)}`,
      `${t('Ahorro en 12 meses', '12-month savings')}: ${money(offer.firstYearSavings)}`,
      `${t('Vigencia para aceptar', 'Acceptance deadline')}: ${expiry}`,
      draft.notes,
      t('Voz: alcance y consumo por confirmar. Etiquetas NFC, dispositivos, impuestos, integraciones y consumo variable no incluidos. Propuesta sujeta a confirmar alcance y condiciones; no constituye una aceptación.', 'Voice scope and usage to be confirmed. NFC tags, devices, taxes, integrations and variable usage excluded. Proposal subject to scope and terms confirmation; not an acceptance.'),
    ].filter(Boolean).join('\n');
    try { await navigator.clipboard.writeText(text); setStatus(t('Propuesta copiada con todos los importes y condiciones.', 'Proposal copied with all amounts and terms.')); }
    catch { setStatus(t('No se pudo copiar. Usa Imprimir / PDF para conservar la propuesta.', 'Could not copy. Use Print / PDF to keep the proposal.')); }
  }

  function financialSummary() {
    if (!offer) return <div className={styles.invalid} role="alert">{t('Revisa los campos de la oferta para calcular el total. Usa números válidos: usuarios enteros de 1 a 100.000, bonificados de 0 a 100.000, descuentos de 0 a 100% y duración de 0 a 120 meses.', 'Check the offer fields to calculate the total. Use valid numbers: 1–100,000 whole users, 0–100,000 complimentary users, 0–100% discounts and 0–120 months.')} {t('El descuento fijo admite hasta US$1.000.000 y se limita al subtotal.', 'A fixed discount accepts up to US$1,000,000 and is capped at the subtotal.')}</div>;
    return <>
      <div className={styles.summaryHeading}><span>{t('INVERSIÓN PARA PARADOR', 'PARADOR INVESTMENT')}</span><span>USD</span></div>
      <div className={styles.mainPrice}><span>{t('Mensualidad de la propuesta', 'Proposed monthly price')}</span><div><small>{from}</small><strong data-testid="offer-monthly">{money(offer.monthly)}</strong><span>{monthlyLabel}</span></div>{offer.monthlySavings > 0 && <p><s>{money(offer.regular.monthly)}</s> <b>{t('Ahorras', 'You save')} {money(offer.monthlySavings)}{monthlyLabel}</b></p>}</div>
      <dl className={styles.breakdown}>
        <div><dt>{planNames[draft.plan]}<small>{includedUsers[draft.plan]} {t('usuarios incluidos', 'users included')}</small></dt><dd>{money(offer.regular.base)}</dd></div>
        <div><dt>{t('Usuarios adicionales', 'Additional users')}<small>{offer.regular.extraUsers} × $5</small></dt><dd>{money(offer.regular.userTotal)}</dd></div>
        <div><dt>{t('Powerups adicionales', 'Additional powerups')}</dt><dd>{money(offer.regular.addons)}</dd></div>
        {offer.giftSavings > 0 && <div className={styles.savingLine}><dt>{t('Powerups de cortesía', 'Complimentary powerups')}</dt><dd>−{money(offer.giftSavings)}</dd></div>}
        {offer.userSavings > 0 && <div className={styles.savingLine}><dt>{offer.effectiveBonusUsers} {t('usuarios bonificados', 'complimentary users')}</dt><dd>−{money(offer.userSavings)}</dd></div>}
        {offer.discount > 0 && <div className={styles.savingLine}><dt>{t('Descuento mensual', 'Monthly discount')}</dt><dd>−{money(offer.discount)}</dd></div>}
      </dl>
      {hasMonthlyBenefits && <div className={styles.term}><span>{t('Beneficios mensuales', 'Monthly benefits')}: {duration}</span>{offer.promoMonths > 0 && <strong>{t('Desde el mes', 'From month')} {offer.promoMonths + 1}: {from}{money(offer.regular.monthly)}{monthlyLabel}</strong>}</div>}
      <dl className={styles.breakdown}>
        <div><dt>{t('Implementación', 'Implementation')}<small>{t('Configuración + capacitación inicial', 'Configuration + initial training')}</small></dt><dd>{offer.implementationSavings > 0 && <s>{money(offer.implementationRegular)}</s>}{from}{money(offer.implementation)}</dd></div>
        <div className={styles.firstMonth}><dt>{t('Primer mes + puesta en marcha', 'First month + onboarding')}</dt><dd data-testid="offer-first-month">{from}{money(offer.firstMonth)}</dd></div>
      </dl>
      <p className={styles.small}>{t('Antes de impuestos. No incluye hardware, integraciones ni consumo variable. Enterprise sujeto al alcance contratado.', 'Before taxes. Excludes hardware, integrations and variable usage. Enterprise subject to contracted scope.')}</p>
    </>;
  }

  function comparison() {
    if (!offer) return null;
    const monthlyRatio = offer.regular.monthly > 0 ? offer.monthly / offer.regular.monthly * 100 : 0;
    return <section className={styles.comparison} aria-label={t('Comparación de inversión', 'Investment comparison')}>
      <span className={styles.eyebrow}>{t('EL VALOR DE TU OFERTA', 'THE VALUE OF YOUR OFFER')}</span><h3>{t('La diferencia, a la vista.', 'See the difference.')}</h3>
      <div className={styles.barLabel}><span>{t('Mensualidad regular', 'Regular monthly price')}</span><strong>{money(offer.regular.monthly)}</strong></div><div className={styles.barTrack} aria-hidden="true"><div style={{ width: '100%' }} /></div>
      <div className={styles.barLabel}><span>{t('Propuesta Parador', 'Parador proposal')}</span><strong>{money(offer.monthly)}</strong></div><div className={`${styles.barTrack} ${styles.offerBar}`} aria-hidden="true"><div style={{ width: `${monthlyRatio}%` }} /></div>
      <div className={styles.annual}><div><span>{t('Inversión en 12 meses', '12-month investment')}</span><strong data-testid="offer-year">{from}{money(offer.firstYear)}</strong><small>{t('Incluye implementación', 'Includes implementation')}</small></div><div><span>{t('Ahorro en 12 meses', '12-month savings')}</span><strong data-testid="offer-savings">{money(offer.firstYearSavings)}</strong><small>{t('Frente al mismo alcance sin beneficios', 'Versus the same scope without benefits')}</small></div></div>
      <p className={styles.small}>{t('El cálculo contempla el vencimiento de los beneficios temporales; no es una proyección de ahorros operativos.', 'The calculation accounts for temporary benefits expiring; it is not an estimate of operational savings.')}</p>
    </section>;
  }

  const scenarios = {
    voice: { title: t('Dilo. Regístralo. Dale seguimiento.', 'Say it. Record it. Follow through.'), description: t('Dictado para capturar una incidencia sin escribir todo el reporte. El equipo revisa la información antes de enviarla.', 'Dictate an issue without typing the whole report. The team reviews the information before sending it.'), input: t('“Hay una fuga en el baño de la habitación 204.”', '“There is a leak in the bathroom in room 204.”'), action: t('Ver reporte de ejemplo', 'See sample report'), badge: t('Alcance y consumo por confirmar', 'Scope and usage to be confirmed'), result: t('Fuga en baño · Habitación 204', 'Bathroom leak · Room 204'), outcome: t('Descripción lista para revisar y asignar a mantenimiento.', 'Description ready for review and assignment to maintenance.') },
    qr: { title: t('Cada lugar, con su contexto.', 'Every location, with context.'), description: t('Un QR vinculado a una habitación o activo puede dar acceso al formulario o información correspondiente.', 'A QR code linked to a room or asset can open the relevant form or information.'), input: t('QR · Habitación 204', 'QR · Room 204'), action: t('Ver flujo de ejemplo', 'See sample flow'), badge: offer?.active.some(g => g.id === 'maintenance') ? t('Control y mantenimiento en la propuesta', 'Control & maintenance in this proposal') : t('Requiere Control y mantenimiento', 'Requires Control & maintenance'), result: t('Reporte vinculado a la habitación', 'Report linked to the room'), outcome: t('Ubicación identificada y formulario de incidencia disponible.', 'Location identified and issue form available.') },
    nfc: { title: t('Un toque, en el punto de trabajo.', 'One tap, at the point of work.'), description: t('Acercar un dispositivo compatible a una etiqueta NFC puede iniciar o confirmar una tarea en sitio.', 'Tapping a compatible device on an NFC tag can start or confirm an on-site task.'), input: t('NFC · Punto de control de piscina', 'NFC · Pool checkpoint'), action: t('Ver validación de ejemplo', 'See sample check-in'), badge: offer?.active.some(g => g.id === 'mobility') ? t('Movilidad en la propuesta', 'Mobility in this proposal') : t('Requiere Movilidad', 'Requires Mobility'), result: t('Punto de control identificado', 'Checkpoint identified'), outcome: t('Tarea disponible para iniciar o confirmar según el flujo configurado.', 'Task available to start or confirm according to the configured workflow.') },
  };
  const scenario = scenarios[channel];

  return <main className={styles.page}>
    <div className={styles.toolbar}>
      <button className={styles.editButton} type="button" aria-expanded={editing} aria-controls="offer-settings" onClick={() => setEditing(value => !value)}>{editing ? t('Cerrar ajustes', 'Close settings') : t('Ajustar oferta', 'Adjust offer')}</button>
      <div className={styles.toolbarActions}><button type="button" hidden={!editing} disabled={!valid} onClick={save}>{t('Guardar borrador', 'Save draft')}{dirty ? ' *' : ''}</button><button type="button" disabled={!valid} onClick={copy}>{t('Copiar propuesta', 'Copy proposal')}</button><button type="button" disabled={!valid} onClick={() => window.print()}>{t('Imprimir / PDF', 'Print / PDF')} ↗</button></div>
    </div>
    <p className={styles.status} role="status" hidden={!editing && !status}>{status || t('Borrador editable. El guardado es local a este navegador.', 'Editable draft. Saved data stays in this browser.')}</p>

    <header className={styles.hero}>
      <div><span className={styles.heroEyebrow}>WHAGONS <i /> {t('PROPUESTA PERSONALIZADA', 'PERSONALIZED PROPOSAL')}</span><h1>Hotel Parador<span>.</span></h1><p>{t('Una operación conectada. Más tiempo para sus huéspedes.', 'Connected operations. More time for your guests.')}</p><span className={styles.location}>Manuel Antonio, Costa Rica</span></div>
      <div className={styles.heroSeal}><span>{t('PREPARADA PARA', 'PREPARED FOR')}</span><Image className={styles.hotelLogo} src="/images/proposals/hotel-parador-logo-white.png" alt="Parador Nature Resort & Spa" width={300} height={151} priority /><strong>{t('Gerencia y equipo de operaciones', 'Management & operations team')}</strong><span>{t('Limpieza · Mantenimiento · Seguimiento', 'Housekeeping · Maintenance · Follow-through')}</span></div>
    </header>

    <div id="offer-settings" className={styles.editor} hidden={!editing}>
      <div className={styles.controls}>
        <section className={styles.card}><div className={styles.sectionTitle}><span>01</span><div><h2>{t('El punto de partida', 'The starting point')}</h2><p>{t('Tarifas de Costa Rica. Ajusta el alcance para la conversación con Parador.', 'Costa Rica rates. Adjust the scope for your conversation with Parador.')}</p></div></div>
          <div className={styles.planGrid}>{plans.map((plan, index) => <label className={draft.plan === plan ? styles.selectedPlan : ''} key={plan}><input type="radio" name="offer-plan" checked={draft.plan === plan} onChange={() => update('plan', plan)} /><span>{planNames[plan]}</span><strong>{index === 2 && <small>{t('Desde ', 'From ')}</small>}{money(rates.cr.base[index])}<small>{monthlyLabel}</small></strong><small>{includedUsers[plan]} {t('usuarios incluidos', 'users included')}</small></label>)}</div>
          <div className={styles.fieldGrid}><label>{t('Usuarios totales', 'Total users')}<input type="number" min="1" max="100000" step="1" value={draft.users} onChange={e => update('users', e.target.value)} /></label><label>{t('Usuarios adicionales de cortesía', 'Complimentary additional users')}<input type="number" min="0" max="100000" step="1" value={draft.bonusUsers} onChange={e => update('bonusUsers', e.target.value)} /></label></div>
          <p className={styles.help}>{t('US$5 por usuario adicional al mes. La cortesía se aplica solo a usuarios por encima de los incluidos en el plan.', '$5 per additional user per month. Complimentary seats apply only above the plan’s included user allowance.')}</p>
        </section>

        <section className={styles.card}><div className={styles.sectionTitle}><span>02</span><div><h2>{t('Arma el paquete. Elige qué regalar.', 'Build the package. Choose what to gift.')}</h2><p>{t('Cada grupo puede quedar fuera, cobrarse o incluirse de cortesía.', 'Each group can be left out, charged or included at no charge.')}</p></div></div>
          <div className={styles.groupList}>{groups.map(group => {
            const price = groupPrice(group, 'cr', draft.plan);
            const mode = price === 0 ? 'included' : draft.groupModes[group.id] ?? 'off';
            return <div key={group.id} className={`${styles.groupRow} ${mode === 'gift' ? styles.giftRow : ''}`}><div><h3>{group[lang].name}{mode === 'gift' && <span className={styles.giftBadge}>{t('De cortesía', 'Complimentary')}</span>}</h3><p>{group[lang].modules.join(' · ')}</p><span className={styles.groupPrice}>{price === 0 ? t('Incluido en el plan', 'Included in plan') : <>{mode === 'gift' ? <s>{money(price)}{monthlyLabel}</s> : `${money(price)}${monthlyLabel}`}{mode === 'gift' && <strong> $0</strong>}</>}</span></div>{price === 0 ? <span className={styles.check} aria-label={t('Incluido', 'Included')}>✓</span> : <select aria-label={`${t('Condición de', 'Terms for')} ${group[lang].name}`} value={mode} onChange={e => setGroup(group.id, e.target.value as GroupMode)}><option value="off">{t('No agregar', 'Leave out')}</option><option value="paid">{t('Agregar con cargo', 'Add at list price')}</option><option value="gift">{t('Regalar', 'Complimentary')}</option></select>}</div>;
          })}</div>
        </section>

        <section className={styles.card}><div className={styles.sectionTitle}><span>03</span><div><h2>{t('Las condiciones de la oferta', 'The offer terms')}</h2><p>{t('Los descuentos se aplican después de las cortesías, sin duplicar beneficios.', 'Discounts apply after complimentary items, without counting benefits twice.')}</p></div></div>
          <div className={styles.fieldGrid}><label>{t('Tipo de descuento mensual', 'Monthly discount type')}<select value={draft.discountType} onChange={e => { setDraft(current => ({...current, discountType: e.target.value as 'percent' | 'amount', discount: '0'})); setDirty(true); setStatus(''); }}><option value="percent">{t('Porcentaje (%)', 'Percentage (%)')}</option><option value="amount">{t('Monto fijo (USD)', 'Fixed amount (USD)')}</option></select></label><label>{t('Descuento mensual', 'Monthly discount')} {draft.discountType === 'percent' ? '(%)' : '(USD)'}<input type="number" min="0" max={draft.discountType === 'percent' ? 100 : 1000000} step="0.01" value={draft.discount} onChange={e => update('discount', e.target.value)} /></label><label>{t('Descuento en implementación (%)', 'Implementation discount (%)')}<input type="number" min="0" max="100" step="0.01" value={draft.implementationDiscount} onChange={e => update('implementationDiscount', e.target.value)} /></label><label>{t('Duración de beneficios (meses)', 'Benefit duration (months)')}<input type="number" min="0" max="120" step="1" value={draft.promoMonths} onChange={e => update('promoMonths', e.target.value)} /></label></div>
          <div className={styles.quickAction}><button type="button" onClick={() => update('implementationDiscount', draft.implementationDiscount === '100' ? '0' : '100')}>{draft.implementationDiscount === '100' ? t('Quitar cortesía de implementación', 'Remove complimentary implementation') : t('Regalar implementación y capacitación', 'Make implementation and training complimentary')}</button></div>
          <p className={styles.help}>{t('0 meses mantiene los beneficios mientras no cambie el alcance. Una duración temporal aplica a los powerups regalados, usuarios bonificados y descuento mensual. Al terminar, vuelve la tarifa regular del mismo paquete.', '0 months keeps benefits for as long as the scope remains unchanged. A temporary duration applies to gifted powerups, complimentary users and the monthly discount. The same package returns to its regular rate afterward.')}</p>
          <div className={styles.fieldGrid}><label>{t('Válida para aceptar hasta (opcional)', 'Acceptance deadline (optional)')}<input type="date" value={draft.validUntil} onChange={e => update('validUntil', e.target.value)} /></label><div className={styles.trainingNote}><strong>{t('Capacitación inicial incluida', 'Initial training included')}</strong><p>{t('Forma parte de la implementación. Sesiones adicionales por cotizar.', 'Part of implementation. Additional sessions quoted separately.')}</p></div></div>
          <label className={styles.notesLabel}>{t('Condiciones adicionales para la propuesta', 'Additional proposal terms')}<textarea rows={3} maxLength={1500} value={draft.notes} placeholder={t('Por ejemplo: alcance de la puesta en marcha o condiciones del beneficio.', 'For example: onboarding scope or conditions attached to a benefit.')} onChange={e => update('notes', e.target.value)} /></label>
        </section>
      </div>
      <aside className={styles.aside}><div className={styles.summary} aria-live="polite">{financialSummary()}</div>{comparison()}</aside>
    </div>

    <section className={styles.customer} aria-label={t('Propuesta para presentar', 'Presentation proposal')}>
      <div className={styles.customerIntro}><span className={styles.eyebrow}>{t('SU EQUIPO. UNA MISMA OPERACIÓN.', 'YOUR TEAM. ONE CONNECTED OPERATION.')}</span><h2>{t('Del pendiente al trabajo resuelto.', 'From an open issue to completed work.')}</h2><p>{t('Proponemos comenzar conectando limpieza, mantenimiento y gerencia: reportar incidencias, asignar responsables y verificar cada cierre con evidencia.', 'We propose starting by connecting housekeeping, maintenance and management: report issues, assign owners and verify completion with evidence.')}</p></div>
      <div className={styles.customerLayout}><div><div className={styles.scopeHeader}><h3>{planNames[draft.plan]}</h3><span>{draft.users} {t('usuarios', 'users')} · {t('Costa Rica', 'Costa Rica')}</span></div><div className={styles.includedGrid}>{offer?.active.map(group => <article key={group.id}><div><span className={styles.check}>✓</span><span className={styles.scopeBadge}>{groupPrice(group, 'cr', draft.plan) === 0 ? t('Incluido', 'Included') : draft.groupModes[group.id] === 'gift' ? t('De cortesía', 'Complimentary') : `${money(groupPrice(group, 'cr', draft.plan))}${monthlyLabel}`}</span></div><h4>{group[lang].name}</h4><p>{group[lang].modules.join(' · ')}</p></article>)}</div>{comparison()}</div><div className={styles.summary}>{financialSummary()}</div></div>
    </section>

    <section className={styles.experience} aria-labelledby="experience-title">
      <div className={styles.experienceIntro}><span className={styles.eyebrow}>{t('ASÍ PODRÍA VIVIRSE EN PARADOR', 'HOW IT COULD WORK AT PARADOR')}</span><h2 id="experience-title">{t('Menos pasos entre detectar y resolver.', 'Fewer steps from noticing to resolving.')}</h2><p>{t('Explore tres formas de conectar al equipo con lo que sucede en el hotel.', 'Explore three ways to connect your team with what is happening at the hotel.')}</p></div>
      <div className={styles.channels} aria-label={t('Elegir ejemplo', 'Choose example')}>{(['voice', 'qr', 'nfc'] as Channel[]).map(id => <button type="button" key={id} aria-pressed={channel === id} onClick={() => { setChannel(id); setDemoComplete(false); }}><ChannelIcon channel={id} /><span>{id === 'voice' ? t('Voz', 'Voice') : id.toUpperCase()}</span><small>{id === 'voice' ? t('Capturar', 'Capture') : id === 'qr' ? t('Identificar', 'Identify') : t('Confirmar en sitio', 'Confirm on site')}</small></button>)}</div>
      <div className={styles.scenario}><div className={styles.scenarioText}><span className={styles.scopeBadge}>{scenario.badge}</span><h3>{scenario.title}</h3><p>{scenario.description}</p><ol className={styles.flow}><li><b>01</b>{t('Capturar el contexto', 'Capture context')}</li><li><b>02</b>{t('Revisar y asignar', 'Review and assign')}</li><li><b>03</b>{t('Resolver con evidencia', 'Resolve with evidence')}</li></ol></div>
        <div className={styles.demoCard}><div className={styles.demoTop}><span>WHAGONS <i /> PARADOR</span><small>{t('Ejemplo ilustrativo', 'Illustrative example')}</small></div><div className={styles.demoIcon}><ChannelIcon channel={channel} /></div>{channel === 'voice' && <div className={styles.wave} aria-hidden="true">{[12,22,34,19,44,28,39,52,34,23,41,31,18,27,14].map((height,i) => <i key={i} style={{height}} />)}</div>}<p className={styles.demoInput}>{scenario.input}</p><button className={styles.demoButton} type="button" onClick={() => setDemoComplete(value => !value)}>{demoComplete ? t('Volver al inicio', 'Start again') : scenario.action}<span>→</span></button>{demoComplete && <div className={styles.demoResult} role="status"><span>✓ {scenario.result}</span><p>{scenario.outcome}</p></div>}<small className={styles.demoFoot}>{t('Simulación visual. No activa micrófono, cámara ni lectores.', 'Visual simulation. Does not activate microphone, camera or readers.')}</small></div>
      </div>
      <div className={styles.channelNotes}><p><strong>{t('Voz', 'Voice')}</strong>{t('Dictado y comandos sujetos a configuración y alcance. Consumo por confirmar; no equivale al módulo Llamadas.', 'Dictation and commands depend on configuration and scope. Usage to be confirmed; separate from the Calling module.')}</p><p><strong>QR</strong>{t('Vinculado al grupo Control y mantenimiento. Configuración de códigos y formularios según el alcance acordado.', 'Part of Control & maintenance. Code and form setup depends on agreed scope.')}</p><p><strong>NFC</strong>{t('Vinculado al grupo Movilidad. Requiere dispositivos compatibles y etiquetas, cotizados por separado.', 'Part of Mobility. Requires compatible devices and tags, quoted separately.')}</p></div>
    </section>

    <section className={styles.nextSteps}><div><span className={styles.eyebrow}>{t('UNA PUESTA EN MARCHA ACOMPAÑADA', 'A GUIDED START')}</span><h2>{t('De la propuesta al primer turno.', 'From proposal to the first shift.')}</h2></div><ol><li><span>01</span><div><h3>{t('Acordar el alcance', 'Agree on scope')}</h3><p>{t('Confirmar usuarios, áreas y procesos con el equipo de Parador.', 'Confirm users, departments and workflows with the Parador team.')}</p></div></li><li><span>02</span><div><h3>{t('Configurar y capacitar', 'Configure and train')}</h3><p>{t('Preparar la plataforma y acompañar al equipo en sus primeros flujos.', 'Prepare the platform and guide the team through its first workflows.')}</p></div></li><li><span>03</span><div><h3>{t('Revisar la adopción', 'Review adoption')}</h3><p>{t('Revisar el uso y ajustar el alcance del acompañamiento según el plan.', 'Review usage and adjust support scope according to the plan.')}</p></div></li></ol></section>
    <section className={styles.conditions}><div><strong>{t('Vigencia para aceptar', 'Acceptance deadline')}</strong><span>{expiry}</span></div><div><strong>{t('Condiciones de la propuesta', 'Proposal terms')}</strong><p>{draft.notes || t('Alcance y condiciones por confirmar con Hotel Parador.', 'Scope and terms to be confirmed with Hotel Parador.')}</p><p>{t('Importes en USD, antes de impuestos. Integraciones, hardware, sesiones adicionales y consumo variable por cotizar. Los ejemplos operativos son ilustrativos. Esta propuesta no constituye una aceptación ni un contrato.', 'Amounts in USD, before taxes. Integrations, hardware, extra sessions and variable usage quoted separately. Operational examples are illustrative. This proposal is not an acceptance or a contract.')}</p></div></section>
  </main>;
}
