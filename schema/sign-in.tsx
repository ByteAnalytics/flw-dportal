import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z
    .string({ message: "Email is required." })
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  pwd: z.string({ message: "Password is required." }),

  // .regex(/[\W_]/, {
  //   message: "Password must contain at least one special character.",
  // }),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;
