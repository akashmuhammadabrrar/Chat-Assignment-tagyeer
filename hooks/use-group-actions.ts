"use client";

import { useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/lib/redux/hooks";
import { upsertConversation, setActiveConversationId } from "@/lib/redux/slices/chatSlice";
import {
  removeGroupParticipantApi,
  promoteToAdminApi,
  renameGroupApi,
} from "@/lib/api/conversations";
import { Conversation } from "@/types/conversation";

// ─── Promote Member to Admin ───────────────────────────────────────────────

export function usePromoteToAdmin(conversationId: string) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => promoteToAdminApi(conversationId, userId),
    onSuccess: (updatedConversation: Conversation) => {
      if (updatedConversation?._id) {
        dispatch(upsertConversation(updatedConversation));
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
  });

  const promote = useCallback(
    (userId: string) => mutation.mutateAsync(userId),
    [mutation]
  );

  return useMemo(
    () => ({
      promote,
      isPromoting: mutation.isPending,
      promotingId: mutation.isPending ? (mutation.variables as string) : null,
      promoteError: mutation.error
        ? (mutation.error as Error).message ?? "Failed to promote member."
        : null,
    }),
    [promote, mutation.isPending, mutation.variables, mutation.error]
  );
}

// ─── Rename Group ──────────────────────────────────────────────────────────

export function useRenameGroup(conversationId: string) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (name: string) => renameGroupApi(conversationId, name),
    onSuccess: (updatedConversation: Conversation) => {
      if (updatedConversation?._id) {
        dispatch(upsertConversation(updatedConversation));
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
  });

  const rename = useCallback(
    (name: string) => mutation.mutateAsync(name),
    [mutation]
  );

  return useMemo(
    () => ({
      rename,
      isRenaming: mutation.isPending,
      renameError: mutation.error
        ? (mutation.error as Error).message ?? "Failed to rename group."
        : null,
    }),
    [rename, mutation.isPending, mutation.error]
  );
}

// ─── Remove Member / Leave Group ──────────────────────────────────────────

interface UseRemoveMemberOptions {
  conversationId: string;
  currentUserId: string | undefined;
  conversation: Conversation | null;
  onSelfLeave?: () => void;
}

export function useRemoveMember({
  conversationId,
  currentUserId,
  conversation,
  onSelfLeave,
}: UseRemoveMemberOptions) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => removeGroupParticipantApi(conversationId, userId),
    onSuccess: (_result, userId: string) => {
      const isLeavingSelf = userId === currentUserId;

      if (isLeavingSelf) {
        dispatch(setActiveConversationId(null));
        onSelfLeave?.();
      } else if (conversation?.type === "group") {
        const updated: Conversation = {
          ...conversation,
          participants: conversation.participants.filter((p) => p._id !== userId),
        };
        dispatch(upsertConversation(updated));
      }

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const removeMember = useCallback(
    (userId: string) => mutation.mutateAsync(userId),
    [mutation]
  );

  return useMemo(
    () => ({
      removeMember,
      isRemoving: mutation.isPending,
      removingId: mutation.isPending ? (mutation.variables as string) : null,
      removeError: mutation.error
        ? (mutation.error as Error).message ?? "Failed to remove member."
        : null,
    }),
    [removeMember, mutation.isPending, mutation.variables, mutation.error]
  );
}
