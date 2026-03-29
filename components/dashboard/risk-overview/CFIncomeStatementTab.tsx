"use client";

import { useEffect, useCallback } from "react";
import CFInputRow from "./CFInputRow";
import {
  CF_INCOME_ROWS,
  evaluateFormulaWithRows,
} from "@/constants/risk-overview-constants";

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
  const updateCalculatedFields = useCallback(
    (
      changedKey: string,
      setter: (key: string, value: string) => void,
      currentVals: Record<string, string>,
    ) => {
      const dependentRows = CF_INCOME_ROWS.filter(
        (row) => row.isCalculated && row.dependencies?.includes(changedKey),
      );

      dependentRows.forEach((dependentRow) => {
        if (dependentRow.formula) {
          const computedValue = evaluateFormulaWithRows(
            dependentRow.formula,
            currentVals,
            CF_INCOME_ROWS,
          );

          const currentValue = currentVals[dependentRow.key];
          if (currentValue !== computedValue.toString()) {
            setter(dependentRow.key, computedValue.toString());
          }
        }
      });
    },
    [],
  );

  const handleCurrentChange = (key: string, value: string) => {
    onCurrentChange(key, value);

    setTimeout(() => {
      updateCalculatedFields(key, onCurrentChange, {
        ...currentValues,
        [key]: value,
      });
    }, 0);
  };

  const handlePreviousChange = (key: string, value: string) => {
    onPreviousChange(key, value);

    setTimeout(() => {
      updateCalculatedFields(key, onPreviousChange, {
        ...previousValues,
        [key]: value,
      });
    }, 0);
  };

  // Initialize calculated fields on mount
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
  }, []);

  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
      <div>
        <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
          CURRENT PERIOD
        </h3>
        {CF_INCOME_ROWS.map((r) => (
          <CFInputRow
            key={r.key}
            label={r.label}
            value={currentValues[r.key] ?? ""}
            onChange={(v) => handleCurrentChange(r.key, v)}
            isCalculated={r.isCalculated}
          />
        ))}
      </div>

      <div>
        <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
          PREVIOUS PERIOD
        </h3>
        {CF_INCOME_ROWS.map((r) => (
          <CFInputRow
            key={r.key}
            label={r.label}
            value={previousValues[r.key] ?? ""}
            onChange={(v) => handlePreviousChange(r.key, v)}
            isCalculated={r.isCalculated}
          />
        ))}
      </div>
    </div>
  );
}
