import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { BrandStripe, SchoolLogo } from "@/components/SchoolBrand";

export default function Login() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const utils = trpc.useUtils();

  const loginMutation = trpc.platform.login.useMutation({
    onSuccess: (data) => {
      // Seed the authenticated user before changing routes. Awaiting a refetch here can
      // leave the form in its pending state if the concurrent platform.me request stalls.
      utils.platform.me.setData(undefined, data);
      void utils.platform.me.invalidate();
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
    <div className="min-h-screen bg-brand-soft flex">
      {/* Brand panel (desktop) */}
      <aside className="hidden lg:flex relative w-[44%] max-w-xl overflow-hidden bg-brand-navy text-white flex-col justify-between p-12">
        {/* Bands that echo the school crest */}
        <div aria-hidden="true" className="absolute -right-24 -top-24 w-[520px] h-[520px] rounded-full border-[56px] border-brand-red/90" />
        <div aria-hidden="true" className="absolute -right-10 top-40 w-[420px] h-[420px] rounded-full border-[40px] border-brand-blue/80" />
        <div aria-hidden="true" className="absolute -left-40 -bottom-40 w-[460px] h-[460px] rounded-full border-[48px] border-brand-red-dark/60" />
        <div className="relative">
          <div className="inline-flex items-center gap-3 bg-white rounded-xl px-3 py-2 shadow-lg">
            <img src="/school-crest.png" alt="" className="w-10 h-10 object-contain" />
            <span className="font-brand text-brand-navy text-sm uppercase tracking-wide leading-tight">American School of<br />Creative Science</span>
          </div>
        </div>
        <div className="relative">
          <p className="font-brand uppercase tracking-[0.2em] text-white/70 text-xs">Nad Al Sheba</p>
          <h1 className="font-brand text-4xl leading-tight mt-3">TIMSS Mock<br />Assessment</h1>
          <p className="text-white/80 mt-4 max-w-sm">Mathematics and Science practice for Grade 4 and Grade 8, set out the way the real TIMSS test is.</p>
          <div className="flex gap-2 mt-6">
            <span className="px-3 py-1 rounded-full bg-white/15 text-sm font-medium">Grade 4</span>
            <span className="px-3 py-1 rounded-full bg-white/15 text-sm font-medium">Grade 8</span>
          </div>
        </div>
        <p className="relative text-white/50 text-xs">For students and staff of the American School of Creative Science.</p>
      </aside>

      {/* Sign-in */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <SchoolLogo className="w-64 sm:w-72 mx-auto mb-6" />
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <BrandStripe className="h-1.5" />
            <div className="px-8 pt-7 pb-2">
              <h2 className="text-brand-navy font-bold text-xl">Sign in</h2>
              <p className="text-gray-500 text-sm mt-1">Use the username and password your teacher gave you.</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pt-5 pb-8 space-y-5">
              {error && (
                <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. STD001"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-brand-blue transition-colors bg-gray-50 focus:bg-white"
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-brand-blue transition-colors bg-gray-50 focus:bg-white pr-20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-brand-blue hover:text-brand-navy"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-brand-navy hover:bg-brand-navy-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2 active:scale-[0.98]"
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
                  "Sign in"
                )}
              </button>
            </form>
          </div>
          <p className="text-gray-500 text-xs mt-6 text-center">
            TIMSS Mock Assessment · Grades 4 &amp; 8 · American School of Creative Science, Nad Al Sheba
          </p>
        </div>
      </main>
    </div>
  );
}
