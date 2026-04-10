"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AccordionSection from "@/components/shared/CaseAccordium";
import ShowstoppersTable from "./ShowstoppersTable";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CustomButton from "@/components/ui/custom-button";
import { formatNumber } from "@/lib/utils";
import ValidatorsSheet from "./ValidatorsSheet";
import ApproveConfirmationSheet from "./ApproveConfirmationSheet";
import { useReportSheet } from "@/hooks/use-report-sheet";
import { InfoCard, InfoField } from "./ReportInfoCard";
import ReportCalculateError from "./ReportCalculateError";

interface PFReportsSheetProps {
  onClose: () => void;
  onSubmitForValidation: () => void;
  onSaveAsDraft?: () => void;
  onPrevious?: () => void;
}

const PFReportsSheet: React.FC<PFReportsSheetProps> = ({
  onClose,
  onSubmitForValidation,
  onSaveAsDraft,
  onPrevious,
}) => {
  const [activeTab, setActiveTab] =
    useState<"Report Summary">("Report Summary");

  const {
    isValidValidator,
    calculateResponse,
    isCalculating,
    isSubmitting,
    isApproving,
    details,
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
    refetchCalculate,
  } = useReportSheet(onSubmitForValidation);

  if (isCalculating) return <LoadingSpinner />;
  if (calculateError)
    return (
      <ReportCalculateError
        onRetry={refetchCalculate}
        onPrevious={onPrevious}
      />
    );

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
  const yearOfFinancials = calculateResponse?.data?.year_of_financials;
  const pfScore = calculateResponse?.data?.initial_pf_score;
  const baselineScore = calculateResponse?.data?.baseline_score;
  const baselineRating = calculateResponse?.data?.baseline_rating;

  return (
    <div className="flex flex-col h-full">
      <div className="pb-0 border-b border-gray-200">
        <div className="flex gap-0">
          {(["Report Summary"] as const).map((tab) => (
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

      <div className="flex-1 overflow-y-auto py-6">
        <div className="flex flex-col gap-4">
          <InfoCard>
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
              <InfoField label="Customer" value={customerName} />
              <InfoField label="Project type" value={projectType} />
              <InfoField label="Year of Financials4" value={yearOfFinancials} />
              <InfoField label="Rating Date" value={dateOfRating} />
            </div>
          </InfoCard>

          <AccordionSection title="Showstoppers">
            <ShowstoppersTable showstoppers={showstoppersDisplay} />
          </AccordionSection>

          <div className="rounded-[12px] bg-[#1A5FA8] p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Initial PF Score",
                value: pfScore ? formatNumber(pfScore) : "—",
              },
              {
                label: "Baseline Credit Score",
                value: baselineScore ? formatNumber(baselineScore) : "—",
              },
              {
                label: "Baseline Credit Score Rating",
                value: baselineRating || "—",
              },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-blue-200">
                  {item.label}
                </span>
                <span className="text-[20px] font-bold text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center gap-3 justify-between mt-auto">
        {onPrevious && (
          <CustomButton
            type="button"
            title="Previous"
            onClick={() => onPrevious?.()}
            disabled={isSubmitting || isApproving}
            className="w-[117px] h-[40px] flex items-center gap-2 border bg-white hover:bg-gray-600 hover:text-white text-gray-600 text-[16px] font-semibold"
          />
        )}
        <div className="ms-auto border-t border-gray-200 flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            onClick={onSaveAsDraft}
            className="text-[13px] border h-[40px] bg-white rounded-[8px] border-InfraBorder font-semibold text-gray-600 hover:text-gray-800 px-3 py-2"
          >
            Save as draft
          </Button>
          <CustomButton
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isApproving}
            className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              isSubmitting || isApproving
                ? isValidValidator
                  ? "Approving..."
                  : "Submitting..."
                : isValidValidator
                  ? "Approve Case"
                  : "Submit for Validation"
            }
          />
        </div>
      </div>

      <ValidatorsSheet
        isValidatorSheetOpen={isValidatorSheetOpen}
        setIsValidatorSheetOpen={setIsValidatorSheetOpen}
        customerName={customerName}
        selectedValidator={selectedValidator}
        setSelectedValidator={setSelectedValidator}
        confirmSubmitWithValidator={confirmSubmitWithValidator}
        isSubmitting={isSubmitting}
      />
      <ApproveConfirmationSheet
        isApproveSheetOpen={isApproveSheetOpen}
        setIsApproveSheetOpen={setIsApproveSheetOpen}
        details={details}
        calculateResponse={calculateResponse}
        approvalComment={approvalComment}
        setApprovalComment={setApprovalComment}
        confirmApproveRating={confirmApproveRating}
        isApproving={isApproving}
      />
    </div>
  );
};

export default PFReportsSheet;
