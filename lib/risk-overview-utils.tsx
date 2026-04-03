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

// Helper function to set nested value in object
const setNestedValue = (
  obj: Record<string, any>,
  path: string[],
  value: string,
): void => {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[path[path.length - 1]] = value;
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

// Create PF Non-Financials template with all required fields
const createPFNonFinancialsTemplate = (): Record<string, any> => ({
  "Financial Strength": {
    "Market Conditions": {
      "Market Conditions": "",
    },
    "Stress Anaylsis": {
      "Ability to meet Obigations under Stress Scenarios": "",
      "Predictability of Net Cash Flows": "",
    },
    "PPA Structure & Bankability": {
      "PPA Strength": "",
    },
    "Financial Structure": {
      "Duration of the credit compared to the duration of the project": "",
      "Amortisation Schedule": "",
      "Subordinated Debt": "",
    },
  },
  "Political & Regulatory factors": {
    "Political Risks": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Stability of legal and regulatory environment": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Government Support": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Enforcement of contracts, collateral and security": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Force Majeure": {
      "Location Specific Exposure": "",
      "Community Relations": "",
      "Environmental and Natural Hazards": "",
    },
    "Acquisition of all necessary supports and approvals": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Grant and Subsidy": {
      "Grant Timing and Financial Resilience": "",
      "Milestones for disbursement": "",
    },
  },
  "General Construction/Installation Risk": {
    "Design and Technology Risk": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Site Accessibility and Infrastructure": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "User Interface & Training Requirements": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Supply Risk": {
      "Price, Volume and Transportation Risk": "",
      "Supplier's Track Record and Financial Strength": "",
    },
    "EPC Risk": {
      "EPC Quality Assessment": "",
      "Performance Guarantees": "",
    },
    "Asset Movability": {
      "Ease of Asset Relocation": "",
      "Asset Value Retention": "",
      "Market Demand": "",
    },
  },
  "Strength of the sponsor": {
    "Sponsor's track record, Financial strength and sector experience": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Sponsor support, as evidenced by equity, ownership clause and incentive to inject additional cash if necessary":
      {
        additionalProp1: "",
        additionalProp2: "",
        additionalProp3: "",
      },
    "Strength of SPV": {
      "Legal Structure and Ring-fencing": "",
      "Financial Independence": "",
      "Governance and Management": "",
    },
  },
  "Security Package": {
    "Lender's Control over Cash Flow": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Strength of Security Package": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Reserve Funds, (debt service, O&M, renewal and replacement)": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Charge on Assets": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
  },
  "General DRE Factors": {
    "Technology Maturity": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Offtake Risk": {
      "Nature of offtake agreement and offtaker quality": "",
      "Diversification of offtakers": "",
    },
    "Operating Risk": {
      "Scope and nature of operations and maintenance (O&M) contracts": "",
      "Operating Risk: Operator's Expertise Rating": "",
      "Project Goverance": "",
    },
    "O&M Contract Strength": {
      "Contract Type": "",
      "Service Level Agreement": "",
    },
    "System Sizing (adequacy to meet projected energy demand)": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Warranty Coverage": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Local presence and spare part availability": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "After-sales Support": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Remote Monitoring and Control": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
  },
  "Project Type DRE Factors": {
    "Grid (Mini, Mesh Grid & Interconnected)": {
      "Revenue Collection & Management": "",
      "Mini-Grid Productive Use Factor": "",
    },
    "C&I": {
      "Site Power Profile": "",
      "C&I Revenue Collection & Management": "",
    },
    "Solar (Stand-alone SHB, SHS, Productive use)": {
      "Productive Use Factor": "",
      "SBH Revenue Collection & Management": "",
    },
    "Evs (2-Wheelers, 3 Wheelers, 4-Wheelers, Battery Swapping, Charging Stations)":
      {
        "Productive Use Factor - Evs": "",
        "EV Revenue Collection & Management": "",
      },
    "Solar for Telco": {
      "Contract Type - SfT": "",
      "Location - SfT": "",
    },
    "Productive use of equipment": {
      "Operational & Utilization Model": "",
      "PUE Revenue Collection & Management": "",
    },
  },
  "ESG factors / ESMS Assessment": {
    "Environment & Social risks": {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: "",
    },
    "Third-party Environmental Impact Assessment (EIA) / Environmental & Social Management Plan (ESMP)":
      {
        additionalProp1: "",
        additionalProp2: "",
        additionalProp3: "",
      },
    "Environmental and Social Management System (ESMS) Scoring": {
      Policy: "",
      Risks: "",
      "Management & Organization": "",
      "Emergency Preparedness & Response": "",
      "Stakeholder & Grievances": "",
      "Monitoring & Reporting": "",
    },
  },
});

// Create CF Non-Financials template with all required fields
const createCFNonFinancialsTemplate = (): Record<string, any> => ({
  "Corporate Non-financial": {
    Management: {
      "Experience of Management in the Industry": "",
      "Integrity, Credentials and background of management": "",
      "Corporate Governance": "",
      "Past Payment Record and Track Record": "",
      "Succession Planning - Key man risk": "",
      "Risk Management Framework": "",
      "Local Implementation Capacity": "",
    },
    Business: {
      "Exposure to Market Risk": "",
      "Market Share": "",
      "Access to Resources": "",
      "Financial Flexibility": "",
    },
    Industry: {
      "Regulatory Environment": "",
      "Competition Dynamics": "",
      "Industry Outlook": "",
      "Market Supply-Demand Balance": "",
      "Industry Cyclicality": "",
    },
    "Reliability of Financial Statement": {
      "Reliability of Auditors": "",
      "Timeliness of Financial Statements": "",
      "Reliability of Financial Projections": "",
    },
  },
});

// Mapping for PF Non-Financials
const PF_NON_FINANCIALS_MAPPING: Record<string, string[]> = {
  marketConditions: [
    "Financial Strength",
    "Market Conditions",
    "Market Conditions",
  ],
  abilityToMeetObligations: [
    "Financial Strength",
    "Stress Anaylsis",
    "Ability to meet Obigations under Stress Scenarios",
  ],
  predictabilityOfNetCashflow: [
    "Financial Strength",
    "Stress Anaylsis",
    "Predictability of Net Cash Flows",
  ],
  ppaStrength: [
    "Financial Strength",
    "PPA Structure & Bankability",
    "PPA Strength",
  ],
  durationOfCreditVsProject: [
    "Financial Strength",
    "Financial Structure",
    "Duration of the credit compared to the duration of the project",
  ],
  amortisationSchedule: [
    "Financial Strength",
    "Financial Structure",
    "Amortisation Schedule",
  ],
  subordinatedDebt: [
    "Financial Strength",
    "Financial Structure",
    "Subordinated Debt",
  ],
  politicalRisk: [
    "Political & Regulatory factors",
    "Political Risks",
    "additionalProp1",
  ],
  stabilityOfLegalAndRegulatoryEnvironment: [
    "Political & Regulatory factors",
    "Stability of legal and regulatory environment",
    "additionalProp1",
  ],
  governmentSupport: [
    "Political & Regulatory factors",
    "Government Support",
    "additionalProp1",
  ],
  enforceabilityOfContracts: [
    "Political & Regulatory factors",
    "Enforcement of contracts, collateral and security",
    "additionalProp1",
  ],
  forceMajeure: [
    "Political & Regulatory factors",
    "Force Majeure",
    "Location Specific Exposure",
  ],
  acquisitionOfApprovals: [
    "Political & Regulatory factors",
    "Acquisition of all necessary supports and approvals",
    "additionalProp1",
  ],
  grantTiming: [
    "Political & Regulatory factors",
    "Grant and Subsidy",
    "Grant Timing and Financial Resilience",
  ],
  designAndTechnologyRisk: [
    "General Construction/Installation Risk",
    "Design and Technology Risk",
    "additionalProp1",
  ],
  siteAccessibility: [
    "General Construction/Installation Risk",
    "Site Accessibility and Infrastructure",
    "additionalProp1",
  ],
  userInterfaceTraining: [
    "General Construction/Installation Risk",
    "User Interface & Training Requirements",
    "additionalProp1",
  ],
  priceVolumeAndTransportationRisks: [
    "General Construction/Installation Risk",
    "Supply Risk",
    "Price, Volume and Transportation Risk",
  ],
  trackRecordOfContractor: [
    "General Construction/Installation Risk",
    "Supply Risk",
    "Supplier's Track Record and Financial Strength",
  ],
  completionGuarantees: [
    "General Construction/Installation Risk",
    "EPC Risk",
    "EPC Quality Assessment",
  ],
  performanceGuarantees: [
    "General Construction/Installation Risk",
    "EPC Risk",
    "Performance Guarantees",
  ],
  easeOfAssetRelocation: [
    "General Construction/Installation Risk",
    "Asset Movability",
    "Ease of Asset Relocation",
  ],
  assetValueRetention: [
    "General Construction/Installation Risk",
    "Asset Movability",
    "Asset Value Retention",
  ],
  marketDemand: [
    "General Construction/Installation Risk",
    "Asset Movability",
    "Market Demand",
  ],
  sponsorTrackRecord: [
    "Strength of the sponsor",
    "Sponsor's track record, Financial strength and sector experience",
    "additionalProp1",
  ],
  sponsorSupportAndIncentive: [
    "Strength of the sponsor",
    "Sponsor support, as evidenced by equity, ownership clause and incentive to inject additional cash if necessary",
    "additionalProp1",
  ],
  legalStructure: [
    "Strength of the sponsor",
    "Strength of SPV",
    "Legal Structure and Ring-fencing",
  ],
  financialIndependence: [
    "Strength of the sponsor",
    "Strength of SPV",
    "Financial Independence",
  ],
  governance: [
    "Strength of the sponsor",
    "Strength of SPV",
    "Governance and Management",
  ],
  lenderControlOverCashFlows: [
    "Security Package",
    "Lender's Control over Cash Flow",
    "additionalProp1",
  ],
  strengthOfCovenantPackage: [
    "Security Package",
    "Strength of Security Package",
    "additionalProp1",
  ],
  reserveFunds: [
    "Security Package",
    "Reserve Funds, (debt service, O&M, renewal and replacement)",
    "additionalProp1",
  ],
  chargeOnAssets: ["Security Package", "Charge on Assets", "additionalProp1"],
  technologyMaturity: [
    "General DRE Factors",
    "Technology Maturity",
    "additionalProp1",
  ],
  offtakeAgreement: [
    "General DRE Factors",
    "Offtake Risk",
    "Nature of offtake agreement and offtaker quality",
  ],
  diversificationOfOfftakers: [
    "General DRE Factors",
    "Offtake Risk",
    "Diversification of offtakers",
  ],
  omContracts: [
    "General DRE Factors",
    "Operating Risk",
    "Scope and nature of operations and maintenance (O&M) contracts",
  ],
  operatorExpertise: [
    "General DRE Factors",
    "Operating Risk",
    "Operating Risk: Operator's Expertise Rating",
  ],
  projectGovernance: [
    "General DRE Factors",
    "Operating Risk",
    "Project Goverance",
  ],
  typeOfConstructionContract: [
    "General DRE Factors",
    "O&M Contract Strength",
    "Contract Type",
  ],
  serviceLevelAgreement: [
    "General DRE Factors",
    "O&M Contract Strength",
    "Service Level Agreement",
  ],
  systemSizing: [
    "General DRE Factors",
    "System Sizing (adequacy to meet projected energy demand)",
    "additionalProp1",
  ],
  warrantyAgreement: [
    "General DRE Factors",
    "Warranty Coverage",
    "additionalProp1",
  ],
  localPresence: [
    "General DRE Factors",
    "Local presence and spare part availability",
    "additionalProp1",
  ],
  afterSalesSupport: [
    "General DRE Factors",
    "After-sales Support",
    "additionalProp1",
  ],
  remoteMonitoring: [
    "General DRE Factors",
    "Remote Monitoring and Control",
    "additionalProp1",
  ],
  revenueCollection: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Grid (Mini, Mesh Grid & Interconnected)",
    "Revenue Collection & Management",
  ],
  miniGridProductiveUse: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Grid (Mini, Mesh Grid & Interconnected)",
    "Mini-Grid Productive Use Factor",
  ],
  ciSitePowerProfile: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "C&I",
    "Site Power Profile",
  ],
  ciRevenueCollection: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "C&I",
    "C&I Revenue Collection & Management",
  ],
  solarProductiveUse: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Solar (Stand-alone SHB, SHS, Productive use)",
    "Productive Use Factor",
  ],
  sbhRevenueCollection: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Solar (Stand-alone SHB, SHS, Productive use)",
    "SBH Revenue Collection & Management",
  ],
  evProductiveUseFactor: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Evs (2-Wheelers, 3 Wheelers, 4-Wheelers, Battery Swapping, Charging Stations)",
    "Productive Use Factor - Evs",
  ],
  evRevenueCollection: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Evs (2-Wheelers, 3 Wheelers, 4-Wheelers, Battery Swapping, Charging Stations)",
    "EV Revenue Collection & Management",
  ],
  sftContractType: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Solar for Telco",
    "Contract Type - SfT",
  ],
  sftLocation: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Solar for Telco",
    "Location - SfT",
  ],
  pueOperationalModel: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Productive use of equipment",
    "Operational & Utilization Model",
  ],
  pueRevenueCollection: [
    "General DRE Factors",
    "Project Type DRE Factors",
    "Productive use of equipment",
    "PUE Revenue Collection & Management",
  ],
  environmentalSocialRisks: [
    "ESG factors / ESMS Assessment",
    "Environment & Social risks",
    "additionalProp1",
  ],
  eiaEsmp: [
    "ESG factors / ESMS Assessment",
    "Third-party Environmental Impact Assessment (EIA) / Environmental & Social Management Plan (ESMP)",
    "additionalProp1",
  ],
  esmsPolicy: [
    "ESG factors / ESMS Assessment",
    "Environmental and Social Management System (ESMS) Scoring",
    "Policy",
  ],
  esmsRisks: [
    "ESG factors / ESMS Assessment",
    "Environmental and Social Management System (ESMS) Scoring",
    "Risks",
  ],
  esmsManagement: [
    "ESG factors / ESMS Assessment",
    "Environmental and Social Management System (ESMS) Scoring",
    "Management & Organization",
  ],
  esmsEmergency: [
    "ESG factors / ESMS Assessment",
    "Environmental and Social Management System (ESMS) Scoring",
    "Emergency Preparedness & Response",
  ],
  esmsStakeholder: [
    "ESG factors / ESMS Assessment",
    "Environmental and Social Management System (ESMS) Scoring",
    "Stakeholder & Grievances",
  ],
  esmsMonitoring: [
    "ESG factors / ESMS Assessment",
    "Environmental and Social Management System (ESMS) Scoring",
    "Monitoring & Reporting",
  ],
};

export const convertPFNonFinancialsToApiFormat = (
  data: Record<string, string>,
): { pf_non_financials: Record<string, any> } => {
  // Start with complete template containing all required fields
  const template = createPFNonFinancialsTemplate();
  const valuePayload: Record<string, any> = {};

  // Build sparse object with only provided values
  Object.entries(data).forEach(([key, value]) => {
    const path = PF_NON_FINANCIALS_MAPPING[key];
    if (path && value) {
      setNestedValue(valuePayload, path, value);
    }
  });

  // Merge provided values into template
  const merged = deepMerge(template, valuePayload);

  return {
    pf_non_financials: merged,
  };
};

// Mapping for CF Non-Financials (Corporate)
const CF_NON_FINANCIALS_MAPPING: Record<string, string[]> = {
  experienceOfManagement: [
    "Corporate Non-financial",
    "Management",
    "Experience of Management in the Industry",
  ],
  integrityCredentials: [
    "Corporate Non-financial",
    "Management",
    "Integrity, Credentials and background of management",
  ],
  corporateGovernment: [
    "Corporate Non-financial",
    "Management",
    "Corporate Governance",
  ],
  pastPaymentRecord: [
    "Corporate Non-financial",
    "Management",
    "Past Payment Record and Track Record",
  ],
  successionPlanning: [
    "Corporate Non-financial",
    "Management",
    "Succession Planning - Key man risk",
  ],
  riskManagementFramework: [
    "Corporate Non-financial",
    "Management",
    "Risk Management Framework",
  ],
  localImplementationCapacity: [
    "Corporate Non-financial",
    "Management",
    "Local Implementation Capacity",
  ],
  exposureToMarketRisk: [
    "Corporate Non-financial",
    "Business",
    "Exposure to Market Risk",
  ],
  marketShare: ["Corporate Non-financial", "Business", "Market Share"],
  accessToResources: [
    "Corporate Non-financial",
    "Business",
    "Access to Resources",
  ],
  financialFlexibility: [
    "Corporate Non-financial",
    "Business",
    "Financial Flexibility",
  ],
  regulatoryEnvironment: [
    "Corporate Non-financial",
    "Industry",
    "Regulatory Environment",
  ],
  competitionDynamics: [
    "Corporate Non-financial",
    "Industry",
    "Competition Dynamics",
  ],
  industryOutlook: ["Corporate Non-financial", "Industry", "Industry Outlook"],
  marketSupplyDemand: [
    "Corporate Non-financial",
    "Industry",
    "Market Supply-Demand Balance",
  ],
  industryCyclicality: [
    "Corporate Non-financial",
    "Industry",
    "Industry Cyclicality",
  ],
  reliabilityOfAuditors: [
    "Corporate Non-financial",
    "Reliability of Financial Statement",
    "Reliability of Auditors",
  ],
  timelinessOfFinancials: [
    "Corporate Non-financial",
    "Reliability of Financial Statement",
    "Timeliness of Financial Statements",
  ],
  reliabilityOfProjections: [
    "Corporate Non-financial",
    "Reliability of Financial Statement",
    "Reliability of Financial Projections",
  ],
};

export const convertCFNonFinancialsToApiFormat = (
  data: Record<string, string>,
): { cf_non_financials: Record<string, any> } => {
  // Start with complete template containing all required fields
  const template = createCFNonFinancialsTemplate();
  const valuePayload: Record<string, any> = {};

  // Build sparse object with only provided values
  Object.entries(data).forEach(([key, value]) => {
    const path = CF_NON_FINANCIALS_MAPPING[key];
    if (path && value) {
      setNestedValue(valuePayload, path, value);
    }
  });

  // Merge provided values into template
  const merged = deepMerge(template, valuePayload);

  return {
    cf_non_financials: merged,
  };
};

// Reverse converter: Convert nested API PF Non-Financials to flat camelCase format
export const convertPFNonFinancialsFromApiFormat = (
  nestedData: Record<string, any>,
): Record<string, string> => {
  const flatData: Record<string, string> = {};

  // Create reverse mapping: path -> camelCase key
  Object.entries(PF_NON_FINANCIALS_MAPPING).forEach(([key, path]) => {
    let current = nestedData;
    let found = true;

    // Navigate through the nested path
    for (const segment of path) {
      if (current[segment] !== undefined) {
        current = current[segment];
      } else {
        found = false;
        break;
      }
    }

    // If we found a value at the end of the path, add it to flat data
    if (found && typeof current === "string" && current !== "") {
      flatData[key] = current;
    }
  });

  return flatData;
};

// Reverse converter: Convert nested API CF Non-Financials to flat camelCase format
export const convertCFNonFinancialsFromApiFormat = (
  nestedData: Record<string, any>,
): Record<string, string> => {
  const flatData: Record<string, string> = {};

  // Create reverse mapping: path -> camelCase key
  Object.entries(CF_NON_FINANCIALS_MAPPING).forEach(([key, path]) => {
    let current = nestedData;
    let found = true;

    // Navigate through the nested path
    for (const segment of path) {
      if (current[segment] !== undefined) {
        current = current[segment];
      } else {
        found = false;
        break;
      }
    }

    // If we found a value at the end of the path, add it to flat data
    if (found && typeof current === "string" && current !== "") {
      flatData[key] = current;
    }
  });

  return flatData;
};
