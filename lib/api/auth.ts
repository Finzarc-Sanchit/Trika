// Authentication API service
import { apiPost, ApiResponse } from "../api";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

// Login user
export const login = async (
  loginData: LoginData
): Promise<ApiResponse<LoginResponse> & { token?: string; }> => {
  return apiPost<LoginResponse>("/auth/login", loginData, {
    skipAuth: true,
  }) as Promise<ApiResponse<LoginResponse> & { token?: string; }>;
};

// Logout user (client-side only)
export const logout = () => {
  localStorage.removeItem("token");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Store token
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};
