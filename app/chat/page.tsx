"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  ShieldCheck,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  // Single state controls sidebar for ALL screen sizes
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [messageText, setMessageText] = React.useState("");

  const [messages, setMessages] = React.useState([
    {
      id: "1",
      sender: "System",
      time: "10:00 AM",
      content: "Welcome to Gossip Chit Chat workspace!",
      isMe: false,
    },
    {
      id: "2",
      sender: "Sarah Jenkins",
      time: "10:05 AM",
      content: "Hey everyone! The design tokens and WebSockets are connected.",
      isMe: false,
    },
    {
      id: "3",
      sender: "You",
      time: "10:08 AM",
      content: "Awesome! The sidebar and responsive drawer are looking crystal clear.",
      isMe: true,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "You",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: messageText.trim(),
        isMe: true,
      },
    ]);
    setMessageText("");
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-brand-primary/20 dark:bg-[#0D100B] text-brand-dark dark:text-foreground overflow-hidden">

        {/* ── Desktop Sidebar: slides in/out inline ── */}
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
              <ChatSidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Mobile Sidebar: full-screen drawer overlay ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              />

              {/* Drawer */}
              <motion.aside
                key="mobile-drawer"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed top-0 left-0 bottom-0 z-50 md:hidden"
              >
                <ChatSidebar />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main Chat Area ── */}
        <main className="flex-1 flex flex-col justify-between bg-white/70 dark:bg-[#12140D] min-w-0">
          {/* Top Chat Header */}
          <header className="h-16 border-b border-brand-dark/15 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between bg-brand-secondary/40 dark:bg-card shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Unified Sidebar Toggle — works on all screen sizes */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="text-brand-dark dark:text-secondary hover:bg-black/10 dark:hover:bg-white/10 shrink-0 transition-colors"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <PanelLeftOpen className="h-5 w-5" />
                )}
              </Button>

              {/* Active Conversation Identity */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark font-extrabold text-sm flex items-center justify-center shadow-md">
                    ET
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-card" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm font-extrabold text-brand-dark dark:text-secondary truncate flex items-center gap-1.5">
                    <span>Engineering Team</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </h3>
                  <span className="text-[11px] font-bold text-brand-muted dark:text-muted-foreground truncate">
                    18 Members • 5 Online
                  </span>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </header>

          {/* Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                {!msg.isMe && (
                  <div className="h-9 w-9 rounded-2xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark text-xs font-black flex items-center justify-center shrink-0 shadow-md">
                    {msg.sender.charAt(0)}
                  </div>
                )}

                <div className={`max-w-xs sm:max-w-md ${msg.isMe ? "items-end text-right" : "items-start text-left"}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-extrabold text-brand-dark dark:text-secondary">{msg.sender}</span>
                    <span className="text-[10px] font-bold text-brand-muted dark:text-muted-foreground">{msg.time}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold shadow-md ${
                      msg.isMe
                        ? "bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark rounded-tr-none"
                        : "bg-white dark:bg-card text-brand-dark dark:text-foreground border border-brand-dark/15 dark:border-white/10 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {msg.isMe && (
                  <div className="h-9 w-9 rounded-2xl bg-secondary text-brand-dark dark:bg-brand-dark dark:text-secondary text-xs font-black flex items-center justify-center shrink-0 shadow-md">
                    Y
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-brand-dark/15 dark:border-white/10 bg-brand-secondary/30 dark:bg-card shrink-0">
            <div className="flex items-center gap-2 rounded-2xl border-2 border-brand-dark/15 dark:border-white/10 bg-white dark:bg-background px-4 py-2.5 shadow-lg">
              <Button type="button" variant="ghost" size="icon-sm" className="text-brand-dark/50 dark:text-muted-foreground rounded-xl">
                <Paperclip className="h-4 w-4" />
              </Button>
              <input
                type="text"
                placeholder="Write a message to #Engineering Team..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 bg-transparent text-xs sm:text-sm font-extrabold text-brand-dark dark:text-foreground focus:outline-none placeholder:text-brand-dark/40 dark:placeholder:text-muted-foreground"
              />
              <Button type="button" variant="ghost" size="icon-sm" className="text-brand-dark/50 dark:text-muted-foreground rounded-xl">
                <Smile className="h-4 w-4" />
              </Button>
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="h-8 w-8 rounded-xl bg-brand-dark text-secondary dark:bg-secondary dark:text-brand-dark flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}
