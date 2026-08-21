import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import chatReducer from "./slices/chatSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
