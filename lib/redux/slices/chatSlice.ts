import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Conversation } from "@/types/conversation";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface ConversationsState {
  byId: Record<string, Conversation>;
  ids: string[];
  activeConversationId: string | null;
  status: FetchStatus;
  error: string | null;
}

const initialState: ConversationsState = {
  byId: {},
  ids: [],
  activeConversationId: null,
  status: "idle",
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      const payload = Array.isArray(action.payload) ? action.payload : [];
      const sorted = [...payload].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      state.byId = {};
      state.ids = [];
      for (const conv of sorted) {
        if (conv && conv._id) {
          state.byId[conv._id] = conv;
          state.ids.push(conv._id);
        }
      }

      if (!state.activeConversationId && sorted.length > 0) {
        state.activeConversationId = sorted[0]._id;
      }

      state.status = "success";
      state.error = null;
    },

    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },

    setConversationsStatus: (state, action: PayloadAction<FetchStatus>) => {
      state.status = action.payload;
    },

    setConversationsError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },

    upsertConversation: (state, action: PayloadAction<Conversation>) => {
      const conv = action.payload;
      if (!conv || !conv._id) return;
      const isNew = !state.byId[conv._id];
      state.byId[conv._id] = conv;
      if (isNew) {
        state.ids.unshift(conv._id);
      }
    },
  },
});

export const {
  setConversations,
  setActiveConversationId,
  setConversationsStatus,
  setConversationsError,
  upsertConversation,
} = chatSlice.actions;

export default chatSlice.reducer;

const selectChatState = (state: { chat: ConversationsState }) => state.chat;

export const selectOrderedConversations = createSelector(
  [selectChatState],
  (chatState) => chatState.ids.map((id) => chatState.byId[id]).filter(Boolean)
);

export const selectActiveConversationId = createSelector(
  [selectChatState],
  (chatState) => chatState.activeConversationId
);

export const selectActiveConversation = createSelector(
  [selectChatState],
  (chatState) =>
    chatState.activeConversationId ? chatState.byId[chatState.activeConversationId] ?? null : null
);

export const selectConversationsStatus = createSelector(
  [selectChatState],
  (chatState) => chatState.status
);

export const selectConversationsError = createSelector(
  [selectChatState],
  (chatState) => chatState.error
);
