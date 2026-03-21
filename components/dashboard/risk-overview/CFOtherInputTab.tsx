import CFInputRow from "./CFInputRow";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ROWS = [
  { key: "loanRepayment", label: "Loan Repayment" },
  { key: "projectedCashFlow", label: "Projected Cash Flow" },
  { key: "numberOfYears", label: "Number of years" },
  { key: "operatingCashflow", label: "Operating Cashflow" },
];

const RATIOS = [
  { key: "grossProfit", label: "Gross Profit" },
  { key: "operatingProfit", label: "Operating Profit" },
  { key: "profitBeforeTax", label: "Profit before Tax" },
  { key: "profitAfterTax", label: "Profit after Tax" },
];

export default function CFOtherInputTab({
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
          {ROWS.map((r) => (
            <CFInputRow
              key={r.key}
              label={r.label}
              value={currentValues[r.key] ?? ""}
              onChange={(v) => onCurrentChange(r.key, v)}
            />
          ))}
        </div>

        <div>
          <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
            CURRENT PERIOD
          </h3>
          {ROWS.map((r) => (
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
