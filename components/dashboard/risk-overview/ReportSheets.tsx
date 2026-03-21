"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Shared types ─────────────────────────────────────────────────────────────

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

// ─── PF Reports Sheet ─────────────────────────────────────────────────────────

interface PFReportsSheetProps {
  onClose: () => void;
  onSubmitForValidation: () => void;
  onSaveAsDraft?: () => void;
  reportData: ReportSummaryData;
}

const PFReportsSheet: React.FC<PFReportsSheetProps> = ({
  onClose,
  onSubmitForValidation,
  onSaveAsDraft,
  reportData,
}) => {
  const [activeTab, setActiveTab] = useState<"Report Summary" | "Full Report">(
    "Report Summary",
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1A6B5A] to-[#2D9B7F] rounded-t-[12px]">
        <h2 className="text-white text-[1.1rem] font-bold">PF Reports</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 pb-0 border-b border-gray-200">
        <div className="flex gap-0">
          {(["Report Summary", "Full Report"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === "Report Summary" && (
          <div className="flex flex-col gap-4">
            {/* Row 1: Customer info */}
            <div className="rounded-[10px] border border-gray-200 p-4 grid grid-cols-6 gap-4">
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Customer
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.customer}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Project type
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.projectType}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Year of Financials
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.yearOfFinancials}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Financial Risk
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.financialRisk}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Operational Risk
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.operationalRisk}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Structure Risk
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.structureRisk}
                </span>
              </div>
            </div>

            {/* Row 2: Scores */}
            <div className="rounded-[10px] border border-gray-200 p-4 grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-400">
                  PF Score
                </span>
                <span className="text-[20px] font-bold text-gray-900">
                  {reportData.pfScore ?? "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Probability of Default
                </span>
                <span className="text-[20px] font-bold text-gray-900">
                  {reportData.probabilityOfDefault}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Baseline Credit Score Rating
                </span>
                <span className="text-[20px] font-bold text-gray-900">
                  {reportData.baselineCreditScore}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-400">
                  Final Credit Score Rating
                </span>
                <span className="text-[20px] font-bold text-emerald-600">
                  {reportData.finalCreditScore}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Full Report" && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Full report view coming soon
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onSaveAsDraft}
          className="text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2"
        >
          Save as draft
        </button>
        <Button
          type="button"
          onClick={onSubmitForValidation}
          className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[14px] font-semibold rounded-[8px]"
        >
          Submit for Validation
        </Button>
      </div>
    </div>
  );
};

// ─── Combined Reports Sheet ───────────────────────────────────────────────────

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

interface CombinedReportsSheetProps {
  onClose: () => void;
  onSubmitForValidation: () => void;
  onSaveAsDraft?: () => void;
  reportData: CombinedReportData;
}

export const CombinedReportsSheet: React.FC<CombinedReportsSheetProps> = ({
  onClose,
  onSubmitForValidation,
  onSaveAsDraft,
  reportData,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1A6B5A] to-[#2D9B7F] rounded-t-[12px]">
        <h2 className="text-white text-[1.1rem] font-bold">Combined Reports</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Tab header */}
      <div className="px-6 pt-4 pb-0 border-b border-gray-200">
        <div className="flex gap-0">
          <button className="px-4 py-2.5 text-[13px] font-semibold border-b-2 border-blue-600 text-blue-700">
            Report Summary
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-4">
          {/* Row 1: Customer */}
          <div className="rounded-[10px] border border-gray-200 p-4 grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Customer
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.customer}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Project type
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.projectType}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Year of Financials
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.yearOfFinancials}
              </span>
            </div>
          </div>

          {/* Row 2: PF Risk scores */}
          <div className="rounded-[10px] border border-gray-200 p-4 grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Financial Risk
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.pf.financialRisk}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Operational Risk
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.pf.operationalRisk}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Structure Risk
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.pf.structureRisk}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                PF Score
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.pf.pfScore}
              </span>
            </div>
          </div>

          {/* Row 3: CF Risk scores */}
          <div className="rounded-[10px] border border-gray-200 p-4 grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Financial Risk
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.cf.financialRisk}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Operational Risk
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.cf.operationalRisk}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                Structure Risk
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.cf.structureRisk}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400">
                CF Score
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                {reportData.cf.cfScore}
              </span>
            </div>
          </div>

          {/* Row 4: Blue summary banner */}
          <div className="rounded-[10px] bg-[#1A5FA8] p-5 grid grid-cols-5 gap-4">
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
            ].map((item, i) => (
              <React.Fragment key={item.label}>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-blue-200">
                    {item.label}
                  </span>
                  <span className="text-[20px] font-bold text-white">
                    {item.value}
                  </span>
                </div>
                {i < 4 && (
                  <div className="absolute" style={{ display: "none" }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onSaveAsDraft}
          className="text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2"
        >
          Save as draft
        </button>
        <Button
          type="button"
          onClick={onSubmitForValidation}
          className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[14px] font-semibold rounded-[8px]"
        >
          Submit for Validation
        </Button>
      </div>
    </div>
  );
};

export default PFReportsSheet;
