"use client";

import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomTabs } from "@/components/shared/CustomTab";
import { cn } from "@/lib/utils";

import CFBalanceSheetTab from "./CFBalanceSheetTab";
import CFIncomeStatementTab from "./CFIncomeStatementTab";
import CFOtherInputTab from "./CFOtherInputTab";
import CFNonFinancialsTab from "./CFNonFinancialsTab";
import { CFFinancialsData } from "@/types/risk-overview";

interface CFFinancialsSheetProps {
  onClose: () => void;
  onNext: (data: CFFinancialsData) => void;
  onSaveAsDraft?: () => void;
}

const CFFinancialsSheet: React.FC<CFFinancialsSheetProps> = ({
  onSaveAsDraft,
  onNext,
}) => {
  const [bsCurrent, setBsCurrent] = useState({});
  const [bsPrevious, setBsPrevious] = useState({});

  const [isCurrent, setIsCurrent] = useState({});
  const [isPrevious, setIsPrevious] = useState({});

  const [oiCurrent, setOiCurrent] = useState({});
  const [oiPrevious, setOiPrevious] = useState({});

  const [nonFinancials, setNonFinancials] = useState({});

  const isAutoComputed = {
    grossProfit: "1.7",
    operatingProfit: "0.9",
    profitBeforeTax: "56%",
    profitAfterTax: "56%",
  };

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
          previousValues={oiPrevious}
          onCurrentChange={(k: string, v: string) =>
            setOiCurrent((p) => ({ ...p, [k]: v }))
          }
          onPreviousChange={(k: string, v: string) =>
            setOiPrevious((p) => ({ ...p, [k]: v }))
          }
        />
      ),
    },
    {
      value: "CF Non Financials",
      label: "CF Non Financials",
      content: (
        <CFNonFinancialsTab
          values={nonFinancials}
          onChange={(k: string, v: string) =>
            setNonFinancials((p) => ({ ...p, [k]: v }))
          }
        />
      ),
    },
  ];

  return (
    // <div className="flex flex-col h-full">
    //   <CustomTabs
    //     defaultValue="Balance Sheet"
    //     options={tabOptions}
    //     className="w-full"
    //   />

    //   <div className="px-6 py-4 flex justify-end">
    //     <Button onClick={() => onNext?.()}>Next</Button>
    //   </div>
    // </div>

    <div className="flex flex-col h-full w-full">
      <div className="flex items-start justify-between border-b border-gray-200 gap-4">
        <CustomTabs
          defaultValue="Balance Sheet"
          options={tabOptions}
          className="w-full border-none"
          triggerClassName="max-w-fit"
          contentClassName="max-h-[60vh] overflow-y-auto"
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
              nonFinancials,
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
