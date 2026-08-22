import { apiClient } from "./client";
import { ENDPOINTS } from "./config";
import { LoginPayload, AuthResponse, User } from "@/types/auth";

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMeApi(): Promise<User> {
  return apiClient<User>(ENDPOINTS.AUTH.ME, {
    method: "GET",
  });
}
