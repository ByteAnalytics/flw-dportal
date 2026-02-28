import axios from "axios";

export interface ValidationErrorItem {
  message: string;
  severity?: string;
  column?: string | null;
  sheet?: string | null;
  excel_rows?: number[] | null;
  error_count?: number | null;
}

export interface ValidationErrorSummary {
  total_files?: number;
  valid_files?: number;
  invalid_files?: number;
  total_errors?: number;
  validation_passed?: boolean;
}

export interface ValidationErrorPayload {
  message: string;
  errors: ValidationErrorItem[];
  summary?: ValidationErrorSummary;
}

export const extractValidationPayload = (
  err: unknown,
): ValidationErrorPayload | null => {
  if (!axios.isAxiosError(err)) return null;

  const data = err.response?.data;

  const rawDetail = data?.detail ?? data?.data?.detail ?? null;

  if (!rawDetail || typeof rawDetail !== "string") return null;

  if (!rawDetail.includes("Validation failed")) return null;

  try {
    const jsCompatible = rawDetail
      .replace(/\bNone\b/g, "null")
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false");

    const parsed = new Function(`return (${jsCompatible})`)();

    return parsed as ValidationErrorPayload;
  } catch (e) {
    console.error("Validation payload parse failed", e);
    return null;
  }
};
