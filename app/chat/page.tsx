"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquareCode,
  Hash,
  Send,
  Users,
  Search,
  Settings,
  Bell,
  LogOut,
  Plus,
  Volume2,
  Circle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setActiveChannelId } from "@/lib/redux/slices/uiSlice";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const activeChannelId = useAppSelector((state) => state.ui.activeChannelId);
  const rooms = useAppSelector((state) => state.chat.rooms);

  const [messageText, setMessageText] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      id: "1",
      sender: "System",
      time: "10:00 AM",
      content: "Welcome to Gossip real-time workspace!",
    },
    {
      id: "2",
      sender: "Sarah Jenkins",
      time: "10:05 AM",
      content: "Hey everyone! Socket engine is connected and ready for messaging.",
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
        content: messageText,
      },
    ]);
    setMessageText("");
  };

  return (
    <div className="h-screen flex bg-background dark:bg-[#0D100B] text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#E5E5DD] bg-[#F7F7F3] flex flex-col justify-between dark:border-[#363824] dark:bg-[#171A12]">
        {/* Workspace Title */}
        <div>
          <div className="p-4 border-b border-[#E5E5DD] dark:border-[#363824] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#31321D] text-white font-bold text-xs">
                G
              </div>
              <span className="font-extrabold text-base tracking-tight text-foreground">
                Gossip Workspace
              </span>
            </Link>
          </div>

          {/* Channels List */}
          <div className="p-3 space-y-4">
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:text-[#B7B8A9]">
                  Channels
                </span>
                <button className="text-muted-foreground hover:text-foreground">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-0.5">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => dispatch(setActiveChannelId(room.id))}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeChannelId === room.id
                        ? "bg-[#31321D] text-white dark:bg-[#222417] dark:text-[#F5F5EF]"
                        : "text-muted-foreground hover:bg-[#E5E5DD]/60 hover:text-foreground dark:text-[#B7B8A9] dark:hover:bg-[#222417]/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 opacity-70" />
                      <span>{room.name}</span>
                    </div>
                    {room.unreadCount > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                        {room.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Rooms */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:text-[#B7B8A9] px-2 mb-2 block">
                Voice Rooms
              </span>
              <div className="px-2 py-2 rounded-lg border border-[#E5E5DD] bg-white dark:border-[#363824] dark:bg-[#222417] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-foreground">Lounge</span>
                </div>
                <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-[#E5E5DD] dark:border-[#363824] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#31321D] text-white text-xs font-bold flex items-center justify-center">
              ME
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">My Account</p>
              <p className="text-[10px] text-emerald-500 font-medium">Online</p>
            </div>
          </div>
          <Link href="/">
            <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted">
              <LogOut className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Chat Main Content */}
      <main className="flex-1 flex flex-col justify-between bg-white dark:bg-[#0D100B]">
        {/* Top Header */}
        <header className="h-14 border-b border-[#E5E5DD] dark:border-[#363824] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-[#31321D] dark:text-[#B7B8A9]" />
            <span className="font-bold text-sm text-foreground capitalize">
              {activeChannelId}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#31321D] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {msg.sender.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{msg.sender}</span>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
                <p className="mt-1 text-xs text-foreground bg-[#F7F7F3] dark:bg-[#171A12] p-2.5 rounded-r-xl rounded-bl-xl border border-[#E5E5DD] dark:border-[#363824]">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E5DD] dark:border-[#363824]">
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E5DD] bg-[#F7F7F3] px-3 py-2 dark:border-[#363824] dark:bg-[#171A12]">
            <input
              type="text"
              placeholder={`Message #${activeChannelId}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" variant="brandPrimary" size="icon-xs">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
