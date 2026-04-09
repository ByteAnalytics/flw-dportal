import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  useCalculateCase,
  useSubmitCase,
  useApproveCase,
  Validator,
} from "@/hooks/use-risk-overview";
import { CalculateResponse } from "@/types/risk-overview";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function useReportSheet(onSubmitForValidation: () => void) {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const { user } = useAuthStore((s) => s);
  const isValidValidator = user?.role === UserRole?.["SUPER USER"];

  const { caseDetails } = useRiskOverviewStore();

  const [calculateResponse, setCalculateResponse] =
    useState<CalculateResponse | null>(null);
  const [isApproveSheetOpen, setIsApproveSheetOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [isValidatorSheetOpen, setIsValidatorSheetOpen] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(
    null,
  );
  const [calculateError, setCalculateError] = useState(false);

  const { mutateAsync: calculateCase, isPending: isCalculating } =
    useCalculateCase(caseId || undefined);
  const { mutateAsync: submitCase, isPending: isSubmitting } = useSubmitCase(
    caseId || "",
  );
  const { mutateAsync: approveCase, isPending: isApproving } = useApproveCase(
    caseId || undefined,
  );

  const runCalculate = () => {
    setCalculateError(false);
    calculateCase({})
      .then((response) => {
        if (response) setCalculateResponse(response);
      })
      .catch((error) => {
        setCalculateError(true);
        toast.error(
          extractErrorMessage(
            error,
            "Failed to calculate case. Please try again.",
          ),
        );
      });
  };

  useEffect(() => {
    if (caseId) runCalculate();
  }, [caseId, calculateCase]);

  const handleSubmit = async () => {
    if (isValidValidator) {
      setIsApproveSheetOpen(true);
      return;
    }
    setIsValidatorSheetOpen(true);
  };

  const confirmSubmitWithValidator = async () => {
    if (!selectedValidator) {
      toast.error("Please select a validator before submitting.");
      return;
    }
    try {
      const success = await submitCase({ validator_id: selectedValidator.id });
      if (success) {
        toast.success(extractSuccessMessage(success, "Submitted successfully"));
        setIsValidatorSheetOpen(false);
        onSubmitForValidation();
      }
    } catch (error: any) {
      toast.error(
        extractErrorMessage(error, "Failed to submit case. Please try again."),
      );
    }
  };

  const confirmApproveRating = async () => {
    if (!approvalComment.trim()) {
      alert("Please provide a comment before approving.");
      return;
    }
    try {
      const success = await approveCase({ comment: approvalComment });
      if (success) {
        toast.success(
          extractSuccessMessage(success, "Case approved successfully"),
        );
        setIsApproveSheetOpen(false);
        onSubmitForValidation();
      }
    } catch (error: any) {
      toast.error(
        extractErrorMessage(error, "Failed to approve case. Please try again."),
      );
    }
  };

  return {
    caseId,
    isValidValidator,
    calculateResponse,
    isCalculating,
    isSubmitting,
    isApproving,
    details: caseDetails,
    isApproveSheetOpen,
    setIsApproveSheetOpen,
    approvalComment,
    setApprovalComment,
    isValidatorSheetOpen,
    setIsValidatorSheetOpen,
    selectedValidator,
    setSelectedValidator,
    handleSubmit,
    confirmSubmitWithValidator,
    confirmApproveRating,
    calculateError,
    refetchCalculate: runCalculate,
  };
}
