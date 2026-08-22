"use client";

import * as React from "react";
import { UserMinus, Shield, Loader2 } from "lucide-react";
import { Participant } from "@/types/conversation";

interface GroupMemberItemProps {
  member: Participant;
  isMe: boolean;
  /** Whether the current logged-in user is an admin */
  currentUserIsAdmin: boolean;
  /** Whether this specific member holds the admin role */
  memberIsAdmin: boolean;
  isRemoving: boolean;
  isPromoting: boolean;
  onRemove: (userId: string) => void;
  onPromote: (userId: string) => void;
}

export function GroupMemberItem({
  member,
  isMe,
  currentUserIsAdmin,
  memberIsAdmin,
  isRemoving,
  isPromoting,
  onRemove,
  onPromote,
}: GroupMemberItemProps) {
  const initials = (member.name || "Member")
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isBusy = isRemoving || isPromoting;

  return (
    <div className="p-3 rounded-2xl bg-white/60 dark:bg-background/60 border border-brand-dark/10 dark:border-white/5 flex items-center justify-between shadow-sm">
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black flex items-center justify-center shrink-0 shadow-md">
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-extrabold truncate flex items-center gap-1.5">
            <span>{isMe ? `${member.name} (You)` : member.name}</span>
            {memberIsAdmin && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black">
                ADMIN
              </span>
            )}
          </span>
          <span className="text-[11px] font-bold text-brand-muted dark:text-muted-foreground truncate">
            {member.phone}
          </span>
        </div>
      </div>

      {/* Right: Admin Actions */}
      {!isMe && currentUserIsAdmin && (
        <div className="flex items-center gap-2 shrink-0">
          {/* Promote to Admin — only shown if member is NOT already admin */}
          {!memberIsAdmin && (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onPromote(member._id)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-400 hover:text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              title="Make Admin"
            >
              {isPromoting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Make Admin</span>
                </>
              )}
            </button>
          )}

          {/* Remove Member */}
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onRemove(member._id)}
            className="px-2.5 py-1.5 rounded-xl bg-destructive/10 hover:bg-destructive text-destructive hover:text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Remove member"
          >
            {isRemoving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <UserMinus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
