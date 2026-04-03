/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { Step } from "@/constants/risk-overview";
import {
  convertPFToApiFormat,
  convertCFToApiFormat,
} from "@/lib/risk-overview-utils";

export type ProjectPath = "Pure PF" | "Combined (PF & CF)";

export interface PFCompleteData {
  balanceSheet: Record<string, Record<number, string>>;
  incomeStatement: Record<string, Record<number, string>>;
  cashFlow: Record<string, Record<number, string>>;
  otherInputs: Record<string, Record<number, string>>;
  ratios: Record<string, Record<number, string>>;
  years: number[];
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
  year_of_financials: number;
  validator_notes?: string | null;
  reviewed_at?: string | null;
  submitted_at?: string;
  created_at?: string;
  consistent_revenue_growth: boolean;
  market_event_losses: boolean;
  applicable_market_events?: string;
  market_event_description?: string;
  dre_project_selection?: Record<string, string>;
  credit_history_adjustment: string;
  pf_financials: any;
  pf_non_financials: any;
  cf_financials: any;
  cf_non_financials: any;
  showstoppers: {
    SHOWSTOPPERS: string[];
    STATUS: string[];
  };
  combined_results: {
    model_information?: any;
    pf_output_dict?: any;
    cf_output_dict?: any;
    dashboard_rater?: {
      customer_name: string;
      project_type: string;
      year_of_financials: number;
      date_of_rating: string;
      name_of_rater: string;
      showstoppers?: {
        SHOWSTOPPERS: string[];
        STATUS: string[];
      };
      initial_pf_score: number | null;
      initial_cf_score: number | null;
      baseline_score: number | null;
    };
    showstoppers?: {
      SHOWSTOPPERS: string[];
      STATUS: string[];
    };
  } | null;
  //   showstoppers: {
  //     SHOWSTOPPERS: string[];
  //     STATUS: string[];
  //   };
}

interface NavigationState {
  currentStep: Step;
  caseId: string | null;
  projectPath: ProjectPath;
  isSheetOpen: boolean;
  activeDetailsSheet: "details" | "returned" | "validation" | null;
  selectedCaseId: string | null;
}

interface FormState {
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
}

interface FinancialDataState {
  pfFinancialsData: PFCompleteData | null;
  pfNonFinancialsData: PFNonFinancialsData | null;
  cfFinancialsData: any | null;
  cfNonFinancialsData: CFNonFinancialsData | null;
}

interface CaseDetailsState {
  caseDetails: CaseDetails | null;
  isLoadingCaseDetails: boolean;
}

interface RiskOverviewState
  extends NavigationState, FormState, FinancialDataState, CaseDetailsState {
  setCurrentStep: (step: Step) => void;
  setCaseId: (id: string | null) => void;
  setProjectPath: (path: ProjectPath) => void;
  setIsSheetOpen: (open: boolean) => void;
  setActiveDetailsSheet: (
    sheet: "details" | "returned" | "validation" | null,
  ) => void;
  setSelectedCaseId: (id: string | null) => void;

  setNewCaseData: (data: Partial<FormState["newCaseData"]>) => void;
  resetNewCaseData: () => void;

  setPFFinancialsData: (data: PFCompleteData | null) => void;
  setPFNonFinancialsData: (data: PFNonFinancialsData | null) => void;
  setCFFinancialsData: (data: any | null) => void;
  setCFNonFinancialsData: (data: CFNonFinancialsData | null) => void;

  setCaseDetails: (details: CaseDetails | null) => void;
  setIsLoadingCaseDetails: (loading: boolean) => void;

  resetAll: () => void;

  fetchCaseDetails: (caseId: string) => Promise<void>;
  savePFDraft: (caseId: string, data: PFCompleteData) => Promise<void>;
  saveCFDraft: (caseId: string, data: any) => Promise<void>;
  savePFNonFinancialsDraft: (
    caseId: string,
    data: PFNonFinancialsData,
  ) => Promise<void>;
  saveCFNonFinancialsDraft: (
    caseId: string,
    data: CFNonFinancialsData,
  ) => Promise<void>;
}

const initialState: NavigationState &
  FormState &
  FinancialDataState &
  CaseDetailsState = {
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

export const useRiskOverviewStore = create<RiskOverviewState>()(
  persist(
    (set) => ({
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
          set({ isLoadingCaseDetails: false });
        } catch (error) {
          set({ isLoadingCaseDetails: false });
          toast.error("Failed to load case details");
        }
      },

      savePFDraft: async (caseId: string, data: PFCompleteData) => {
        convertPFToApiFormat(data);
        return Promise.resolve();
      },

      saveCFDraft: async (caseId: string, data: any) => {
        convertCFToApiFormat(data);
        return Promise.resolve();
      },

      savePFNonFinancialsDraft: async (
        caseId: string,
        data: PFNonFinancialsData,
      ) => {
        return Promise.resolve();
      },

      saveCFNonFinancialsDraft: async (
        caseId: string,
        data: CFNonFinancialsData,
      ) => {
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
