export type ModelManagementApiResponse = {
  created_at: Date;
  id: string;
  timestamp: Date;
  executed_model_type: ExecutableModels;
  celery_task_name: string;
  updated_at: Date;
  data_name: string;
  report_exported: false;
  user_id: string;
  execution_status: string;
  celery_task_id: string;
  finished_at: string | null;
};

export enum ExecutableModels {
  PD = "pd_model",
  JOINT = "joint_model",
  LGD = "lgd_model",
  EAD = "ead_model",
  CCF = "ccf_model",
  FLI = "fli_model",
  ECL = "ecl_model",
}

export interface ExecutionModel {
  created_at: string;
  id: string;
  timestamp: string;
  executed_model_type: string;
  celery_task_name: string;
  updated_at: string;
  file_name: string;
  user_name: string;
  user_email: string;
  report_exported: boolean;
  user_id: string;
  execution_status: string;
  celery_task_id: string;
  finished_at: string | null;
}

// Alternative: Create a specific type for your execution models response
export interface ExecutionModelsResponse {
  model_data: ExecutionModel[];
  total_logs: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

export interface ReportData {
  fileName: string;
  date: string;
  timeStamp: string;
  createdBy: {
    name: string;
    email: string;
  };
  modelCategory: string;
  status: "Completed" | "Pending" | "Queued" | "Failed" | "Running";
  executionStatus: string;
  id: string;
}
