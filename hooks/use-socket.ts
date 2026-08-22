"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { SOCKET_URL } from "@/lib/api/config";
import { getAuthToken } from "@/lib/utils/auth-token";
import { useAppDispatch } from "@/lib/redux/hooks";
import { upsertConversation } from "@/lib/redux/slices/chatSlice";
import { Message, Conversation } from "@/types/conversation";

export function useSocket() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("message:new", (data: any) => {
      const rawMsg = data?.message ?? data;
      if (!rawMsg) return;

      const message: Message = {
        _id: rawMsg._id || Date.now().toString(),
        conversationId: rawMsg.conversationId || rawMsg.conversation,
        sender: rawMsg.sender,
        text: rawMsg.text || rawMsg.content || "",
        createdAt: rawMsg.createdAt || new Date().toISOString(),
      };

      if (message.conversationId) {
        queryClient.setQueryData<Message[]>(["messages", message.conversationId], (old) => {
          const list = old ? [...old] : [];
          const existingIndex = list.findIndex(
            (m) =>
              m._id === message._id ||
              (m.text === message.text &&
                Math.abs(new Date(m.createdAt || 0).getTime() - new Date(message.createdAt).getTime()) < 3000)
          );

          if (existingIndex >= 0) {
            list[existingIndex] = message;
          } else {
            list.push(message);
          }

          return list.sort(
            (a, b) => new Date(a.createdAt || 0).getTime() - new Date(message.createdAt).getTime()
          );
        });

        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    });

    socket.on("conversation:updated", (data: any) => {
      const conversation: Conversation = data?.conversation ?? data;
      if (conversation && conversation._id) {
        dispatch(upsertConversation(conversation));
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient, dispatch]);

  return socketRef;
}
