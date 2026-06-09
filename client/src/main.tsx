import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent infinite retry loops on auth errors
      retry: false,
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown, queryKey?: readonly unknown[]) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  // Use error.data?.code (tRPC standard) instead of message comparison
  const isUnauthorized =
    (error.data as any)?.code === "UNAUTHORIZED" ||
    error.message === "Not authenticated" ||
    error.message === "Invalid session" ||
    error.message === "User not found" ||
    error.message === "Please login (10001)";

  if (!isUnauthorized) return;

  // Don't redirect for auth-check queries (platform.me, platform.login, etc.)
  // These are expected to return unauthorized when not logged in
  const keyStr = JSON.stringify(queryKey ?? []);
  const isAuthQuery =
    keyStr.includes("platform.me") ||
    keyStr.includes("platform.login") ||
    keyStr.includes("auth.me");
  if (isAuthQuery) return;

  // Only redirect if we're not already on the login page
  if (window.location.pathname === "/login") return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    const queryKey = event.query.queryKey;
    redirectToLoginIfUnauthorized(error, queryKey);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
