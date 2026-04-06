/* eslint-disable @typescript-eslint/no-explicit-any */
import { CaseDetails } from "@/stores/risk-overview-store";
import { useGet, usePatch, usePost } from "./use-queries";
import { ApiResponse } from "@/types";
import { toast } from "sonner";
import {
  convertCFToApiFormat,
  convertPFToApiFormat,
  convertPFNonFinancialsToApiFormat,
  convertCFNonFinancialsToApiFormat,
} from "@/lib/risk-overview-utils";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

export type Validator = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  last_login: string;
  is_temp_password: boolean;
  is_email_recipient: boolean;
};

export type ValidatorsResponse = {
  total_count: number;
  data: Validator[];
};

export const useCaseDetails = (caseId?: string) => {
  return useGet<ApiResponse<CaseDetails>>(
    ["case-details", caseId ?? ""],
    caseId ? `/crr/cases/${caseId}` : "",
    {
      enabled: !!caseId,
      staleTime: 0,
    },
  );
};

export const useGetValidators = () => {
  return useGet<ValidatorsResponse>(["validators"], "/users/validators", {
    staleTime: 5 * 60 * 1000, // 5 min — validator list changes infrequently
  });
};

export const useSaveFinancials = (caseId?: string) => {
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

export const useUpdateCase = (caseId?: string) => {
  return usePatch<ApiResponse<any>, any>(caseId ? `/crr/cases/${caseId}` : "", [
    "cases",
  ]);
};

export const useCalculateCase = (caseId?: string) => {
  return usePost<ApiResponse<any>, unknown>(
    caseId ? `/crr/cases/${caseId}/calculate` : "",
    ["case-calculations"],
  );
};

export const useSubmitCase = (caseId: string) => {
  return usePost<ApiResponse<any>, unknown>(
    caseId ? `/crr/cases/${caseId}/submit` : "",
    ["cases"],
  );
};

export const useApproveCase = (caseId?: string) => {
  return usePost<ApiResponse<any>, unknown>(
    caseId ? `/crr/cases/${caseId}/approve` : "",
    ["cases"],
  );
};

export const useReturnCase = (caseId?: string) => {
  return usePost<ApiResponse<any>, unknown>(
    caseId ? `/crr/cases/${caseId}/return` : "",
    ["cases"],
  );
};

// Reusable update handler for next button
export const useUpdateProgress = (
  type:
    | "pf_financials"
    | "pf_non_financials"
    | "cf_financials"
    | "cf_non_financials"
    | "credit_history"
    | "model_info",
  caseId: string,
) => {
  const updateCase = useUpdateCase(caseId);

  const updateProgress = async (data: any) => {
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
      } else if (type === "pf_non_financials") {
        payload = convertPFNonFinancialsToApiFormat(data);
      } else if (type === "cf_non_financials") {
        payload = convertCFNonFinancialsToApiFormat(data);
      } else if (type === "credit_history") {
        payload = {
          credit_history_adjustment:
            data.credit_history_adjustment || "Not applicable",
        };
      } else payload = data;

      const success = await updateCase.mutateAsync(payload);
      toast.success(
        extractSuccessMessage(
          success,
          `Progress saved successfully!`,
        ),
      );
      return true;
    } catch (error: any) {
      console.error(`Error updating case:`, error);
      toast.error(
        extractErrorMessage(
          error,
          `Failed to save progress. Please try again.`,
        ),
      );
      return false;
    }
  };

  return { updateProgress, isPending: updateCase.isPending };
};

// Reusable save draft handler
export const useSaveDraft = (
  type:
    | "pf_financials"
    | "pf_non_financials"
    | "cf_financials"
    | "cf_non_financials"
    | "credit_history",
  caseId: string,
) => {
  const savePFFinancials = useSaveFinancials(caseId);
  const saveCFFinancials = useSaveFinancials(caseId);
  const savePFNonFinancials = useSaveFinancials(caseId);
  const saveCFNonFinancials = useSaveFinancials(caseId);

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
        return savePFFinancials;
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
      } else if (type === "pf_non_financials") {
        payload = convertPFNonFinancialsToApiFormat(data);
      } else if (type === "cf_non_financials") {
        payload = convertCFNonFinancialsToApiFormat(data);
      } else if (type === "credit_history") {
        payload = {
          credit_history_adjustment:
            data.credit_history_adjustment || "Not applicable",
        };
      }

      const mutation = getMutation();
      const success = await mutation.mutateAsync(payload);

      toast.success(
        extractSuccessMessage(
          success,
          `${type.replace("_", " ")} saved successfully!`,
        ),
      );
      return true;
    } catch (error: any) {
      console.error(`Error saving ${type}:`, error);
      toast.error(
        extractErrorMessage(error, `Failed to save ${type}. Please try again.`),
      );
      return false;
    }
  };

  return { saveDraft, isPending: getMutation().isPending };
};
