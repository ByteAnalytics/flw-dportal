"use client";

import React from "react";
import CustomButton from "@/components/ui/custom-button";

type ScoreMetric = { key: string; label: string };
type ScoreSection = { title: string; metrics: ScoreMetric[] };

const CF_SCORE_SECTIONS: ScoreSection[] = [
  {
    title: "Solvency",
    metrics: [
      { key: "debtServiceCoverageRatio", label: "Debt Service Coverage Ratio" },
      { key: "debtToEquity", label: "Debt to Equity" },
      { key: "interestCoverageRatio", label: "Interest Coverage Ratio" },
      {
        key: "growthInProjectedCashFlow",
        label: "Growth in Projected Cash Flow",
      },
    ],
  },
  {
    title: "Profitability",
    metrics: [
      { key: "operatingIncomeMargin", label: "Operating Income Margin" },
      { key: "grossProfitMargin", label: "Gross Profit Margin" },
      { key: "returnOnEquity", label: "Return on Equity" },
      { key: "netProfitMargin", label: "Net Profit Margin" },
      { key: "returnOnTotalAssets", label: "Return on Total Assets" },
    ],
  },
  {
    title: "Liquidity",
    metrics: [
      { key: "operatingCashflow", label: "Operating Cashflow" },
      { key: "currentRatio", label: "Current Ratio" },
      { key: "quickRatio", label: "Quick Ratio" },
    ],
  },
  {
    title: "Turnover",
    metrics: [
      { key: "operatingCashflow2", label: "Operating Cashflow" },
      { key: "currentRatio2", label: "Current Ratio" },
      { key: "quickRatio2", label: "Quick Ratio" },
    ],
  },
];

const MOCK_VALUES: Record<string, string> = {
  debtServiceCoverageRatio: "1.8",
  debtToEquity: "0.8",
  interestCoverageRatio: "1.4",
  growthInProjectedCashFlow: "2.3",
  operatingIncomeMargin: "1.2",
  grossProfitMargin: "0.9",
  returnOnEquity: "0.9",
  netProfitMargin: "1.7",
  returnOnTotalAssets: "1.3",
  operatingCashflow: "1.2",
  currentRatio: "0.9",
  quickRatio: "0.9",
  operatingCashflow2: "1.2",
  currentRatio2: "0.9",
  quickRatio2: "0.9",
};

interface CFScoringSheetProps {
  onClose: () => void;
  onNext: () => void;
  onSaveAsDraft?: () => void;
  values?: Record<string, string>;
}

const CFScoringSheet: React.FC<CFScoringSheetProps> = ({
  onNext,
  onSaveAsDraft,
  values = MOCK_VALUES,
}) => {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-col gap-8">
        {CF_SCORE_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-[14px] font-bold text-gray-800 mb-3">
              {section.title}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {section.metrics.map((metric) => (
                <div
                  key={metric.key}
                  className="flex flex-col gap-1 p-4 rounded-[10px] border border-gray-200 bg-white"
                >
                  <span className="text-[13px] font-medium text-gray-400 leading-tight">
                    {metric.label}
                  </span>
                  <span className="text-[20px] font-bold text-gray-900 mt-1">
                    {values[metric.key] ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <CustomButton
          title="Save as draft"
          onClick={onSaveAsDraft}
          className="bg-transparent border border-InfraBorder text-InfraSoftBlack hover:bg-gray-50 rounded-[8px] px-6"
        />
        <CustomButton
          title="Next"
          onClick={onNext}
          className="hover:opacity-90 text-white rounded-[8px] px-8"
        />
      </div>
    </div>
  );
};

export default CFScoringSheet;
