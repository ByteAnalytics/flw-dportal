"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AccordionSection from "@/components/shared/CaseAccordium";
import ShowstoppersTable from "./ShowstoppersTable";
import { useSearchParams } from "next/navigation";
import {
  useCalculateCase,
  useSubmitCase,
  useApproveCase,
  useCaseDetails,
  Validator,
} from "@/hooks/use-risk-overview";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CalculateResponse } from "@/types/risk-overview";
import { toast } from "sonner";
import CustomButton from "@/components/ui/custom-button";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types";
import ValidatorsSheet from "./ValidatorsSheet";
import ApproveConfirmationSheet from "./ApproveConfirmationSheet";

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

export type CombinedReportData = {
  customer: string;
  projectType: string;
  yearOfFinancials: string;
  pf: {
    financialRisk: number | string;
    operationalRisk: number | string;
    structureRisk: number | string;
    pfScore: number | string;
  };
  cf: {
    financialRisk: number | string;
    operationalRisk: number | string;
    structureRisk: number | string;
    cfScore: number | string;
  };
  initialPFScore: string;
  initialCFScore: string;
  probabilityOfDefault: number | string;
  baselineCreditScore: string;
  finalCreditScore: string;
};

export const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-[12px] border border-gray-200 bg-[#F9FAFB] p-5">
    {children}
  </div>
);

export const InfoField = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[13px] font-medium text-gray-400">{label}</span>
    <span
      className={`text-[15px] font-bold text-gray-900 ${valueClassName ?? ""}`}
    >
      {value}
    </span>
  </div>
);

interface CombinedReportsSheetProps {
  onClose: () => void;
  onSubmitForValidation: () => void;
  onSaveAsDraft?: () => void;
  onPrevious?: () => void;
}

const CombinedReportsSheet: React.FC<CombinedReportsSheetProps> = ({
  onClose,
  onSubmitForValidation,
  onSaveAsDraft,
  onPrevious,
}) => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const { user } = useAuthStore((s) => s);
  const isValidValidator = user?.role === UserRole?.["SUPER USER"];

  const [calculateResponse, setCalculateResponse] =
    useState<CalculateResponse | null>(null);

  // Approve sheet state
  const [isApproveSheetOpen, setIsApproveSheetOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");

  // Validator selection sheet state (only for submit, not approve)
  const [isValidatorSheetOpen, setIsValidatorSheetOpen] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(
    null,
  );

  const { data: caseData } = useCaseDetails(caseId || undefined);
  const details = caseData?.data;

  const { mutateAsync: calculateCase, isPending: isCalculating } =
    useCalculateCase(caseId || undefined);
  const { mutateAsync: submitCase, isPending: isSubmitting } = useSubmitCase(
    caseId || "",
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

  // Opens the approve sheet (validator flow) or the approve confirmation
  const handleSubmit = async () => {
    if (isValidValidator) {
      setIsApproveSheetOpen(true);
      return;
    }
    // Not validating → open validator picker sheet first
    setIsValidatorSheetOpen(true);
  };

  // Called once a validator has been selected and the user confirms submission
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
      console.error("Error submitting case:", error);
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
      await approveCase({ comment: approvalComment });
      setIsApproveSheetOpen(false);
      onSubmitForValidation();
    } catch (error) {
      console.error("Error approving rating:", error);
    }
  };

  if (isCalculating) return <LoadingSpinner />;

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
  const cfScore = calculateResponse?.data?.initial_cf_score || "—";
  const baselineScore = calculateResponse?.data?.baseline_score || "—";

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="border-b border-gray-200">
        <button className="px-4 py-2.5 text-[13px] font-semibold border-b-2 border-teal-600 text-teal-700">
          Report Summary
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <InfoCard>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
            <InfoField label="Customer" value={customerName} />
            <InfoField label="Project type" value={projectType} />
            <InfoField label="Year of Financials" value={yearOfFinancials} />
            <InfoField label="Rating Date" value={dateOfRating} />
          </div>
        </InfoCard>

        {showstoppersDisplay.length > 0 && (
          <AccordionSection title="Showstoppers">
            <ShowstoppersTable showstoppers={showstoppersDisplay} />
          </AccordionSection>
        )}

        <div className="rounded-[12px] bg-[#1A5FA8] p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Initial PF Score", value: pfScore },
            { label: "Initial CF Score", value: cfScore },
            { label: "Baseline Credit Score Rating", value: baselineScore },
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

      <div className="pt-6 flex flex-wrap items-center gap-3 justify-between mt-auto">
        {onPrevious && (
          <CustomButton
            type="button"
            title="Previous"
            onClick={() => onPrevious?.()}
            disabled={isSubmitting || isApproving}
            className="w-[117px] h-[40px] flex items-center gap-2 border bg-white hover:bg-gray-600 hover:text-white text-gray-600 text-[16px] font-semibold"
          />
        )}
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
              ? isValidValidator
                ? "Approving..."
                : "Submitting..."
              : isValidValidator
                ? "Approve Case"
                : "Submit for Validation"}
          </Button>
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
      {/* ── Approve Confirmation Sheet (validate flow only) ── */}
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

export default CombinedReportsSheet;
