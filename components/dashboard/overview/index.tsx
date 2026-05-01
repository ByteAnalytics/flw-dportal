"use client";

import { useRouter } from "nextjs-toploader/app";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { RecentActivitiesTable, RecentActivity } from "./RecentActivities";
import { ApiResponse, UserRole } from "@/types";
import { useGet } from "@/hooks/use-queries";
import { UserDashboardSkeleton } from "@/skeleton";
import { useAuthStore } from "@/stores/auth-store";
import AdminDashboard from "./AdminDashboard";

export interface DashboardApiItem {
  stats: {
    team_members_count: number;
    processes_count: number;
    executed_today_count: number;
    api_connections_count: number;
  };
  recent_activities: RecentActivity[];
  teams: [];
}

const Dashboard = () => {
  const router = useRouter();

  const { user } = useAuthStore((s) => s);

  const isAdmin = user?.role === UserRole?.ADMIN;

  const { data, isLoading: dashboardLoading } = useGet<
    ApiResponse<DashboardApiItem>
  >(["dashboard"], `/me/dashboard`, {
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !isAdmin,
  });

  const dashboardData = data?.data;

  const handleRun = () => {
    router.push(`/dashboard/run-process`);
  };

  if (isAdmin) return <AdminDashboard />;

  if (dashboardLoading) return <UserDashboardSkeleton />;

  return (
    <div className="min-h-screen">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div className="mb-6">
          <h1 className="text-[1.4rem] font-bold text-gray-900">
            Welcome back, David
          </h1>
          <p className="text-InfraMuted font-[500] text-sm mt-0.5">
<<<<<<< HEAD
            Here are your team's processes and recent activity
=======
            {` Here are your team's processes and recent activity`}
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
          </p>
        </div>

        <Button
          onClick={() => handleRun()}
          className="ms-auto bg-[#E8A020] hover:bg-[#D4911A] h-[40px] text-[12px] font-semibold px-4 rounded-[8px] flex items-center gap-1.5"
        >
          <Play className="w-3 h-3 fill-white" />
          Run a process
        </Button>
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
      <RecentActivitiesTable />
    </div>
  );
};

export default Dashboard;
