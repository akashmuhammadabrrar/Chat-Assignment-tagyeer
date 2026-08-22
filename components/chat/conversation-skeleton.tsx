"use client";

import * as React from "react";

export function ConversationSkeleton() {
  return (
    <div className="p-3 rounded-2xl flex items-center gap-3 animate-pulse">
      <div className="h-11 w-11 rounded-2xl bg-brand-dark/10 dark:bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-28 rounded-full bg-brand-dark/10 dark:bg-white/10" />
          <div className="h-3 w-10 rounded-full bg-brand-dark/8 dark:bg-white/8" />
        </div>
        <div className="h-2.5 w-40 rounded-full bg-brand-dark/8 dark:bg-white/8" />
      </div>
    </div>
  );
}
