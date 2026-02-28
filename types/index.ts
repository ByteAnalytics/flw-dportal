/* eslint-disable @typescript-eslint/no-explicit-any */

export enum FormFieldType {
  INPUT = "text",
  PASSWORD = "password",
  NUMBER = "number",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  DATE = "date",
  SELECT = "select",
  SKELETON = "skeleton",
  EMAIL = "email",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  SUPER_USER = "SUPERUSER",
}

export enum AddAsEmailReceipient {
  YES = "YES",
  NO = "NO",
}

export enum Portfolio {
  AHF = "AHF",
  HTO = "HTO",
  RHF = "RHF",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  last_login: string;
  is_temp_password: boolean;
  is_email_recipient: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  detail: string;
  error: string;
  data: T;
}

export interface PaginatedResponse<T> {
  page: number;
  page_size: number;
  total: number;
  pages: number;
  data: T[];
}

export interface ApiError {
  success: boolean;
  status_code: number;
  message: string;
  detail: string;
  error: string;
  status?: number;
  data?: {
    errors?: ApiValidationError[];
  };
}
export interface ApiValidationError {
  loc: string[]; // e.g. ["body", "password"]
  msg: string; // e.g. "Value error, Password must be at least 8 characters long"
  type: string; // e.g. "value_error"
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

// Full API response with pagination
export type ApiPaginatedResponse<T> = ApiResponse<PaginatedResponse<T>>;
