"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

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
      {/* Tabs */}
      <div className="pb-0 border-b border-gray-200">
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
      <div className="flex-1 overflow-y-auto py-6">
        {activeTab === "Report Summary" && (
          <div className="flex flex-col gap-7">
            {/* Row 1: Customer info */}
            <div className="rounded-[10px] border border-gray-200 bg-InfraBorder p-4 grid xl:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4">
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Customer
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.customer}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Project type
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.projectType}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Year of Financials
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.yearOfFinancials}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Financial Risk
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.financialRisk}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Operational Risk
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.operationalRisk}
                </span>
              </div>
              <div className="flex flex-col gap-1 col-span-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Structure Risk
                </span>
                <span className="text-[14px] font-bold text-gray-900">
                  {reportData.structureRisk}
                </span>
              </div>
            </div>

            {/* Row 2: Scores */}
            <div className="rounded-[10px] border border-gray-200 bg-InfraBorder p-4 grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-gray-400">
                  PF Score
                </span>
                <span className="text-[20px] font-bold text-gray-900">
                  {reportData.pfScore ?? "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Probability of Default
                </span>
                <span className="text-[20px] font-bold text-gray-900">
                  {reportData.probabilityOfDefault}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-gray-400">
                  Baseline Credit Score Rating
                </span>
                <span className="text-[20px] font-bold text-gray-900">
                  {reportData.baselineCreditScore}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-gray-400">
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
          className="text-[13px] border h-[40px] bg-white rounded-[8px] border-InfraBorder font-semibold text-gray-600 hover:text-gray-800 px-3 py-2"
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
