import { calculateScore, questions } from './hotel-score.mjs';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function buildScoreEmail({language, answers}) {
  const es = language === 'es'; const result = calculateScore(answers); const qs = questions[language];
  const levels = es ? ['Operación reactiva','En organización','Bajo control','Mejora continua'] : ['Reactive operations','Getting organized','Under control','Continuous improvement'];
  const label = result.score === null ? (es ? 'Sin suficientes datos' : 'Not enough information') : `${result.score}/100`;
  const heading = es ? 'Tu hotel, con un próximo paso claro.' : 'Your hotel. A clear next step.';
  const intro = es ? 'Este es tu diagnóstico, basado en las prácticas que indicaste en las diez preguntas.' : 'Here is your assessment, based on the practices you reported in the ten questions.';
  const caveat = es ? 'Autoevaluación orientativa, no una auditoría ni una comparación con otros hoteles. Cada respuesta A–D vale 0–3 puntos. «No lo sé» y «No aplica» se excluyen del cálculo. Los niveles son orientativos.' : 'An indicative self-assessment, not an audit or a comparison with other hotels. Answers A–D earn 0–3 points. “Not sure” and “Not applicable” are excluded. Levels are indicative.';
  const summary = `${label}${result.level === null ? '' : ` · ${levels[result.level]}`} · ${result.evaluated}/10 ${es ? 'áreas evaluadas' : 'areas evaluated'}${result.partial ? (es ? ' · Resultado parcial' : ' · Partial result') : ''}`;
  const sections = result.opportunities.map((index, rank) => {
    const q = qs[index]; const action = answers[index] === 2 ? q.improve : q.action;
    return {title:`${rank+1}. ${q.area}`, text:`${q.opportunity}\n${es ? 'Tu respuesta' : 'Your answer'}: ${q.answers[answers[index]]}\n${es ? 'Primer paso' : 'First step'}: ${action}\nWhagons: ${q.features.join(', ')}\n${es ? 'Qué revisar' : 'What to review'}: ${q.metric}${q.note ? `\n${q.note}` : ''}`,
      html:`<h2>${rank+1}. ${escape(q.area)}</h2><p><strong>${escape(q.opportunity)}</strong></p><p>${es ? 'Tu respuesta' : 'Your answer'}: ${escape(q.answers[answers[index]])}</p><p><b>${es ? 'Primer paso' : 'First step'}:</b> ${escape(action)}</p><p><b>Whagons:</b> ${escape(q.features.join(' · '))}</p><p><b>${es ? 'Qué revisar' : 'What to review'}:</b> ${escape(q.metric)}</p>${q.note ? `<p style="font-size:12px;color:#666">${escape(q.note)}</p>` : ''}`};
  });
  const unknown = result.unknown.length ? `${es ? 'Por aclarar con tu equipo' : 'Clarify with your team'}: ${result.unknown.map(i=>qs[i].area).join(', ')}. ${es ? 'Confirma cómo se trabaja hoy antes de decidir qué cambiar.' : 'Confirm current practices before deciding what to change.'}` : '';
  const strengths = result.strengths.length ? `${es ? 'Fortalezas declaradas' : 'Reported strengths'}: ${result.strengths.map(i=>qs[i].area).join(', ')}.` : '';
  const starterIndex = result.opportunities[0] ?? result.unknown[0] ?? 9;
  const starter = qs[starterIndex];
  const templateTitle = `${es ? 'Plantilla para empezar' : 'Starter worksheet'} · ${starter.area}`;
  const templateText = starter.template.map(field=>`${field}: ____________________`).join('\n');
  const templateHtml = `<h2>${escape(templateTitle)}</h2><p>${es ? 'Copia esta ficha y úsala en un caso real con tu equipo.' : 'Copy this worksheet and use it with your team on a real case.'}</p><table style="width:100%;border-collapse:collapse">${starter.template.map(field=>`<tr><th style="text-align:left;padding:12px;border:1px solid #ddd;width:45%">${escape(field)}</th><td style="border:1px solid #ddd;padding:12px">&nbsp;</td></tr>`).join('')}</table>`;
  const demoUrl = `https://whagons.com/${language}/demo?source=hotel-score&focus=${starter.id}`;
  const demo = es ? `Veamos cómo organizar ${starter.area.toLowerCase()} en Whagons` : `See how to organize ${starter.area.toLowerCase()} in Whagons`;
  const allAnswers = qs.map((q,i)=>`${q.area}: ${typeof answers[i] === 'number' ? q.answers[answers[i]] : answers[i] === 'na' ? (es ? 'No aplica' : 'Not applicable') : (es ? 'No lo sé' : 'Not sure')}`);
  return {
    subject: es ? 'Tu Whagons Hotel Operations Score y plan de mejora' : 'Your Whagons Hotel Operations Score and improvement plan',
    text:[heading,intro,summary,...sections.map(s=>`${s.title}\n${s.text}`),unknown,strengths,templateTitle,templateText,`${demo}: ${demoUrl}`,es ? 'Tus respuestas' : 'Your answers',...allAnswers,caveat].filter(Boolean).join('\n\n'),
    html:`<!doctype html><html lang="${language}"><body style="margin:0;background:#f5f2eb;font-family:Arial,sans-serif;color:#182c38;line-height:1.6"><div style="max-width:620px;margin:auto;padding:36px 24px"><p style="letter-spacing:2px;font-size:12px">WHAGONS / HOTEL OPERATIONS SCORE</p><h1 style="font-size:32px;line-height:1.15">${heading}</h1><p>${intro}</p><div style="background:#183848;color:white;padding:28px;border-radius:12px;font-size:24px">${escape(summary)}</div>${sections.map(s=>s.html).join('<hr style="border:0;border-top:1px solid #ddd;margin:28px 0">')}${unknown ? `<h2>${es ? 'Visibilidad pendiente' : 'Visibility gaps'}</h2><p>${escape(unknown)}</p>` : ''}${strengths ? `<h2>${es ? 'Lo que ya tienes organizado' : 'What you already have in place'}</h2><p>${escape(strengths)}</p>` : ''}${templateHtml}<p style="margin:32px 0"><a href="${demoUrl}" style="background:#3563a6;color:white;padding:14px 20px;display:inline-block;text-decoration:none;border-radius:6px">${escape(demo)} →</a></p><h2>${es ? 'Tus respuestas' : 'Your answers'}</h2><ul>${allAnswers.map(a=>`<li>${escape(a)}</li>`).join('')}</ul><p style="font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:20px">${caveat}</p><p style="font-size:12px;color:#666">${es ? 'Recibes este correo porque solicitaste tu diagnóstico en Whagons.' : 'You received this email because you requested your assessment from Whagons.'}</p></div></body></html>`,
  };
}
