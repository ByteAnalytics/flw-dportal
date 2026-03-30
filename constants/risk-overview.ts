import {
  CombinedReportData,
  ReportSummaryData,
} from "@/components/dashboard/risk-overview/CFReportsSheet";
import { TableColumn } from "@/components/ui/custom-table";

export const RECENT_RISK_CASES_COLUMN: TableColumn[] = [
  { key: "caseId", label: "CASE NO", width: "w-[100px]" },
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
    label: "Combined (PF & CF)",
    value: "Combined (PF & CF)", // was "Combined (PF and Corporate)"
  },
];

export const marketEventOptions = [
  { label: "Natural disaster", value: "Natural disaster" }, // lowercase 'd', removed "War"
  { label: "Terrorist attacks", value: "Terrorist attacks" },
  { label: "Militancy", value: "Militancy" },
  { label: "Unexpected legislation", value: "Unexpected legislation" },
];

export const dreProjectOptions = [
  {
    label: "Grid",
    value: "Grid (Mini, Mesh Grid & Interconnected)",
  },
  {
    label: "C&I",
    value: "C&I",
  },
  {
    label: "Solar",
    value: "Solar (Stand-alone SHB, SHS, Productive use)",
  },
  {
    label: "EVs",
    value:
      "Evs (2-Wheelers, 3 Wheelers, 4-Wheelers, Battery Swapping, Charging Stations)",
  },
  {
    label: "Solar for Telco",
    value: "Solar for Telco",
  },
  {
    label: "Productive use of equipment",
    value: "Productive use of equipment",
  },
];

export const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const PROJECT_TYPE = [
  {
    label: "DRE",
    value: "DRE",
  },
  {
    label: "Others",
    value: "Others",
  },
];

export const pfWeights = [
  { label: "0.1", value: "0.1" },
  { label: "0.2", value: "0.2" },
];

export const MOCK_PF_REPORT: ReportSummaryData = {
  customer: "Abuja Steel Roll",
  projectType: "DRE Project",
  yearOfFinancials: "09 Mar 1900",
  financialRisk: 24.5,
  operationalRisk: 24.5,
  structureRisk: 24.5,
  pfScore: "76%",
  probabilityOfDefault: 1.96,
  baselineCreditScore: "AA-",
  finalCreditScore: "BBB+",
};

export const MOCK_COMBINED_REPORT: CombinedReportData = {
  customer: "Abuja Steel Roll",
  projectType: "DRE Project",
  yearOfFinancials: "09 Mar 1900",
  pf: {
    financialRisk: 24.5,
    operationalRisk: 24.5,
    structureRisk: 24.5,
    pfScore: 24.5,
  },
  cf: {
    financialRisk: 24.5,
    operationalRisk: 24.5,
    structureRisk: 24.5,
    cfScore: 24.5,
  },
  initialPFScore: "76%",
  initialCFScore: "76%",
  probabilityOfDefault: 1.96,
  baselineCreditScore: "AA-",
  finalCreditScore: "BBB+",
};
