import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please enter the valid email addreas"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginValue = z.infer<typeof loginSchema>;
export type ForgotPasswordValue = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValue = z.infer<typeof resetPasswordSchema>;
export type SignUpFormValue = z.infer<typeof signupSchema>;
