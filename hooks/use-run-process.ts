"use client";

import { usePost } from "@/hooks/use-queries";
import { ApiResponse } from "@/types";

export interface RunProcessResult {
  status: string;
  bank_name?: string;
  account_number?: string;
  opening_balance?: number;
  closing_balance?: number;
  total_debits?: number;
  total_credits?: number;
  net_change?: number;
  exceptions?: unknown[];
  message?: string;
  [key: string]: unknown;
}

export interface RunProcessData {
  process_name: string;
  result: RunProcessResult;
}

export type RunProcessResponse = ApiResponse<RunProcessData>;

export const buildRunProcessPayload = (
  processName: string,
  files: File[],
): FormData => {
  const fd = new FormData();
  fd.append("process_name", processName);
  files.forEach((file) => fd.append("files", file));
  return fd;
};

const BASE_URL = "/processes/run";

export const buildRunProcessUrl = (shouldExport: boolean): string =>
  `${BASE_URL}?export=${shouldExport}`;

export const useRunProcess = () =>
  usePost<RunProcessResponse, FormData>(buildRunProcessUrl(false));

export const useRunProcessWithExport = () =>
  usePost<RunProcessResponse, FormData>(buildRunProcessUrl(true));
