import { ExecutableModels } from "./model-execution";

export interface EADApiItem {
  model_execution_id: string;
  model_type: string;
  execution_status: reportStatus;
  ead_df: {
    data: {
      Obligor: string;
      "2025-12-31": number;
      "2026-01-31": number;
      "2026-02-28": number;
      "2026-03-31": number;
      "2026-04-30": number;
      "2026-05-31": number;
      "2026-06-30": number;
      "2026-07-31": number;
      "2026-08-31": number;
      "2026-09-30": number;
      "2026-10-31": number;
      "2026-11-30": number;
      "2026-12-31": number;
      "2027-01-31": number;
      "2027-02-28": number;
      "2027-03-31": number;
      "2027-04-30": number;
      "2027-05-31": number;
      "2027-06-30": number;
      "2027-07-31": number;
      "2027-08-31": number;
      "2027-09-30": number;
      "2027-10-31": number;
      "2027-11-30": number;
      "2027-12-31": number;
      "2028-01-31": number;
      "2028-02-29": number;
      "2028-03-31": number;
      "2028-04-30": number;
      "2028-05-31": number;
      "2028-06-30": number;
      "2028-07-31": number;
      "2028-08-31": number;
      "2028-09-30": number;
      "2028-10-31": number;
      "2028-11-30": number;
      "2028-12-31": number;
      "2029-01-31": number;
      "2029-02-28": number;
      "2029-03-31": number;
      "2029-04-30": number;
      "2029-05-31": number;
      "2029-06-30": number;
      "2029-07-31": number;
      "2029-08-31": number;
      "2029-09-30": number;
      "2029-10-31": number;
      "2029-11-30": number;
      "2029-12-31": number;
      "2030-01-31": number;
      "2030-02-28": number;
      "2030-03-31": number;
      "2030-04-30": number;
      "2030-05-31": number;
      "2030-06-30": number;
      "2030-07-31": number;
      "2030-08-31": number;
      "2030-09-30": number;
      "2030-10-31": number;
      "2030-11-30": number;
      "2030-12-31": number;
    }[];
    total_logs: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
}

export interface LGDApiItem {
  model_execution_id: string;
  model_type: string;
  execution_status: reportStatus;
  lgd_df: {
    data: {
      "Asset Description": string;
      "Total Exposure": number;
      "Adjusted Collateral": number;
      "Secured Recovery": number;
      "Secured LGD": number;
      "Unsecured LGD": number;
      "Final LGD": number;
    }[];
    total_logs: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
  lgd_summary: {
    KPMG_Average_Final_LGD: number;
    Average_Final_Recovery_Rate: number;
    KPMG_Weighted_Average_Final_LGD: number;
    Moody_Senior_Unsecured_Recovery: number;
    Moody_Senior_Unsecured_LGD: number;
  };
}

export interface PDApiItem {
  model_execution_id: string;
  model_type: string;
  execution_status: reportStatus;
  pd_yearly_combo_metrics: {
    data: {
      rating_index: number;
      Rating: string;
      PD_Metric: string;
      "Year 1": number;
      "Year 2": number;
      "Year 3": number;
      "Year 4": number;
      "Year 5": number;
      "Year 6": number;
      "Year 7": number;
      "Year 8": number;
      "Year 9": number;
      "Year 10": number;
      "Year 11": number;
      "Year 12": number;
      "Year 13": number;
      "Year 14": number;
      "Year 15": number;
    }[];
    total_logs: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
  pd_monthly_combo_metrics: {
    data: {
      rating_index: number;
      Rating: string;
      PD_Metric: string;
      Scenario: string;
      M1: number;
      M2: number;
      M3: number;
      M4: number;
      M5: number;
      M6: number;
      M7: number;
      M8: number;
      M9: number;
      M10: number;
      M11: number;
      M12: number;
      M13: number;
      M14: number;
      M15: number;
      M16: number;
      M17: number;
      M18: number;
      M19: number;
      M20: number;
      M21: number;
      M22: number;
      M23: number;
      M24: number;
      M25: number;
      M26: number;
      M27: number;
      M28: number;
      M29: number;
      M30: number;
      M31: number;
      M32: number;
      M33: number;
      M34: number;
      M35: number;
      M36: number;
      M37: number;
      M38: number;
      M39: number;
      M40: number;
      M41: number;
      M42: number;
      M43: number;
      M44: number;
      M45: number;
      M46: number;
      M47: number;
      M48: number;
      M49: number;
      M50: number;
      M51: number;
      M52: number;
      M53: number;
      M54: number;
      M55: number;
      M56: number;
      M57: number;
      M58: number;
      M59: number;
      M60: number;
    }[];
  };
  total_logs: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

export interface ECLStageSummary {
  total_assets: number;
  EAD: number;
  ECL: number;
}

export interface ECLScenarioSummary {
  total_assets: number;
  total_ead: number;
  total_ecl: number;
  summary_per_stage: {
    "Stage 1": ECLStageSummary;
    "Stage 2": ECLStageSummary;
    "Stage 3": ECLStageSummary;
  };
}

export interface ECLSummaryDfRow {
  Scenario: string;
  "Prob  of Scenarios": number;
  "ECL Stage 1": number;
  "ECL Stage 2": number;
  "ECL Stage 3": number;
  "TOTAL ECL": number;
  "Weighted ECL": number;
}

export interface ECLWeightedSummaryRow {
  "Carrying Amount": number;
  "Weighted Stage 1": number;
  "Weighted Stage 2": number;
  "Weighted Stage 3": number;
  "Weighted Total ECL": number;
  "OVERALL Weighted ECL": number;
}

export interface ECLPerAssetRow {
  "Counter Party": string;
  "Carrying Amount": number;
  Baseline: number;
  "Best Case": number;
  "Worst Case": number;
  "Probability Weighted ECL": number;
  "ECL with Scalar": number;
  "ECL Ratio": number;
}

interface ECLDfRow {
  Scenario: string;
  "Counter Party": string;
  Rating: string;
  Stage: number;
  ECL: number;
  M0: number;
  M1: number;
  M2: number;
  M3: number;
  M4: number;
  M5: number;
  M6: number;
  M7: number;
  M8: number;
  M9: number;
  M10: number;
  M11: number;
  M12: number;
  M13: number;
  M14: number;
  M15: number;
  M16: number;
  M17: number;
  M18: number;
  M19: number;
  M20: number;
  M21: number;
  M22: number;
  M23: number;
  M24: number;
  M25: number;
  M26: number;
  M27: number;
  M28: number;
  M29: number;
  M30: number;
  M31: number;
  M32: number;
  M33: number;
  M34: number;
  M35: number;
  M36: number;
  M37: number;
  M38: number;
  M39: number;
  M40: number;
  M41: number;
  M42: number;
  M43: number;
  M44: number;
  M45: number;
  M46: number;
  M47: number;
  M48: number;
  M49: number;
  M50: number;
  M51: number;
  M52: number;
  M53: number;
  M54: number;
  M55: number;
  M56: number;
  M57: number;
  M58: number;
  M59: number;
  M60: number;
}

export interface ECLApiItem {
  model_execution_id: string;
  model_type: string;
  execution_status: reportStatus;
  ecl_summary: {
    Baseline: ECLScenarioSummary;
    "Best Case": ECLScenarioSummary;
    "Worst Case": ECLScenarioSummary;
  };
  dashboard_summary: {
    ecl_summary_per_scenario: {
      Baseline: ECLScenarioSummary;
      "Best Case": ECLScenarioSummary;
      "Worst Case": ECLScenarioSummary;
    };
    portfolio_summary: {
      total_customers: number;
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
    report_summary_page: {
      ecl_summary_df: ECLSummaryDfRow[];
      weighted_summary_df: ECLWeightedSummaryRow[];
      summary_per_asset: ECLPerAssetRow[];
    };
  };
  ecl_df_all_scenario: {
    data: ECLDfRow[];
    total_logs: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
  ecl_per_asset: {
    data: ECLPerAssetRow[];
    total_logs: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
}
export interface FLIApiItem {
  model_execution_id: string;
  model_type: string;
  execution_status: reportStatus;
  scenario_weights: {
    best_case_weight: number[];
    base_case_weight: number[];
    worst_case_weight: number[];
  };
  fli_scenarios_pd: {
    data: {
      Year: number;
      "Best Case": number;
      Baseline: number;
      "Worst Case": number;
      Probability_Weighted: number;
    }[];
    total_logs: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
  fli_scenarios_ead: {
    data: {
      Year: number;
      "Best Case": number;
      Baseline: number;
      "Worst Case": number;
      Probability_Weighted: number;
    }[];
    total_logs: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
}

export interface FileContentItem {
  rating_index: number;
  Rating: string;
  PD_Metric?: string;
  "Year 1": number;
  "Year 2": number;
  "Year 3": number;
  "Year 4": number;
  "Year 5": number;
  "Year 6": number;
  "Year 7": number;
  "Year 8": number;
  "Year 9": number;
  "Year 10": number;
  [key: string]: string | number | undefined;
}

export interface PDModelOutputApiResponseItem {
  id: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  file_content: FileContentItem[];
  model_execution_log_id: string;
}

export interface PDModelOutputApiResponse {
  data: PDModelOutputApiResponseItem[];
  page: number;
  page_size: number;
  total?: number;
  total_count?: number;
  pages?: number;
}

export interface ECLFileContentItem {
  "LOAN UNIQUE ID": string;
  "CLIENT UNIQUE ID": string;
  "CLIENT NAME": string;
  "LOAN CLASS": string;
  EAD: number;
  "PRINCIPAL LOAN AMOUNT": number;
  "DISBURSEMENT DATE (MM/DD/YYYY)": string;
  "EXPIRY DATE (MM/DD/YYYY)": string;
  LOAN_TYPE: string;
  "EFFECTIVE INT RATE (%)": number;
  REPAYMENT_FREQUENCY: string;
  STAGE: string;
  "EIR ADJUSTED": number;
  "PERIODIC EIR": number;
  PMT: number;
  "MONTHLY EIR": number;
  "COLLATERAL AMOUNT": number;
  "DISCOUNTED COLLATERAL VALUE": number;
  "COLLATERAL ALLOCATED": number;
  "FINAL LGD": number;
  "FINAL ECL": number;
  [key: string]: string | number;
}

export interface ECLApiResponseItem {
  id: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  file_content: ECLFileContentItem[];
  model_execution_log_id: string;
}

export interface ECLApiResponse {
  data: ECLApiResponseItem[];
  page: number;
  page_size: number;
  total_count: number;
}

export interface ECLStatCardProps {
  title: string;
  value: string;
  balance?: string;
}
export interface ECLStatisticsFilteredData {
  non_performing_loan_perc: number;
  performing_loan_perc: number;
  total_customer: number;
  total_ead: number;
  total_ecl: number;
  stage_1_summary: {
    EAD: number;
    ECL: number;
    customers: number;
  };
  stage_2_summary: {
    EAD: number;
    ECL: number;
    customers: number;
  };
  stage_3_summary: {
    EAD: number;
    ECL: number;
    customers: number;
  };
  customer_category: {
    PRIVATE?: number;
    PUBLIC?: number;
    "GOVT OWNED"?: number;
  };
  total_obligors: {
    "CLIENT NAME": string;
    EAD: number;
    LGD: number;
    ECL: number;
    identifier: string;
  }[];
}
export interface ECLStatisticsData {
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
  ecl_summary_per_stage: Array<{
    "LOAN CLASS": string;
    STAGE: string;
    EAD: number;
    "FINAL ECL": number;
  }>;
}

export interface ReportData {
  fileName: string;
  date: string;
  timeStamp: string;
  createdBy: {
    name: string;
    email: string;
  };
  executedModelType: ExecutableModels;
  modelCategory: string;
  status: reportStatus;
  executionStatus: string;
  id: string;
}

export interface ReportTableProps {
  data: ReportData[];
  showModelCategory?: boolean;
  currentTab?: string;
}

export interface FliApiResponse {
  data: FliApiResponseItem[];
  page: number;
  page_size: number;
  total_count: number;
  pages: number;
}

export interface FliApiResponseItem {
  id: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  file_content: {
    [key: string]: number | string;
  };
  model_execution_log_id: string;
}

export interface PDOutputTabColumnStructure {
  defaultValue: string;
  columns: string[];
  dynamic: boolean; // Whether columns should be dynamically derived from API
}

export const PDOutputTabStructures: Record<string, PDOutputTabColumnStructure> =
  {
    "monthly-marginal": {
      defaultValue: "monthly-marginal",
      columns: ["Rating", "Obligor Type", "Monthly_Marginal_PD"],
      dynamic: false, // We know the exact structure from your example
    },
    "monthly-cumulative": {
      defaultValue: "monthly-cumulative",
      columns: ["Rating", "Month No", "Cumulative_PD"],
      dynamic: true,
    },
    "monthly-combo-metrics": {
      defaultValue: "monthly-combo-metrics",
      columns: ["Rating", "Month", "PD_Metric"], // PD_Metric will be excluded in getColumns()
      dynamic: true,
    },
    "yearly-combo-metrics": {
      defaultValue: "yearly-combo-metrics",
      columns: ["Rating", "Year", "PD_Metric"], // PD_Metric will be excluded in getColumns()
      dynamic: true,
    },
    "scaled-monthly-conditional": {
      defaultValue: "scaled-monthly-conditional",
      columns: ["Rating", "Month No", "Scaled_Conditional_PD"],
      dynamic: true,
    },
    "monthly-pd": {
      defaultValue: "monthly-pd",
      columns: ["Rating", "Month No", "Monthly_PD"],
      dynamic: true,
    },
    "annual-pd": {
      defaultValue: "annual-pd",
      columns: ["Rating", "Year", "Annual_PD"],
      dynamic: true,
    },
  };

export type reportStatus =
  | "Running"
  | "Queued"
  | "Pending"
  | "Failed"
  | "Completed"
  | "Validating"
  | "Validation_Failed";
