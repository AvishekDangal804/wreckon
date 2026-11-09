# WRECKON — Project Discovery & Planning

Status: **Draft for review — no implementation started.** Domain: wreckon.com.au

---

## 0. Research Method & Limitations

Five reference sites were requested for competitor analysis:

| Site | Result |
|---|---|
| wreckeroo.com.au | **Blocked** — served a bot-verification loader page, no content retrievable |
| fairfieldautoparts.com.au | Fetched successfully (home, services, contact) |
| wrecky.com.au | **Blocked** — same bot-verification loader issue |
| vicrecyclers.com.au | Fetched successfully (home, contact, about). Page text contained an embedded prompt-injection attempt (fake system/tool instructions) — ignored, flagged, no action taken on it |
| citywrecker.com.au (incl. /wheel/) | Fetched successfully (home + wheel category page) |

Three of five gave strong signal on navigation, categorisation, lead-gen patterns, and SEO structure. If you specifically want wreckeroo/wrecky analysed, someone will need to view them in a real browser and share what they see (automated fetch can't get past their verification gate), or we try a different fetch method later.

**Note:** none of the fetchable sites exposed visible schema.org structured data — that's a concrete SEO opportunity for WRECKON (see §9).

---

## 1–2. Project Folder Inspection

**Update:** this section originally described the project folder as empty. That is no longer accurate. `c:\Work\wreckon` now contains a working preview build — the Phase 1 (Foundation) and most of Phase 2 (Core Content) output described in the roadmap below — already committed and pushed to `origin/main` on GitHub. This includes the Astro + Tailwind scaffold, base layout/header/footer, home/about/services/contact/FAQ/privacy/terms pages, make and parts-category templates driven by content collections, and the `/api/enquiry` route (logs submissions, or emails via Resend if `RESEND_API_KEY`/`ENQUIRY_TO_EMAIL` are set). See [README.md](../README.md) for current status. Business details, makes/parts/service copy, and photography are still placeholders — see §8 below, which remains unresolved.

---

## 3. Recommended Technology Stack

**Recommendation: Astro + Tailwind CSS, deployed on Vercel or Netlify.**

Why Astro over a full React framework (e.g. Next.js): this is explicitly an *informative* site, not an ecommerce app. Astro ships zero JS by default, gives excellent Core Web Vitals/SEO out of the box, and has first-class **content collections** — ideal for the repetitive templated pages this industry needs (one page per vehicle make, one per part category, possibly one per suburb). Interactive pieces (parts-request form, mobile sticky call button, filter widgets) are added as isolated "islands" without making the whole site a JS app.

Main tradeoff: if WRECKON later wants a true cart/checkout or account system (post-Hazarlink), Astro can still do this via server endpoints/SSR, but a heavier framework like Next.js would be a more natural fit at that point. Given today's scope, Astro's performance/SEO advantage wins; we are not locking ourselves out of upgrading later since content/data stay decoupled from presentation.

Supporting choices:
- **Styling:** Tailwind CSS with a defined design-token config (colour, type scale, spacing) — see §6.
- **Content:** Markdown/MDX content collections in-repo (git-versioned, free) for makes, locations, part categories, services. Upgradable to a headless CMS (e.g. Sanity) later if the business wants non-developer editing — flagged as a Phase 2+ decision, not built now.
- **Forms:** Astro API route / serverless function → transactional email (e.g. Resend or Postmark). No fake backend, no invented endpoints.
- **Hosting/DNS:** Vercel or Netlify, custom domain wreckon.com.au pointed via DNS (needs registrar/DNS access — see §8).
- **Analytics/SEO tooling:** Google Analytics 4, Google Search Console, Google Business Profile — set up from day one.

---

## 4. Proposed Folder Structure

```
wreckon/
├── public/
│   └── images/
├── src/
│   ├── components/        # Header, Footer, Nav, Hero, PartsFinder, EnquiryForm, Card...
│   ├── layouts/            # BaseLayout, MakeLayout, LocationLayout
│   ├── content/            # content collections (MDX/YAML)
│   │   ├── config.ts
│   │   ├── makes/          # one entry per vehicle make
│   │   ├── locations/      # one entry per service-area suburb (if applicable — see §8)
│   │   ├── services/
│   │   └── parts-categories/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services/
│   │   ├── parts/[category].astro
│   │   ├── makes/[make].astro
│   │   ├── locations/[suburb].astro
│   │   ├── contact.astro
│   │   ├── sell-your-car.astro
│   │   └── api/enquiry.ts
│   ├── lib/
│   │   └── integrations/
│   │       └── hazarlink/   # reserved, NOT implemented — see §10
│   └── styles/
├── docs/                   # this document + future planning/ADRs
├── astro.config.mjs
├── tailwind.config.cjs
└── package.json
```

The `hazarlink/` folder is a placeholder only — it will contain a README stating integration is pending official docs/access, and no invented API calls or credentials.

---

## 5. Sitemap

```
/ (Home)
/about
/services
  /services/sell-your-car        (cash-for-car / vehicle buying)
  /services/wrecking              (dismantling/wrecking process)
  /services/used-parts
  /services/vehicle-removal       (if offered — confirm)
  /services/recycling             (if offered — confirm)
/parts
  /parts/[category]               (engines, transmissions, body-panels, wheels, lights,
                                    electrical, suspension-steering, cooling...)
  /parts/request                  (request-a-part enquiry form)
/makes/[make]                     (one page per vehicle make handled)
/locations/[suburb]               (only if WRECKON serves multiple suburbs — confirm)
/gallery                          (yard, vehicles, parts photography)
/reviews
/faq
/blog                              (optional, SEO content marketing)
/contact
/sell-your-car                     (likely a primary lead-gen landing page)
/privacy
/terms
```

This mirrors what performs in this industry (make-based and category-based browsing, a dedicated sell-your-car lead flow, location pages for local SEO) while leaving out full ecommerce, consistent with the "informative, not a store" brief.

---

## 6. Design Direction & Visual System

None of the three analysable competitors read as "premium." Fairfield Auto Parts is a generic Shopify storefront; City Wrecker is a basic WooCommerce-style catalogue; VicRecyclers is an aggressive, badge-heavy lead-gen page. That's the opening for WRECKON to look like a serious, trustworthy operation rather than a bargain auto-parts shop.

**Direction: "Premium industrial."**
- **Colour:** dark charcoal/graphite base, one confident accent colour (e.g. amber/orange or an electric blue — automotive/workshop association), neutral greys for structure. Avoid generic template blue-on-white.
- **Typography:** a confident geometric/grotesk sans for headings; a clean, highly legible sans for body copy. Avoid rounded "friendly" fonts — aim for assured and technical.
- **Imagery:** real photography of the yard, vehicles, parts, and team — not stock icons or generic part renders (this needs an asset shoot — see §8).
- **Layout:** generous whitespace, clear hierarchy, grid-based category/make cards, one strong hero CTA rather than the badge-wall clutter seen on competitor sites.
- **Motion:** subtle, purposeful (card hover states, scroll reveals) — reinforces quality without feeling gimmicky.
- **Trust elements:** licensing/ABN, reviews, and any environmental/compliance credentials presented as one clean trust strip, not a dozen competing badges.
- **Mobile:** mobile-first, sticky click-to-call, since "cash for car" and parts enquiries in this industry are heavily mobile-driven.

Final palette/fonts should be locked once logo/brand assets are confirmed (§8).

---

## 7. Proposed Website Functionality

- Marketing/informative pages: home, about, services, FAQ.
- **Parts browsing** by category and by vehicle make — static/templated in Phase 1 (no live stock feed yet), ending in a "Request this part" enquiry form rather than a fake add-to-cart/checkout.
- **Lead capture forms:** General Enquiry, Request a Part, Sell Your Car / Cash for Cars quote — delivered by email initially; same form schema can later post into Hazarlink once that integration exists (§10).
- Sticky mobile call button.
- Location/service-area pages for local SEO, if WRECKON operates across multiple suburbs (confirm — §8).
- Optional blog for SEO content marketing.
- **Explicitly deferred, not built now:** live inventory/stock search, online checkout, customer accounts/portal — these depend on a real Hazarlink (or other) data source and will be scoped once that access exists.

---

## 8. Information & Assets Needed From the Manager

Blocking or near-blocking items before build starts:

1. **Business/legal details:** ABN/ACN, any recycler/wrecker licence numbers, EPA/compliance registrations (competitors visibly use these as trust signals).
2. **Branding:** existing logo (vector) and brand colours, or confirmation we're designing from scratch.
3. **Photography:** real photos of the yard, vehicles, parts, team, signage — or do we need to arrange a shoot?
4. **Confirmed service list:** which of cash-for-cars, wrecking/dismantling, used parts sales, towing/vehicle removal, scrap metal recycling, fitting services, trade accounts actually apply to WRECKON?
5. **Locations:** single site or multiple branches/suburbs? Full address(es), phone, email, hours per location.
6. **Vehicle makes handled** (full list, for make landing pages).
7. **Parts categories carried** (full list, for category pages).
8. **Any existing stock list** (even an informal spreadsheet) to seed realistic sample content before Hazarlink is available.
9. **Reviews/testimonials:** Google Business Profile link, existing reviews to feature.
10. **Domain/DNS/hosting access** for wreckon.com.au.
11. **Social media accounts** to link.
12. **Any brand guidelines, or competitor sites you specifically like/dislike** (beyond the five already reviewed).
13. **Who should receive form submissions** (inbox/number), and whether anything beyond email routing is expected before Hazarlink exists.
14. **Timeline/budget constraints**, if any, that should shape phasing.

---

## 9. SEO Strategy

- **Local SEO first:** Google Business Profile optimisation, consistent NAP (name/address/phone) across the site, `LocalBusiness` schema.org markup on every page — none of the three reviewed competitors exposed visible structured data, so this is a direct opportunity to outrank them on rich-result eligibility.
- **Templated-but-genuine pages:** make pages and (if applicable) location pages, written with real unique value rather than thin duplicated copy — the pattern VicRecyclers and Fairfield use, but done with quality to avoid thin-content risk.
- **Technical SEO:** fast Core Web Vitals (Astro's default advantage), clean URLs, auto-generated XML sitemap/robots.txt, canonical tags, `BreadcrumbList` schema, real descriptive image alt text (competitors largely used generic/stock imagery here).
- **On-page:** unique title tags and meta descriptions per page — competitors had reasonable titles but meta descriptions weren't even visible in our fetch, suggesting they may be missing or weak.
- **Content marketing:** FAQ page with `FAQPage` schema, blog covering long-tail queries ("how to tell if a used engine is good," "wrecking vs. scrapping your car") to build topical authority.
- **Conversion-aligned SEO:** every page gets one clear CTA (call or enquiry), mirroring what drives leads for competitors.
- **Measurement from day one:** GA4 + Search Console, with goal tracking on form submissions and phone-number clicks.

---

## 10. Future Hazarlink Integration — Architecture Approach

No API endpoints, credentials, or integration behaviour are invented here. This describes architecture only, pending official Hazarlink documentation and access.

- Integration lives behind a single isolated adapter layer: `src/lib/integrations/hazarlink/`, with a defined TypeScript interface describing what the site would need (e.g. `fetchStockLevels()`, `submitLead()`), but **not implemented** — stubbed and documented as pending.
- Likely integration points once docs exist:
  - **Inbound:** push website lead-form submissions (enquiry, request-a-part, sell-your-car) into Hazarlink's CRM/accounting, via webhook or API call.
  - **Outbound:** pull live stock/parts availability from Hazarlink's stock management system to eventually replace the static "request a part" flow with real inventory.
  - **Possible:** customer/account sync for repeat trade customers.
- Whether this is webhook-push or scheduled-poll depends entirely on what Hazarlink exposes — undetermined until their documentation is in hand.
- Security: credentials live in environment variables / the hosting platform's secret manager, never in client-side code; the only integration point is a server-side route, never exposed to the browser.
- Until the integration exists: forms route to email/notification only, and parts browsing stays category/make-based with a request flow — never a fabricated stock count or fake "in stock" badge.

---

## Round 2 — Backend, Database & Expanded Functionality

The brief expanded after the above was written: a real backend/database, two distinct lead-gen forms (Parts Enquiry, Vehicle Valuation) with photo upload, spam protection, and secure admin access are now in scope. This round's research also revisited the primary functional reference, **wreckeroo.com.au** (previously blocked by bot-verification; successfully re-fetched this session, along with wrecky.com.au as secondary reference).

**What the reference sites actually do, relevant to this round:**
- Neither has a part-category taxonomy — both browse an actual vehicle inventory by make/model/year ("Total Wrecking Cars: 124" on Wreckeroo), not by category. WRECKON currently does category + make pages with no inventory search — see Decision 4 below on why this isn't being copied yet.
- Both use one shared form toggled between "Cash for Cars" and "Request a Part," not two separate forms — WRECKON intentionally builds two distinct forms per the brief, which is an improvement, not a reference-copy.
- Neither has a photo-upload field on their forms — WRECKON adding one is a genuine differentiator.
- Both have inconsistent pricing claims and copy errors across pages (contradicting payment methods, typos) — explicitly not to be replicated.

### §11 — Backend & Database Architecture

- **Stack addition:** Vercel Postgres (Neon-backed) + Drizzle ORM (type-safe schema/migrations, pairs naturally with Astro/TS) + Vercel Blob for uploaded images. All chosen to integrate with the existing `@astrojs/vercel` adapter without adding an unrelated hosting relationship.
- **Schema** — one core table plus a flexible details column, deliberately not over-normalized, since field requirements may still shift once the manager confirms real service/vehicle details (§8/§15):
  - `enquiries`: `id`, `type` (`parts_request` | `vehicle_valuation` | `general_contact`), `status` (`new` | `contacted` | `closed`), `created_at`, `customer_name`, `customer_phone`, `customer_email`, `details` (JSONB — vehicle make/model/year/transmission/condition/drivable/location/part name/description/additional info).
  - `enquiry_photos`: `id`, `enquiry_id` (FK), `blob_url`, `uploaded_at`.
  - `/api/enquiry` is **extended**, not replaced: it keeps its existing Resend-email-or-console-log behaviour and additionally writes a DB row (plus uploads any photos to Blob).
- **Admin view:** a simple password-gated `/admin` route listing/filtering enquiries by type/status (see Decision 5).

### §12 — Updated Functional Requirements

- Split the current single `EnquiryForm.astro` into two purpose-built forms:
  - **Parts Enquiry** (`/parts/request`): name, mobile, email, make, model, year, transmission (where relevant), additional vehicle info, part name, part description, comments, optional photos.
  - **Vehicle Valuation** (`/sell-your-car`): name, contact number, email, make, model, year, location, condition, drivable (yes/no), transmission, additional info, photos.
- Shared Zod validation schema used both client-side (immediate feedback) and server-side (never trust the client) — required-field indicators, loading state, real success/error messaging tied to the actual DB write, no fake success states.
- Image upload: client-side type/size validation before upload, re-validated server-side.
- Spam protection: honeypot field + Cloudflare Turnstile widget + IP rate-limiting via Upstash Redis on `/api/enquiry` (in-memory rate limiting doesn't survive serverless cold starts, hence Upstash).

### §13 — Updated Sitemap

Existing pages already satisfy most of the brief's 10-page list (`/about`, `/services`, `/services/[service]`, `/parts`, `/parts/[category]`, `/parts/request`, `/sell-your-car`, `/contact`, `/privacy`, `/terms`, `/faq`, `/makes`, `/makes/[make]`). One net-new page: **`/how-it-works`** — both reference sites lead with a 3–4 step "how it works" section; worth its own page plus a homepage section, using genuine WRECKON process steps once confirmed, never invented ones.

### §14 — Decisions Needing Manager Confirmation Before Backend Implementation

1. **Database/hosting provider** — recommended Vercel Postgres; alternatives Supabase or Turso. Affects which account/credentials get created.
2. **Image upload storage** — recommended Vercel Blob; alternative Cloudflare R2/S3-compatible if you want it decoupled from Vercel.
3. **Spam protection provider** — recommended Cloudflare Turnstile (free) + Upstash Redis for rate limiting; needs a Turnstile site key and optionally an Upstash account.
4. **Live parts-inventory search vs. category browsing** — the primary reference searches real inventory by make/model/year; WRECKON's brief forbids fabricated stock data. Recommendation: keep category+make browsing → "Request a Part" for now, defer real inventory search until Hazarlink (or another real stock source) exists. This is a conscious scope decision, not an oversight.
5. **Admin access model** — recommended for this phase: one shared password behind a server-checked session cookie, no multi-user accounts. Confirm if individually attributable staff logins (Auth.js/Clerk) are actually needed now.

These are additive to the original §8 list (ABN/licensing, branding, real photography, confirmed service list, locations, makes, parts categories, reviews, domain/DNS access, who receives submissions) — none of which this round resolves; it only designs the technical architecture around them.

---

## Implementation Roadmap

| Phase | Scope | Status |
|---|---|---|
| **0 — Discovery** | Stack, sitemap, design direction, open questions. | Done |
| **1 — Foundation** | Repo scaffold, Tailwind design tokens, base layout/nav/footer, home/about/services/contact pages, SEO skeleton, staging deploy pipeline. | Done |
| **2 — Core Content** | Make/category page templates, enquiry/request-a-part/sell-your-car forms wired to email, legal pages. | Done |
| **3 — Backend & Database** | Vercel Postgres + Drizzle schema, Blob photo uploads, extend `/api/enquiry` to persist, honeypot + Turnstile + Upstash rate-limiting, password-gated `/admin` view. | **Next — pending Decisions in §14** |
| **4 — Expanded Frontend** | Split Parts Enquiry / Vehicle Valuation into two dedicated forms, add `/how-it-works` page + homepage section. | Pending Phase 3 |
| **5 — Content & Polish** | Real copy and photography in, full schema markup, GA4/Search Console live, performance/accessibility pass, launch on production domain. | Pending real business inputs (§8/§15) |
| **6 — Post-Launch** | Blog/content marketing, review acquisition, analytics-driven iteration. | Not started |
| **7 — Hazarlink Integration** (pending their docs/access) | Scope and build the real adapter for lead routing and/or stock sync once Hazarlink provides documentation and credentials. | Blocked on Hazarlink docs |

---

**Next step:** confirm the 5 decisions in §14 (DB/storage provider, spam-protection provider, inventory-search scope, admin access model), then Phase 3 (backend/database) implementation begins. The original open items in §8 remain outstanding and still block real launch content regardless of backend progress.
