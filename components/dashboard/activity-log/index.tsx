"use client";

import React, { useState, useMemo } from "react";
import { Download } from "lucide-react";
import CustomTable from "@/components/ui/custom-table";
import CustomButton from "@/components/ui/custom-button";
import { useTeams } from "@/hooks/use-teams";
import { useGet } from "@/hooks/use-queries";
import { buildQueryString } from "@/lib/utils";
import {
  activityLogColumns,
  LOG_STATUS_STYLES,
} from "@/constants/activity-logs";
import { TEAM_COLORS } from "@/constants/team-management-extended";
import { formatDate } from "@/lib/utils";
import { FilterDropdown } from "@/components/dashboard/run-process/Filterdropdown";
import { DropdownItem } from "@/components/ui/custom-dropdown";
import { ApiResponse } from "@/types";
import { Pagination } from "@/components/shared/Pagination";
import { useDebounce } from "@/hooks/use-debounce";

// --- types ---
interface AdminStats {
  total_executions: number;
  completed: number;
  failed: number;
  system_events: number;
}

interface ActivityEntry {
  id: string;
  activity_type: string;
  description: string;
  timestamp: string;
  user_email: string;
  team_name: string;
  process_name: string;
  status: string;
}

interface ActivityResponse {
  page: number;
  page_size: number;
  total: number;
  pages: number;
  data: ActivityEntry[];
}

// --- hooks ---
const useAdminStats = () =>
  useGet<ApiResponse<AdminStats>>(["admin-stats"], "/admin/stats", {
    retry: false,
  });

const useAdminActivities = (filters?: {
  page?: number;
  page_size?: number;
  activity_type?: string;
  user_email?: string;
  team_id?: string;
  status?: string;
}) => {
  const queryString = buildQueryString(filters);
  return useGet<ApiResponse<ActivityResponse>>(
    ["admin-activities", JSON.stringify(filters ?? {})],
    `/admin/activities${queryString}`,
  );
};

// --- constants ---
const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
  { label: "Info", value: "info" },
];

const ACTIVITY_TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Process Run", value: "process_run" },
  { label: "Login", value: "login" },
  { label: "Logout", value: "logout" },
];

// --- components ---
const StatCard: React.FC<{
  label: string;
  value: number;
  color: string;
  isLoading?: boolean;
}> = ({ label, value, color, isLoading }) => (
  <div
    className="bg-white rounded-[12px] border-l-4 border border-[#F3F4F6] p-5 flex-1"
    style={{ borderLeftColor: color }}
  >
    <p className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wide mb-2">
      {label}
    </p>
    {isLoading ? (
      <div className="h-8 w-16 bg-gray-100 animate-pulse rounded" />
    ) : (
      <p className="text-[2rem] font-[700] text-[#111827] leading-none">
        {value}
      </p>
    )}
  </div>
);

const TeamBadge: React.FC<{ name: string }> = ({ name }) => {
  const c = TEAM_COLORS[name] ?? { text: "text-[#374151]", bg: "bg-[#F3F4F6]" };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-[600] ${c.bg} ${c.text}`}
    >
      {name}
    </span>
  );
};

const ActivityLogs = () => {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(search, 500);

  const { data: statsData, isLoading: statsLoading } = useAdminStats();

  const { data: activitiesData, isLoading: activitiesLoading } =
    useAdminActivities({
      page: pageNumber,
      page_size: itemsPerPage,
      user_email: debouncedSearch || undefined,
      team_id: teamFilter || undefined,
      status: statusFilter || undefined,
      activity_type: activityTypeFilter || undefined,
    });

  const { data: teamsData } = useTeams();

  const stats = statsData?.data;
  const activities = activitiesData?.data?.data ?? [];
  const totalPages = activitiesData?.data?.pages ?? 1;
  const currentPage = activitiesData?.data?.page ?? 1;

  const teamFilterOptions = [
    { label: "All Teams", value: "" },
    ...(teamsData?.data.map((t) => ({ label: t.name, value: t.id })) ?? []),
  ];

  const teamDropdownItems: DropdownItem[] = teamFilterOptions.map((o) => ({
    label: o.label,
    onClick: () => {
      setTeamFilter(o.value);
      setPageNumber(1);
    },
  }));

  const statusDropdownItems: DropdownItem[] = STATUS_OPTIONS.map((o) => ({
    label: o.label,
    onClick: () => {
      setStatusFilter(o.value);
      setPageNumber(1);
    },
  }));

  const activityTypeDropdownItems: DropdownItem[] = ACTIVITY_TYPE_OPTIONS.map(
    (o) => ({
      label: o.label,
      onClick: () => {
        setActivityTypeFilter(o.value);
        setPageNumber(1);
      },
    }),
  );

  const hasActiveFilters =
    !!search || !!teamFilter || !!statusFilter || !!activityTypeFilter;

  const handleClearFilters = () => {
    setSearch("");
    setTeamFilter("");
    setStatusFilter("");
    setActivityTypeFilter("");
    setPageNumber(1);
  };

  const rows = useMemo(() => {
    return activities.map((entry) => ({
      user: (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-[700] text-[#D97706]">
              {entry.user_email?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          <span className="text-[13px] font-[600] text-[#111827]">
            {entry.user_email}
          </span>
        </div>
      ),
      team: entry.team_name ? (
        <TeamBadge name={entry.team_name} />
      ) : (
        <span className="text-[13px] text-[#9CA3AF]">—</span>
      ),
      process: (
        <span className="text-[13px] font-[600] text-[#111827]">
          {entry.process_name || "—"}
        </span>
      ),
      activity_type: (
        <span className="text-[13px] text-[#6B7280]">
          {entry.activity_type}
        </span>
      ),
      status: (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-[600] ${
            LOG_STATUS_STYLES[entry.status]?.bg ?? "bg-[#F3F4F6]"
          } ${LOG_STATUS_STYLES[entry.status]?.text ?? "text-[#374151]"}`}
        >
          {entry.status}
        </span>
      ),
      description: (
        <span className="text-[13px] text-[#6B7280]">
          {entry.description ?? "—"}
        </span>
      ),
      timestamp: (
        <span className="text-[13px] text-[#9CA3AF]">
          {formatDate(entry.timestamp)}
        </span>
      ),
    }));
  }, [activities]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[1.5rem] font-[700] text-[#111827]">
            Activity Log
          </h2>
          <p className="font-[500] text-sm text-[#6B7280] mt-1">
            Audit trail of all process executions and system events
          </p>
        </div>
        <CustomButton
          title="Export"
          showIcon
          iconPosition="left"
          sideIcon={<Download size={15} />}
          textClassName="!text-[13px] font-[600] text-[#374151]"
          className="rounded-[10px] border border-[#E5E7EB] bg-white hover:bg-gray-50 md:h-[43px] h-[40px] min-w-[100px]"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Executions"
          value={stats?.total_executions ?? 0}
          color="#6B7280"
          isLoading={statsLoading}
        />
        <StatCard
          label="Completed"
          value={stats?.completed ?? 0}
          color="#22C55E"
          isLoading={statsLoading}
        />
        <StatCard
          label="Failed"
          value={stats?.failed ?? 0}
          color="#EF4444"
          isLoading={statsLoading}
        />
        <StatCard
          label="System Events"
          value={stats?.system_events ?? 0}
          color="#3B82F6"
          isLoading={statsLoading}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[16px] border border-[#F3F4F6] p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by user email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageNumber(1);
          }}
          className="flex-1 min-w-[200px] max-w-[300px] h-[40px] border border-[#E5E7EB] rounded-[10px] px-3 text-[13px] text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#006F37]"
        />

        <FilterDropdown
          label={
            teamFilterOptions.find((o) => o.value === teamFilter)?.label ??
            "All Teams"
          }
          items={teamDropdownItems}
        />

        <FilterDropdown
          label={
            ACTIVITY_TYPE_OPTIONS.find((o) => o.value === activityTypeFilter)
              ?.label ?? "All Types"
          }
          items={activityTypeDropdownItems}
        />

        <FilterDropdown
          label={
            STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ??
            "All Status"
          }
          items={statusDropdownItems}
        />

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-[13px] font-[600] text-[#006F37] hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <CustomTable
        columns={activityLogColumns}
        rows={rows}
        loading={activitiesLoading}
        isActionOnRow={false}
      />

      {/* Pagination */}
      {activities.length > 0 && (
        <div className="mt-6">
          <Pagination
            totalPageNumber={totalPages}
            activePage={String(currentPage)}
            setPageNumber={setPageNumber}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
