import { z } from "zod";

export const ModelExecutionFormSchema = z.object({
  execution_date: z.date({
    message: "Execution date is required",
  }),
  upTurn: z.number().min(0, "UpTurn must be positive").optional(),
  base: z.number().min(0, "Base must be positive").optional(),
  downTurn: z.number().min(0, "DownTurn must be positive").optional(),
});

export type ModelExecutionFormData = z.infer<typeof ModelExecutionFormSchema>;
