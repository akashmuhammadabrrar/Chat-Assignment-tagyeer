import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatRoom {
  id: string;
  name: string;
  isPrivate: boolean;
  unreadCount: number;
}

interface ChatState {
  isConnected: boolean;
  rooms: ChatRoom[];
  typingUsers: Record<string, string[]>; // channelId -> array of usernames typing
}

const initialState: ChatState = {
  isConnected: false,
  rooms: [
    { id: "general", name: "general", isPrivate: false, unreadCount: 0 },
    { id: "engineering", name: "engineering", isPrivate: false, unreadCount: 2 },
    { id: "design-system", name: "design-system", isPrivate: false, unreadCount: 0 },
  ],
  typingUsers: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updateRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.rooms = action.payload;
    },
    setTypingUsers: (
      state,
      action: PayloadAction<{ channelId: string; users: string[] }>
    ) => {
      state.typingUsers[action.payload.channelId] = action.payload.users;
    },
  },
});

export const { setConnected, updateRooms, setTypingUsers } = chatSlice.actions;

export default chatSlice.reducer;
