import {
  ApiPaginatedResponse,
  ApiResponse,
  User,
  UserRole,
  UserStatus,
} from ".";

export type TeamUsersResponse = ApiResponse<User[]>;

export type TeamUserResponse = ApiResponse<User>;

export type Activity = {
  id: string;
  created_at: string;
  updated_at: string;
  timestamp: string;
  action: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export type ActivityResponse = ApiPaginatedResponse<Activity>;

export type PasswordChangeLog = {
  id: string;
  created_at: string;
  updated_at: string;
  timestamp: string;
  admin_name: string;
  user_name: string;
  admin_email: string;
  user_email: string;
  status: "success" | "failed" | string;
  ip_address: string;
};

export type PasswordChangeLogResponse = ApiPaginatedResponse<PasswordChangeLog>;
