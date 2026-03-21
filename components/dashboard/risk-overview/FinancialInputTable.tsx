"use client";

import React from "react";
import { Plus } from "lucide-react";

export type FinancialRow = {
  key: string;
  label: string;
  isCalculated?: boolean; // teal label + highlighted input
};

type Props = {
  rows: FinancialRow[];
  years: number[];
  values: Record<string, Record<number, string>>;
  onChange: (rowKey: string, year: number, value: string) => void;
  onAddColumn?: () => void;
};

const FinancialInputTable: React.FC<Props> = ({
  rows,
  years,
  values,
  onChange,
  onAddColumn,
}) => {
  return (
    <div className="flex flex-col">
      {/* Add new column */}
      <div className="flex justify-end mb-4 ">
        <button
          type="button"
          onClick={onAddColumn}
          className="flex items-center gap-1 text-[13px] font-semibold text-InfraGreen italic cursor-pointer hover:text-emerald-700"
        >
          Add new column <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[700px]">
          <thead className="bg-InfraBorder">
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 pr-4 pl-2 text-[14px] font-semibold text-gray-500 uppercase tracking-wide w-[200px] min-w-[180px]">
                LINE ITEM
              </th>
              {years.map((year) => (
                <th
                  key={year}
                  className="text-center py-2 px-2 text-[14px] font-semibold text-gray-500 uppercase tracking-wide min-w-[110px]"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className="border-b border-gray-100 last:border-0 pl-2"
              >
                <td className="py-2 pr-4 text-[13px] font-medium w-[200px] min-w-[180px]">
                  <span
                    className={
                      row.isCalculated
                        ? "text-emerald-600 font-semibold"
                        : "text-gray-700"
                    }
                  >
                    {row.label}
                  </span>
                </td>
                {years.map((year) => (
                  <td key={year} className="py-2 px-2 min-w-[110px]">
                    <input
                      type="text"
                      value={values[row.key]?.[year] ?? ""}
                      onChange={(e) => onChange(row.key, year, e.target.value)}
                      className={`w-full h-[32px] px-2 text-right text-[12px] font-medium rounded-[6px] outline-none border focus:border-emerald-400
                        ${
                          row.isCalculated
                            ? "border-amber-300 bg-amber-50 text-amber-700 focus:border-amber-400"
                            : "border-gray-200 bg-gray-50 text-gray-700 focus:bg-white"
                        }`}
                      placeholder="—"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialInputTable;