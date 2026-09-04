# Whagons Website

Hotel-first, bilingual marketing site for Whagons 5, built with Next.js 14 and the App Router.

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. English and Spanish pages live under `/en` and `/es`. Retired language URLs permanently redirect to equivalent English paths; their translations and lead-routing configuration have been removed. The site has no blog or editorial article routes.

The home and demo pages share the 20-minute operational diagnostic offer in `app/lib/demo-offer.ts`. Requests continue through the existing demo delivery flow. Testimonials link to their historical 2022 source with a notice that its commercial terms are not the current offer.

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
