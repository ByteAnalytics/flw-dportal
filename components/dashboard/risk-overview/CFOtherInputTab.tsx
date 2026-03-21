
import CFInputRow from "./CFInputRow";

/* eslint-disable @typescript-eslint/no-explicit-any */

const rows = [
  { key: "loanRepayment", label: "Loan Repayment" },
  { key: "projectedCashFlow", label: "Projected Cash Flow" },
  { key: "numberOfYears", label: "Number of years" },
  { key: "operatingCashflow", label: "Operating Cashflow" },
];

export default function CFOtherInputTab({
  currentValues,
  previousValues,
  onCurrentChange,
  onPreviousChange,
}: any) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-[11px] font-bold text-gray-400 mb-3">
          CURRENT PERIOD
        </h3>

        {rows.map((r) => (
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

        {rows.map((r) => (
          <CFInputRow
            key={r.key}
            label={r.label}
            value={previousValues[r.key] ?? ""}
            onChange={(v) => onPreviousChange(r.key, v)}
          />
        ))}
      </div>
    </div>
  );
}
