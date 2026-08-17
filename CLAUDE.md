# commercialofficecleaningcottagegrove.com

Static HTML microsite (no framework, no build step) for a commercial office
cleaning business serving Cottage Grove, MN and the south metro. Deployed to
Vercel, repo root is the site root.

## Structure

- 43 static HTML pages (home, core pages, service pages, service-area pages,
  service-area × service combo pages, resource articles). See `sitemap.xml`
  for the full URL list.
- `styles.css` — single global stylesheet, referenced as `/styles.css` from
  every page.
- `utm.js` — captures `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/
  `utm_content` from the landing URL, persists them in `sessionStorage` for
  the visit, and fills the hidden `utm_source` field on quote forms. Included
  on every page via `<script src="/utm.js" defer>`.
- `quote-form.js` — submits the quote forms (`#quote-form`) via `fetch` to
  `/api/contact` instead of a page navigation, and shows inline status.
- `api/contact.js` — Vercel serverless function. Validates and forwards
  quote-form submissions to the CRM-QM `PushLead` API server-side, using
  `CRM_API_TOKEN` from environment variables. Never expose this token
  client-side.

## Forms

Two quote forms exist (homepage `#quote-form` and `/request-a-quote/`
`#quote-form`), both posting to `/api/contact`. Both include a hidden
`utm_source` field populated by `utm.js`.

## Secrets

- `CRM_API_TOKEN` must be set in the Vercel project's Environment Variables
  dashboard (Production + Preview). It is never committed — see
  `.env.example` for the expected variable name.
- Do not hardcode the CRM bearer token anywhere in client-side code or
  version control.

## Content rules (see QA.md for the full audit)

- No street address anywhere — service-area language only.
- Phone (866) 958-8773 and email ops@thequotemasters.com on every page.
- No fabricated reviews, testimonials, star ratings, or review schema.
- No invented insurance policy numbers or bond figures — plain prose only.
- No fabricated pricing — pricing page uses "contact for quote" language.
- Town facts must stay accurate to the real Cottage Grove, MN service radius.

## Known gaps

- Real insurance coverage amounts / certificate details (client to supply).
- Concrete price bands, if the client ever wants them published.
- Per-domain dedicated tracking number (currently a shared 866 number by
  client instruction).
