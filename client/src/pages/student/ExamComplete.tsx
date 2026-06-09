import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { CheckCircle2, BookOpen, Home, ClipboardList, TrendingUp, Clock, Award } from "lucide-react";

export default function ExamComplete() {
  const { examId, classId } = useParams<{ examId: string; classId: string }>();
  const [, navigate] = useLocation();

  const { data: attempts } = trpc.student.myAttempts.useQuery(undefined, { retry: false });
  const attempt = attempts?.find(a => a.examId === Number(examId) && a.classId === Number(classId));

  const { data: reports } = trpc.student.myReports.useQuery(undefined, { retry: false });
  const report = reports?.find(r => r.examId === Number(examId) && r.classId === Number(classId));

  const reportData = report?.reportData as {
    totalScore?: number;
    totalMaxPoints?: number;
    percentage?: number;
    mathScore?: number;
    mathMaxPoints?: number;
    scienceScore?: number;
    scienceMaxPoints?: number;
    timeSpentSeconds?: number;
  } | null;

  const percentage = reportData?.percentage ?? (
    reportData?.totalMaxPoints && reportData.totalMaxPoints > 0
      ? Math.round(((reportData.totalScore ?? 0) / reportData.totalMaxPoints) * 100)
      : null
  );

  const formatTime = (seconds?: number) => {
    if (!seconds) return "--";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const getPerformanceLabel = (pct: number | null) => {
    if (pct === null) return { label: "Recorded", color: "text-blue-600", bg: "bg-blue-50" };
    if (pct >= 80) return { label: "Advanced", color: "text-green-700", bg: "bg-green-50" };
    if (pct >= 60) return { label: "High", color: "text-blue-700", bg: "bg-blue-50" };
    if (pct >= 40) return { label: "Intermediate", color: "text-amber-700", bg: "bg-amber-50" };
    return { label: "Low", color: "text-red-700", bg: "bg-red-50" };
  };

  const perf = getPerformanceLabel(percentage);
  const questionnaireCompleted = attempt?.questionnaireCompleted ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Exam Submitted!</h1>
          <p className="text-blue-200 text-sm">Your answers have been recorded successfully.</p>
        </div>

        {/* Score card */}
        {reportData && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white text-sm uppercase tracking-wider">Your Results</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${perf.bg} ${perf.color}`}>
                {perf.label}
              </span>
            </div>

            {percentage !== null && (
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-white mb-1">{percentage}%</div>
                <div className="text-slate-300 text-sm">
                  {reportData.totalScore ?? 0} / {reportData.totalMaxPoints ?? 0} points
                </div>
                <div className="mt-3 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${percentage >= 80 ? "bg-green-400" : percentage >= 60 ? "bg-blue-400" : percentage >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BookOpen size={13} className="text-blue-300" />
                  <span className="text-blue-300 text-xs font-semibold">Mathematics</span>
                </div>
                <div className="text-white font-bold">{reportData.mathScore ?? 0}/{reportData.mathMaxPoints ?? 0}</div>
                <div className="text-slate-400 text-xs">
                  {reportData.mathMaxPoints && reportData.mathMaxPoints > 0
                    ? `${Math.round(((reportData.mathScore ?? 0) / reportData.mathMaxPoints) * 100)}%` : "--"}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp size={13} className="text-emerald-300" />
                  <span className="text-emerald-300 text-xs font-semibold">Science</span>
                </div>
                <div className="text-white font-bold">{reportData.scienceScore ?? 0}/{reportData.scienceMaxPoints ?? 0}</div>
                <div className="text-slate-400 text-xs">
                  {reportData.scienceMaxPoints && reportData.scienceMaxPoints > 0
                    ? `${Math.round(((reportData.scienceScore ?? 0) / reportData.scienceMaxPoints) * 100)}%` : "--"}
                </div>
              </div>
            </div>

            {reportData.timeSpentSeconds && (
              <div className="flex items-center justify-center gap-2 mt-3 text-slate-400 text-xs">
                <Clock size={12} />
                <span>Time spent: {formatTime(reportData.timeSpentSeconds)}</span>
              </div>
            )}
          </div>
        )}

        {/* Questionnaire prompt */}
        {!questionnaireCompleted && attempt && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl p-5 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <ClipboardList size={18} className="text-purple-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Background Questionnaire</h3>
                <p className="text-purple-200 text-xs mb-3">
                  Please complete the 30-minute background questionnaire. Your responses help improve educational research and are completely confidential.
                </p>
                <button onClick={() => navigate(`/student/exam/${examId}/${classId}/questionnaire/${attempt.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-colors">
                  <ClipboardList size={14} /> Start Questionnaire
                </button>
              </div>
            </div>
          </div>
        )}

        {questionnaireCompleted && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
            <span className="text-green-300 text-sm">Background questionnaire completed. Thank you!</span>
          </div>
        )}

        {/* TIMSS performance levels */}
        {percentage !== null && (
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Award size={14} className="text-amber-400" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">TIMSS Performance Level</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {[
                { label: "Advanced", min: 80, color: "bg-green-500" },
                { label: "High", min: 60, color: "bg-blue-500" },
                { label: "Intermediate", min: 40, color: "bg-amber-500" },
                { label: "Low", min: 0, color: "bg-red-500" },
              ].map(level => (
                <div key={level.label} className={`rounded-lg p-2 text-center ${percentage >= level.min ? level.color + "/30 border border-white/20" : "bg-white/5"}`}>
                  <div className={`w-2 h-2 rounded-full ${level.color} mx-auto mb-1`} />
                  <div className="text-white/70">{level.label}</div>
                  <div className="text-white/40">{level.min}%+</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => navigate("/student")}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-colors">
          <Home size={18} /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}
