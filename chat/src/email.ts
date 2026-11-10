import { escapeHtml, type ChatEnv } from './util.ts';

export interface Email {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

/** Sends through Resend. In development without a key, prints instead. */
export async function sendEmail(env: ChatEnv, email: Email): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    if (env.DEV === '1') {
      console.log(`[dev email] to ${email.to.join(', ')}: ${email.subject}\n${email.text}`);
      return true;
    }
    console.error('RESEND_API_KEY is not set; email not sent');
    return false;
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: email.to,
          subject: email.subject,
          text: email.text,
          html: email.html,
          ...(email.replyTo ? { reply_to: email.replyTo } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) return true;
      console.error('email rejected', response.status);
      if (response.status < 500 && response.status !== 429) return false;
    } catch (error) {
      console.error('email failed', String(error));
    }
  }
  return false;
}

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/** A plain, readable email: a heading, paragraphs, an optional transcript and button. */
export function layout(parts: {
  heading: string;
  intro?: string[];
  transcript?: Array<{ who: string; text: string; mine?: boolean }>;
  button?: { label: string; href: string };
  footer?: string;
}): string {
  const paragraphs = (parts.intro || [])
    .map((line) => `<p style="margin:0 0 14px;font:15px/1.5 ${FONT};color:#0A0A09">${escapeHtml(line)}</p>`)
    .join('');
  const transcript = (parts.transcript || [])
    .map((line) => `<tr><td style="padding:10px 14px;border-radius:10px;background:${line.mine ? '#0A0A09' : '#FFFFFF'};color:${line.mine ? '#F5F2EB' : '#0A0A09'};font:15px/1.5 ${FONT}">
      <div style="font:600 12px/1.4 ${FONT};opacity:.7;margin-bottom:2px">${escapeHtml(line.who)}</div>
      ${escapeHtml(line.text).replace(/\n/g, '<br>')}
    </td></tr><tr><td style="height:8px"></td></tr>`)
    .join('');
  const button = parts.button
    ? `<p style="margin:20px 0 0"><a href="${escapeHtml(parts.button.href)}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#D4310A;color:#FFFFFF;text-decoration:none;font:600 15px/1 ${FONT}">${escapeHtml(parts.button.label)}</a></p>`
    : '';
  const footer = parts.footer
    ? `<p style="margin:28px 0 0;font:13px/1.5 ${FONT};color:#66615B">${escapeHtml(parts.footer)}</p>`
    : '';
  return `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#F5F2EB">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 0 18px;font:600 12px/1 ${FONT};letter-spacing:.2em;text-transform:uppercase;color:#0A0A09">Whagons</td></tr>
<tr><td><h1 style="margin:0 0 16px;font:600 22px/1.3 ${FONT};color:#0A0A09">${escapeHtml(parts.heading)}</h1>
${paragraphs}
${transcript ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${transcript}</table>` : ''}
${button}${footer}</td></tr></table></td></tr></table></body></html>`;
}
