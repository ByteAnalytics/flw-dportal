export const COLUMN_WIDTHS: { [key: string]: string } = {
  "LOAN UNIQUE ID": "w-[180px]",
  "CLIENT NAME": "w-[180px]",
  "FUND TYPE": "w-[120px]",
  LOAN_TYPE: "w-[140px]",
  "PRINCIPAL LOAN AMOUNT": "w-[150px]",
  EAD: "w-[140px]",
  STAGE: "w-[100px]",
  "FINAL ECL": "w-[150px]",
  "FINAL LGD": "w-[100px]",
  "EFFECTIVE INT RATE (%)": "w-[120px]",
  "DISBURSEMENT DATE (MM/DD/YYYY)": "w-[140px]",
  "EXPIRY DATE (MM/DD/YYYY)": "w-[140px]",
  REPAYMENT_FREQUENCY: "w-[140px]",
  PMT: "w-[130px]",
};

// Important columns to display
export const IMPORTANT_COLUMNS = [
  "LOAN UNIQUE ID",
  "CLIENT NAME",
  "FUND TYPE",
  "LOAN_TYPE",
  "PRINCIPAL LOAN AMOUNT",
  "EAD",
  "STAGE",
  "FINAL ECL",
  "FINAL LGD",
  "EFFECTIVE INT RATE (%)",
  "DISBURSEMENT DATE (MM/DD/YYYY)",
  "EXPIRY DATE (MM/DD/YYYY)",
  "REPAYMENT_FREQUENCY",
  "PMT",
];

// Default columns for empty state
export const DEFAULT_COLUMNS = [
  { key: "LOAN UNIQUE ID", label: "Loan Id", width: "w-[180px]" },
  { key: "CLIENT NAME", label: "Client Name", width: "w-[180px]" },
  { key: "FUND TYPE", label: "Fund Type", width: "w-[120px]" },
  { key: "LOAN_TYPE", label: "Loan Type", width: "w-[140px]" },
  {
    key: "PRINCIPAL LOAN AMOUNT",
    label: "Principal Amount",
    width: "w-[150px]",
  },
  { key: "EAD", label: "EAD", width: "w-[140px]" },
  { key: "STAGE", label: "Stage", width: "w-[100px]" },
  { key: "FINAL ECL", label: "Final ECL", width: "w-[150px]" },
  { key: "FINAL LGD", label: "LGD", width: "w-[100px]" },
  {
    key: "EFFECTIVE INT RATE (%)",
    label: "Interest Rate",
    width: "w-[120px]",
  },
];
