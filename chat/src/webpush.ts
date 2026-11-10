// Web Push for the team inbox: VAPID (RFC 8292) and aes128gcm payload
// encryption (RFC 8291, RFC 8188), on WebCrypto only.

import { b64urlToBytes, bytesToB64url } from './util.ts';

export interface PushTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface VapidKeys {
  subject: string;
  publicKey: string;   // base64url, 65-byte uncompressed P-256 point
  privateKey: string;  // base64url, 32-byte private scalar
}

const encoder = new TextEncoder();
const RECORD_SIZE = 4096;

function concat(...parts: Array<Uint8Array | number[]>): Uint8Array {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

async function hmac(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const hmacKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, data));
}

/** The JWK for a P-256 key, from its raw public point and optional private scalar. */
export function p256Jwk(publicKey: Uint8Array, privateKey?: Uint8Array): JsonWebKey {
  if (publicKey.length !== 65 || publicKey[0] !== 4) throw new Error('Expected an uncompressed P-256 public key');
  return {
    kty: 'EC',
    crv: 'P-256',
    x: bytesToB64url(publicKey.slice(1, 33)),
    y: bytesToB64url(publicKey.slice(33, 65)),
    ...(privateKey ? { d: bytesToB64url(privateKey) } : {}),
    ext: true,
  };
}

/**
 * Encrypts a push message for one subscription (RFC 8291). `salt` and
 * `serverKeys` are only passed by tests; normally both are fresh per message.
 */
export async function encryptPushPayload(
  payload: Uint8Array,
  target: Pick<PushTarget, 'p256dh' | 'auth'>,
  options: { salt?: Uint8Array; serverKeys?: CryptoKeyPair } = {},
): Promise<Uint8Array> {
  if (payload.length > RECORD_SIZE - 17) throw new Error('Push payload is too large');
  const uaPublic = b64urlToBytes(target.p256dh);
  const authSecret = b64urlToBytes(target.auth);
  const serverKeys = options.serverKeys
    ?? (await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']) as CryptoKeyPair);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', serverKeys.publicKey) as ArrayBuffer);
  const uaKey = await crypto.subtle.importKey('raw', uaPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ecdhSecret = new Uint8Array(
    // The standard field is "public"; Cloudflare's generated types call it "$public".
    await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey } as unknown as SubtleCryptoDeriveKeyAlgorithm, serverKeys.privateKey, 256),
  );

  // IKM = HKDF(auth_secret, ecdh_secret, "WebPush: info" || 0 || ua_public || as_public, 32)
  const prkKey = await hmac(authSecret, ecdhSecret);
  const ikm = await hmac(prkKey, concat(encoder.encode('WebPush: info'), [0], uaPublic, asPublic, [1]));

  const salt = options.salt ?? crypto.getRandomValues(new Uint8Array(16));
  const prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, concat(encoder.encode('Content-Encoding: aes128gcm'), [0], [1]))).slice(0, 16);
  const nonce = (await hmac(prk, concat(encoder.encode('Content-Encoding: nonce'), [0], [1]))).slice(0, 12);

  const aesKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  // A single record: the payload followed by the last-record delimiter 0x02.
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, concat(payload, [2])),
  );

  const header = new Uint8Array(16 + 4 + 1 + asPublic.length);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, RECORD_SIZE);
  header[20] = asPublic.length;
  header.set(asPublic, 21);
  return concat(header, ciphertext);
}

let cachedSigningKey: { id: string; key: CryptoKey } | null = null;

async function signingKey(keys: VapidKeys): Promise<CryptoKey> {
  const id = keys.publicKey + keys.privateKey;
  if (cachedSigningKey?.id === id) return cachedSigningKey.key;
  const jwk = p256Jwk(b64urlToBytes(keys.publicKey), b64urlToBytes(keys.privateKey));
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  cachedSigningKey = { id, key };
  return key;
}

/** The Authorization header for a push service (RFC 8292). */
export async function vapidAuthorization(endpoint: string, keys: VapidKeys, now = Date.now()): Promise<string> {
  const segment = (value: unknown) => bytesToB64url(encoder.encode(JSON.stringify(value)));
  const unsigned = `${segment({ typ: 'JWT', alg: 'ES256' })}.${segment({
    aud: new URL(endpoint).origin,
    exp: Math.floor(now / 1000) + 12 * 60 * 60,
    sub: keys.subject,
  })}`;
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    await signingKey(keys),
    encoder.encode(unsigned),
  );
  return `vapid t=${unsigned}.${bytesToB64url(new Uint8Array(signature))}, k=${keys.publicKey}`;
}

export type PushResult = 'sent' | 'gone' | 'failed';

/** Sends one notification. "gone" means the subscription should be deleted. */
export async function sendPush(
  target: PushTarget,
  message: Record<string, unknown>,
  keys: VapidKeys,
  topic?: string,
): Promise<PushResult> {
  try {
    const body = await encryptPushPayload(encoder.encode(JSON.stringify(message)), target);
    const headers: Record<string, string> = {
      authorization: await vapidAuthorization(target.endpoint, keys),
      'content-encoding': 'aes128gcm',
      'content-type': 'application/octet-stream',
      ttl: '86400',
      urgency: 'high',
    };
    // Replaces a still-undelivered notification for the same conversation.
    if (topic && /^[A-Za-z0-9_-]{1,32}$/.test(topic)) headers.topic = topic;
    const response = await fetch(target.endpoint, { method: 'POST', headers, body });
    if (response.status === 404 || response.status === 410) return 'gone';
    if (!response.ok) {
      console.warn('push rejected', response.status, new URL(target.endpoint).host);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.warn('push failed', String(error));
    return 'failed';
  }
}
