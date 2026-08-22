"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";

interface RenameGroupFormProps {
  currentName: string;
  isRenaming: boolean;
  onRename: (name: string) => Promise<unknown>;
}

/**
 * Inline edit form for renaming a group.
 * Shows the group name with a pencil icon.
 * On click, swaps to an input with confirm/cancel buttons.
 */
export function RenameGroupForm({
  currentName,
  isRenaming,
  onRename,
}: RenameGroupFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentName);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external name changes (e.g. from socket updates)
  useEffect(() => {
    setValue(currentName);
  }, [currentName]);

  // Auto-focus input when edit mode opens
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleOpen = () => {
    setValue(currentName);
    setLocalError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setValue(currentName);
    setLocalError(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setLocalError("Group name cannot be empty.");
      return;
    }
    if (trimmed === currentName) {
      setIsEditing(false);
      return;
    }
    try {
      await onRename(trimmed);
      setIsEditing(false);
    } catch (err) {
      setLocalError((err as Error)?.message ?? "Failed to rename group.");
    }
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 group cursor-pointer"
        title="Rename group"
        aria-label="Rename group"
      >
        <h3 className="text-base sm:text-lg font-black truncate max-w-[200px]">
          {currentName}
        </h3>
        <Pencil className="h-3.5 w-3.5 text-brand-dark/40 dark:text-white/30 group-hover:text-brand-dark dark:group-hover:text-white transition-colors shrink-0" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setLocalError(null);
          }}
          disabled={isRenaming}
          maxLength={60}
          className="flex-1 min-w-0 text-sm font-black bg-white/70 dark:bg-background/70 border border-brand-dark/20 dark:border-white/20 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-dark/30 dark:focus:ring-white/20 disabled:opacity-60"
          aria-label="New group name"
        />
        <button
          type="submit"
          disabled={isRenaming || !value.trim()}
          className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50 shrink-0"
          title="Save"
        >
          {isRenaming ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isRenaming}
          className="h-7 w-7 rounded-lg bg-brand-dark/10 dark:bg-white/10 flex items-center justify-center hover:bg-destructive hover:text-white transition-colors disabled:opacity-50 shrink-0"
          title="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {localError && (
        <p className="text-[11px] font-bold text-destructive px-1">{localError}</p>
      )}
    </form>
  );
}
