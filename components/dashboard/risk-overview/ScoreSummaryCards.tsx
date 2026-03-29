"use client";

import { CombinedReportData } from "./CFReportsSheet";

const ScoreSummaryCards = ({
  reportData,
}: {
  reportData: CombinedReportData;
}) => (
  <>
    <div className="rounded-[10px] border border-gray-200 bg-[#F9FAFB] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Financial Risk", value: reportData.pf.financialRisk },
        { label: "Operational Risk", value: reportData.pf.operationalRisk },
        { label: "Structure Risk", value: reportData.pf.structureRisk },
        { label: "PF Score", value: reportData.pf.pfScore },
      ].map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-gray-400">
            {item.label}
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {item.value}
          </span>
        </div>
      ))}
    </div>

    <div className="rounded-[10px] border border-gray-200 bg-[#F9FAFB] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: "Financial Risk", value: reportData.cf.financialRisk },
        { label: "Operational Risk", value: reportData.cf.operationalRisk },
        { label: "Structure Risk", value: reportData.cf.structureRisk },
        { label: "CF Score", value: reportData.cf.cfScore },
      ].map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-gray-400">
            {item.label}
          </span>
          <span className="text-[15px] font-bold text-gray-900">
            {item.value}
          </span>
        </div>
      ))}
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
          <span className="text-[13px] font-medium text-blue-200">
            {item.label}
          </span>
          <span className="text-[18px] font-bold text-white">{item.value}</span>
        </div>
      ))}
    </div>
  </>
);

export default ScoreSummaryCards;
