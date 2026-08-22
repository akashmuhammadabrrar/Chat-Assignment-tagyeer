import { apiClient } from "./client";
import { ENDPOINTS } from "./config";
import { Message } from "@/types/conversation";

export async function sendMessageApi(
  conversationId: string,
  text: string
): Promise<Message> {
  const res = await apiClient<any>(ENDPOINTS.MESSAGES.SEND, {
    method: "POST",
    body: JSON.stringify({ conversationId, text }),
  });
  if (res?.data) return res.data;
  if (res?.message && typeof res.message === "object") return res.message;
  return res;
}
