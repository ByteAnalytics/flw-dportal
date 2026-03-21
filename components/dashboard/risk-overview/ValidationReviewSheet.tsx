"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CombinedReportData } from "./CFReportsSheet";

interface ValidationReviewSheetProps {
  onClose: () => void;
  onReturnForRevision: () => void;
  onApproveRating: () => void;
  reportData: CombinedReportData;
  caseId?: string;
}

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
const MOCK_VALUE = "909,008,876.87";

const PF_FINANCIALS_ROWS = [
  { label: "Total Non-Current Assets" },
  { label: "Current Assets" },
  { label: "Total Current Liabilities" },
  { label: "Long Term Liabilities" },
  { label: "Share Capital" },
  { label: "Retained Earnings" },
  { label: "Concessionary Capital" },
  { label: "Total Assets", isCalculated: true },
  { label: "Total Liabilities", isCalculated: true },
  { label: "Net Assets", isCalculated: true },
];

const PF_NON_FINANCIALS_ROWS = [
  { label: "Experience of Management" },
  { label: "Integrity Credentials" },
  { label: "Corporate Government" },
  { label: "Past Payment Record" },
  { label: "Succession Planning" },
  { label: "Risk Management Framework" },
  { label: "Local Implementation Capacity" },
  { label: "Market Share" },
  { label: "Financial Flexibility" },
];

const CF_FINANCIALS_ROWS = [
  { label: "Revenue" },
  { label: "Cost of Sale" },
  { label: "SGA Expense" },
  { label: "Depreciation & Amortisation" },
  { label: "Other Operating Income" },
  { label: "Cash and Cash Equivalents" },
  { label: "Total Current Assets", isCalculated: true },
  { label: "Total Assets", isCalculated: true },
  { label: "Net Assets", isCalculated: true },
];

const CF_NON_FINANCIALS_ROWS = [
  { label: "Exposure to Market Risk" },
  { label: "Market Share" },
  { label: "Access to Resources" },
  { label: "Financial Flexibility" },
  { label: "Regulatory Environment" },
  { label: "Competition Dynamics" },
  { label: "Industry Outlook" },
  { label: "Market Supply/Demand" },
  { label: "Reliability of Auditors" },
  { label: "Timeliness of Financials" },
];

const FinancialTable = ({
  rows,
}: {
  rows: { label: string; isCalculated?: boolean }[];
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-[14px] min-w-[600px]">
      <thead>
        <tr className="bg-[#F9FAFB]">
          <th className="text-left text-[14px] px-4 py-2 font-semibold text-gray-500 w-[180px]">
            LINE ITEM
          </th>
          {YEARS.map((y) => (
            <th
              key={y}
              className="text-left text-[13px] px-4 py-2 font-semibold text-gray-500 whitespace-nowrap"
            >
              {y}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-gray-100">
            <td
              className={`px-4 text-[13px] py-2 font-medium ${row.isCalculated ? "text-amber-600" : "text-gray-700"}`}
            >
              {row.label}
            </td>
            {YEARS.map((y) => (
              <td
                key={y}
                className={`px-4 text-[13px] py-2 whitespace-nowrap ${row.isCalculated ? "text-amber-600 font-semibold" : "text-gray-600"}`}
              >
                {MOCK_VALUE}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const NonFinancialsTable = ({ rows }: { rows: { label: string }[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-[14px]">
      <thead>
        <tr className="bg-[#F9FAFB]">
          <th className="text-left text-[14px] px-4 py-2 font-semibold text-gray-500">
            LINE ITEM
          </th>
          <th className="text-left text-[14px] px-4 py-2 font-semibold text-gray-500">
            SCORE
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-gray-100">
            <td className="px-4 py-2 text-gray-700 font-medium">{row.label}</td>
            <td className="px-4 py-2 text-gray-600">{MOCK_VALUE}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AccordionSection = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-[10px] overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white text-[14px] font-semibold text-gray-800"
      >
        {title}
        {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
      {open && children && (
        <div className="border-t border-gray-100">{children}</div>
      )}
    </div>
  );
};

const ValidationReviewSheet: React.FC<ValidationReviewSheetProps> = ({
  onReturnForRevision,
  onApproveRating,
  reportData,
  caseId = "CR-071",
}) => {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="border-b border-gray-200 pb-2">
        <span className="text-[13px] font-semibold border-b-2 border-teal-600 text-teal-700 pb-2 px-1">
          {caseId}
        </span>
      </div>

      <div className="rounded-[10px] border border-gray-200 bg-[#F9FAFB] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Customer
          </span>
          <span className="text-[14px] font-bold text-gray-900">
            {reportData.customer}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Project type
          </span>
          <span className="text-[14px] font-bold text-gray-900">
            {reportData.projectType}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">Rater</span>
          <span className="text-[14px] font-bold text-gray-900">
            Promise Ray
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Year of Financials
          </span>
          <span className="text-[14px] font-bold text-gray-900">
            {reportData.yearOfFinancials}
          </span>
        </div>
      </div>

      <AccordionSection title="PF Financials">
        <FinancialTable rows={PF_FINANCIALS_ROWS} />
      </AccordionSection>

      <AccordionSection title="PF Non Financials">
        <NonFinancialsTable rows={PF_NON_FINANCIALS_ROWS} />
      </AccordionSection>

      <AccordionSection title="CF Financials">
        <FinancialTable rows={CF_FINANCIALS_ROWS} />
      </AccordionSection>

      <AccordionSection title="CF Non Financials">
        <NonFinancialsTable rows={CF_NON_FINANCIALS_ROWS} />
      </AccordionSection>

      <div className="rounded-[10px] border border-gray-200 bg-[#F9FAFB] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Financial Risk
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {reportData.pf.financialRisk}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Operational Risk
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {reportData.pf.operationalRisk}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Structure Risk
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {reportData.pf.structureRisk}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            PF Score
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {reportData.pf.pfScore}
          </span>
        </div>
      </div>

      <div className="rounded-[10px] border border-gray-200 bg-[#F9FAFB] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Financial Risk
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {reportData.cf.financialRisk}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Operational Risk
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {reportData.cf.operationalRisk}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            Structure Risk
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {reportData.cf.structureRisk}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-gray-400">
            CF Score
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {reportData.cf.cfScore}
          </span>
        </div>
      </div>

      <div className="rounded-[10px] bg-[#1A5FA8] p-5 grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Initial PF Score", value: reportData.initialPFScore },
          { label: "Initial CF Score", value: reportData.initialCFScore },
          {
            label: "Probability of Default",
            value: String(reportData.probabilityOfDefault),
          },
          {
            label: "Baseline Credit Score Rating",
            value: reportData.baselineCreditScore,
          },
          {
            label: "Final Credit Score Rating",
            value: reportData.finalCreditScore,
          },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[14px] font-medium text-blue-200">
              {item.label}
            </span>
            <span className="text-[18px] font-bold text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onReturnForRevision}
          className="w-full sm:w-auto h-[40px] px-6 border-gray-300 text-gray-600 text-[14px] font-semibold rounded-[8px]"
        >
          Return for Revision
        </Button>
        <Button
          onClick={onApproveRating}
          className="w-full sm:w-auto h-[40px] px-6 bg-teal-600 hover:bg-teal-700 text-white text-[14px] font-semibold rounded-[8px]"
        >
          Approve Rating
        </Button>
      </div>
    </div>
  );
};

export default ValidationReviewSheet;
