"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";

export function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
      <div className="h-14 w-14 rounded-3xl bg-brand-dark/8 dark:bg-white/8 flex items-center justify-center">
        <MessageSquare className="h-7 w-7 text-brand-dark/30 dark:text-white/30" />
      </div>
      <div>
        <p className="text-xs font-extrabold text-brand-dark/60 dark:text-muted-foreground">
          No conversations yet
        </p>
        <p className="text-[11px] font-medium text-brand-dark/40 dark:text-muted-foreground/70 mt-0.5">
          Search a user above to start chatting
        </p>
      </div>
    </div>
  );
}
