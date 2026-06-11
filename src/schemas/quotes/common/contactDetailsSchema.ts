import { z } from "zod";
export const contactSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(7, "Please enter a valid phone number"),
  preferredContact: z.enum(["Call", "Text", "Email"] as const, {
    error: "Please select a preferred contact method",
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
