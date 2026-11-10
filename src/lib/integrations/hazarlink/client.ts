import type { HazarlinkClient } from "./types";

export class HazarlinkNotConfiguredError extends Error {
  constructor(method: string) {
    super(
      `Hazarlink.${method}() was called, but no real Hazarlink integration exists yet. ` +
        "This adapter is a stub pending official Hazarlink API documentation and credentials " +
        "— see src/lib/integrations/hazarlink/README.md and docs/DISCOVERY.md §10."
    );
    this.name = "HazarlinkNotConfiguredError";
  }
}

// Stub only — throws rather than returning fabricated stock/lead data, so a
// caller can't accidentally ship fake inventory or silently-dropped leads.
// Replace these two methods with real calls once Hazarlink's API docs and
// credentials exist; nothing else in the codebase calls this yet.
export const hazarlinkClient: HazarlinkClient = {
  async fetchStockLevels() {
    throw new HazarlinkNotConfiguredError("fetchStockLevels");
  },
  async submitLead() {
    throw new HazarlinkNotConfiguredError("submitLead");
  },
};
