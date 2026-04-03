"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomTabs } from "@/components/shared/CustomTab";

import CFBalanceSheetTab from "./CFBalanceSheetTab";
import CFIncomeStatementTab from "./CFIncomeStatementTab";
import CFOtherInputTab from "./CFOtherInputTab";
import { CFFinancialsData } from "@/types/risk-overview";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePost } from "@/hooks/use-queries";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import {
  useCaseDetails,
  useSaveDraft,
  useUpdateProgress,
} from "@/hooks/use-risk-overview";
import {
  CF_BALANCE_SHEET_KEY_MAP,
  CF_INCOME_STATEMENT_KEY_MAP,
  CF_OTHER_INPUTS_KEY_MAP,
} from "@/constants/risk-overview";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface CFFinancialsSheetProps {
  onClose: () => void;
  onNext: (data: CFFinancialsData) => void;
  onSaveAsDraft?: () => void;
}

interface ParseTemplateResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    pf_financials?: any;
    cf_financials?: {
      balance_sheet_main: Record<string, number[]>;
      income_statement: Record<string, number>;
      balance_sheet_other_details: Record<string, number>;
    };
  };
}

const CFFinancialsSheet: React.FC<CFFinancialsSheetProps> = ({
  onSaveAsDraft,
  onNext,
}) => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const { data: caseData, refetch } = useCaseDetails(caseId || undefined);

  const [inputMode, setInputMode] = useState<"manual" | "upload">("manual");

  const [bsCurrent, setBsCurrent] = useState<Record<string, string>>({});
  const [bsPrevious, setBsPrevious] = useState<Record<string, string>>({});

  const [isCurrent, setIsCurrent] = useState<Record<string, string>>({});
  const [isPrevious, setIsPrevious] = useState<Record<string, string>>({});

  const [oiCurrent, setOiCurrent] = useState<Record<string, string>>({});
  const [oiPrevious, setOiPrevious] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseTemplate = usePost<ParseTemplateResponse, FormData>(
    "/crr/cases/financials/parse-template",
    ["parse-financial-template"],
  );

  const { saveDraft, isPending: isSavingDraft } = useSaveDraft(
    "cf_financials",
    caseId || undefined,
  );

  const { updateProgress, isPending: isUpdating } = useUpdateProgress(
    "cf_financials",
    caseId || undefined,
  );

  const populateCFDataFromResponse = (
    responseData: ParseTemplateResponse["data"],
    showToast = true,
  ) => {
    const cfData = responseData.cf_financials;
    if (!cfData) {
      toast.error("No CF financials data in response");
      return;
    }

    const balanceSheetMain = cfData.balance_sheet_main;
    if (balanceSheetMain) {
      const current: Record<string, string> = {};
      const previous: Record<string, string> = {};

      Object.entries(balanceSheetMain).forEach(([apiKey, values]) => {
        const mappedKey = CF_BALANCE_SHEET_KEY_MAP[apiKey];
        if (mappedKey && Array.isArray(values)) {
          current[mappedKey] =
            values[0] !== undefined && values[0] !== null
              ? values[0].toString()
              : "";
          previous[mappedKey] =
            values[1] !== undefined && values[1] !== null
              ? values[1].toString()
              : "";
        }
      });

      setBsCurrent(current);
      setBsPrevious(previous);
    }

    const incomeStatement = cfData.income_statement;
    if (incomeStatement) {
      const current: Record<string, string> = {};
      const previous: Record<string, string> = {};

      Object.entries(incomeStatement).forEach(([apiKey, value]) => {
        const mappedKey = CF_INCOME_STATEMENT_KEY_MAP[apiKey];
        if (mappedKey) {
          const stringValue =
            value !== undefined && value !== null ? value.toString() : "";
          current[mappedKey] = stringValue;
          previous[mappedKey] = stringValue;
        }
      });

      setIsCurrent(current);
      setIsPrevious(previous);
    }

    const otherDetails = cfData.balance_sheet_other_details;
    if (otherDetails) {
      const current: Record<string, string> = {};

      Object.entries(otherDetails).forEach(([apiKey, value]) => {
        const mappedKey = CF_OTHER_INPUTS_KEY_MAP[apiKey];
        if (mappedKey) {
          current[mappedKey] =
            value !== undefined && value !== null ? value.toString() : "";
        }
      });

      setOiCurrent(current);
    }

    if (showToast) toast.success("CF data loaded successfully!");
  };

  // Force refetch when caseId changes
  useEffect(() => {
    if (caseId) {
      refetch();
    }
  }, [caseId, refetch]);

  useEffect(() => {
    if (!caseData?.data?.cf_financials) return;
    populateCFDataFromResponse(
      { cf_financials: caseData.data.cf_financials },
      false,
    );
  }, [caseData]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await parseTemplate.mutateAsync(formData);

      if (response.success && response.data) {
        populateCFDataFromResponse(response.data);
        setInputMode("upload");
        toast.success(response.message || "File uploaded successfully");
      } else {
        toast.error(response.message || "Failed to parse file");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.message || "Failed to upload file. Please try again.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const buildData = (): CFFinancialsData => ({
    balanceSheet: {
      current: bsCurrent,
      previous: bsPrevious,
    },
    incomeStatement: {
      current: isCurrent,
      previous: isPrevious,
      autoComputed: {},
    },
    otherInput: {
      current: oiCurrent,
      previous: oiPrevious,
      autoComputed: {},
    },
  });

  const handleSaveAsDraft = async () => {
    const success = await saveDraft(buildData());
    if (success && onSaveAsDraft) {
      onSaveAsDraft();
    }
  };

  const toggleClass = (mode: "manual" | "upload") =>
    cn(
      "px-3 py-1.5 text-[12px] font-semibold h-full flex items-center gap-1 rounded-[6px]",
      inputMode === mode ? "bg-white text-black" : "text-InfraMuted",
    );

  const inputModeToggle = (
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
  );

  const tabOptions = [
    {
      value: "Balance Sheet",
      label: "Balance Sheet",
      content: (
        <CFBalanceSheetTab
          currentValues={bsCurrent}
          previousValues={bsPrevious}
          onCurrentChange={(k: string, v: string) =>
            setBsCurrent((p) => ({ ...p, [k]: v }))
          }
          onPreviousChange={(k: string, v: string) =>
            setBsPrevious((p) => ({ ...p, [k]: v }))
          }
        />
      ),
    },
    {
      value: "Income Statement",
      label: "Income Statement",
      content: (
        <CFIncomeStatementTab
          currentValues={isCurrent}
          previousValues={isPrevious}
          onCurrentChange={(k: string, v: string) =>
            setIsCurrent((p) => ({ ...p, [k]: v }))
          }
          onPreviousChange={(k: string, v: string) =>
            setIsPrevious((p) => ({ ...p, [k]: v }))
          }
        />
      ),
    },
    {
      value: "Other Input",
      label: "Other Input",
      content: (
        <CFOtherInputTab
          currentValues={oiCurrent}
          onCurrentChange={(k: string, v: string) =>
            setOiCurrent((p) => ({ ...p, [k]: v }))
          }
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".json,.csv,.xlsx,.xls"
        className="hidden"
      />

      <CustomTabs
        defaultValue="Balance Sheet"
        options={tabOptions}
        className="w-full border-none"
        triggerClassName="max-w-fit"
        contentClassName="max-h-[60vh] overflow-y-auto"
        headerRight={inputModeToggle}
      />

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-6">
        <button
          onClick={handleSaveAsDraft}
          disabled={isSavingDraft}
          className="bg-white border text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingDraft ? "Saving..." : "Save as draft"}
        </button>

        <Button
          onClick={async () => {
            const data = buildData();
            const success = await updateProgress(data);
            if (success) {
              onNext(data);
            }
          }}
          disabled={isUpdating}
          className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default CFFinancialsSheet;
