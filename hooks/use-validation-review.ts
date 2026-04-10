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
  const prevCaseId = useRef<string | null | undefined>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset when caseId changes so a new case always re-evaluates
  useEffect(() => {
    if (prevCaseId.current !== caseId) {
      prevCaseId.current = caseId;
      initializationAttempted.current = false;
      setIsInitialized(false);
    }
  }, [caseId]);

  // Handle initialization based on status
  useEffect(() => {
    if (!caseId || !status) return;

    const normalized = status.toLowerCase();

    const alreadyInitialized = normalized !== 'pending_review'

    if (alreadyInitialized) {
      setIsInitialized(true);
      initializationAttempted.current = true;
      return;
    }

    if (normalized === "pending_review" && !initializationAttempted.current) {
      initializationAttempted.current = true;

      (async () => {
        const success = await startReviewForCase();
        if (!isMounted.current) return;
        setIsInitialized(success);
        if (!success) initializationAttempted.current = false; // allow retry
      })();
    }
  }, [caseId, status]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setIsInitialized(success);
    if (success) initializationAttempted.current = true;
  };

  return {
    isStartingReview,
    initError,
    isInitialized,
    retryInitialization,
    isApproving,
    isApproveSheetOpen,
    setIsApproveSheetOpen,
    approvalComment,
    setApprovalComment,
    handleApproveRating,
    confirmApproveRating,
    isReturning,
    isReturnSheetOpen,
    setIsReturnSheetOpen,
    returnNotes,
    setReturnNotes,
    handleReturnForRevision,
    confirmReturnForRevision,
  };
}
