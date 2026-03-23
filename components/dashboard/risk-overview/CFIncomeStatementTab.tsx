import CFInputRow from "./CFInputRow";

/* eslint-disable @typescript-eslint/no-explicit-any */

const INCOME_ROWS = [
  { key: "revenue", label: "Revenue" },
  { key: "costOfSale", label: "Cost Of Sale" },
  { key: "sgaExpenses", label: "SG&A Expenses" },
  { key: "depreciationAmortisation", label: "Depreciation & Amortisation" },
  { key: "otherOperatingIncome", label: "Other Operating Income/(Expenses)" },
  { key: "exceptionalItems", label: "Exceptional Items" },
  { key: "otherIncome", label: "Other Income" },
  { key: "interestReceivable", label: "Interest Receivable" },
  { key: "interestPayable", label: "Interest Payable" },
  { key: "tax", label: "Tax" },
  { key: "dividendsPaid", label: "Dividends Paid" },
  { key: "grossProfit", label: "Gross Profit", isCalculated: true },
  { key: "profitAfterTax", label: "Profit After Tax", isCalculated: true },
];

export default function CFIncomeStatementTab({
  currentValues,
  previousValues,
  onCurrentChange,
  onPreviousChange,
}: any) {
  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
      <div>
        <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
          CURRENT PERIOD
        </h3>
        {INCOME_ROWS.map((r) => (
          <CFInputRow
            key={r.key}
            label={r.label}
            value={currentValues[r.key] ?? ""}
            onChange={(v) => onCurrentChange(r.key, v)}
            isCalculated={r.isCalculated}
          />
        ))}
      </div>

      <div>
        <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
          PREVIOUS PERIOD
        </h3>
        {INCOME_ROWS.map((r) => (
          <CFInputRow
            key={r.key}
            label={r.label}
            value={previousValues[r.key] ?? ""}
            onChange={(v) => onPreviousChange(r.key, v)}
            isCalculated={r.isCalculated}
          />
        ))}
      </div>
    </div>
  );
}
