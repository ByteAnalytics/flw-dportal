/* eslint-disable @typescript-eslint/no-explicit-any */
import { RowReturnType } from "@/types/risk-overview";

// Type-safe helper to extract non-financials value
export const extractNonFinancialValue = (
  value: unknown,
): string | number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value;

  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      const nestedValue = obj[key];
      if (typeof nestedValue === "string") return nestedValue;
      if (typeof nestedValue === "number") return nestedValue;
      if (typeof nestedValue === "object" && nestedValue !== null) {
        const deeper = extractNonFinancialValue(nestedValue);
        if (deeper !== null) return deeper;
      }
    }
  }

  return null;
};

// Helper function to extract string value from nested object for showstoppers
export const extractStringValue = (obj: unknown): string => {
  if (!obj) return "Not assessed";
  if (typeof obj === "string") return obj;
  if (typeof obj === "number") return obj.toString();

  if (typeof obj === "object" && obj !== null) {
    const values = Object.values(obj);
    for (const value of values) {
      if (typeof value === "string") return value;
      if (typeof value === "number") return value.toString();
      if (typeof value === "object" && value !== null) {
        const nested = extractStringValue(value);
        if (nested !== "Not assessed") return nested;
      }
    }
  }

  return "Not assessed";
};

// Get showstoppers from PF non-financials data
export const getShowstoppers = (details: any) => {
  const showstoppers: Array<{ id: number; criteria: string; status: string }> =
    [];

  // Extract from PF non-financials if available
  const pfNonFinancials = details.pf_non_financials;
  if (pfNonFinancials && typeof pfNonFinancials === "object") {
    // Check Political and Regulatory Factors
    const political = pfNonFinancials["Political & Regulatory factors"];
    if (political && typeof political === "object") {
      // Acquisition of all necessary supports and approvals
      const acquisition =
        political["Acquisition of all necessary supports and approvals"];
      if (acquisition) {
        const status = extractStringValue(acquisition);
        showstoppers.push({
          id: showstoppers.length + 1,
          criteria: "Acquisition of all necessary supports and approvals",
          status: status,
        });
      }

      // Stability of legal and regulatory environment
      const stability =
        political["Stability of legal and regulatory environment"];
      if (stability) {
        const status = extractStringValue(stability);
        showstoppers.push({
          id: showstoppers.length + 1,
          criteria: "Stability of legal and regulatory environment",
          status: status,
        });
      }

      // Enforceability of contracts, collateral and security
      const enforceability =
        political["Enforcement of contracts, collateral and security"];
      if (enforceability) {
        const status = extractStringValue(enforceability);
        showstoppers.push({
          id: showstoppers.length + 1,
          criteria: "Enforceability of contracts, collateral and security",
          status: status,
        });
      }

      // Government Support
      const govSupport = political["Government Support"];
      if (govSupport) {
        const status = extractStringValue(govSupport);
        showstoppers.push({
          id: showstoppers.length + 1,
          criteria: "Government Support",
          status: status,
        });
      }

      // Political Risks
      const politicalRisks = political["Political Risks"];
      if (politicalRisks) {
        const status = extractStringValue(politicalRisks);
        showstoppers.push({
          id: showstoppers.length + 1,
          criteria: "Political Risks",
          status: status,
        });
      }

      // Force Majeure
      const forceMajeure = political["Force Majeure"];
      if (forceMajeure) {
        const status = extractStringValue(forceMajeure);
        showstoppers.push({
          id: showstoppers.length + 1,
          criteria: "Force Majeure",
          status: status,
        });
      }
    }
  }

  // If no showstoppers found, return some default ones
  if (showstoppers.length === 0) {
    return [
      {
        id: 1,
        criteria: "Acquisition of all necessary supports and approvals",
        status: "All necessary approvals have been obtained",
      },
      {
        id: 2,
        criteria: "Stability of legal and regulatory environment",
        status: "Favourable and stable regulatory environment",
      },
      {
        id: 3,
        criteria: "Enforceability of contracts, collateral and security",
        status: "Contracts are enforceable",
      },
      {
        id: 4,
        criteria: "Government Support",
        status: "Project of strategic importance, strong support",
      },
      {
        id: 5,
        criteria: "Political Risks",
        status: "Low exposure, satisfactory mitigation",
      },
      {
        id: 6,
        criteria: "Force Majeure",
        status: "Limited exposure, acceptable insurance coverage",
      },
    ];
  }

  return showstoppers;
};

export const getPfFinancialsRows = (pfFinancials: any): RowReturnType => {
  return pfFinancials?.balance_sheet
    ? Object.entries(pfFinancials.balance_sheet).map(([key, values]) => ({
        label: key,
        isCalculated: key.includes("Total") || key.includes("Net"),
        values: values as number[],
      }))
    : [];
};

// Transform PF Income Statement rows
export const getPfIncomeRows = (pfFinancials: any): RowReturnType => {
  return pfFinancials?.financial_inputs
    ? Object.entries(pfFinancials.financial_inputs).map(([key, values]) => ({
        label: key,
        isCalculated:
          key.includes("Gross") ||
          key.includes("EBITDA") ||
          key.includes("EBIT") ||
          key.includes("Profit"),
        values: values as number[],
      }))
    : [];
};

// Transform PF Cash Flow rows
export const getPfCashFlowRows = (pfFinancials: any): RowReturnType => {
  return pfFinancials?.summary_cashflow
    ? Object.entries(pfFinancials.summary_cashflow).map(([key, values]) => ({
        label: key,
        isCalculated:
          key.includes("Total") || key.includes("CFADS") || key.includes("Net"),
        values: values as number[],
      }))
    : [];
};

// Transform PF Ratios rows
export const getPfRatiosRows = (pfFinancials: any): RowReturnType => {
  return pfFinancials?.ratios
    ? Object.entries(pfFinancials.ratios).map(([key, values]) => ({
        label: key,
        isCalculated: true,
        values: values as number[],
      }))
    : [];
};

// CF Balance Sheet rows
export const getCfBalanceSheetRows = (cfFinancials: any): RowReturnType => {
  return cfFinancials?.balance_sheet_main
    ? Object.entries(cfFinancials.balance_sheet_main).map(([key, values]) => ({
        label: key,
        isCalculated: key.includes("Total") || key.includes("NET"),
        values: values as number[],
      }))
    : [];
};

// CF Income Statement rows
export const getCfIncomeRows = (cfFinancials: any): RowReturnType => {
  return cfFinancials?.income_statement
    ? Object.entries(cfFinancials.income_statement).map(([key, value]) => ({
        label: key.replace("inputted_", "").replace(/_/g, " "),
        isCalculated: key.includes("profit") || key.includes("gross"),
        values: [value as number],
      }))
    : [];
};

// CF Other Inputs rows
export const getCfOtherInputsRows = (cfFinancials: any): RowReturnType => {
  return cfFinancials?.balance_sheet_other_details
    ? Object.entries(cfFinancials.balance_sheet_other_details).map(
        ([key, value]) => ({
          label: key.replace("inputted_", "").replace(/_/g, " "),
          isCalculated: false,
          values: [value as number],
        }),
      )
    : [];
};

// Then update the non-financials rows creation:
export const getPfNonFinancialsRows = (details: any): RowReturnType => {
  return details.pf_non_financials
    ? Object.entries(details.pf_non_financials).map(([key, value]) => ({
        label: key,
        value: extractNonFinancialValue(value),
      }))
    : [];
};

export const getCfNonFinancialsRows = (details: any): RowReturnType => {
  return details.cf_non_financials
    ? Object.entries(details.cf_non_financials).map(([key, value]) => ({
        label: key,
        value: extractNonFinancialValue(value),
      }))
    : [];
};

export const convertPFToApiFormat = (data: {
  balanceSheet: Record<string, Record<number, string>>;
  incomeStatement: Record<string, Record<number, string>>;
  cashFlow: Record<string, Record<number, string>>;
  otherInputs: Record<string, Record<number, string>>;
  years: number[];
}) => {
  const payload: {
    pf_financials: {
      years: number[];
      balance_sheet: Record<string, number[]>;
      financial_inputs: Record<string, number[]>;
      summary_cashflow: Record<string, number[]>;
      other_inputs: Record<string, number[]>;
    };
  } = {
    pf_financials: {
      years: data.years,
      balance_sheet: {},
      financial_inputs: {},
      summary_cashflow: {},
      other_inputs: {},
    },
  };

  // Balance Sheet mapping
  const BALANCE_SHEET_API_MAP: Record<string, string> = {
    totalNonCurrentAssets: "Total Non-Current Assets",
    currentAssets: "Current Assets",
    totalCurrentLiabilities: "Total Current Liabilities",
    longTermLiabilities: "Long-term Liabilities",
    shareCapital: "Share Capital",
    retainedEarnings: "Retained Earnings",
    concessionaryCapital: "Concessionary Capital",
    totalAssets: "Total Assets",
    totalLiabilities: "Total Liabilities",
    netAssets: "Net Assets",
  };

  Object.entries(data.balanceSheet).forEach(([componentKey, yearData]) => {
    const apiKey = BALANCE_SHEET_API_MAP[componentKey];
    if (apiKey) {
      const yearArray = data.years.map((year) => {
        const val = yearData[year];
        return val && val !== "" ? parseFloat(val.replace(/,/g, "")) : 0;
      });
      payload.pf_financials.balance_sheet[apiKey] = yearArray;
    }
  });

  // Income Statement mapping
  const INCOME_STATEMENT_API_MAP: Record<string, string> = {
    revenue: "Revenue",
    otherIncomeGrant: "Other Income - Grant",
    otherIncomeConnectionCharge: "Other Income - Connection Charge",
    operatingCost: "Operating Cost",
    grossProfit: "Gross Profit",
    depreciation: "Depreciation",
    interestIncome: "Interest Income",
    interestExpense: "Interest Expense",
    tax: "Tax",
    ebitda: "EBITDA",
    ebit: "EBIT",
    profitBeforeTax: "Profit before Tax",
    profitAfterTax: "Profit after Tax",
  };

  Object.entries(data.incomeStatement).forEach(([componentKey, yearData]) => {
    const apiKey = INCOME_STATEMENT_API_MAP[componentKey];
    if (apiKey) {
      const yearArray = data.years.map((year) => {
        const val = yearData[year];
        return val && val !== "" ? parseFloat(val.replace(/,/g, "")) : 0;
      });
      payload.pf_financials.financial_inputs[apiKey] = yearArray;
    }
  });

  // Cash Flow mapping
  const CASH_FLOW_API_MAP: Record<string, string> = {
    seniorLoans: "Senior Loans",
    subLoans: "Sub Loans",
    other: "Other",
    equity: "Equity",
    totalFunding: "Total Funding",
    capex: "CAPEX",
    wcAdjustment: "W/C Adjustment",
    interestPaymentSubDebt: "Interest Payment - Sub Debt",
    principalRepaymentSubDebt: "Principal Repayment - Sub Debt",
    interestPaymentSeniorDebt: "Interest Payment - Senior Debt",
    principalRepaymentSeniorDebt: "Principal Repayment - Senior Debt",
    debtServiceReserveAccount: "Debt Service Reserve Account",
    cfads: "Cash Flow Available for Debt Service (CFADS)",
    totalDebtService: "Total Debt Service",
    netCashFlow: "Net Cash Flow",
    numberOfConnections: "Number Of Connections",
  };

  Object.entries(data.cashFlow).forEach(([componentKey, yearData]) => {
    const apiKey = CASH_FLOW_API_MAP[componentKey];
    if (apiKey) {
      const yearArray = data.years.map((year) => {
        const val = yearData[year];
        return val && val !== "" ? parseFloat(val.replace(/,/g, "")) : 0;
      });
      payload.pf_financials.summary_cashflow[apiKey] = yearArray;
    }
  });

  // Other Inputs mapping
  const OTHER_INPUTS_API_MAP: Record<string, string> = {
    loanRepayment: "Loan Repayments (Principal & Interest)",
  };

  Object.entries(data.otherInputs).forEach(([componentKey, yearData]) => {
    const apiKey = OTHER_INPUTS_API_MAP[componentKey];
    if (apiKey) {
      const yearArray = data.years.map((year) => {
        const val = yearData[year];
        return val && val !== "" ? parseFloat(val.replace(/,/g, "")) : 0;
      });
      payload.pf_financials.other_inputs[apiKey] = yearArray;
    }
  });

  return payload;
};

// Helper function to convert CF Financials data to API format
export const convertCFToApiFormat = (data: {
  balanceSheet: {
    current: Record<string, string>;
    previous: Record<string, string>;
  };
  incomeStatement: {
    current: Record<string, string>;
    previous: Record<string, string>;
  };
  otherInput: {
    current: Record<string, string>;
  };
}) => {
  const payload: {
    cf_financials: {
      balance_sheet_main: Record<string, number[]>;
      income_statement: Record<string, number>;
      balance_sheet_other_details: Record<string, number>;
    };
  } = {
    cf_financials: {
      balance_sheet_main: {},
      income_statement: {},
      balance_sheet_other_details: {},
    },
  };

  // Balance Sheet mapping
  const BALANCE_SHEET_API_MAP: Record<string, string> = {
    totalNonCurrentAssets: "Total Non-Current Assets",
    inventory: "Inventory",
    tradeDebtors: "Trade Debtors",
    otherReceivables: "Other Receivables",
    prepayment: "Prepayment",
    cashAndCashEquivalents: "Cash and Cash Equivalents",
    otherCurrentAssets: "Other Current Assets",
    totalCurrentAssets: "Total Current Assets",
    totalAssets: "TOTAL ASSETS",
    currentTaxLiabilities: "Current Tax Liabilities",
    otherCurrentLiabilities: "Total: Other Current Liabilities",
    longTermLiabilities: "Long-Term Liabilities",
    totalLiabilities: "TOTAL LIABILITIES",
    shareholdersFunds: "Shareholders' Funds",
    netAssets: "NET ASSETS",
  };

  Object.keys(data.balanceSheet.current).forEach((key) => {
    const apiKey = BALANCE_SHEET_API_MAP[key];
    if (apiKey) {
      const currentVal = data.balanceSheet.current[key];
      const previousVal = data.balanceSheet.previous[key];
      payload.cf_financials.balance_sheet_main[apiKey] = [
        currentVal ? parseFloat(currentVal.replace(/,/g, "")) : 0,
        previousVal ? parseFloat(previousVal.replace(/,/g, "")) : 0,
      ];
    }
  });

  // Income Statement mapping
  const INCOME_STATEMENT_API_MAP: Record<string, string> = {
    revenue: "inputted_revenue",
    costOfSale: "inputted_cost_of_sale",
    grossProfit: "gross_profit",
    sgaExpenses: "inputted_selling_general_and_administrative_expenses",
    depreciationAmortisation: "inputted_depreciation_and_amorisation",
    otherOperatingIncome: "inputted_other_operating_income_expenses",
    exceptionalItems: "inputted_exceptional_items_or_one_time_gains_expenses",
    otherIncome: "inputted_other_income",
    interestReceivable: "inputted_interest_receivable",
    interestPayable: "inputted_interest_payable",
    tax: "inputted_tax",
    dividendsPaid: "inputted_dividends_paid",
    operatingProfit: "operating_profit",
    pbit: "pbit",
    pbt: "pbt",
    pat: "pat",
  };

  Object.keys(data.incomeStatement.current).forEach((key) => {
    const apiKey = INCOME_STATEMENT_API_MAP[key];
    if (apiKey) {
      const value = data.incomeStatement.current[key];
      payload.cf_financials.income_statement[apiKey] = value
        ? parseFloat(value.replace(/,/g, ""))
        : 0;
    }
  });

  // Other Inputs mapping
  const OTHER_INPUTS_API_MAP: Record<string, string> = {
    loanRepayment: "inputted_loan_repayment_due_within_one_year",
    projectedCashFlow: "inputted_projected_cash_flow_in_x_years",
    numberOfYears: "inputted_no_of_years_of_projection",
    operatingCashflow:
      "inputted_operating_cash_flow_from_statement_of_cashflow",
  };

  Object.keys(data.otherInput.current).forEach((key) => {
    const apiKey = OTHER_INPUTS_API_MAP[key];
    if (apiKey) {
      const value = data.otherInput.current[key];
      payload.cf_financials.balance_sheet_other_details[apiKey] = value
        ? parseFloat(value.replace(/,/g, ""))
        : 0;
    }
  });

  return payload;
};
