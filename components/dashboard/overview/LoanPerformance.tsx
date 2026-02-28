"use client";

import ChartDetailsCard from "@/components/dashboard/overview/ChartDetails";
import { LoanPerformanceChart } from "@/constants/overview";
import React from "react";
import { formatPercentage } from "@/lib/utils";

interface LoanPerformanceCardProps {
  performingPercentage: number;
  nonPerformingPercentage: number;
}

export const LoanPerformanceCard: React.FC<LoanPerformanceCardProps> = ({
  performingPercentage,
  nonPerformingPercentage,
}) => {
  const chartData = [nonPerformingPercentage * 100, performingPercentage * 100];

  const legendItems = [
    {
      label: "Non Performing Loans",
      value: formatPercentage(nonPerformingPercentage),
      color: "#FF9E69",
    },
    {
      label: "Performing Loans",
      value: formatPercentage(performingPercentage),
      color: "#3B82F6",
    },
  ];

  return (
    <ChartDetailsCard
      title="Loan Performance Ratio"
      chartData={chartData}
      labels={LoanPerformanceChart.labels}
      colors={LoanPerformanceChart.colors}
      legendItems={legendItems}
    />
  );
};
