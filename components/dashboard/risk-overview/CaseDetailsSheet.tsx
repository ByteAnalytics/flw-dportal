/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import AccordionSection from "@/components/shared/CaseAccordium";
import FinancialTable from "./FinancialTable";
import NonFinancialsTable from "./NonFinancialTable";
import ShowstoppersTable from "./ShowstoppersTable";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCaseDetails } from "@/hooks/use-risk-overview";
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

  const pfYears = pfFinancials?.years || [];

  const pfFinancialsRows = getPfFinancialsRows(pfFinancials);

  const pfIncomeRows = getPfIncomeRows(pfFinancials);

  const pfCashFlowRows = getPfCashFlowRows(pfFinancials);

  const pfRatiosRows = getPfRatiosRows(pfFinancials);

  const cfBalanceSheetRows = getCfBalanceSheetRows(cfFinancials);

  const cfIncomeRows = getCfIncomeRows(cfFinancials);

  const cfOtherInputsRows = getCfOtherInputsRows(cfFinancials);

  const pfNonFinancialsRows = getPfNonFinancialsRows(details);

  const cfNonFinancialsRows = getCfNonFinancialsRows(details);

  const showstoppersDisplay = getCombinedShowstoppers(combined, details);

  return (
    <div className="flex flex-col gap-4 pb-6 px-4">
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
      <div className="rounded-lg border bg-white p-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
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

      {/* ACTION */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onClose}
          className="bg-white border text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Close
        </button>
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

const ScoreCard = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[13px] text-white">{label}</span>
    <span className="text-[18px] font-bold text-white">{value}</span>
  </div>
);

export default CaseDetailsSheet;
