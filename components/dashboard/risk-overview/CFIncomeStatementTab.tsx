import React from "react";
import CFInputRow from "./CFInputRow";

export default function CFIncomeStatementTab({
  currentValues,
  previousValues,
  autoComputed,
  onCurrentChange,
  onPreviousChange,
}: any) {
  const currentRows = [
    { key: "revenue", label: "Revenue" },
    { key: "costOfSale", label: "Cost of Sale" },
    { key: "sgaExpense", label: "SGA Expense" },
    { key: "depreciationAmortisation", label: "Depreciation and Amortisation" },
    { key: "otherOperatingIncome", label: "Other Operating Income" },
  ];

  const previousRows = [
    { key: "revenue", label: "Revenue" },
    { key: "costOfSales", label: "Cost of Sales" },
    { key: "sgaExpenses", label: "SGA Expenses" },
    { key: "depreciation", label: "Depreciation" },
    { key: "interestPayable", label: "Interest Payable" },
  ];

  const ratios = [
    { key: "grossProfit", label: "Gross Profit" },
    { key: "operatingProfit", label: "Operating Profit" },
    { key: "profitBeforeTax", label: "Profit before Tax" },
    { key: "profitAfterTax", label: "Profit after Tax" },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      <div>
        <h3 className="text-[11px] font-bold text-gray-400 mb-3">
          CURRENT PERIOD
        </h3>

        {currentRows.map((r) => (
          <CFInputRow
            key={r.key}
            label={r.label}
            value={currentValues[r.key] ?? ""}
            onChange={(v) => onCurrentChange(r.key, v)}
          />
        ))}
      </div>

      <div>
        <h3 className="text-[11px] font-bold text-gray-400 mb-3">
          PREVIOUS PERIOD
        </h3>

        {previousRows.map((r) => (
          <CFInputRow
            key={r.key}
            label={r.label}
            value={previousValues[r.key] ?? ""}
            onChange={(v) => onPreviousChange(r.key, v)}
          />
        ))}
      </div>

      <div>
        <h3 className="text-[11px] font-bold text-gray-400 mb-3">
          AUTO COMPUTED
        </h3>

        {ratios.map((r) => (
          <div key={r.key} className="mb-3">
            <span className="text-[12px] text-gray-500">{r.label}</span>
            <div className="h-[40px] flex items-center px-3 bg-gray-100 rounded">
              {autoComputed[r.key] ?? "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
