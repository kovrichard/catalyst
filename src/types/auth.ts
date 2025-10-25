import { z } from "zod";

const PasswordSchema = z
  .string()
  .trim()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Add an uppercase letter" })
  .regex(/[a-z]/, { message: "Add a lowercase letter" })
  .regex(/[0-9]/, { message: "Add a number" })
  .regex(/[!@#$%^&*(),.?":{}|<>+\-=_~`[\]\\;'/]/, {
    message: "Add a special character",
  });

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  "cf-turnstile-response": z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }),
  email: z.email("Enter a valid email address"),
  password: PasswordSchema,
  "cf-turnstile-response": z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: PasswordSchema,
    confirmPassword: z.string().trim().min(1, { message: "Confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
