'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../../lib/locales';
import styles from './RufoChat.module.css';

/**
 * The chat with Rufo: answers about Whagons from the site's own pages
 * (app/api/rufo), and a demo request when the visitor wants one.
 * The conversation lives in this tab only (sessionStorage).
 */

interface Turn {
  role: 'user' | 'assistant';
  content: string;
  lead?: boolean;
}

const COPY: Record<Language, {
  title: string; subtitle: string; hello: string; placeholder: string; send: string; close: string;
  note: string; privacy: string; suggestions: string[]; lead: string; leadFailed: string;
  busy: string; off: string; dialog: string; restart: string;
}> = {
  es: {
    title: 'Rufo',
    subtitle: 'Asistente de Whagons',
    hello: '¡Hola! Soy Rufo 👋 Pregúntame lo que quieras sobre Whagons. ¿Qué tipo de operación manejas?',
    placeholder: 'Escribe tu pregunta…',
    send: 'Enviar',
    close: 'Cerrar el chat',
    note: 'Rufo es una IA (Claude, de Anthropic) y puede equivocarse. No compartas datos sensibles.',
    privacy: 'Cómo tratamos tus datos',
    suggestions: ['¿Qué es Whagons?', '¿Sirve para hoteles?', '¿Cómo es la implementación?', 'Quiero una demo'],
    lead: 'Solicitud enviada al equipo',
    leadFailed: 'No se pudo enviar la solicitud',
    busy: 'Me hiciste muchas preguntas seguidas 😅 Dame unos minutos, o escríbenos a hello@whagons.com.',
    off: 'Ahora mismo no puedo responder. Escríbenos a hello@whagons.com o [pide una demo](/es/demo).',
    dialog: 'Chat con Rufo',
    restart: 'Empezar de nuevo',
  },
  en: {
    title: 'Rufo',
    subtitle: 'Whagons assistant',
    hello: 'Hi! I’m Rufo 👋 Ask me anything about Whagons. What kind of operation do you run?',
    placeholder: 'Type your question…',
    send: 'Send',
    close: 'Close the chat',
    note: 'Rufo is an AI (Claude, by Anthropic) and can make mistakes. Don’t share sensitive data.',
    privacy: 'How we handle your data',
    suggestions: ['What is Whagons?', 'Does it work for hotels?', 'How does setup work?', 'I’d like a demo'],
    lead: 'Request sent to the team',
    leadFailed: 'The request could not be sent',
    busy: 'That’s a lot of questions in a row 😅 Give me a few minutes, or write to hello@whagons.com.',
    off: 'I can’t answer right now. Write to hello@whagons.com or [request a demo](/en/demo).',
    dialog: 'Chat with Rufo',
    restart: 'Start over',
  },
};

const STORE = 'whagons-rufo-chat';

// ---- a very small markdown: paragraphs, "- " lists, **bold**, links to whagons.com, emails ----
function safeHref(url: string): string | null {
  if (/^mailto:[^\s@]+@[^\s@]+$/.test(url)) return url;
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  try {
    const u = new URL(url);
    if (u.protocol === 'https:' && (u.hostname === 'whagons.com' || u.hostname === 'www.whagons.com')) {
      return `${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

function inline(text: string, key: string) {
  const out: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|([\w.+-]+@[\w-]+\.[\w.]+)/g;
  let last = 0;
  let i = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1]) out.push(<strong key={k}>{m[1]}</strong>);
    else if (m[2]) {
      const href = safeHref(m[3]);
      out.push(href ? <a key={k} href={href}>{m[2]}</a> : m[2]);
    } else if (m[4]) out.push(<a key={k} href={`mailto:${m[4]}`}>{m[4]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Rich({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, b) => {
        const lines = block.split('\n');
        if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return (
            <ul key={b}>
              {lines.map((l, i) => <li key={i}>{inline(l.replace(/^\s*[-*•]\s+/, ''), `${b}-${i}`)}</li>)}
            </ul>
          );
        }
        return (
          <p key={b}>
            {lines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {inline(l, `${b}-${i}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

export default function RufoChat({
  lang, open, onClose, onTalking,
}: {
  lang: Language;
  open: boolean;
  onClose: () => void;
  onTalking: (talking: boolean) => void;
}) {
  const copy = COPY[lang] ?? COPY.es;
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);

  // Keep the conversation while the visitor moves around the site.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || '[]');
      if (Array.isArray(saved)) setTurns(saved.filter((t) => t && typeof t.content === 'string').slice(-40));
    } catch {
      /* nothing saved */
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(turns.slice(-40)));
    } catch {
      /* storage unavailable */
    }
  }, [turns]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, busy, open]);

  useEffect(() => () => abort.current?.abort(), []);

  const send = useCallback(async (text: string) => {
    const question = text.trim().slice(0, 1200);
    if (!question || busy) return;
    const history: Turn[] = [...turns, { role: 'user', content: question }];
    setTurns([...history, { role: 'assistant', content: '' }]);
    setDraft('');
    setBusy(true);
    onTalking(true);
    const controller = new AbortController();
    abort.current = controller;
    let answer = '';
    let lead: boolean | undefined;
    const update = () =>
      setTurns([...history, { role: 'assistant', content: answer, ...(lead !== undefined ? { lead } : {}) }]);
    try {
      const response = await fetch('/api/rufo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          page: window.location.pathname,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        answer = response.status === 429 ? copy.busy : copy.off;
        update();
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl = buffer.indexOf('\n');
        while (nl >= 0) {
          const raw = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          nl = buffer.indexOf('\n');
          if (!raw.trim()) continue;
          try {
            const event = JSON.parse(raw);
            if (event.t === 'text' && typeof event.v === 'string') answer += event.v;
            else if (event.t === 'lead') lead = Boolean(event.ok);
          } catch {
            /* a broken line */
          }
        }
        update();
      }
      if (!answer.trim()) {
        answer = copy.off;
        update();
      }
    } catch {
      if (!controller.signal.aborted) {
        answer = answer || copy.off;
        update();
      }
    } finally {
      setBusy(false);
      onTalking(false);
      abort.current = null;
    }
  }, [busy, turns, lang, copy, onTalking]);

  const restart = () => {
    abort.current?.abort();
    setTurns([]);
    setDraft('');
  };

  const started = turns.length > 0;
  const waiting = busy && turns[turns.length - 1]?.content === '';

  return (
    <section
      id="rufo-chat"
      className={styles.panel}
      role="dialog"
      aria-label={copy.dialog}
      data-open={open ? '' : undefined}
      hidden={!open}
    >
      <header className={styles.head}>
        <span className={styles.avatar} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rufo/rufo-front.webp" alt="" />
        </span>
        <span className={styles.who}>
          <strong>{copy.title}</strong>
          <small>{copy.subtitle}</small>
        </span>
        {started && (
          <button type="button" className={styles.ghost} onClick={restart}>{copy.restart}</button>
        )}
        <button type="button" className={styles.close} onClick={onClose} aria-label={copy.close}>×</button>
      </header>

      <div ref={list} className={styles.list} aria-live="polite">
        <div className={styles.msg} data-role="assistant"><Rich text={copy.hello} /></div>
        {turns.map((turn, i) =>
          turn.role === 'assistant' && !turn.content ? null : (
            <Fragment key={i}>
              <div className={styles.msg} data-role={turn.role}>
                {turn.role === 'assistant' ? <Rich text={turn.content} /> : <p>{turn.content}</p>}
              </div>
              {turn.lead !== undefined && (
                <div className={styles.lead} data-ok={turn.lead ? '' : undefined}>
                  {turn.lead ? `✓ ${copy.lead}` : copy.leadFailed}
                </div>
              )}
            </Fragment>
          )
        )}
        {waiting && (
          <div className={styles.msg} data-role="assistant" aria-label="…">
            <span className={styles.dots}><i /><i /><i /></span>
          </div>
        )}
        {!started && (
          <div className={styles.chips}>
            {copy.suggestions.map((s) => (
              <button key={s} type="button" onClick={() => void send(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <textarea
          ref={input}
          rows={1}
          value={draft}
          maxLength={1200}
          placeholder={copy.placeholder}
          aria-label={copy.placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              void send(draft);
            }
          }}
        />
        <button type="submit" disabled={busy || !draft.trim()} aria-label={copy.send}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 12l15-7-5 15-3-6-7-2z" fill="currentColor" />
          </svg>
        </button>
      </form>
      <p className={styles.note}>
        {copy.note} <a href={`/${lang}/privacy#rufo-assistant`}>{copy.privacy}</a>
      </p>
    </section>
  );
}
