import { z } from "zod";

export const NewCaseSchema = z.object({
  select_project_type: z.string().min(1, "This field is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  facility_type: z.string().min(1, "Facility type is required"),
  revenue_growth: z.string().min(1, "This field is required"),
  counterparty_losses: z.string().min(1, "This field is required"),
  market_events: z.string().optional(),
  market_event_description: z.string().optional(),
  year_of_financials: z.string().optional(),
  dre_project: z.string().min(1, "Please select a DRE project"),
  // manual_weightages: z.string().min(1, "This field is required"),
  // pf_weight: z.string().optional(),
  // cf_weight: z.string().optional(),
});

export type NewCaseFormData = z.infer<typeof NewCaseSchema>;
