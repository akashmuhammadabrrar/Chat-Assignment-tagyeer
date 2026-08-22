"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { searchUsers } from "@/lib/api/users";

export function useUserSearch(query: string) {
  const debouncedQuery = useDebounce(query, 350);

  const result = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 1,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const hasQuery = debouncedQuery.trim().length >= 1;
  const users = result.data ?? [];
  const isSearching = result.isFetching;
  const searchError = result.error
    ? (result.error as any)?.message ?? "Search failed."
    : null;

  return useMemo(
    () => ({ users, isSearching, searchError, hasQuery }),
    [users, isSearching, searchError, hasQuery]
  );
}
