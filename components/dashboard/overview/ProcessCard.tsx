"use client";

import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_STYLES, ICON_MAP } from "@/constants/data";
import { Process } from "@/types/processes";

interface ProcessCardProps {
  process: Process;
  onRun: (id?: string) => void;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({ process, onRun }) => {
  return (
    <div className="bg-white border border-[#E1E3E2] rounded-[16px] p-5 hover:border-[#E8A020] hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-[14px] font-bold text-[#0A0A0A] leading-snug flex-1">
          {process.process_name}
        </h3>
        <span className="bg-[#E8F0FF] text-[#2E5DB0] text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
          {process.frequency}
        </span>
      </div>

      <span
        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block mb-3 ${CATEGORY_STYLES[process?.categoryType ?? ""]}`}
      >
        {process.category}
      </span>

      <p className="text-[12px] text-[#7A7E7D] leading-relaxed mb-4">
        {process?.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {process?.icons?.map((icon, i) => (
            <div
              key={i}
              className="w-[22px] h-[22px] rounded-[5px] bg-[#F3F3F3] flex items-center justify-center"
            >
              {ICON_MAP[icon]}
            </div>
          ))}
          {process.inputs && process.inputs !== "—" && (
            <span className="text-[11px] text-[#9A9E9D] ml-1">
              ⊢ {process.inputs}
            </span>
          )}
        </div>
        <Button
          onClick={() => onRun(process.id)}
          className="bg-[#006D37] hover:bg-[#D4911A] text-white text-[12px] font-semibold h-8 px-4 rounded-[8px] flex items-center gap-1.5"
        >
          <Play className="w-3 h-3 fill-white" />
          Run
        </Button>
      </div>
    </div>
  );
};
