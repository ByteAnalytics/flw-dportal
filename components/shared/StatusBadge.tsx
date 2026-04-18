import React from "react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-[#DCFCE7] text-[#166534]",
};

const DEFAULT_STATUS_STYLE = "bg-[#F3F4F6] text-[#6B7280]";

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${
      STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;
