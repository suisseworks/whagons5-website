# Demo request setup

The public form is available at `/en/demo` and `/es/demo`. It captures name, hotel/company, email, optional phone, industry, team size, language, and country when the edge provides a country header.

The pilot waitlist at `/en/pilot` and `/es/piloto` is the same form with different copy. It needs no extra settings: signups use the same segments and recipients below, and the internal email's subject reads `[Whagons] Pilot waitlist - <company>` instead of `[Whagons] New demo request - <company>`.

## 1. Flodesk

Configure the production runtime with:

```env
FLODESK_API_KEY=your_server_side_key
FLODESK_SEGMENT_DEMO_EN_ID=the_id_for_Whagons-Demo-EN
FLODESK_SEGMENT_DEMO_ES_ID=the_id_for_Whagons-Demo-ES
FLODESK_SEGMENT_BRIEF_ID=the_id_for_Whagons5-Brief
```

The IDs are recommended for the shortest cold-start path. If omitted, the server searches for the exact segment names `Whagons-Demo-EN`, `Whagons-Demo-ES`, and `Whagons5-Brief` with a short timeout, then caches the result. English demo requests go only to the English segment; Spanish demo requests go only to the Spanish segment.

Do not configure `FLODESK_API_URL`; the server always uses Flodesk's official HTTPS API. Keep all credentials in the deployment platform's secret store and recreate the running container after a change.

## 2. Internal email notifications

Create a Resend API key with sending-only access restricted to a verified subdomain such as `notify.whagons.com`. Verifying that subdomain does not change the Microsoft 365 MX records used by `whagons.com`.

Configure:

```env
RESEND_API_KEY=your_server_side_sending_key
DEMO_NOTIFICATION_FROM=Whagons Website <website@notify.whagons.com>
```

Every demo request produces one message addressed to both:

- `hello@whagons.com`
- `business@whagons.com`

The prospect's email is set as `Reply-To`. Recipients are fixed in server code and cannot be changed by form input.

## 3. Verification

After deployment:

1. submit a uniquely tagged address you control through `/en/demo`;
2. confirm the page displays the success message;
3. confirm the contact is in `Whagons-Demo-EN` or `Whagons-Demo-ES`, matching the page language;
4. confirm the same notification arrived at both internal addresses;
5. reply to the notification and confirm it targets the prospect address;
6. check server logs using the returned request ID if either delivery is missing;
7. repeat steps 1 to 4 through `/en/pilot` and confirm the notification subject starts with `[Whagons] Pilot waitlist`.

Automated tests can be run with `pnpm test`. They mock both providers and never create a real subscriber or send a real email.

## 4. Cronus client site forms

The Cronus review site at `/clients/cronus2` has two forms. Both use the same `RESEND_API_KEY` and send from the `DEMO_NOTIFICATION_FROM` address under the name "Cronus Website". Set `CRONUS_CONTACT_FROM` to use a different sender. Recipients are fixed in code, so form input can't change where messages go.

**Contact form.** It posts JSON to `/api/cronus-contact`.
- Each message goes to `info@cronustec.com` (`app/lib/cronus-contact.mjs`), with the visitor's email as `Reply-To`.
- After that, the visitor gets a short confirmation. It's fixed text that repeats nothing they typed, so the form can't be used to send someone else a message.
- Limits: five requests per visitor every ten minutes, 16 KB per request.

**Careers form.** It posts `multipart/form-data` to `/api/cronus-careers`.
- Each application goes to `careers@cronustec.com` (`app/lib/cronus-careers.mjs`) with the résumé attached and the applicant as `Reply-To`, followed by a confirmation to the applicant.
- Résumés must be PDF, DOC or DOCX, checked by their contents and not only their name, and no larger than 5 MB.
- Limit: three applications per visitor every 30 minutes.

**Rules for both forms.**
- Requests are accepted only from whagons.com pages.
- Only `POST` is answered; anything else gets 405.
- Bot submissions that fill the hidden `website` field are quietly accepted and dropped.

**Optional settings:**

| Variable | What it does |
| --- | --- |
| `CRONUS_CONTACT_BACKUP_TO` | Comma-separated addresses that get a blind copy of every contact message. |
| `CRONUS_CAREERS_BACKUP_TO` | The same for applications. |
| `CRONUS_TURNSTILE_SECRET` | Turns on Cloudflare Turnstile checks. Set it together with the site key (`turnstileSiteKey` in the Cronus site's `site.json`, preview profile), then rebuild the site. Without it the check is skipped. |

The site itself is built from matas432/cronus-website:

```sh
python3 tools/build.py --profile preview --out <this repo>/public/clients/cronus2
```

`next.config.js` gives it:
- the site's Content-Security-Policy
- `X-Robots-Tag: noindex`
- year-long caching for its hashed CSS and JS

The middleware sends unknown page paths under it to the site's own `404.html`, through `/api/client-not-found/cronus2`, with a real 404 status. The middleware gets the list of known pages from `next.config.js`, which reads it from `public/` at build time.

## 5. Cronus project checklist

The review site has a Next steps page at `/clients/cronus2/next-steps`. It shows where the build stands and what Cronus still owes, and the team can comment on any item. The page is built only for the preview profile, never for Cronus's live site. Its statuses come from `content/checklist.json` in matas432/cronus-website, so a status change is an edit there plus a rebuild.

**Comments.** They're stored as GitHub issue comments in the private matas432/cronus-website repository (`app/lib/cronus-checklist.mjs`, `/api/cronus-checklist`).
- Each item gets one issue, titled `Checklist: <item id>` and labelled `checklist`, created on its first comment.
- A comment posted from the page carries its author's name, and replies written on GitHub show on the page too.
- Reading and posting both need the shared access code, sent in the `X-Checklist-Code` header. An address that sends 10 wrong codes is blocked for 15 minutes.
- Listings are cached for 30 seconds.
- Limits: 20 comments per visitor every 10 minutes, 80 characters for a name and 4,000 for a comment.

**Settings:**

| Variable | What it does |
| --- | --- |
| `CRONUS_CHECKLIST_GITHUB_TOKEN` | Required. A fine-grained GitHub token with **Issues: read and write** on matas432/cronus-website only. |
| `CRONUS_CHECKLIST_CODE` | Required. The access code the Cronus team types on the page. Change it to revoke access. |
| `CRONUS_CHECKLIST_REPO` | Optional. `owner/name` of another repository to store comments in. |

Without both required settings, the page still shows the checklist and says comments aren't switched on yet.
