// chat.whagons.com
//   /api/v/*   the visitor widget on whagons.com (cross-origin, allow-listed)
//   /api/a/*   the team inbox (same-origin, signed in)
//   /auth      the sign-in link from the email
//   anything else is the inbox web app in public/

import { json, list, type ChatEnv } from './util.ts';

export { Hub } from './hub.ts';

function hub(request: Request, env: ChatEnv): Promise<Response> {
  const headers = new Headers(request.headers);
  const cf = (request as Request & { cf?: { country?: string; city?: string } }).cf;
  headers.set('x-chat-ip', request.headers.get('cf-connecting-ip') || '');
  headers.set('x-chat-country', cf?.country && cf.country !== 'XX' && cf.country !== 'T1' ? cf.country : '');
  headers.set('x-chat-city', encodeURIComponent(cf?.city || ''));
  const stub = env.HUB.get(env.HUB.idFromName('hub'));
  return stub.fetch(new Request(request, { headers }));
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

async function visitorApi(request: Request, env: ChatEnv): Promise<Response> {
  const origin = request.headers.get('origin') || '';
  const allowed = list(env.ALLOWED_ORIGINS).includes(origin);
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: allowed ? 204 : 403, headers: allowed ? corsHeaders(origin) : {} });
  }
  if (!allowed) return json({ error: 'origin' }, { status: 403 });
  const response = await hub(request, env);
  if (response.status === 101) return response;
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(origin))) headers.set(key, value);
  return new Response(response.body, { status: response.status, headers });
}

async function teamApi(request: Request, env: ChatEnv, url: URL): Promise<Response> {
  // Cookies ride along on cross-site requests and WebSockets, so anything that
  // is not a plain read must come from the inbox itself.
  const isUpgrade = request.headers.get('upgrade')?.toLowerCase() === 'websocket';
  if ((request.method !== 'GET' || isUpgrade) && url.pathname !== '/auth') {
    if (request.headers.get('origin') !== url.origin) return json({ error: 'origin' }, { status: 403 });
  }
  return hub(request, env);
}

export default {
  async fetch(request: Request, env: ChatEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/v/')) return visitorApi(request, env);
    if (url.pathname.startsWith('/api/a/') || url.pathname === '/auth') return teamApi(request, env, url);
    if (url.pathname === '/healthz') return new Response('ok');
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<ChatEnv>;
