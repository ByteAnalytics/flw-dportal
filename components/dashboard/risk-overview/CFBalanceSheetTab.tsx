"use client";

import { useEffect, useCallback } from "react";
import CFInputRow from "./CFInputRow";
import {
  CF_BALANCE_ROWS,
  evaluateFormulaWithRows,
} from "@/constants/risk-overview-constants";

interface CFBalanceSheetTabProps {
  currentValues: Record<string, string>;
  previousValues: Record<string, string>;
  onCurrentChange: (key: string, value: string) => void;
  onPreviousChange: (key: string, value: string) => void;
}

export default function CFBalanceSheetTab({
  currentValues,
  previousValues,
  onCurrentChange,
  onPreviousChange,
}: CFBalanceSheetTabProps) {
  const updateCalculatedFields = useCallback(
    (
      changedKey: string,
      setter: (key: string, value: string) => void,
      currentVals: Record<string, string>,
    ) => {
      // Find calculated fields that depend on the changed field
      const dependentRows = CF_BALANCE_ROWS.filter(
        (row) => row.isCalculated && row.dependencies?.includes(changedKey),
      );

      dependentRows.forEach((dependentRow) => {
        if (dependentRow.formula) {
          const computedValue = evaluateFormulaWithRows(
            dependentRow.formula,
            currentVals,
            CF_BALANCE_ROWS,
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
    CF_BALANCE_ROWS.forEach((row) => {
      if (row.isCalculated && row.formula) {
        const computedValue = evaluateFormulaWithRows(
          row.formula,
          currentValues,
          CF_BALANCE_ROWS,
        );
        if (currentValues[row.key] !== computedValue.toString()) {
          onCurrentChange(row.key, computedValue.toString());
        }

        const computedPrevValue = evaluateFormulaWithRows(
          row.formula,
          previousValues,
          CF_BALANCE_ROWS,
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
        <div className="grid gap-4 grid-cols-1">
          {CF_BALANCE_ROWS.map((row) => (
            <CFInputRow
              key={row.key}
              label={row.label}
              value={currentValues[row.key] ?? ""}
              onChange={(v) => handleCurrentChange(row.key, v)}
              isCalculated={row.isCalculated}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[14px] font-bold text-InfraSoftBlack mb-3">
          PREVIOUS PERIOD
        </h3>
        <div className="grid gap-4 grid-cols-1">
          {CF_BALANCE_ROWS.map((row) => (
            <CFInputRow
              key={row.key}
              label={row.label}
              value={previousValues[row.key] ?? ""}
              onChange={(v) => handlePreviousChange(row.key, v)}
              isCalculated={row.isCalculated}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
