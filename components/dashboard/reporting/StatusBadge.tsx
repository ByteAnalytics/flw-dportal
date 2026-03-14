"use client";

import { X } from "lucide-react";
import { ModelProgressBar } from "@/components/ui/sse-progress-bar";
import { Check, Redirect } from "@/svg";
import { cn } from "@/lib/utils";
import { reportStatus } from "@/types/reporting";
import { useState } from "react";
import { ExecutableModels } from "@/types/model-execution";

interface StatusBadgeProps {
  modelType: ExecutableModels;
  executionStatus: reportStatus;
  reportId?: string;
}

const StatusBadge = ({
  modelType,
  executionStatus,
  reportId,
}: StatusBadgeProps) => {
  const [liveStatus, setLiveStatus] = useState<reportStatus>(executionStatus);

  const getStatusConfig = (
    status: reportStatus,
  ): {
    variant: "warn" | "success" | "destructive";
    bgColor: string;
    textColor: string;
    label: string;
  } => {
    switch (status) {
      case "Completed":
        return {
          variant: "success",
          bgColor: "bg-[#D1FAE5]",
          textColor: "text-[#39D98A]",
          label: "Completed",
        };

      case "Running":
        return {
          variant: "warn",
          bgColor: "bg-[#E0ECFF]",
          textColor: "text-[#0063F7]",
          label: "Running",
        };

      case "Queued":
        return {
          variant: "warn",
          bgColor: "bg-[#FFFBDE]",
          textColor: "text-[#E5B800]",
          label: "Queued",
        };

      case "Validating":
        return {
          variant: "warn",
          bgColor: "bg-[#FFFBDE]",
          textColor: "text-[#E5B800]",
          label: "Validating",
        };

      case "Pending":
        return {
          variant: "warn",
          bgColor: "bg-[#F2F4F5]",
          textColor: "text-[#536066]",
          label: "Pending",
        };

      case "Failed":
        return {
          variant: "destructive",
          bgColor: "bg-[#FEE2E2]",
          textColor: "text-[#FF5C5C]",
          label: "Failed",
        };

      case "Validation_Failed":
        return {
          variant: "destructive",
          bgColor: "bg-[#FEE2E2]",
          textColor: "text-[#FF5C5C]",
          label: "Validation Failed",
        };

      default:
        return {
          variant: "warn",
          bgColor: "bg-[#F2F4F5]",
          textColor: "text-[#536066]",
          label: status,
        };
    }
  };

  const { variant, bgColor, textColor, label } = getStatusConfig(liveStatus);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
        bgColor,
        textColor,
      )}
    >
      {variant === "success" ? (
        <>
          <Check className="mt-1.5" />
          <span>{label}</span>
        </>
      ) : variant === "destructive" ? (
        <>
          <X className="h-4 w-4 my-0.5 mr-1" />
          <span>{label}</span>
        </>
      ) : (
        <>
          <Redirect className="mt-1.5" />
          <span>{label}</span>
          {reportId && (
            <div className="ml-2 w-24">
              <ModelProgressBar
                modelType={modelType}
                modelExecutionId={reportId}
                onStatusChange={setLiveStatus}
                initialStatus={executionStatus}
              />
            </div>
          )}
        </>
      )}
    </span>
  );
};

export default StatusBadge;
