import { z } from "zod";

export const ProcessFormSchema = z.object({
  name: z.string().min(1, "Process name is required"),
  team_id: z.string().min(1, "Team is required"),
  point_of_contact: z.string().optional(),
  frequency: z.enum(["Daily", "Weekly", "Monthly", "Quarterly"]),
  effort: z.enum(["Low", "Medium", "High"]),
  description: z.string().optional(),
});

export type ProcessFormData = z.infer<typeof ProcessFormSchema>;
