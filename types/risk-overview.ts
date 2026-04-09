/* eslint-disable @typescript-eslint/no-explicit-any */

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

export interface FinancialRow {
  key: string;
  label: string;
  isCalculated?: boolean;
  formula?: string;
  dependencies?: string[];
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
};

export type FinancialValues = Record<string, Record<number, string>>;
export type NonFinancialValues = Record<string, string>;

export type PFFinancialsData = {
  balanceSheet: FinancialValues;
  incomeStatement: FinancialValues;
  cashFlow: FinancialValues;
  nonFinancials: NonFinancialValues;
  years: number[];
};

// types/financials.ts
export interface FinancialFormula {
  key: string;
  label: string;
  formula?: string; // optional, only for calculated fields
}

export interface FinancialsData {
  pf_financials: {
    balance_sheet: {
      label: string;
      data_mode: string;
      fields: FinancialFormula[];
    };
    income_statement: {
      label: string;
      data_mode: string;
      fields: FinancialFormula[];
    };
    other_inputs?: {
      label: string;
      data_mode: string;
      fields: FinancialFormula[];
    };
  };
}

export type RowReturnType = {
  label: string;
  isCalculated?: boolean | undefined;
  values?: number[] | undefined;
  value?: string | number | null;
}[];

export interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}
export interface CaseItem {
  id: string;
  case_number: string;
  customer_name: string;
  facility_type: string;
  project_type: string;
  status: string;
  rater_name: string;
  validator_name: string | null;
  rating: string | null;
  last_updated: string;
}

export interface CalculateResponseData {
  customer_name: string;
  project_type: string;
  year_of_financials: number;
  date_of_rating: string;
  name_of_rater: string;
  showstoppers: {
    SHOWSTOPPERS: string[];
    STATUS: string[];
  };
  initial_pf_score: number | null;
  initial_cf_score: number | null;
  baseline_score: number | null;
  baseline_rating: string | null;
}

export interface CalculateResponse {
  success: boolean;
  status_code: number;
  message: string;
  detail: string;
  error: string;
  data: CalculateResponseData;
}

// Case Details Response Types
export interface PFFinancials {
  years: number[];
  balance_sheet: Record<string, number[]>;
  income_statement: Record<string, number[]>;
  cashflow: Record<string, number[]>;
  ratios: Record<string, number[]>;
}

export interface CFFinancials {
  balance_sheet_main: Record<string, number[]>;
  balance_sheet_other_details: Record<string, any>;
  income_statement: Record<string, number>;
  years: number[];
}

export interface PFNonFinancials {
  [sectionName: string]: {
    [subsectionName: string]: {
      [fieldName: string]: string;
    };
  };
}

export interface CFNonFinancials {
  "Corporate Non-financial": {
    Management?: Record<string, string>;
    Business?: Record<string, string>;
    Industry?: Record<string, string>;
    "Reliability of Financial Statement"?: Record<string, string>;
  };
}

export interface ShowstoppersData {
  SHOWSTOPPERS: string[];
  STATUS: string[];
}

export interface CaseDetails {
  id: string;
  case_number: string;
  customer_name: string;
  facility_type: string;
  project_type: string;
  status: string;
  rater_name: string;
  validator_name: string | null;
  rating: string | null;
  last_updated: string;
  consistent_revenue_growth: boolean;
  market_event_losses: boolean;
  applicable_market_events?: string;
  market_event_description?: string;
  dre_project_selection?: Record<string, string>;
  year_of_financials: number;
  credit_history_adjustment: string;
  reviewed_at?: string;
  validator_notes?: string;
  pf_financials: PFFinancials;
  cf_financials: CFFinancials;
  pf_non_financials: PFNonFinancials;
  cf_non_financials: CFNonFinancials;
  showstoppers: ShowstoppersData;
  combined_results?: any;
}

export type ActiveDetailsSheet = "details" | "returned" | "validation" | null;