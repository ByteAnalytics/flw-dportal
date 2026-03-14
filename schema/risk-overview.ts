import { z } from "zod";

export const NewCaseSchema = z.object({
  project_type: z.string().min(1, "Project type is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  facility_type: z.string().min(1, "Facility type is required"),
  revenue_growth: z.string().min(1, "This field is required"),
  counterparty_losses: z.string().min(1, "This field is required"),
  market_events: z.string().min(1, "Please select a market event"),
  dre_project: z.string().min(1, "Please select a DRE project"),
  manual_weightages: z.string().min(1, "This field is required"),
  pf_weight: z.string().optional(),
  cf_weight: z.string().optional(),
});

export type NewCaseFormData = z.infer<typeof NewCaseSchema>;
