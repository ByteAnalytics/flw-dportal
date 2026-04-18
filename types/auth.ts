import { AxiosResponse } from "axios";
import { ApiResponse, User } from ".";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface PasswordResetResponse {
  message: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setTokens: (token: string, refreshToken: string, user: User) => void;
  login: (
    credentials: LoginCredentials,
  ) => Promise<AxiosResponse<ApiResponse<LoginResponse>>>;
  resetPassword: (newPassword: string, contactInfo: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export interface AuthStorageState {
  user: User | null;
  token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
}
