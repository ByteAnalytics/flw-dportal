/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccordionSection from "@/components/shared/CaseAccordium";
import FinancialTable from "./FinancialTable";
import NonFinancialsTable from "./NonFinancialTable";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
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
                <b>Category:</b> {details.validator_notes ?? "No comment"}
              </p>
              <p className="text-sm text-[#64748b]">
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
      <div className="bg-white p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg border">
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

      {/* SHOWSTOPPERS */}
      {showstoppersDisplay && showstoppersDisplay?.length > 0 && (
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
        <div className="bg-[#1A5FA8] text-white divide-x p-4 rounded-lg p-4 grid md:grid-cols-4 xl:grid-cols-5 sm:grid-cols-3 gap-4">
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
            value={combined.dashboard_rater.baseline_score ?? "-"}
          />
          <ScoreCard label="Final Rating" value={details?.rating ?? "-"} />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          onClick={onClose}
          className="bg-white border text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Close
        </button>

        <Button
          onClick={onEditAndResubmit}
          className="ms-auto h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px]"
        >
          Edit & Resubmit
        </Button>
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

const ScoreCard = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[13px] text-white">{label}</span>
    <span className="text-[18px] font-bold text-white">{value}</span>
  </div>
);
