"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useMemo } from "react";
import { getConversations } from "@/lib/api/conversations";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setConversations,
  setConversationsStatus,
  setConversationsError,
  selectOrderedConversations,
  selectConversationsStatus,
  selectConversationsError,
} from "@/lib/redux/slices/chatSlice";
import { getAuthToken } from "@/lib/utils/auth-token";
import { Conversation } from "@/types/conversation";

export function useConversations() {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectOrderedConversations);
  const status = useAppSelector(selectConversationsStatus);
  const error = useAppSelector(selectConversationsError);

  const lastDispatchedData = useRef<Conversation[] | undefined>(undefined);
  const lastDispatchedError = useRef<unknown>(undefined);

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    enabled: !!getAuthToken(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: 2,
    throwOnError: false,
  });

  useEffect(() => {
    if (query.isLoading) {
      dispatch(setConversationsStatus("loading"));
    }
  }, [query.isLoading, dispatch]);

  useEffect(() => {
    if (query.data !== undefined && query.data !== lastDispatchedData.current) {
      lastDispatchedData.current = query.data;
      dispatch(setConversations(query.data));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error && query.error !== lastDispatchedError.current) {
      lastDispatchedError.current = query.error;
      const msg = (query.error as any)?.message ?? "Failed to load conversations.";
      dispatch(setConversationsError(msg));
    }
  }, [query.error, dispatch]);

  return useMemo(
    () => ({
      conversations,
      status,
      error,
      refetch: query.refetch,
      isFetching: query.isFetching,
    }),
    [conversations, status, error, query.refetch, query.isFetching]
  );
}
