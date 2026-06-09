import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

export function usePlatformAuth() {
  const { data: user, isLoading, refetch } = trpc.platform.me.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logoutMutation = trpc.platform.logout.useMutation({
    onSuccess: () => {
      refetch();
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
