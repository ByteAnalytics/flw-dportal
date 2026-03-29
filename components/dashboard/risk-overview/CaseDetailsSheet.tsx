/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccordionSection from "@/components/shared/CaseAccordium";
import FinancialTable from "./FinancialTable";
import NonFinancialsTable from "./NonFinancialTable";
import ShowstoppersTable from "./ShowstoppersTable";
import ScoreSummaryCards from "./ScoreSummaryCards";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCaseDetails } from "@/hooks/use-risk-overview";
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

interface Props {
  onClose: () => void;
  caseId?: string | null;
}

const CaseDetailsSheet: React.FC<Props> = ({ onClose, caseId }) => {
  const { data, isLoading } = useCaseDetails(caseId || undefined);

  if (isLoading) return <LoadingSpinner />;

  const details = data?.data;

  if (!details) {
    return <div className="p-6 text-gray-500">No case details found</div>;
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

  return (
    <div className="flex flex-col gap-4 pb-6 md:px-0 px-3">
      {/* STATUS */}
      <div className="rounded-[10px] bg-green-50 border border-green-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-[14px] font-semibold text-green-700">
            {details.status}
          </span>
        </div>
        <span className="text-[13px] text-gray-400">
          {details.reviewed_at
            ? `Reviewed on ${formatDate(details.reviewed_at)}`
            : "Not yet reviewed"}
        </span>
      </div>

      {/* INFO */}
      <div className="rounded-[10px] border bg-[#F9FAFB] p-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Info label="Customer" value={details.customer_name} />
        <Info label="Project Type" value={details.project_type} />
        <Info label="Rater" value={details.rater_name} />
        <Info label="Validator" value={details.validator_name ?? "-"} />
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
      {showstoppers.length > 0 && (
        <AccordionSection title="Showstoppers">
          <ShowstoppersTable showstoppers={showstoppers} />
        </AccordionSection>
      )}

      {/* SCORES */}
      {combined && <ScoreSummaryCards reportData={combined} />}

      {/* ACTION */}
      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose} className="h-[40px] px-8">
          Close
        </Button>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[13px] text-gray-400">{label}</span>
    <span className="text-[15px] font-bold text-gray-900">{value}</span>
  </div>
);

export default CaseDetailsSheet;
