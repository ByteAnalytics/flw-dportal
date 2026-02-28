import { TableColumn } from "@/components/ui/custom-table";

export const PDModelResultColumns: TableColumn[] = [
  { key: "account_number", label: "Account Number", width: "w-[180px]" },
  { key: "account_name", label: "Customer Name", align: "left" },
  { key: "date_of_origination", label: "Origination Date", align: "left" },
  { key: "date_of_maturity", label: "Maturity Date", align: "left" },
  { key: "loan_type", label: "Loan Type", align: "left" },
  { key: "repayment_type", label: "Repayment Type", align: "left" },
  { key: "eir", label: "EIR (%)", align: "center" },
];

export const reportTableColumns: TableColumn[] = [
  { key: "accountNumber", label: "Account Number", width: "w-[180px]" },
  { key: "accountName", label: "Account Name", width: "w-[180px]" },
  { key: "loanBalance", label: "Loan Balance", width: "w-[150px]" },
  { key: "stage", label: "Stage", width: "w-[100px]" },
  { key: "finalECL", label: "Final ECL", width: "w-[150px]" },
];

export const categoryMap: Record<string, string> = {
  "pd-model": "PD Model",
  "lgd-model": "LGD Model",
  "ead-model": "EAD Model",
  "fli-model": "FLI Scalar",
  "ecl-model": "ECL Model",
  "joint-model": "JOINT MODEL",
};
