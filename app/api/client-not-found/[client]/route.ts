import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Unknown URLs under a static client site get that site's own 404.html, with a
// real 404 status. Reached only through the fallback rewrite in next.config.js.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { client: string } }) {
  if (/^[a-z0-9-]+$/.test(params.client)) {
    try {
      const html = await readFile(path.join(process.cwd(), 'public', 'clients', params.client, '404.html'));
      return new Response(html, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
    } catch {
      // No branded page for this client.
    }
  }
  return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
