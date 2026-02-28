import { z } from "zod";

export const ResetPasswordFormSchema = z
  .object({
    pwd: z
      .string({ message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/\d/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character.",
      }),
    cpwd: z
      .string({ message: "Please confirm your password." })
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.pwd === data.cpwd, {
    path: ["cpwd"],
    message: "Passwords do not match.",
  });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>;
