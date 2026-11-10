export interface StockLevelQuery {
  make: string;
  model?: string;
  year?: string;
  partCategory?: string;
}

export interface StockLevel {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  partName: string;
  quantityAvailable: number;
}

export interface LeadPayload {
  type: "general_contact" | "parts_request" | "vehicle_valuation";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  details: Record<string, unknown>;
}

// Shape of what the site would need from Hazarlink, per docs/DISCOVERY.md §10.
// Both methods are intentionally unimplemented until Hazarlink provides real
// API documentation and credentials — see ./client.ts and ./README.md.
export interface HazarlinkClient {
  fetchStockLevels(query: StockLevelQuery): Promise<StockLevel[]>;
  submitLead(lead: LeadPayload): Promise<void>;
}
