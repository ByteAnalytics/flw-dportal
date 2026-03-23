"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomTabs } from "@/components/shared/CustomTab";

import CFBalanceSheetTab from "./CFBalanceSheetTab";
import CFIncomeStatementTab from "./CFIncomeStatementTab";
import CFOtherInputTab from "./CFOtherInputTab";
import { CFFinancialsData } from "@/types/risk-overview";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CFFinancialsSheetProps {
  onClose: () => void;
  onNext: (data: CFFinancialsData) => void;
  onSaveAsDraft?: () => void;
}

const CFFinancialsSheet: React.FC<CFFinancialsSheetProps> = ({
  onSaveAsDraft,
  onNext,
}) => {
  const [inputMode, setInputMode] = useState<"manual" | "upload">("manual");

  const [bsCurrent, setBsCurrent] = useState({});
  const [bsPrevious, setBsPrevious] = useState({});
  const [isCurrent, setIsCurrent] = useState({});
  const [isPrevious, setIsPrevious] = useState({});
  const [oiCurrent, setOiCurrent] = useState({});
  const [oiPrevious, setOiPrevious] = useState({});

  const isAutoComputed = {
    grossProfit: "1.7",
    operatingProfit: "0.9",
    profitBeforeTax: "56%",
    profitAfterTax: "56%",
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
        onClick={() => setInputMode("upload")}
        className={toggleClass("upload")}
      >
        <Upload className="w-3 h-3" />
        Upload File
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
          autoComputed={isAutoComputed}
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
          onClick={onSaveAsDraft}
          className="bg-white border text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-[8px]"
        >
          Save as draft
        </button>

        <Button
          onClick={() =>
            onNext({
              balanceSheet: {
                current: bsCurrent,
                previous: bsPrevious,
              },
              incomeStatement: {
                current: isCurrent,
                previous: isPrevious,
                autoComputed: isAutoComputed,
              },
              otherInput: {
                current: oiCurrent,
                previous: oiPrevious,
                autoComputed: isAutoComputed,
              },
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

export default CFFinancialsSheet;
