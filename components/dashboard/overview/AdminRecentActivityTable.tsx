"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/ui/custom-table";
import { RecentActivity } from "@/types/dashboard";
import { formatDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-[#DCFCE7] text-[#166534]",
  failed: "bg-[#FFE4E6] text-[#9F1239]",
  info: "bg-[#DBEAFE] text-[#1D4ED8]",
};

const columns = [
  { key: "user", label: "User" },
  { key: "process", label: "Process" },
  { key: "status", label: "Status" },
  { key: "time", label: "Time" },
];

interface RecentActivityTableProps {
  activities?: RecentActivity[];
  isLoading?: boolean;
}

const UserCell: React.FC<{ name: string; initials: string }> = ({
  name,
  initials,
}) => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
      <span className="text-[11px] font-[700] text-[#D97706]">{initials}</span>
    </div>
    <span className="text-[13px] font-[500] text-[#111827]">{name}</span>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}
  >
    {status}
  </span>
);

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  activities,
  isLoading,
}) => {
  const rows = useMemo(() => {
    if (!activities) return [];
    return activities.map((a) => ({
      user: <UserCell name={a.user.name} initials={a.user.initials} />,
      process: <span className="text-[13px] text-[#374151]">{a.process}</span>,
      status: <StatusBadge status={a.status} />,
      time: (
        <span className="text-[13px] text-[#9CA3AF]">{formatDate(a.time)}</span>
      ),
    }));
  }, [activities]);

  return (
    <div className="w-full bg-white rounded-[12px] border border-[#F3F4F6] flex-1">
      <div className="px-6 py-4 border-b border-[#F3F4F6]">
        <h3 className="text-[15px] font-[700] text-[#111827]">
          Recent Activity
        </h3>
      </div>
      <CustomTable
        columns={columns}
        rows={rows}
        loading={isLoading}
        isActionOnRow={false}
      />
    </div>
  );
};

export default RecentActivityTable;
