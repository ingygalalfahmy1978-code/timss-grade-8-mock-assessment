import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Lightbulb,
  BookOpen,
  AlertCircle,
  Download,
} from "lucide-react";

type Option = { id: string; text: string };

type Answer = {
  id: number;
  questionId: number;
  questionText: string | null;
  questionType: string | null;
  options: Option[] | null;
  answerGiven: string | null;
  correctAnswer: string | null;
  explanation: string | null;
  imageUrl: string | null;
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

/** Resolve the human-readable label for a student's answer */
function resolveAnswerLabel(ans: Answer): string {
  if (!ans.answerGiven) return "(no answer)";
  // For multiple choice, map option id → text
  if (ans.questionType === "multiple_choice" && Array.isArray(ans.options)) {
    const opt = (ans.options as Option[]).find((o) => o.id === ans.answerGiven);
    if (opt) return `${opt.id}. ${opt.text}`;
  }
  return ans.answerGiven;
}

/** Resolve the human-readable label for the correct answer */
function resolveCorrectLabel(ans: Answer): string {
  if (!ans.correctAnswer) return "";
  if (ans.questionType === "multiple_choice" && Array.isArray(ans.options)) {
    const opt = (ans.options as Option[]).find((o) => o.id === ans.correctAnswer);
    if (opt) return `${opt.id}. ${opt.text}`;
  }
  return ans.correctAnswer;
}

function WrongAnswerReview({ ans, idx }: { ans: Answer; idx: number }) {
  const [open, setOpen] = useState(false);
  const options = Array.isArray(ans.options) ? (ans.options as Option[]) : [];
  const studentLabel = resolveAnswerLabel(ans);
  const correctLabel = resolveCorrectLabel(ans);

  return (
    <div className="border border-red-200 rounded-xl overflow-hidden bg-white">
      {/* Header row — always visible */}
      <button
        className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-red-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
          <XCircle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800">
            Q{idx + 1}
          </div>
          <div className="text-sm text-gray-700 mt-0.5 line-clamp-2">
            {ans.questionText ?? "Question text unavailable"}
          </div>
          <div className="text-xs text-red-500 mt-1">
            Your answer: <span className="font-medium">{studentLabel}</span>
            {" · "}
            <span className="text-green-600">
              Correct: <span className="font-medium">{correctLabel}</span>
            </span>
          </div>
        </div>
        <div className="shrink-0 mt-1">
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded review panel */}
      {open && (
        <div className="border-t border-red-100 px-4 py-4 space-y-4 bg-red-50/40">
          {/* Full question text */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Question
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {ans.questionText}
            </p>
          </div>

          {/* Optional image */}
          {ans.imageUrl && (
            <img
              src={ans.imageUrl}
              alt="Question illustration"
              className="max-h-48 rounded-lg border border-gray-200 object-contain"
            />
          )}

          {/* Multiple-choice options */}
          {options.length > 0 && (
            <div className="space-y-1.5">
              {options.map((opt) => {
                const isStudentChoice = opt.id === ans.answerGiven;
                const isCorrectChoice = opt.id === ans.correctAnswer;
                return (
                  <div
                    key={opt.id}
                    className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                      isCorrectChoice
                        ? "bg-green-100 border border-green-300 text-green-800"
                        : isStudentChoice
                        ? "bg-red-100 border border-red-300 text-red-800"
                        : "bg-white border border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="font-semibold shrink-0 w-5">{opt.id}.</span>
                    <span className="flex-1">{opt.text}</span>
                    {isCorrectChoice && (
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    )}
                    {isStudentChoice && !isCorrectChoice && (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Short-answer: show student vs correct */}
          {options.length === 0 && (
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm bg-red-100 border border-red-300 text-red-800">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Your answer: </span>
                  {studentLabel}
                </div>
              </div>
              {ans.correctAnswer && (
                <div className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm bg-green-100 border border-green-300 text-green-800">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Correct answer: </span>
                    {correctLabel}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explanation */}
          {ans.explanation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                  Explanation
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {ans.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Teacher feedback */}
          {ans.teacherFeedback && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2.5">
              <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  Teacher Feedback
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {ans.teacherFeedback}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultDetail({ attemptId }: { attemptId: number }) {
  const { data, isLoading } = trpc.student.getMyResult.useQuery({ attemptId });
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [reviewTab, setReviewTab] = useState<"all" | "wrong">("all");

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
          Your teacher is reviewing your answers. Results will appear here once
          published.
        </div>
      </div>
    );
  }

  const rd = (data.report as { reportData: ReportData } | null)?.reportData;
  const answers = (data.answers ?? []) as unknown as Answer[];
  const mathAnswers = answers.filter((a) => a.session === "math_session");
  const scienceAnswers = answers.filter((a) => a.session === "science_session");

  const isWrong = (ans: Answer) => {
    if (ans.isCorrect === false) return true;
    if (
      ans.pointsEarned !== null &&
      ans.maxPoints !== null &&
      ans.pointsEarned < ans.maxPoints
    )
      return true;
    return false;
  };

  const wrongMath = mathAnswers.filter(isWrong);
  const wrongScience = scienceAnswers.filter(isWrong);
  const totalWrong = wrongMath.length + wrongScience.length;

  return (
    <div className="space-y-6">
      {/* Download PDF button */}
      <div className="flex justify-end">
        <button
          onClick={() => window.open(`/api/reports/attempt/${attemptId}/pdf`, "_blank")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white text-sm font-semibold rounded-xl transition-all duration-150"
        >
          <Download className="w-4 h-4" />
          Download My Report (PDF)
        </button>
      </div>

      {/* Score summary */}
      {rd && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{rd.percentage}%</div>
            <div className="text-blue-100 text-sm mt-0.5">Overall Score</div>
            <div className="text-blue-200 text-xs mt-1">
              {rd.totalScore}/{rd.maxScore} pts
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-700">
              {rd.mathScore}%
            </div>
            <div className="text-gray-500 text-sm mt-0.5">Mathematics</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-teal-700">
              {rd.scienceScore}%
            </div>
            <div className="text-gray-500 text-sm mt-0.5">Science</div>
          </div>
          <div
            className={`rounded-xl p-4 ${
              rd.recommendedInterventionGroup?.includes("Advanced")
                ? "bg-green-50 border border-green-200"
                : rd.recommendedInterventionGroup?.includes("Consolidation")
                ? "bg-blue-50 border border-blue-200"
                : rd.recommendedInterventionGroup?.includes("Targeted")
                ? "bg-amber-50 border border-amber-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div
              className={`text-sm font-bold ${
                rd.recommendedInterventionGroup?.includes("Advanced")
                  ? "text-green-700"
                  : rd.recommendedInterventionGroup?.includes("Consolidation")
                  ? "text-blue-700"
                  : rd.recommendedInterventionGroup?.includes("Targeted")
                  ? "text-amber-700"
                  : "text-red-700"
              }`}
            >
              {rd.recommendedInterventionGroup?.split(" – ")[0]}
            </div>
            <div className="text-gray-500 text-xs mt-0.5">
              Intervention Group
            </div>
          </div>
        </div>
      )}

      {/* Teacher overall feedback */}
      {rd?.overallFeedback && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-800 text-sm">
              Teacher Feedback
            </div>
            <div className="text-amber-700 text-sm mt-1">
              {rd.overallFeedback}
            </div>
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
                  <li
                    key={i}
                    className="text-sm text-green-700 flex items-start gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rd.weaknesses?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="font-semibold text-red-800 mb-2">
                Areas to Improve
              </div>
              <ul className="space-y-1">
                {rd.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="text-sm text-red-700 flex items-start gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Answer Review Section ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setReviewTab("all")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              reviewTab === "all"
                ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Questions ({answers.length})
          </button>
          <button
            onClick={() => setReviewTab("wrong")}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              reviewTab === "wrong"
                ? "text-red-700 border-b-2 border-red-500 bg-red-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Review Wrong ({totalWrong})
          </button>
        </div>

        {/* ── "Review Wrong" tab: detailed cards ── */}
        {reviewTab === "wrong" && (
          <div className="p-4 space-y-6">
            {totalWrong === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-400 gap-2">
                <CheckCircle className="w-10 h-10 text-green-400" />
                <div className="text-sm font-medium text-green-600">
                  Perfect score! No wrong answers.
                </div>
              </div>
            ) : (
              <>
                {wrongMath.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      Mathematics — {wrongMath.length} incorrect
                    </h4>
                    <div className="space-y-3">
                      {wrongMath.map((ans, i) => (
                        <WrongAnswerReview key={ans.id} ans={ans} idx={i} />
                      ))}
                    </div>
                  </div>
                )}
                {wrongScience.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                      Science — {wrongScience.length} incorrect
                    </h4>
                    <div className="space-y-3">
                      {wrongScience.map((ans, i) => (
                        <WrongAnswerReview key={ans.id} ans={ans} idx={i} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── "All Questions" tab: compact list ── */}
        {reviewTab === "all" && (
          <div>
            {[
              { label: "Mathematics Questions", list: mathAnswers },
              { label: "Science Questions", list: scienceAnswers },
            ].map(({ label, list }) =>
              list.length === 0 ? null : (
                <div key={label}>
                  <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-700 text-sm">
                      {label}
                    </h4>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {list.map((ans, idx) => {
                      const correct =
                        ans.isCorrect === true ||
                        (ans.pointsEarned !== null &&
                          ans.maxPoints !== null &&
                          ans.pointsEarned >= ans.maxPoints);
                      const partial =
                        !correct &&
                        ans.pointsEarned !== null &&
                        ans.pointsEarned > 0;
                      const isExpanded = expandedQ === ans.id;
                      return (
                        <div key={ans.id} className="px-5 py-3">
                          <button
                            className="w-full text-left flex items-center gap-3"
                            onClick={() =>
                              setExpandedQ(isExpanded ? null : ans.id)
                            }
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
                                Q{idx + 1}:{" "}
                                {ans.questionText ?? "Question unavailable"}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {ans.pointsEarned ?? 0}/{ans.maxPoints ?? 1} pts
                                {ans.teacherFeedback && (
                                  <span className="ml-2 text-amber-600">
                                    • Teacher feedback
                                  </span>
                                )}
                                {!correct && ans.explanation && (
                                  <span className="ml-2 text-amber-500">
                                    • Explanation available
                                  </span>
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
                                <span className="text-gray-500">
                                  Your answer:{" "}
                                </span>
                                <span
                                  className={`font-medium ${
                                    correct
                                      ? "text-green-700"
                                      : partial
                                      ? "text-amber-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  {resolveAnswerLabel(ans)}
                                </span>
                              </div>
                              {!correct && ans.correctAnswer && (
                                <div className="text-sm">
                                  <span className="text-gray-500">
                                    Correct answer:{" "}
                                  </span>
                                  <span className="font-medium text-green-700">
                                    {resolveCorrectLabel(ans)}
                                  </span>
                                </div>
                              )}
                              {/* Explanation inline for wrong answers */}
                              {!correct && ans.explanation && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                  <p className="text-sm text-amber-800 leading-relaxed">
                                    {ans.explanation}
                                  </p>
                                </div>
                              )}
                              {ans.teacherFeedback && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                                  <span className="font-semibold">
                                    Teacher:{" "}
                                  </span>
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
        )}
      </div>
    </div>
  );
}

export default function MyResults() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { data: attempts, isLoading } = trpc.student.myAttempts.useQuery(
    undefined,
    { enabled: isAuth }
  );
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(
    null
  );

  const submitted = ((attempts as Attempt[] | undefined) ?? []).filter(
    (a) => a.status === "submitted"
  );

  return (
    <PlatformLayout title="My Results">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Results</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            View your exam scores, review wrong answers, and read explanations
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
            <div className="text-sm mt-1">
              Complete an exam to see your results here.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attempt list */}
            <div className="space-y-3">
              {submitted.map((a) => {
                const pct =
                  a.totalMaxPoints && a.totalMaxPoints > 0
                    ? Math.round(
                        ((a.totalScore ?? 0) / a.totalMaxPoints) * 100
                      )
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
                      <div className="font-medium text-gray-900 text-sm">
                        Exam #{a.examId}
                      </div>
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
                        Submitted{" "}
                        {new Date(a.submittedAt).toLocaleDateString()}
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
                  <div className="text-sm">
                    Select an exam to view your results
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
