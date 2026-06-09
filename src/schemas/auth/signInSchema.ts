import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .transform((val) => val.trim()),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
