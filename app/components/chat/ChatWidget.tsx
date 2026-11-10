'use client';

// Live chat with the Whagons team. Talks to the chat service at chat.whagons.com
// (see chat/PROTOCOL.md). Nothing connects until a visitor sends a message or
// already has a conversation from an earlier visit.
//
// Anything with a data-chat-open attribute opens it, and so does #chat in the URL.
// Fixed bars at the bottom of the screen marked data-chat-avoid push the button up.

import { useCallback, useEffect, useRef, useState } from 'react';
import { legalRouteFor, type Language } from '../../lib/locales';
import styles from './ChatWidget.module.css';

const CHAT_URL = (process.env.NEXT_PUBLIC_CHAT_URL || 'https://chat.whagons.com').replace(/\/$/, '');
const STORE_KEY = 'whagons-chat';
const SEEN_KEY = 'whagons-chat-seen';
const MAX_TEXT = 2000;

type Message = {
  id: string;
  from: 'visitor' | 'agent';
  text: string;
  at: number;
  name?: string;
  clientId?: string;
  pending?: boolean;
};

type Stored = { id: string; token: string };

type Status = 'idle' | 'connecting' | 'online' | 'offline';

const copy = {
  es: {
    open: 'Chatea con nosotros',
    close: 'Cerrar chat',
    title: 'Whagons',
    subtitle: 'Te responde una persona del equipo',
    withAgent: (name: string) => `${name} está en el chat`,
    intro: 'Hola. ¿En qué te ayudamos? Escribe tu pregunta y una persona de nuestro equipo te responde aquí mismo.',
    placeholder: 'Escribe tu mensaje…',
    send: 'Enviar',
    typing: (name?: string) => (name ? `${name} está escribiendo…` : 'Escribiendo…'),
    reconnecting: 'Reconectando…',
    sending: 'Enviando…',
    askTitle: 'Estamos tardando un poco más de lo normal.',
    askBody: 'Déjanos tu correo y te respondemos ahí si te vas.',
    email: 'Correo',
    name: 'Nombre (opcional)',
    save: 'Guardar',
    notNow: 'Ahora no',
    saved: (email: string) => `Si no estás aquí, te respondemos a ${email}.`,
    getEmail: 'Recibir la respuesta por correo',
    badEmail: 'Escribe un correo válido.',
    failed: 'No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos a hello@whagons.com.',
    rateLimited: 'Demasiados mensajes seguidos. Espera un momento.',
    privacy: 'Política de privacidad',
    from: (name: string) => `${name} · Whagons`,
    unread: (n: number) => `${n} mensaje${n === 1 ? '' : 's'} sin leer`,
  },
  en: {
    open: 'Chat with us',
    close: 'Close chat',
    title: 'Whagons',
    subtitle: 'A person from our team will answer',
    withAgent: (name: string) => `${name} is in the chat`,
    intro: 'Hi. How can we help? Ask anything about Whagons and a person from our team will answer right here.',
    placeholder: 'Write a message…',
    send: 'Send',
    typing: (name?: string) => (name ? `${name} is typing…` : 'Typing…'),
    reconnecting: 'Reconnecting…',
    sending: 'Sending…',
    askTitle: 'We’re taking a little longer than usual.',
    askBody: 'Leave your email and we’ll reply there if you leave.',
    email: 'Email',
    name: 'Name (optional)',
    save: 'Save',
    notNow: 'Not now',
    saved: (email: string) => `If you’re not here, we’ll reply to ${email}.`,
    getEmail: 'Get the reply by email',
    badEmail: 'Enter a valid email.',
    failed: 'We couldn’t send your message. Try again or email hello@whagons.com.',
    rateLimited: 'Too many messages in a row. Wait a moment.',
    privacy: 'Privacy policy',
    from: (name: string) => `${name} · Whagons`,
    unread: (n: number) => `${n} unread message${n === 1 ? '' : 's'}`,
  },
} as const;

function readStore(): Stored | null {
  try {
    const value = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    return value && typeof value.id === 'string' && typeof value.token === 'string' ? value : null;
  } catch {
    return null;
  }
}

function writeStore(value: Stored | null) {
  try {
    if (value) localStorage.setItem(STORE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORE_KEY);
  } catch { /* storage blocked */ }
}

function readSeen(): number {
  try {
    return Number(localStorage.getItem(SEEN_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeSeen(at: number) {
  try {
    localStorage.setItem(SEEN_KEY, String(at));
  } catch { /* storage blocked */ }
}

function track(event: string) {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer?.push({ event });
}

function newClientId(): string {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const LINK = /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]]/g;

function Linkified({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    parts.push(text.slice(last, match.index));
    parts.push(<a key={match.index} href={match[0]} target="_blank" rel="noopener noreferrer">{match[0]}</a>);
    last = (match.index || 0) + match[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

export default function ChatWidget({ lang }: { lang: Language }) {
  const t = copy[lang === 'en' ? 'en' : 'es'];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentTyping, setAgentTyping] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [askEmail, setAskEmail] = useState(false);
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [seenAt, setSeenAt] = useState(0);
  const [lift, setLift] = useState(0);
  const [hasConversation, setHasConversation] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const storeRef = useRef<Stored | null>(null);
  const outboxRef = useRef<Array<Record<string, unknown>>>([]);
  const retryRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastTypingRef = useRef(0);
  const openRef = useRef(false);
  const startingRef = useRef(false);
  const listRef = useRef<HTMLOListElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  openRef.current = open;

  const markSeen = useCallback(() => {
    const now = Date.now();
    writeSeen(now);
    setSeenAt(now);
    const ws = socketRef.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'seen' }));
  }, []);

  const forget = useCallback(() => {
    storeRef.current = null;
    writeStore(null);
    setHasConversation(false);
    setMessages([]);
    setAgentName(null);
    setEmail(null);
    setAskEmail(false);
    setStatus('idle');
  }, []);

  const connect = useCallback(() => {
    const stored = storeRef.current;
    if (!stored) return;
    const current = socketRef.current;
    if (current && current.readyState <= WebSocket.OPEN) return;
    clearTimeout(retryTimerRef.current);
    setStatus((s) => (s === 'online' ? s : 'connecting'));
    const url = `${CHAT_URL.replace(/^http/, 'ws')}/api/v/ws?id=${encodeURIComponent(stored.id)}&token=${encodeURIComponent(stored.token)}`;
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      setStatus('offline');
      return;
    }
    socketRef.current = ws;
    let ping: ReturnType<typeof setInterval> | undefined;

    ws.onopen = () => {
      retryRef.current = 0;
      ping = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send('ping');
      }, 25_000);
    };

    ws.onmessage = (event) => {
      if (event.data === 'pong') return;
      let frame: Record<string, any>;
      try {
        frame = JSON.parse(event.data);
      } catch {
        return;
      }
      switch (frame.type) {
        case 'snapshot': {
          setStatus('online');
          const server: Message[] = frame.messages || [];
          setMessages((previous) => {
            // Keep messages still waiting to be sent, unless the server already has them.
            const pending = previous.filter((m) => m.pending && !server.some(
              (s) => s.from === 'visitor' && s.text === m.text && s.at >= m.at - 10_000,
            ));
            return [...server, ...pending];
          });
          setAgentName(frame.agent?.name || null);
          setEmail(frame.email || null);
          setAskEmail(Boolean(frame.askEmail));
          for (const queued of outboxRef.current.splice(0)) ws.send(JSON.stringify(queued));
          if (openRef.current && !document.hidden) ws.send(JSON.stringify({ type: 'seen' }));
          break;
        }
        case 'message': {
          const message: Message = frame.message;
          setMessages((previous) => {
            if (message.clientId) {
              const index = previous.findIndex((m) => m.clientId === message.clientId && m.pending);
              if (index >= 0) {
                const next = previous.slice();
                next[index] = message;
                return next;
              }
            }
            return previous.some((m) => m.id === message.id) ? previous : [...previous, message];
          });
          if (message.from === 'agent') {
            setAgentTyping(false);
            if (message.name) setAgentName(message.name);
            if (openRef.current && !document.hidden) {
              writeSeen(Date.now());
              setSeenAt(Date.now());
              ws.send(JSON.stringify({ type: 'seen' }));
            }
          }
          break;
        }
        case 'agent':
          setAgentName(frame.agent?.name || null);
          break;
        case 'typing':
          setAgentTyping(true);
          clearTimeout(typingTimerRef.current);
          typingTimerRef.current = setTimeout(() => setAgentTyping(false), 4000);
          break;
        case 'ask_email':
          setAskEmail(true);
          break;
        case 'contact_saved':
          setEmail(frame.email);
          setAskEmail(false);
          setEmailFormOpen(false);
          break;
        case 'error':
          setError(frame.error === 'rate_limited' ? t.rateLimited : t.failed);
          setMessages((previous) => previous.filter((m) => !m.pending));
          break;
      }
    };

    ws.onclose = (event) => {
      clearInterval(ping);
      if (socketRef.current !== ws) return;
      socketRef.current = null;
      if (event.code === 4401 || event.code === 4404) {
        forget();
        return;
      }
      setStatus('offline');
      if (document.hidden) return; // reconnect when the tab is visible again
      const delay = Math.min(30_000, 1000 * 2 ** retryRef.current) + Math.random() * 500;
      retryRef.current += 1;
      retryTimerRef.current = setTimeout(connect, delay);
    };
  }, [forget, t]);

  // Resume an earlier conversation.
  useEffect(() => {
    storeRef.current = readStore();
    setSeenAt(readSeen());
    if (storeRef.current) {
      setHasConversation(true);
      connect();
    }
    const resume = () => {
      if (!document.hidden && storeRef.current) connect();
    };
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('online', resume);
    return () => {
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('online', resume);
      clearTimeout(retryTimerRef.current);
      const ws = socketRef.current;
      socketRef.current = null;
      ws?.close();
    };
  }, [connect]);

  // Open from any [data-chat-open] link or button, and from #chat in the URL.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement | null)?.closest?.('[data-chat-open]');
      if (!trigger) return;
      event.preventDefault();
      setOpen(true);
      track('chat_open');
    };
    const fromHash = () => {
      if (window.location.hash !== '#chat') return;
      setOpen(true);
      history.replaceState(null, '', window.location.pathname + window.location.search);
    };
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', fromHash);
    fromHash();
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', fromHash);
    };
  }, []);

  // Sit above fixed bars at the bottom of the screen.
  useEffect(() => {
    const measure = () => {
      let height = 0;
      document.querySelectorAll<HTMLElement>('[data-chat-avoid]').forEach((node) => {
        const box = node.getBoundingClientRect();
        if (box.height && getComputedStyle(node).display !== 'none' && box.bottom >= window.innerHeight - 2) {
          height = Math.max(height, box.height);
        }
      });
      setLift(height);
    };
    measure();
    const timer = setInterval(measure, 1500);
    window.addEventListener('resize', measure);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // While open: mark replies as seen, keep the newest message in view, close on Escape.
  useEffect(() => {
    if (!open) return;
    markSeen();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add(styles.lock);
    if (!window.matchMedia('(pointer: coarse)').matches) setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove(styles.lock);
    };
  }, [open, markSeen]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open, agentTyping, askEmail, emailFormOpen]);

  const sendFrame = (frame: Record<string, unknown>) => {
    const ws = socketRef.current;
    if (ws?.readyState === WebSocket.OPEN && status === 'online') ws.send(JSON.stringify(frame));
    else {
      outboxRef.current.push(frame);
      connect();
    }
  };

  const startConversation = async (text: string, clientId: string) => {
    startingRef.current = true;
    try {
      const response = await fetch(`${CHAT_URL}/api/v/conversations`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text,
          clientId,
          lang,
          page: window.location.pathname,
          website: honeypotRef.current?.value || '',
        }),
      });
      if (!response.ok) {
        setError(response.status === 429 ? t.rateLimited : t.failed);
        setMessages((previous) => previous.filter((m) => m.clientId !== clientId));
        setDraft(text);
        return;
      }
      const data = await response.json();
      storeRef.current = { id: data.id, token: data.token };
      writeStore(storeRef.current);
      setHasConversation(true);
      setMessages(data.messages);
      markSeen();
      track('chat_start');
      connect();
    } catch {
      setError(t.failed);
      setMessages((previous) => previous.filter((m) => m.clientId !== clientId));
      setDraft(text);
    } finally {
      startingRef.current = false;
    }
  };

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = draft.trim().slice(0, MAX_TEXT);
    if (!text || startingRef.current) return;
    setError('');
    const clientId = newClientId();
    setMessages((previous) => [...previous, { id: clientId, clientId, from: 'visitor', text, at: Date.now(), pending: true }]);
    setDraft('');
    if (storeRef.current) sendFrame({ type: 'message', text, clientId });
    else void startConversation(text, clientId);
  };

  const onDraftChange = (value: string) => {
    setDraft(value);
    const now = Date.now();
    const ws = socketRef.current;
    if (value && ws?.readyState === WebSocket.OPEN && now - lastTypingRef.current > 3000) {
      lastTypingRef.current = now;
      ws.send(JSON.stringify({ type: 'typing' }));
    }
  };

  const saveContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = String(form.get('email') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(t.badEmail);
      return;
    }
    setError('');
    sendFrame({ type: 'contact', email: value, name: String(form.get('name') || '').trim() || undefined });
    track('chat_email');
  };

  const unread = open ? 0 : messages.filter((m) => m.from === 'agent' && m.at > seenAt).length;
  const showEmailForm = hasConversation && !email && (askEmail || emailFormOpen);
  const subtitle = agentName ? t.withAgent(agentName) : t.subtitle;

  return (
    <div className={styles.root} style={{ ['--chat-lift' as string]: `${lift}px` }}>
      {open && (
        <section className={styles.panel} role="dialog" aria-modal="false" aria-labelledby="chat-title">
          <header className={styles.header}>
            <span className={styles.avatar} aria-hidden="true">W</span>
            <div className={styles.heading}>
              <h2 id="chat-title">{t.title}</h2>
              <p>
                {status === 'offline' ? t.reconnecting : subtitle}
              </p>
            </div>
            <button
              type="button"
              className={styles.close}
              aria-label={t.close}
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>

          <ol className={styles.messages} ref={listRef} aria-live="polite">
            <li className={`${styles.message} ${styles.agent}`}>
              <div className={styles.bubble}>{t.intro}</div>
            </li>
            {messages.map((message) => (
              <li
                key={message.clientId || message.id}
                className={`${styles.message} ${message.from === 'agent' ? styles.agent : styles.visitor}${message.pending ? ` ${styles.pending}` : ''}`}
              >
                <div className={styles.bubble}><Linkified text={message.text} /></div>
                {message.pending ? (
                  <span className={styles.meta}>{t.sending}</span>
                ) : message.from === 'agent' && message.name ? (
                  <span className={styles.meta}>{t.from(message.name)}</span>
                ) : null}
              </li>
            ))}
            {agentTyping && (
              <li className={`${styles.message} ${styles.agent}`}>
                <div className={`${styles.bubble} ${styles.typing}`} aria-label={t.typing(agentName || undefined)}>
                  <span /><span /><span />
                </div>
              </li>
            )}
            {showEmailForm && (
              <li className={styles.card}>
                {askEmail && <p className={styles.cardTitle}>{t.askTitle}</p>}
                <p>{t.askBody}</p>
                <form onSubmit={saveContact} noValidate>
                  <label>
                    <span>{t.email}</span>
                    <input name="email" type="email" autoComplete="email" inputMode="email" required />
                  </label>
                  <label>
                    <span>{t.name}</span>
                    <input name="name" autoComplete="name" maxLength={80} />
                  </label>
                  <div className={styles.cardActions}>
                    <button type="submit" className={styles.primary}>{t.save}</button>
                    {!askEmail && (
                      <button type="button" className={styles.textButton} onClick={() => setEmailFormOpen(false)}>{t.notNow}</button>
                    )}
                  </div>
                </form>
              </li>
            )}
            {email && <li className={styles.note}>{t.saved(email)}</li>}
          </ol>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <form className={styles.composer} onSubmit={submit}>
            <input ref={honeypotRef} className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label className={styles.srOnly} htmlFor="chat-input">{t.placeholder}</label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              maxLength={MAX_TEXT}
              value={draft}
              placeholder={t.placeholder}
              onChange={(event) => onDraftChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  submit();
                }
              }}
            />
            <button type="submit" className={styles.send} aria-label={t.send} disabled={!draft.trim()}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z" /></svg>
            </button>
          </form>
          <p className={styles.footer}>
            {hasConversation && !email && !showEmailForm && (
              <>
                <button type="button" className={styles.textButton} onClick={() => setEmailFormOpen(true)}>{t.getEmail}</button>
                <span aria-hidden="true"> · </span>
              </>
            )}
            <a href={legalRouteFor(lang, 'privacy')}>{t.privacy}</a>
          </p>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={`${styles.launcher}${open ? ` ${styles.launcherOpen}` : ''}`}
        aria-label={unread ? `${t.open} · ${t.unread(unread)}` : open ? t.close : t.open}
        aria-expanded={open}
        data-track="chat_launcher_click"
        onClick={() => {
          setOpen((value) => !value);
          if (!open) track('chat_open');
        }}
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.launcherClose}><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V17A2.5 2.5 0 0 1 4 14.5v-9z" /></svg>
        )}
        {unread > 0 && <span className={styles.badge}>{unread}</span>}
      </button>
    </div>
  );
}
