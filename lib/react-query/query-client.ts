import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute stale time for caching
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
