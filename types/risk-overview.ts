export interface Case {
  case_id: string;
  customer_name: string;
  facility_type: string;
  rater: string;
  validator: string;
  last_updated: string;
  status: "VALIDATED" | "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  rating: string;
}

export interface CasesResponse {
  total_count: number;
  page: number;
  page_size: number;
  data: Case[];
}

export interface CaseOverviewData {
  total_cases: number;
  pending_review: number;
  approved_cases: number;
  rejected_cases: number;
  avg_rating: string;
}

export type PeriodValues = Record<string, string>;
export type AutoComputedValues = Record<string, string>;

export type CFFinancialsData = {
  balanceSheet: { current: PeriodValues; previous: PeriodValues };
  incomeStatement: {
    current: PeriodValues;
    previous: PeriodValues;
    autoComputed: AutoComputedValues;
  };
  otherInput: {
    current: PeriodValues;
    previous: PeriodValues;
    autoComputed: AutoComputedValues;
  };
  nonFinancials: Record<string, string>;
};