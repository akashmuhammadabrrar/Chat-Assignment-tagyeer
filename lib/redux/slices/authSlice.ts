import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/auth";
import { getAuthToken, removeAuthToken, setAuthToken } from "@/lib/utils/auth-token";

const initialState: AuthState = {
  user: null,
  token: getAuthToken(),
  isAuthenticated: !!getAuthToken(),
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      setAuthToken(action.payload.token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      removeAuthToken();
    },
  },
});

export const {
  setCredentials,
  setUser,
  setAuthLoading,
  setAuthError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
