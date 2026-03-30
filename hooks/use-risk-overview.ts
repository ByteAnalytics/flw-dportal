/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CaseDetails,
  useRiskOverviewStore,
} from "@/stores/risk-overview-store";
import { useGet, usePatch, usePost } from "./use-queries";
import { ApiResponse } from "@/types";
import { toast } from "sonner";
import {
  convertCFToApiFormat,
  convertPFToApiFormat,
} from "@/lib/risk-overview-utils";

export const useCaseDetails = (caseId?: string) => {
  return useGet<ApiResponse<CaseDetails>>(
    ["case-details", caseId ?? ""],
    caseId ? `/crr/cases/${caseId}` : "",
    { enabled: !!caseId },
  );
};

export const useSavePFFinancials = (caseId?: string) => {
  return usePatch<ApiResponse<any>, any>(caseId ? `/crr/cases/${caseId}` : "", [
    "cases",
  ]);
};

export const useSaveCFFinancials = (caseId?: string) => {
  return usePatch<ApiResponse<any>, any>(caseId ? `/crr/cases/${caseId}` : "", [
    "cases",
  ]);
};

export const useSavePFNonFinancials = (caseId?: string) => {
  return usePatch<ApiResponse<any>, any>(caseId ? `/crr/cases/${caseId}` : "", [
    "cases",
  ]);
};

export const useSaveCFNonFinancials = (caseId?: string) => {
  return usePatch<ApiResponse<any>, any>(caseId ? `/crr/cases/${caseId}` : "", [
    "cases",
  ]);
};

export const useCreateNewCase = () => {
  return usePost<ApiResponse<any>, any>("/crr/cases", ["cases"]);
};

export const useParseTemplate = () => {
  return usePost<ApiResponse<any>, FormData>(
    "/crr/cases/financials/parse-template",
    ["parse-financial-template"],
  );
};

// Reusable save draft handler
export const useSaveDraft = (
  type:
    | "pf_financials"
    | "pf_non_financials"
    | "cf_financials"
    | "cf_non_financials"
    | "credit_history",
  caseId?: string,
) => {
  const savePFFinancials = useSavePFFinancials(caseId);
  const saveCFFinancials = useSaveCFFinancials(caseId);
  const savePFNonFinancials = useSavePFNonFinancials(caseId);
  const saveCFNonFinancials = useSaveCFNonFinancials(caseId);

  const getMutation = () => {
    switch (type) {
      case "pf_financials":
        return savePFFinancials;
      case "cf_financials":
        return saveCFFinancials;
      case "pf_non_financials":
        return savePFNonFinancials;
      case "cf_non_financials":
        return saveCFNonFinancials;
      case "credit_history":
        return savePFFinancials; // Assuming credit history uses PF financials endpoint
      default:
        return savePFFinancials;
    }
  };

  const saveDraft = async (data: any) => {
    if (!caseId) {
      toast.error("No case ID found. Please create a case first.");
      return false;
    }

    try {
      let payload;

      if (type === "pf_financials") {
        payload = convertPFToApiFormat(data);
      } else if (type === "cf_financials") {
        payload = convertCFToApiFormat(data);
      } else if (type === "pf_non_financials" || type === "cf_non_financials") {
        // For non-financials, data is directly the payload
        payload = data;
      }

      const mutation = getMutation();
      await mutation.mutateAsync(payload);

      toast.success(`${type.replace("_", " ")} saved successfully!`);
      return true;
    } catch (error: any) {
      console.error(`Error saving ${type}:`, error);
      toast.error(
        error?.message || `Failed to save ${type}. Please try again.`,
      );
      return false;
    }
  };

  return { saveDraft, isPending: getMutation().isPending };
};
