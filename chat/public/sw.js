// Whagons Chat service worker: shows push notifications and opens the inbox
// at the right conversation when one is tapped.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil((async () => {
    if (typeof data.badge === 'number' && self.navigator.setAppBadge) {
      try {
        if (data.badge > 0) await self.navigator.setAppBadge(data.badge);
        else await self.navigator.clearAppBadge();
      } catch { /* not supported */ }
    }
    await self.registration.showNotification(data.title || 'Whagons Chat', {
      body: data.body || 'New message',
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      icon: '/icon-192.png',
      badge: '/badge-96.png',
      data: { url: data.url || '/' },
    });
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if (new URL(client.url).origin !== self.location.origin) continue;
      await client.focus();
      client.postMessage({ type: 'open', url });
      return;
    }
    await self.clients.openWindow(url);
  })());
});

// The browser rotated the subscription: register the new one.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil((async () => {
    const response = await fetch('/api/a/push', { credentials: 'same-origin' });
    if (!response.ok) return;
    const { publicKey } = await response.json();
    if (!publicKey) return;
    const base64 = publicKey.replace(/-/g, '+').replace(/_/g, '/');
    const key = Uint8Array.from(atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4)), (c) => c.charCodeAt(0));
    const sub = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
    await fetch('/api/a/push', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
  })());
});
