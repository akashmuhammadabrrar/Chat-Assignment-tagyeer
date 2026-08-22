"use client";

import * as React from "react";
import { Search } from "lucide-react";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SidebarSearch({
  value,
  onChange,
  placeholder = "Search conversations or users...",
}: SidebarSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/50 dark:text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white/70 dark:bg-background pl-10 pr-4 py-2.5 text-xs font-extrabold text-brand-dark dark:text-foreground placeholder:text-brand-dark/40 dark:placeholder:text-muted-foreground focus:outline-none focus:border-brand-dark dark:focus:border-secondary transition-colors"
      />
    </div>
  );
}
