import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const utils = trpc.useUtils();

  const loginMutation = trpc.platform.login.useMutation({
    onSuccess: async (data) => {
      // Invalidate the me query so ProtectedRoute re-fetches with the new session cookie
      await utils.platform.me.invalidate();
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "teacher") navigate("/teacher");
      else navigate("/student");
    },
    onError: (err) => {
      setError(err.message || "Invalid username or password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.20_0.06_240)] via-[oklch(0.28_0.08_240)] to-[oklch(0.35_0.10_240)] flex flex-col items-center justify-center p-4">
      {/* Header Banner */}
      <div className="w-full max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Grade 8 Mock Assessment Platform
        </h1>
        <p className="text-white/70 text-sm mt-1">Mathematics &amp; Science · International Standards</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-[oklch(0.42_0.14_240)] px-8 py-5">
          <h2 className="text-white font-semibold text-lg">Sign In to Your Account</h2>
          <p className="text-white/70 text-sm mt-0.5">Enter your credentials to continue</p>
        </div>

        {/* Card Body */}
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-[oklch(0.42_0.14_240)] transition-colors bg-gray-50 focus:bg-white"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={password.length > 0 ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-[oklch(0.42_0.14_240)] transition-colors bg-gray-50 focus:bg-white pr-12"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[oklch(0.42_0.14_240)] hover:bg-[oklch(0.38_0.14_240)] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2 active:scale-[0.97]"
          >
            {loginMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-6">
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium">Demo Credentials</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center text-gray-500">
              <button
                type="button"
                onClick={() => { setUsername("admin"); setPassword("Admin@2024"); setError(""); }}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2 transition-colors cursor-pointer border border-gray-200"
              >
                <div className="font-semibold text-gray-700 text-sm">Admin</div>
                <div className="text-gray-500">admin</div>
              </button>
              <button
                type="button"
                onClick={() => { setUsername("teacher.ali"); setPassword("Teacher@2024"); setError(""); }}
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-2 transition-colors cursor-pointer border border-blue-200"
              >
                <div className="font-semibold text-blue-700 text-sm">Teacher</div>
                <div className="text-blue-600">teacher.ali</div>
              </button>
              <button
                type="button"
                onClick={() => { setUsername("STD001"); setPassword("Std001@2024"); setError(""); }}
                className="bg-green-50 hover:bg-green-100 rounded-lg p-2 transition-colors cursor-pointer border border-green-200"
              >
                <div className="font-semibold text-green-700 text-sm">Student</div>
                <div className="text-green-600">STD001</div>
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              Click a role above to auto-fill credentials
            </p>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-white/40 text-xs mt-6 text-center">
        Grade 8 Mock Assessment Platform · For Educational Use Only
      </p>
    </div>
  );
}
