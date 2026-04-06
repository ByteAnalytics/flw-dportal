"use client";

import React, { useEffect, useState } from "react";
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
  useGetValidators,
  Validator,
} from "@/hooks/use-risk-overview";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CalculateResponse } from "@/types/risk-overview";
import SuccessIcon from "@/public/assets/icon/success-icon.svg";
import { CustomImage } from "@/components/ui/custom-image";
import { toast } from "sonner";
import CustomButton from "@/components/ui/custom-button";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { X } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types";
import ValidatorPicker from "./ValidatorPicker";

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

  // Fetch validators — only needed when not isValidating
  const { data: validatorsData, isLoading: isLoadingValidators } =
    useGetValidators();
  const validators = validatorsData?.data ?? [];

  const { mutateAsync: calculateCase, isPending: isCalculating } =
    useCalculateCase(caseId || undefined);
  const { mutateAsync: submitCase, isPending: isSubmitting } = useSubmitCase(
    caseId || '',
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
    <div className="flex flex-col gap-6 pb-6">
      <div className="border-b border-gray-200">
        <button className="px-4 py-2.5 text-[13px] font-semibold border-b-2 border-teal-600 text-teal-700">
          Report Summary
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <InfoCard>
          <div className="grid grid-cols-3 gap-4">
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

      {/* ── Validator Picker Sheet (submit flow only) ── */}
      <SheetWrapper
        open={isValidatorSheetOpen}
        setOpen={setIsValidatorSheetOpen}
        title="Request Validation"
        width="sm:max-w-[480px]"
        headerClassName="bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] !text-white"
        titleClassName="text-white px-6 py-4"
        SheetContentClassName="p-0 bg-white"
      >
        <div className="flex flex-col gap-5 p-6">
          {/* Intro copy */}
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold text-gray-800">
              Assign a validator for this case
            </p>
            <p className="text-[13px] text-gray-500">
              Select a team member to review and validate the credit risk rating
              for{" "}
              <span className="font-semibold text-gray-700">
                {customerName}
              </span>
              . They will be notified once submitted.
            </p>
          </div>

          {/* Case summary pill */}
          <div className="flex items-center gap-3 rounded-[8px] bg-blue-50 border border-blue-100 px-4 py-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-medium text-blue-400 uppercase tracking-wide">
                Baseline Score
              </span>
              <span className="text-[18px] font-bold text-blue-800">
                {baselineScore}
              </span>
            </div>
            <div className="h-8 w-px bg-blue-200 mx-1" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-medium text-blue-400 uppercase tracking-wide">
                Project Type
              </span>
              <span className="text-[13px] font-semibold text-blue-700 truncate">
                {projectType}
              </span>
            </div>
          </div>

          {/* Picker */}
          <ValidatorPicker
            validators={validators}
            isLoading={isLoadingValidators}
            selected={selectedValidator}
            onSelect={setSelectedValidator}
          />

          {/* Selected validator card */}
          {selectedValidator && (
            <div className="flex items-center gap-3 rounded-[8px] border border-teal-200 bg-teal-50 px-4 py-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-[12px] font-bold text-white shrink-0">
                {selectedValidator.first_name[0]}
                {selectedValidator.last_name[0]}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-teal-800">
                  {selectedValidator.first_name} {selectedValidator.last_name}
                </span>
                <span className="text-[12px] text-teal-600 truncate">
                  {selectedValidator.email}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedValidator(null)}
                className="ml-auto text-teal-400 hover:text-teal-700 transition-colors"
                aria-label="Remove selected validator"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 pb-6">
          <Button
            variant="secondary"
            onClick={() => {
              setIsValidatorSheetOpen(false);
              setSelectedValidator(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmSubmitWithValidator}
            disabled={!selectedValidator || isSubmitting}
            className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting…" : "Submit for Validation"}
          </Button>
        </div>
      </SheetWrapper>

      {/* ── Approve Confirmation Sheet (validate flow only) ── */}
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

export default CombinedReportsSheet;
