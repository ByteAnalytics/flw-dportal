import { reportStatus } from "./reporting";

export type ModelManagementApiResponse = {
  model_execution_id: string;
};

export enum ExecutableModels {
  PD = "guarantees_pd",
  JOINT = "guarantees_joint",
  LGD = "guarantees_lgd",
  EAD = "guarantees_ead",
  CCF = "guarantees_ccf",
  FLI = "guarantees_fli",
  ECL = "guarantees_ecl",
}

export interface ExecutionModel {
  created_at: string;
  id: string;
  timestamp: string;
  executed_model_type: ExecutableModels;
  celery_task_name: string;
  updated_at: string;
  file_name: string;
  user_name: string;
  user_email: string;
  report_exported: boolean;
  user_id: string;
  execution_status: reportStatus;
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
  executedModelType: ExecutableModels;
  modelCategory: string;
  status: reportStatus;
  executionStatus: string;
  id: string;
}

// Shared types for model execution form state

export type ThreeFileSet = {
  amortization_file: File | null;
  asset_information_file: File | null;
  collateral_file: File | null;
  exposure_date: Date;
};

export type LGDData = ThreeFileSet;
export type EADData = ThreeFileSet;
export type ECLData = ThreeFileSet;
export type CCFData = ThreeFileSet;

export type ModelFormData = {
  lgd: LGDData;
  ccf: CCFData;
  ead: EADData;
  ecl: ECLData;
};

export const defaultThreeFileSet = (): ThreeFileSet => ({
  amortization_file: null,
  asset_information_file: null,
  collateral_file: null,
  exposure_date: new Date(),
});

export const defaultModelFormData = (): ModelFormData => ({
  lgd: defaultThreeFileSet(),
  ead: defaultThreeFileSet(),
  ecl: defaultThreeFileSet(),
  ccf: defaultThreeFileSet(),
});
