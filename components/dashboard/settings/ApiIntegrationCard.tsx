/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ApiIntegration } from "@/types/settings";
import CustomButton from "@/components/ui/custom-button";
import { useToggleIntegration } from "@/hooks/use-settings";
import { toast } from "sonner";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  arbiter: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  cc_portal: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  sftp: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16v16H4z" />
      <polyline points="8 2 12 6 16 2" />
      <line x1="12" y1="6" x2="12" y2="14" />
    </svg>
  ),
  slack: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
    </svg>
  ),
  default: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M21 12h-2M5 12H3M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93M12 19v2M12 3V1" />
    </svg>
  ),
};

interface ApiIntegrationCardProps {
  integration: ApiIntegration;
  onConfigure?: (integration: ApiIntegration) => void;
}

const ApiIntegrationCard: React.FC<ApiIntegrationCardProps> = ({
  integration,
  onConfigure,
}) => {
  const toggleMutation = useToggleIntegration(integration.id);
  const isActive = integration.status === "active";

  const handleToggle = async () => {
    try {
      const response = await toggleMutation.mutateAsync({
        status: isActive ? "inactive" : "active",
      });
      toast.success(extractSuccessMessage(response));
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const icon = ICON_MAP[integration.icon] ?? ICON_MAP.default;

  return (
    <div
      className={`rounded-[16px] border border-[#F3F4F6] p-6 ${integration.bg_color}`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center mb-4 text-[#374151]">
        {icon}
      </div>

      {/* Name + Status */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[15px] font-[700] text-[#111827]">
          {integration.name}
        </h3>
        <span
          className={`text-[11px] font-[600] px-2 py-0.5 rounded-full ${
            isActive
              ? "bg-[#DCFCE7] text-[#166534]"
              : "bg-[#F3F4F6] text-[#6B7280]"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <p className="text-[12px] text-[#6B7280] mb-5">
        {integration.description}
      </p>

      {/* Meta info */}
      <div className="space-y-1 mb-4">
        {integration.last_sync && (
          <p className="text-[12px] text-[#9CA3AF] flex items-center gap-1.5">
            <span>↻</span>
            <span>{integration.last_sync}</span>
          </p>
        )}
        <p className="text-[12px] text-[#9CA3AF] flex items-center gap-1.5">
          <span>⊞</span>
          <span>
            {integration.processes_count} processes · {integration.teams_count}{" "}
            teams
          </span>
        </p>
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between">
        {/* Toggle */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={toggleMutation.isPending}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isActive ? "bg-[#F59E0B]" : "bg-[#D1D5DB]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>

        <CustomButton
          title="Configure"
          onClick={() => onConfigure?.(integration)}
          textClassName="!text-[12px] font-[500] text-[#374151]"
          className="rounded-[8px] border border-[#E5E7EB] bg-white hover:bg-gray-50 h-[34px] min-w-[84px]"
        />
      </div>
    </div>
  );
};

export default ApiIntegrationCard;
