"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import FinancialInputTable, { FinancialRow } from "./FinancialInputTable";
import { CustomTabs } from "@/components/shared/CustomTab";
import { cn } from "@/lib/utils";

// ─── Row Definitions ─────────────────────────────────────────────────────────

const BALANCE_SHEET_ROWS: FinancialRow[] = [
  { key: "totalNonCurrentAssets", label: "Total Non-Current Assets" },
  { key: "currentAssets", label: "Current Assets" },
  { key: "totalCurrentLiabilities", label: "Total Current Liabilities" },
  { key: "longTermLiabilities", label: "Long Term Liabilities" },
  { key: "shareCapital", label: "Share Capital" },
  { key: "retainedEarnings", label: "Retained Earnings" },
  { key: "concessionaryCapital", label: "Concessionary Capital" },
  { key: "totalAssets", label: "Total Assets", isCalculated: true },
  { key: "totalLiabilities", label: "Total Liabilities", isCalculated: true },
  { key: "netAssets", label: "Net Assets", isCalculated: true },
];

const INCOME_STATEMENT_ROWS: FinancialRow[] = [
  { key: "revenue", label: "Revenue" },
  { key: "otherIncomeGrant", label: "Other Income- Grant" },
  { key: "otherIncomeCharge", label: "Other Income - Charge" },
  { key: "operatingCosts", label: "Operating Costs" },
  { key: "depreciation", label: "Depreciation" },
  { key: "interestIncome", label: "Interest Income" },
  { key: "tax", label: "Tax" },
  { key: "ebitda", label: "EBITDA", isCalculated: true },
  { key: "interestExpense", label: "Interest Expense", isCalculated: true },
  { key: "ebit", label: "EBIT", isCalculated: true },
  { key: "grossProfit", label: "Gross Profit", isCalculated: true },
  { key: "profitBeforeTax", label: "Profit before Tax", isCalculated: true },
  { key: "profitAfterTax", label: "Profit after Tax", isCalculated: true },
];

const CASH_FLOW_ROWS: FinancialRow[] = [
  { key: "seniorLoans", label: "Senior Loans" },
  { key: "subLoans", label: "SubLoans" },
  { key: "other", label: "Other" },
  { key: "equity", label: "Equity" },
  { key: "capex", label: "CAPEX" },
  { key: "wcAdjustments", label: "W/C Adjustments" },
  { key: "interestPaymentSubDebt", label: "Interest Payment - SubDebt" },
  { key: "principalPaymentSubDebt", label: "Principal Payment - SubDebt" },
  { key: "interestPaymentSeniorD", label: "Interest Payment - Senior D." },
  { key: "principalPaymentSeniorD", label: "Principal Payment - Senior D." },
  { key: "totalFunding", label: "Total Funding", isCalculated: true },
  { key: "cfads", label: "CFADS", isCalculated: true },
  { key: "netAssets", label: "Net Assets", isCalculated: true },
  { key: "totalDebtService", label: "Total Debt Service", isCalculated: true },
  { key: "netCashflow", label: "Net Cashflow", isCalculated: true },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type FinancialValues = Record<string, Record<number, string>>;
type NonFinancialValues = Record<string, string>;

export type PFFinancialsData = {
  balanceSheet: FinancialValues;
  incomeStatement: FinancialValues;
  cashFlow: FinancialValues;
  nonFinancials: NonFinancialValues;
  years: number[];
};

interface PFFinancialsSheetProps {
  onClose: () => void;
  onNext: (data: PFFinancialsData) => void;
  onSaveAsDraft?: () => void;
}

const DEFAULT_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

// ─── Component ────────────────────────────────────────────────────────────────

const PFFinancialsSheet: React.FC<PFFinancialsSheetProps> = ({
  onNext,
  onSaveAsDraft,
}) => {
  const [activeTab, setActiveTab] = useState("Balance Sheet");
  const [inputMode, setInputMode] = useState<"manual" | "upload">("manual");
  const [years, setYears] = useState<number[]>(DEFAULT_YEARS);

  const [balanceSheet, setBalanceSheet] = useState<FinancialValues>({});
  const [incomeStatement, setIncomeStatement] = useState<FinancialValues>({});
  const [cashFlow, setCashFlow] = useState<FinancialValues>({});
  const [nonFinancials, setNonFinancials] = useState<NonFinancialValues>({});

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<FinancialValues>>) =>
    (rowKey: string, year: number, value: string) => {
      setter((prev) => ({
        ...prev,
        [rowKey]: { ...(prev[rowKey] ?? {}), [year]: value },
      }));
    };

  const handleAddColumn = () => {
    const minYear = Math.min(...years);
    setYears((prev) => [...prev, minYear - 1]);
  };

  const renderTable = (
    rows: FinancialRow[],
    values: FinancialValues,
    setter: React.Dispatch<React.SetStateAction<FinancialValues>>,
  ) => (
    <FinancialInputTable
      rows={rows}
      years={years}
      values={values}
      onChange={handleChange(setter)}
      onAddColumn={handleAddColumn}
    />
  );

  const tabOptions = [
    {
      value: "Balance Sheet",
      label: "Balance Sheet",
      content: renderTable(BALANCE_SHEET_ROWS, balanceSheet, setBalanceSheet),
    },
    {
      value: "Income Statement",
      label: "Income Statement",
      content: renderTable(
        INCOME_STATEMENT_ROWS,
        incomeStatement,
        setIncomeStatement,
      ),
    },
    {
      value: "Cash Flow",
      label: "Cash Flow",
      content: renderTable(CASH_FLOW_ROWS, cashFlow, setCashFlow),
    },
    {
      value: "Other Inputs",
      label: "Other Inputs",
      content: (
        <div className="p-4 text-sm text-gray-500">
          Other Inputs (hook your nonFinancials UI here)
        </div>
      ),
    },
  ];

  const toggleClass = (mode: "manual" | "upload") =>
    cn(
      "px-3 py-1.5 text-[12px] font-semibold h-full flex items-center gap-1 rounded-[6px]",
      inputMode === mode ? "bg-white text-black" : "text-InfraMuted",
    );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-start justify-between border-b border-gray-200 gap-4">
        <CustomTabs
          defaultValue="Balance Sheet"
          options={tabOptions}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full border-none"
          triggerClassName="max-w-fit"
          contentClassName="max-h-[60vh] overflow-y-auto"
          headerRight={
            <div className="flex items-center bg-InfraBorder p-1 rounded-[10px] h-[44px]">
              <button
                onClick={() => setInputMode("manual")}
                className={toggleClass("manual")}
              >
                Manual Input
              </button>
              <button
                onClick={() => setInputMode("upload")}
                className={toggleClass("upload")}
              >
                <Upload className="w-3 h-3" />
                Upload File
              </button>
            </div>
          }
        />
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-6">
        <button
          onClick={onSaveAsDraft}
          className="bg-white  border text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-[8px]"
        >
          Save as draft
        </button>

        <Button
          onClick={() =>
            onNext({
              balanceSheet,
              incomeStatement,
              cashFlow,
              nonFinancials,
              years,
            })
          }
          className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PFFinancialsSheet;
