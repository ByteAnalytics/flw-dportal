export interface EADFileContent {
  "LOAN UNIQUE ID": string;
  "CLIENT UNIQUE ID": string;
  "CLIENT NAME": string;
  "LOAN CLASS": string;
  "OUTSTANDING BALANCE": number;
  "PRINCIPAL LOAN AMOUNT": number;
  "DISBURSEMENT DATE (MM/DD/YYYY)": string;
  "EXPIRY DATE (MM/DD/YYYY)": string;
  LOAN_TYPE: string;
  "EFFECTIVE INT RATE (%)": number;
  REPAYMENT_FREQUENCY: string;
  "OBLIGOR RISK RATING": string | null;
  PERFORMANCE_STATUS: string;
  "DAYS PAST DUE": number;
  "COLLATERAL DESCRIPTION": string;
  COLLATERAL_TYPE: string;
  COLLATERAL_LOCATION_CLASSIFICATION: string;
  "COLLATERAL CURRENCY": string;
  "COLLATERAL AMOUNT": number;
  "LAST VALUATION DATE": string | null;
  PERFECTION_STATUS: string | null;
  STAGE: number;
  "STAGING OVERRIDE": string | null;
  "DAYS PAST DUE STAGING": number;
  "PERFORMANCE STATUS STAGING": number;
  "IFRS 9 Stage": number;
  "FINAL STAGING": string;
  "TENOR (DAYS)": number;
  "TIME TO MATURITY": number;
  "EIR ADJUSTED": number;
  UNDRAWN: number;
  MATURED: string;
  "TERM IN FORCE": number;
  TENOR: number;
  "NO. OF TIMES IN A YEAR": number;
  "PERIODIC EIR": number;
  "NO OF MONTHS BEFORE PAYMENT": number;
  NPER: number;
  PMT: number;
  "MONTHLY EIR": number;
  // Monthly columns
  "Nov 2025": number;
  "Dec 2025": number;
  "Jan 2026": number;
  // ... and other monthly columns
  [key: string]: string | number | null;
}

export interface EADApiItem {
  id: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  file_content: EADFileContent[];
  model_execution_log_id: string;
}

export interface EADOutputApiResponse {
  data: EADApiItem[];
  page: number;
  page_size: number;
  total_count: number;
}

export interface LGDFileContent {
  "CLIENT UNIQUE ID": string;
  "LOAN UNIQUE ID": string;
  "CLIENT NAME": string;
  "LOAN CLASS": string;
  STAGE: string;
  "OUTSTANDING BALANCE": number;
  "EFFECTIVE INT RATE (%)": number;
  "EIR ADJUSTED": number;
  COLLATERAL_TYPE: string | null;
  "COLLATERAL AMOUNT": number;
  REMAPPED_COLLATERAL_TYPE: string | null;
  HAIRCUT: number;
  "TIME TO RECOVERY": number;
  "DISCOUNTED COLLATERAL VALUE": number;
  "COLLATERAL ALLOCATED": number;
  "COLLATERAL UTILIZED": number;
  "SECURED RECOVERY": number;
  "SECURED LGD": number;
  "UNSECURED LGD": number;
  "FINAL LGD": number;
  [key: string]: string | number | null;
}

export interface LGDApiItem {
  id: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  file_content: LGDFileContent[];
  model_execution_log_id: string;
}

export interface LGDOutputApiResponse {
  data: LGDApiItem[];
  page: number;
  page_size: number;
  total_count: number;
  pages: number;
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
  modelCategory: string;
  status: "Completed" | "Pending" | "Queued" | "Failed" | "Running";
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
