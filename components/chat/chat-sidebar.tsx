"use client";

import * as React from "react";
import { useCallback, useMemo } from "react";
import { Plus, MessageSquare, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/use-conversations";
import { useUserSearch } from "@/hooks/use-user-search";
import { useStartConversation } from "@/hooks/use-messages";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setActiveConversationId,
  selectActiveConversationId,
} from "@/lib/redux/slices/chatSlice";
import { SidebarHeader } from "./sidebar-header";
import { SidebarSearch } from "./sidebar-search";
import { SidebarActiveUsers, ActiveUser } from "./sidebar-active-users";
import { ConversationItem } from "./conversation-item";
import { ConversationSkeleton } from "./conversation-skeleton";
import { EmptyConversations } from "./empty-conversations";
import { ConversationsError } from "./conversations-error";
import { UserResultItem } from "./user-result-item";
import { SidebarFooter } from "./sidebar-footer";
import { Conversation, SearchedUser } from "@/types/conversation";

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

interface ChatSidebarProps {
  onNewChatClick?: () => void;
}

export function ChatSidebar({ onNewChatClick }: ChatSidebarProps) {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(selectActiveConversationId);
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Live conversations from API
  const { conversations, error, refetch, isFetching } = useConversations();

  // Live user search (only when search query is non-empty)
  const { users: searchedUsers, isSearching, hasQuery } = useUserSearch(searchQuery);

  // Hook to start 1-to-1 conversation
  const { startDirectChat, isCreating } = useStartConversation();

  // Dynamically derive active contacts from actual conversations — O(n) pass
  const activeUsers = useMemo<ActiveUser[]>(() => {
    const map = new Map<string, ActiveUser>();

    for (const c of conversations) {
      if (c.type === "direct" && c.participant) {
        const p = c.participant;
        if (!map.has(p._id)) {
          const initials = (p.name ?? "User")
            .trim()
            .split(/\s+/)
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          map.set(p._id, {
            id: p._id,
            name: p.name ?? "Direct Chat",
            avatar: initials || "?",
            bg: "bg-emerald-600",
            conversationId: c._id,
          });
        }
      } else if (c.type === "group" && c.participants) {
        for (const p of c.participants) {
          if (!map.has(p._id) && p._id !== user?._id) {
            const initials = (p.name ?? "User")
              .trim()
              .split(/\s+/)
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            map.set(p._id, {
              id: p._id,
              name: p.name ?? "Member",
              avatar: initials || "?",
              bg: "bg-emerald-600",
              conversationId: c._id,
            });
          }
        }
      }
    }

    return Array.from(map.values());
  }, [conversations, user?._id]);

  // Client-side filter on conversations — O(n) pass
  const filteredConversations = useMemo<Conversation[]>(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => {
      const name = c.type === "direct" ? c.participant?.name ?? "" : c.name ?? "";
      return (
        name.toLowerCase().includes(q) ||
        (c.lastMessage?.text ?? "").toLowerCase().includes(q)
      );
    });
  }, [conversations, searchQuery]);

  const handleStartChat = useCallback(
    async (searchUser: SearchedUser) => {
      await startDirectChat(searchUser._id);
      setSearchQuery(""); // Clear search to return to conversation list
    },
    [startDirectChat]
  );

  const handleSelectConversation = useCallback(
    (id: string) => {
      dispatch(setActiveConversationId(id));
    },
    [dispatch]
  );

  const handleSelectActiveUser = useCallback(
    (u: ActiveUser) => {
      if (u.conversationId) {
        dispatch(setActiveConversationId(u.conversationId));
      }
    },
    [dispatch]
  );

  const isLoading = isFetching && conversations.length === 0;

  return (
    <div className="w-80 sm:w-84 h-full bg-brand-secondary/95 dark:bg-card border-r border-brand-dark/15 dark:border-white/10 flex flex-col justify-between select-none">
      {/* Header & Controls */}
      <div className="p-4 space-y-4">
        <SidebarHeader />

        {/* Search — drives both conversation filter + user search */}
        <SidebarSearch value={searchQuery} onChange={setSearchQuery} />

        {/* + New Chat Button */}
        <button
          onClick={onNewChatClick}
          className="group relative overflow-hidden w-full px-4 py-3 text-xs sm:text-sm font-extrabold rounded-2xl border-2 border-brand-dark dark:border-secondary text-brand-dark dark:text-secondary transition-colors duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="absolute inset-0 bg-brand-dark dark:bg-secondary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-secondary dark:group-hover:text-brand-dark transition-colors duration-300">
            <Plus className="h-4 w-4" />
            <span>+ New Chat / Group</span>
          </span>
        </button>

        {/* Dynamic Active Contacts (hidden if empty) */}
        {!hasQuery && (
          <SidebarActiveUsers
            users={activeUsers}
            onSelectUser={handleSelectActiveUser}
          />
        )}
      </div>

      {/* Conversation / Search Results List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <AnimatePresence mode="wait">
          {/* ── User search results ── */}
          {hasQuery && (
            <motion.div
              key="user-search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              <div className="px-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {isSearching ? "Searching users..." : `Users (${searchedUsers.length})`}
                </span>
              </div>

              {isSearching && (
                <>
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                </>
              )}

              {!isSearching && searchedUsers.length === 0 && (
                <p className="text-xs text-center font-medium text-brand-muted dark:text-muted-foreground py-4">
                  No users found for "{searchQuery}"
                </p>
              )}

              {!isSearching &&
                searchedUsers.map((u) => (
                  <UserResultItem
                    key={u._id}
                    user={u}
                    onStartChat={handleStartChat}
                    isCreating={isCreating}
                  />
                ))}

              {/* Also show filtered conversations below */}
              {filteredConversations.length > 0 && (
                <>
                  <div className="px-2 mt-3 mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Conversations ({filteredConversations.length})
                    </span>
                  </div>
                  {filteredConversations.map((c) => (
                    <ConversationItem
                      key={c._id}
                      conversation={c}
                      isSelected={activeConversationId === c._id}
                      onSelect={handleSelectConversation}
                    />
                  ))}
                </>
              )}
            </motion.div>
          )}

          {/* ── Normal conversation list ── */}
          {!hasQuery && (
            <motion.div
              key="conversations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              <div className="px-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Recent Conversations
                </span>
              </div>

              {/* Loading state — 3 skeleton items */}
              {isLoading && (
                <>
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                </>
              )}

              {/* Error state */}
              {!isFetching && error && (
                <ConversationsError error={error} onRetry={refetch} />
              )}

              {/* Empty state */}
              {!isFetching && !error && conversations.length === 0 && (
                <EmptyConversations />
              )}

              {/* Conversation items */}
              {conversations.length > 0 &&
                filteredConversations.map((c) => (
                  <ConversationItem
                    key={c._id}
                    conversation={c}
                    isSelected={activeConversationId === c._id}
                    onSelect={handleSelectConversation}
                  />
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <SidebarFooter user={user} onLogout={logout} />
    </div>
  );
}
