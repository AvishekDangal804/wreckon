# WRECKON

Astro + Tailwind CSS marketing site for WRECKON, an Australian auto wrecker / used parts business.
See [docs/DISCOVERY.md](docs/DISCOVERY.md) for the full project plan, sitemap and open questions.

## Status: preview build

This is a first working build, not launch-ready. Everything flagged below needs real input
before going live — see the on-site banner and `docs/DISCOVERY.md` §8 for the full list.

- **Business details are placeholders** (`src/lib/siteConfig.ts`): phone, address, hours. No ABN
  is included — don't invent one.
- **Vehicle makes, parts categories and service copy are starter/sample content**
  (`src/content/makes/`, `src/content/parts-categories/`, `src/content/services/`), based on
  patterns common in this industry, not WRECKON's actual confirmed lists.
- **No photography** — hero/section visuals are intentionally plain (color/typography only) rather
  than stock or competitor images. Real photography is still needed.
- **Privacy Policy and Terms pages are drafts**, clearly marked on-page as not legally reviewed.
- **Hazarlink is not integrated.** `src/lib/integrations/hazarlink/` (not yet created) is reserved
  for that work once Hazarlink provides real API docs/credentials — do not fabricate endpoints there.
- **Backend services below are optional and degrade gracefully.** None of them have real accounts
  set up yet — I can't create the Vercel Postgres/Neon, Vercel Blob, Cloudflare Turnstile, or
  Upstash accounts myself. The site works today without any of them; each one "activates" once
  its env vars are set.

## Enquiry form delivery

All forms (`contact`, `parts/request`, `sell-your-car`) post to `/api/enquiry`
(`src/pages/api/enquiry.ts`), which runs: honeypot check → rate limit → Turnstile verification →
field validation → optional photo upload → optional database write → email-or-log.

- If `RESEND_API_KEY` and `ENQUIRY_TO_EMAIL` are set (see `.env.example`), submissions are emailed
  via Resend.
- **If those env vars are not set** (the current default), submissions are only logged to the
  server console and the user is told plainly that delivery isn't configured yet. Nothing is
  silently discarded, but nothing is actually sent anywhere either — set the env vars before
  relying on these forms for real leads.

## Database, photo uploads, spam protection & admin

- **Database:** set `DATABASE_URL` (a Postgres connection string — Neon/Vercel's native Neon
  integration recommended) to persist every submission to an `enquiries` table (plus
  `enquiry_photos` for uploads). Without it, forms still work via the email/log path above, just
  without persistence. After setting `DATABASE_URL`, run `npm run db:push` to create the tables
  (schema lives in `src/lib/db/schema.ts`); `npm run db:studio` opens Drizzle's DB browser.
- **Photo uploads:** set `BLOB_READ_WRITE_TOKEN` (Vercel Blob) to let the parts-request and
  sell-your-car forms actually upload attached photos. Without it, photo fields are accepted but
  silently skipped.
- **Spam protection:** set `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (Cloudflare
  Turnstile, free) to show a Turnstile widget on every enquiry form and verify it server-side.
  Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (Upstash, free tier) to rate-limit
  submissions by IP. Both are optional and skipped when unset — there's also always a honeypot
  field active regardless of configuration.
- **Admin view:** set `ADMIN_PASSWORD` + `SESSION_SECRET` to enable `/admin` (lists enquiries,
  filterable by type/status) behind a single shared password and a signed session cookie. Without
  both set, `/admin/login` shows a "not configured" message instead of a login form.

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build (outputs to dist/ and .vercel/output)
npm run preview
npx astro check   # type-check
```

## Stack

- [Astro](https://astro.build) (static-first, content collections for templated pages)
- Tailwind CSS v4 (design tokens in `src/styles/global.css`)
- `@astrojs/sitemap` for automatic sitemap generation
- `@astrojs/vercel` adapter (only the `/api/enquiry` route is server-rendered; everything else is static)

## Project structure

```
src/
├── components/        # Header, Footer, Hero, Card, EnquiryForm, ...
├── layouts/            # BaseLayout (SEO meta, schema, header/footer wiring)
├── content/            # content collections: makes, parts-categories, services
├── content.config.ts   # collection schemas
├── pages/               # routes, including dynamic [make]/[category]/[service] templates
└── lib/siteConfig.ts    # placeholder business details
```
