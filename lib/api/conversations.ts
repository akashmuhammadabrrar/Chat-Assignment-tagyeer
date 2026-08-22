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

  try {
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
  } catch (err: any) {
    if (err?.status === 403 || err?.status === 400) {
      console.warn(`[getMessages] Access restricted for conversation ${conversationId}:`, err?.message);
    } else {
      console.error(`[getMessages] Error fetching messages for ${conversationId}:`, err);
    }
    return [];
  }
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

export async function addGroupParticipantsApi(
  conversationId: string,
  userIds: string[]
): Promise<Conversation> {
  const res = await apiClient<any>(ENDPOINTS.CONVERSATIONS.PARTICIPANTS(conversationId), {
    method: "POST",
    body: JSON.stringify({ userIds }),
  });
  return res.data ?? res;
}

export async function removeGroupParticipantApi(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const res = await apiClient<any>(
    ENDPOINTS.CONVERSATIONS.REMOVE_PARTICIPANT(conversationId, userId),
    { method: "DELETE" }
  );
  return res?.data ?? res;
}

export async function promoteToAdminApi(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const res = await apiClient<any>(ENDPOINTS.CONVERSATIONS.ADMINS(conversationId), {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  return res?.data ?? res;
}

export async function renameGroupApi(
  conversationId: string,
  name: string
): Promise<Conversation> {
  const res = await apiClient<any>(ENDPOINTS.CONVERSATIONS.RENAME(conversationId), {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
  return res?.data ?? res;
}

