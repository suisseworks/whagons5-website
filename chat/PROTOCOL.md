# Whagons chat protocol

The chat service runs at `https://chat.whagons.com` (a Cloudflare Worker, see
`chat/`). In local development it runs at `http://localhost:8787`.

Two kinds of client talk to it:

- the **visitor widget** on whagons.com (`app/components/chat/`), cross-origin;
- the **team inbox** at `chat.whagons.com/` itself, same-origin, signed in.

All bodies are JSON. All times are epoch milliseconds.

## Shared types

```ts
type Message = {
  id: string;
  from: 'visitor' | 'agent';
  text: string;          // plain text, at most 2000 characters
  at: number;
  name?: string;         // agent display name, on agent messages
  clientId?: string;     // echoed back to the sender so it can match its pending copy
};
```

## Visitor

Allowed origins: `https://whagons.com`, `https://www.whagons.com`, and in
development `http://localhost:3000`. Requests from other origins are refused.

### Start a conversation

`POST /api/v/conversations`

```json
{ "text": "Hi, do you work with hostels?", "lang": "en", "page": "/en/pricing", "clientId": "c1", "website": "" }
```

`website` is a honeypot and must be empty. `lang` is `es` or `en`.

`201` →

```json
{ "id": "…", "token": "…", "messages": [Message] }
```

The widget stores `{ id, token }` in `localStorage` under `whagons-chat`
and keeps using the same conversation on later pages and visits.

Errors: `400 { "error": "invalid" }`, `403 { "error": "origin" }`,
`429 { "error": "rate_limited" }`.

### Live connection

`GET /api/v/ws?id=<id>&token=<token>` upgraded to a WebSocket.
A wrong id or token closes the socket with code `4401`; a conversation that
no longer exists closes it with `4404`. The widget then forgets the stored
conversation.

The literal text frame `ping` is answered with `pong` (send one every 30 s).

Server → widget:

| Frame | Meaning |
|---|---|
| `{ "type": "snapshot", "messages": [Message], "agent": { "name": "Ana" } \| null, "email": string \| null, "askEmail": boolean }` | Sent on connect. `agent` is the person who has taken the chat. `askEmail` is true when nobody has answered for 2 minutes and no email is stored yet. |
| `{ "type": "message", "message": Message }` | A new message, including the visitor's own (with its `clientId`). |
| `{ "type": "agent", "agent": { "name": "Ana" } }` | Someone from the team took the chat. |
| `{ "type": "typing" }` | An agent is typing. Show for ~4 s. |
| `{ "type": "ask_email" }` | Nobody answered within 2 minutes; show the email form. |
| `{ "type": "contact_saved", "email": "…" }` | The visitor's email was stored. |
| `{ "type": "error", "error": "rate_limited" \| "invalid" }` | The last frame was refused. |

Widget → server:

| Frame | Meaning |
|---|---|
| `{ "type": "message", "text": "…", "clientId": "…" }` | Send a message. |
| `{ "type": "typing" }` | The visitor is typing (send at most every 3 s). |
| `{ "type": "contact", "email": "…", "name": "…" }` | Store an email (required) and name (optional) so the team can reply by email. |
| `{ "type": "seen" }` | The visitor has the chat open and has seen the latest messages. |

When an agent replies and the visitor is not connected, the service waits one
minute and then emails the unseen replies to the stored email, if there is one.

## Team inbox

Same-origin only (the `Origin` header must be the chat service's own). The
session is an `HttpOnly` cookie.

| Request | Purpose |
|---|---|
| `POST /api/a/login { email }` | Emails a 6-digit code and a sign-in link to allowed addresses. Always `200`. |
| `POST /api/a/verify { email, code }` | Signs in. `200 { me }` or `401`. |
| `GET /auth?e=&c=` | The emailed sign-in link. Signs in and redirects to `/`. |
| `POST /api/a/logout` | Signs out. |
| `GET /api/a/me` / `POST /api/a/me { name }` | Read or set the display name visitors see. |
| `GET /api/a/push` | `{ publicKey }` for Web Push. |
| `POST /api/a/push { subscription }` / `DELETE /api/a/push { endpoint }` | Turn phone notifications on or off. |
| `POST /api/a/push/test` | Send a test notification to this device. |
| `GET /api/a/ws` | Inbox WebSocket (frames are defined in `chat/src/hub.ts`). |
