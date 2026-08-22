"use client";

import * as React from "react";
import { PanelLeftOpen, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderInfo {
  title: string;
  subtitle: string;
  initials: string;
  isGroup: boolean;
}

interface ChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  headerInfo: HeaderInfo | null;
  isGroup: boolean;
  onOpenGroupDetails: () => void;
}

export function ChatHeader({
  sidebarOpen,
  onToggleSidebar,
  headerInfo,
  isGroup,
  onOpenGroupDetails,
}: ChatHeaderProps) {
  return (
    <header className="h-16 border-b border-brand-dark/15 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between bg-[#FFEED6] dark:bg-card shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-brand-dark dark:text-secondary hover:bg-black/10 dark:hover:bg-white/10 shrink-0 transition-colors rounded-xl"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        )}

        {headerInfo ? (
          <div
            onClick={() => {
              if (isGroup) onOpenGroupDetails();
            }}
            className={`flex items-center gap-3 min-w-0 ${
              isGroup ? "cursor-pointer group" : ""
            }`}
          >
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark font-extrabold text-sm flex items-center justify-center shadow-md">
                {headerInfo.initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-card" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-extrabold text-brand-dark dark:text-secondary truncate flex items-center gap-1.5 group-hover:underline">
                <span>{headerInfo.title}</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </h3>
              <span className="text-[11px] font-bold text-brand-muted dark:text-muted-foreground truncate">
                {headerInfo.subtitle}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-extrabold text-brand-dark/60 dark:text-muted-foreground">
            <span>Select a conversation</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isGroup && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenGroupDetails}
            className="text-brand-dark dark:text-secondary hover:bg-black/10 dark:hover:bg-white/10 rounded-xl"
            aria-label="Group Details & Members"
            title="Group Details & Members"
          >
            <Users className="h-5 w-5" />
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
