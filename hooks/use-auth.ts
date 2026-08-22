"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginApi, getMeApi } from "@/lib/api/auth";
import { LoginPayload, AuthResponse } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCredentials, setUser, logout, setAuthError } from "@/lib/redux/slices/authSlice";
import { getAuthToken } from "@/lib/utils/auth-token";

export function useAuth() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);

  // TanStack Mutation for Login / Registration
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data: AuthResponse) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      queryClient.setQueryData(["auth", "me"], data.user);
      toast.success(`Welcome back, ${data.user.name}! Successfully logged in.`);
      router.push("/chat");
    },
    onError: (err: any) => {
      const errorMessage = err?.message || "Login failed. Please check your details.";
      dispatch(setAuthError(errorMessage));
      toast.error(errorMessage);
    },
  });

  // TanStack Query for restoring user session on page load
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    enabled: !!getAuthToken() && !authState.user,
    staleTime: Infinity,
    retry: false,
  });

  // Safely sync session payload with Redux store inside useEffect (prevents setState in render warning)
  React.useEffect(() => {
    if (meQuery.data && !authState.user) {
      dispatch(setUser(meQuery.data));
    }
  }, [meQuery.data, authState.user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    queryClient.clear();
    toast.info("Logged out of Gossip successfully.");
    router.push("/login");
  };

  return {
    user: authState.user || meQuery.data || null,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated || !!meQuery.data,
    isLoading: loginMutation.isPending || meQuery.isLoading,
    error: authState.error || (loginMutation.error as any)?.message || null,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: handleLogout,
  };
}
