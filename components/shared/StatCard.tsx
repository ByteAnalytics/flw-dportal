"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StatIcon } from "@/svg";

interface StatCardProps {
  title: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  className,
  icon,
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
    </div>
  );
};
