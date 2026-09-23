# commercialofficecleaningcottagegrove.com

Static HTML microsite (no framework, no build step) for a commercial office
cleaning business serving Cottage Grove, MN and the south metro. Deployed to
Vercel, repo root is the site root.

## Structure

- 68 static HTML pages: 43 core pages (home, core pages, service pages,
  service-area pages, service-area × service combo pages, resource articles)
  plus a 25-page `/blog/` section (24 posts + hub). See `sitemap.xml` for the
  full URL list.
- `styles.css` — single global stylesheet, referenced as `/styles.css` from
  every page. Includes the quote-wizard CSS block (`.wiz-*` classes) and the
  home-page lead-teaser styles (`.lead-teaser`).
- `utm.js` — captures `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/
  `utm_content` from the landing URL and persists them in `sessionStorage`
  for the visit. Included on every page via `<script src="/utm.js" defer>`.
- `assets/js/quote-wizard.js` — drives the multi-step quote wizard on
  `/request-a-quote/` (`[data-quote-wizard]`). Reads the CRM's real
  questionnaire (frequency, current situation, service rating, timing,
  number of companies to meet), collects weekday appointment slots at least
  2 days out, and posts the CRM-shaped payload to `/api/submit-lead`. Also
  reads `?name=&phone=&sqft=` from the URL to prefill from the home-page
  teaser form.
- `api/submit-lead.js` — Vercel serverless function. Validates and forwards
  wizard submissions to the CRM-QM `PushLead` API server-side, using
  `CRM_API_TOKEN` from environment variables. Never expose this token
  client-side. `ZIP_DEFAULT` is `55016` (Cottage Grove, MN); CORS origin is
  locked to this domain.

## Forms

- **Home page** (`index.html`): a short teaser form (`[data-lead-teaser]`,
  name + phone + sqft) that GET-submits natively to `/request-a-quote/` —
  no JS dependency. The wizard's `prefillFromQuery()` reads those params and
  prefills step 1.
- **`/request-a-quote/`**: the full multi-step wizard
  (`[data-quote-wizard]`), scripted by `assets/js/quote-wizard.js`, posting
  to `/api/submit-lead`.
- `/contact/` has no form — contact info and a callout linking to
  `/request-a-quote/` only.

The old single-step flow (`api/contact.js` + `quote-form.js`,
`/api/contact`) has been fully retired and removed from the repo.

## Blog

`/blog/` — 24 posts + hub page, adapted from a portfolio-wide content pack
per the replication playbook. All posts use `LocalBusiness`-only JSON-LD
(no Article/BlogPosting schema, no byline, no publish date), matching the
`/resources/*` convention. Three source-pack posts that were vertical-
specific (restaurants, gyms, schools/daycares) were reframed as general
facility-hygiene guidance rather than direct service claims, since this
site's facility scope (per the `/request-a-quote/` form) is office,
medical/dental, multi-tenant, retail/service, and light industrial only —
not food service, fitness, or childcare. Unverifiable named-study citations
from the source pack were softened to general, unattributed claims. No
fabricated pricing anywhere in blog content.

Nav includes a `Blog` link (between FAQ and Get a Quote) on every page, and
all blog URLs are in `sitemap.xml`.

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
- Every page's footer credits "Built and Maintained by Infin8Content"
  (linked to https://infin8content.com/) — preserve this on any future
  template/footer changes.

## Known gaps

- Real insurance coverage amounts / certificate details (client to supply).
- Concrete price bands, if the client ever wants them published.
- Per-domain dedicated tracking number (currently a shared 866 number by
  client instruction).
- Wizard has not yet been click-tested end-to-end in a real browser against
  the live CRM (see HANDSOFF.md).
