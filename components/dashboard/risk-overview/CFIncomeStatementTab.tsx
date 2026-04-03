"use client";

import { useEffect } from "react";
import CFInputRow from "./CFInputRow";
import {
  CF_INCOME_ROWS,
  evaluateFormulaWithRows,
} from "@/constants/risk-overview";
import { cleanCfLabel } from "@/lib/risk-overview-utils";

interface CFIncomeStatementTabProps {
  currentValues: Record<string, string>;
  previousValues: Record<string, string>;
  autoComputed?: Record<string, string>;
  onCurrentChange: (key: string, value: string) => void;
  onPreviousChange: (key: string, value: string) => void;
}

export default function CFIncomeStatementTab({
  currentValues,
  previousValues,
  onCurrentChange,
  onPreviousChange,
}: CFIncomeStatementTabProps) {
  const handleCurrentChange = (key: string, value: string) => {
    const updatedValues = { ...currentValues, [key]: value };
    onCurrentChange(key, value);

    const dependentRows = CF_INCOME_ROWS.filter(
      (row) => row.isCalculated && row.dependencies?.includes(key),
    );

    dependentRows.forEach((dependentRow) => {
      if (dependentRow.formula) {
        const computedValue = evaluateFormulaWithRows(
          dependentRow.formula,
          updatedValues,
          CF_INCOME_ROWS,
        );

        const currentValue = updatedValues[dependentRow.key];
        if (currentValue !== computedValue.toString()) {
          onCurrentChange(dependentRow.key, computedValue.toString());
        }
      }
    });
  };

  const handlePreviousChange = (key: string, value: string) => {
    const updatedValues = { ...previousValues, [key]: value };
    onPreviousChange(key, value);

    const dependentRows = CF_INCOME_ROWS.filter(
      (row) => row.isCalculated && row.dependencies?.includes(key),
    );

    dependentRows.forEach((dependentRow) => {
      if (dependentRow.formula) {
        const computedValue = evaluateFormulaWithRows(
          dependentRow.formula,
          updatedValues,
          CF_INCOME_ROWS,
        );

        const currentValue = updatedValues[dependentRow.key];
        if (currentValue !== computedValue.toString()) {
          onPreviousChange(dependentRow.key, computedValue.toString());
        }
      }
    });
  };

  useEffect(() => {
    CF_INCOME_ROWS.forEach((row) => {
      if (row.isCalculated && row.formula) {
        const computedValue = evaluateFormulaWithRows(
          row.formula,
          currentValues,
          CF_INCOME_ROWS,
        );
        if (currentValues[row.key] !== computedValue.toString()) {
          onCurrentChange(row.key, computedValue.toString());
        }

        const computedPrevValue = evaluateFormulaWithRows(
          row.formula,
          previousValues,
          CF_INCOME_ROWS,
        );
        if (previousValues[row.key] !== computedPrevValue.toString()) {
          onPreviousChange(row.key, computedPrevValue.toString());
        }
      }
    });
  }, [currentValues, previousValues, onCurrentChange, onPreviousChange]);

  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
      <div>
        <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
          CURRENT PERIOD
        </h3>
        {CF_INCOME_ROWS.map((r) => {
          return (
            <CFInputRow
              key={r.key}
              label={cleanCfLabel(r?.label ?? "")}
              value={currentValues[r.key] ?? ""}
              onChange={(v) => handleCurrentChange(r.key, v)}
              isCalculated={r.isCalculated}
            />
          );
        })}
      </div>

      <div>
        <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
          PREVIOUS PERIOD
        </h3>
        {CF_INCOME_ROWS.map((r) => (
          <CFInputRow
            key={r.key}
            label={cleanCfLabel(r?.label ?? "")}
            value={previousValues[r.key] ?? ""}
            onChange={(v) => handlePreviousChange(r.key, v)}
            isCalculated={r.isCalculated}
          />
        ))}
      </div>
    </div>
  );
}
