import { apiClient } from "./client";
import { ENDPOINTS } from "./config";
import { Conversation, Message } from "@/types/conversation";

export async function getConversations(): Promise<Conversation[]> {
  const res = await apiClient<any>(ENDPOINTS.CONVERSATIONS.LIST, {
    method: "GET",
  });
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

export async function createDirectConversation(userId: string): Promise<Conversation> {
  const res = await apiClient<any>(ENDPOINTS.CONVERSATIONS.CREATE_DIRECT, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  return res.data ?? res;
}

export async function getMessages(
  conversationId: string,
  limit = 50,
  before?: string
): Promise<Message[]> {
  if (!conversationId) return [];

  const params = new URLSearchParams({ limit: limit.toString() });
  if (before) params.append("before", before);

  const endpoint = `${ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId)}?${params.toString()}`;
  const res = await apiClient<any>(endpoint, {
    method: "GET",
  });

  let rawList: Message[] = [];
  if (Array.isArray(res)) rawList = res;
  else if (Array.isArray(res?.data)) rawList = res.data;
  else if (Array.isArray(res?.messages)) rawList = res.messages;

  return [...rawList].sort(
    (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
  );
}

export async function createGroupConversationApi(
  name: string,
  participantIds: string[]
): Promise<Conversation> {
  const res = await apiClient<any>(ENDPOINTS.CONVERSATIONS.CREATE_GROUP, {
    method: "POST",
    body: JSON.stringify({ name, participantIds }),
  });
  return res.data ?? res;
}
