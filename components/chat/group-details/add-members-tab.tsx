"use client";

import * as React from "react";
import { Search, Loader2, UserPlus, Check, Plus, X } from "lucide-react";
import { SearchedUser } from "@/types/conversation";

interface AddMembersTabProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSearching: boolean;
  selectedUsers: SearchedUser[];
  onToggleUser: (user: SearchedUser) => void;
  availableUsers: SearchedUser[];
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddMembersTab({
  searchQuery,
  onSearchChange,
  isSearching,
  selectedUsers,
  onToggleUser,
  availableUsers,
  isSubmitting,
  onSubmit,
}: AddMembersTabProps) {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 space-y-3">
      {/* Selected Pills */}
      {selectedUsers.length > 0 && (
        <div>
          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-brand-dark/70 dark:text-muted-foreground mb-1">
            Selected ({selectedUsers.length})
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                onClick={() => onToggleUser(u)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-extrabold cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span>{u.name}</span>
                <X className="h-3 w-3" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/40 dark:text-white/40" />
        <input
          type="text"
          placeholder="Search user to add to group..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white dark:bg-background text-xs font-extrabold text-brand-dark dark:text-foreground focus:outline-none"
        />
      </div>

      {/* Available User Results List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {isSearching && (
          <div className="p-3 text-center text-xs font-bold text-brand-dark/50 dark:text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Searching users...</span>
          </div>
        )}

        {!isSearching && searchQuery.trim() && availableUsers.length === 0 && (
          <div className="p-3 text-center text-xs font-medium text-brand-dark/50 dark:text-muted-foreground">
            No eligible users found for "{searchQuery}"
          </div>
        )}

        {availableUsers.map((u) => {
          const isSelected = selectedUsers.some((sel) => sel._id === u._id);
          return (
            <div
              key={u._id}
              onClick={() => onToggleUser(u)}
              className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer border transition-colors ${
                isSelected
                  ? "bg-brand-dark/10 dark:bg-white/10 border-brand-dark dark:border-secondary"
                  : "bg-white/40 dark:bg-background/40 border-transparent hover:bg-white dark:hover:bg-background"
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold truncate">{u.name}</span>
                <span className="text-[10px] text-brand-dark/60 dark:text-muted-foreground truncate">
                  {u.phone}
                </span>
              </div>
              <div
                className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isSelected
                    ? "bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark"
                    : "border border-brand-dark/30 dark:border-white/30"
                }`}
              >
                {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={selectedUsers.length === 0 || isSubmitting}
        className="w-full py-2.5 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform disabled:opacity-40 cursor-pointer shadow-md shrink-0"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            <span>Add {selectedUsers.length} Selected Members</span>
          </>
        )}
      </button>
    </form>
  );
}
