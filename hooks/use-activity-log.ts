import { useGet } from "@/hooks/use-queries";
import { ActivityLogResponse } from "@/types/activity-logs";


export const useActivityLog = (filters?: {
  search?: string;
  user_id?: string;
  team_id?: string;
  status?: string;
}) =>
  useGet<ActivityLogResponse>(
    ["activity-log", JSON.stringify(filters ?? {})],
    `/activity-logs/${filters ? "?" + new URLSearchParams(filters).toString() : ""}`,
    // filters,
  );
