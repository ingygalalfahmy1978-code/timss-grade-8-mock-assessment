import { useState, useMemo } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { Users, TrendingUp, TrendingDown, BarChart2, Download, Minus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const PASS_LINE = 60;
const MATH_COLOR = "#2f6eb4"; // school blue
const SCI_COLOR = "#10b981";
const TOTAL_COLOR = "#2b2a7a"; // school navy

function pctColor(v: number | null) {
  if (v === null) return "text-gray-400";
  if (v >= 75) return "text-emerald-600";
  if (v >= 60) return "text-blue-600";
  if (v >= 40) return "text-amber-600";
  return "text-red-500";
}

function pctBg(v: number | null) {
  if (v === null) return "bg-gray-100 text-gray-400";
  if (v >= 75) return "bg-emerald-100 text-emerald-700";
  if (v >= 60) return "bg-blue-100 text-blue-700";
  if (v >= 40) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-600";
}

export default function TeacherAnalytics() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;

  // Fetch teacher's classes
  const { data: rawClasses } = trpc.teacher.myClasses.useQuery(undefined, { enabled: isAuth });
  const classes = (rawClasses as Array<{ id: number; name: string; grade: string }> | undefined) ?? [];

  // Selected class
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const classId = selectedClassId ?? (classes[0]?.id ?? null);

  // Selected student filter (null = all)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Fetch class analytics
  const { data: analytics, isLoading } = trpc.teacher.getClassAnalytics.useQuery(
    { classId: classId! },
    { enabled: !!classId, staleTime: 30_000, refetchOnWindowFocus: false }
  );

  // Fetch single-student progress when a student is selected
  const { data: studentProgress } = trpc.teacher.getStudentProgress.useQuery(
    { studentId: selectedStudentId!, classId: classId! },
    { enabled: !!selectedStudentId && !!classId, staleTime: 30_000, refetchOnWindowFocus: false }
  );

  const activeExamIds: number[] = analytics?.activeExamIds ?? [];
  const examMap: Record<number, string> = analytics?.examMap ?? {};

  // Bar chart data — class averages per exam
  const classBarData = useMemo(() => {
    if (!analytics?.examStats) return [];
    return analytics.examStats.map((s) => ({
      name: s.examName.replace("Mock Exam ", "Exam "),
      "Avg Total": s.avgScore ?? 0,
      "Avg Math": s.mathAvg ?? 0,
      "Avg Science": s.sciAvg ?? 0,
    }));
  }, [analytics]);

  // Student progress line data
  const studentLineData = useMemo(() => {
    if (!studentProgress) return [];
    return [...studentProgress]
      .sort((a, b) => a.examName.localeCompare(b.examName, undefined, { numeric: true }))
      .map((a) => ({
        name: a.examName.replace("Mock Exam ", "Exam "),
        Total: a.percentage,
        Math: a.mathPercentage,
        Science: a.sciencePercentage,
      }));
  }, [studentProgress]);

  // Radar data for selected student
  const studentRadarData = useMemo(() => {
    if (!studentProgress || studentProgress.length === 0) return [];
    const avgMath = Math.round(studentProgress.reduce((s, a) => s + a.mathPercentage, 0) / studentProgress.length);
    const avgSci = Math.round(studentProgress.reduce((s, a) => s + a.sciencePercentage, 0) / studentProgress.length);
    const avgTotal = Math.round(studentProgress.reduce((s, a) => s + a.percentage, 0) / studentProgress.length);
    return [
      { subject: "Overall", score: avgTotal, fullMark: 100 },
      { subject: "Mathematics", score: avgMath, fullMark: 100 },
      { subject: "Science", score: avgSci, fullMark: 100 },
    ];
  }, [studentProgress]);

  // Class-level radar: average of averages
  const classRadarData = useMemo(() => {
    if (!analytics?.examStats || analytics.examStats.length === 0) return [];
    const mathAvgs = analytics.examStats.filter((s) => s.mathAvg !== null).map((s) => s.mathAvg!);
    const sciAvgs = analytics.examStats.filter((s) => s.sciAvg !== null).map((s) => s.sciAvg!);
    const totAvgs = analytics.examStats.filter((s) => s.avgScore !== null).map((s) => s.avgScore!);
    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
    return [
      { subject: "Overall", score: avg(totAvgs), fullMark: 100 },
      { subject: "Mathematics", score: avg(mathAvgs), fullMark: 100 },
      { subject: "Science", score: avg(sciAvgs), fullMark: 100 },
    ];
  }, [analytics]);

  const selectedStudent = analytics?.students?.find((s) => s.id === selectedStudentId);

  // PDF export — opens the class PDF report
  const handleExportPDF = () => {
    if (!classId) return;
    // Use the first exam's class report as a proxy; or open a combined report
    // For now open the class report for the first active exam
    const firstExamId = activeExamIds[0];
    if (!firstExamId) return;
    window.open(`/api/reports/class/${classId}/exam/${firstExamId}/pdf`, "_blank");
  };

  return (
    <PlatformLayout title="Analytics">
      <div className="space-y-6">
        {/* Filters bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Class:</label>
            <select
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={classId ?? ""}
              onChange={(e) => {
                setSelectedClassId(Number(e.target.value));
                setSelectedStudentId(null);
              }}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Student:</label>
            <select
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStudentId ?? ""}
              onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Students</option>
              {analytics?.students?.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
              ))}
            </select>
          </div>
          <div className="ml-auto">
            <button
              onClick={handleExportPDF}
              disabled={!classId || activeExamIds.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-brand-navy hover:bg-brand-navy-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              Export Class PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p>Loading analytics...</p>
          </div>
        ) : !analytics || activeExamIds.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No Data Yet</h3>
            <p className="text-gray-400 text-sm mt-2">Activate exams and publish student results to see analytics here.</p>
          </div>
        ) : selectedStudentId && selectedStudent ? (
          /* ── Single-student view ── */
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <span className="font-bold text-violet-700 text-sm">{selectedStudent.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{selectedStudent.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{selectedStudent.username}</div>
                </div>
              </div>
              {!studentProgress || studentProgress.length === 0 ? (
                <p className="text-gray-400 text-sm">No published results for this student yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {["percentage", "mathPercentage", "sciencePercentage"].map((key, i) => {
                    const label = ["Overall", "Math", "Science"][i];
                    const color = [TOTAL_COLOR, MATH_COLOR, SCI_COLOR][i];
                    const avg = Math.round(studentProgress.reduce((s, a) => s + (a as any)[key], 0) / studentProgress.length);
                    return (
                      <div key={key} className="bg-gray-50 rounded-xl p-4 text-center border-2" style={{ borderColor: color }}>
                        <div className="text-2xl font-bold" style={{ color }}>{avg}%</div>
                        <div className="text-xs text-gray-500 mt-1">Avg {label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {studentProgress && studentProgress.length > 0 && (
              <>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Progress Over Exams</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={studentLineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(v: number) => `${v}%`} />
                      <Legend />
                      <ReferenceLine y={PASS_LINE} stroke="#ef4444" strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="Total" stroke={TOTAL_COLOR} strokeWidth={2} dot />
                      <Line type="monotone" dataKey="Math" stroke={MATH_COLOR} strokeWidth={2} dot />
                      <Line type="monotone" dataKey="Science" stroke={SCI_COLOR} strokeWidth={2} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Domain Radar (Average)</h3>
                  <div className="flex justify-center">
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={studentRadarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                        <Radar name={selectedStudent.name} dataKey="score" stroke={TOTAL_COLOR} fill={TOTAL_COLOR} fillOpacity={0.3} />
                        <Tooltip formatter={(v: number) => `${v}%`} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Per-exam table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Exam Breakdown</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-6 py-3 font-semibold text-gray-600">Exam</th>
                          <th className="px-4 py-3 font-semibold text-gray-600 text-center">Total</th>
                          <th className="px-4 py-3 font-semibold text-gray-600 text-center">Math</th>
                          <th className="px-4 py-3 font-semibold text-gray-600 text-center">Science</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[...studentProgress]
                          .sort((a, b) => a.examName.localeCompare(b.examName, undefined, { numeric: true }))
                          .map((a) => (
                            <tr key={a.id} className="hover:bg-gray-50">
                              <td className="px-6 py-3 font-medium text-gray-900">{a.examName}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`font-bold ${pctColor(a.percentage)}`}>{a.percentage}%</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="font-semibold text-blue-600">{a.mathPercentage}%</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="font-semibold text-emerald-600">{a.sciencePercentage}%</span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* ── Class-level view ── */
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Students", value: analytics.students?.length ?? 0, suffix: "", color: "#6366f1" },
                {
                  label: "Avg Score",
                  value: analytics.examStats.length > 0
                    ? Math.round(analytics.examStats.filter((s) => s.avgScore !== null).reduce((sum, s) => sum + s.avgScore!, 0) / (analytics.examStats.filter((s) => s.avgScore !== null).length || 1))
                    : null,
                  suffix: "%",
                  color: TOTAL_COLOR,
                },
                {
                  label: "Pass Rate",
                  value: analytics.examStats.length > 0
                    ? Math.round(analytics.examStats.filter((s) => s.passRate !== null).reduce((sum, s) => sum + s.passRate!, 0) / (analytics.examStats.filter((s) => s.passRate !== null).length || 1))
                    : null,
                  suffix: "%",
                  color: "#10b981",
                },
                {
                  label: "Exams Active",
                  value: activeExamIds.length,
                  suffix: "",
                  color: "#f59e0b",
                },
              ].map((card) => (
                <div key={card.label} className="bg-white rounded-xl border-2 p-5 text-center" style={{ borderColor: card.color }}>
                  <div className="text-3xl font-bold" style={{ color: card.color }}>
                    {card.value === null ? "—" : `${card.value}${card.suffix}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Class bar chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-1">Class Average per Exam</h3>
              <p className="text-xs text-gray-400 mb-4">Average scores across all students for each mock exam.</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={classBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend />
                  <ReferenceLine y={PASS_LINE} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Pass 60%", position: "right", fontSize: 11, fill: "#ef4444" }} />
                  <Bar dataKey="Avg Total" fill={TOTAL_COLOR} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Avg Math" fill={MATH_COLOR} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Avg Science" fill={SCI_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Class radar */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-1">Class Domain Radar</h3>
              <p className="text-xs text-gray-400 mb-4">Average class performance across subject domains.</p>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={classRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                    <Radar name="Class Average" dataKey="score" stroke={TOTAL_COLOR} fill={TOTAL_COLOR} fillOpacity={0.3} />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Per-exam stats table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Exam Statistics</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 font-semibold text-gray-600">Exam</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Submitted</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Published</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Avg Score</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Pass Rate</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Avg Math</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Avg Science</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {analytics.examStats.map((s) => (
                      <tr key={s.examId} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{s.examName}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{s.totalAttempts}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{s.publishedAttempts}</td>
                        <td className="px-4 py-3 text-center">
                          {s.avgScore !== null ? (
                            <span className={`font-bold ${pctColor(s.avgScore)}`}>{s.avgScore}%</span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s.passRate !== null ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pctBg(s.passRate)}`}>{s.passRate}%</span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s.mathAvg !== null ? <span className="font-semibold text-blue-600">{s.mathAvg}%</span> : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s.sciAvg !== null ? <span className="font-semibold text-emerald-600">{s.sciAvg}%</span> : <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student score matrix */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Student Score Matrix</h3>
                <span className="text-xs text-gray-400">Click a student row to view their detailed progress</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 font-semibold text-gray-600 sticky left-0 bg-gray-50">Student</th>
                      {activeExamIds.map((eid) => (
                        <th key={eid} className="px-3 py-3 font-semibold text-gray-600 text-center whitespace-nowrap">
                          {(examMap[eid] ?? `Exam ${eid}`).replace("Mock Exam ", "E")}
                        </th>
                      ))}
                      <th className="px-4 py-3 font-semibold text-gray-600 text-center">Avg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {analytics.studentRows.map((row) => (
                      <tr
                        key={row.studentId}
                        className="hover:bg-violet-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedStudentId(row.studentId)}
                      >
                        <td className="px-6 py-3 font-medium text-gray-900 sticky left-0 bg-white">
                          <div>{row.studentName}</div>
                          <div className="text-xs text-gray-400 font-mono">{row.username}</div>
                        </td>
                        {activeExamIds.map((eid) => {
                          const score = row.examScores[eid];
                          return (
                            <td key={eid} className="px-3 py-3 text-center">
                              {score !== null && score !== undefined ? (
                                <span className={`font-semibold ${pctColor(score.pct)}`}>{score.pct}%</span>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-center">
                          {row.avgPct !== null ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${pctBg(row.avgPct)}`}>{row.avgPct}%</span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
