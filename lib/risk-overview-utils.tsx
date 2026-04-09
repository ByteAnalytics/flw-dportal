/* eslint-disable @typescript-eslint/no-explicit-any */
import { FinancialRow, RowReturnType } from "@/types/risk-overview";

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

export const getCombinedShowstoppers = (combined: any, details: any) => {
  const showStoppersData = combined?.dashboard_rater?.showstoppers;

  const baseShowstoppers =
    showStoppersData?.SHOWSTOPPERS?.map((title: string, index: number) => ({
      id: index + 1,
      criteria: title,
      status: showStoppersData?.STATUS?.[index] || "Not assessed",
    })) || [];

  return baseShowstoppers;
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
  if (!details.cf_non_financials) return [];

  const rows: RowReturnType = [];

  // CF non-financials has a nested structure: "Corporate Non-financial" -> sections -> fields
  Object.entries(details.cf_non_financials).forEach(
    ([mainCategory, mainValue]) => {
      if (typeof mainValue === "object" && mainValue !== null) {
        Object.entries(mainValue as Record<string, unknown>).forEach(
          ([sectionName, sectionValue]) => {
            if (typeof sectionValue === "object" && sectionValue !== null) {
              Object.entries(sectionValue as Record<string, unknown>).forEach(
                ([fieldName, fieldValue]) => {
                  rows.push({
                    label: `${sectionName} - ${fieldName}`,
                    value: fieldValue as string | number | null,
                  });
                },
              );
            }
          },
        );
      }
    },
  );

  return rows;
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

export const sanitizeFormula = (formula: string): string => {
  let sanitized = formula.replace(/[–—]/g, "-");
  sanitized = sanitized.replace(/[''""]/g, "'");
  sanitized = sanitized.replace(/\u00A0/g, " ");

  return sanitized;
};

export const createSafeVariableName = (label: string): string => {
  let safeName = label
    .replace(/[–—]/g, "-")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  if (/^\d/.test(safeName)) {
    safeName = `v_${safeName}`;
  }

  return safeName;
};

export const evaluateFormulaWithRows = (
  formula: string,
  values: Record<string, string>,
  rows: FinancialRow[],
): number => {
  let expression = formula;
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

export const cleanCfLabel = (key: string): string => {
  const cleanLabel = key
    ?.replace("inputted_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return cleanLabel || key;
};

// Deep merge function to merge objects recursively
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] !== null &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        if (result[key] && typeof result[key] === "object") {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
};

export const convertPFNonFinancialsToApiFormat = (
  data: Record<string, string>,
): { pf_non_financials: Record<string, any> } => {
  const pf_non_financials: Record<string, any> = {};

  Object.entries(data).forEach(([compoundKey, value]) => {
    if (!value) return;

    // Key format: "category||subsection||question"
    const [category, subsection, question] = compoundKey.split("||");
    if (!category || !subsection || !question) return;

    if (!pf_non_financials[category]) pf_non_financials[category] = {};
    if (!pf_non_financials[category][subsection])
      pf_non_financials[category][subsection] = {};

    pf_non_financials[category][subsection][question] = value;
  });

  return { pf_non_financials };
};


export const convertCFNonFinancialsToApiFormat = (
  data: Record<string, string>,
): { cf_non_financials: Record<string, any> } => {
  const cf_non_financials: Record<string, any> = {};

  Object.entries(data).forEach(([compoundKey, value]) => {
    if (!value) return;

    // CF key format: "category||question" (2 parts, not 3)
    const [category, question] = compoundKey.split("||");
    if (!category || !question) return;

    if (!cf_non_financials[category]) cf_non_financials[category] = {};
    cf_non_financials[category][question] = value;
  });

  return { cf_non_financials };
};