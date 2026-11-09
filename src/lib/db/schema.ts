import { pgTable, pgEnum, serial, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const enquiryType = pgEnum("enquiry_type", [
  "general_contact",
  "parts_request",
  "vehicle_valuation",
]);

export const enquiryStatus = pgEnum("enquiry_status", ["new", "contacted", "closed"]);

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  type: enquiryType("type").notNull(),
  status: enquiryStatus("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  details: jsonb("details").notNull().default({}),
});

export const enquiryPhotos = pgTable("enquiry_photos", {
  id: serial("id").primaryKey(),
  enquiryId: integer("enquiry_id")
    .notNull()
    .references(() => enquiries.id, { onDelete: "cascade" }),
  blobUrl: text("blob_url").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});
