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
}[];