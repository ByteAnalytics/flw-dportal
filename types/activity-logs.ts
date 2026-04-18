export type LogStatus = "completed" | "failed" | "info";

export interface ActivityLogUser {
  id: string;
  name: string;
  initials: string;
}

export interface ActivityLogEntry {
  id: string;
  user: ActivityLogUser;
  teams: { id: string; name: string; color: string }[];
  process: string;
  status: LogStatus;
  detail?: string;
  timestamp: string;
}

export interface ActivityLogStats {
  total_executions: number;
  completed: number;
  failed: number;
  system_events: number;
}

export interface ActivityLogResponse {
  data: {
    stats: ActivityLogStats;
    logs: ActivityLogEntry[];
  };
  message: string;
}

export interface ActivityLogFilters {
  search?: string;
  user_id?: string;
  team_id?: string;
  status?: LogStatus | "";
}
