import CFInputRow from "./CFInputRow";

/* eslint-disable @typescript-eslint/no-explicit-any */

const CURRENT_ROWS = [
  { key: "revenue", label: "Revenue" },
  { key: "costOfSale", label: "Cost of Sale" },
  { key: "sgaExpense", label: "SGA Expense" },
  { key: "depreciationAmortisation", label: "Depreciation and Amorisation" },
  { key: "otherOperatingIncome", label: "Other Operating Income (Expenses)" },
  { key: "cashAndCashEquivalents", label: "Cash and Cash Equivalents" },
  { key: "otherCurrentAssets", label: "Other Current Assets" },
  { key: "currentTaxLiabilities", label: "Current Tax Liabilities" },
  { key: "otherCurrentLiabilities", label: "Other Current Liabilities" },
  { key: "longTermLiabilities", label: "Long Term Liabilities" },
  { key: "shareholdersFunds", label: "Shareholders' Funds" },
  {
    key: "totalCurrentAssets",
    label: "Total Current Assets",
    isCalculated: true,
  },
  { key: "totalAssets", label: "Total Assets", isCalculated: true },
  { key: "netAssets", label: "Net Assets", isCalculated: true },
];

const PREVIOUS_ROWS = [
  { key: "revenue", label: "Revenue" },
  { key: "costOfSales", label: "Cost of Sales" },
  { key: "sgaExpenses", label: "SGA Expenses" },
  { key: "depreciation", label: "Depreciation" },
  { key: "interestReceivables", label: "Interest Receivables" },
  { key: "interestPayable", label: "Interest Payable" },
];

const RATIOS = [
  { key: "grossProfit", label: "Gross Profit" },
  { key: "operatingProfit", label: "Operating Profit" },
  { key: "profitBeforeTax", label: "Profit before Tax" },
  { key: "profitAfterTax", label: "Profit after Tax" },
];

export default function CFIncomeStatementTab({
  currentValues,
  previousValues,
  autoComputed,
  onCurrentChange,
  onPreviousChange,
  inputMode,
  onInputModeChange,
}: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
        <div>
          <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
            CURRENT PERIOD
          </h3>
          {CURRENT_ROWS.map((r) => (
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
          {PREVIOUS_ROWS.map((r) => (
            <CFInputRow
              key={r.key}
              label={r.label}
              value={previousValues[r.key] ?? ""}
              onChange={(v) => onPreviousChange(r.key, v)}
            />
          ))}
        </div>

        <div>
          <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
            Auto Computed Ratios
          </h3>
          {RATIOS.map((r) => (
            <div key={r.key} className="mb-4">
              <span className="text-[13px] text-gray-500">{r.label}</span>
              <div className="h-[55px] flex items-center px-3 bg-InfraBorder rounded-[8px] font-bold italic text-gray-800">
                {autoComputed?.[r.key] ?? "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
