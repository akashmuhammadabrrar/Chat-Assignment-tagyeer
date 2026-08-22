"use client";

import * as React from "react";
import { motion } from "framer-motion";

export interface Conversation {
  id: string;
  name: string;
  isGroup: boolean;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar: string;
  online: boolean;
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationItemProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(conversation.id)}
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
          {conversation.avatar}
        </div>
        {conversation.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-card" />
        )}
      </div>

      {/* Chat Metadata & Snippet */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="text-xs sm:text-sm font-extrabold truncate">
            {conversation.name}
          </h4>
          <span
            className={`text-[10px] font-bold ${
              isSelected
                ? "text-secondary/70 dark:text-brand-dark/70"
                : "text-brand-dark/60 dark:text-muted-foreground"
            }`}
          >
            {conversation.time}
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
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
