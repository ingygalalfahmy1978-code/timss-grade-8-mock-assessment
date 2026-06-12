import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, Edit2, Check, X } from "lucide-react";

type QuestionDetail = {
  questionId: number;
  questionText: string;
  questionType: string;
  subject: string;
  contentDomain: string;
  correctAnswer: string;
  options: string | null;
  maxPoints: number;
  session: string | null;
  answerId: number | null;
  answerGiven: string | null;
  isCorrect: boolean | null;
  pointsEarned: number;
  isFlagged: boolean;
};

function parseOptions(raw: string | null): string[] {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function renderAnswer(q: QuestionDetail) {
  if (!q.answerGiven) return <span className="text-gray-400 italic">No answer</span>;
  if (q.questionType === "drawing_canvas") {
    try {
      const data = JSON.parse(q.answerGiven);
      if (data?.imageData) {
        return <img src={data.imageData} alt="Student drawing" className="max-w-xs border rounded" />;
      }
    } catch { /* fall through */ }
  }
  if (q.questionType === "multiple_choice") {
    const opts = parseOptions(q.options);
    const idx = parseInt(q.answerGiven, 10);
    const label = ["A", "B", "C", "D"][idx];
    return <span className="font-medium">{label ? `${label}: ${opts[idx] ?? q.answerGiven}` : q.answerGiven}</span>;
  }
  return <span className="font-medium">{q.answerGiven}</span>;
}

function renderCorrectAnswer(q: QuestionDetail) {
  if (q.questionType === "multiple_choice") {
    const opts = parseOptions(q.options);
    try {
      const idx = parseInt(q.correctAnswer, 10);
      const label = ["A", "B", "C", "D"][idx];
      return <span>{label ? `${label}: ${opts[idx] ?? q.correctAnswer}` : q.correctAnswer}</span>;
    } catch { return <span>{q.correctAnswer}</span>; }
  }
  return <span>{q.correctAnswer}</span>;
}

function QuestionRow({ q, attemptId, onUpdated }: { q: QuestionDetail; attemptId: number; onUpdated: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newPoints, setNewPoints] = useState(q.pointsEarned);
  const utils = trpc.useUtils();

  const override = trpc.teacher.overrideAnswerScore.useMutation({
    onSuccess: () => {
      toast.success("Mark updated");
      setEditing(false);
      utils.teacher.getStudentAttemptDetail.invalidate({ attemptId });
      onUpdated();
    },
    onError: (e) => toast.error(e.message),
  });

  const statusIcon = q.isCorrect === true
    ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
    : q.isCorrect === false
    ? <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
    : <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />;

  const rowBg = q.isCorrect === true ? "bg-green-50" : q.isCorrect === false ? "bg-red-50" : "bg-amber-50";

  return (
    <div className={`border rounded-lg overflow-hidden mb-2 ${rowBg}`}>
      {/* Summary row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:brightness-95 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        {statusIcon}
        <span className="text-xs font-bold text-gray-500 w-6">{q.questionId}</span>
        <span className="flex-1 text-sm text-gray-800 truncate">{q.questionText}</span>
        <span className="text-xs text-gray-500 mr-2">{q.subject} · {q.contentDomain}</span>

        {/* Points badge */}
        <div className="flex items-center gap-1">
          {editing ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="number"
                min={0}
                max={q.maxPoints}
                step={1}
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                className="w-14 text-center border rounded px-1 py-0.5 text-sm"
              />
              <span className="text-xs text-gray-500">/ {q.maxPoints}</span>
              <button
                onClick={() => {
                  if (q.answerId == null) { toast.error("No answer recorded"); return; }
                  override.mutate({
                    answerId: q.answerId,
                    attemptId,
                    pointsEarned: newPoints,
                    isCorrect: newPoints > 0,
                  });
                }}
                className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => { setEditing(false); setNewPoints(q.pointsEarned); }}
                className="p-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <>
              <span className={`text-sm font-bold ${q.isCorrect ? "text-green-700" : q.isCorrect === false ? "text-red-700" : "text-amber-700"}`}>
                {q.pointsEarned}/{q.maxPoints}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(true); setNewPoints(q.pointsEarned); }}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Override mark"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/50 bg-white/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-600 mb-1">Question</p>
            <p className="text-gray-800">{q.questionText}</p>
            <p className="text-xs text-gray-400 mt-1">Type: {q.questionType} · Session: {q.session ?? "—"}</p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-gray-600">Student Answer</p>
              <div className="mt-0.5">{renderAnswer(q)}</div>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Correct Answer</p>
              <div className="mt-0.5 text-green-700">{renderCorrectAnswer(q)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnswerReview() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { data: rawClasses } = trpc.teacher.myClasses.useQuery(undefined, { enabled: isAuth });
  const classes = (rawClasses as Array<{ id: number; name: string }> | undefined) ?? [];

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<"All" | "Math" | "Science">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Correct" | "Wrong" | "Pending">("All");

  const { data: classExams } = trpc.teacher.classExams.useQuery(
    { classId: selectedClassId! },
    { enabled: !!selectedClassId }
  );

  const { data: classProgress } = trpc.teacher.classProgress.useQuery(
    { classId: selectedClassId!, examId: selectedExamId! },
    { enabled: !!selectedClassId && !!selectedExamId }
  );

  const { data: attemptDetail, refetch: refetchDetail } = trpc.teacher.getStudentAttemptDetail.useQuery(
    { attemptId: selectedAttemptId! },
    { enabled: !!selectedAttemptId }
  );

  const questions: QuestionDetail[] = (attemptDetail?.questions ?? []) as QuestionDetail[];
  const filteredQuestions = questions.filter((q) => {
    if (subjectFilter !== "All" && q.subject !== subjectFilter) return false;
    if (statusFilter === "Correct" && q.isCorrect !== true) return false;
    if (statusFilter === "Wrong" && q.isCorrect !== false) return false;
    if (statusFilter === "Pending" && q.isCorrect !== null) return false;
    return true;
  });

  const totalScore = questions.reduce((s, q) => s + q.pointsEarned, 0);
  const maxScore = questions.reduce((s, q) => s + q.maxPoints, 0);
  const correctCount = questions.filter((q) => q.isCorrect === true).length;
  const wrongCount = questions.filter((q) => q.isCorrect === false).length;
  const pendingCount = questions.filter((q) => q.isCorrect === null).length;

  return (
    <PlatformLayout title="Answer Review">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Answer Review & Mark Adjustment</h2>
          <p className="text-sm text-gray-500 mt-0.5">Inspect every student answer and override marks where needed</p>
        </div>

        {/* Step 1: Class */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">1. Select Class</p>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedClassId(c.id); setSelectedExamId(null); setSelectedAttemptId(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedClassId === c.id ? "bg-[oklch(0.42_0.14_240)] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Exam */}
        {selectedClassId && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">2. Select Exam</p>
            <div className="flex flex-wrap gap-2">
              {(classExams ?? []).map((e: { examId: number; examName: string }) => (
                <button
                  key={e.examId}
                  onClick={() => { setSelectedExamId(e.examId); setSelectedAttemptId(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedExamId === e.examId ? "bg-[oklch(0.42_0.14_240)] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {e.examName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Student */}
        {selectedExamId && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">3. Select Student</p>
            {!classProgress?.length ? (
              <p className="text-sm text-gray-400">No submitted attempts yet for this exam.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Student</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Score</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {classProgress.map((a: { id: number; studentName: string; status: string; totalScore: number | null; totalMaxPoints: number | null; percentage: number | null }) => (
                      <tr
                        key={a.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedAttemptId === a.id ? "bg-blue-50" : ""}`}
                        onClick={() => setSelectedAttemptId(a.id)}
                      >
                        <td className="px-3 py-2 font-medium text-gray-900">{a.studentName}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            a.status === "submitted" ? "bg-green-100 text-green-700" :
                            a.status === "in_progress" ? "bg-amber-100 text-amber-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>{a.status}</span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {a.totalScore ?? 0}/{a.totalMaxPoints ?? "?"}
                          {a.percentage != null && <span className="text-xs text-gray-400 ml-1">({a.percentage}%)</span>}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedAttemptId(a.id); }}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              selectedAttemptId === a.id
                                ? "bg-[oklch(0.42_0.14_240)] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Answer Detail */}
        {selectedAttemptId && attemptDetail && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header stats */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Score</p>
                <p className="text-lg font-bold text-gray-900">{totalScore}/{maxScore}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4" /> {correctCount} correct
                </span>
                <span className="flex items-center gap-1 text-red-600 font-medium">
                  <XCircle className="w-4 h-4" /> {wrongCount} wrong
                </span>
                {pendingCount > 0 && (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <AlertCircle className="w-4 h-4" /> {pendingCount} pending
                  </span>
                )}
              </div>
              <div className="ml-auto flex gap-2">
                {(["All", "Math", "Science"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubjectFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      subjectFilter === s ? "bg-[oklch(0.42_0.14_240)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >{s}</button>
                ))}
                <div className="w-px bg-gray-200" />
                {(["All", "Correct", "Wrong", "Pending"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      statusFilter === s ? "bg-[oklch(0.42_0.14_240)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Questions list */}
            <div className="p-4">
              {filteredQuestions.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No questions match the current filters.</p>
              ) : (
                filteredQuestions.map((q) => (
                  <QuestionRow
                    key={q.questionId}
                    q={q}
                    attemptId={selectedAttemptId}
                    onUpdated={() => refetchDetail()}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
