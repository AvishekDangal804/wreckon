# Hazarlink integration — reserved, not implemented

This folder is a placeholder for a future Hazarlink integration (accounting / stock management /
web portal), as discussed in [docs/DISCOVERY.md](../../../../docs/DISCOVERY.md) §10.

**Nothing here is implemented.** No endpoints, credentials or data shapes are invented. This file
exists only to mark where that adapter will live once Hazarlink provides official API documentation
and access.

When that happens, this folder should hold a typed adapter (e.g. `fetchStockLevels()`,
`submitLead()`) called only from server-side code (API routes), with credentials read from
environment variables — never exposed to the browser.
