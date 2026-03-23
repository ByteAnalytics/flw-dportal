import CFInputRow from "./CFInputRow";

/* eslint-disable @typescript-eslint/no-explicit-any */

const OTHER_INPUT_ROWS = [
  {
    key: "loanRepayment",
    label: "Loan repayments (principal and interest) due within one year",
  },
  {
    key: "projectedCashFlow",
    label: "Projected cash flow based on company's financial projections",
  },
  { key: "numberOfYears", label: "No. of years of projection" },
  {
    key: "operatingCashflow",
    label: "Operating cash flow from statement of cashflow",
  },
];

export default function CFOtherInputTab({
  currentValues,
  onCurrentChange,
}: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-md">
        <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
          OTHER INPUTS
        </h3>
        {OTHER_INPUT_ROWS.map((r) => (
          <CFInputRow
            key={r.key}
            label={r.label}
            value={currentValues[r.key] ?? ""}
            onChange={(v) => onCurrentChange(r.key, v)}
          />
        ))}
      </div>
    </div>
  );
}
