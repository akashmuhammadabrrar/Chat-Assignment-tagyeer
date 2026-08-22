"use client";

import * as React from "react";
import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ChatSidebar } from "@/components/chat/sidebar/chat-sidebar";
import { ChatHeader } from "@/components/chat/header/chat-header";
import { MessageList } from "@/components/chat/messages/message-list";
import { MessageInput } from "@/components/chat/messages/message-input";
import { CreateGroupModal } from "@/components/chat/conversations/create-group-modal";
import { GroupDetailsModal } from "@/components/chat/group-details/group-details-modal";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectActiveConversation } from "@/lib/redux/slices/chatSlice";
import {
  useMessages,
  useSendMessage,
  useLoadMoreMessages,
} from "@/hooks/use-messages";
import { useSocket } from "@/hooks/use-socket";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [groupDetailsModalOpen, setGroupDetailsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);

  // Initialize Socket.io
  useSocket();

  const currentUser = useAppSelector((state) => state.auth.user);
  const activeConversation = useAppSelector(selectActiveConversation);
  const conversationId = activeConversation?._id ?? null;

  // Messages & pagination
  const { messages, isLoading, error, initialHasMore } = useMessages(conversationId);
  const { loadMore, hasMore, isLoadingMore, reset: resetPagination } =
    useLoadMoreMessages(conversationId, initialHasMore);
  const { sendMessage, isSending } = useSendMessage();

  // Scroll refs
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isScrolledUpRef = useRef(false);

  // Reset pagination when switching conversations
  useEffect(() => {
    resetPagination();
  }, [conversationId, resetPagination]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottomButton(false);
    isScrolledUpRef.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);
    const scrolledUp = distanceFromBottom > 120;
    isScrolledUpRef.current = scrolledUp;
    setShowScrollBottomButton(scrolledUp);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    const lastSenderId =
      typeof lastMsg?.sender === "object" ? lastMsg.sender?._id : lastMsg?.sender;
    const isMe =
      Boolean(currentUser?._id && lastSenderId === currentUser._id) ||
      lastSenderId === "You";
    if (!isScrolledUpRef.current || isMe) {
      scrollToBottom();
    }
  }, [messages, currentUser?._id, scrollToBottom]);

  // Header display info
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
    }

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
  }, [activeConversation]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!activeConversation?._id || !messageText.trim() || isSending) return;
      const textToSend = messageText.trim();
      setMessageText("");
      try {
        await sendMessage(activeConversation._id, textToSend);
        scrollToBottom();
      } catch {
        // error handled in mutation
      }
    },
    [activeConversation, messageText, isSending, sendMessage, scrollToBottom]
  );

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-[#FFEED6] dark:bg-[#0D100B] text-brand-dark dark:text-foreground overflow-hidden">
        {/* Modals */}
        <CreateGroupModal
          isOpen={createGroupModalOpen}
          onClose={() => setCreateGroupModalOpen(false)}
        />
        <GroupDetailsModal
          isOpen={groupDetailsModalOpen}
          onClose={() => setGroupDetailsModalOpen(false)}
          conversation={activeConversation}
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
          {/* Header */}
          <ChatHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            headerInfo={headerInfo}
            isGroup={activeConversation?.type === "group"}
            onOpenGroupDetails={() => setGroupDetailsModalOpen(true)}
          />

          {/* Message List */}
          <MessageList
            messages={messages}
            isLoading={isLoading}
            error={error}
            hasActiveConversation={!!activeConversation}
            currentUserId={currentUser?._id}
            currentUserName={currentUser?.name}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
            onScroll={handleScroll}
            containerRef={messagesContainerRef}
            endRef={messagesEndRef}
          />

          {/* Floating Scroll-to-Bottom */}
          <AnimatePresence>
            {showScrollBottomButton && (
              <motion.button
                type="button"
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

          {/* Message Input */}
          <MessageInput
            disabled={!activeConversation}
            placeholder={
              activeConversation
                ? `Write a message to ${headerInfo?.title || "chat"}...`
                : "Select a conversation to start chatting..."
            }
            value={messageText}
            onChange={setMessageText}
            onSubmit={handleSendMessage}
            isSending={isSending}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
