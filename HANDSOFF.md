# Handoff — commercialofficecleaningcottagegrove.com

Status: **READY TO LAUNCH** (pending live wizard click-through, see below)

## What's in this repo

Static 68-page HTML microsite, no build step, no framework. Deployed to
Vercel from repo root. See `CLAUDE.md` for structure details and `QA.md` for
the original content/compliance audit (addresses, phone, insurance language,
pricing, town facts, schema — all PASS as of the original 43-page build).

## What was done in this session (blog + CRM quote wizard build)

1. **CRM quote wizard added, old flow retired.** The site's original
   single-step lead form (`api/contact.js` + `quote-form.js`, posting to
   `/api/contact`) has been fully removed. In its place:
   - `assets/js/quote-wizard.js` — a multi-step wizard covering the CRM's
     real questionnaire (cleaning frequency, current situation, service
     rating, timing preference, number of companies to meet), weekday
     appointment booking (2+ days out, same-day slots spaced ≥90 minutes
     apart), and a review/confirm step.
   - `api/submit-lead.js` — new serverless function, validates and forwards
     the wizard payload to the CRM-QM `PushLead` API. `ZIP_DEFAULT` is
     `55016`, `ADDRESS_DEFAULT` is `Cottage Grove, MN`, CORS is locked to
     `https://commercialofficecleaningcottagegrove.com`. Uses the same
     `CRM_API_TOKEN` env var as before — no new secret to configure.
   - `/request-a-quote/` now renders the full wizard scaffold.
   - The home page now has a short teaser form (name/phone/sqft) that
     GET-submits to `/request-a-quote/` and prefills step 1 of the wizard.
   - Wizard-specific CSS added to `styles.css`.
2. **Blog section added.** `/blog/` — 24 posts + hub page, rewritten from a
   portfolio content pack for this site's brand, phone, and facility scope.
   Three posts that were originally restaurant/gym/school-specific were
   reframed as general facility-hygiene guidance rather than direct service
   claims, since those verticals aren't in this site's quoted facility
   types. Nav (`Blog` link) and `sitemap.xml` updated across all pages.
3. **Footer credit line added.** Every page's footer now ends with "Built
   and Maintained by Infin8Content," linked to https://infin8content.com/
   (opens in a new tab).
4. **Pre-existing bug fixed.** 13 pages (5 `/resources/*` + 8
   `/service-areas/*`) shipped a literal `{CALLOUT}` placeholder token in
   production HTML from an earlier build pass — QA.md had claimed zero
   template tokens sitewide. Replaced with the actual callout markup on
   all 13 pages.
5. **Verification run this session:** `node --check` passes on both new JS
   files; all six `data-wizard-*` scaffold hooks confirmed present on
   `/request-a-quote/`; zero remaining references to the old
   `api/contact`/`quote-form.js` flow anywhere in the repo; every internal
   link in every new blog post resolves to a real file; `sitemap.xml` is
   valid XML with a URL count (68) matching the actual page count (68); no
   fabricated pricing or cross-portfolio links in the new blog content.
6. **No browser testing was run** — the wizard has been verified structurally
   (scaffold hooks, JS syntax, local static serving) but not click-tested
   against the live CRM in a real browser. See "Before going live" below.

## Required action before the form actually works in production

`CRM_API_TOKEN` should already be set in the Vercel project (Production +
Preview) from the prior session — `api/submit-lead.js` reads the same env
var name as the old `api/contact.js` did. No new secret needs to be added.
If it was never set, both the old and new flow would fail identically with
a 500 "Server not configured" response.

## Before going live (manual checks — not done from here)

- [ ] Click through the full wizard on a Vercel preview deploy in a real
      browser: all steps, a real appointment date/time, and a real
      submission reaching the CRM. This is the one step the Playbook this
      build followed explicitly calls out as non-optional and it was not
      possible to do from this session (no browser tool available here).
- [ ] Confirm the home-page teaser form correctly hands off to
      `/request-a-quote/` and prefills name/phone/sqft.
- [ ] Load a page with `?utm_source=test&utm_medium=email`, click through
      to `/request-a-quote/`, and confirm the wizard's `utmSource` value on
      submit reflects it.
- [ ] Spot-check `/blog/` and a few post pages on mobile widths.
- [ ] Confirm `/blog/` and a couple of posts render correctly and the
      "Built and Maintained by Infin8Content" footer line appears on both
      old and new pages.

## Repo / deploy

- Git remote: `origin` → `https://github.com/damienvernon013-design/commercialofficecleaningcottagegrove.git`
- Vercel project is already connected to this GitHub repo — pushing to
  `main` triggers a deploy, no `vercel` CLI needed.
