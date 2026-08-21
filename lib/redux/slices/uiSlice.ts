import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  activeChannelId: string;
}

const initialState: UIState = {
  sidebarOpen: true,
  activeModal: null,
  activeChannelId: "general",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
    setActiveChannelId: (state, action: PayloadAction<string>) => {
      state.activeChannelId = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setActiveModal, setActiveChannelId } = uiSlice.actions;

export default uiSlice.reducer;
