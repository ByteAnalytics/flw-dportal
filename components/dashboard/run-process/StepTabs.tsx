"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PanelStep } from "@/types/processes";

const TABS: { key: PanelStep; icon: string; label: string }[] = [
  { key: "datasource", icon: "📋", label: "Data Source" },
  { key: "configure", icon: "⚙️", label: "Configure" },
  { key: "execute", icon: "▶", label: "Execute" },
];

interface StepTabsProps {
  step: PanelStep;
  onStepClick: (s: PanelStep) => void;
}

export const StepTabs: React.FC<StepTabsProps> = ({ step, onStepClick }) => {
  const currentIndex = TABS.findIndex((t) => t.key === step);

  return (
<<<<<<< HEAD
    <div className="flex border-b border-[#E1E3E2] -mx-1">
=======
    <div className="grid grid-cols-3 border border-[#E1E3E2] -mx-1">
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
      {TABS.map((tab, i) => {
        const isDone = i < currentIndex;
        const isActive = tab.key === step;
        const isDisabled = i > currentIndex;

        return (
          <button
            key={tab.key}
            onClick={() => isDone && onStepClick(tab.key)}
            disabled={isDisabled}
            className={cn(
              "px-3 py-2.5 text-[13px] font-medium flex items-center gap-1.5 border-b-2 -mb-px transition-colors whitespace-nowrap",
              isActive
<<<<<<< HEAD
                ? "text-[#006D37] border-[#E8A020]"
                : isDone
                  ? "text-[#006D37] border-transparent cursor-pointer"
=======
                ? "border-[#E8A020] bg-[#EAA945]/10"
                : isDone
                  ? "text-[#2fb344] border-[#2fb344] cursor-pointer"
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
                  : "text-[#C0C4C3] border-transparent cursor-default",
            )}
          >
            <span className="text-[12px]">{isDone ? "✓" : tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
