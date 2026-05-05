import { z } from "zod";
import { AddAsEmailReceipient, UserRole } from "@/types";

export const UserFormSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must not exceed 100 characters")
    .trim(),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .trim()
    .toLowerCase(),

  role: z
    .nativeEnum(UserRole, {
      message: "Please select a valid role",
    })
    .optional(),

  is_active: z.union([z.boolean(), z.string()]).optional(),

  addAsEmailReceipient: z
    .nativeEnum(AddAsEmailReceipient, {
      message: "Please select a choice",
    })
    .optional(),
});

export type UserFormData = z.infer<typeof UserFormSchema>;

export const ProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .trim()
    .toLowerCase(),
});

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
