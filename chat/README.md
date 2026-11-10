# Whagons Chat

Live chat for whagons.com. Visitors write from the chat bubble on the site
(`app/components/chat/ChatWidget.tsx`); the team answers from the inbox at
**https://chat.whagons.com**, which installs on a phone like an app and sends
push notifications.

It is a Cloudflare Worker with one Durable Object (`src/hub.ts`) that stores
the conversations in SQLite and relays messages over WebSockets. It deploys
separately from the website; the website's Docker build ignores this folder.
The wire protocol is in [PROTOCOL.md](./PROTOCOL.md).

## How it behaves

- A visitor's first message opens a conversation. Everyone on the team gets a
  push notification; whoever answers first takes the chat, and the visitor sees
  their name.
- If nobody answers within 2 minutes, the visitor is asked for an email and
  `ALERT_EMAILS` gets an email with the conversation.
- If the visitor has left an email and leaves the page, replies they have not
  seen are emailed to them a minute later. Replying to that email goes to the
  person who answered.
- Conversations are deleted automatically 12 months after the last message
  (`RETENTION_DAYS`). The team can delete one sooner from the inbox.

## Who can answer

The addresses in `AGENT_EMAILS` (`wrangler.jsonc`). Each person signs in at
chat.whagons.com with a 6-digit code sent to their email, then picks the name
visitors see. To add someone, add their address and deploy.

**Notifications on iPhone:** open chat.whagons.com in Safari, tap Share →
Add to Home Screen, open Whagons Chat from the home screen, sign in, and tap
"Turn on notifications". On Android and desktop Chrome, the button works
straight from the browser.

## Local development

```bash
cd chat
pnpm install
pnpm dev                 # http://localhost:8787, uses .dev.vars
```

`.dev.vars` (not committed):

```env
DEV=1
ALLOWED_ORIGINS=http://localhost:3000,https://whagons.com
PUBLIC_URL=http://localhost:8787
SITE_URL=http://localhost:3000
```

With `DEV=1` and no `RESEND_API_KEY`, sign-in codes and emails are printed in
the terminal instead of sent. Run the website against it with
`NEXT_PUBLIC_CHAT_URL=http://localhost:8787 pnpm dev` from the repository root.

```bash
pnpm typecheck
pnpm test                # push encryption against the RFC 8291 example
```

## Deploy

Needs a Cloudflare login for the account that owns whagons.com
(`wrangler login`, or `CLOUDFLARE_API_TOKEN` with Workers and DNS edit rights).

First time only:

```bash
pnpm vapid                                   # prints a key pair
# put VAPID_PUBLIC_KEY in wrangler.jsonc "vars", then:
pnpm wrangler secret put VAPID_PRIVATE_KEY   # paste the private key
pnpm wrangler secret put RESEND_API_KEY      # the website's Resend key works (notify.whagons.com is verified)
```

Then, and for every change:

```bash
pnpm deploy
```

The custom domain `chat.whagons.com` is created on the first deploy. It fails if
a DNS record for `chat` already exists; delete that record first.
