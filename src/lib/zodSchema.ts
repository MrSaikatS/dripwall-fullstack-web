import z from "zod";

export const loginFormSchema = z.object({
  email: z
    .email({ error: "Invalid email address" })
    .max(64, { error: "Email must not exceed 64 characters" })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { error: "Password must be minimum 8 characters long" })
    .max(128, { error: "Password must not exceed 128 characters" }),
  rememberMe: z.boolean(),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(5, { error: "Name must be at least 5 characters long" })
      .max(32, { error: "Name must not exceed 32 characters" }),
    email: z
      .email({ error: "Invalid email address" })
      .max(64, { error: "Email must not exceed 64 characters" })
      .toLowerCase(),
    password: z
      .string()
      .min(8, { error: "Password must be minimum 8 characters long" })
      .max(128, { error: "Password must not exceed 128 characters" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password didn't match",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof registerFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z
    .email({ error: "Invalid email address" })
    .max(64, { error: "Email must not exceed 64 characters" })
    .toLowerCase(),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { error: "Password must be minimum 8 characters long" })
      .max(128, { error: "Password must not exceed 128 characters" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Password didn't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

export const wallpaperUploadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: "Title must be at least 3 characters" })
    .max(128, { error: "Title must not exceed 128 characters" }),
  description: z
    .string()
    .max(500, { error: "Description must not exceed 500 characters" })
    .optional(),
  categoryId: z.string().uuid({ error: "Invalid category" }),
  tags: z.array(z.string().uuid({ error: "Invalid tag" })).optional(),
});

export type WallpaperUploadFormType = z.infer<typeof wallpaperUploadSchema>;

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(32, { error: "Name must not exceed 32 characters" }),
  description: z
    .string()
    .max(300, { error: "Description must not exceed 300 characters" })
    .optional(),
});

export type CategoryCreateFormType = z.infer<typeof categoryCreateSchema>;

export const collectionCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(64, { error: "Name must not exceed 64 characters" }),
  description: z
    .string()
    .max(300, { error: "Description must not exceed 300 characters" })
    .optional(),
  isPublic: z.boolean(),
});

export type CollectionCreateFormType = z.infer<typeof collectionCreateSchema>;

export const profileNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { error: "Name must be at least 5 characters long" })
    .max(32, { error: "Name must not exceed 32 characters" }),
});

export type ProfileNameFormType = z.infer<typeof profileNameSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { error: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { error: "Password must be minimum 8 characters long" })
      .max(128, { error: "Password must not exceed 128 characters" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords didn't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
