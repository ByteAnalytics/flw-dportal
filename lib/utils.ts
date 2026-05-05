/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

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
  if (num < 1000) return parseFloat(num.toFixed(4)).toString();

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
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const generateDynamicYears = (): any[] => {
  const years: string[] = [];
  for (let i = 1; i <= 7; i++) {
    years.push(`Year ${i}`);
  }
  return years;
};

export const buildQueryString = <T extends Record<string, any>>(
  filters?: T,
): string => {
  if (!filters) return "";

  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const paramsString = params.toString();
  return paramsString ? `?${paramsString}` : "";
};
