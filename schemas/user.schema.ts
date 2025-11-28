import { z } from "zod";

export const userSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  enabled: z.boolean().optional(),
  password: z.string().min(0).optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

export default userSchema;
