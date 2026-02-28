import apiClient from "./client";
import { AxiosResponse } from "axios";
import { ApiResponse } from "../types";
import { LoginCredentials, LoginResponse } from "@/types/auth";

export const authService = {
  login: async (
    credentials: LoginCredentials,
  ): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
    return apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials,
    );
  },

  resetPassword: async (
    password: string,
    token: string,
    email: string,
  ): Promise<AxiosResponse<ApiResponse<null>>> => {
    const payload = {
      email,
      token,
      password,
    };

    return apiClient.post("/auth/set-password", payload);
  },
};
