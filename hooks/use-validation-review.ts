"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useApproveCase, useReturnCase } from "@/hooks/use-risk-overview";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { useInitializeReviewSheet } from "./use-start-review";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

export function useValidationReview(
  caseId?: string | null,
  onReturnForRevision?: () => void,
  onApproveRating?: () => void,
  status?: string | null,
) {
  const { mutateAsync: approveCase, isPending: isApproving } = useApproveCase(
    caseId || undefined,
  );

  const { mutateAsync: returnCase, isPending: isReturning } = useReturnCase(
    caseId || undefined,
  );

  const { startReviewForCase, isStartingReview, initError, clearError } =
    useInitializeReviewSheet(caseId);

  const [isApproveSheetOpen, setIsApproveSheetOpen] = useState(false);
  const [isReturnSheetOpen, setIsReturnSheetOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const initializationAttempted = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    if (status && status !== "PENDING_REVIEW") {
      setIsInitialized(true);
      initializationAttempted.current = true;
    }
  }, [status]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      !caseId ||
      initializationAttempted.current ||
      status !== "PENDING_REVIEW"
    ) {
      return;
    }

    const initializeReview = async () => {
      initializationAttempted.current = true;
      setIsInitialized(false);

      const success = await startReviewForCase();

      if (!isMounted.current) return;

      if (success) {
        setIsInitialized(true);
      } else {
        setIsInitialized(false);
        initializationAttempted.current = false;
      }
    };

    initializeReview();
  }, [caseId, status]);

  const handleReturnForRevision = () => {
    if (!isInitialized) {
      toast.error("Cannot return case: Review not properly initialized");
      return;
    }
    setIsReturnSheetOpen(true);
  };

  const confirmReturnForRevision = async () => {
    if (!returnNotes.trim()) {
      toast.error("Please provide notes before returning.");
      return;
    }

    if (!isInitialized) {
      toast.error("Cannot return case: Review not properly initialized");
      return;
    }

    try {
      const success = await returnCase({ notes: returnNotes });
      if (success) {
        toast.success(
          extractSuccessMessage(success, "Case returned successfully"),
        );
        setIsReturnSheetOpen(false);
        onReturnForRevision?.();
      }
    } catch (error) {
      toast.error(
        extractErrorMessage(error, "Failed to return case. Please try again."),
      );
    }
  };

  const handleApproveRating = () => {
    if (!isInitialized) {
      toast.error("Cannot approve case: Review not properly initialized");
      return;
    }
    setIsApproveSheetOpen(true);
  };

  const confirmApproveRating = async () => {
    if (!approvalComment.trim()) {
      toast.error("Please provide a comment before approving.");
      return;
    }

    if (!isInitialized) {
      toast.error("Cannot approve case: Review not properly initialized");
      return;
    }

    try {
      const success = await approveCase({ comment: approvalComment });
      if (success) {
        toast.success(
          extractSuccessMessage(success, "Case approved successfully"),
        );
        setIsApproveSheetOpen(false);
        onApproveRating?.();
      }
    } catch (error) {
      toast.error(
        extractErrorMessage(error, "Failed to approve case. Please try again."),
      );
    }
  };

  const retryInitialization = async () => {
    clearError();
    initializationAttempted.current = false;

    const success = await startReviewForCase();

    if (!isMounted.current) return;

    if (success) {
      setIsInitialized(true);
    } else {
      setIsInitialized(false);
    }
  };

  return {
    // Initialization
    isStartingReview,
    initError,
    isInitialized,
    retryInitialization,

    // Approve
    isApproving,
    isApproveSheetOpen,
    setIsApproveSheetOpen,
    approvalComment,
    setApprovalComment,
    handleApproveRating,
    confirmApproveRating,

    // Return
    isReturning,
    isReturnSheetOpen,
    setIsReturnSheetOpen,
    returnNotes,
    setReturnNotes,
    handleReturnForRevision,
    confirmReturnForRevision,
  };
}
