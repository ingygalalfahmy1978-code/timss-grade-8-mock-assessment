import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BarChart3, Users, BookOpen, TrendingUp, Award, AlertCircle, Target, Zap } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-sm text-gray-600 truncate shrink-0">{label}</div>
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-3 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-10 text-right text-sm font-semibold text-gray-700">{value}</div>
    </div>
  );
}

function ScoreBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-sm text-gray-600 shrink-0">{label}</div>
      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
        <div className={`h-4 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-12 text-right text-sm font-semibold text-gray-700">{pct}%</div>
    </div>
  );
}

export default function AdminAnalytics() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { data: analytics, isLoading } = trpc.admin.getAnalytics.useQuery(undefined, { enabled: isAuth });

  if (isLoading) {
    return (
      <PlatformLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </PlatformLayout>
    );
  }

  if (!analytics) {
    return (
      <PlatformLayout title="Analytics">
        <div className="text-center py-16 text-gray-400">No data available yet. Students must submit exams first.</div>
      </PlatformLayout>
    );
  }

  const { totals, classPerformance, examPerformance, scoreDistribution, interventionGroups } = analytics;
  const maxDist = Math.max(...scoreDistribution.map((d) => d.count), 1);
  const maxExamCount = Math.max(...examPerformance.map((e) => e.submittedCount), 1);

  const interventionTotal = Object.values(interventionGroups).reduce((a, b) => a + b, 0);

  return (
    <PlatformLayout title="Analytics">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Assessment Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide performance overview and intervention insights</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Students" value={totals.students} color="bg-blue-500" />
          <StatCard icon={BookOpen} label="Exams Submitted" value={totals.submitted} color="bg-green-500" />
          <StatCard icon={BarChart3} label="Question Bank" value={totals.questions} color="bg-purple-500" />
          <StatCard icon={TrendingUp} label="Avg Score" value={`${totals.avgScore} pts`} color="bg-amber-500" />
        </div>

        {/* Intervention Groups */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Intervention Group Distribution
          </h3>
          {interventionTotal === 0 ? (
            <p className="text-sm text-gray-400">No submitted exams yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: "advanced", label: "Advanced (≥80%)", color: "bg-green-500", textColor: "text-green-700", bg: "bg-green-50" },
                { key: "consolidation", label: "Consolidation (60–79%)", color: "bg-blue-500", textColor: "text-blue-700", bg: "bg-blue-50" },
                { key: "targeted", label: "Targeted (40–59%)", color: "bg-amber-500", textColor: "text-amber-700", bg: "bg-amber-50" },
                { key: "intensive", label: "Intensive (<40%)", color: "bg-red-500", textColor: "text-red-700", bg: "bg-red-50" },
              ].map(({ key, label, color, textColor, bg }) => {
                const count = interventionGroups[key as keyof typeof interventionGroups];
                const pct = interventionTotal > 0 ? Math.round((count / interventionTotal) * 100) : 0;
                return (
                  <div key={key} className={`rounded-xl p-4 ${bg}`}>
                    <div className={`text-2xl font-bold ${textColor}`}>{count}</div>
                    <div className={`text-xs font-medium ${textColor} mt-0.5`}>{label}</div>
                    <div className="mt-2 bg-white/60 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className={`text-xs ${textColor} mt-1`}>{pct}% of students</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Class Performance
            </h3>
            {classPerformance.length === 0 ? (
              <p className="text-sm text-gray-400">No submitted exams yet.</p>
            ) : (
              <div className="space-y-5">
                {classPerformance.map((cls) => (
                  <div key={cls.classId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{cls.className}</span>
                      <span className="text-xs text-gray-400">{cls.submittedCount} submitted</span>
                    </div>
                    <ScoreBar label="Overall" pct={cls.avgPercentage} color={cls.avgPercentage >= 70 ? "bg-green-500" : cls.avgPercentage >= 50 ? "bg-amber-500" : "bg-red-500"} />
                    <ScoreBar label="Math" pct={cls.mathAvg} color="bg-blue-400" />
                    <ScoreBar label="Science" pct={cls.scienceAvg} color="bg-teal-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              Score Distribution
            </h3>
            {totals.submitted === 0 ? (
              <p className="text-sm text-gray-400">No submitted exams yet.</p>
            ) : (
              <div className="space-y-3">
                {scoreDistribution.map((d, i) => (
                  <BarRow
                    key={d.label}
                    label={d.label}
                    value={d.count}
                    max={maxDist}
                    color={i === 4 ? "bg-green-500" : i === 3 ? "bg-blue-500" : i === 2 ? "bg-amber-500" : i === 1 ? "bg-orange-500" : "bg-red-500"}
                  />
                ))}
                <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
                  Total: {totals.submitted} submitted exam{totals.submitted !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Exam Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Per-Exam Performance
          </h3>
          {examPerformance.length === 0 ? (
            <p className="text-sm text-gray-400">No submitted exams yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600">Exam</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600">Submissions</th>
                    <th className="text-left py-2 font-semibold text-gray-600">Avg Score</th>
                    <th className="py-2 w-48"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {examPerformance.map((e) => (
                    <tr key={e.examId} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-800">{e.examName}</td>
                      <td className="py-3 pr-4 text-gray-600">{e.submittedCount}</td>
                      <td className="py-3 pr-4">
                        <span className={`font-semibold ${e.avgPercentage >= 70 ? "text-green-600" : e.avgPercentage >= 50 ? "text-amber-600" : "text-red-600"}`}>
                          {e.avgPercentage}%
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${e.avgPercentage >= 70 ? "bg-green-500" : e.avgPercentage >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${e.avgPercentage}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* No data notice */}
        {totals.submitted === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-amber-800">No exam submissions yet</div>
              <div className="text-sm text-amber-700 mt-1">
                Analytics will populate once students submit their assigned mock exams. Assign exams to students via Teacher → Classes → Assign Exams.
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
