// The chat hub: one Durable Object that stores every conversation, signs the
// team in, and relays messages between visitors and the team in real time.
//
// Visitor sockets are tagged "v:<conversation id>"; team sockets "agent" and
// "a:<email>". Both use the hibernation API, so idle connections cost nothing.
//
// Inbox WebSocket frames
//   server → inbox
//     { type: 'init', me, conversations: Summary[], push: boolean }
//     { type: 'conversation', conversation: Summary }        upsert
//     { type: 'removed', conversationId }
//     { type: 'history', conversationId, messages: Message[] }
//     { type: 'message', conversationId, message: Message }
//     { type: 'typing', conversationId }
//     { type: 'error', error }
//   inbox → server
//     { type: 'visible', visible }        the inbox is on screen (no push while it is)
//     { type: 'open' | 'read' | 'claim' | 'release' | 'close' | 'reopen' | 'delete' | 'typing', conversationId }
//     { type: 'send', conversationId, text, clientId }

import { DurableObject } from 'cloudflare:workers';
import { layout, sendEmail } from './email.ts';
import { sendPush, type VapidKeys } from './webpush.ts';
import {
  b64urlToBytes,
  cleanEmail,
  cleanLine,
  cleanText,
  getCookie,
  json,
  lowerList,
  randomCode,
  randomId,
  randomToken,
  readJson,
  sha256,
  type ChatEnv,
} from './util.ts';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const UNANSWERED_MS = 2 * MINUTE;
const VISITOR_EMAIL_DELAY_MS = MINUTE;
const SESSION_MS = 90 * DAY;
const CODE_MS = 15 * MINUTE;
const HISTORY_LIMIT = 300;
const INBOX_LIMIT = 300;
const COOKIE = 'wc_session';

type Attachment =
  | { role: 'visitor'; cid: string }
  | { role: 'agent'; email: string; visible: boolean };

interface ConversationRow {
  id: string;
  token_hash: string;
  status: 'open' | 'closed';
  lang: 'es' | 'en';
  page: string | null;
  country: string | null;
  city: string | null;
  name: string | null;
  email: string | null;
  claimed_by: string | null;
  created_at: number;
  updated_at: number;
  waiting_since: number | null;
  alerted_at: number | null;
  team_read_at: number;
  visitor_seen_at: number;
  emailed_upto: number;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  sender: 'visitor' | 'agent';
  agent_email: string | null;
  agent_name: string | null;
  text: string;
  at: number;
}

export interface Message {
  id: string;
  from: 'visitor' | 'agent';
  text: string;
  at: number;
  name?: string;
  clientId?: string;
}

export interface Summary {
  id: string;
  status: 'open' | 'closed';
  lang: string;
  page: string | null;
  country: string | null;
  city: string | null;
  name: string | null;
  email: string | null;
  claimedBy: string | null;
  claimedName: string | null;
  createdAt: number;
  updatedAt: number;
  waitingSince: number | null;
  unread: number;
  visitorOnline: boolean;
  last: { from: string; text: string; at: number } | null;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    token_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    lang TEXT NOT NULL,
    page TEXT,
    country TEXT,
    city TEXT,
    name TEXT,
    email TEXT,
    claimed_by TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    waiting_since INTEGER,
    alerted_at INTEGER,
    team_read_at INTEGER NOT NULL DEFAULT 0,
    visitor_seen_at INTEGER NOT NULL DEFAULT 0,
    emailed_upto INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS conversations_updated ON conversations(updated_at)`,
  `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    agent_email TEXT,
    agent_name TEXT,
    text TEXT NOT NULL,
    at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS messages_conversation ON messages(conversation_id, at)`,
  `CREATE TABLE IF NOT EXISTS agents (email TEXT PRIMARY KEY, name TEXT)`,
  `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, email TEXT NOT NULL, expires_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS login_codes (
    email TEXT PRIMARY KEY,
    code_hash TEXT NOT NULL,
    link_hash TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS push_subscriptions (
    endpoint TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS jobs (key TEXT PRIMARY KEY, due INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start INTEGER NOT NULL)`,
];

export class Hub extends DurableObject<ChatEnv> {
  private sql: SqlStorage;

  constructor(ctx: DurableObjectState, env: ChatEnv) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    for (const statement of SCHEMA) this.sql.exec(statement);
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
    ctx.blockConcurrencyWhile(async () => {
      if (!this.rows('SELECT key FROM jobs WHERE key = ?', 'cleanup').length) {
        await this.schedule('cleanup', Date.now() + DAY);
      }
    });
  }

  // ── Small helpers ────────────────────────────────────────────────────────

  private rows<T>(query: string, ...args: SqlStorageValue[]): T[] {
    return this.sql.exec(query, ...args).toArray() as unknown as T[];
  }

  private conversation(id: unknown): ConversationRow | null {
    if (typeof id !== 'string' || id.length > 64) return null;
    return this.rows<ConversationRow>('SELECT * FROM conversations WHERE id = ?', id)[0] || null;
  }

  private agentEmails(): string[] {
    return lowerList(this.env.AGENT_EMAILS);
  }

  private isAgent(email: string): boolean {
    return this.agentEmails().includes(email.toLowerCase());
  }

  private agentName(email: string | null): string | null {
    if (!email) return null;
    return this.rows<{ name: string | null }>('SELECT name FROM agents WHERE email = ?', email)[0]?.name || null;
  }

  /** Counts an action against a fixed window; false once `max` is reached. */
  private allow(key: string, max: number, windowMs: number): boolean {
    const now = Date.now();
    const row = this.rows<{ count: number; window_start: number }>(
      'SELECT count, window_start FROM rate_limits WHERE key = ?', key,
    )[0];
    if (!row || now - row.window_start >= windowMs) {
      this.sql.exec('INSERT OR REPLACE INTO rate_limits (key, count, window_start) VALUES (?, 1, ?)', key, now);
      return true;
    }
    if (row.count >= max) return false;
    this.sql.exec('UPDATE rate_limits SET count = count + 1 WHERE key = ?', key);
    return true;
  }

  private toMessage(row: MessageRow): Message {
    return {
      id: row.id,
      from: row.sender,
      text: row.text,
      at: row.at,
      ...(row.sender === 'agent' ? { name: row.agent_name || 'Whagons' } : {}),
    };
  }

  private history(cid: string, limit = HISTORY_LIMIT): Message[] {
    return this.rows<MessageRow>(
      `SELECT * FROM (SELECT *, rowid AS seq FROM messages WHERE conversation_id = ? ORDER BY at DESC, rowid DESC LIMIT ?)
       ORDER BY at, seq`, cid, limit,
    ).map((row) => this.toMessage(row));
  }

  private visitorSockets(cid: string, except?: WebSocket): WebSocket[] {
    return this.ctx.getWebSockets(`v:${cid}`).filter((ws) => ws !== except && ws.readyState === WebSocket.OPEN);
  }

  private agentSockets(): WebSocket[] {
    return this.ctx.getWebSockets('agent').filter((ws) => ws.readyState === WebSocket.OPEN);
  }

  private send(ws: WebSocket, frame: unknown) {
    try {
      ws.send(JSON.stringify(frame));
    } catch {
      // The socket closed between listing and sending.
    }
  }

  private toVisitor(cid: string, frame: unknown) {
    for (const ws of this.visitorSockets(cid)) this.send(ws, frame);
  }

  private toAgents(frame: unknown) {
    for (const ws of this.agentSockets()) this.send(ws, frame);
  }

  private summaries(where = '', ...args: SqlStorageValue[]): Summary[] {
    const rows = this.rows<ConversationRow & {
      last_text: string | null;
      last_from: string | null;
      last_at: number | null;
      unread: number;
      claimed_name: string | null;
    }>(
      `SELECT c.*,
        (SELECT text FROM messages m WHERE m.conversation_id = c.id ORDER BY at DESC, rowid DESC LIMIT 1) AS last_text,
        (SELECT sender FROM messages m WHERE m.conversation_id = c.id ORDER BY at DESC, rowid DESC LIMIT 1) AS last_from,
        (SELECT at FROM messages m WHERE m.conversation_id = c.id ORDER BY at DESC, rowid DESC LIMIT 1) AS last_at,
        (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender = 'visitor' AND m.at > c.team_read_at) AS unread,
        (SELECT name FROM agents a WHERE a.email = c.claimed_by) AS claimed_name
       FROM conversations c ${where} ORDER BY c.updated_at DESC LIMIT ${INBOX_LIMIT}`,
      ...args,
    );
    return rows.map((row) => ({
      id: row.id,
      status: row.status,
      lang: row.lang,
      page: row.page,
      country: row.country,
      city: row.city,
      name: row.name,
      email: row.email,
      claimedBy: row.claimed_by,
      claimedName: row.claimed_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      waitingSince: row.waiting_since,
      unread: row.unread,
      visitorOnline: this.visitorSockets(row.id).length > 0,
      last: row.last_text != null ? { from: row.last_from!, text: row.last_text, at: row.last_at! } : null,
    }));
  }

  private broadcastConversation(cid: string) {
    const summary = this.summaries('WHERE c.id = ?', cid)[0];
    if (summary) this.toAgents({ type: 'conversation', conversation: summary });
  }

  private visitorLabel(conv: ConversationRow): string {
    if (conv.name) return conv.name;
    if (conv.email) return conv.email;
    const country = conv.country ? countryName(conv.country) : null;
    return country ? `Visitor from ${country}` : 'Visitor';
  }

  // ── Scheduled work ───────────────────────────────────────────────────────

  private async schedule(key: string, due: number) {
    this.sql.exec('INSERT OR REPLACE INTO jobs (key, due) VALUES (?, ?)', key, due);
    const current = await this.ctx.storage.getAlarm();
    if (current == null || current > due) await this.ctx.storage.setAlarm(due);
  }

  async alarm() {
    const now = Date.now();
    const due = this.rows<{ key: string }>('SELECT key FROM jobs WHERE due <= ? ORDER BY due', now + 500);
    for (const { key } of due) {
      this.sql.exec('DELETE FROM jobs WHERE key = ?', key);
      try {
        const [kind, cid] = key.split(':');
        if (kind === 'unanswered') await this.unanswered(cid);
        else if (kind === 'visitor-email') await this.emailVisitor(cid);
        else if (kind === 'cleanup') await this.cleanup();
      } catch (error) {
        console.error('job failed', key, String(error));
      }
    }
    const next = this.rows<{ due: number | null }>('SELECT MIN(due) AS due FROM jobs')[0]?.due;
    if (next != null) await this.ctx.storage.setAlarm(Math.max(next, Date.now() + 100));
  }

  /** Two minutes without an answer: ask the visitor for an email and tell the team. */
  private async unanswered(cid: string) {
    const conv = this.conversation(cid);
    if (!conv || conv.waiting_since == null) return;
    const dueAt = conv.waiting_since + UNANSWERED_MS;
    if (Date.now() < dueAt - 1000) {
      await this.schedule(`unanswered:${cid}`, dueAt);
      return;
    }
    if (conv.alerted_at != null && conv.alerted_at >= conv.waiting_since) return;
    this.sql.exec('UPDATE conversations SET alerted_at = ? WHERE id = ?', Date.now(), cid);
    if (!conv.email) this.toVisitor(cid, { type: 'ask_email' });

    const label = this.visitorLabel(conv);
    const waiting = this.rows<MessageRow>(
      'SELECT * FROM messages WHERE conversation_id = ? AND sender = ? AND at >= ? ORDER BY at, rowid',
      cid, 'visitor', conv.waiting_since,
    );
    const preview = waiting.map((m) => m.text).join(' ').slice(0, 160);
    await Promise.all([
      this.pushAgents(conv, { title: `Still waiting · ${label}`, body: preview }, { everyone: true }),
      sendEmail(this.env, {
        to: lowerList(this.env.ALERT_EMAILS),
        subject: `Chat waiting for an answer: ${label}`,
        text: [
          `${label} has been waiting for 2 minutes on whagons.com${conv.page ? ` (${conv.page})` : ''}.`,
          '',
          ...waiting.map((m) => `> ${m.text}`),
          '',
          `Answer: ${this.env.PUBLIC_URL}/#c=${cid}`,
        ].join('\n'),
        html: layout({
          heading: `${label} is waiting for an answer`,
          intro: [`Nobody has replied for 2 minutes${conv.page ? ` on ${conv.page}` : ''}.`],
          transcript: waiting.map((m) => ({ who: label, text: m.text })),
          button: { label: 'Answer in the inbox', href: `${this.env.PUBLIC_URL}/#c=${cid}` },
        }),
      }),
    ]);
  }

  /** Emails replies the visitor has not seen, if they left an email and are gone. */
  private async emailVisitor(cid: string) {
    const conv = this.conversation(cid);
    if (!conv || !conv.email || this.visitorSockets(cid).length) return;
    const since = Math.max(conv.visitor_seen_at, conv.emailed_upto);
    const unseen = this.rows<MessageRow>(
      'SELECT * FROM messages WHERE conversation_id = ? AND sender = ? AND at > ? ORDER BY at, rowid',
      cid, 'agent', since,
    );
    if (!unseen.length) return;
    const lastVisitor = this.rows<MessageRow>(
      'SELECT * FROM messages WHERE conversation_id = ? AND sender = ? AND at < ? ORDER BY at DESC, rowid DESC LIMIT 1',
      cid, 'visitor', unseen[0].at,
    )[0];
    const es = conv.lang === 'es';
    const agentName = unseen[unseen.length - 1].agent_name || 'Whagons';
    const replyTo = unseen[unseen.length - 1].agent_email || undefined;
    const continueUrl = `${this.env.SITE_URL}/${conv.lang}#chat`;
    const you = es ? 'Tú' : 'You';
    const heading = es ? `${agentName} de Whagons te respondió` : `${agentName} from Whagons replied`;
    const sent = await sendEmail(this.env, {
      to: [conv.email],
      replyTo,
      subject: es ? 'Respuesta a tu chat con Whagons' : 'A reply to your chat with Whagons',
      text: [
        heading,
        '',
        ...(lastVisitor ? [`${you}: ${lastVisitor.text}`, ''] : []),
        ...unseen.map((m) => `${m.agent_name || 'Whagons'}: ${m.text}`),
        '',
        es ? `Responde a este correo o sigue el chat en ${continueUrl}` : `Reply to this email or continue the chat at ${continueUrl}`,
      ].join('\n'),
      html: layout({
        heading,
        transcript: [
          ...(lastVisitor ? [{ who: you, text: lastVisitor.text, mine: true }] : []),
          ...unseen.map((m) => ({ who: m.agent_name || 'Whagons', text: m.text })),
        ],
        button: { label: es ? 'Seguir el chat' : 'Continue the chat', href: continueUrl },
        footer: es
          ? 'También puedes responder directamente a este correo.'
          : 'You can also reply to this email directly.',
      }),
    });
    if (sent) {
      this.sql.exec('UPDATE conversations SET emailed_upto = ? WHERE id = ?', unseen[unseen.length - 1].at, cid);
    }
  }

  private async cleanup() {
    const now = Date.now();
    const days = Math.max(30, Number(this.env.RETENTION_DAYS) || 365);
    const cutoff = now - days * DAY;
    const old = this.rows<{ id: string }>('SELECT id FROM conversations WHERE updated_at < ?', cutoff);
    for (const { id } of old) this.deleteConversation(id);
    this.sql.exec('DELETE FROM sessions WHERE expires_at < ?', now);
    this.sql.exec('DELETE FROM login_codes WHERE expires_at < ?', now);
    this.sql.exec('DELETE FROM rate_limits WHERE window_start < ?', now - DAY);
    await this.schedule('cleanup', now + DAY);
  }

  private deleteConversation(cid: string) {
    this.sql.exec('DELETE FROM messages WHERE conversation_id = ?', cid);
    this.sql.exec('DELETE FROM conversations WHERE id = ?', cid);
    this.sql.exec('DELETE FROM jobs WHERE key IN (?, ?)', `unanswered:${cid}`, `visitor-email:${cid}`);
    for (const ws of this.visitorSockets(cid)) {
      try { ws.close(4404, 'gone'); } catch { /* already closed */ }
    }
    this.toAgents({ type: 'removed', conversationId: cid });
  }

  // ── Push notifications ───────────────────────────────────────────────────

  private vapid(): VapidKeys | null {
    if (!this.env.VAPID_PUBLIC_KEY || !this.env.VAPID_PRIVATE_KEY) return null;
    return { subject: this.env.VAPID_SUBJECT, publicKey: this.env.VAPID_PUBLIC_KEY, privateKey: this.env.VAPID_PRIVATE_KEY };
  }

  /**
   * Notifies the team about a conversation. Goes to whoever took it, or to
   * everyone while nobody has. People looking at the inbox right now are
   * skipped unless `everyone` is set.
   */
  private async pushAgents(
    conv: ConversationRow,
    note: { title: string; body: string },
    options: { everyone?: boolean; only?: string } = {},
  ) {
    const keys = this.vapid();
    if (!keys) return;
    let recipients = options.only
      ? [options.only]
      : conv.claimed_by && this.isAgent(conv.claimed_by) && !options.everyone
        ? [conv.claimed_by]
        : this.agentEmails();
    if (!options.everyone && !options.only) {
      const watching = new Set(
        this.agentSockets()
          .map((ws) => ws.deserializeAttachment() as Attachment)
          .filter((att): att is Extract<Attachment, { role: 'agent' }> => att.role === 'agent' && att.visible)
          .map((att) => att.email),
      );
      recipients = recipients.filter((email) => !watching.has(email));
    }
    if (!recipients.length) return;
    const targets = this.rows<{ endpoint: string; p256dh: string; auth: string }>(
      `SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE email IN (${recipients.map(() => '?').join(',')})`,
      ...recipients,
    );
    const unread = this.rows<{ n: number }>(
      `SELECT COUNT(*) AS n FROM messages m JOIN conversations c ON c.id = m.conversation_id
       WHERE m.sender = 'visitor' AND m.at > c.team_read_at`,
    )[0]?.n || 0;
    const payload = {
      title: note.title,
      body: note.body.length > 180 ? `${note.body.slice(0, 177)}…` : note.body,
      tag: `c-${conv.id}`,
      url: `/#c=${conv.id}`,
      badge: unread,
    };
    const results = await Promise.all(targets.map((target) => sendPush(target, payload, keys, conv.id)));
    results.forEach((result, index) => {
      if (result === 'gone') this.sql.exec('DELETE FROM push_subscriptions WHERE endpoint = ?', targets[index].endpoint);
    });
  }

  // ── HTTP entry point ─────────────────────────────────────────────────────

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const route = `${request.method} ${url.pathname}`;
    switch (route) {
      case 'POST /api/v/conversations': return this.startConversation(request);
      case 'GET /api/v/ws': return this.visitorSocket(request, url);
      case 'POST /api/a/login': return this.login(request);
      case 'POST /api/a/verify': return this.verify(request);
      case 'GET /auth': return this.verifyLink(url);
      case 'POST /api/a/logout': return this.logout(request);
      case 'GET /api/a/me':
      case 'POST /api/a/me': return this.me(request);
      case 'GET /api/a/push':
      case 'POST /api/a/push':
      case 'DELETE /api/a/push': return this.pushSettings(request);
      case 'POST /api/a/push/test': return this.pushTest(request);
      case 'GET /api/a/ws': return this.agentSocket(request);
      default: return json({ error: 'not_found' }, { status: 404 });
    }
  }

  // ── Visitors ─────────────────────────────────────────────────────────────

  private async startConversation(request: Request): Promise<Response> {
    const body = await readJson(request);
    if (!body || body.website) return json({ error: 'invalid' }, { status: 400 });
    const text = cleanText(body.text);
    if (!text) return json({ error: 'invalid' }, { status: 400 });
    const ip = request.headers.get('x-chat-ip') || 'unknown';
    if (!this.allow(`start:${ip}`, 6, 60 * MINUTE) || !this.allow('start:all', 300, 60 * MINUTE)) {
      return json({ error: 'rate_limited' }, { status: 429 });
    }

    const now = Date.now();
    const id = randomId();
    const token = randomToken();
    const lang = body.lang === 'en' ? 'en' : 'es';
    const page = cleanLine(body.page, 300);
    const country = cleanLine(request.headers.get('x-chat-country'), 2);
    let city: string | null = null;
    try {
      city = cleanLine(decodeURIComponent(request.headers.get('x-chat-city') || ''), 80);
    } catch { /* malformed header */ }

    this.sql.exec(
      `INSERT INTO conversations (id, token_hash, status, lang, page, country, city, created_at, updated_at, waiting_since)
       VALUES (?, ?, 'open', ?, ?, ?, ?, ?, ?, ?)`,
      id, await sha256(token), lang, page, country, city, now, now, now,
    );
    const message = this.insertMessage(id, 'visitor', text, now);
    await this.schedule(`unanswered:${id}`, now + UNANSWERED_MS);

    const conv = this.conversation(id)!;
    this.broadcastConversation(id);
    this.ctx.waitUntil(this.pushAgents(conv, {
      title: `New chat · ${this.visitorLabel(conv)}`,
      body: text,
    }));
    const clientId = cleanLine(body.clientId, 64);
    return json({ id, token, messages: [{ ...message, ...(clientId ? { clientId } : {}) }] }, { status: 201 });
  }

  private insertMessage(cid: string, sender: 'visitor' | 'agent', text: string, at: number, agent?: { email: string; name: string }): Message {
    const id = randomId();
    this.sql.exec(
      'INSERT INTO messages (id, conversation_id, sender, agent_email, agent_name, text, at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      id, cid, sender, agent?.email ?? null, agent?.name ?? null, text, at,
    );
    return { id, from: sender, text, at, ...(agent ? { name: agent.name } : {}) };
  }

  private async visitorSocket(request: Request, url: URL): Promise<Response> {
    if (request.headers.get('upgrade')?.toLowerCase() !== 'websocket') return json({ error: 'upgrade' }, { status: 426 });
    const [client, server] = Object.values(new WebSocketPair());
    const conv = this.conversation(url.searchParams.get('id'));
    const token = url.searchParams.get('token') || '';
    if (!conv || (await sha256(token)) !== conv.token_hash) {
      server.accept();
      server.close(conv ? 4401 : 4404, conv ? 'unauthorized' : 'gone');
      return new Response(null, { status: 101, webSocket: client });
    }
    const wasOnline = this.visitorSockets(conv.id).length > 0;
    this.ctx.acceptWebSocket(server, [`v:${conv.id}`]);
    server.serializeAttachment({ role: 'visitor', cid: conv.id } satisfies Attachment);
    const agentName = conv.claimed_by ? this.agentName(conv.claimed_by) || 'Whagons' : null;
    const askEmail = !conv.email && conv.waiting_since != null && Date.now() - conv.waiting_since >= UNANSWERED_MS;
    this.send(server, {
      type: 'snapshot',
      messages: this.history(conv.id),
      agent: agentName ? { name: agentName } : null,
      email: conv.email,
      askEmail,
    });
    if (!wasOnline) this.broadcastConversation(conv.id);
    return new Response(null, { status: 101, webSocket: client });
  }

  private async onVisitorFrame(ws: WebSocket, cid: string, frame: Record<string, unknown>) {
    const conv = this.conversation(cid);
    if (!conv) {
      try { ws.close(4404, 'gone'); } catch { /* closed */ }
      return;
    }
    switch (frame.type) {
      case 'message': {
        const text = cleanText(frame.text);
        if (!text) return this.send(ws, { type: 'error', error: 'invalid' });
        if (!this.allow(`msg:${cid}`, 20, MINUTE)) return this.send(ws, { type: 'error', error: 'rate_limited' });
        const now = Date.now();
        const message = this.insertMessage(cid, 'visitor', text, now);
        const startsWait = conv.waiting_since == null;
        this.sql.exec(
          `UPDATE conversations SET updated_at = ?, status = 'open', waiting_since = COALESCE(waiting_since, ?) WHERE id = ?`,
          now, now, cid,
        );
        if (startsWait) await this.schedule(`unanswered:${cid}`, now + UNANSWERED_MS);
        const clientId = cleanLine(frame.clientId, 64);
        this.send(ws, { type: 'message', message: { ...message, ...(clientId ? { clientId } : {}) } });
        for (const other of this.visitorSockets(cid, ws)) this.send(other, { type: 'message', message });
        this.toAgents({ type: 'message', conversationId: cid, message });
        this.broadcastConversation(cid);
        this.ctx.waitUntil(this.pushAgents(conv, { title: this.visitorLabel(conv), body: text }));
        return;
      }
      case 'typing':
        return this.toAgents({ type: 'typing', conversationId: cid });
      case 'seen':
        this.sql.exec('UPDATE conversations SET visitor_seen_at = ? WHERE id = ?', Date.now(), cid);
        return;
      case 'contact': {
        const email = cleanEmail(frame.email);
        if (!email) return this.send(ws, { type: 'error', error: 'invalid' });
        const name = cleanLine(frame.name, 80);
        this.sql.exec(
          'UPDATE conversations SET email = ?, name = COALESCE(?, name), updated_at = ? WHERE id = ?',
          email, name, Date.now(), cid,
        );
        this.toVisitor(cid, { type: 'contact_saved', email });
        this.broadcastConversation(cid);
        return;
      }
    }
  }

  // ── Team sign-in ─────────────────────────────────────────────────────────

  private async login(request: Request): Promise<Response> {
    const body = await readJson(request);
    const email = cleanEmail(body?.email);
    if (!email) return json({ error: 'invalid' }, { status: 400 });
    const ip = request.headers.get('x-chat-ip') || 'unknown';
    if (!this.allow(`login-ip:${ip}`, 20, 60 * MINUTE)) return json({ error: 'rate_limited' }, { status: 429 });
    // Unknown addresses get the same answer, so the inbox does not reveal who is on the team.
    if (!this.isAgent(email) || !this.allow(`login:${email}`, 5, CODE_MS)) return json({ ok: true });

    const code = randomCode();
    const link = randomToken();
    this.sql.exec(
      'INSERT OR REPLACE INTO login_codes (email, code_hash, link_hash, expires_at, attempts) VALUES (?, ?, ?, ?, 0)',
      email, await sha256(code), await sha256(link), Date.now() + CODE_MS,
    );
    const href = `${this.env.PUBLIC_URL}/auth?e=${encodeURIComponent(email)}&t=${link}`;
    await sendEmail(this.env, {
      to: [email],
      subject: `${code} is your Whagons Chat code`,
      text: `Your sign-in code is ${code}\n\nOr open this link on the same device: ${href}\n\nBoth expire in 15 minutes. If you did not ask to sign in, ignore this email.`,
      html: layout({
        heading: `Your sign-in code is ${code}`,
        intro: ['Type it in the Whagons Chat inbox, or use the button on the device you want to sign in on. Both expire in 15 minutes.'],
        button: { label: 'Sign in to Whagons Chat', href },
        footer: 'If you did not ask to sign in, ignore this email.',
      }),
    });
    return json({ ok: true });
  }

  private async verify(request: Request): Promise<Response> {
    const body = await readJson(request);
    const email = cleanEmail(body?.email);
    const code = typeof body?.code === 'string' ? body.code.replace(/\D/g, '') : '';
    if (!email || code.length !== 6) return json({ error: 'invalid' }, { status: 400 });
    const row = this.rows<{ code_hash: string; expires_at: number; attempts: number }>(
      'SELECT code_hash, expires_at, attempts FROM login_codes WHERE email = ?', email,
    )[0];
    if (!row || row.expires_at < Date.now() || row.attempts >= 5 || !this.isAgent(email)) {
      return json({ error: 'expired' }, { status: 401 });
    }
    if ((await sha256(code)) !== row.code_hash) {
      this.sql.exec('UPDATE login_codes SET attempts = attempts + 1 WHERE email = ?', email);
      return json({ error: 'wrong_code' }, { status: 401 });
    }
    this.sql.exec('DELETE FROM login_codes WHERE email = ?', email);
    const cookie = await this.createSession(email);
    return json({ me: this.meFor(email) }, { headers: { 'set-cookie': cookie } });
  }

  private async verifyLink(url: URL): Promise<Response> {
    const email = cleanEmail(url.searchParams.get('e'));
    const token = url.searchParams.get('t') || '';
    const row = email
      ? this.rows<{ link_hash: string; expires_at: number }>('SELECT link_hash, expires_at FROM login_codes WHERE email = ?', email)[0]
      : undefined;
    if (!email || !row || row.expires_at < Date.now() || !this.isAgent(email) || (await sha256(token)) !== row.link_hash) {
      return new Response(null, { status: 303, headers: { location: '/?signin=expired' } });
    }
    this.sql.exec('DELETE FROM login_codes WHERE email = ?', email);
    const cookie = await this.createSession(email);
    return new Response(null, { status: 303, headers: { location: '/', 'set-cookie': cookie } });
  }

  private secureCookie(): string {
    return this.env.PUBLIC_URL.startsWith('https://') ? '; Secure' : '';
  }

  private async createSession(email: string): Promise<string> {
    const token = randomToken();
    this.sql.exec(
      'INSERT INTO sessions (token_hash, email, expires_at) VALUES (?, ?, ?)',
      await sha256(token), email, Date.now() + SESSION_MS,
    );
    this.sql.exec('INSERT OR IGNORE INTO agents (email, name) VALUES (?, NULL)', email);
    return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MS / 1000}${this.secureCookie()}`;
  }

  /** The signed-in team member's email, extending the session while it is used. */
  private async agentFor(request: Request): Promise<string | null> {
    const token = getCookie(request, COOKIE);
    if (!token) return null;
    const hash = await sha256(token);
    const row = this.rows<{ email: string; expires_at: number }>('SELECT email, expires_at FROM sessions WHERE token_hash = ?', hash)[0];
    if (!row || row.expires_at < Date.now() || !this.isAgent(row.email)) return null;
    if (row.expires_at - Date.now() < SESSION_MS - DAY) {
      this.sql.exec('UPDATE sessions SET expires_at = ? WHERE token_hash = ?', Date.now() + SESSION_MS, hash);
    }
    return row.email;
  }

  private meFor(email: string) {
    return { email, name: this.agentName(email) };
  }

  private async logout(request: Request): Promise<Response> {
    const token = getCookie(request, COOKIE);
    if (token) this.sql.exec('DELETE FROM sessions WHERE token_hash = ?', await sha256(token));
    return json({ ok: true }, { headers: { 'set-cookie': `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${this.secureCookie()}` } });
  }

  private async me(request: Request): Promise<Response> {
    const email = await this.agentFor(request);
    if (!email) return json({ error: 'signed_out' }, { status: 401 });
    if (request.method === 'POST') {
      const body = await readJson(request);
      const name = cleanLine(body?.name, 40);
      if (!name) return json({ error: 'invalid' }, { status: 400 });
      this.sql.exec('INSERT INTO agents (email, name) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET name = excluded.name', email, name);
      for (const summary of this.summaries('WHERE c.claimed_by = ?', email)) {
        this.toAgents({ type: 'conversation', conversation: summary });
      }
    }
    // Re-issuing the cookie keeps an installed inbox signed in while it is used.
    const token = getCookie(request, COOKIE)!;
    return json({ me: this.meFor(email) }, {
      headers: { 'set-cookie': `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MS / 1000}${this.secureCookie()}` },
    });
  }

  // ── Team notifications ───────────────────────────────────────────────────

  private async pushSettings(request: Request): Promise<Response> {
    const email = await this.agentFor(request);
    if (!email) return json({ error: 'signed_out' }, { status: 401 });
    if (request.method === 'GET') return json({ publicKey: this.env.VAPID_PUBLIC_KEY || null });

    const body = await readJson(request);
    if (request.method === 'DELETE') {
      if (typeof body?.endpoint === 'string') {
        this.sql.exec('DELETE FROM push_subscriptions WHERE endpoint = ? AND email = ?', body.endpoint, email);
      }
      return json({ ok: true });
    }

    const sub = body?.subscription as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } } | undefined;
    const endpoint = typeof sub?.endpoint === 'string' ? sub.endpoint : '';
    const p256dh = typeof sub?.keys?.p256dh === 'string' ? sub.keys.p256dh : '';
    const auth = typeof sub?.keys?.auth === 'string' ? sub.keys.auth : '';
    let valid = false;
    try {
      valid = endpoint.length < 1024 && new URL(endpoint).protocol === 'https:'
        && b64urlToBytes(p256dh).length === 65 && b64urlToBytes(auth).length === 16;
    } catch { /* invalid */ }
    if (!valid) return json({ error: 'invalid' }, { status: 400 });
    this.sql.exec(
      'INSERT OR REPLACE INTO push_subscriptions (endpoint, email, p256dh, auth, created_at) VALUES (?, ?, ?, ?, ?)',
      endpoint, email, p256dh, auth, Date.now(),
    );
    // Keep the ten most recent devices per person.
    this.sql.exec(
      `DELETE FROM push_subscriptions WHERE email = ? AND endpoint NOT IN
        (SELECT endpoint FROM push_subscriptions WHERE email = ? ORDER BY created_at DESC LIMIT 10)`,
      email, email,
    );
    return json({ ok: true });
  }

  private async pushTest(request: Request): Promise<Response> {
    const email = await this.agentFor(request);
    if (!email) return json({ error: 'signed_out' }, { status: 401 });
    const keys = this.vapid();
    if (!keys) return json({ error: 'push_not_configured' }, { status: 503 });
    const targets = this.rows<{ endpoint: string; p256dh: string; auth: string }>(
      'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE email = ?', email,
    );
    const results = await Promise.all(targets.map((target) => sendPush(target, {
      title: 'Notifications are on',
      body: 'New chats from whagons.com will show up here.',
      tag: 'test',
      url: '/',
    }, keys)));
    results.forEach((result, index) => {
      if (result === 'gone') this.sql.exec('DELETE FROM push_subscriptions WHERE endpoint = ?', targets[index].endpoint);
    });
    return json({ devices: targets.length, sent: results.filter((r) => r === 'sent').length });
  }

  // ── Team inbox socket ────────────────────────────────────────────────────

  private async agentSocket(request: Request): Promise<Response> {
    if (request.headers.get('upgrade')?.toLowerCase() !== 'websocket') return json({ error: 'upgrade' }, { status: 426 });
    const email = await this.agentFor(request);
    const [client, server] = Object.values(new WebSocketPair());
    if (!email) {
      server.accept();
      server.close(4401, 'signed_out');
      return new Response(null, { status: 101, webSocket: client });
    }
    this.ctx.acceptWebSocket(server, ['agent', `a:${email}`]);
    server.serializeAttachment({ role: 'agent', email, visible: true } satisfies Attachment);
    const hasPush = this.rows('SELECT 1 FROM push_subscriptions WHERE email = ? LIMIT 1', email).length > 0;
    this.send(server, { type: 'init', me: this.meFor(email), conversations: this.summaries(), push: hasPush });
    return new Response(null, { status: 101, webSocket: client });
  }

  private async onAgentFrame(ws: WebSocket, att: Extract<Attachment, { role: 'agent' }>, frame: Record<string, unknown>) {
    if (!this.isAgent(att.email)) {
      try { ws.close(4401, 'signed_out'); } catch { /* closed */ }
      return;
    }
    if (frame.type === 'visible') {
      ws.serializeAttachment({ ...att, visible: frame.visible === true } satisfies Attachment);
      return;
    }
    const cid = frame.conversationId;
    const conv = this.conversation(cid);
    if (!conv) return this.send(ws, { type: 'removed', conversationId: cid });
    const now = Date.now();

    switch (frame.type) {
      case 'open':
        this.send(ws, { type: 'history', conversationId: conv.id, messages: this.history(conv.id) });
        this.sql.exec('UPDATE conversations SET team_read_at = ? WHERE id = ?', now, conv.id);
        return this.broadcastConversation(conv.id);
      case 'read':
        this.sql.exec('UPDATE conversations SET team_read_at = ? WHERE id = ?', now, conv.id);
        return this.broadcastConversation(conv.id);
      case 'typing':
        return this.toVisitor(conv.id, { type: 'typing' });
      case 'claim':
      case 'release': {
        const claimedBy = frame.type === 'claim' ? att.email : null;
        this.sql.exec('UPDATE conversations SET claimed_by = ? WHERE id = ?', claimedBy, conv.id);
        if (claimedBy) this.toVisitor(conv.id, { type: 'agent', agent: { name: this.agentName(att.email) || 'Whagons' } });
        return this.broadcastConversation(conv.id);
      }
      case 'close':
      case 'reopen':
        this.sql.exec('UPDATE conversations SET status = ?, waiting_since = CASE WHEN ? THEN NULL ELSE waiting_since END WHERE id = ?',
          frame.type === 'close' ? 'closed' : 'open', frame.type === 'close' ? 1 : 0, conv.id);
        return this.broadcastConversation(conv.id);
      case 'delete':
        return this.deleteConversation(conv.id);
      case 'send': {
        const text = cleanText(frame.text);
        if (!text) return this.send(ws, { type: 'error', error: 'invalid' });
        const name = this.agentName(att.email) || 'Whagons';
        const message = this.insertMessage(conv.id, 'agent', text, now, { email: att.email, name });
        const claims = !conv.claimed_by;
        this.sql.exec(
          `UPDATE conversations SET updated_at = ?, waiting_since = NULL, team_read_at = ?, status = 'open',
             claimed_by = COALESCE(claimed_by, ?) WHERE id = ?`,
          now, now, att.email, conv.id,
        );
        this.sql.exec('DELETE FROM jobs WHERE key = ?', `unanswered:${conv.id}`);
        if (claims) this.toVisitor(conv.id, { type: 'agent', agent: { name } });
        this.toVisitor(conv.id, { type: 'message', message });
        const clientId = cleanLine(frame.clientId, 64);
        for (const other of this.agentSockets()) {
          this.send(other, { type: 'message', conversationId: conv.id, message: other === ws && clientId ? { ...message, clientId } : message });
        }
        this.broadcastConversation(conv.id);
        if (conv.email) await this.schedule(`visitor-email:${conv.id}`, now + VISITOR_EMAIL_DELAY_MS);
        return;
      }
    }
  }

  // ── Socket events ────────────────────────────────────────────────────────

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== 'string' || message.length > 8192) return;
    let frame: unknown;
    try {
      frame = JSON.parse(message);
    } catch {
      return;
    }
    if (!frame || typeof frame !== 'object') return;
    const att = ws.deserializeAttachment() as Attachment | null;
    if (att?.role === 'visitor') await this.onVisitorFrame(ws, att.cid, frame as Record<string, unknown>);
    else if (att?.role === 'agent') await this.onAgentFrame(ws, att, frame as Record<string, unknown>);
  }

  async webSocketClose(ws: WebSocket, code: number) {
    try { ws.close(code === 1005 || code === 1006 ? 1000 : code, 'bye'); } catch { /* already closed */ }
    await this.socketGone(ws);
  }

  async webSocketError(ws: WebSocket) {
    await this.socketGone(ws);
  }

  private async socketGone(ws: WebSocket) {
    const att = ws.deserializeAttachment() as Attachment | null;
    if (att?.role !== 'visitor') return;
    if (this.visitorSockets(att.cid, ws).length) return;
    this.broadcastConversation(att.cid);
    // The visitor left with replies they have not seen: email them shortly.
    const conv = this.conversation(att.cid);
    if (conv?.email) {
      const unseen = this.rows(
        'SELECT 1 FROM messages WHERE conversation_id = ? AND sender = ? AND at > ? LIMIT 1',
        conv.id, 'agent', Math.max(conv.visitor_seen_at, conv.emailed_upto),
      );
      if (unseen.length) await this.schedule(`visitor-email:${conv.id}`, Date.now() + VISITOR_EMAIL_DELAY_MS);
    }
  }
}

function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
}
