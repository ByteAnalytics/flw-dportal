export interface DashboardStats {
  total_processes: number;
  active_processes: number;
  teams_count: number;
  users_count: number;
  active_users: number;
  api_integrations_count: number;
  connected_integrations: number;
}

export interface DashboardStatsResponse {
  data: DashboardStats;
  message: string;
}

export type ActivityStatus = "completed" | "failed" | "info";

export interface RecentActivityUser {
  id: string;
  name: string;
  initials: string;
}

export interface RecentActivity {
  id: string;
  user: RecentActivityUser;
  process: string;
  status: ActivityStatus;
  time: string;
}

export interface RecentActivityResponse {
  data: RecentActivity[];
  message: string;
}

export interface TeamSummary {
  id: string;
  name: string;
  color: string;
  processes_count: number;
  members_count: number;
}

export interface TeamsSummaryResponse {
  data: TeamSummary[];
  message: string;
}

export type EffortLevel = "Low" | "Medium" | "High";

export interface EffortDistribution {
  level: EffortLevel;
  count: number;
}
