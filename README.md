# Whagons Website

Hotel-first, bilingual marketing site for Whagons 5, built with Next.js 14 and the App Router.

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. English and Spanish pages live under `/en` and `/es`. Retired language URLs permanently redirect to equivalent English paths; their translations and lead-routing configuration have been removed.

Demo copy lives in `app/lib/demo-offer.ts`; "Request a demo" is the primary button in the nav, the home hero and the home closing section. The free hotel evaluation copy (the secondary button in the home hero and closing section, and the page at `/en/evaluation` and `/es/evaluacion`) lives in `app/lib/free-evaluation.ts`. Both forms use the existing demo delivery flow. The retired pilot waitlist URLs (`/en/pilot`, `/es/piloto`) permanently redirect to the demo page in the same language. Testimonials link to their historical 2022 source with a notice that its commercial terms are not the current offer.

## Blog

Posts live in `content/blog/<lang>/<slug>.mdx` and render at `/<lang>/blog/<slug>`. The index is `/<lang>/blog`, with an RSS feed at `/<lang>/blog/rss.xml`. Pages are generated at build time; a new file needs a rebuild.

Frontmatter:

```yaml
title: Getting the most out of Work Plans
standfirst: One or two sentences under the title, also used as the meta description.
category: powerups        # powerups | guides | product
powerup: Work Plans       # optional, shown in the meta row
author: Whagons Team
date: 2026-09-25          # YYYY-MM-DD
translationKey: work-plans  # same value in the es and en files links the two
featured: true            # optional, pins the post to the top of the index
cover: /media/blog/en/work-plans-cover.jpg        # 4:3
coverVideo: /media/blog/en/work-plans-cover.mp4   # optional loop, cover is its poster
coverAlt: Short description of the cover
ogImage: /media/blog/en/work-plans-og.jpg         # 1200x630
draft: true               # optional, hidden unless BLOG_DRAFTS=1
```

Articles follow one structure: an intro paragraph, `## Try this first`, numbered `##` sections, `###` subsections with **What to do.**, **Why it matters.** and **How.**, and a closing checklist. Every `##` becomes a section in the contents rail.

In the body you can use:

- `<Video name="work-plans-schedule" fig="A" caption="..." label="..." />` for an animation from `public/media/blog/<lang>/`. `label` is the spoken description for screen readers.
- `<Figure src="/images/..." alt="..." fig="B" caption="..." />` for a still image.
- Fenced blocks with `message`, `label`, `naming`, `checklist` or `text` as the language. They render as a template with a copy button.
- `- [ ] item` task lists, which render as a checklist readers can tick.

## What's new / Novedades

Release notes live in `content/news/<lang>/<slug>.mdx` and render at `/en/whats-new/<slug>` and `/es/novedades/<slug>`. Each index (`/en/whats-new`, `/es/novedades`) has an RSS feed at `rss.xml` under it, announced with `<link rel="alternate" type="application/rss+xml">`. Release pages carry `NewsArticle` structured data and a breadcrumb; published releases go in the sitemap.

```yaml
title: "Work Plans: recurring routines that create their own tasks"
summary: One or two sentences, also the meta description and RSS description.
date: 2026-11-09            # YYYY-MM-DD
translationKey: work-plans-release   # same value in the es and en files
tag: Powerup                # optional label above the title
screenshot: /images/...     # optional, 16:10; drafts show a placeholder slot
screenshotAlt: ...
ogImage: /media/...         # optional 1200x630, falls back to the screenshot
draft: true                 # hidden unless NEWS_DRAFTS=1
reviewNotes:                # optional, shown on draft previews only
  - Confirm the release date
```

While a language has no published release the section does not exist there: the index, feed and release pages 404, nothing is added to the sitemap, and the footer and blog index links are not rendered (`newsLangs.js`, read by `next.config.js` at build time). Preview drafts with `NEWS_DRAFTS=1 pnpm build && NEWS_DRAFTS=1 pnpm start`; draft pages are `noindex` and never enter the sitemap.

## Blog animations

The animations in the articles are rendered from code in `scripts/blog-media/`. Each scene is a small HTML/JS module drawn frame by frame in headless Chrome and encoded with ffmpeg, once per language.

```bash
pnpm blog:media                       # every scene, es + en
pnpm blog:media work-plans --lang es  # scenes whose id contains "work-plans"
pnpm blog:media cleaning-board --frames 0,4000   # review stills in .media-preview/
```

The home page's "Whagons en acción" section plays `work-plans-schedule`, `cleaning-board` and `kpi-cards-template` from the same folder, so re-render those when the product screens change.

It needs ffmpeg and Chrome or Chromium; set `CHROME_PATH` if Chrome is not found. Output goes to `public/media/blog/<lang>/<group>-<scene>.mp4` with a `.jpg` poster. See `scripts/blog-media/README.md` for the scene format.

## Lead delivery

The homepage brief and demo forms post to `/api/flodesk`. The server:

1. validates and sanitizes the submission;
2. sends it to Flodesk through the fixed official API endpoint;
3. assigns demo leads to `Whagons-Demo-EN` or `Whagons-Demo-ES` according to the page language, and brief leads to `Whagons5-Brief`;
4. for demo requests, sends one internal email to both `hello@whagons.com` and `business@whagons.com` when Resend is configured.

The free evaluation page sends the demo form with `source: 'free-evaluation'`. A request is handled exactly like a demo request (same required fields, same language segment, same two recipients). Only the internal email changes: its subject is `[Whagons] Free hotel evaluation - <company>` and its first line is `Source: Free hotel evaluation`.

Flodesk and email are independent delivery channels. A temporary email failure does not discard a lead already captured in Flodesk, and an internal email can preserve a demo request if Flodesk is temporarily unavailable. The visitor only sees an error when every applicable delivery channel fails.

The route uses bounded timeouts, one retry for transient failures, a honeypot, basic per-IP throttling, safe request IDs, and logs that omit lead data and credentials. Upstream subscriber and email-provider responses are never returned to the browser.

See [DEMO_REQUEST_SETUP.md](./DEMO_REQUEST_SETUP.md) for production setup and verification.

## Environment variables

```env
# Required for Flodesk lead capture
FLODESK_API_KEY=

# Recommended in production to avoid a segment lookup during a cold start
FLODESK_SEGMENT_DEMO_EN_ID=
FLODESK_SEGMENT_DEMO_ES_ID=
FLODESK_SEGMENT_BRIEF_ID=

# Required for internal demo-request email notifications
RESEND_API_KEY=
DEMO_NOTIFICATION_FROM=Whagons Website <website@notify.whagons.com>

# Required before publishing the U.S. hospitality scan form
FLODESK_SEGMENT_HANDOFF_SCAN_ID=
WHAGONS_US_SCAN_OWNER=
```

`FLODESK_API_URL` is intentionally unsupported. All Flodesk traffic is pinned to `https://api.flodesk.com` so a stale or recursive deployment value cannot break the form.

If the shared segment IDs are omitted, the server resolves these exact names and caches the result:

- `Whagons-Demo-EN`
- `Whagons-Demo-ES`
- `Whagons5-Brief`

The language-specific demo segment IDs are optional but recommended in production. The server uses the exact names above when those IDs are omitted.

## Quality checks

```bash
pnpm test
pnpm lint
pnpm build
```

## Production

The Docker image uses Node 22 and the Next.js standalone server. Secrets are runtime environment variables and must not be copied into the image or committed. Recreate the container after changing an environment variable.
