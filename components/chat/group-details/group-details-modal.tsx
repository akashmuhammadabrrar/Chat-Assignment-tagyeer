"use client";

import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import { X, Users, UserPlus, LogOut, Shield, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useUserSearch } from "@/hooks/use-user-search";
import {
  usePromoteToAdmin,
  useRenameGroup,
  useRemoveMember,
} from "@/hooks/use-group-actions";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { upsertConversation } from "@/lib/redux/slices/chatSlice";
import { addGroupParticipantsApi } from "@/lib/api/conversations";
import { Conversation, SearchedUser, Participant } from "@/types/conversation";
import { Button } from "@/components/ui/button";
import { GroupMemberItem } from "./group-member-item";
import { AddMembersTab } from "./add-members-tab";
import { RenameGroupForm } from "./rename-group-form";

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}

export function GroupDetailsModal({
  isOpen,
  onClose,
  conversation,
}: GroupDetailsModalProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"members" | "add">("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SearchedUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { users: searchedUsers, isSearching } = useUserSearch(searchQuery);

  const isGroup = conversation?.type === "group";
  const groupName = isGroup ? conversation.name : "Group Chat";

  const participants = useMemo<Participant[]>(() => {
    if (!conversation) return [];
    if (conversation.type === "group") return conversation.participants ?? [];
    if (conversation.type === "direct" && conversation.participant)
      return [conversation.participant];
    return [];
  }, [conversation]);

  const admins = useMemo<string[]>(
    () => (conversation?.type === "group" ? conversation.admins ?? [] : []),
    [conversation]
  );

  const isCurrentUserAdmin = useMemo(() => {
    if (!currentUser?._id || conversation?.type !== "group") return false;
    return admins.length > 0 ? admins.includes(currentUser._id) : true;
  }, [currentUser?._id, conversation, admins]);

  const availableUsersToAdd = useMemo(() => {
    const existingIds = new Set(participants.map((p) => p._id));
    return searchedUsers.filter((u) => !existingIds.has(u._id));
  }, [searchedUsers, participants]);

  const conversationId = conversation?._id ?? "";

  const { promote, isPromoting, promotingId, promoteError } =
    usePromoteToAdmin(conversationId);

  const { rename, isRenaming, renameError } = useRenameGroup(conversationId);

  const { removeMember, isRemoving, removingId, removeError } = useRemoveMember({
    conversationId,
    currentUserId: currentUser?._id,
    conversation,
    onSelfLeave: onClose,
  });

  const actionError = formError ?? removeError ?? promoteError ?? renameError ?? null;

  const handleAddMembers = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!conversation?._id || selectedUsers.length === 0 || isSubmitting) return;

      setIsSubmitting(true);
      setFormError(null);

      try {
        const userIds = selectedUsers.map((u) => u._id);
        const updatedGroup = await addGroupParticipantsApi(conversation._id, userIds);
        if (updatedGroup?._id) {
          dispatch(upsertConversation(updatedGroup));
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
        setSelectedUsers([]);
        setSearchQuery("");
        setActiveTab("members");
      } catch (err) {
        setFormError((err as Error)?.message ?? "Failed to add members to group.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [conversation?._id, selectedUsers, isSubmitting, dispatch, queryClient]
  );

  if (!isOpen || !conversation || !isGroup) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1, y: 0 }}
          className="relative w-full max-w-lg bg-[#FFEED6] dark:bg-card border-2 border-brand-dark/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden text-brand-dark dark:text-foreground flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-dark/15 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
              <div className="h-12 w-12 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark flex items-center justify-center font-extrabold shadow-md shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                {isCurrentUserAdmin ? (
                  <RenameGroupForm
                    currentName={groupName}
                    isRenaming={isRenaming}
                    onRename={rename}
                  />
                ) : (
                  <h3 className="text-base sm:text-lg font-black truncate">{groupName}</h3>
                )}
                <p className="text-xs font-bold text-brand-dark/60 dark:text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <span>{participants.length} Members</span>
                  {isCurrentUserAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-dark/10 dark:bg-white/10 text-[10px] font-black text-brand-dark dark:text-secondary flex items-center gap-1">
                      <Shield className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      You are Admin
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-brand-dark/15 dark:border-white/10 my-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("members")}
              className={`flex-1 py-2 text-xs font-black border-b-2 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "members"
                  ? "border-brand-dark dark:border-secondary text-brand-dark dark:text-secondary"
                  : "border-transparent text-brand-dark/50 dark:text-muted-foreground hover:text-brand-dark dark:hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Members ({participants.length})</span>
            </button>
            {isCurrentUserAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className={`flex-1 py-2 text-xs font-black border-b-2 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "add"
                    ? "border-brand-dark dark:border-secondary text-brand-dark dark:text-secondary"
                    : "border-transparent text-brand-dark/50 dark:text-muted-foreground hover:text-brand-dark dark:hover:text-foreground"
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Members</span>
              </button>
            )}
          </div>

          {/* Error Banner */}
          {actionError && (
            <div className="p-3 mb-2 rounded-xl bg-destructive/10 text-destructive text-xs font-bold shrink-0">
              {actionError}
            </div>
          )}

          {/* Tab: Current Members */}
          {activeTab === "members" && (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1">
              {participants.map((member) => (
                <GroupMemberItem
                  key={member._id}
                  member={member}
                  isMe={member._id === currentUser?._id}
                  currentUserIsAdmin={isCurrentUserAdmin}
                  memberIsAdmin={admins.includes(member._id)}
                  isRemoving={removingId === member._id}
                  isPromoting={promotingId === member._id}
                  onRemove={removeMember}
                  onPromote={promote}
                />
              ))}
            </div>
          )}

          {/* Tab: Add Members (Admin only) */}
          {activeTab === "add" && isCurrentUserAdmin && (
            <AddMembersTab
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isSearching={isSearching}
              selectedUsers={selectedUsers}
              onToggleUser={(user) =>
                setSelectedUsers((prev) =>
                  prev.some((u) => u._id === user._id)
                    ? prev.filter((u) => u._id !== user._id)
                    : [...prev, user]
                )
              }
              availableUsers={availableUsersToAdd}
              isSubmitting={isSubmitting}
              onSubmit={handleAddMembers}
            />
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-brand-dark/15 dark:border-white/10 shrink-0 flex items-center justify-between">
            <button
              type="button"
              disabled={isRemoving}
              onClick={() => currentUser?._id && removeMember(currentUser._id)}
              className="px-4 py-2 rounded-2xl bg-destructive text-white text-xs font-black flex items-center gap-2 hover:bg-destructive/90 transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              {removingId === currentUser?._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Leave Group</span>
                </>
              )}
            </button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-2xl text-xs font-bold"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
