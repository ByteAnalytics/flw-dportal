import { z } from "zod";

export const ExportToEmailFormSchema = z.object({
  email: z
    .string({ message: "Email is required." })
    .min(1, { message: "Email is required." }),
});

export type ExportToEmailFormData = z.infer<typeof ExportToEmailFormSchema>;
