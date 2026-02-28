"use client";

import React from "react";
import { DoughnutChart } from "@/components/dashboard/overview/DoughnutChart";
import { LegendItem } from "@/types/overview";
import ChartLegend from "./ChartLegend";

interface ChartDetailsCardProps {
  title?: string;
  chartData: number[];
  labels: string[];
  colors: string[];
  legendItems: LegendItem[];
}

const ChartDetailsCard: React.FC<ChartDetailsCardProps> = ({
  title = "ECL by Stages",
  chartData,
  labels,
  colors,
  legendItems,
}) => {
  return (
    <div className="bg-white rounded-[20px] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[17px] font-[600] text-gray-900">{title}</h3>
      </div>

      <div className="flex flex-col  sm:flex-row items-center sm:gap-5 gap-3 w-full">
        <div className="w-[250px] h-[250px] md:w-[270px] md:h-[270px]">
          <DoughnutChart data={chartData} labels={labels} colors={colors} />
        </div>
        <ChartLegend items={legendItems} />
      </div>
    </div>
  );
};

export default ChartDetailsCard;
