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
}

const CombinedReportsSheet: React.FC<CombinedReportsSheetProps> = ({
  onClose,
  onSubmitForValidation,
  onSaveAsDraft,
}) => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const isValidating = searchParams.get("isValidating") === "true";
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
    } catch (error:any) {
      console.error("Error submitting case:", error);
      toast.error(error?.message || "Failed to submit case. Please try again.");
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

  // Use showstoppers from API response if available
  const showstoppersFromResponse = calculateResponse?.data?.showstoppers;
  const showstoppersDisplay = showstoppersFromResponse
    ? showstoppersFromResponse.SHOWSTOPPERS.map((title, index) => ({
        id: index + 1,
        criteria: title,
        status: showstoppersFromResponse.STATUS[index] || "Not assessed",
      }))
    : [];

  // Use customer name from response if available
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
            {
              label: "Baseline Credit Score Rating",
              value: baselineScore,
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

      <div className="px-6 py-4 border-t mt-auto border-gray-200 flex flex-wrap items-center justify-end gap-3">
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

export default CombinedReportsSheet;
