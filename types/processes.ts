export type ProcessFrequency = "Daily" | "Weekly" | "Monthly" | "Quarterly";
export type ProcessEffort = "Low" | "Medium" | "High";
export type ProcessStatus = "active" | "all" | "draft" | "archived";

export type DataSourceType = "upload" | "api" | "both" | null;
export type PanelStep = "datasource" | "configure" | "execute";
export type ExecPhase = "idle" | "running" | "done";

export type ProcessCategory =
  | "all"
  | "dispute"
  | "reconciliation"
  | "reporting";

export interface Process {
  id: string;
  process_name: string;
  description?: string;
  team_name: string;
  team_id: string;
  is_assigned: boolean;
  frequency: ProcessFrequency;
  effort: ProcessEffort;
  apis: ProcessApi[];
  status: ProcessStatus;
  point_of_contact?: string;
  category?: string;
  categoryType?: string;
  icons?: string[];
  inputs?: string;
}

export interface ProcessApi {
  id: string;
  name: string;
  icon: string; // icon key e.g. "n8n" | "sftp" | "portal"
}

export interface ProcessesResponse {
  data: Process[];
  message: string;
}

export interface SingleProcessResponse {
  data: Process;
  message: string;
}
