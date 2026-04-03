import { ECLScenarioSummary,  reportStatus } from "./reporting";

export interface LegendItem {
  label: string;
  value: string;
  color: string;
}

export interface DashboardData {
  id: string;
  created_at: string;
  updated_at: string;
  total_customer: number;
  total_ead: number;
  total_ecl: number;
  performing_loan_perc: number;
  non_performing_loan_perc: number;
  ecl_totals: {
    ecl_summary: {
      "Total ECL": number;
      "ECL Stage 1": number;
      "EAD Balance Stage 1": number;
      "ECL Stage 2": number;
      "EAD Balance Stage 2": number;
      "ECL Stage 3": number;
      "EAD Balance Stage 3": number;
    };
  };
  top_obligors: Array<{
    "CLIENT NAME": string;
    EAD: number;
    LGD: number;
    ECL: number;
    identifier: string;
  }>;
  ecl_summary_per_stage: Array<{
    "LOAN CLASS": string;
    STAGE: string;
    EAD: number;
    "FINAL ECL": number;
  }>;
}

export const defaultDashboardData: DashboardData = {
  id: "",
  created_at: "",
  updated_at: "",
  total_customer: 0,
  total_ead: 0,
  total_ecl: 0,
  performing_loan_perc: 0,
  non_performing_loan_perc: 0,
  ecl_totals: {
    ecl_summary: {
      "Total ECL": 0,
      "ECL Stage 1": 0,
      "EAD Balance Stage 1": 0,
      "ECL Stage 2": 0,
      "EAD Balance Stage 2": 0,
      "ECL Stage 3": 0,
      "EAD Balance Stage 3": 0,
    },
  },
  top_obligors: [],
  ecl_summary_per_stage: [],
};

export interface DashboardApiItem {
  model_execution_id: string;
  model_type: string;
  execution_status: reportStatus;
  dashboard_summary: {
    ecl_summary_per_scenario: {
      Baseline: ECLScenarioSummary;
      "Best Case": ECLScenarioSummary;
      "Worst Case": ECLScenarioSummary;
    };
    portfolio_summary: {
      total_customers: number;
      total_transactions?:number
      total_ead: number;
      total_ecl: number;
      average_lgd: number;
      top_obligors: {
        "Counter Party": string;
        EAD: number;
        LGD: number;
        ECL: number;
        identifier: string;
      }[];
      npl_ratio: {
        non_performing_loan_perc: number;
        performing_loan_perc: number;
      };
    };
  };
}
