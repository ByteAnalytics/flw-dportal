import { TableColumn } from "@/components/ui/custom-table";

export type { FinancialRow } from "@/types/risk-overview";
export {
  sanitizeFormula,
  createSafeVariableName,
  evaluateFormulaWithRows,
} from "@/lib/risk-overview-utils";

import type { FinancialRow } from "@/types/risk-overview";

export const VALID_STEPS = [
  "model_info",
  "pf_financials",
  "pf_non_financials",
  "pf_reports",
  "cf_financials",
  "cf_non_financials",
  "credit_history",
  "combined_reports",
] as const;

export type Step = (typeof VALID_STEPS)[number];

export const SHEET_CONFIG: Record<Step, { title: string; width: string }> = {
  model_info: { title: "Model Information", width: "sm:max-w-[500px]" },
  pf_financials: { title: "PF Financials", width: "sm:max-w-[80%]" },
  pf_non_financials: { title: "PF Non Financials", width: "sm:max-w-[80%]" },
  pf_reports: { title: "PF Reports", width: "sm:max-w-[80%]" },
  cf_financials: { title: "CF Financials", width: "sm:max-w-[80%]" },
  cf_non_financials: { title: "CF Non Financials", width: "sm:max-w-[80%]" },
  credit_history: {
    title: "Credit History Adjustment",
    width: "sm:max-w-[80%]",
  },
  combined_reports: { title: "Combined Reports", width: "sm:max-w-[80%]" },
};

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

export const OTHER_INPUTS_KEY_MAP: Record<string, string> = {
  "Loan Repayments (Principal & Interest)": "loanRepayment",
};

export const RATIOS_KEY_MAP: Record<string, string> = {
  "Sales Growth": "salesGrowth",
  "Gross Profit Margin": "grossProfitMargin",
  "EBITDA Margin": "ebitdaMargin",
  "Interest to Revenue": "interestToRevenue",
  "Debt to Equity Ratio": "debtToEquityRatio",
  "DSCR - Senior Loan": "dscrSeniorLoan",
  "DSCR - Senior and Concessionary Loan": "dscrSeniorAndConcessionary",
  "DSCR (Excluding Grants)": "dscrExcludingGrants",
  "Average Revenue Per User (ARPU)": "averageRevenuePerUser",
  "Average LCOE": "averageLCOE",
  "Average LCOE / Grant": "averageLCOEByGrant",
  "Average DSCR - Senior Loan": "averageDscrSeniorLoan",
  "Average DSCR - Senior and Concessionary Loan":
    "averageDscrSeniorAndConcessionary",
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
  "Total Current Assets": "totalCurrentAssets",
  "Total Assets": "totalAssets",
  "Total Liabilities": "totalLiabilities",
  "NET ASSETS": "netAssets",
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

export const BALANCE_SHEET_ROWS: FinancialRow[] = [
  { key: "totalNonCurrentAssets", label: "Total Non-Current Assets" },
  { key: "currentAssets", label: "Current Assets" },
  { key: "totalCurrentLiabilities", label: "Total Current Liabilities" },
  { key: "longTermLiabilities", label: "Long-term Liabilities" },
  { key: "shareCapital", label: "Share Capital" },
  { key: "retainedEarnings", label: "Retained Earnings" },
  { key: "concessionaryCapital", label: "Concessionary Capital" },
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
  { key: "revenue", label: "Revenue" },
  { key: "otherIncomeGrant", label: "Other Income - Grant" },
  {
    key: "otherIncomeConnectionCharge",
    label: "Other Income - Connection Charge",
  },
  { key: "operatingCost", label: "Operating Cost" },
  { key: "depreciation", label: "Depreciation" },
  { key: "interestIncome", label: "Interest Income" },
  { key: "tax", label: "Tax" },
  { key: "dividendsPaid", label: "Dividends Paid" },
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
      "Revenue - Operating Cost + Other Income - Grant + Other Income - Connection Charge",
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
    label: "Profit before Tax",
    isCalculated: true,
    formula: "EBIT + Interest Income",
    dependencies: ["ebit", "interestIncome"],
  },
  {
    key: "profitAfterTax",
    label: "Profit after Tax",
    isCalculated: true,
    formula: "Profit before Tax - Tax",
    dependencies: ["profitBeforeTax", "tax"],
  },
];

export const CASH_FLOW_ROWS: FinancialRow[] = [
  { key: "seniorLoans", label: "Senior Loans" },
  { key: "subLoans", label: "Sub Loans" },
  { key: "other", label: "Other" },
  { key: "equity", label: "Equity" },
  { key: "capex", label: "CAPEX" },
  { key: "wcAdjustment", label: "W/C Adjustment" },
  { key: "interestPaymentSubDebt", label: "Interest Payment - Sub Debt" },
  { key: "principalRepaymentSubDebt", label: "Principal Repayment - Sub Debt" },
  { key: "interestPaymentSeniorDebt", label: "Interest Payment - Senior Debt" },
  {
    key: "principalRepaymentSeniorDebt",
    label: "Principal Repayment - Senior Debt",
  },
  { key: "debtServiceReserveAccount", label: "Debt Service Reserve Account" },
  { key: "numberOfConnections", label: "Number Of Connections" },
  {
    key: "totalFunding",
    label: "Total Funding",
    isCalculated: true,
    formula: "Senior Loans + Sub Loans + Other + Equity",
    dependencies: ["seniorLoans", "subLoans", "other", "equity"],
  },
  { key: "ebitda_cf", label: "EBITDA" },
  { key: "tax_cf", label: "Tax" },
  {
    key: "cfads",
    label: "Cash Flow Available for Debt Service (CFADS)",
    isCalculated: true,
    formula: "EBITDA + Total Funding - CAPEX - Tax + W/C Adjustment",
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
      "Interest Payment - Sub Debt + Principal Repayment - Sub Debt + Interest Payment - Senior Debt + Principal Repayment - Senior Debt + Debt Service Reserve Account",
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
];

export const OTHER_INPUTS_ROWS: FinancialRow[] = Object.keys(
  OTHER_INPUTS_KEY_MAP,
).map((label, index) => ({
  key: Object.values(OTHER_INPUTS_KEY_MAP)[index],
  label,
}));

export const RATIOS_ROWS: FinancialRow[] = Object.keys(RATIOS_KEY_MAP).map(
  (label, index) => ({
    key: Object.values(RATIOS_KEY_MAP)[index],
    label,
    isCalculated: true,
  }),
);

export const CF_BALANCE_ROWS: FinancialRow[] = [
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
    label: "NET ASSETS",
    isCalculated: true,
    formula: "Total Assets - Total Liabilities",
    dependencies: ["totalAssets", "totalLiabilities"],
  },
];

export const CF_INCOME_ROWS: FinancialRow[] = [
  { key: "revenue", label: "inputted_revenue" },
  { key: "costOfSale", label: "inputted_cost_of_sale" },
  {
    key: "sgaExpenses",
    label: "inputted_selling_general_and_administrative_expenses",
  },
  {
    key: "depreciationAmortisation",
    label: "inputted_depreciation_and_amorisation",
  },
  {
    key: "otherOperatingIncome",
    label: "inputted_other_operating_income_expenses",
  },
  {
    key: "exceptionalItems",
    label: "inputted_exceptional_items_or_one_time_gains_expenses",
  },
  { key: "otherIncome", label: "inputted_other_income" },
  { key: "interestReceivable", label: "inputted_interest_receivable" },
  { key: "interestPayable", label: "inputted_interest_payable" },
  { key: "tax", label: "inputted_tax" },
  { key: "dividendsPaid", label: "inputted_dividends_paid" },
  {
    key: "grossProfit",
    label: "gross_profit",
    isCalculated: true,
    formula: "inputted_revenue - inputted_cost_of_sale",
    dependencies: ["revenue", "costOfSale"],
  },
  {
    key: "operatingProfit",
    label: "operating_profit",
    isCalculated: true,
    formula:
      "gross_profit - inputted_selling_general_and_administrative_expenses - inputted_depreciation_and_amorisation + inputted_other_operating_income_expenses",
    dependencies: [
      "grossProfit",
      "sgaExpenses",
      "depreciationAmortisation",
      "otherOperatingIncome",
    ],
  },
  {
    key: "pbit",
    label: "pbit",
    isCalculated: true,
    formula:
      "operating_profit + inputted_exceptional_items_or_one_time_gains_expenses + inputted_other_income + inputted_interest_receivable",
    dependencies: [
      "operatingProfit",
      "exceptionalItems",
      "otherIncome",
      "interestReceivable",
    ],
  },
  {
    key: "pbt",
    label: "pbt",
    isCalculated: true,
    formula: "pbit - inputted_interest_payable",
    dependencies: ["pbit", "interestPayable"],
  },
  {
    key: "pat",
    label: "pat",
    isCalculated: true,
    formula: "pbt - inputted_tax",
    dependencies: ["pbt", "tax"],
  },
];

export const CF_OTHER_INPUT_ROWS: FinancialRow[] = Object.keys(
  CF_OTHER_INPUTS_KEY_MAP,
).map((label, index) => ({
  key: Object.values(CF_OTHER_INPUTS_KEY_MAP)[index],
  label,
}));

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
    value: "Combined (PF & CF)",
  },
];

export const marketEventOptions = [
  { label: "Natural disaster", value: "Natural disaster" },
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