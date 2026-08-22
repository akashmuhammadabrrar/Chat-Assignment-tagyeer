"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setUser, logout } from "@/lib/redux/slices/authSlice";
import { getMeApi } from "@/lib/api/auth";
import { getAuthToken } from "@/lib/utils/auth-token";

/**
 * Silently rehydrates auth.user on every page load.
 *
 * On a hard refresh the Redux store resets to its initial state:
 *   - isAuthenticated = !!token  (true if localStorage has a token)
 *   - user = null                (never persisted across reloads)
 *
 * This component calls GET /auth/me once on mount when a token exists,
 * populating auth.user so the rest of the app can read it synchronously.
 * If the token is expired or invalid the server returns 401 → we log out.
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    const token = getAuthToken();

    // Nothing to do: no token stored, or user already hydrated
    if (!token || user) return;

    getMeApi()
      .then((me) => dispatch(setUser(me)))
      .catch(() => {
        // Token is stale / invalid — clear it so the user is sent to login
        dispatch(logout());
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // intentionally empty — we only want this to run once on mount

  return null;
}
