/**
 * What Rufo knows: the text of the site's own public pages, read from this
 * server through the sitemap. It always matches what visitors can read, with
 * nothing to keep in sync by hand. Built on first use and kept in memory for
 * a few hours (a redeploy starts fresh).
 *
 * Only pages in the sitemap are read, so unlisted pages (pricing, client
 * proposals, client sites) never reach Rufo.
 */

const REFRESH_MS = 6 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const CONCURRENCY = 6;
// Forms and index pages add nothing a visitor could ask about. Blog and news
// posts and the legal pages are read in English only (each has a Spanish
// twin, and Rufo answers in the visitor's language anyway). The legal pages
// stay in, so Rufo can answer questions about data and security.
const SKIP = [
  /^\/(es|en)\/demo$/,
  /^\/(es|en)\/(blog|novedades|whats-new)$/,
  /^\/es\/(blog|novedades)\//,
  /^\/es\/(terms|privacy|data-retention|security)$/,
];

let cache: { text: string; pages: number; builtAt: number } | null = null;
let building: Promise<{ text: string; pages: number; builtAt: number }> | null = null;

/** The server's own address, so pages are read without leaving the machine. */
export function internalOrigin(): string {
  const configured = process.env.RUFO_SITE_ORIGIN?.trim();
  if (configured) return configured.replace(/\/$/, '');
  return `http://127.0.0.1:${process.env.PORT || 3000}`;
}

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', laquo: '«', raquo: '»',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…', middot: '·',
};

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

// Removes every element whose opening tag matches `open`, with everything
// inside it (nested elements of the same name included).
function dropElements(html: string, open: RegExp): string {
  let out = html;
  for (let guard = 0; guard < 500; guard++) {
    const m = open.exec(out);
    if (!m) break;
    const tag = m[1].toLowerCase();
    const from = m.index;
    let depth = 0;
    let end = -1;
    const re = new RegExp(`<(/?)${tag}\\b[^>]*?(/?)>`, 'gi');
    re.lastIndex = from;
    for (let t = re.exec(out); t; t = re.exec(out)) {
      if (t[2] === '/') continue; // self-closing
      depth += t[1] ? -1 : 1;
      if (depth === 0) {
        end = re.lastIndex;
        break;
      }
    }
    out = out.slice(0, from) + ' ' + (end > 0 ? out.slice(end) : out.slice(from + m[0].length));
  }
  return out;
}

/** The readable text of a page's main content, headings marked with #. */
export function pageText(html: string): { title: string; text: string } {
  const title = decode((html.match(/<title>([^<]*)<\/title>/i)?.[1] || '').trim());
  let body = html;
  const start = body.search(/<[^>]*id="page-content"[^>]*>/);
  if (start >= 0) body = body.slice(body.indexOf('>', start) + 1);
  const end = body.search(/<footer[\s>]/i);
  if (end >= 0) body = body.slice(0, end);
  // Decorative demos and pickers are hidden from assistive tech; they are
  // example data, not facts about Whagons.
  body = body.replace(/<(script|style|svg|noscript|template|video|canvas|select|button)[\s\S]*?<\/\1>/gi, ' ');
  body = dropElements(body, /<([a-z][a-z0-9]*)\b[^>]*\baria-hidden="true"[^>]*>/i);
  body = body
    .replace(/<h([1-4])[^>]*>/gi, (_, level: string) => `\n${'#'.repeat(Number(level) + 1)} `)
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<(br|hr)\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|article|h[1-6]|li|ul|ol|tr|table|blockquote|figcaption|dt|dd)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  const lines: string[] = [];
  for (const raw of decode(body).split('\n')) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line || line === '-' || /^#+$/.test(line)) continue;
    if (lines[lines.length - 1] === line) continue;
    lines.push(line);
  }
  return { title, text: lines.join('\n') };
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'WhagonsRufoKnowledge/1.0', 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function build() {
  const origin = internalOrigin();
  const sitemap = (await fetchText(`${origin}/sitemap.xml`)) || '';
  const paths = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
    .map((m) => {
      try {
        return new URL(decode(m[1])).pathname;
      } catch {
        return '';
      }
    })
    .filter((p) => p && /^\/(es|en)(\/|$)/.test(p) && !SKIP.some((re) => re.test(p)));

  const unique = Array.from(new Set(paths));
  const sections: string[] = new Array(unique.length).fill('');
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < unique.length) {
        const i = next++;
        const path = unique[i];
        const html = await fetchText(`${origin}${path}`);
        if (!html) continue;
        const { title, text } = pageText(html);
        if (text.length < 80) continue;
        sections[i] = `<page url="https://whagons.com${path}" title="${title.replace(/"/g, "'")}">\n${text}\n</page>`;
      }
    })
  );
  const kept = sections.filter(Boolean);
  return { text: kept.join('\n\n'), pages: kept.length, builtAt: Date.now() };
}

/** The site's pages as text, built once and refreshed every few hours. */
export async function siteKnowledge() {
  if (cache && Date.now() - cache.builtAt < REFRESH_MS) return cache;
  if (!building) {
    building = build()
      .then((result) => {
        // An empty build (server still starting) is not cached.
        if (result.pages > 0) cache = result;
        return result;
      })
      .finally(() => {
        building = null;
      });
  }
  const result = await building;
  return result.pages > 0 ? result : cache ?? result;
}
