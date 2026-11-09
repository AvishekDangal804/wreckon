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

## Enquiry form delivery

All forms (`contact`, `sell-your-car`, parts/make "request" forms) post to `/api/enquiry`
(`src/pages/api/enquiry.ts`).

- If `RESEND_API_KEY` and `ENQUIRY_TO_EMAIL` are set (see `.env.example`), submissions are emailed
  via Resend.
- **If those env vars are not set** (the current default), submissions are only logged to the
  server console and the user is told plainly that delivery isn't configured yet. Nothing is
  silently discarded, but nothing is actually sent anywhere either — set the env vars before
  relying on these forms for real leads.

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
