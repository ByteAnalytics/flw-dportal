/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import AccordionSection from "@/components/shared/CaseAccordium";
import FinancialTable from "./FinancialTable";
import NonFinancialsTable from "./NonFinancialTable";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCaseDetails } from "@/hooks/use-risk-overview";
import ShowstoppersTable from "./ShowstoppersTable";
import { getShowstoppers } from "@/lib/risk-overview-utils";
import {
  getCfBalanceSheetRows,
  getCfIncomeRows,
  getCfNonFinancialsRows,
  getCfOtherInputsRows,
  getPfCashFlowRows,
  getPfFinancialsRows,
  getPfIncomeRows,
  getPfNonFinancialsRows,
  getPfRatiosRows,
} from "@/lib/risk-overview-utils";
import { useRouter } from "nextjs-toploader/app";

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
}) => {
  const router = useRouter();
  const { data, isLoading } = useCaseDetails(caseId || undefined);

  if (isLoading) return <LoadingSpinner />;

  const details = data?.data;

  if (!details) {
    return <div className="p-6 text-gray-500">No data</div>;
  }

  const combined = details.combined_results;
  const pfFinancials = details.pf_financials;
  const cfFinancials = details.cf_financials;

  // Get years from PF financials
  const pfYears = pfFinancials?.years || [];

  // Get showstoppers data
  const showstoppers = getShowstoppers(details);

  // Transform PF Balance Sheet rows with actual values
  const pfFinancialsRows = getPfFinancialsRows(pfFinancials);

  // Transform PF Income Statement rows
  const pfIncomeRows = getPfIncomeRows(pfFinancials);

  // Transform PF Cash Flow rows
  const pfCashFlowRows = getPfCashFlowRows(pfFinancials);

  // Transform PF Ratios rows
  const pfRatiosRows = getPfRatiosRows(pfFinancials);

  // CF Balance Sheet rows
  const cfBalanceSheetRows = getCfBalanceSheetRows(cfFinancials);

  // CF Income Statement rows
  const cfIncomeRows = getCfIncomeRows(cfFinancials);

  // CF Other Inputs rows
  const cfOtherInputsRows = getCfOtherInputsRows(cfFinancials);

  // Then update the non-financials rows creation:
  const pfNonFinancialsRows = getPfNonFinancialsRows(details);

  const cfNonFinancialsRows = getCfNonFinancialsRows(details);

  const handleEdit = () => {
    // Navigate to the PF financials step with the case ID and facility type
    router.push(
      `/dashboard/ccr/overview?step=pf_financials&caseId=${caseId}&facilityType=${encodeURIComponent(details.facility_type)}`,
    );
  };

  return (
    <div className="flex flex-col gap-4 pb-6 md:px-6 px-3">
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
      <div className="bg-gray-50 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Info label="Customer" value={details.customer_name} />
        <Info label="Project Type" value={details.project_type} />
        <Info label="Rater" value={details.rater_name} />
        <Info label="Year" value={details.year_of_financials ?? "-"} />
      </div>

      {/* PF FINANCIALS */}
      {pfFinancialsRows.length > 0 && (
        <AccordionSection title="PF Financials - Balance Sheet">
          <FinancialTable rows={pfFinancialsRows} years={pfYears} />
        </AccordionSection>
      )}

      {pfIncomeRows.length > 0 && (
        <AccordionSection title="PF Financials - Income Statement">
          <FinancialTable rows={pfIncomeRows} years={pfYears} />
        </AccordionSection>
      )}

      {pfCashFlowRows.length > 0 && (
        <AccordionSection title="PF Financials - Cash Flow">
          <FinancialTable rows={pfCashFlowRows} years={pfYears} />
        </AccordionSection>
      )}

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

      {/* CF FINANCIALS */}
      {cfBalanceSheetRows.length > 0 && (
        <AccordionSection title="CF Financials - Balance Sheet">
          <FinancialTable
            rows={cfBalanceSheetRows}
            years={[0, 1]}
            yearLabels={["Current", "Previous"]}
          />
        </AccordionSection>
      )}

      {cfIncomeRows.length > 0 && (
        <AccordionSection title="CF Financials - Income Statement">
          <FinancialTable
            rows={cfIncomeRows}
            years={[0]}
            yearLabels={["Value"]}
          />
        </AccordionSection>
      )}

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

      {showstoppers.length > 0 && (
        <AccordionSection title="Showstoppers">
          <ShowstoppersTable showstoppers={showstoppers} />
        </AccordionSection>
      )}

      {/* SCORES */}
      {combined && (
        <div className="bg-blue-600 text-white p-4 rounded-lg grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Score label="Initial PF" value={combined.initialPFScore} />
          <Score label="Initial CF" value={combined.initialCFScore} />
          <Score label="PD" value={String(combined.probabilityOfDefault)} />
          <Score label="Baseline" value={combined.baselineCreditScore} />
          <Score label="Final" value={combined.finalCreditScore} />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" onClick={onReturnForRevision}>
          Return for Revision
        </Button>
        <Button onClick={onApproveRating}>Approve Rating</Button>
      </div>
    </div>
  );
};

const Info = ({ label, value }: any) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="font-bold">{value}</p>
  </div>
);

const Score = ({ label, value }: any) => (
  <div>
    <p className="text-xs text-blue-200">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default ValidationReviewSheet;
