"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { UserPlus, Loader2 } from "lucide-react";
import { SearchedUser } from "@/types/conversation";

interface UserResultItemProps {
  user: SearchedUser;
  onStartChat: (user: SearchedUser) => void;
  isCreating: boolean;
}

export function UserResultItem({ user, onStartChat, isCreating }: UserResultItemProps) {
  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-2xl flex items-center gap-3 border border-brand-dark/10 dark:border-white/5 bg-white/50 dark:bg-background/50 hover:bg-white dark:hover:bg-background cursor-pointer transition-all duration-150"
      onClick={() => onStartChat(user)}
    >
      <div className="h-10 w-10 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark font-extrabold text-sm flex items-center justify-center shadow-md shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-extrabold text-brand-dark dark:text-foreground truncate">{user.name}</p>
        <p className="text-[11px] font-medium text-brand-muted dark:text-muted-foreground truncate">{user.phone}</p>
      </div>
      {isCreating ? (
        <Loader2 className="h-4 w-4 animate-spin text-brand-dark dark:text-secondary shrink-0" />
      ) : (
        <UserPlus className="h-4 w-4 text-brand-dark/40 dark:text-white/30 shrink-0" />
      )}
    </motion.div>
  );
}
