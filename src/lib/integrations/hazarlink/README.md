# Hazarlink integration — stub, not implemented

This folder holds the adapter shape for a future Hazarlink integration (accounting / stock
management / web portal), as discussed in [docs/DISCOVERY.md](../../../../docs/DISCOVERY.md) §10.

**Nothing here is implemented.** No real endpoints, credentials or data shapes are invented:

- `types.ts` defines what the site would need (`fetchStockLevels`, `submitLead`) based on the
  architecture already agreed in the discovery doc — not on any real Hazarlink API spec, since
  none has been provided.
- `client.ts` exports `hazarlinkClient`, a stub implementation of that interface. Both methods
  throw `HazarlinkNotConfiguredError` immediately — they do not return fake stock levels or
  silently drop leads. **Nothing in the rest of the codebase calls this yet.**

When Hazarlink provides real API documentation and credentials:

1. Replace the two method bodies in `client.ts` with real `fetch` calls against their API.
2. Read credentials from environment variables (e.g. `HAZARLINK_API_URL`, `HAZARLINK_API_KEY` —
   placeholders only in `.env.example`, not set anywhere yet) — never expose them to the browser.
3. Call `hazarlinkClient` only from server-side code (API routes), the same pattern already used
   for Resend/Blob/Turnstile/Upstash in `src/pages/api/enquiry.ts`.
