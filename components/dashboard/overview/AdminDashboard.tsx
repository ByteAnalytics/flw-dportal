"use client";


import RecentActivityTable from "./AdminRecentActivityTable";
import TeamsSidebar from "./AdminTeams";
import { StatCard } from "@/components/shared/StatCard";
import { ApiResponse } from "@/types";
import { DashboardApiItem } from ".";
import { useGet } from "@/hooks/use-queries";

const AdminDashboard = () => {
  const { data, isLoading: dashboardLoading } = useGet<
    ApiResponse<DashboardApiItem>
  >(["dashboard"], `/me/dashboard`, {
    staleTime: 0,
    refetchOnMount: "always",
  });

  const dashboardData = data?.data;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.4rem] font-[700] text-[#111827]">Dashboard</h2>
        <p className="font-[500] text-sm text-[#6B7280] mt-1">
          Overview of operations automation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          title="My Processes"
          value={dashboardData?.stats?.processes_count?.toString() ?? "0"}
        />
        <StatCard
          title="Executions Today"
          value={dashboardData?.stats?.executed_today_count?.toString() ?? "0"}
        />
        <StatCard
          title="API Connections"
          value={dashboardData?.stats?.api_connections_count?.toString() ?? "0"}
        />
        <StatCard
          title="Team Members"
          value={dashboardData?.stats?.team_members_count?.toString?.() ?? "0"}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:flex-1 min-w-0">
          <RecentActivityTable />
        </div>
        <div className="w-full lg:w-[320px] shrink-0">
          <TeamsSidebar
            teams={dashboardData?.teams}
            isLoading={dashboardLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
