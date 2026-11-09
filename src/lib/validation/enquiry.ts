import { z } from "zod";

const baseFields = {
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  email: z.string().trim().email("Enter a valid email"),
};

export const generalContactSchema = z.object({
  ...baseFields,
  vehicleMake: z.string().trim().optional(),
  vehicleModelYear: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export const partsEnquirySchema = z.object({
  ...baseFields,
  vehicleMake: z.string().trim().min(1, "Vehicle make is required"),
  vehicleModel: z.string().trim().min(1, "Vehicle model is required"),
  vehicleYear: z.string().trim().min(1, "Vehicle year is required"),
  transmission: z.string().trim().optional(),
  vehicleInfo: z.string().trim().optional(),
  partName: z.string().trim().min(1, "Part name is required"),
  partDescription: z.string().trim().optional(),
  comments: z.string().trim().optional(),
});

export const vehicleValuationSchema = z.object({
  ...baseFields,
  vehicleMake: z.string().trim().min(1, "Vehicle make is required"),
  vehicleModel: z.string().trim().min(1, "Vehicle model is required"),
  vehicleYear: z.string().trim().min(1, "Vehicle year is required"),
  location: z.string().trim().min(1, "Vehicle location is required"),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor", "Accident"]),
  drivable: z.enum(["Yes", "No"]),
  transmission: z.string().trim().optional(),
  additionalInfo: z.string().trim().optional(),
});

export type GeneralContactPayload = z.infer<typeof generalContactSchema>;
export type PartsEnquiryPayload = z.infer<typeof partsEnquirySchema>;
export type VehicleValuationPayload = z.infer<typeof vehicleValuationSchema>;
