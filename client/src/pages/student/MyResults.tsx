import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { useState } from "react";
import { CheckCircle, XCircle, Clock, Lock, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

type Answer = {
  id: number;
  questionId: number;
  questionText: string;
  questionType: string;
  studentAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean | null;
  pointsEarned: number | null;
  maxPoints: number | null;
  teacherFeedback: string | null;
  session: string;
};

type ReportData = {
  studentName: string;
  examName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  mathScore: number;
  scienceScore: number;
  recommendedInterventionGroup: string;
  strengths: string[];
  weaknesses: string[];
  overallFeedback?: string;
};

type Attempt = {
  id: number;
  examId: number;
  status: string;
  totalScore: number | null;
  totalMaxPoints: number | null;
  resultsPublished: boolean | null;
  submittedAt: string | null;
};

function ResultDetail({ attemptId }: { attemptId: number }) {
  const { data, isLoading } = trpc.student.getMyResult.useQuery({ attemptId });
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) return null;

  if (!data.published) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
        <Lock className="w-12 h-12" />
        <div className="text-lg font-medium">Results not yet published</div>
        <div className="text-sm text-center max-w-xs">
          Your teacher is reviewing your answers. Results will appear here once published.
        </div>
      </div>
    );
  }

  const rd = (data.report as { reportData: ReportData } | null)?.reportData;
  const answers = (data.answers ?? []) as unknown as Answer[];
  const mathAnswers = answers.filter((a) => a.session === "math_session");
  const scienceAnswers = answers.filter((a) => a.session === "science_session");

  return (
    <div className="space-y-6">
      {/* Score summary */}
      {rd && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{rd.percentage}%</div>
            <div className="text-blue-100 text-sm mt-0.5">Overall Score</div>
            <div className="text-blue-200 text-xs mt-1">{rd.totalScore}/{rd.maxScore} pts</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-700">{rd.mathScore}%</div>
            <div className="text-gray-500 text-sm mt-0.5">Mathematics</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-teal-700">{rd.scienceScore}%</div>
            <div className="text-gray-500 text-sm mt-0.5">Science</div>
          </div>
          <div className={`rounded-xl p-4 ${
            rd.recommendedInterventionGroup?.includes("Advanced") ? "bg-green-50 border border-green-200" :
            rd.recommendedInterventionGroup?.includes("Consolidation") ? "bg-blue-50 border border-blue-200" :
            rd.recommendedInterventionGroup?.includes("Targeted") ? "bg-amber-50 border border-amber-200" :
            "bg-red-50 border border-red-200"
          }`}>
            <div className={`text-sm font-bold ${
              rd.recommendedInterventionGroup?.includes("Advanced") ? "text-green-700" :
              rd.recommendedInterventionGroup?.includes("Consolidation") ? "text-blue-700" :
              rd.recommendedInterventionGroup?.includes("Targeted") ? "text-amber-700" :
              "text-red-700"
            }`}>{rd.recommendedInterventionGroup?.split(" – ")[0]}</div>
            <div className="text-gray-500 text-xs mt-0.5">Intervention Group</div>
          </div>
        </div>
      )}

      {/* Teacher overall feedback */}
      {rd?.overallFeedback && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-800 text-sm">Teacher Feedback</div>
            <div className="text-amber-700 text-sm mt-1">{rd.overallFeedback}</div>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      {rd && (rd.strengths?.length > 0 || rd.weaknesses?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rd.strengths?.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="font-semibold text-green-800 mb-2">Strengths</div>
              <ul className="space-y-1">
                {rd.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-700 flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rd.weaknesses?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="font-semibold text-red-800 mb-2">Areas to Improve</div>
              <ul className="space-y-1">
                {rd.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-red-700 flex items-start gap-1.5">
                    <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Per-question breakdown */}
      {[
        { label: "Mathematics Questions", list: mathAnswers },
        { label: "Science Questions", list: scienceAnswers },
      ].map(({ label, list }) =>
        list.length === 0 ? null : (
          <div key={label} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <h4 className="font-semibold text-gray-900">{label}</h4>
            </div>
            <div className="divide-y divide-gray-50">
              {list.map((ans, idx) => {
                const correct =
                  ans.isCorrect === true ||
                  (ans.pointsEarned !== null &&
                    ans.maxPoints !== null &&
                    ans.pointsEarned >= ans.maxPoints);
                const partial =
                  !correct && ans.pointsEarned !== null && ans.pointsEarned > 0;
                const isExpanded = expandedQ === ans.id;
                return (
                  <div key={ans.id} className="px-5 py-3">
                    <button
                      className="w-full text-left flex items-center gap-3"
                      onClick={() => setExpandedQ(isExpanded ? null : ans.id)}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          correct
                            ? "bg-green-100 text-green-600"
                            : partial
                            ? "bg-amber-100 text-amber-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {correct ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : partial ? (
                          <span className="text-xs font-bold">½</span>
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          Q{idx + 1}: {ans.questionText}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {ans.pointsEarned ?? 0}/{ans.maxPoints ?? 1} pts
                          {ans.teacherFeedback && (
                            <span className="ml-2 text-amber-600">• Teacher feedback</span>
                          )}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="mt-3 ml-9 space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-500">Your answer: </span>
                          <span
                            className={`font-medium ${
                              correct
                                ? "text-green-700"
                                : partial
                                ? "text-amber-700"
                                : "text-red-700"
                            }`}
                          >
                            {ans.studentAnswer ?? "(no answer)"}
                          </span>
                        </div>
                        {!correct && ans.correctAnswer && (
                          <div className="text-sm">
                            <span className="text-gray-500">Correct answer: </span>
                            <span className="font-medium text-green-700">
                              {ans.correctAnswer}
                            </span>
                          </div>
                        )}
                        {ans.teacherFeedback && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                            <span className="font-semibold">Teacher: </span>
                            {ans.teacherFeedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default function MyResults() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { data: attempts, isLoading } = trpc.student.myAttempts.useQuery(undefined, {
    enabled: isAuth,
  });
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);

  const submitted = ((attempts as Attempt[] | undefined) ?? []).filter(
    (a) => a.status === "submitted"
  );

  return (
    <PlatformLayout title="My Results">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Results</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            View your exam scores and teacher feedback once results are published
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : submitted.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <div className="text-lg font-medium">No submitted exams yet</div>
            <div className="text-sm mt-1">Complete an exam to see your results here.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attempt list */}
            <div className="space-y-3">
              {submitted.map((a) => {
                const pct =
                  a.totalMaxPoints && a.totalMaxPoints > 0
                    ? Math.round(((a.totalScore ?? 0) / a.totalMaxPoints) * 100)
                    : null;
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAttemptId(a.id)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selectedAttemptId === a.id
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 text-sm">Exam #{a.examId}</div>
                      {a.resultsPublished ? (
                        pct !== null ? (
                          <span
                            className={`text-sm font-bold ${
                              pct >= 70
                                ? "text-green-600"
                                : pct >= 50
                                ? "text-amber-600"
                                : "text-red-600"
                            }`}
                          >
                            {pct}%
                          </span>
                        ) : null
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                    {a.submittedAt && (
                      <div className="text-xs text-gray-400 mt-1">
                        Submitted {new Date(a.submittedAt).toLocaleDateString()}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2">
              {selectedAttemptId ? (
                <ResultDetail attemptId={selectedAttemptId} />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                  <CheckCircle className="w-10 h-10 opacity-30" />
                  <div className="text-sm">Select an exam to view your results</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
