/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccordionSection from "@/components/shared/CaseAccordium";
import FinancialTable from "./FinancialTable";
import NonFinancialsTable from "./NonFinancialTable";
import ScoreSummaryCards from "./ScoreSummaryCards";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCaseDetails } from "@/hooks/use-risk-overview";
import ShowstoppersTable from "./ShowstoppersTable";
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
  getShowstoppers,
} from "@/lib/risk-overview-utils";

interface Props {
  onClose: () => void;
  onEditAndResubmit: () => void;
  caseId?: string | null;
}

export const ReturnedCaseSheet: React.FC<Props> = ({
  onClose,
  onEditAndResubmit,
  caseId,
}) => {
  const { data, isLoading } = useCaseDetails(caseId || undefined);

  if (isLoading) return <LoadingSpinner />;

  const details = data?.data;

  if (!details) {
    return <div className="p-6 text-gray-500">No case data</div>;
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
    <div className="flex flex-col gap-4 pb-6 md:px-6 px-3">
      {/* ALERT */}
      <div className="rounded-[10px] bg-orange-50 border border-orange-200 p-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <AlertCircle className="text-orange-500 w-5 h-5 mt-1" />
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-orange-600">
                Returned by Validator
              </span>
              <p className="text-sm">
                <b>Validator:</b> {details.validator_name ?? "-"}
              </p>
              <p className="text-sm">
                <b>Comment:</b> {details.validator_notes ?? "No comment"}
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-400">
            {details.reviewed_at ? formatDate(details.reviewed_at) : "-"}
          </span>
        </div>
      </div>

      {/* INFO */}
      <div className="bg-gray-50 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Info label="Customer" value={details.customer_name} />
        <Info label="Project Type" value={details.project_type} />
        <Info label="Rater" value={details.rater_name} />
        <Info label="Validator" value={details.validator_name ?? "-"} />
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
      {combined && <ScoreSummaryCards reportData={combined} />}

      {/* ACTIONS */}
      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEditAndResubmit}>Edit & Resubmit</Button>
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
