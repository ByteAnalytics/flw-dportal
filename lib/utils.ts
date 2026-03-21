/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { PaginatedResponse } from "@/types";
import { ExecutableModels, ExecutionModel } from "@/types/model-execution";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractErrorMessage = (
  err: unknown,
  defaultMessage = "Something went wrong",
): string => {
  if (axios.isAxiosError(err)) {
    const errorResponse = err.response?.data as
      | { detail?: string; message?: string; error?: string }
      | undefined;

    return (
      errorResponse?.detail ||
      errorResponse?.message ||
      errorResponse?.error ||
      err.message ||
      defaultMessage
    );
  }

  if (err instanceof Error) {
    return err.message || defaultMessage;
  }

  return defaultMessage;
};

export const extractSuccessMessage = (
  response: any,
  defaultMessage = "Operation successful",
): string => {
  if (!response) return defaultMessage;

  const data = response.data || response;
  return (
    data.message ||
    data.detail ||
    data.status_message ||
    data.status_text ||
    defaultMessage
  );
};

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });
}

export function formatDateOnly(dateString?: string | null): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });
}

export function transformExecutionModelsResponse(
  response: any,
): PaginatedResponse<ExecutionModel> {
  if (!response) {
    return {
      page: 1,
      page_size: 10,
      total: 0,
      pages: 1,
      data: [],
    };
  }

  return {
    page: response.current_page,
    page_size: response.page_size,
    total: response.total_logs,
    pages: response.total_pages,
    data: response.model_data,
  };
}

export function getModelLabel(model: string): string {
  switch (model) {
    case ExecutableModels.PD:
      return "PD Model";
    case ExecutableModels.LGD:
      return "LGD Model";
    case ExecutableModels.EAD:
      return "EAD Model";
    case ExecutableModels.CCF:
      return "CCF Model";
    case ExecutableModels.FLI:
      return "FLI Scalar";
    case ExecutableModels.ECL:
      return "ECL Model";
    default:
      return model;
  }
}

export const getModelTypeFromTab = (tab: string): string | null => {
  const tabToModelMap: { [key: string]: string } = {
    "ead-model": "ead",
    "lgd-model": "lgd",
    "ecl-model": "ecl",
    "ccf-model": "ccf",
    "pd-model": "pd",
    "fli-model": "fli",
  };
  return tabToModelMap[tab] || null;
};

export const getFileNameFromTab = (tabValue: string): string => {
  const tabToFileMap: { [key: string]: string } = {
    "yearly-combo-metrics": "pd_yearly_combo_metrics",
    "monthly-combo-metrics": "pd_monthly_combo_metrics",
    "monthly-marginal": "Monthly_Marginal_PD",
    "monthly-cumulative": "Monthly_Cummulative_PD",
    "scaled-monthly-conditional": "Scaled_Monthly_Conditional_PD",
    "monthly-pd": "Monthly_Conditional_PD",
    "annual-pd": "Annual_Conditional_PD",
  };
  return tabToFileMap[tabValue] || "pd_yearly_combo_metrics";
};

export const formatColumnHeader = (key: string): string => {
  const formatMap: { [key: string]: string } = {
    rating_index: "Index",
    Rating: "Rating",
    PD_Metric: "PD Metric",
    Annual_Conditional_PD: "Annual Conditional PD",
    Marginal_PD: "Marginal PD",
    Cumulative_PD: "Cumulative PD",
    Conditional_PD: "Conditional PD",
    "Year 1": "Year 1",
    "Year 2": "Year 2",
    "Year 3": "Year 3",
    "Year 4": "Year 4",
    "Year 5": "Year 5",
    "Year 6": "Year 6",
    "Year 7": "Year 7",
    "Year 8": "Year 8",
    "Year 9": "Year 9",
    "Year 10": "Year 10",
    "Month 1": "Month 1",
    "Month 2": "Month 2",
    "Month 3": "Month 3",
    "Month 4": "Month 4",
    "Month 5": "Month 5",
    "Month 6": "Month 6",
    "Month 7": "Month 7",
    "Month 8": "Month 8",
    "Month 9": "Month 9",
    "Month 10": "Month 10",
    "Month 11": "Month 11",
    "Month 12": "Month 12",
  };

  if (formatMap[key]) {
    return formatMap[key];
  }

  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const formatFileSize = (bytes: number) =>
  `${Math.round(bytes / 1024)} KB`;

export function formatNumber(num: number): string {
  if (isNaN(num)) return "0";
  if (num < 1000) return num?.toString();

  const units = ["", "K", "M", "B", "T", "P", "E"];
  const unitIndex = Math.floor(Math.log10(num) / 3);

  const scaledNumber = (num / Math.pow(1000, unitIndex)).toFixed(2);
  return `${scaledNumber}${units[unitIndex]}`;
}

const TRAILING_SLASH_REQUIRED = ["models", "users"];

export const normalizePath = (pathSegments: string[]) => {
  const path = pathSegments.join("/");

  // Ignore file extensions (just in case)
  if (/\.[a-zA-Z0-9]+$/.test(path)) {
    return path;
  }

  if (TRAILING_SLASH_REQUIRED.includes(path)) {
    return path.replace(/\/?$/, "/");
  }

  return path;
};

export const formatLabel = (value: string) => {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};