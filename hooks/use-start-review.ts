"use client";

import { ApiResponse } from "@/types";
import { usePost } from "./use-queries";
import { useState } from "react";
import { extractErrorMessage } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const useStartReview = (caseId: string) => {
  return usePost<ApiResponse<any>, unknown>(
    caseId ? `/crr/cases/${caseId}/start-review` : "",
    ["case-start-review", caseId],
  );
};

export function useInitializeReviewSheet(
  caseId?: string | null,
  onSuccess?: () => void,
) {
    const queryClient = useQueryClient();
  const { mutateAsync: startReview, isPending: isStartingReview } =
    useStartReview(caseId || "");

  const [initError, setInitError] = useState<string | null>(null);

  const startReviewForCase = async () => {
    if (!caseId) return false;

    try {
      setInitError(null);
      await startReview({});
      queryClient.invalidateQueries({
        queryKey: ["case-details", caseId],
      });
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to initialize review for this case. Please try again.",
      );
      setInitError(errorMessage);
      return false;
    }
  };

  return {
    startReviewForCase,
    isStartingReview,
    initError,
    clearError: () => setInitError(null),
  };
}
