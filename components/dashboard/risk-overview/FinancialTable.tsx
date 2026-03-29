"use client";

import React from "react";
import { formatFinancialValue } from "@/constants/risk-overview-constants";

interface FinancialTableProps {
  rows: { label: string; isCalculated?: boolean; values?: number[] }[];
  years: number[];
  yearLabels?: string[];
}

const FinancialTable: React.FC<FinancialTableProps> = ({
  rows,
  years,
  yearLabels,
}) => {
  if (!rows.length) {
    return (
      <div className="text-center py-8 text-gray-500">No data available</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] min-w-[600px]">
        <thead>
          <tr className="bg-[#F9FAFB]">
            <th className="text-left px-4 py-2 font-semibold text-gray-500 w-[200px]">
              LINE ITEM
            </th>
            {years.map((year, index) => (
              <th
                key={index}
                className="text-left px-4 py-2 font-semibold text-gray-500 whitespace-nowrap"
              >
                {yearLabels?.[index] || `Year ${year}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-gray-100">
              <td
                className={`px-4 py-2 font-medium ${
                  row.isCalculated ? "text-amber-600" : "text-gray-700"
                }`}
              >
                {row.label}
              </td>
              {years.map((year, index) => (
                <td
                  key={index}
                  className={`px-4 py-2 whitespace-nowrap ${
                    row.isCalculated
                      ? "text-amber-600 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {row.values?.[index] !== undefined
                    ? formatFinancialValue(row.values[index])
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialTable;
