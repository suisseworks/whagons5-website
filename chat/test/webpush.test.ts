import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encryptPushPayload, p256Jwk, vapidAuthorization } from '../src/webpush.ts';
import { b64urlToBytes, bytesToB64url } from '../src/util.ts';

// The worked example in RFC 8291, section 5.
const RFC = {
  plaintext: 'When I grow up, I want to be a watermelon',
  asPrivate: 'yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw',
  asPublic: 'BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8',
  uaPublic: 'BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4',
  salt: 'DGv6ra1nlYgDCS1FRnbzlw',
  auth: 'BTBZMqHH6r4Tts7J_aSIgg',
  body: 'DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN',
};

test('encrypts the RFC 8291 example byte for byte', async () => {
  const asPublic = b64urlToBytes(RFC.asPublic);
  const privateKey = await crypto.subtle.importKey(
    'jwk', p256Jwk(asPublic, b64urlToBytes(RFC.asPrivate)),
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'],
  );
  const publicKey = await crypto.subtle.importKey(
    'raw', asPublic, { name: 'ECDH', namedCurve: 'P-256' }, true, [],
  );
  const body = await encryptPushPayload(
    new TextEncoder().encode(RFC.plaintext),
    { p256dh: RFC.uaPublic, auth: RFC.auth },
    { salt: b64urlToBytes(RFC.salt), serverKeys: { privateKey, publicKey } },
  );
  assert.equal(bytesToB64url(body), RFC.body);
});

test('signs a VAPID token the public key verifies', async () => {
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']) as CryptoKeyPair;
  const publicRaw = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey) as ArrayBuffer);
  const jwk = await crypto.subtle.exportKey('jwk', pair.privateKey);
  const keys = { subject: 'mailto:hello@whagons.com', publicKey: bytesToB64url(publicRaw), privateKey: jwk.d! };

  const now = Date.UTC(2026, 10, 9);
  const header = await vapidAuthorization('https://fcm.googleapis.com/fcm/send/abc', keys, now);
  const match = header.match(/^vapid t=([^.]+)\.([^.]+)\.([^,]+), k=(.+)$/);
  assert.ok(match, header);
  const [, head, claims, signature, k] = match;
  assert.equal(k, keys.publicKey);
  assert.deepEqual(JSON.parse(new TextDecoder().decode(b64urlToBytes(claims))), {
    aud: 'https://fcm.googleapis.com',
    exp: now / 1000 + 12 * 3600,
    sub: 'mailto:hello@whagons.com',
  });
  const valid = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' }, pair.publicKey,
    b64urlToBytes(signature), new TextEncoder().encode(`${head}.${claims}`),
  );
  assert.equal(valid, true);
});
