"use client";

import * as React from "react";
import { useRef, useCallback, useEffect } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { Message } from "@/types/conversation";
import { MessageItem } from "./message-item";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  hasActiveConversation: boolean;
  currentUserId?: string;
  currentUserName?: string;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onScroll: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  endRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({
  messages,
  isLoading,
  error,
  hasActiveConversation,
  currentUserId,
  currentUserName,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onScroll,
  containerRef,
  endRef,
}: MessageListProps) {
  const prevScrollHeightRef = useRef(0);

  const handleLoadMore = useCallback(() => {
    const container = containerRef.current;
    if (container) prevScrollHeightRef.current = container.scrollHeight;
    onLoadMore();
  }, [onLoadMore, containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prevScrollHeightRef.current === 0) return;
    const delta = container.scrollHeight - prevScrollHeightRef.current;
    if (delta > 0) container.scrollTop += delta;
    prevScrollHeightRef.current = 0;
  }, [messages.length, containerRef]);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 chat-pattern-bg relative"
    >
      {!hasActiveConversation && (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
          <div className="h-16 w-16 rounded-3xl bg-brand-dark/10 dark:bg-white/10 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-brand-dark/40 dark:text-white/40" />
          </div>
          <h3 className="text-sm font-extrabold text-brand-dark dark:text-foreground">
            No Active Conversation Selected
          </h3>
          <p className="text-xs text-brand-dark/60 dark:text-muted-foreground max-w-sm">
            Search for a user in the sidebar to start a new chat or select an existing conversation.
          </p>
        </div>
      )}

      {hasActiveConversation && isLoading && (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-brand-dark dark:text-secondary" />
          <span className="text-xs font-extrabold text-brand-dark/60 dark:text-muted-foreground">
            Loading message history...
          </span>
        </div>
      )}

      {hasActiveConversation && !isLoading && error && (
        <div className="h-full flex flex-col items-center justify-center gap-2 text-destructive">
          <p className="text-xs font-bold">{error}</p>
        </div>
      )}

      {hasActiveConversation && !isLoading && !error && (
        <>
          {hasMore && (
            <div className="flex justify-center pt-1 pb-3">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-dark/10 dark:bg-white/10 text-brand-dark dark:text-foreground text-xs font-black hover:bg-brand-dark/20 dark:hover:bg-white/20 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading older messages...
                  </>
                ) : (
                  "↑ Load earlier messages"
                )}
              </button>
            </div>
          )}

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2">
              <p className="text-xs font-extrabold text-brand-dark/60 dark:text-muted-foreground">
                No messages yet. Say hello! 👋
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageItem
              key={msg._id || `${msg.createdAt}-${msg.text}`}
              msg={msg}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
            />
          ))}
        </>
      )}

      <div ref={endRef} />
    </div>
  );
}
