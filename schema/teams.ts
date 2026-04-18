import { z } from "zod";

export const TeamFormSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
});

export type TeamFormData = z.infer<typeof TeamFormSchema>;
