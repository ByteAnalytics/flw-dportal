"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StatIcon } from "@/svg";

interface StatCardProps {
  title: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
  subValue?: string;
  subLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  className,
  icon,
  subValue,
  subLabel,
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-[#9999990D] rounded-2xl p-6 flex flex-col gap-3",
        className,
      )}
    >
      <div>{icon ?? <StatIcon />}</div>
      <p className="text-[14px] font-semibold text-gray-500">{title}</p>

      <div className="text-[20px] md:text-[22px] font-bold text-gray-900 break-all">
        {value}
      </div>

      {subValue && (
        <div className="flex items-center gap-1.5 border-t border-gray-100 pt-2">
          {subLabel && (
            <span className="text-[12px] text-gray-400 font-medium">
              {subLabel}
            </span>
          )}
          <span className="text-[13px] font-semibold text-gray-600">
            {subValue}
          </span>
        </div>
      )}
    </div>
  );
};
