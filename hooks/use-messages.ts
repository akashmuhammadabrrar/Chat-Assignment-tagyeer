"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { getMessages, createDirectConversation } from "@/lib/api/conversations";
import { sendMessageApi } from "@/lib/api/messages";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  setActiveConversationId,
  upsertConversation,
} from "@/lib/redux/slices/chatSlice";
import { Message, Conversation } from "@/types/conversation";

export function useMessages(conversationId: string | null) {
  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => (conversationId ? getMessages(conversationId) : Promise.resolve([])),
    enabled: !!conversationId,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });

  const messages = query.data ?? [];
  const isLoading = query.isLoading;
  const isFetching = query.isFetching;
  const error = query.error ? (query.error as any)?.message ?? "Failed to load messages" : null;

  return useMemo(
    () => ({
      messages,
      isLoading,
      isFetching,
      error,
      refetch: query.refetch,
    }),
    [messages, isLoading, isFetching, error, query.refetch]
  );
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
      sendMessageApi(conversationId, text),
    onSuccess: (rawResponse, variables) => {
      const msgObj: Message = (rawResponse as any)?.data ?? (rawResponse as any)?.message ?? rawResponse;
      if (!msgObj || !variables.conversationId) return;

      const normalizedMessage: Message = {
        _id: msgObj._id || Date.now().toString(),
        conversationId: msgObj.conversationId || variables.conversationId,
        sender: msgObj.sender || "You",
        text: msgObj.text || variables.text,
        createdAt: msgObj.createdAt || new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(["messages", variables.conversationId], (old) => {
        const list = old ? [...old] : [];
        const existingIndex = list.findIndex(
          (m) =>
            m._id === normalizedMessage._id ||
            (m.text === normalizedMessage.text &&
              Math.abs(new Date(m.createdAt || 0).getTime() - new Date(normalizedMessage.createdAt).getTime()) < 3000)
        );

        if (existingIndex >= 0) {
          list[existingIndex] = normalizedMessage;
        } else {
          list.push(normalizedMessage);
        }

        return list.sort(
          (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
      });

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const sendMessage = useCallback(
    async (conversationId: string, text: string) => {
      if (!conversationId || !text.trim()) return;
      return mutation.mutateAsync({ conversationId, text: text.trim() });
    },
    [mutation]
  );

  return useMemo(
    () => ({
      sendMessage,
      isSending: mutation.isPending,
      sendError: mutation.error ? (mutation.error as any)?.message ?? "Send failed" : null,
    }),
    [sendMessage, mutation.isPending, mutation.error]
  );
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: (userId: string) => createDirectConversation(userId),
    onSuccess: (conversation: Conversation) => {
      if (conversation && conversation._id) {
        dispatch(upsertConversation(conversation));
        dispatch(setActiveConversationId(conversation._id));
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
  });

  const startDirectChat = useCallback(
    async (userId: string) => {
      if (!userId) return;
      return mutation.mutateAsync(userId);
    },
    [mutation]
  );

  return useMemo(
    () => ({
      startDirectChat,
      isCreating: mutation.isPending,
      createError: mutation.error ? (mutation.error as any)?.message ?? "Could not start chat" : null,
    }),
    [startDirectChat, mutation.isPending, mutation.error]
  );
}
