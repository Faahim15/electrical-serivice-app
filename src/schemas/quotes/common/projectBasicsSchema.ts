// src/schemas/quotes/common/projectBasicsSchema.ts
import { z } from "zod";

export const projectBasicsSchema = z.object({
  propertyType: z.string().min(1, "Property type is required"),
  ownershipStatus: z.string().min(1, "Ownership status is required"),
  ownershipStatusOther: z.string().optional(),
  timeline: z.string().min(1, "Timeline is required"),
});

export type ProjectBasicsFormValues = z.infer<typeof projectBasicsSchema>;
