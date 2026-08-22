"use client";

import * as React from "react";
import { Paperclip, Smile, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  disabled: boolean;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSending: boolean;
}

export function MessageInput({
  disabled,
  placeholder,
  value,
  onChange,
  onSubmit,
  isSending,
}: MessageInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-3 sm:p-4 border-t border-brand-dark/15 dark:border-white/10 bg-[#FFEED6] dark:bg-card shrink-0"
    >
      <div className="flex items-center gap-2 rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white dark:bg-background px-4 py-2.5 shadow-lg">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-brand-dark/50 dark:text-muted-foreground rounded-xl"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <input
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-xs sm:text-sm font-extrabold text-brand-dark dark:text-foreground focus:outline-none placeholder:text-brand-dark/40 dark:placeholder:text-muted-foreground disabled:opacity-50"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-brand-dark/50 dark:text-muted-foreground rounded-xl"
        >
          <Smile className="h-4 w-4" />
        </Button>
        <button
          type="submit"
          disabled={!value.trim() || disabled || isSending}
          className="h-8 w-8 rounded-xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-40 cursor-pointer shrink-0"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}
