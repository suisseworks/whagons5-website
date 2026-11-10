import type { Hub } from './hub.ts';

export interface ChatEnv {
  ASSETS: Fetcher;
  HUB: DurableObjectNamespace<Hub>;
  AGENT_EMAILS: string;
  ALERT_EMAILS: string;
  ALLOWED_ORIGINS: string;
  PUBLIC_URL: string;
  SITE_URL: string;
  EMAIL_FROM: string;
  VAPID_SUBJECT: string;
  VAPID_PUBLIC_KEY: string;
  RETENTION_DAYS: string;
  /** "1" in local development: sign-in codes and emails are logged instead of sent. */
  DEV?: string;
  RESEND_API_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
}

export const MAX_TEXT = 2000;
export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

export function list(value: string | undefined): string[] {
  return (value || '').split(',').map((item) => item.trim()).filter(Boolean);
}

export function lowerList(value: string | undefined): string[] {
  return list(value).map((item) => item.toLowerCase());
}

const encoder = new TextEncoder();

export function bytesToB64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function b64urlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function randomToken(byteLength = 32): string {
  return bytesToB64url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

export function randomId(): string {
  return randomToken(12);
}

/** A six-digit code with no modulo bias. */
export function randomCode(): string {
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= 4_294_000_000);
  return String(value % 1_000_000).padStart(6, '0');
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return bytesToB64url(new Uint8Array(digest));
}

/** Plain text a person typed: control characters removed, length capped. */
export function cleanText(value: unknown, max = MAX_TEXT): string | null {
  if (typeof value !== 'string') return null;
  const text = value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
  if (!text || text.length > max) return null;
  return text;
}

export function cleanLine(value: unknown, max = 120): string | null {
  const text = cleanText(value, max);
  return text ? text.replace(/\s+/g, ' ') : null;
}

export function cleanEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function json(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', 'no-store');
  return new Response(JSON.stringify(body), { ...init, headers });
}

export async function readJson(request: Request, maxBytes = 16_384): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get('content-length') || '0');
  if (length > maxBytes) return null;
  try {
    const text = await request.text();
    if (text.length > maxBytes) return null;
    const value = JSON.parse(text);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

export function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}
