"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import FinancialInputTable, { FinancialRow } from "./FinancialInputTable";
import { CustomTabs } from "@/components/shared/CustomTab";
import {
  cn,
  extractErrorMessage,
  extractSuccessMessage,
  generateDynamicYears,
} from "@/lib/utils";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";
import {
  useCaseDetails,
  useParseTemplate,
  useSaveDraft,
  useUpdateProgress,
} from "@/hooks/use-risk-overview";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  BALANCE_SHEET_ROWS,
  INCOME_STATEMENT_ROWS,
  CASH_FLOW_ROWS,
  OTHER_INPUTS_ROWS,
  RATIOS_ROWS,
  BALANCE_SHEET_KEY_MAP,
  INCOME_STATEMENT_KEY_MAP,
  CASH_FLOW_KEY_MAP,
  RATIOS_KEY_MAP,
} from "@/constants/risk-overview";
import CustomButton from "@/components/ui/custom-button";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

type FinancialValues = Record<string, Record<number, string>>;

export interface PFFinancialsData {
  balanceSheet: FinancialValues;
  incomeStatement: FinancialValues;
  cashFlow: FinancialValues;
  otherInputs: FinancialValues;
  ratios: FinancialValues;
  years: number[];
}

interface PFFinancialsSheetProps {
  onClose: () => void;
  onNext: (data: PFFinancialsData) => void;
  onSaveAsDraft?: () => void;
  onPrevious?: () => void;
}

const DEFAULT_YEARS = generateDynamicYears();

const PFFinancialsSheet: React.FC<PFFinancialsSheetProps> = ({
  onNext,
  onSaveAsDraft,
  onPrevious,
}) => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const {
    data: caseData,
    isLoading: isLoadingCase,
    refetch,
  } = useCaseDetails(caseId || undefined);

  const [activeTab, setActiveTab] = useState("Balance Sheet");
  const [inputMode, setInputMode] = useState<"manual" | "upload">("manual");
  const [years, setYears] = useState<any[]>(DEFAULT_YEARS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [balanceSheet, setBalanceSheet] = useState<FinancialValues>({});
  const [incomeStatement, setIncomeStatement] = useState<FinancialValues>({});
  const [cashFlow, setCashFlow] = useState<FinancialValues>({});
  const [otherInputs, setOtherInputs] = useState<FinancialValues>({});
  const [ratios, setRatios] = useState<FinancialValues>({});

  const { setPFFinancialsData } = useRiskOverviewStore();

  const parseTemplate = useParseTemplate();
  const { saveDraft, isPending: isSavingDraft } = useSaveDraft(
    "pf_financials",
    caseId || "",
  );
  const { updateProgress, isPending: isUpdating } = useUpdateProgress(
    "pf_financials",
    caseId || "",
  );

  const mapArrayToYears = (
    dataArray: number[] | undefined | null,
    yearsArray: number[],
  ): Record<number, string> => {
    const result: Record<number, string> = {};

    if (!dataArray || !Array.isArray(dataArray)) {
      yearsArray.forEach((year) => {
        result[year] = "";
      });
      return result;
    }

    yearsArray.forEach((year, index) => {
      const value = dataArray[index];
      result[year] =
        value !== undefined && !isNaN(value) ? value.toString() : "";
    });
    return result;
  };

  const safeObjectEntries = (obj: any): [string, any][] => {
    if (!obj || typeof obj !== "object") {
      return [];
    }
    return Object.entries(obj);
  };

  const populateDataFromResponse = (responseData: any, showToast = true) => {
    const pfData = responseData?.pf_financials;
    if (!pfData) {
      toast.error("No PF financials data in response");
      return;
    }

    const apiYears = pfData.years;
    if (apiYears && Array.isArray(apiYears) && apiYears.length > 0) {
      console.log("api years:", apiYears);
      setYears(apiYears);
    }

    const newBalanceSheet: FinancialValues = {};
    safeObjectEntries(pfData.balance_sheet).forEach(([apiKey, values]) => {
      const mappedKey = BALANCE_SHEET_KEY_MAP[apiKey];
      if (mappedKey) {
        newBalanceSheet[mappedKey] = mapArrayToYears(
          values as number[],
          apiYears || years,
        );
      }
    });
    setBalanceSheet(newBalanceSheet);

    const newIncomeStatement: FinancialValues = {};
    safeObjectEntries(pfData.financial_inputs).forEach(([apiKey, values]) => {
      const mappedKey = INCOME_STATEMENT_KEY_MAP[apiKey];
      if (mappedKey) {
        newIncomeStatement[mappedKey] = mapArrayToYears(
          values as number[],
          apiYears || years,
        );
      }
    });
    setIncomeStatement(newIncomeStatement);

    const newCashFlow: FinancialValues = {};
    safeObjectEntries(pfData.summary_cashflow).forEach(([apiKey, values]) => {
      const mappedKey = CASH_FLOW_KEY_MAP[apiKey];
      if (mappedKey) {
        newCashFlow[mappedKey] = mapArrayToYears(
          values as number[],
          apiYears || years,
        );
      }
    });
    setCashFlow(newCashFlow);

    if (pfData.ratios) {
      const newRatios: FinancialValues = {};
      safeObjectEntries(pfData.ratios).forEach(([apiKey, values]) => {
        const mappedKey = RATIOS_KEY_MAP[apiKey];
        if (mappedKey) {
          newRatios[mappedKey] = mapArrayToYears(
            values as number[],
            apiYears || years,
          );
        }
      });
      setRatios(newRatios);
    }

    if (showToast) toast.success("File uploaded and parsed successfully!");
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await parseTemplate.mutateAsync(formData);

      if (response?.success && response?.data) {
        populateDataFromResponse(response.data);
        setInputMode("upload");
        toast.success(
          extractSuccessMessage(response, "File uploaded successfully"),
        );
      } else {
        console.log(response?.message);
        toast.error(
          extractErrorMessage(
            response,
            `Failed to parse file. Please try again.`,
          ),
        );
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      console.log("error message:", error?.message);
      toast.error(
        extractErrorMessage(error, `Failed to upload file. Please try again.`),
      );
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const initializeValues = useCallback(
    (rows: FinancialRow[], currentValues: FinancialValues): FinancialValues => {
      const newValues = { ...currentValues };

      rows.forEach((row) => {
        if (!newValues[row.key]) {
          newValues[row.key] = {};
        }

        years.forEach((year) => {
          if (
            newValues[row.key][year] === undefined ||
            newValues[row.key][year] === null
          ) {
            newValues[row.key][year] = "";
          }
        });
      });

      return newValues;
    },
    [years],
  );

  // Force refetch when caseId changes
  useEffect(() => {
    if (caseId) {
      refetch();
    }
  }, [caseId, refetch]);

  useEffect(() => {
    if (!caseData?.data?.pf_financials) return;
    populateDataFromResponse(
      { pf_financials: caseData.data.pf_financials },
      false,
    );
  }, [caseData]);

  useEffect(() => {
    setBalanceSheet((prev) => initializeValues(BALANCE_SHEET_ROWS, prev));
    setIncomeStatement((prev) => initializeValues(INCOME_STATEMENT_ROWS, prev));
    setCashFlow((prev) => initializeValues(CASH_FLOW_ROWS, prev));
    setOtherInputs((prev) => initializeValues(OTHER_INPUTS_ROWS, prev));
    setRatios((prev) => initializeValues(RATIOS_ROWS, prev));
  }, [years, initializeValues]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<FinancialValues>>) =>
    (rowKey: string, year: number, value: string) => {
      setter((prev) => ({
        ...prev,
        [rowKey]: { ...(prev[rowKey] ?? {}), [year]: value },
      }));
    };

  const handleAddColumn = () => {
    setYears((prev) => [...prev, `Year ${prev.length + 1}`]);
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

  const renderRatiosTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm min-w-[700px]">
        <thead className="bg-InfraBorder">
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 pr-4 pl-2 text-[14px] font-semibold text-gray-500 uppercase tracking-wide w-[200px] min-w-[180px]">
              RATIO
            </th>
            {years.map((year) => (
              <th
                key={year}
                className="text-center py-2 px-2 text-[14px] font-semibold text-gray-500 uppercase tracking-wide min-w-[110px]"
              >
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RATIOS_ROWS.map((row) => (
            <tr
              key={row.key}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td className="py-2 pr-4 pl-2 text-[13px] font-medium w-[200px] min-w-[180px]">
                <span className="text-emerald-600 font-semibold">
                  {row.label}
                </span>
              </td>
              {years.map((year) => (
                <td key={year} className="py-2 px-2 min-w-[110px]">
                  <div className="w-full h-[32px] px-2 flex items-center justify-end text-right text-[12px] font-medium rounded-[6px] border border-amber-200 bg-amber-50 text-amber-700">
                    {ratios[row.key]?.[year] || "-"}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const handleSaveAsDraft = async () => {
    const data: PFFinancialsData = {
      balanceSheet,
      incomeStatement,
      cashFlow,
      otherInputs,
      ratios,
      years,
    };

    setPFFinancialsData(data);

    const success = await saveDraft(data);

    if (success && onSaveAsDraft) {
      onSaveAsDraft();
    }
  };

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
    // {
    //   value: "Other Inputs",
    //   label: "Other Inputs",
    //   content: renderTable(OTHER_INPUTS_ROWS, otherInputs, setOtherInputs),
    // },
    {
      value: "Ratios",
      label: "Ratios",
      content: renderRatiosTable(),
    },
  ];

  const toggleClass = (mode: "manual" | "upload") =>
    cn(
      "px-3 py-1.5 text-[12px] font-semibold h-full flex items-center gap-1 rounded-[6px]",
      inputMode === mode ? "bg-white text-black" : "text-InfraMuted",
    );

  const handleNext = async () => {
    const data: PFFinancialsData = {
      balanceSheet,
      incomeStatement,
      cashFlow,
      otherInputs,
      ratios,
      years,
    };

    setPFFinancialsData(data);

    const success = await updateProgress(data);

    if (success) {
      onNext(data);
    }
  };

  if (isLoadingCase) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-[82vh] w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".json,.csv,.xlsx,.xls"
        className="hidden"
      />

      <div className="flex items-start justify-between border-b border-gray-200 gap-4 flex-1">
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
                onClick={triggerFileUpload}
                className={toggleClass("upload")}
                disabled={parseTemplate.isPending}
              >
                <Upload className="w-3 h-3" />
                {parseTemplate.isPending ? "Uploading..." : "Upload File"}
              </button>
            </div>
          }
        />
      </div>

      <div className="pt-6 flex flex-wrap items-center gap-3 justify-between mt-auto">
        {onPrevious && (
          <CustomButton
            type="button"
            title="Previous"
            onClick={handlePrevious}
            disabled={isSavingDraft || isUpdating}
            className="w-[117px] h-[40px] flex items-center gap-2 border bg-white hover:bg-gray-600 hover:text-white text-gray-600 text-[16px] font-semibold"
          />
        )}
        <div className="ms-auto py-4 border-t border-gray-200 flex justify-end gap-6">
          <Button
            onClick={handleSaveAsDraft}
            disabled={isSavingDraft}
            className="bg-white border-InfraBorder h-[40px] text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingDraft ? "Saving..." : "Save as draft"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={isUpdating}
            className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PFFinancialsSheet;
