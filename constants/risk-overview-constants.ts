/* =====================================================
   RISK OVERVIEW MODULE - CONSTANTS & HELPERS
   
   This file centralizes all constants, mock data, and
   utility functions used across risk-overview components
   ===================================================== */

// ============== TYPES ==============

export type Step =
  | "model_info"
  | "pf_financials"
  | "pf_non_financials"
  | "pf_reports"
  | "cf_financials"
  | "cf_non_financials"
  | "combined_reports";

export interface FinancialRow {
  key: string;
  label: string;
  isCalculated?: boolean;
  formula?: string;
  dependencies?: string[];
}

// ============== SHEET CONFIGURATION ==============

export const VALID_STEPS: Step[] = [
  "model_info",
  "pf_financials",
  "pf_non_financials",
  "pf_reports",
  "cf_financials",
  "cf_non_financials",
  "combined_reports",
];

export const SHEET_CONFIG: Record<Step, { title: string; width: string }> = {
  model_info: { title: "Model Information", width: "sm:max-w-[500px]" },
  pf_financials: { title: "PF Financials", width: "sm:max-w-[80%]" },
  pf_non_financials: { title: "PF Non Financials", width: "sm:max-w-[80%]" },
  pf_reports: { title: "PF Reports", width: "sm:max-w-[80%]" },
  cf_financials: { title: "CF Financials", width: "sm:max-w-[80%]" },
  cf_non_financials: { title: "CF Non Financials", width: "sm:max-w-[80%]" },
  combined_reports: { title: "Combined Reports", width: "sm:max-w-[80%]" },
};

// ============== PF FINANCIAL ROWS ==============

export const BALANCE_SHEET_ROWS: FinancialRow[] = [
  // Input fields first
  { key: "totalNonCurrentAssets", label: "Total Non-Current Assets" },
  { key: "currentAssets", label: "Current Assets" },
  { key: "totalCurrentLiabilities", label: "Total Current Liabilities" },
  { key: "longTermLiabilities", label: "Long-term Liabilities" },
  { key: "shareCapital", label: "Share Capital" },
  { key: "retainedEarnings", label: "Retained Earnings" },
  { key: "concessionaryCapital", label: "Concessionary Capital" },

  // Calculated fields at the bottom
  {
    key: "totalAssets",
    label: "Total Assets",
    isCalculated: true,
    formula: "Total Non-Current Assets + Current Assets",
    dependencies: ["totalNonCurrentAssets", "currentAssets"],
  },
  {
    key: "totalLiabilities",
    label: "Total Liabilities",
    isCalculated: true,
    formula: "Total Current Liabilities + Long-term Liabilities",
    dependencies: ["totalCurrentLiabilities", "longTermLiabilities"],
  },
  {
    key: "netAssets",
    label: "Net Assets",
    isCalculated: true,
    formula: "Total Assets - Total Liabilities",
    dependencies: ["totalAssets", "totalLiabilities"],
  },
];

export const INCOME_STATEMENT_ROWS: FinancialRow[] = [
  // Input fields first
  { key: "revenue", label: "Revenue" },
  { key: "otherIncomeGrant", label: `Other Income – Grant` },
  {
    key: "otherIncomeConnectionCharge",
    label: "Other Income – Connection Charge",
  },
  { key: "operatingCost", label: "Operating Cost" },
  { key: "depreciation", label: "Depreciation" },
  { key: "interestIncome", label: "Interest Income" },
  { key: "tax", label: "Tax" },
  { key: "dividendsPaid", label: "Dividends Paid" },

  // Calculated fields at the bottom
  {
    key: "grossProfit",
    label: "Gross Profit",
    isCalculated: true,
    formula: "Revenue - Operating Cost",
    dependencies: ["revenue", "operatingCost"],
  },
  {
    key: "ebitda",
    label: "EBITDA",
    isCalculated: true,
    formula:
      "Revenue - Operating Cost + Other Income – Grant + Other Income – Connection Charge",
    dependencies: [
      "revenue",
      "operatingCost",
      "otherIncomeGrant",
      "otherIncomeConnectionCharge",
    ],
  },
  {
    key: "ebit",
    label: "EBIT",
    isCalculated: true,
    formula: "EBITDA - Depreciation",
    dependencies: ["ebitda", "depreciation"],
  },
  {
    key: "profitBeforeTax",
    label: "Profit Before Tax",
    isCalculated: true,
    formula: "EBIT + Interest Income",
    dependencies: ["ebit", "interestIncome"],
  },
  {
    key: "profitAfterTax",
    label: "Profit After Tax",
    isCalculated: true,
    formula: "Profit Before Tax - Tax",
    dependencies: ["profitBeforeTax", "tax"],
  },
  {
    key: "interestExpense",
    label: "Interest Expense",
    isCalculated: true,
    formula: "Interest Payment – Sub Debt + Interest Payment – Senior Debt",
    dependencies: [],
  },
];

export const CASH_FLOW_ROWS: FinancialRow[] = [
  // Input fields first
  { key: "seniorLoans", label: "Senior Loans" },
  { key: "subLoans", label: "Sub Loans" },
  { key: "other", label: "Other" },
  { key: "equity", label: "Equity" },
  { key: "capex", label: "CAPEX" },
  { key: "wcAdjustment", label: "Working Capital Adjustment" },
  { key: "interestPaymentSubDebt", label: "Interest Payment – Sub Debt" },
  { key: "principalRepaymentSubDebt", label: "Principal Repayment – Sub Debt" },
  { key: "interestPaymentSeniorDebt", label: "Interest Payment – Senior Debt" },
  {
    key: "principalRepaymentSeniorDebt",
    label: "Principal Repayment – Senior Debt",
  },
  { key: "debtServiceReserveAccount", label: "Debt Service Reserve Account" },
  { key: "numberOfConnections", label: "Number of Connections" },

  // Calculated fields at the bottom
  {
    key: "totalFunding",
    label: "Total Funding",
    isCalculated: true,
    formula: "Senior Loans + Sub Loans + Other + Equity",
    dependencies: ["seniorLoans", "subLoans", "other", "equity"],
  },
  {
    key: "ebitda_cf",
    label: "EBITDA",
    isCalculated: true,
    formula: "financial_inputs.EBITDA",
    dependencies: [],
  },
  {
    key: "tax_cf",
    label: "Tax",
    isCalculated: true,
    formula: "financial_inputs.Tax",
    dependencies: [],
  },
  {
    key: "cfads",
    label: "Cash Flow Available for Debt Service (CFADS)",
    isCalculated: true,
    formula:
      "EBITDA + Total Funding - CAPEX - Tax + Working Capital Adjustment",
    dependencies: [
      "ebitda_cf",
      "totalFunding",
      "capex",
      "tax_cf",
      "wcAdjustment",
    ],
  },
  {
    key: "totalDebtService",
    label: "Total Debt Service",
    isCalculated: true,
    formula:
      "Interest Payment – Sub Debt + Principal Repayment – Sub Debt + Interest Payment – Senior Debt + Principal Repayment – Senior Debt + Debt Service Reserve Account",
    dependencies: [
      "interestPaymentSubDebt",
      "principalRepaymentSubDebt",
      "interestPaymentSeniorDebt",
      "principalRepaymentSeniorDebt",
      "debtServiceReserveAccount",
    ],
  },
  {
    key: "netCashFlow",
    label: "Net Cash Flow",
    isCalculated: true,
    formula:
      "Cash Flow Available for Debt Service (CFADS) - Total Debt Service",
    dependencies: ["cfads", "totalDebtService"],
  },
  {
    key: "netAssets_cf",
    label: "Net Assets",
    isCalculated: true,
    formula: "CFADS",
    dependencies: ["cfads"],
  },
];

export const OTHER_INPUTS_ROWS: FinancialRow[] = [
  { key: "loanRepayment", label: "Loan repayments due within one year" },
];

export const RATIOS_ROWS: FinancialRow[] = [
  { key: "salesGrowth", label: "Sales Growth", isCalculated: true },
  {
    key: "grossProfitMargin",
    label: "Gross Profit Margin",
    isCalculated: true,
  },
  { key: "ebitdaMargin", label: "EBITDA Margin", isCalculated: true },
  {
    key: "interestToRevenue",
    label: "Interest to Revenue",
    isCalculated: true,
  },
  {
    key: "debtToEquityRatio",
    label: "Debt to Equity Ratio",
    isCalculated: true,
  },
  { key: "dscrSeniorLoan", label: "DSCR - Senior Loan", isCalculated: true },
  {
    key: "dscrSeniorAndConcessionaryLoan",
    label: "DSCR - Senior and Concessionary Loan",
    isCalculated: true,
  },
  {
    key: "dscrExcludingGrants",
    label: "DSCR (Excluding Grants)",
    isCalculated: true,
  },
  {
    key: "averageRevenuePerUser",
    label: "Average Revenue Per User (ARPU)",
    isCalculated: true,
  },
  { key: "averageLCOE", label: "Average LCOE", isCalculated: true },
  {
    key: "averageLCOEGrant",
    label: "Average LCOE / Grant",
    isCalculated: true,
  },
  {
    key: "averageDscrSeniorLoan",
    label: "Average DSCR - Senior Loan",
    isCalculated: true,
  },
  {
    key: "averageDscrSeniorAndConcessionaryLoan",
    label: "Average DSCR - Senior and Concessionary Loan",
    isCalculated: true,
  },
  {
    key: "averageDscrSeniorLoanExcludingGrants",
    label: "Average DSCR - Senior Loan (Excluding Grants)",
    isCalculated: true,
  },
];

// ============== CF FINANCIAL ROWS ==============

export const CF_BALANCE_ROWS: FinancialRow[] = [
  // Input fields first
  { key: "totalNonCurrentAssets", label: "Total Non-Current Assets" },
  { key: "inventory", label: "Inventory" },
  { key: "tradeDebtors", label: "Trade Debtors" },
  { key: "otherReceivables", label: "Other Receivables" },
  { key: "prepayment", label: "Prepayment" },
  { key: "cashAndCashEquivalents", label: "Cash and Cash Equivalents" },
  { key: "otherCurrentAssets", label: "Other Current Assets" },
  { key: "currentTaxLiabilities", label: "Current Tax Liabilities" },
  { key: "otherCurrentLiabilities", label: "Total: Other Current Liabilities" },
  { key: "longTermLiabilities", label: "Long-Term Liabilities" },
  { key: "shareholdersFunds", label: "Shareholders' Funds" },

  // Calculated fields at the bottom
  {
    key: "totalCurrentAssets",
    label: "Total Current Assets",
    isCalculated: true,
    formula:
      "Inventory + Trade Debtors + Other Receivables + Prepayment + Cash and Cash Equivalents + Other Current Assets",
    dependencies: [
      "inventory",
      "tradeDebtors",
      "otherReceivables",
      "prepayment",
      "cashAndCashEquivalents",
      "otherCurrentAssets",
    ],
  },
  {
    key: "totalAssets",
    label: "Total Assets",
    isCalculated: true,
    formula: "Total Current Assets + Total Non-Current Assets",
    dependencies: ["totalCurrentAssets", "totalNonCurrentAssets"],
  },
  {
    key: "totalLiabilities",
    label: "Total Liabilities",
    isCalculated: true,
    formula:
      "Current Tax Liabilities + Total: Other Current Liabilities + Long-Term Liabilities",
    dependencies: [
      "currentTaxLiabilities",
      "otherCurrentLiabilities",
      "longTermLiabilities",
    ],
  },
  {
    key: "netAssets",
    label: "Net Assets",
    isCalculated: true,
    formula: "Total Assets - Total Liabilities",
    dependencies: ["totalAssets", "totalLiabilities"],
  },
];

export const CF_INCOME_ROWS: FinancialRow[] = [
  // Input fields first
  { key: "revenue", label: "Revenue" },
  { key: "costOfSale", label: "Cost of Sale" },
  { key: "sgaExpenses", label: "Selling, General & Administrative Expenses" },
  { key: "depreciationAmortisation", label: "Depreciation & Amortisation" },
  { key: "otherOperatingIncome", label: "Other Operating Income / Expenses" },
  {
    key: "exceptionalItems",
    label: "Exceptional Items / One-Time Gains or Expenses",
  },
  { key: "otherIncome", label: "Other Income" },
  { key: "interestReceivable", label: "Interest Receivable" },
  { key: "interestPayable", label: "Interest Payable" },
  { key: "tax", label: "Tax" },
  { key: "dividendsPaid", label: "Dividends Paid" },

  // Calculated fields at the bottom
  {
    key: "grossProfit",
    label: "Gross Profit",
    isCalculated: true,
    formula: "Revenue - Cost of Sale",
    dependencies: ["revenue", "costOfSale"],
  },
  {
    key: "operatingProfit",
    label: "Operating Profit",
    isCalculated: true,
    formula:
      "Gross Profit - Selling, General & Administrative Expenses - Depreciation & Amortisation + Other Operating Income / Expenses",
    dependencies: [
      "grossProfit",
      "sgaExpenses",
      "depreciationAmortisation",
      "otherOperatingIncome",
    ],
  },
  {
    key: "pbit",
    label: "Profit Before Interest & Tax (PBIT)",
    isCalculated: true,
    formula:
      "Operating Profit + Exceptional Items / One-Time Gains or Expenses + Other Income + Interest Receivable",
    dependencies: [
      "operatingProfit",
      "exceptionalItems",
      "otherIncome",
      "interestReceivable",
    ],
  },
  {
    key: "pbt",
    label: "Profit Before Tax (PBT)",
    isCalculated: true,
    formula: "Profit Before Interest & Tax (PBIT) - Interest Payable",
    dependencies: ["pbit", "interestPayable"],
  },
  {
    key: "pat",
    label: "Profit After Tax (PAT)",
    isCalculated: true,
    formula: "Profit Before Tax (PBT) - Tax",
    dependencies: ["pbt", "tax"],
  },
];

export const CF_OTHER_INPUT_ROWS: FinancialRow[] = [
  {
    key: "loanRepayment",
    label: "Loan repayments (principal and interest) due within one year",
  },
  {
    key: "projectedCashFlow",
    label: "Projected cash flow based on company's financial projections",
  },
  { key: "numberOfYears", label: "No. of years of projection" },
  {
    key: "operatingCashflow",
    label: "Operating cash flow from statement of cashflow",
  },
];

// ============== KEY MAPPING ==============

export const BALANCE_SHEET_KEY_MAP: Record<string, string> = {
  "Total Non-Current Assets": "totalNonCurrentAssets",
  "Current Assets": "currentAssets",
  "Total Current Liabilities": "totalCurrentLiabilities",
  "Long-term Liabilities": "longTermLiabilities",
  "Share Capital": "shareCapital",
  "Retained Earnings": "retainedEarnings",
  "Concessionary Capital": "concessionaryCapital",
  "Total Assets": "totalAssets",
  "Total Liabilities": "totalLiabilities",
  "Net Assets": "netAssets",
};

export const INCOME_STATEMENT_KEY_MAP: Record<string, string> = {
  Revenue: "revenue",
  "Other Income - Grant": "otherIncomeGrant",
  "Other Income - Connection Charge": "otherIncomeConnectionCharge",
  "Operating Cost": "operatingCost",
  "Gross Profit": "grossProfit",
  Depreciation: "depreciation",
  "Interest Income": "interestIncome",
  "Interest Expense": "interestExpense",
  Tax: "tax",
  EBITDA: "ebitda",
  EBIT: "ebit",
  "Profit before Tax": "profitBeforeTax",
  "Profit after Tax": "profitAfterTax",
};

export const CASH_FLOW_KEY_MAP: Record<string, string> = {
  EBITDA: "ebitda_cf",
  "Senior Loans": "seniorLoans",
  "Sub Loans": "subLoans",
  Other: "other",
  Equity: "equity",
  "Total Funding": "totalFunding",
  CAPEX: "capex",
  Tax: "tax_cf",
  "W/C Adjustment": "wcAdjustment",
  "Cash Flow Available for Debt Service (CFADS)": "cfads",
  "Interest Payment - Sub Debt": "interestPaymentSubDebt",
  "Principal Repayment - Sub Debt": "principalRepaymentSubDebt",
  "Interest Payment - Senior Debt": "interestPaymentSeniorDebt",
  "Principal Repayment - Senior Debt": "principalRepaymentSeniorDebt",
  "Debt Service Reserve Account": "debtServiceReserveAccount",
  "Total Debt Service": "totalDebtService",
  "Net Cash Flow": "netCashFlow",
  "Number Of Connections": "numberOfConnections",
};

export const RATIOS_KEY_MAP: Record<string, string> = {
  "Sales Growth": "salesGrowth",
  "Gross Profit Margin": "grossProfitMargin",
  "EBITDA Margin": "ebitdaMargin",
  "Interest to Revenue": "interestToRevenue",
  "Debt to Equity Ratio": "debtToEquityRatio",
  "DSCR - Senior Loan": "dscrSeniorLoan",
  "DSCR - Senior and Concessionary Loan": "dscrSeniorAndConcessionaryLoan",
  "DSCR (Excluding Grants)": "dscrExcludingGrants",
  "Average Revenue Per User (ARPU)": "averageRevenuePerUser",
  "Average LCOE": "averageLCOE",
  "Average LCOE / Grant": "averageLCOEGrant",
  "Average DSCR - Senior Loan": "averageDscrSeniorLoan",
  "Average DSCR - Senior and Concessionary Loan":
    "averageDscrSeniorAndConcessionaryLoan",
  "Average DSCR - Senior Loan (Excluding Grants)":
    "averageDscrSeniorLoanExcludingGrants",
};

export const CF_BALANCE_SHEET_KEY_MAP: Record<string, string> = {
  "Total Non-Current Assets": "totalNonCurrentAssets",
  Inventory: "inventory",
  "Trade Debtors": "tradeDebtors",
  "Other Receivables": "otherReceivables",
  Prepayment: "prepayment",
  "Cash and Cash Equivalents": "cashAndCashEquivalents",
  "Other Current Assets": "otherCurrentAssets",
  "Current Tax Liabilities": "currentTaxLiabilities",
  "Total: Other Current Liabilities": "otherCurrentLiabilities",
  "Long-Term Liabilities": "longTermLiabilities",
  "Shareholders' Funds": "shareholdersFunds",
};

export const CF_INCOME_STATEMENT_KEY_MAP: Record<string, string> = {
  inputted_revenue: "revenue",
  inputted_cost_of_sale: "costOfSale",
  gross_profit: "grossProfit",
  inputted_selling_general_and_administrative_expenses: "sgaExpenses",
  inputted_depreciation_and_amorisation: "depreciationAmortisation",
  inputted_other_operating_income_expenses: "otherOperatingIncome",
  inputted_exceptional_items_or_one_time_gains_expenses: "exceptionalItems",
  inputted_other_income: "otherIncome",
  inputted_interest_receivable: "interestReceivable",
  inputted_interest_payable: "interestPayable",
  inputted_tax: "tax",
  inputted_dividends_paid: "dividendsPaid",
  operating_profit: "operatingProfit",
  pbit: "pbit",
  pbt: "pbt",
  pat: "pat",
};

export const CF_OTHER_INPUTS_KEY_MAP: Record<string, string> = {
  inputted_loan_repayment_due_within_one_year: "loanRepayment",
  inputted_projected_cash_flow_in_x_years: "projectedCashFlow",
  inputted_no_of_years_of_projection: "numberOfYears",
  inputted_operating_cash_flow_from_statement_of_cashflow: "operatingCashflow",
};

// ============== HELPER FUNCTIONS ==============

/**
 * Sanitize formula by replacing special characters with safe versions
 */
export const sanitizeFormula = (formula: string): string => {
  // Replace em dash and en dash with regular dash
  let sanitized = formula.replace(/[–—]/g, "-");

  // Replace smart quotes with regular quotes
  sanitized = sanitized.replace(/[''""]/g, "'");

  // Remove any non-standard whitespace
  sanitized = sanitized.replace(/\u00A0/g, " ");

  return sanitized;
};

/**
 * Create safe variable names from labels (valid JavaScript identifiers)
 */
export const createSafeVariableName = (label: string): string => {
  let safeName = label
    .replace(/[–—]/g, "-")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

  // Ensure it starts with a letter (prepend 'v_' if it starts with a number)
  if (/^\d/.test(safeName)) {
    safeName = `v_${safeName}`;
  }

  return safeName;
};

/**
 * Evaluate formula for calculated fields with multiple rows
 */
export const evaluateFormulaWithRows = (
  formula: string,
  values: Record<string, string>,
  rows: FinancialRow[],
): number => {
  let expression = formula;

  // Sort by label length to avoid partial replacements
  const sortedRows = [...rows].sort((a, b) => b.label.length - a.label.length);

  sortedRows.forEach((row) => {
    const escapedLabel = row.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedLabel, "g");

    if (regex.test(expression)) {
      const value = values[row.key];
      const numericValue =
        value && !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
      expression = expression.replace(regex, numericValue.toString());
    }
  });

  try {
    const result = new Function("return (" + expression + ")")();
    if (isNaN(result) || !isFinite(result)) return 0;
    return Math.round(result * 100) / 100;
  } catch (error) {
    console.error("Error evaluating formula:", formula, error);
    return 0;
  }
};

/**
 * Format number values for display
 */
export const formatFinancialValue = (value: number): string => {
  if (value === undefined || value === null) return "-";

  // Format large numbers with commas
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Format percentages (values between -100 and 100 that look like percentages)
  if (
    value <= 100 &&
    value >= -100 &&
    (value.toString().includes(".") || Math.abs(value) < 10)
  ) {
    return `${value.toFixed(2)}%`;
  }

  return value.toFixed(2);
};

/**
 * Get status color for showstoppers based on status text
 */
export const getStatusColor = (status: string): string => {
  if (
    status.toLowerCase().includes("obtained") ||
    status.toLowerCase().includes("approved")
  ) {
    return "text-green-700";
  }
  if (status.toLowerCase().includes("pending")) {
    return "text-yellow-700";
  }
  if (
    status.toLowerCase().includes("not") ||
    status.toLowerCase().includes("failed")
  ) {
    return "text-red-700";
  }
  return "text-gray-600";
};
