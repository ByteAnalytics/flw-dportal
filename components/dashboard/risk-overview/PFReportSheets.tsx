"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import AccordionSection from "@/components/shared/CaseAccordium";
import ShowstoppersTable from "./ShowstoppersTable";
import { useSearchParams } from "next/navigation";
import {
  useCalculateCase,
  useSubmitCase,
  useApproveCase,
  useCaseDetails,
} from "@/hooks/use-risk-overview";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CalculateResponse } from "@/types/risk-overview";
import SuccessIcon from "@/public/assets/icon/success-icon.svg";
import { CustomImage } from "@/components/ui/custom-image";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ReportSummaryData = {
  customer: string;
  projectType: string;
  yearOfFinancials: string;
  financialRisk: number | string;
  operationalRisk: number | string;
  structureRisk: number | string;
  pfScore?: string;
  cfScore?: string;
  probabilityOfDefault: number | string;
  baselineCreditScore: string;
  finalCreditScore: string;
};

interface PFReportsSheetProps {
  onClose: () => void;
  onSubmitForValidation: () => void;
  onSaveAsDraft?: () => void;
}

const PFReportsSheet: React.FC<PFReportsSheetProps> = ({
  onClose,
  onSubmitForValidation,
  onSaveAsDraft,
}) => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const isValidating = searchParams.get("isValidating") === "true";
  const [activeTab, setActiveTab] = useState<"Report Summary" | "Full Report">(
    "Report Summary",
  );
  const [calculateResponse, setCalculateResponse] =
    useState<CalculateResponse | null>(null);
  const [isApproveSheetOpen, setIsApproveSheetOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");

  const { data: caseData } = useCaseDetails(caseId || undefined);
  const details = caseData?.data;

  const { mutateAsync: calculateCase, isPending: isCalculating } =
    useCalculateCase(caseId || undefined);
  const { mutateAsync: submitCase, isPending: isSubmitting } = useSubmitCase(
    caseId || undefined,
  );
  const { mutateAsync: approveCase, isPending: isApproving } = useApproveCase(
    caseId || undefined,
  );

  useEffect(() => {
    if (caseId) {
      calculateCase({}).then((response) => {
        if (response) {
          setCalculateResponse(response);
        }
      });
    }
  }, [caseId, calculateCase]);

  const handleSubmit = async () => {
    if (isValidating) {
      setIsApproveSheetOpen(true);
      return;
    }

    try {
      const success = await submitCase({});
      if (success) {
        toast.success(success.message || "Submitted successfully");
        onSubmitForValidation();
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit case. Please try again.");
      console.error("Error submitting case:", error);
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
        toast.success(success.message || "Case approved successfully");

        setIsApproveSheetOpen(false);
        onSubmitForValidation();
      }
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to approve case. Please try again.",
      );
      console.error("Error approving rating:", error);
    }
  };

  if (isCalculating) return <LoadingSpinner />;

  // Use showstoppers from API response if available
  const showstoppersFromResponse = calculateResponse?.data?.showstoppers;
  const showstoppersDisplay = showstoppersFromResponse
    ? showstoppersFromResponse.SHOWSTOPPERS.map((title, index) => ({
        id: index + 1,
        criteria: title,
        status: showstoppersFromResponse.STATUS[index] || "Not assessed",
      }))
    : [];

  const customerName = calculateResponse?.data?.customer_name || "—";
  const dateOfRating = calculateResponse?.data?.date_of_rating || "—";
  const projectType = calculateResponse?.data?.project_type || "—";
  const yearOfFinancials = calculateResponse?.data?.year_of_financials || "—";
  const pfScore = calculateResponse?.data?.initial_pf_score || "—";
  const baselineScore = calculateResponse?.data?.baseline_score || "—";

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="pb-0 border-b border-gray-200">
        <div className="flex gap-0">
          {(["Report Summary", "Full Report"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-6">
        {activeTab === "Report Summary" && (
          <div className="flex flex-col gap-7">
            {/* Row 1: Customer info */}
            <div className="rounded-[10px] border border-gray-200 bg-InfraBorder p-4 grid xl:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4">
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Customer
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {customerName}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Project type
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {projectType}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Year of Financials
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {yearOfFinancials}
                </span>
              </div>

              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Rating Date
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {dateOfRating}
                </span>
              </div>
            </div>

            {showstoppersDisplay.length > 0 && (
              <AccordionSection title="Showstoppers">
                <ShowstoppersTable showstoppers={showstoppersDisplay} />
              </AccordionSection>
            )}

            {/* Row 2: Scores */}
            <div className="rounded-[12px] bg-[#1A5FA8] p-4 grid md:grid-cols-2 grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-white">
                  PF Score
                </span>
                <span className="text-[20px] font-bold text-white">
                  {pfScore}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-white">
                  Baseline Credit Score Rating
                </span>
                <span className="text-[20px] font-bold text-white">
                  {baselineScore}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Full Report" && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Full report view coming soon
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={onSaveAsDraft}
          className="text-[13px] border h-[40px] bg-white rounded-[8px] border-InfraBorder font-semibold text-gray-600 hover:text-gray-800 px-3 py-2"
        >
          Save as draft
        </button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isApproving}
          className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isApproving
            ? isValidating
              ? "Approving..."
              : "Submitting..."
            : isValidating
              ? "Approve Case"
              : "Submit for Validation"}
        </Button>
      </div>

      <SheetWrapper
        open={isApproveSheetOpen}
        setOpen={setIsApproveSheetOpen}
        title="Approve Credit Risk Rating"
        width="sm:max-w-[540px]"
        headerClassName="bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] !text-white"
        titleClassName="text-white px-6 py-4"
        SheetContentClassName="p-0 bg-white"
      >
        <div className="flex flex-col gap-2 mb-4 items-center justify-center p-4">
          <CustomImage src={SuccessIcon} style="w-20 h-20 mb-4" />
          <p className="text-center">
            Are you sure you want to approve the credit risk rating for{" "}
            {details?.customer_name ?? "this case"}? This action will finalize
            the rating as {calculateResponse?.data?.baseline_score ?? "-"}.
          </p>
        </div>

        <div className="mb-3 px-4">
          <label className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            rows={4}
            placeholder="Add comment"
          />
        </div>

        <div className="flex justify-end gap-2 mt-auto px-4 mb-4">
          <Button
            variant="secondary"
            onClick={() => setIsApproveSheetOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmApproveRating}
            disabled={isApproving}
            className="ms-auto h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px]"
          >
            {isApproving ? "Approving..." : "Confirm Approve"}
          </Button>
        </div>
      </SheetWrapper>
    </div>
  );
};

export default PFReportsSheet;
