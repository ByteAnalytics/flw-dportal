import { TableColumn } from "@/components/ui/custom-table";

export const RECENT_RISK_CASES_COLUMN: TableColumn[] = [
  { key: "caseId", label: "CASE ID", width: "w-[100px]" },
  {
    key: "customerName",
    label: "CUSTOMER NAME",
    width: "md:w-[200px] w-[150px]",
  },
  { key: "facilityType", label: "FACILITY TYPE", align: "left" },
  { key: "rater", label: "RATER", align: "left" },
  { key: "validator", label: "VALIDATOR", align: "left" },
  { key: "lastUpdated", label: "LAST UPDATED", align: "left" },
  { key: "status", label: "STATUS", align: "left" },
  { key: "rating", label: "RATING", align: "left" },
  { key: "actions", label: "ACTIONS", align: "left" },
];

export const ratingOptions = [
  { label: "AAA", value: "AAA" },
  { label: "AA", value: "AA" },
  { label: "A", value: "A" },
  { label: "BBB+", value: "BBB+" },
  { label: "BBB", value: "BBB" },
  { label: "BB", value: "BB" },
  { label: "B", value: "B" },
  { label: "CCC", value: "CCC" },
];

export const facilityTypeOptions = [
  { label: "Pure PF", value: "Pure PF" },
  {
    label: "Combined (PF and Corporate)",
    value: "Combined (PF and Corporate)",
  },
];

export const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const marketEventOptions = [
  { label: "Natural Disaster", value: "Natural Disaster" },
  { label: "War", value: "War" },
  { label: "Terrorist attacks", value: "Terrorist attacks" },
  { label: "Militancy", value: "Militancy" },
  { label: "Unexpected legislation", value: "Unexpected legislation" },
];

export const dreProjectOptions = [
  { label: "Solar", value: "Solar" },
  { label: "Wind", value: "Wind" },
  { label: "Hydro", value: "Hydro" },
  { label: "Biomass", value: "Biomass" },
];
