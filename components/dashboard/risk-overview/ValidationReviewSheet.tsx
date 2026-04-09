/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CornerDownLeft, Edit, RefreshCw } from "lucide-react";
import AccordionSection from "@/components/shared/CaseAccordium";
import FinancialTable from "./FinancialTable";
import NonFinancialsTable from "./NonFinancialTable";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import { useCaseDetails } from "@/hooks/use-risk-overview";
import ShowstoppersTable from "./ShowstoppersTable";
import {
  getCfBalanceSheetRows,
  getCfIncomeRows,
  getCfNonFinancialsRows,
  getCfOtherInputsRows,
  getCombinedShowstoppers,
  getPfCashFlowRows,
  getPfFinancialsRows,
  getPfIncomeRows,
  getPfNonFinancialsRows,
  getPfRatiosRows,
} from "@/lib/risk-overview-utils";
import { useRouter } from "nextjs-toploader/app";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";
import SuccessIcon from "@/public/assets/icon/success-icon.svg";
import { CustomImage } from "@/components/ui/custom-image";
import { useValidationReview } from "@/hooks/use-validation-review";

interface Props {
  onClose: () => void;
  onReturnForRevision: () => void;
  onApproveRating: () => void;
  caseId?: string | null;
}

const ValidationReviewSheet: React.FC<Props> = ({
  onReturnForRevision,
  onApproveRating,
  caseId,
  onClose,
}) => {
  const router = useRouter();
  const { setIsSheetOpen } = useRiskOverviewStore();
  const { data, isLoading: isLoadingCase } = useCaseDetails(
    caseId || undefined,
  );

  const {
    isStartingReview,
    initError,
    isInitialized,
    retryInitialization,
    isApproving,
    isReturning,
    isApproveSheetOpen,
    setIsApproveSheetOpen,
    approvalComment,
    setApprovalComment,
    isReturnSheetOpen,
    setIsReturnSheetOpen,
    returnNotes,
    setReturnNotes,
    handleReturnForRevision: openReturnSheet,
    confirmReturnForRevision,
    handleApproveRating: openApproveSheet,
    confirmApproveRating,
  } = useValidationReview(
    caseId,
    onReturnForRevision,
    onApproveRating,
    data?.data?.status,
  );

  if (isLoadingCase || isStartingReview) {
    return <LoadingSpinner />;
  }

  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[400px]">
        <div className="bg-red-50 rounded-full p-3">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Failed to Initialize Review
          </h3>
          <p className="text-sm text-gray-600 max-w-md">{initError}</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={retryInitialization}
            className="px-4 py-2 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const details = data?.data;

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-gray-500">No case data available</p>
        </div>
      </div>
    );
  }

  const combined = details.combined_results;
  const pfFinancials = details.pf_financials;
  const cfFinancials = details.cf_financials;

  const pfYears = pfFinancials?.years || [];

  const showstoppersDisplay = getCombinedShowstoppers(combined, details);

  const pfFinancialsRows = getPfFinancialsRows(pfFinancials);
  const pfIncomeRows = getPfIncomeRows(pfFinancials);
  const pfCashFlowRows = getPfCashFlowRows(pfFinancials);
  const pfRatiosRows = getPfRatiosRows(pfFinancials);
  const cfBalanceSheetRows = getCfBalanceSheetRows(cfFinancials);
  const cfIncomeRows = getCfIncomeRows(cfFinancials);
  const cfOtherInputsRows = getCfOtherInputsRows(cfFinancials);
  const pfNonFinancialsRows = getPfNonFinancialsRows(details);
  const cfNonFinancialsRows = getCfNonFinancialsRows(details);

  const handleEdit = () => {
    onClose();
    router.push(
      `/dashboard/ccr/overview?step=model_info&caseId=${caseId}&facilityType=${encodeURIComponent(details.facility_type)}&isValidating=true`,
    );
    setIsSheetOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
      {/* HEADER with Edit Button */}
      <div className="border-b pb-2 flex justify-between items-center">
        <span className="font-semibold text-teal-600">
          {details.case_number}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="flex items-center gap-2 text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Case
        </Button>
      </div>

      {/* INFO */}
      <div className="bg-white rounded-lg border p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Info label="Customer" value={details.customer_name} />
        <Info label="Project Type" value={details.project_type} />
        <Info label="Rater" value={details.rater_name} />
        <Info label="Year" value={details.year_of_financials ?? "-"} />
      </div>

      {/* PF FINANCIALS - Balance Sheet */}
      {pfFinancialsRows.length > 0 && (
        <AccordionSection title="PF Financials - Balance Sheet">
          <FinancialTable rows={pfFinancialsRows} years={pfYears} />
        </AccordionSection>
      )}

      {/* PF FINANCIALS - Income Statement */}
      {pfIncomeRows.length > 0 && (
        <AccordionSection title="PF Financials - Income Statement">
          <FinancialTable rows={pfIncomeRows} years={pfYears} />
        </AccordionSection>
      )}

      {/* PF FINANCIALS - Cash Flow */}
      {pfCashFlowRows.length > 0 && (
        <AccordionSection title="PF Financials - Cash Flow">
          <FinancialTable rows={pfCashFlowRows} years={pfYears} />
        </AccordionSection>
      )}

      {/* PF FINANCIALS - Ratios */}
      {pfRatiosRows.length > 0 && (
        <AccordionSection title="PF Financials - Ratios">
          <FinancialTable rows={pfRatiosRows} years={pfYears} />
        </AccordionSection>
      )}

      {/* PF NON FINANCIALS */}
      {pfNonFinancialsRows.length > 0 && (
        <AccordionSection title="PF Non Financials">
          <NonFinancialsTable rows={pfNonFinancialsRows} />
        </AccordionSection>
      )}

      {/* CF FINANCIALS - Balance Sheet */}
      {cfBalanceSheetRows.length > 0 && (
        <AccordionSection title="CF Financials - Balance Sheet">
          <FinancialTable
            rows={cfBalanceSheetRows}
            years={[0, 1]}
            yearLabels={["Current", "Previous"]}
          />
        </AccordionSection>
      )}

      {/* CF FINANCIALS - Income Statement */}
      {cfIncomeRows.length > 0 && (
        <AccordionSection title="CF Financials - Income Statement">
          <FinancialTable
            rows={cfIncomeRows}
            years={[0]}
            yearLabels={["Value"]}
          />
        </AccordionSection>
      )}

      {/* CF FINANCIALS - Other Inputs */}
      {cfOtherInputsRows.length > 0 && (
        <AccordionSection title="CF Financials - Other Inputs">
          <FinancialTable
            rows={cfOtherInputsRows}
            years={[0]}
            yearLabels={["Value"]}
          />
        </AccordionSection>
      )}

      {/* CF NON FINANCIALS */}
      {cfNonFinancialsRows.length > 0 && (
        <AccordionSection title="CF Non Financials">
          <NonFinancialsTable rows={cfNonFinancialsRows} />
        </AccordionSection>
      )}

      {/* SHOWSTOPPERS */}
      {showstoppersDisplay && showstoppersDisplay.length > 0 && (
        <AccordionSection title="Showstoppers">
          <ShowstoppersTable showstoppers={showstoppersDisplay ?? []} />
        </AccordionSection>
      )}

      {/* CREDIT HISTORY ADJUSTMENT */}
      {details.credit_history_adjustment && (
        <AccordionSection title="Credit History Adjustment">
          <div className="p-4 bg-white rounded-lg border">
            {details.credit_history_adjustment}
          </div>
        </AccordionSection>
      )}

      {/* SCORES */}
      {combined?.dashboard_rater && (
        <div className="bg-[#1A5FA8] text-white rounded-lg p-4 grid md:grid-cols-4 xl:grid-cols-5 sm:grid-cols-3 gap-4">
          <ScoreCard
            label="Initial PF Score"
            value={combined.dashboard_rater.initial_pf_score ?? "-"}
          />
          <ScoreCard
            label="Initial CF Score"
            value={combined.dashboard_rater.initial_cf_score ?? "-"}
          />
          <ScoreCard
            label="Probability of Default"
            value={combined.dashboard_rater.baseline_score ?? "-"}
          />
          <ScoreCard
            label="Baseline Rating"
            value={combined.dashboard_rater.baseline_rating ?? "-"}
          />
          <ScoreCard label="Final Rating" value={details?.rating ?? "-"} />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 justify-end pt-4 border-t mt-2">
        <button
          onClick={openReturnSheet}
          disabled={isReturning || isApproving || !isInitialized}
          className="bg-white border text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Return for Revision
        </button>
        <Button
          onClick={openApproveSheet}
          disabled={isReturning || isApproving || !isInitialized}
          className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApproving ? "Approving..." : "Approve Rating"}
        </Button>
      </div>

      {/* Approve Confirmation Sheet */}
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
          <p className="text-center text-gray-700">
            Are you sure you want to approve the credit risk rating for{" "}
            <span className="font-semibold">
              {details.customer_name ?? "this case"}
            </span>
            ? This action will finalize the rating as{" "}
            <span className="font-semibold">{details.rating ?? "-"}</span>.
          </p>
        </div>

        <div className="mb-3 px-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Add your approval comment here..."
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
            className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px]"
          >
            {isApproving ? "Approving..." : "Confirm Approve"}
          </Button>
        </div>
      </SheetWrapper>

      {/* Return for Revision Sheet */}
      <SheetWrapper
        open={isReturnSheetOpen}
        setOpen={setIsReturnSheetOpen}
        title="Return for Revision"
        width="sm:max-w-[540px]"
        headerClassName="bg-orange-600 !text-white"
        titleClassName="text-white px-6 py-4"
        SheetContentClassName="p-0 bg-white"
      >
        <div className="flex flex-col gap-2 mb-4 items-center justify-center p-4">
          <CornerDownLeft className="w-10 h-10 mb-4 text-orange-400" />
          <p className="text-center text-gray-700">
            Are you sure you want to return the credit risk rating for{" "}
            <span className="font-semibold">
              {details.customer_name ?? "this case"}
            </span>
            ? The rater will need to make revisions before resubmission.
          </p>
        </div>

        <div className="mb-3 px-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={4}
            placeholder="Provide detailed notes for revision..."
          />
        </div>

        <div className="flex justify-end gap-2 mt-auto px-4 mb-4">
          <Button
            variant="secondary"
            onClick={() => setIsReturnSheetOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmReturnForRevision}
            disabled={isReturning}
            className="h-[40px] px-6 bg-orange-600 text-white text-[14px] font-semibold rounded-[8px] hover:bg-orange-700"
          >
            {isReturning ? "Returning..." : "Confirm Return"}
          </Button>
        </div>
      </SheetWrapper>
    </div>
  );
};

// Helper Components
const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-900">{value || "-"}</p>
  </div>
);

const ScoreCard = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-xs text-blue-200 mb-1">{label}</p>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);

export default ValidationReviewSheet;
