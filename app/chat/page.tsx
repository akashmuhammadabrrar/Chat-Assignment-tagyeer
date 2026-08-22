"use client";

import * as React from "react";
import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  ShieldCheck,
  PanelLeftOpen,
  MessageSquare,
  Loader2,
  Check,
  CheckCheck,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { CreateGroupModal } from "@/components/chat/create-group-modal";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectActiveConversation } from "@/lib/redux/slices/chatSlice";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { useSocket } from "@/hooks/use-socket";
import { Message } from "@/types/conversation";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);

  // Initialize Socket.io connection for real-time messaging
  useSocket();

  // Active user & Active conversation from Redux
  const currentUser = useAppSelector((state) => state.auth.user);
  const activeConversation = useAppSelector(selectActiveConversation);

  // Live messages from API / React Query
  const { messages, isLoading, error } = useMessages(activeConversation?._id ?? null);
  const { sendMessage, isSending } = useSendMessage();

  // Scroll Refs
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isScrolledUpRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottomButton(false);
    isScrolledUpRef.current = false;
  }, []);

  // Smart Scroll Guard Handler
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);

    // If user is more than 120px away from bottom, mark as scrolled up
    const scrolledUp = distanceFromBottom > 120;
    isScrolledUpRef.current = scrolledUp;
    setShowScrollBottomButton(scrolledUp);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    const lastSenderId = typeof lastMsg?.sender === "object" ? lastMsg.sender?._id : lastMsg?.sender;
    const isMe = Boolean(currentUser?._id && lastSenderId === currentUser._id) || lastSenderId === "You";

    // Auto-scroll if user is near bottom OR if the last message was sent by me
    if (!isScrolledUpRef.current || isMe) {
      scrollToBottom();
    }
  }, [messages, currentUser?._id, scrollToBottom]);

  // Derived Header Identity — O(1) pass
  const headerInfo = useMemo(() => {
    if (!activeConversation) return null;

    if (activeConversation.type === "direct") {
      const p = activeConversation.participant;
      const initials = (p?.name ?? "User")
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return {
        title: p?.name ?? "Direct Chat",
        subtitle: p?.phone ? `Phone: ${p.phone}` : "1-on-1 Direct Conversation",
        initials,
        isGroup: false,
      };
    } else {
      const initials = (activeConversation.name ?? "Group")
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      const memberCount = activeConversation.participants?.length ?? 0;
      return {
        title: activeConversation.name ?? "Group Chat",
        subtitle: `${memberCount} Member${memberCount !== 1 ? "s" : ""}`,
        initials,
        isGroup: true,
      };
    }
  }, [activeConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation?._id || !messageText.trim() || isSending) return;

    const textToSend = messageText.trim();
    setMessageText("");

    try {
      await sendMessage(activeConversation._id, textToSend);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-[#FFEED6] dark:bg-[#0D100B] text-brand-dark dark:text-foreground overflow-hidden">
        {/* ── Group Creation Modal ── */}
        <CreateGroupModal
          isOpen={createGroupModalOpen}
          onClose={() => setCreateGroupModalOpen(false)}
        />

        {/* ── Desktop Sidebar ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="desktop-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="hidden md:block h-full shrink-0 overflow-hidden"
            >
              <ChatSidebar
                onToggleSidebar={handleToggleSidebar}
                onNewChatClick={() => setCreateGroupModalOpen(true)}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Mobile Sidebar Drawer ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              />
              <motion.aside
                key="mobile-drawer"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed top-0 left-0 bottom-0 z-50 md:hidden"
              >
                <ChatSidebar
                  onToggleSidebar={handleToggleSidebar}
                  onNewChatClick={() => setCreateGroupModalOpen(true)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main Chat Area ── */}
        <main className="flex-1 flex flex-col justify-between bg-[#FFEED6] dark:bg-[#12140D] min-w-0 relative">
          {/* Top Chat Header */}
          <header className="h-16 border-b border-brand-dark/15 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between bg-[#FFEED6] dark:bg-card shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleSidebar}
                  className="text-brand-dark dark:text-secondary hover:bg-black/10 dark:hover:bg-white/10 shrink-0 transition-colors rounded-xl"
                  aria-label="Open sidebar"
                  title="Open sidebar"
                >
                  <PanelLeftOpen className="h-5 w-5" />
                </Button>
              )}

              {headerInfo ? (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark font-extrabold text-sm flex items-center justify-center shadow-md">
                      {headerInfo.initials}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-card" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-extrabold text-brand-dark dark:text-secondary truncate flex items-center gap-1.5">
                      <span>{headerInfo.title}</span>
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </h3>
                    <span className="text-[11px] font-bold text-brand-muted dark:text-muted-foreground truncate">
                      {headerInfo.subtitle}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-extrabold text-brand-dark/60 dark:text-muted-foreground">
                  <span>Select a conversation</span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </header>

          {/* Messages Body */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 chat-pattern-bg relative"
          >
            {!activeConversation ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="h-16 w-16 rounded-3xl bg-brand-dark/10 dark:bg-white/10 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-brand-dark/40 dark:text-white/40" />
                </div>
                <h3 className="text-sm font-extrabold text-brand-dark dark:text-foreground">
                  No Active Conversation Selected
                </h3>
                <p className="text-xs text-brand-dark/60 dark:text-muted-foreground max-w-sm">
                  Search for a user in the sidebar to start a new 1-on-1 chat or select an existing conversation.
                </p>
              </div>
            ) : isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-7 w-7 animate-spin text-brand-dark dark:text-secondary" />
                <span className="text-xs font-extrabold text-brand-dark/60 dark:text-muted-foreground">
                  Loading message history...
                </span>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-destructive">
                <p className="text-xs font-bold">{error}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2">
                <p className="text-xs font-extrabold text-brand-dark/60 dark:text-muted-foreground">
                  No messages yet. Say hello! 👋
                </p>
              </div>
            ) : (
              messages.map((msg: Message) => {
                const senderId =
                  typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
                const isMe =
                  Boolean(currentUser?._id && senderId === currentUser._id) ||
                  senderId === "You" ||
                  (typeof msg.sender === "string" && msg.sender === currentUser?._id);

                const senderName =
                  typeof msg.sender === "object"
                    ? msg.sender?.name ?? "User"
                    : isMe
                    ? currentUser?.name || "You"
                    : "User";

                const myInitial = (currentUser?.name || "You").trim().charAt(0).toUpperCase();
                const senderInitial = (senderName || "U").trim().charAt(0).toUpperCase();

                const timeFormatted = new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={msg._id || `${msg.createdAt}-${msg.text}`}
                    className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                  >
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
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Floating Scroll-to-Bottom Button */}
          <AnimatePresence>
            {showScrollBottomButton && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={scrollToBottom}
                className="absolute bottom-20 right-8 z-30 px-3.5 py-2 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black shadow-xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform border border-brand-dark/20 dark:border-white/20"
              >
                <ChevronDown className="h-4 w-4" />
                <span>Scroll to latest messages</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
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
                disabled={!activeConversation}
                placeholder={
                  activeConversation
                    ? `Write a message to ${headerInfo?.title || "chat"}...`
                    : "Select a conversation to start chatting..."
                }
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
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
                disabled={!messageText.trim() || !activeConversation || isSending}
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
        </main>
      </div>
    </ProtectedRoute>
  );
}
