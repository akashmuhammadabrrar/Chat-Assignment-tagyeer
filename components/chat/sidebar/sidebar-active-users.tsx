"use client";

import * as React from "react";

export interface ActiveUser {
  id: string;
  name: string;
  avatar: string;
  bg: string;
  conversationId?: string;
}

interface SidebarActiveUsersProps {
  users: ActiveUser[];
  onSelectUser?: (user: ActiveUser) => void;
}

export function SidebarActiveUsers({
  users,
  onSelectUser,
}: SidebarActiveUsersProps) {
  if (!users || users.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Contacts ({users.length})
        </span>
      </div>
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => onSelectUser?.(u)}
            className="relative group flex-shrink-0 cursor-pointer"
            title={u.name}
          >
            <div
              className={`h-10 w-10 rounded-2xl ${u.bg} text-white font-extrabold text-sm flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}
            >
              {u.avatar}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-card" />
          </div>
        ))}
      </div>
    </div>
  );
}
