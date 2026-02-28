"use client";

import React from "react";
import { LegendItem } from "@/types/overview";

interface ChartLegendProps {
  items: LegendItem[];
}

const ChartLegend: React.FC<ChartLegendProps> = ({ items }) => {
  return (
    <div className="flex flex-wrap md:flex-col justify-center md:justify-between items-start gap-5 h-full">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-[500] text-gray-600">
              {item.label}
            </span>
            <span className="text-[15px] font-[700] text-gray-900">
              {item.value || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
