"use client";

import * as React from "react";
import { Plus, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SidebarHeader } from "./sidebar-header";
import { SidebarSearch } from "./sidebar-search";
import { SidebarActiveUsers, ActiveUser } from "./sidebar-active-users";
import { ConversationItem, Conversation } from "./conversation-item";
import { SidebarFooter } from "./sidebar-footer";

interface ChatSidebarProps {
  onNewChatClick?: () => void;
}

export function ChatSidebar({ onNewChatClick }: ChatSidebarProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedConversationId, setSelectedConversationId] = React.useState("1");

  // Mock Active Online People
  const onlineUsers: ActiveUser[] = [
    { id: "u1", name: "Ada Lovelace", avatar: "A", bg: "bg-amber-500" },
    { id: "u2", name: "Sarah Jenkins", avatar: "S", bg: "bg-emerald-500" },
    { id: "u3", name: "Alex Rivers", avatar: "A", bg: "bg-indigo-500" },
    { id: "u4", name: "David Chen", avatar: "D", bg: "bg-rose-500" },
    { id: "u5", name: "Elena Rostova", avatar: "E", bg: "bg-purple-500" },
  ];

  // Mock Recent Conversations
  const mockConversations: Conversation[] = [
    {
      id: "1",
      name: "Engineering Team",
      isGroup: true,
      lastMessage: "Sarah: Just pushed socket deployment to staging!",
      time: "10:44 AM",
      unreadCount: 3,
      avatar: "ET",
      online: true,
    },
    {
      id: "2",
      name: "Sarah Jenkins",
      isGroup: false,
      lastMessage: "Can you review the design tokens for #9A9C57?",
      time: "10:30 AM",
      unreadCount: 1,
      avatar: "SJ",
      online: true,
    },
    {
      id: "3",
      name: "Ada Lovelace",
      isGroup: false,
      lastMessage: "The API endpoint spec looks crystal clear.",
      time: "Yesterday",
      unreadCount: 0,
      avatar: "AL",
      online: true,
    },
    {
      id: "4",
      name: "Alex Rivers",
      isGroup: false,
      lastMessage: "Awesome! WebSockets emitting real-time packets.",
      time: "Yesterday",
      unreadCount: 0,
      avatar: "AR",
      online: false,
    },
    {
      id: "5",
      name: "Design System Squad",
      isGroup: true,
      lastMessage: "Alex: New Quicksand font scale is live.",
      time: "Aug 20",
      unreadCount: 0,
      avatar: "DS",
      online: false,
    },
  ];

  const filteredConversations = mockConversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 sm:w-84 h-full bg-brand-secondary/95 dark:bg-card border-r border-brand-dark/15 dark:border-white/10 flex flex-col justify-between select-none">
      {/* Header & Controls */}
      <div className="p-4 space-y-4">
        <SidebarHeader />

        {/* 1. Search Bar */}
        <SidebarSearch value={searchQuery} onChange={setSearchQuery} />

        {/* 3. + New Chat Action Button */}
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

        {/* 4. Active Online People */}
        <SidebarActiveUsers users={onlineUsers} />
      </div>

      {/* 2. Recent Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-2 mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            Recent Conversations
          </span>
        </div>

        {filteredConversations.map((c) => (
          <ConversationItem
            key={c.id}
            conversation={c}
            isSelected={selectedConversationId === c.id}
            onSelect={setSelectedConversationId}
          />
        ))}
      </div>

      {/* Footer User Profile & Controls */}
      <SidebarFooter user={user} onLogout={logout} />
    </div>
  );
}
