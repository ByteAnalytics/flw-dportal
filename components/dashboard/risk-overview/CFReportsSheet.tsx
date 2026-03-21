"use client";

import React, { useState } from "react";
import CustomButton from "@/components/ui/custom-button";
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

interface PFReportsSheetProps {
  onClose: () => void;
  onSubmitForValidation: () => void;
  onSaveAsDraft?: () => void;
  reportData: ReportSummaryData;
}

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-[12px] border border-gray-200 bg-[#F9FAFB] p-5">
    {children}
  </div>
);

const InfoField = ({
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
  reportData: CombinedReportData;
}

const CombinedReportsSheet: React.FC<CombinedReportsSheetProps> = ({
  onSubmitForValidation,
  onSaveAsDraft,
  reportData,
}) => {
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
            <InfoField label="Customer" value={reportData.customer} />
            <InfoField label="Project type" value={reportData.projectType} />
            <InfoField
              label="Year of Financials"
              value={reportData.yearOfFinancials}
            />
          </div>
        </InfoCard>

        <InfoCard>
          <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            <InfoField
              label="Financial Risk"
              value={reportData.pf.financialRisk}
            />
            <InfoField
              label="Operational Risk"
              value={reportData.pf.operationalRisk}
            />
            <InfoField
              label="Structure Risk"
              value={reportData.pf.structureRisk}
            />
            <InfoField label="PF Score" value={reportData.pf.pfScore} />
          </div>
        </InfoCard>

        <InfoCard>
          <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            <InfoField
              label="Financial Risk"
              value={reportData.cf.financialRisk}
            />
            <InfoField
              label="Operational Risk"
              value={reportData.cf.operationalRisk}
            />
            <InfoField
              label="Structure Risk"
              value={reportData.cf.structureRisk}
            />
            <InfoField label="CF Score" value={reportData.cf.cfScore} />
          </div>
        </InfoCard>

        <div className="rounded-[12px] bg-[#1A5FA8] p-5 grid grid-cols-2 sm:grid-cols-5 gap-4">
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

export default CombinedReportsSheet;
