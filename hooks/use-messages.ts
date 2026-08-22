"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useCallback, useState, useEffect } from "react";
import { getMessages, createDirectConversation } from "@/lib/api/conversations";
import { sendMessageApi } from "@/lib/api/messages";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setActiveConversationId,
  upsertConversation,
} from "@/lib/redux/slices/chatSlice";
import { Message, Conversation } from "@/types/conversation";

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Resolve isSeen from server readBy array or existing flag */
function resolveSeenStatus(
  msg: Message & { readBy?: string[] },
  currentUserId: string | undefined
): Message {
  const readBy: string[] = Array.isArray(msg.readBy) ? msg.readBy : [];
  const serverSeen =
    currentUserId && readBy.length > 0 ? readBy.includes(currentUserId) : undefined;

  return {
    ...msg,
    readBy,
    isSeen: serverSeen ?? msg.isSeen ?? false,
    status: msg.status ?? (serverSeen ? "seen" : "sent"),
  };
}

/** Sort messages chronologically */
function sortByCreatedAt(list: Message[]): Message[] {
  return [...list].sort(
    (a, b) =>
      new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
  );
}

// ─── useMessages ───────────────────────────────────────────────────────────

export function useMessages(conversationId: string | null) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const msgs = await getMessages(conversationId);
      return msgs.map((m) => resolveSeenStatus(m, currentUser?._id));
    },
    enabled: !!conversationId,
    staleTime: 10_000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const messages = (query.data ?? []) as Message[];
  // Only show "load more" if the initial fetch returned a full page
  const initialHasMore = messages.length >= PAGE_SIZE;

  return useMemo(
    () => ({
      messages,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error
        ? ((query.error as Error)?.message ?? "Failed to load messages")
        : null,
      refetch: query.refetch,
      initialHasMore,
    }),
    [messages, query.isLoading, query.isFetching, query.error, query.refetch, initialHasMore]
  );
}

// ─── useLoadMoreMessages ───────────────────────────────────────────────────

const PAGE_SIZE = 30;

export function useLoadMoreMessages(conversationId: string | null, initialHasMore: boolean) {
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [oldestId, setOldestId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  // Sync hasMore when initial load changes (e.g. switching conversations)
  useEffect(() => {
    setHasMore(initialHasMore);
  }, [initialHasMore]);

  const loadMore = useCallback(async () => {
    if (!conversationId || isLoadingMore || !hasMore) return;

    // Derive cursor from current oldest message in cache if not tracked yet
    const cached = queryClient.getQueryData<Message[]>(["messages", conversationId]);
    const cursor = oldestId ?? (cached?.length ? cached[0]._id : undefined);

    if (!cursor) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const older = await getMessages(conversationId, PAGE_SIZE, cursor);
      const normalized = older.map((m) => resolveSeenStatus(m, currentUser?._id));

      if (normalized.length < PAGE_SIZE) setHasMore(false);
      if (normalized.length === 0) return;

      // Track new oldest
      setOldestId(normalized[0]._id);

      // Prepend to cache
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (prev) => sortByCreatedAt([...normalized, ...(prev ?? [])])
      );
    } catch (err) {
      setLoadMoreError((err as Error)?.message ?? "Failed to load older messages.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, isLoadingMore, hasMore, oldestId, queryClient, currentUser?._id]);

  // Reset pagination state when conversation changes
  const reset = useCallback(() => {
    setOldestId(null);
    setHasMore(true);
    setLoadMoreError(null);
  }, []);

  return useMemo(
    () => ({ loadMore, hasMore, isLoadingMore, loadMoreError, reset }),
    [loadMore, hasMore, isLoadingMore, loadMoreError, reset]
  );
}

// ─── useSendMessage ────────────────────────────────────────────────────────

export function useSendMessage() {
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state) => state.auth.user);

  const mutation = useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
      sendMessageApi(conversationId, text),

    onMutate: async ({ conversationId, text }) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticMsg: Message = {
        _id: tempId,
        conversationId,
        sender: currentUser?._id ?? "You",
        text,
        createdAt: new Date().toISOString(),
        status: "sending",
        readBy: [],
        isSeen: false,
      };

      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) => [
        ...(old ?? []),
        optimisticMsg,
      ]);

      return { tempId };
    },

    onSuccess: (rawResponse, variables, context) => {
      const raw = rawResponse as unknown as Record<string, unknown>;
      const msgObj: Record<string, unknown> =
        (raw?.data as Record<string, unknown>) ??
        (raw?.message as Record<string, unknown>) ??
        raw;
      if (!msgObj || !variables.conversationId) return;

      const readBy: string[] = Array.isArray(msgObj.readBy)
        ? (msgObj.readBy as string[])
        : [];

      const normalized: Message = {
        _id: (msgObj._id as string) || context?.tempId || String(Date.now()),
        conversationId:
          (msgObj.conversationId as string) || variables.conversationId,
        sender: (msgObj.sender as Message["sender"]) || currentUser?._id || "You",
        text: (msgObj.text as string) || variables.text,
        createdAt: (msgObj.createdAt as string) || new Date().toISOString(),
        readBy,
        status: "sent",
        isSeen: false,
      };

      queryClient.setQueryData<Message[]>(
        ["messages", variables.conversationId],
        (old) => {
          const list = [...(old ?? [])];
          const idx = list.findIndex(
            (m) => m._id === context?.tempId || m._id === normalized._id
          );
          if (idx >= 0) list[idx] = normalized;
          else list.push(normalized);
          return sortByCreatedAt(list);
        }
      );

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },

    onError: (_err, variables, context) => {
      if (!context?.tempId) return;
      queryClient.setQueryData<Message[]>(
        ["messages", variables.conversationId],
        (old) =>
          (old ?? []).map((m) =>
            m._id === context.tempId ? { ...m, status: "failed" as const } : m
          )
      );
    },
  });

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      if (!conversationId || !text.trim()) return Promise.resolve(undefined);
      return mutation.mutateAsync({ conversationId, text: text.trim() });
    },
    [mutation]
  );

  return useMemo(
    () => ({
      sendMessage,
      isSending: mutation.isPending,
      sendError: mutation.error
        ? ((mutation.error as Error)?.message ?? "Send failed")
        : null,
    }),
    [sendMessage, mutation.isPending, mutation.error]
  );
}

// ─── useStartConversation ──────────────────────────────────────────────────

export function useStartConversation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: (userId: string) => createDirectConversation(userId),
    onSuccess: (conversation: Conversation) => {
      if (conversation?._id) {
        dispatch(upsertConversation(conversation));
        dispatch(setActiveConversationId(conversation._id));
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
  });

  const startDirectChat = useCallback(
    (userId: string) => {
      if (!userId) return Promise.resolve(undefined);
      return mutation.mutateAsync(userId);
    },
    [mutation]
  );

  return useMemo(
    () => ({
      startDirectChat,
      isCreating: mutation.isPending,
      createError: mutation.error
        ? ((mutation.error as Error)?.message ?? "Could not start chat")
        : null,
    }),
    [startDirectChat, mutation.isPending, mutation.error]
  );
}
