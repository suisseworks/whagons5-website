import { createHash } from 'node:crypto';
import { fetchWithRetry, RESEND_EMAILS_URL } from './demo-delivery.mjs';
import { captureScoreLead } from './hotel-score-capture.mjs';
import { calculateScore, questions } from './hotel-score.mjs';

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

export function scoreNotificationAvailable(env = process.env) {
  return Boolean(env.RESEND_API_KEY?.trim() && env.DEMO_NOTIFICATION_FROM?.trim());
}

export function buildScoreNotification(data) {
  const es = data.language === 'es';
  const result = calculateScore(data.answers);
  const email = data.email.trim().toLowerCase();
  const summary = [
    `Email: ${email}`,
    `Language: ${data.language}`,
    `Score: ${result.score === null ? 'Not enough information' : `${result.score}/100`}`,
    `Evaluated answers: ${result.evaluated}/10`,
    `Optional marketing consent: ${data.marketingOptIn === true ? 'Yes' : 'No'}`,
  ];
  const responses = questions[data.language].map((question, index) => {
    const value = data.answers[index];
    const answer = typeof value === 'number'
      ? `${'ABCD'[value]}. ${question.answers[value]}`
      : value === 'na' ? (es ? 'No aplica' : 'Not applicable') : (es ? 'No lo sé' : 'Not sure');
    return { question: `${index + 1}. ${question.question}`, answer };
  });
  return {
    subject: '[Whagons] Hotel Operations Score completed',
    text: ['Hotel Operations Score completed', ...summary, ...responses.map(r => `${r.question}\n${r.answer}`)].join('\n\n'),
    html: `<html><body><h1>Hotel Operations Score completed</h1>${summary.map(line => `<p>${escapeHtml(line)}</p>`).join('')}${responses.map(r => `<h2>${escapeHtml(r.question)}</h2><p>${escapeHtml(r.answer)}</p>`).join('')}</body></html>`,
    reply_to: email,
  };
}

// This runs only after captureScoreLead has validated the completed submission.
export async function completeScoreRequest({ resendApiKey, from, ...captureOptions }) {
  const captured = await captureScoreLead(captureOptions);
  if (!captured.ok) return captured;
  if (!scoreNotificationAvailable({ RESEND_API_KEY: resendApiKey, DEMO_NOTIFICATION_FROM: from })) {
    return { ...captured, ok: false, status: 503, code: 'SCORE_EMAIL_NOT_CONFIGURED' };
  }
  const payload = {
    from: from.trim(),
    to: ['marketing@whagons.com'],
    ...buildScoreNotification(captureOptions.data),
  };
  // Include the content so editing an email/answer with the same request ID
  // cannot conflict with Resend's idempotency cache. Retries remain identical.
  const digest = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  const outcome = await fetchWithRetry({
    fetchImpl: captureOptions.fetchImpl || fetch,
    url: RESEND_EMAILS_URL,
    init: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey.trim()}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `hotel-score/${captureOptions.data.requestId}/${digest}`,
      },
      body: JSON.stringify(payload),
    },
    timeoutMs: 4000,
    maxAttempts: 2,
    retryDelayMs: 150,
  });
  if (outcome.error || !outcome.response?.ok) {
    return { ...captured, ok: false, status: 502, code: 'SCORE_EMAIL_FAILED' };
  }
  return { ...captured, notificationSent: true };
}
