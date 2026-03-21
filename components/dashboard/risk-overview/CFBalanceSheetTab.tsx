import CFInputRow from "./CFInputRow";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const CF_BALANCE_ROWS = [
  { key: "totalNonCurrentAssets", label: "Total Non Current Assets" },
  { key: "inventory", label: "Inventory" },
  { key: "tradeDebtors", label: "Trade Debtors" },
  { key: "totalReceivables", label: "Total Receivables" },
  { key: "prepayment", label: "Prepayment" },
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

export default function CFBalanceSheetTab({
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
        <div className="grid gap-4 grid-cols-1">
          {CF_BALANCE_ROWS.map((row) => (
            <CFInputRow
              key={row.key}
              label={row.label}
              value={currentValues[row.key] ?? ""}
              onChange={(v) => onCurrentChange(row.key, v)}
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
              onChange={(v) => onPreviousChange(row.key, v)}
              isCalculated={row.isCalculated}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
