import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

// Comments on the Cronus project checklist (/clients/cronus2/next-steps). Each
// checklist item gets one GitHub issue, labelled "checklist", in the private
// site repository; a comment on the page is a comment on that issue. Replies
// written on GitHub show on the page too. Reading and posting both need the
// shared access code in CRONUS_CHECKLIST_CODE.

export const CHECKLIST_LABEL = 'checklist';
export const DEFAULT_CHECKLIST_REPO = 'matas432/cronus-website';
export const GITHUB_API = 'https://api.github.com';
export const CHECKLIST_LIMITS = Object.freeze({ name: 80, body: 4000 });

const ITEM_ID = /^[a-z0-9-]{1,48}$/;
const REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const TITLE = /^Checklist: ([a-z0-9-]{1,48})$/;
const AUTHOR_MARK = /^<!-- checklist-author: ([^\n]{1,80}) -->\n/;
const SALT = randomBytes(32);

const oneLine = (value) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '');

// Compares the code a visitor sent with the configured one in constant time.
// An empty configured code never matches, so the feature stays off until it's set.
export function codeMatches(expected, given) {
  if (typeof expected !== 'string' || !expected.trim() || typeof given !== 'string' || !given) return false;
  const a = createHash('sha256').update(expected.trim()).digest();
  const b = createHash('sha256').update(given.trim()).digest();
  return timingSafeEqual(a, b);
}

export function checklistRepo(env = {}) {
  const repo = oneLine(env.CRONUS_CHECKLIST_REPO) || DEFAULT_CHECKLIST_REPO;
  return REPO.test(repo) ? repo : DEFAULT_CHECKLIST_REPO;
}

// Returns { ok: true, comment } or { ok: false, code }, where code is 'SPAM'
// (honeypot filled; answer as if it worked) or 'INVALID'.
export function validateChecklistComment(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, code: 'INVALID' };
  if (oneLine(body.website)) return { ok: false, code: 'SPAM' };
  const comment = {
    item: oneLine(body.item),
    // The name goes inside an HTML comment on GitHub, so it can't carry the closing marker.
    name: oneLine(body.name).replace(/-->|<!--/g, '').trim(),
    body: typeof body.body === 'string' ? body.body.replace(/\r\n?/g, '\n').trim() : '',
  };
  if (!ITEM_ID.test(comment.item) || !comment.name || !comment.body) return { ok: false, code: 'INVALID' };
  if (comment.name.length > CHECKLIST_LIMITS.name || comment.body.length > CHECKLIST_LIMITS.body) return { ok: false, code: 'INVALID' };
  return { ok: true, comment };
}

export const issueTitle = (item) => `Checklist: ${item}`;

export function itemFromTitle(title) {
  return typeof title === 'string' ? title.match(TITLE)?.[1] || null : null;
}

const signature = (name) => `\n\n— ${name}, on the project checklist page`;

export function commentMarkdown({ name, body }) {
  return `<!-- checklist-author: ${name} -->\n${body}${signature(name)}`;
}

// A GitHub comment as the page shows it. Comments posted from the page carry
// their author's name; ones written on GitHub show the GitHub login.
export function toPageComment(gh) {
  const raw = typeof gh?.body === 'string' ? gh.body.replace(/\r\n?/g, '\n') : '';
  const mark = raw.match(AUTHOR_MARK);
  let author = gh?.user?.login || 'GitHub';
  let body = raw;
  if (mark) {
    author = mark[1];
    body = raw.slice(mark[0].length);
    if (body.endsWith(signature(author))) body = body.slice(0, -signature(author).length);
  }
  return { id: gh?.id, author, body: body.trim(), at: gh?.created_at || '' };
}

export class ChecklistError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Reads and writes the checklist issues. Listing is cached for `ttlMs`, so
// page loads don't each cost GitHub API calls.
export function createChecklistStore({ token, repo, fetchImpl = fetch, ttlMs = 30_000, now = Date.now, timeoutMs = 10_000 }) {
  let cache = null; // { at, issues: Map<item, number>, items: Record<item, comment[]> }
  let loading = null;
  const creating = new Map();

  async function gh(path, init = {}) {
    const res = await fetchImpl(`${GITHUB_API}${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Whagons Website (whagons.com)',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new ChecklistError(`GitHub ${init.method || 'GET'} ${path.split('?')[0]} answered ${res.status}`, res.status);
    return res.json();
  }

  async function paged(path) {
    const out = [];
    for (let page = 1; page <= 10; page += 1) {
      const batch = await gh(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
      if (!Array.isArray(batch)) break;
      out.push(...batch);
      if (batch.length < 100) break;
    }
    return out;
  }

  async function refresh() {
    const issues = await paged(`/repos/${repo}/issues?labels=${CHECKLIST_LABEL}&state=all&sort=created&direction=asc`);
    const numbers = new Map();
    for (const issue of issues) {
      const item = itemFromTitle(issue.title);
      if (item && !issue.pull_request && !numbers.has(item)) numbers.set(item, { number: issue.number, count: issue.comments || 0 });
    }
    const items = {};
    await Promise.all([...numbers].filter(([, v]) => v.count > 0).map(async ([item, v]) => {
      const list = await paged(`/repos/${repo}/issues/${v.number}/comments`);
      items[item] = list.map(toPageComment);
    }));
    cache = { at: now(), issues: new Map([...numbers].map(([k, v]) => [k, v.number])), items };
    return cache;
  }

  async function load() {
    if (cache && now() - cache.at < ttlMs) return cache;
    if (!loading) loading = refresh().finally(() => { loading = null; });
    return loading;
  }

  async function issueFor(item) {
    const state = await load();
    if (state.issues.has(item)) return state.issues.get(item);
    // Two people commenting on a new item at once still get one issue.
    if (!creating.has(item)) {
      creating.set(item, gh(`/repos/${repo}/issues`, {
        method: 'POST',
        body: JSON.stringify({
          title: issueTitle(item),
          labels: [CHECKLIST_LABEL],
          body: `Comments on the checklist item \`${item}\` from the Cronus review site (whagons.com/clients/cronus2/next-steps#item-${item}). Replies written here show on the page too.`,
        }),
      }).then((issue) => {
        state.issues.set(item, issue.number);
        return issue.number;
      }).finally(() => creating.delete(item)));
    }
    return creating.get(item);
  }

  return {
    async list() {
      const state = await load();
      return { items: state.items };
    },
    async add({ item, name, body }) {
      const number = await issueFor(item);
      const created = await gh(`/repos/${repo}/issues/${number}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body: commentMarkdown({ name, body }) }),
      });
      const comment = toPageComment(created);
      if (cache) cache.items[item] = [...(cache.items[item] || []), comment];
      return comment;
    },
  };
}

// Blocks an address after too many wrong codes, so the code can't be guessed.
// Unlike a plain rate limit, a blocked address can't test codes at all until
// the window ends.
export function createCodeGate(windowMs = 15 * 60 * 1000, maxFailures = 10, maxBuckets = 5000) {
  const buckets = new Map();
  const keyOf = (address) => createHash('sha256').update(SALT).update(String(address)).digest('hex').slice(0, 32);
  return {
    windowSeconds: Math.round(windowMs / 1000),
    blocked(address, at = Date.now()) {
      if (!address) return false;
      const b = buckets.get(keyOf(address));
      return Boolean(b && at < b.resetAt && b.count >= maxFailures);
    },
    fail(address, at = Date.now()) {
      if (!address) return;
      const key = keyOf(address);
      const b = buckets.get(key);
      if (!b || at >= b.resetAt) {
        if (!b && buckets.size >= maxBuckets) buckets.delete(buckets.keys().next().value);
        buckets.set(key, { count: 1, resetAt: at + windowMs });
      } else {
        b.count += 1;
      }
    },
  };
}
