import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

export function usePlatformAuth() {
  const { data: user, isLoading, refetch } = trpc.platform.me.useQuery(undefined, {
    retry: false,
    // Keep staleTime short so that after login invalidation, the query re-fetches immediately
    staleTime: 30 * 1000,
    // Always re-fetch on mount so navigating to a protected route picks up the session
    refetchOnMount: true,
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
