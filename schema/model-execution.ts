import { z } from "zod";

export const ModelExecutionFormSchema = z.object({
  execution_date: z.date({
    message: "Execution date is required",
  }),
});

export const RiskFormSchema = z.object({
  ahf: z
    .string()
    .min(1, "Raing must be at least 1 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  hto: z
    .string()
    .min(1, "Raing must be at least 1 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  rhf: z
    .string()
    .min(1, "Raing must be at least 1 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  lidf: z
    .string()
    .min(1, "Raing must be at least 1 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
});

export type ModelExecutionFormData = z.infer<typeof ModelExecutionFormSchema>;

export type RiskFormData = z.infer<typeof RiskFormSchema>;
