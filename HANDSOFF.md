# Handoff — commercialofficecleaningcottagegrove.com

Status: **READY TO LAUNCH**

## What's in this repo

Static 43-page HTML microsite, no build step, no framework. Deployed to
Vercel from repo root. See `CLAUDE.md` for structure details and `QA.md` for
the full content/compliance audit (addresses, phone, insurance language,
pricing, town facts, schema, sitemap — all PASS).

## What was done in this session

1. **Contact form wired to the CRM.** Both quote forms (homepage and
   `/request-a-quote/`) previously submitted with `GET` to `/` or
   `/request-a-quote/` and did nothing with the data. They now `POST` via
   `fetch` (`quote-form.js`) to a new Vercel serverless function,
   `api/contact.js`, which validates the input and forwards it server-side to
   the CRM-QM `PushLead` API
   (`https://thequotemasters.com/crm_api/api.php?action=push_lead`) using the
   bearer token from `CRM_API_TOKEN`. The token is never present in any
   client-side file or in git history.
2. **UTM tracking added.** `utm.js` is included on all 43 pages. It captures
   `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/`utm_content` from the
   landing URL, persists them in `sessionStorage` for the session, and fills
   a hidden `utm_source` field on both quote forms so attribution survives
   multi-page browsing before the form is submitted. The combined value
   (`source / medium / campaign`) is sent as the CRM's `utm_source` field.
3. **Placeholder/secret sweep.** Searched the full repo for `{{ }}` tokens,
   `TODO`/`PLACEHOLDER`/`lorem ipsum`, and the CRM bearer token string —
   none found in any tracked file. `.gitignore` and `.env.example` added so
   a real token can never be committed by accident.
4. **No testing was run** (per instruction) — this was a wiring/content pass,
   not a QA pass. See "Before going live" below for what to verify manually
   once deployed.

## Required action before the form actually works in production

**Add the `CRM_API_TOKEN` environment variable in the Vercel project
dashboard** (Project Settings → Environment Variables), for both Production
and Preview environments. Value is the bearer token from the CRM-QM API
documentation provided out of band — do not paste it into this repo. This
step could not be done from here (no Vercel CLI / dashboard access in this
session).

## Before going live (manual checks, since no CLI/testing was done here)

- [ ] Set `CRM_API_TOKEN` in Vercel (see above) — without it, `/api/contact`
      returns a 500 and both forms will show "Server is not configured."
- [ ] Submit a real test lead through the live `/request-a-quote/` form and
      confirm it appears in the CRM.
- [ ] Confirm the homepage mini quote form submits successfully too.
- [ ] Load a page with `?utm_source=test&utm_medium=email` in the URL, click
      through to `/request-a-quote/`, and confirm the hidden `utm_source`
      field is populated before submit.
- [ ] Spot-check a few pages on mobile widths (page uses a single shared
      `styles.css` with existing responsive rules — nothing new added there).

## Repo / deploy

- Git remote: `origin` → `https://github.com/damienvernon013-design/commercialofficecleaningcottagegrove.git`
- Vercel project is already connected to this GitHub repo per client
  instruction — no `vercel` CLI commands were run from this session.
