"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Completed" | "Pending" | "Queued" | "Failed" | "Running";
  executionStatus?: string;
}

const StatusBadge = ({ status, executionStatus }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          bgColor: "bg-[#D1FAE5]",
          textColor: "text-[#39D98A]",
          label: "Completed",
        };
      case "running":
        return {
          bgColor: "bg-[#E0ECFF]",
          textColor: "text-[#0063F7]",
          label: "Running",
        };
      case "queued":
        return {
          bgColor: "bg-[#FFFBDE]",
          textColor: "text-[#E5B800]",
          label: "Queued",
        };
      case "failed":
        return {
          bgColor: "bg-[#FEE2E2]",
          textColor: "text-[#FF5C5C]",
          label: "Failed",
        };
      default: // Pending
        return {
          bgColor: "bg-[#F2F4F5]",
          textColor: "text-[#536066]",
          label: "Pending",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.textColor,
      )}
    >
      {executionStatus || config.label}
    </span>
  );
};

export default StatusBadge;
