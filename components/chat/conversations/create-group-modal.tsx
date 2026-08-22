"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { X, Users, Check, Loader2, Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserSearch } from "@/hooks/use-user-search";
import { createGroupConversationApi } from "@/lib/api/conversations";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  setActiveConversationId,
  upsertConversation,
} from "@/lib/redux/slices/chatSlice";
import { useQueryClient } from "@tanstack/react-query";
import { SearchedUser } from "@/types/conversation";
import { Button } from "@/components/ui/button";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SearchedUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { users: searchedUsers, isSearching } = useUserSearch(searchQuery);

  const handleToggleUser = useCallback((user: SearchedUser) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u._id === user._id);
      if (exists) {
        return prev.filter((u) => u._id !== user._id);
      }
      return [...prev, user];
    });
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const participantIds = selectedUsers.map((u) => u._id);
      const group = await createGroupConversationApi(groupName.trim(), participantIds);

      if (group && group._id) {
        dispatch(upsertConversation(group));
        dispatch(setActiveConversationId(group._id));
        queryClient.invalidateQueries({ queryKey: ["conversations"] });

        setGroupName("");
        setSearchQuery("");
        setSelectedUsers([]);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to create group conversation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#FFEED6] dark:bg-card border-2 border-brand-dark/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden text-brand-dark dark:text-foreground"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-dark/15 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark flex items-center justify-center font-extrabold shadow-md">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-brand-dark dark:text-secondary">
                  Create Group Chat
                </h3>
                <p className="text-xs font-medium text-brand-dark/60 dark:text-muted-foreground">
                  Add multiple participants to a group
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreateGroup} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-bold">
                {error}
              </div>
            )}

            {/* Group Name Input */}
            <div>
              <label className="block text-xs font-extrabold mb-1.5 uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground">
                Group Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Project Team, Squad..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white dark:bg-background text-xs sm:text-sm font-extrabold text-brand-dark dark:text-foreground focus:outline-none focus:border-brand-dark dark:focus:border-secondary"
              />
            </div>

            {/* Selected Pills */}
            {selectedUsers.length > 0 && (
              <div>
                <span className="block text-xs font-extrabold mb-1.5 uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground">
                  Selected ({selectedUsers.length})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {selectedUsers.map((u) => (
                    <span
                      key={u._id}
                      onClick={() => handleToggleUser(u)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-extrabold cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <span>{u.name}</span>
                      <X className="h-3 w-3" />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Search Participants */}
            <div>
              <label className="block text-xs font-extrabold mb-1.5 uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground">
                Add Members
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/40 dark:text-white/40" />
                <input
                  type="text"
                  placeholder="Search user by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-2xl border border-brand-dark/15 dark:border-white/10 bg-white/70 dark:bg-background/70 text-xs font-bold text-brand-dark dark:text-foreground focus:outline-none"
                />
              </div>

              {/* User Results List */}
              <div className="max-h-36 overflow-y-auto space-y-1">
                {isSearching && (
                  <div className="p-3 text-center text-xs font-bold text-brand-dark/50 dark:text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Searching users...</span>
                  </div>
                )}

                {!isSearching && searchQuery.trim() && searchedUsers.length === 0 && (
                  <div className="p-3 text-center text-xs font-medium text-brand-dark/50 dark:text-muted-foreground">
                    No users found for "{searchQuery}"
                  </div>
                )}

                {searchedUsers.map((u) => {
                  const isSelected = selectedUsers.some((sel) => sel._id === u._id);
                  return (
                    <div
                      key={u._id}
                      onClick={() => handleToggleUser(u)}
                      className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer border transition-colors ${
                        isSelected
                          ? "bg-brand-dark/10 dark:bg-white/10 border-brand-dark dark:border-secondary"
                          : "bg-white/40 dark:bg-background/40 border-transparent hover:bg-white dark:hover:bg-background"
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-extrabold truncate">{u.name}</span>
                        <span className="text-[10px] text-brand-dark/60 dark:text-muted-foreground truncate">{u.phone}</span>
                      </div>
                      <div
                        className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? "bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark"
                            : "border border-brand-dark/30 dark:border-white/30"
                        }`}
                      >
                        {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-brand-dark/15 dark:border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <button
                type="submit"
                disabled={!groupName.trim() || selectedUsers.length === 0 || isSubmitting}
                className="flex-1 h-10 rounded-xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-40 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span>Create Group ({selectedUsers.length})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
