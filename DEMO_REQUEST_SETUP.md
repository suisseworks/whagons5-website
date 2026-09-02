# Demo request setup

The public form is available at `/en/demo` and `/es/demo`. It captures name, hotel/company, email, optional phone, industry, team size, language, and country when the edge provides a country header.

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
6. check server logs using the returned request ID if either delivery is missing.

Automated tests can be run with `pnpm test`. They mock both providers and never create a real subscriber or send a real email.
