# Whagons Website

Hotel-first, bilingual marketing site for Whagons 5, built with Next.js 14 and the App Router.

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. English and Spanish pages live under `/en` and `/es`. Retired language URLs permanently redirect to equivalent English paths; their translations and lead-routing configuration have been removed.

The home and demo pages share the 20-minute operational diagnostic offer in `app/lib/demo-offer.ts`. Requests continue through the existing demo delivery flow. Testimonials link to their historical 2022 source with a notice that its commercial terms are not the current offer.

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

## Blog animations

The animations in the articles are rendered from code in `scripts/blog-media/`. Each scene is a small HTML/JS module drawn frame by frame in headless Chrome and encoded with ffmpeg, once per language.

```bash
pnpm blog:media                       # every scene, es + en
pnpm blog:media work-plans --lang es  # scenes whose id contains "work-plans"
pnpm blog:media cleaning-board --frames 0,4000   # review stills in .media-preview/
```

It needs ffmpeg and Chrome or Chromium; set `CHROME_PATH` if Chrome is not found. Output goes to `public/media/blog/<lang>/<group>-<scene>.mp4` with a `.jpg` poster. See `scripts/blog-media/README.md` for the scene format.

## Lead delivery

The homepage brief and demo forms post to `/api/flodesk`. The server:

1. validates and sanitizes the submission;
2. sends it to Flodesk through the fixed official API endpoint;
3. assigns demo leads to `Whagons-Demo-EN` or `Whagons-Demo-ES` according to the page language, and brief leads to `Whagons5-Brief`;
4. for demo requests, sends one internal email to both `hello@whagons.com` and `business@whagons.com` when Resend is configured.

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
