import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

export function usePlatformAuth() {
  // Use Infinity staleTime so the query result is shared across all components
  // and never re-fetches on mount — preventing multiple simultaneous fetches
  // that cause isLoading to stay true in child components.
  const { data: user, isLoading, refetch } = trpc.platform.me.useQuery(undefined, {
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.platform.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    logout,
    refetch,
  };
}
