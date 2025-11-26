import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Invalid email address"),
  password: z.string().min(1, "Password must be at least 8 characters"),
});

export type SignInData = z.infer<typeof signInSchema>;
