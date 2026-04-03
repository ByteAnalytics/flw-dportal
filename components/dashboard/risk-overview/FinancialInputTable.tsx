"use client";

import React, { useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import {
  sanitizeFormula,
  createSafeVariableName,
} from "@/constants/risk-overview";

export type FinancialRow = {
  key: string;
  label: string;
  isCalculated?: boolean;
  formula?: string;
  dependencies?: string[];
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
  const evaluateFormula = useCallback(
    (
      formula: string,
      currentValues: Record<string, Record<number, string>>,
      year: number,
    ): number => {
      const sanitizedFormula = sanitizeFormula(formula);
      let expression = sanitizedFormula;

      const sortedRows = [...rows].sort(
        (a, b) => b.label.length - a.label.length,
      );

      const variableMap: Record<string, number> = {};

      sortedRows.forEach((row) => {
        const safeName = createSafeVariableName(row.label);
        const value = currentValues[row.key]?.[year];
        const numericValue =
          value && !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        variableMap[safeName] = numericValue;
      });

      sortedRows.forEach((row) => {
        const safeName = createSafeVariableName(row.label);
        const escapedLabel = row.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedLabel, "g");
        expression = expression.replace(regex, safeName);
      });

      sortedRows.forEach((row) => {
        const escapedKey = row.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedKey, "g");
        const safeName = createSafeVariableName(row.label);
        expression = expression.replace(regex, safeName);
      });

      const varNames = Object.keys(variableMap);
      const varValues = Object.values(variableMap);

      try {
        const fnBody = `return (${expression})`;
        const fn = new Function(...varNames, fnBody);
        const result = fn(...varValues);

        if (isNaN(result) || !isFinite(result)) return 0;
        return result;
      } catch (error) {
        console.error("Error evaluating formula:", formula, error);
        console.error("Sanitized expression:", expression);
        console.error("Variable map:", variableMap);
        return 0;
      }
    },
    [rows],
  );

  const handleInputChange = (rowKey: string, year: number, value: string) => {
    onChange(rowKey, year, value);

    const row = rows.find((r) => r.key === rowKey);
    if (row && !row.isCalculated) {
      const updatedValues = {
        ...values,
        [rowKey]: { ...(values[rowKey] ?? {}), [year]: value },
      };

      const dependentRows = rows.filter(
        (r) => r.isCalculated && r.dependencies?.includes(rowKey),
      );

      dependentRows.forEach((dependentRow) => {
        if (dependentRow.formula) {
          const computedValue = evaluateFormula(
            dependentRow.formula,
            updatedValues,
            year,
          );

          const currentValue = updatedValues[dependentRow.key]?.[year];
          if (currentValue !== computedValue.toString()) {
            onChange(dependentRow.key, year, computedValue.toString());
          }
        }
      });
    }
  };

  useEffect(() => {
    years.forEach((year) => {
      rows.forEach((row) => {
        if (row.isCalculated && row.formula) {
          const computedValue = evaluateFormula(row.formula, values, year);
          const currentValue = values[row.key]?.[year];

          const shouldUpdate =
            currentValue !== computedValue.toString() && computedValue !== 0;

          if (shouldUpdate) {
            onChange(row.key, year, computedValue.toString());
          }
        }
      });
    });
  }, [values, rows, years, onChange, evaluateFormula]);

  return (
    <div className="flex flex-col">
      {/* Add new column */}
      <div className="flex justify-end mb-4">
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
                className="border-b border-gray-100 last:border-0"
              >
                <td className="py-2 pr-4 pl-2 text-[13px] font-medium w-[200px] min-w-[180px]">
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
                      onChange={(e) =>
                        handleInputChange(row.key, year, e.target.value)
                      }
                      className={`w-full h-[32px] px-2 text-right text-[12px] font-medium rounded-[6px] outline-none border focus:border-emerald-400 transition-colors
                        ${
                          row.isCalculated
                            ? "border-amber-300 bg-amber-50 text-amber-700 focus:border-amber-400 cursor-not-allowed"
                            : "border-gray-200 bg-gray-50 text-gray-700 focus:bg-white hover:border-gray-300"
                        }`}
                      placeholder="—"
                      readOnly={row.isCalculated}
                      disabled={row.isCalculated}
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
