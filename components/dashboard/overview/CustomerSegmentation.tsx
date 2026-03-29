"use client";

import ChartDetailsCard from "@/components/dashboard/overview/ChartDetails";
import React from "react";
import { ECLScenarioSummary } from "@/types/reporting";

interface CustomerSegmentationCardProps {
  eclSummaryPerScenario?: {
    Baseline: ECLScenarioSummary;
    "Best Case": ECLScenarioSummary;
    "Worst Case": ECLScenarioSummary;
  };
}

export const CustomerSegmentationCard: React.FC<
  CustomerSegmentationCardProps
> = ({ eclSummaryPerScenario }) => {
  const baseline = eclSummaryPerScenario?.Baseline?.total_ecl ?? 0;
  const bestCase = eclSummaryPerScenario?.["Best Case"]?.total_ecl ?? 0;
  const worstCase = eclSummaryPerScenario?.["Worst Case"]?.total_ecl ?? 0;

  const total = baseline + bestCase + worstCase;

  const chartData =
    total > 0
      ? [
          (baseline / total) * 100,
          (bestCase / total) * 100,
          (worstCase / total) * 100,
        ]
      : [0, 0, 0];

  const legendItems = [
    { label: "Baseline", value: String(baseline.toFixed(2)), color: "#F79661" },
    {
      label: "Best Case",
      value: String(bestCase.toFixed(2)),
      color: "#2B4DED",
    },
    {
      label: "Worst Case",
      value: String(worstCase.toFixed(2)),
      color: "#2BEB81",
    },
  ];

  return (
    <ChartDetailsCard
      title="Probability of Scenarios"
      chartData={chartData}
      labels={["Baseline", "Best Case", "Worst Case"]}
      colors={["#FDDD48", "#96D4AB", "#3B82F6"]}
      legendItems={legendItems}
    />
  );
};
