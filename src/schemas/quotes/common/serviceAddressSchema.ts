import { z } from "zod";

export const serviceAddressSchema = z.object({
  streetAddress: z.string().trim().min(1, "Street address is required"),
  apartment: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z
    .string()
    .trim()
    .min(2, "State is required")
    .max(2, "Use 2-letter state code"),
  zipCode: z
    .string()
    .transform((val) => val.trim()) // 👈 transform add করো
    .pipe(
      z
        .string()
        .min(5, "Zip code must be 5 digits")
        .max(5, "Zip code must be 5 digits")
        .regex(/^\d{5}$/, "Zip code must be numeric"),
    ),
  isHomeAddress: z.boolean().optional(),
});

export type ServiceAddressFormValues = z.infer<typeof serviceAddressSchema>;
