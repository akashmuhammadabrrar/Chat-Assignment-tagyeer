"use client";

import * as React from "react";
import { Check, CheckCheck, AlertCircle, Loader2 } from "lucide-react";
import { Message, MessageSender } from "@/types/conversation";

interface MessageItemProps {
  msg: Message;
  currentUserId?: string;
  currentUserName?: string;
}

export function MessageItem({ msg, currentUserId, currentUserName }: MessageItemProps) {
  const senderId = typeof msg.sender === "object" ? (msg.sender as MessageSender)?._id : msg.sender;
  const isMe =
    Boolean(currentUserId && senderId === currentUserId) ||
    senderId === "You" ||
    (typeof msg.sender === "string" && msg.sender === currentUserId);

  const senderName =
    typeof msg.sender === "object"
      ? (msg.sender as MessageSender)?.name ?? "User"
      : isMe
      ? currentUserName || "You"
      : "User";

  const myInitial = (currentUserName || "You").trim().charAt(0).toUpperCase();
  const senderInitial = (senderName || "U").trim().charAt(0).toUpperCase();

  const timeFormatted = new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <div className="h-9 w-9 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black flex items-center justify-center shrink-0 shadow-md">
          {senderInitial}
        </div>
      )}

      <div className={`max-w-xs sm:max-w-md ${isMe ? "items-end text-right" : "items-start text-left"}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-extrabold text-brand-dark dark:text-secondary">
            {isMe ? "You" : senderName}
          </span>
          <span className="text-[10px] font-bold text-brand-muted dark:text-muted-foreground flex items-center gap-1">
            {timeFormatted}
            {isMe && (
              msg.status === "failed" ? (
                <span className="flex items-center gap-0.5 text-destructive font-black text-[10px] ml-1 shrink-0" title="Not sent. Failed to deliver.">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive inline shrink-0" /> Not sent
                </span>
              ) : msg.status === "sending" ? (
                <span title="Sending...">
                  <Loader2 className="h-3 w-3 animate-spin text-brand-muted/60 dark:text-muted-foreground/60 inline shrink-0 ml-0.5" />
                </span>
              ) : msg.status === "sent" ? (
                <span title="Sent">
                  <Check className="h-3.5 w-3.5 text-brand-muted/70 dark:text-muted-foreground/70 inline shrink-0 ml-0.5" />
                </span>
              ) : (
                <span title="Seen">
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 inline shrink-0 ml-0.5" />
                </span>
              )
            )}
          </span>
        </div>
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold shadow-md break-words ${
            isMe
              ? "bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark rounded-tr-none"
              : "bg-white dark:bg-card text-brand-dark dark:text-foreground border border-brand-dark/15 dark:border-white/10 rounded-tl-none"
          }`}
        >
          {msg.text}
        </div>
      </div>

      {isMe && (
        <div className="h-9 w-9 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black flex items-center justify-center shrink-0 shadow-md">
          {myInitial}
        </div>
      )}
    </div>
  );
}
