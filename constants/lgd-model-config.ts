export const COLUMN_CONFIG: {
  [key: string]: { label: string; width: string };
} = {
  "LOAN ID": { label: "Loan ID", width: "w-[150px]" },
  "CLIENT NAME": { label: "Client Name", width: "w-[200px]" },
  "LOAN CLASS": { label: "Loan Class", width: "w-[120px]" },
  STAGE: { label: "Stage", width: "w-[80px]" },
  "OUTSTANDING BALANCE": { label: "Outstanding Balance", width: "w-[200px]" },
  "EFFECTIVE INT RATE (%)": { label: "Interest Rate", width: "w-[100px]" },
  "EIR ADJUSTED": { label: "EIR Adjusted", width: "w-[100px]" },
  COLLATERAL_TYPE: { label: "Collateral Type", width: "w-[200px]" },
  "COLLATERAL AMOUNT": { label: "Collateral Amount", width: "w-[200px]" },
  REMAPPED_COLLATERAL_TYPE: {
    label: "Remapped Collateral Type",
    width: "w-[180px]",
  },
  HAIRCUT: { label: "Haircut", width: "w-[100px]" },
  "TIME TO RECOVERY": { label: "Time to Recovery", width: "w-[130px]" },
  "DISCOUNTED COLLATERAL VALUE": {
    label: "Discounted Collateral Value",
    width: "w-[180px]",
  },
  "COLLATERAL ALLOCATED": {
    label: "Collateral Allocated",
    width: "w-[200px]",
  },
  "COLLATERAL UTILIZED": {
    label: "Collateral Utilized",
    width: "w-[200px]",
  },
  "SECURED RECOVERY": { label: "Secured Recovery", width: "w-[130px]" },
  "SECURED LGD": { label: "Secured LGD", width: "w-[110px]" },
  "UNSECURED LGD": { label: "Unsecured LGD", width: "w-[120px]" },
  "FINAL LGD": { label: "Final LGD", width: "w-[100px]" },
};

// Default columns for empty state
export const DEFAULT_COLUMNS = [
  { key: "LOAN ID", label: "Loan ID", width: "w-[150px]" },
  { key: "LOAN CLASS", label: "Loan Class", width: "w-[200px]" },
  {
    key: "OUTSTANDING BALANCE",
    label: "Outstanding Balance",
    width: "w-[200px]",
  },
  { key: "COLLATERAL_TYPE", label: "Collateral Type", width: "w-[200px]" },
  { key: "COLLATERAL AMOUNT", label: "Collateral Amount", width: "w-[200px]" },
  { key: "FINAL LGD", label: "Final LGD", width: "w-[200px]" },
  { key: "STAGE", label: "Stage", width: "w-[200px]" },
];
