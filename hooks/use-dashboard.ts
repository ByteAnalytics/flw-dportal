import { useGet } from "@/hooks/use-queries";
import {
  DashboardStatsResponse,
  RecentActivityResponse,
  TeamsSummaryResponse,
} from "@/types/dashboard";

export const useDashboardStats = () =>
  useGet<DashboardStatsResponse>(["dashboard-stats"], "/dashboard/stats/");

export const useRecentActivity = () =>
  useGet<RecentActivityResponse>(
    ["dashboard-activity"],
    "/dashboard/recent-activity/",
  );

export const useTeamsSummary = () =>
  useGet<TeamsSummaryResponse>(
    ["dashboard-teams-summary"],
    "/dashboard/teams/",
  );
