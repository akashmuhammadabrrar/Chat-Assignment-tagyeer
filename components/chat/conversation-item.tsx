"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Conversation } from "@/types/conversation";

/**
 * Derives a display name from the conversation safely:
 * - direct → participant's name (or fallback to participants array)
 * - group  → group name
 */
function getDisplayName(conv: Conversation): string {
  if (!conv) return "Chat";
  if (conv.type === "direct") {
    return (
      conv.participant?.name ||
      (conv as any).participants?.[0]?.name ||
      "Direct Chat"
    );
  }
  return conv.name || "Group Chat";
}

/**
 * Derives avatar initials (max 2 chars) — O(1)
 */
function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Formats an ISO timestamp into a compact display string — O(1)
 */
function formatTime(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ConversationItem({ conversation, isSelected, onSelect }: ConversationItemProps) {
  const displayName = getDisplayName(conversation);
  const initials = getInitials(displayName);
  const lastText = conversation.lastMessage?.text ?? "No messages yet";
  const timeLabel = conversation.lastMessage
    ? formatTime(conversation.lastMessage.createdAt)
    : formatTime(conversation.updatedAt);
  const isGroup = conversation.type === "group";

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(conversation._id)}
      className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-3 border ${
        isSelected
          ? "bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark border-transparent shadow-lg"
          : "bg-white/50 dark:bg-background/50 hover:bg-white dark:hover:bg-background border-brand-dark/10 dark:border-white/5 text-brand-dark dark:text-foreground"
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={`h-11 w-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-md ${
            isSelected
              ? "bg-secondary text-brand-dark dark:bg-brand-dark dark:text-secondary"
              : "bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark"
          }`}
        >
          {isGroup ? <Users className="h-5 w-5" /> : initials}
        </div>
        {/* Online dot — only for direct chats */}
        {!isGroup && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-card" />
        )}
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="text-xs sm:text-sm font-extrabold truncate">{displayName}</h4>
          <span
            className={`text-[10px] font-bold shrink-0 ml-1 ${
              isSelected
                ? "text-secondary/70 dark:text-brand-dark/70"
                : "text-brand-dark/60 dark:text-muted-foreground"
            }`}
          >
            {timeLabel}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p
            className={`text-xs truncate font-medium max-w-[160px] ${
              isSelected
                ? "text-secondary/90 dark:text-brand-dark/90"
                : "text-brand-muted dark:text-muted-foreground"
            }`}
          >
            {lastText}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
