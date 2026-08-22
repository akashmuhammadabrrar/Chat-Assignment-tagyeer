"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth";

interface SidebarFooterProps {
  user: User | null;
  onLogout: () => void;
}

export function SidebarFooter({ user, onLogout }: SidebarFooterProps) {
  return (
    <div className="p-3.5 border-t border-brand-dark/15 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-background/40">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-9 w-9 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark font-extrabold text-sm flex items-center justify-center shadow-md shrink-0">
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-extrabold text-brand-dark dark:text-secondary truncate">
            {user?.name || "Abrrar"}
          </span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onLogout}
          title="Logout"
          className="text-destructive hover:bg-destructive/10 rounded-xl"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
