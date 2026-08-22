"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ConversationsErrorProps {
  error: string;
  onRetry: () => void;
}

export function ConversationsError({ error, onRetry }: ConversationsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-3">
      <div className="h-12 w-12 rounded-3xl bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <p className="text-xs font-bold text-destructive">{error}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 text-[11px] font-extrabold text-brand-dark dark:text-secondary border border-brand-dark/20 dark:border-white/20 rounded-xl px-3 py-1.5 hover:bg-brand-dark/5 dark:hover:bg-white/5 transition-colors"
      >
        <RefreshCw className="h-3 w-3" />
        Retry
      </button>
    </div>
  );
}
