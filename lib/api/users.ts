import { apiClient } from "./client";
import { ENDPOINTS } from "./config";
import { SearchedUser } from "@/types/conversation";

export async function searchUsers(q: string): Promise<SearchedUser[]> {
  if (!q.trim()) return [];
  const params = new URLSearchParams({ q: q.trim() });
  return apiClient<SearchedUser[]>(`${ENDPOINTS.USERS.SEARCH}?${params.toString()}`, {
    method: "GET",
  });
}
