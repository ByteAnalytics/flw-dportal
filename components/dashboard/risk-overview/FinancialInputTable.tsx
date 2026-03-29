"use client";

import React, { useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import {
  sanitizeFormula,
  createSafeVariableName,
} from "@/constants/risk-overview-constants";

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
      // First, sanitize the formula
      const sanitizedFormula = sanitizeFormula(formula);
      let expression = sanitizedFormula;

      // Sort rows by label length descending to avoid partial replacements
      const sortedRows = [...rows].sort(
        (a, b) => b.label.length - a.label.length,
      );

      // Create a map of safe variable names to actual values
      const variableMap: Record<string, number> = {};

      // First pass: Create safe variable names and collect values
      sortedRows.forEach((row) => {
        const safeName = createSafeVariableName(row.label);
        const value = currentValues[row.key]?.[year];
        const numericValue =
          value && !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        variableMap[safeName] = numericValue;
      });

      // Second pass: Replace labels with safe variable names
      sortedRows.forEach((row) => {
        const safeName = createSafeVariableName(row.label);
        // Escape special regex characters in the label
        const escapedLabel = row.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedLabel, "g");
        expression = expression.replace(regex, safeName);
      });

      // Also handle direct key references
      sortedRows.forEach((row) => {
        const escapedKey = row.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedKey, "g");
        const safeName = createSafeVariableName(row.label);
        expression = expression.replace(regex, safeName);
      });

      // Now build the evaluation function with safe variable names
      const varNames = Object.keys(variableMap);
      const varValues = Object.values(variableMap);

      try {
        // Create a function with the variable names as parameters
        // Using Function constructor with parameter names that are valid identifiers
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

  // Update calculated rows when dependencies change
  const updateCalculatedRows = useCallback(
    (changedRowKey: string, changedYear: number) => {
      // Find rows that depend on the changed row
      const dependentRows = rows.filter(
        (row) => row.isCalculated && row.dependencies?.includes(changedRowKey),
      );

      dependentRows.forEach((dependentRow) => {
        if (dependentRow.formula) {
          const computedValue = evaluateFormula(
            dependentRow.formula,
            values,
            changedYear,
          );

          // Only update if the value has changed
          const currentValue = values[dependentRow.key]?.[changedYear];
          if (currentValue !== computedValue.toString()) {
            onChange(dependentRow.key, changedYear, computedValue.toString());
          }
        }
      });
    },
    [rows, values, onChange, evaluateFormula],
  );

  // Handle input changes for non-calculated rows
  const handleInputChange = (rowKey: string, year: number, value: string) => {
    // Update the value
    onChange(rowKey, year, value);

    // Check if this row is a dependency for any calculated rows
    const row = rows.find((r) => r.key === rowKey);
    if (row && !row.isCalculated) {
      // Use setTimeout to ensure the state update is complete
      setTimeout(() => {
        updateCalculatedRows(rowKey, year);
      }, 0);
    }
  };

  // Update all calculated rows when any value changes
  useEffect(() => {
    // Update all calculated rows
    years.forEach((year) => {
      rows.forEach((row) => {
        if (row.isCalculated && row.formula) {
          const computedValue = evaluateFormula(row.formula, values, year);
          const currentValue = values[row.key]?.[year];

          if (
            currentValue !== computedValue.toString() &&
            computedValue !== 0
          ) {
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
