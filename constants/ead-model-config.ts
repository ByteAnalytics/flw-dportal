export const COLUMN_CONFIG: {
  [key: string]: { label: string; width: string };
} = {
  "LOAN UNIQUE ID": { label: "Loan ID", width: "w-[180px]" },
  "CLIENT NAME": { label: "Client Name", width: "w-[200px]" },
  "LOAN CLASS": { label: "Loan Class", width: "w-[120px]" },
  "OUTSTANDING BALANCE": { label: "Outstanding Balance", width: "w-[150px]" },
  "PRINCIPAL LOAN AMOUNT": { label: "Principal Amount", width: "w-[150px]" },
  "DISBURSEMENT DATE (MM/DD/YYYY)": {
    label: "Disbursement Date",
    width: "w-[150px]",
  },
  "EXPIRY DATE (MM/DD/YYYY)": { label: "Expiry Date", width: "w-[120px]" },
  LOAN_TYPE: { label: "Loan Type", width: "w-[120px]" },
  "EFFECTIVE INT RATE (%)": { label: "Interest Rate", width: "w-[100px]" },
  REPAYMENT_FREQUENCY: { label: "Repayment Freq", width: "w-[130px]" },
  PERFORMANCE_STATUS: { label: "Performance Status", width: "w-[150px]" },
  "DAYS PAST DUE": { label: "Days Past Due", width: "w-[120px]" },
  COLLATERAL_TYPE: { label: "Collateral Type", width: "w-[130px]" },
  "COLLATERAL AMOUNT": { label: "Collateral Amount", width: "w-[140px]" },
  STAGE: { label: "Stage", width: "w-[80px]" },
  "FINAL STAGING": { label: "Final Staging", width: "w-[100px]" },
  "TENOR (DAYS)": { label: "Tenor (Days)", width: "w-[110px]" },
  "TIME TO MATURITY": { label: "Time to Maturity", width: "w-[130px]" },
  UNDRAWN: { label: "Undrawn Amount", width: "w-[130px]" },
  MATURED: { label: "Matured", width: "w-[80px]" },
  "MONTHLY EIR": { label: "Monthly EIR", width: "w-[100px]" },
  "PERIODIC EIR": { label: "Periodic EIR", width: "w-[100px]" },
  "EIR ADJUSTED": { label: "EIR Adjusted", width: "w-[100px]" },
};

// Default columns for empty state
export const DEFAULT_COLUMNS = [
  { key: "LOAN UNIQUE ID", label: "Loan ID", width: "w-[180px]" },
  { key: "CLIENT NAME", label: "Client Name", width: "w-[200px]" },
  { key: "LOAN CLASS", label: "Loan Class", width: "w-[120px]" },
  {
    key: "OUTSTANDING BALANCE",
    label: "Outstanding Balance",
    width: "w-[150px]",
  },
  {
    key: "PRINCIPAL LOAN AMOUNT",
    label: "Principal Amount",
    width: "w-[150px]",
  },
  { key: "LOAN_TYPE", label: "Loan Type", width: "w-[120px]" },
  {
    key: "EFFECTIVE INT RATE (%)",
    label: "Interest Rate",
    width: "w-[100px]",
  },
  {
    key: "PERFORMANCE_STATUS",
    label: "Performance Status",
    width: "w-[150px]",
  },
  { key: "STAGE", label: "Stage", width: "w-[80px]" },
];
