/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

// Types
export type Step =
  | "model_info"
  | "pf_financials"
  | "pf_non_financials"
  | "pf_reports"
  | "cf_financials"
  | "cf_non_financials"
  | "combined_reports";

export type ProjectPath = "Pure PF" | "Combined (PF & CF)";

export interface PFCompleteData {
  balanceSheet: Record<string, Record<number, string>>;
  incomeStatement: Record<string, Record<number, string>>;
  cashFlow: Record<string, Record<number, string>>;
  otherInputs: Record<string, Record<number, string>>;
  ratios: Record<string, Record<number, string>>;
  years: number[];
}

export interface CFFinancialsData {
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
}

export interface PFNonFinancialsData {
  [key: string]: string;
}

export interface CFNonFinancialsData {
  [key: string]: string;
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
  year_of_financials: string | null;
  validator_notes: string | null;
  reviewed_at: string | null;
  pf_financials: any;
  pf_non_financials: any;
  cf_financials: any;
  cf_non_financials: any;
  combined_results: any;
}

interface RiskOverviewState {
  // Navigation
  currentStep: Step;
  caseId: string | null;
  projectPath: ProjectPath;
  isSheetOpen: boolean;
  activeDetailsSheet: "details" | "returned" | "validation" | null;
  selectedCaseId: string | null;

  // Form Data
  newCaseData: {
    facilityType?: string;
    customerName?: string;
    isDreProject?: string;
    revenueGrowth?: string;
    counterpartyLosses?: string;
    marketEvents?: string;
    marketEventDescription?: string;
    dreProject?: string;
    manualWeightages?: string;
    pfWeight?: string;
    cfWeight?: string;
    yearOfFinancials?: string;
  };

  pfFinancialsData: PFCompleteData | null;
  pfNonFinancialsData: PFNonFinancialsData | null;
  cfFinancialsData: CFFinancialsData | null;
  cfNonFinancialsData: CFNonFinancialsData | null;

  // Case Details
  caseDetails: CaseDetails | null;
  isLoadingCaseDetails: boolean;

  // Actions
  setCurrentStep: (step: Step) => void;
  setCaseId: (id: string | null) => void;
  setProjectPath: (path: ProjectPath) => void;
  setIsSheetOpen: (open: boolean) => void;
  setActiveDetailsSheet: (
    sheet: "details" | "returned" | "validation" | null,
  ) => void;
  setSelectedCaseId: (id: string | null) => void;

  setNewCaseData: (data: Partial<RiskOverviewState["newCaseData"]>) => void;
  resetNewCaseData: () => void;

  setPFFinancialsData: (data: PFCompleteData | null) => void;
  setPFNonFinancialsData: (data: PFNonFinancialsData | null) => void;
  setCFFinancialsData: (data: CFFinancialsData | null) => void;
  setCFNonFinancialsData: (data: CFNonFinancialsData | null) => void;

  setCaseDetails: (details: CaseDetails | null) => void;
  setIsLoadingCaseDetails: (loading: boolean) => void;

  resetAll: () => void;

  // Async Actions - These will be called from components using hooks
  fetchCaseDetails: (caseId: string) => Promise<void>;
  savePFDraft: (caseId: string, data: PFCompleteData) => Promise<void>;
  saveCFDraft: (caseId: string, data: CFFinancialsData) => Promise<void>;
  savePFNonFinancialsDraft: (
    caseId: string,
    data: PFNonFinancialsData,
  ) => Promise<void>;
  saveCFNonFinancialsDraft: (
    caseId: string,
    data: CFNonFinancialsData,
  ) => Promise<void>;
}

const initialState = {
  currentStep: "model_info" as Step,
  caseId: null,
  projectPath: "Pure PF" as ProjectPath,
  isSheetOpen: false,
  activeDetailsSheet: null,
  selectedCaseId: null,
  newCaseData: {},
  pfFinancialsData: null,
  pfNonFinancialsData: null,
  cfFinancialsData: null,
  cfNonFinancialsData: null,
  caseDetails: null,
  isLoadingCaseDetails: false,
};

// Helper functions to convert data to API format
const convertPFToApiFormat = (data: PFCompleteData) => {
  const apiData: any = {
    pf_financials: {
      years: data.years,
      balance_sheet: {},
      financial_inputs: {},
      summary_cashflow: {},
      other_inputs: {},
    },
  };

  // Balance Sheet mapping
  const bsMapping: Record<string, string> = {
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

  Object.entries(data.balanceSheet).forEach(([key, yearData]) => {
    const apiKey = bsMapping[key];
    if (apiKey) {
      const yearArray = data.years.map((year) => {
        const val = yearData[year];
        return val && val !== "" ? parseFloat(val.replace(/,/g, "")) : 0;
      });
      apiData.pf_financials.balance_sheet[apiKey] = yearArray;
    }
  });

  // Income Statement mapping
  const isMapping: Record<string, string> = {
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

  Object.entries(data.incomeStatement).forEach(([key, yearData]) => {
    const apiKey = isMapping[key];
    if (apiKey) {
      const yearArray = data.years.map((year) => {
        const val = yearData[year];
        return val && val !== "" ? parseFloat(val.replace(/,/g, "")) : 0;
      });
      apiData.pf_financials.financial_inputs[apiKey] = yearArray;
    }
  });

  // Cash Flow mapping
  const cfMapping: Record<string, string> = {
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

  Object.entries(data.cashFlow).forEach(([key, yearData]) => {
    const apiKey = cfMapping[key];
    if (apiKey) {
      const yearArray = data.years.map((year) => {
        const val = yearData[year];
        return val && val !== "" ? parseFloat(val.replace(/,/g, "")) : 0;
      });
      apiData.pf_financials.summary_cashflow[apiKey] = yearArray;
    }
  });

  // Other Inputs mapping
  const oiMapping: Record<string, string> = {
    loanRepayment: "Loan Repayments (Principal & Interest)",
  };

  Object.entries(data.otherInputs).forEach(([key, yearData]) => {
    const apiKey = oiMapping[key];
    if (apiKey) {
      const yearArray = data.years.map((year) => {
        const val = yearData[year];
        return val && val !== "" ? parseFloat(val.replace(/,/g, "")) : 0;
      });
      apiData.pf_financials.other_inputs[apiKey] = yearArray;
    }
  });

  return apiData;
};

const convertCFToApiFormat = (data: CFFinancialsData) => {
  const apiData: any = {
    cf_financials: {
      balance_sheet_main: {},
      income_statement: {},
      balance_sheet_other_details: {},
    },
  };

  // Balance Sheet mapping
  const bsMapping: Record<string, string> = {
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
    const apiKey = bsMapping[key];
    if (apiKey) {
      const currentVal = data.balanceSheet.current[key];
      const previousVal = data.balanceSheet.previous[key];
      apiData.cf_financials.balance_sheet_main[apiKey] = [
        currentVal ? parseFloat(currentVal.replace(/,/g, "")) : 0,
        previousVal ? parseFloat(previousVal.replace(/,/g, "")) : 0,
      ];
    }
  });

  // Income Statement mapping
  const isMapping: Record<string, string> = {
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
    const apiKey = isMapping[key];
    if (apiKey) {
      const value = data.incomeStatement.current[key];
      apiData.cf_financials.income_statement[apiKey] = value
        ? parseFloat(value.replace(/,/g, ""))
        : 0;
    }
  });

  // Other Inputs mapping
  const oiMapping: Record<string, string> = {
    loanRepayment: "inputted_loan_repayment_due_within_one_year",
    projectedCashFlow: "inputted_projected_cash_flow_in_x_years",
    numberOfYears: "inputted_no_of_years_of_projection",
    operatingCashflow:
      "inputted_operating_cash_flow_from_statement_of_cashflow",
  };

  Object.keys(data.otherInput.current).forEach((key) => {
    const apiKey = oiMapping[key];
    if (apiKey) {
      const value = data.otherInput.current[key];
      apiData.cf_financials.balance_sheet_other_details[apiKey] = value
        ? parseFloat(value.replace(/,/g, ""))
        : 0;
    }
  });

  return apiData;
};

export const useRiskOverviewStore = create<RiskOverviewState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),
      setCaseId: (id) => set({ caseId: id }),
      setProjectPath: (path) => set({ projectPath: path }),
      setIsSheetOpen: (open) => set({ isSheetOpen: open }),
      setActiveDetailsSheet: (sheet) => set({ activeDetailsSheet: sheet }),
      setSelectedCaseId: (id) => set({ selectedCaseId: id }),

      setNewCaseData: (data) =>
        set((state) => ({
          newCaseData: { ...state.newCaseData, ...data },
        })),

      resetNewCaseData: () => set({ newCaseData: {} }),

      setPFFinancialsData: (data) => set({ pfFinancialsData: data }),
      setPFNonFinancialsData: (data) => set({ pfNonFinancialsData: data }),
      setCFFinancialsData: (data) => set({ cfFinancialsData: data }),
      setCFNonFinancialsData: (data) => set({ cfNonFinancialsData: data }),

      setCaseDetails: (details) => set({ caseDetails: details }),
      setIsLoadingCaseDetails: (loading) =>
        set({ isLoadingCaseDetails: loading }),

      resetAll: () => set(initialState),

      fetchCaseDetails: async (caseId: string) => {
        set({ isLoadingCaseDetails: true });
        try {
          // This will be called from a component using useGet hook
          // We'll handle this in the component level
          set({ isLoadingCaseDetails: false });
        } catch (error) {
          set({ isLoadingCaseDetails: false });
          toast.error("Failed to load case details");
        }
      },

      savePFDraft: async (caseId: string, data: PFCompleteData) => {
        const payload = convertPFToApiFormat(data);
        // This will be handled by usePatch hook in the component
        return Promise.resolve();
      },

      saveCFDraft: async (caseId: string, data: CFFinancialsData) => {
        const payload = convertCFToApiFormat(data);
        // This will be handled by usePatch hook in the component
        return Promise.resolve();
      },

      savePFNonFinancialsDraft: async (
        caseId: string,
        data: PFNonFinancialsData,
      ) => {
        const payload = { pf_non_financials: data };
        // This will be handled by usePatch hook in the component
        return Promise.resolve();
      },

      saveCFNonFinancialsDraft: async (
        caseId: string,
        data: CFNonFinancialsData,
      ) => {
        const payload = { cf_non_financials: data };
        // This will be handled by usePatch hook in the component
        return Promise.resolve();
      },
    }),
    {
      name: "risk-overview-storage",
      partialize: (state) => ({
        newCaseData: state.newCaseData,
      }),
    },
  ),
);
