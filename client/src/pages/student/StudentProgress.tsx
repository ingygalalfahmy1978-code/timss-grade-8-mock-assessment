import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BookOpen, TrendingUp, TrendingDown, Minus, BarChart2, LogOut, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function ScoreCard({ label, value, color }: { label: string; value: number | null; color: string }) {
  if (value === null) return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
      <div className="text-2xl font-bold text-gray-300">—</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
  return (
    <div className={`bg-white rounded-2xl border-2 p-5 text-center`} style={{ borderColor: color }}>
      <div className="text-3xl font-bold" style={{ color }}>{value}%</div>
      <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

function TrendBadge({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  const diff = last - prev;
  if (diff > 2) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
      <TrendingUp className="w-3 h-3" /> +{diff}%
    </span>
  );
  if (diff < -2) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
      <TrendingDown className="w-3 h-3" /> {diff}%
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
      <Minus className="w-3 h-3" /> Stable
    </span>
  );
}

const PASS_LINE = 60;
const MATH_COLOR = "#2f6eb4"; // school blue
const SCI_COLOR = "#10b981";
const TOTAL_COLOR = "#2b2a7a"; // school navy

export default function StudentProgress() {
  const { user, logout } = usePlatformAuth();
  const { data: progress, isLoading } = trpc.student.getMyProgress.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  // Sort by exam name
  const sorted = progress
    ? [...progress].sort((a, b) => a.examName.localeCompare(b.examName, undefined, { numeric: true }))
    : [];

  const barData = sorted.map((a) => ({
    name: a.examName.replace("Mock Exam ", "Exam "),
    Total: a.percentage,
    Math: a.mathPercentage,
    Science: a.sciencePercentage,
  }));

  // Radar: average per subject across all exams
  const avgMath = sorted.length > 0 ? Math.round(sorted.reduce((s, a) => s + a.mathPercentage, 0) / sorted.length) : 0;
  const avgSci = sorted.length > 0 ? Math.round(sorted.reduce((s, a) => s + a.sciencePercentage, 0) / sorted.length) : 0;
  const avgTotal = sorted.length > 0 ? Math.round(sorted.reduce((s, a) => s + a.percentage, 0) / sorted.length) : 0;
  const best = sorted.length > 0 ? Math.max(...sorted.map((a) => a.percentage)) : 0;

  // Radar data: use domain breakdown if available, else math/science
  const radarData = [
    { subject: "Overall", score: avgTotal, fullMark: 100 },
    { subject: "Mathematics", score: avgMath, fullMark: 100 },
    { subject: "Science", score: avgSci, fullMark: 100 },
  ];

  // Enrich radar with domain breakdown if available
  if (sorted.length > 0) {
    const domainTotals: Record<string, { sum: number; count: number }> = {};
    for (const a of sorted) {
      const bd = a.domainBreakdown as any;
      if (bd?.contentDomain) {
        for (const [domain, val] of Object.entries(bd.contentDomain as Record<string, any>)) {
          const pct = val.max > 0 ? Math.round((val.earned / val.max) * 100) : 0;
          if (!domainTotals[domain]) domainTotals[domain] = { sum: 0, count: 0 };
          domainTotals[domain].sum += pct;
          domainTotals[domain].count += 1;
        }
      }
    }
    const domainEntries = Object.entries(domainTotals).map(([k, v]) => ({
      subject: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      score: Math.round(v.sum / v.count),
      fullMark: 100,
    }));
    if (domainEntries.length >= 3) {
      radarData.splice(0, radarData.length, ...domainEntries);
    }
  }

  const allScores = sorted.map((a) => a.percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-navy-deep text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/student">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors mr-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Dashboard
              </button>
            </Link>
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">My Progress</div>
              <div className="text-white/50 text-xs">Score tracking across all mock exams</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-white/50 text-xs font-mono">{(user as any)?.username}</div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p>Loading your progress...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No Results Yet</h3>
            <p className="text-gray-400 text-sm mt-2">
              Complete a mock exam and wait for your teacher to publish the results to see your progress here.
            </p>
            <Link href="/student">
              <button className="mt-6 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm transition-colors">
                Go to Dashboard
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Overall Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ScoreCard label="Average Score" value={avgTotal} color={TOTAL_COLOR} />
                <ScoreCard label="Best Score" value={best} color="#f59e0b" />
                <ScoreCard label="Avg Mathematics" value={avgMath} color={MATH_COLOR} />
                <ScoreCard label="Avg Science" value={avgSci} color={SCI_COLOR} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-500">Latest trend:</span>
                <TrendBadge values={allScores} />
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">Score per Mock Exam</h2>
              <p className="text-xs text-gray-400 mb-5">Compare your total, math, and science scores across all exams. Dashed line = pass mark (60%).</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend />
                  <ReferenceLine y={PASS_LINE} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Pass 60%", position: "right", fontSize: 11, fill: "#ef4444" }} />
                  <Bar dataKey="Total" fill={TOTAL_COLOR} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Math" fill={MATH_COLOR} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Science" fill={SCI_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">Domain Breakdown (Average)</h2>
              <p className="text-xs text-gray-400 mb-5">Your average performance across content domains. Larger area = stronger coverage.</p>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                    <Radar name="Your Average" dataKey="score" stroke={TOTAL_COLOR} fill={TOTAL_COLOR} fillOpacity={0.3} />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Per-exam table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Exam-by-Exam Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 font-semibold text-gray-600">Exam</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Total</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Math</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Science</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sorted.map((a) => {
                      const pass = a.percentage >= PASS_LINE;
                      return (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 font-medium text-gray-900">{a.examName}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-bold text-base ${pass ? "text-emerald-600" : "text-red-500"}`}>{a.percentage}%</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-semibold text-blue-600">{a.mathPercentage}%</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-semibold text-emerald-600">{a.sciencePercentage}%</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {pass ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Pass</span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Below Pass</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
