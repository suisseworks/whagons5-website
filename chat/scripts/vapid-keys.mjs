// Prints a new VAPID key pair for Web Push.
//   VAPID_PUBLIC_KEY  goes in wrangler.jsonc "vars"
//   VAPID_PRIVATE_KEY goes in a secret: pnpm wrangler secret put VAPID_PRIVATE_KEY
// Changing the pair signs every device out of notifications; they turn them on again.

const toB64url = (bytes) => Buffer.from(bytes).toString('base64url');

const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const publicKey = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
const { d } = await crypto.subtle.exportKey('jwk', pair.privateKey);

console.log(`VAPID_PUBLIC_KEY=${toB64url(publicKey)}`);
console.log(`VAPID_PRIVATE_KEY=${d}`);
