# Website review, September 19, 2026

The review covers the website in Spanish and English, including the hidden pricing calculator and Hotel Parador proposal. All verification was performed locally. This review does not establish that the production site or live lead delivery works.

## Coverage and evidence

- All 25 canonical pages returned HTTP 200. Each had one main landmark, one H1, the expected document language and its own canonical URL.
- The source and HTTP crawl checked 569 internal links across 28 targets, their fragments, and 15 unique rendered image resources. No duplicate IDs or missing fragment targets were found. All image requests succeeded.
- The crawl found one broken destination, the historical `https://whagons.com/docs/Whagons-2022.pdf` testimonial source. Both homepage links to it were removed. The testimonial dates remain visible.
- All 25 pages were inspected at desktop and mobile widths. No horizontal overflow was found in those captures. Screenshot selection follows the active language.
- Existing tests: 48 passed. TypeScript and whitespace checks passed. The final production build passed, including the corrected screenshot dimensions and homepage spacing.
- Spanish and English missing-page routes were checked in the browser after hydration. Both show the localized heading, branded navigation and footer, and recovery links in the selected language.
- No live form submissions were sent. Keyboard checks and source review cover specific controls; this is not a full accessibility certification.

## Improvements applied

| Area | Change |
| --- | --- |
| Homepage | Replaced dense card grids with illustrated workflows and clearer feature rows. Corrected doubled desktop side spacing and anchor offsets beneath the fixed header. Removed the broken historical PDF link. |
| Features | Used open numbered sections and clearer hierarchy. |
| Industries | Replaced generic descriptions with concrete workflows and outcomes for each industry. |
| Screenshots | Matched all eight product images to the selected language, with current Hotel Premium captures and localized captions. Replaced a blank English board close-up after visual inspection and recaptured both analytics views around the readable metrics and status chart. |
| Pricing and Parador | Improved hierarchy, spacing and readability while preserving pricing behavior. |
| Demo | Identified the optional phone field and clarified the sending state. |
| Hotel score | Added an early email availability notice so local visitors can see the limitation before answering ten questions. |
| Shared navigation | Added a bilingual keyboard skip link that focuses the content container. |
| Metadata | Gave pricing and score pages their own localized social previews, removed the duplicated Whagons name in score titles, and translated the remaining English phrase in Spanish security metadata. |
| Legal pages | Pointed the demo CTA to the current demo page in each language. Legal substance was left unchanged. |
| Legacy handoff scan | Replaced internal routing language with a clear explanation of follow-up and added the privacy policy link. The Sacramento offer remains intact. |
| Missing pages | Added a bilingual branded 404 with links to the homepage and demo. Unknown URLs retain a 404 status and noindex; both languages were verified in the browser. |

## Decisions and validation still needed

1. **Validate real lead and email delivery before relying on the forms commercially.** Both local score availability endpoints return `captureAvailable: false`. The website now explains this early. Confirm the intended production configuration and recipients, then perform an authorized end-to-end submission for demo requests and score delivery. Read-only checks cannot establish that an email arrives. Also confirm staffing supports the existing one-business-day demo/contact response and 24-hour assessment delivery targets; successful email transport does not establish those commitments.
2. **Provide a current, verifiable testimonial source.** The quotes are attributed to a 2022 publication whose linked PDF is unavailable. Keep the date qualifier until an accessible original source or approved current testimonials are supplied. Do not imply the named people still hold those roles.
3. **Decide whether to retain the Sacramento handoff offer.** `/en/handoff-scan` is an English-only, publicly indexed offer with its own contact routing requirements. It remains accessible, but current legal-page CTAs now lead to the general demo. If the offer is no longer active, retire it with a redirect and remove it from the sitemap rather than leaving a stale sales promise.
4. **Confirm the intended relationship between language and legal market.** English legal content explicitly names the U.S. market and Whagons Systems LLC; Spanish legal content has a different scope. The language selector is not a country selector. The owner should confirm this is intentional before changing legal entities, jurisdiction, or policy substance.

## Further presentation opportunities

- **Use current hotel evidence in the main sales story.** An approved customer case with a named workflow, dated results and permission to use the hotel's identity would make the offering more credible than general promises. No results or endorsements were invented for this review.
- **Choose industry-specific photography.** The pharmaceutical/food section currently uses clinical imagery. A relevant facility or team photo would connect the example to the audience more clearly. Hospitality would also benefit from approved operational photos of staff doing the work, alongside the existing property image.
- **Shorten the first visit on mobile.** The Features page is still long because it explains four groups, three roles and system boundaries. After collecting visitor feedback, consider putting secondary details behind accessible disclosures while retaining the core examples and screenshot context.
- **Measure performance and accessibility in the deployed environment.** The review checked representative keyboard interactions, page structure, readable copy and responsive widths. It did not measure production Core Web Vitals, run a complete assistive-technology audit, or verify every third-party destination.

## Canonical route inventory

All paths below are relative to `https://whagons.com`. The first ten rows appear in the sitemap in both languages. Pricing and Parador are intentionally absent from navigation and the sitemap, with `noindex, nofollow` metadata.

| Page | Spanish | English |
| --- | --- | --- |
| Home | `/es` | `/en` |
| Platform | `/es/plataforma` | `/en/platform` |
| Features | `/es/funcionalidades` | `/en/features` |
| Hospitality | `/es/operaciones-hoteleras` | `/en/hotel-operations` |
| Industries | `/es/industrias` | `/en/industries` |
| Demo | `/es/demo` | `/en/demo` |
| Hotel score | `/es/hotel-operations-score` | `/en/hotel-operations-score` |
| Privacy | `/es/privacy` | `/en/privacy` |
| Terms | `/es/terms` | `/en/terms` |
| Security | `/es/security` | `/en/security` |
| Pricing | `/es/planes` | `/en/pricing` |
| Hotel Parador | `/es/propuestas/hotel-parador` | `/en/proposals/hotel-parador` |
| Legacy handoff scan | No Spanish equivalent | `/en/handoff-scan` |

## Redirect and utility inventory

These behaviors were checked against middleware, route source and representative HTTP requests.

| Incoming path | Destination or behavior | Status |
| --- | --- | --- |
| `/` and paths without a language | Prefix saved language, then browser language, country fallback, or Spanish default | 307 |
| `/en/plataforma` | `/en/platform` | 308 |
| `/en/industrias` | `/en/industries` | 308 |
| `/es/platform` | `/es/plataforma` | 307 |
| `/es/features` | `/es/funcionalidades` | 307 |
| `/en/funcionalidades` | `/en/features` | 307 |
| `/es/hotel-operations` | `/es/operaciones-hoteleras` | 307 |
| `/en/operaciones-hoteleras` | `/en/hotel-operations` | 307 |
| `/es/industries` | `/es/industrias` | 307 |
| `/es/pricing`, `/es/precios` | `/es/planes` | 307 |
| `/en/planes`, `/en/precios` | `/en/pricing` | 307 |
| `/es/proposals/hotel-parador` | `/es/propuestas/hotel-parador` | 307 |
| `/en/propuestas/hotel-parador` | `/en/proposals/hotel-parador` | 307 |
| `/es/hospitality` | `/es` | 307 |
| `/en/hospitality` | `/en` | 308 |
| `/es/handoff-scan` | `/es/demo` | 307 |
| `/es/hospitality/handoff-scan` | `/es` | 307 |
| `/en/hospitality/handoff-scan` | `/en/handoff-scan` | 308 |
| `/demow5` | `/es/demo` | 308 |
| `/what-is-whagons` | `/es` | 308 |
| `/pt`, `/de`, `/it` and their child paths | English equivalents; known translated slugs are mapped and queries retained | 308 |
| `/robots.txt` | Allows crawling and identifies the sitemap | 200 |
| `/sitemap.xml` | 20 paired public pages and the English handoff scan | 200 |
| Localized brief PDF paths | Rewrite to `/9af3877fd2b65a3c/whagons-brief-2026.pdf` | Internal rewrite |
| Unknown localized paths | Branded localized recovery page | 404 |

API routes inspected were `/api/flodesk`, `/api/hospitality-scan`, and `/api/hotel-score`. Only the read-only score availability endpoint was requested; delivery and subscription actions were not exercised.

## Final verification checkpoint

- `pnpm build` passed, including lint and TypeScript validation.
- `pnpm test`: 48 tests passed, including pricing, Parador concessions and hotel-score behavior.
- Professional with 40 users displayed $699/month, $1,000 implementation and $1,699 for the first month. Adding one user changed the monthly amount to $704. Adding Personal by keyboard changed it to $853, and removing that group and user restored the baseline. Included groups remained free of extra charges.
- Assessment next, previous and numbered jump controls worked; the first answer remained selected when revisited. The unavailable-email notice appeared before the questions. No form was submitted.
- The language selector kept the equivalent Features page, and activating the skip link by keyboard focused `page-content`.
- All eight product screenshot files were visually inspected. The corrected English Kanban close-up and analytics image were also verified in their rendered Features sections.
- The homepage's final anchor offset was confirmed as 88px, keeping section links clear of the fixed header.
- Local preview: `http://localhost:3001/es` and `http://localhost:3001/en`. Deployment and live email delivery were not verified as part of this audit.
