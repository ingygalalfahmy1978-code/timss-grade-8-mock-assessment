import { trpc } from "@/lib/trpc";
import { AlertCircle, BookOpen, ChevronLeft, ChevronRight, Flag, Grid, LogOut, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { toast } from "sonner";

type Question = {
  id: number;
  subject: string;
  contentDomain: string;
  cognitiveDomain: string;
  difficulty: string;
  questionType: string;
  questionText: string;
  options: unknown;
  imageUrl: string | null;
};

type SavedAnswer = {
  questionId: number;
  answerGiven: string | null;
  isFlagged: boolean;
};

type ExamData = {
  attemptId: number;
  examName: string;
  durationMinutes: number;
  questions: Question[];
  savedAnswers: SavedAnswer[];
  startedAt: Date | null;
};

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamInterface() {
  const { examId, classId } = useParams<{ examId: string; classId: string }>();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [showOverview, setShowOverview] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startExam = trpc.student.startExam.useMutation();
  const saveAnswer = trpc.student.saveAnswer.useMutation();
  const submitExam = trpc.student.submitExam.useMutation();

  // Load exam on mount
  useEffect(() => {
    startExam.mutateAsync({ examId: Number(examId), classId: Number(classId) })
      .then((data) => {
        setExamData(data as ExamData);
        // Restore saved answers
        const savedMap: Record<number, string> = {};
        const savedFlags = new Set<number>();
        for (const a of data.savedAnswers) {
          if (a.answerGiven) savedMap[a.questionId] = a.answerGiven;
          if (a.isFlagged) savedFlags.add(a.questionId);
        }
        setAnswers(savedMap);
        setFlagged(savedFlags);
        // Calculate remaining time
        const elapsed = data.startedAt
          ? Math.floor((Date.now() - new Date(data.startedAt).getTime()) / 1000)
          : 0;
        const total = data.durationMinutes * 60;
        setTimeLeft(Math.max(0, total - elapsed));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load exam");
        setLoading(false);
      });
  }, [examId, classId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleAutoSubmit = useCallback(async () => {
    if (!examData || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      await submitExam.mutateAsync({ attemptId: examData.attemptId, timeSpentSeconds });
      navigate(`/student/exam/${examId}/${classId}/complete`);
    } catch (e) {
      toast.error("Auto-submit failed. Please submit manually.");
      setIsSubmitting(false);
    }
  }, [examData, isSubmitting, examId, classId]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Debounced save
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (!examData) return;
      saveAnswer.mutate({
        attemptId: examData.attemptId,
        questionId,
        answerGiven: value,
        isFlagged: flagged.has(questionId),
      });
    }, 800);
  };

  const handleToggleFlag = (questionId: number) => {
    const newFlagged = new Set(flagged);
    const isFlagged = newFlagged.has(questionId);
    if (isFlagged) newFlagged.delete(questionId);
    else newFlagged.add(questionId);
    setFlagged(newFlagged);
    if (!examData) return;
    saveAnswer.mutate({
      attemptId: examData.attemptId,
      questionId,
      answerGiven: answers[questionId] ?? null,
      isFlagged: !isFlagged,
    });
  };

  const handleSubmit = async () => {
    if (!examData) return;
    setIsSubmitting(true);
    try {
      const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      await submitExam.mutateAsync({ attemptId: examData.attemptId, timeSpentSeconds });
      navigate(`/student/exam/${examId}/${classId}/complete`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-2 border-[oklch(0.42_0.14_240)] border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-gray-600 font-medium">Loading your exam...</div>
          <div className="text-gray-400 text-sm mt-1">Please wait</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cannot Load Exam</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => navigate("/student")} className="px-4 py-2 bg-[oklch(0.42_0.14_240)] text-white rounded-lg text-sm font-medium">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!examData) return null;

  const questions = examData.questions;
  const currentQ = questions[currentIndex];
  const options = currentQ?.options as Array<{ label: string; text: string }> | null;
  const answeredCount = Object.keys(answers).filter((k) => answers[Number(k)]).length;
  const isTimeLow = timeLeft !== null && timeLeft < 300;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_240)] flex flex-col">
      {/* Top bar */}
      <header className="bg-[oklch(0.20_0.06_240)] text-white px-4 py-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.42_0.14_240)] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm">{examData.examName}</div>
              <div className="text-white/50 text-xs">Grade 8 Assessment</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold ${
              isTimeLow ? "bg-red-600 text-white animate-pulse" : "bg-white/10 text-white"
            }`}>
              <span className="text-xs font-normal opacity-70">TIME</span>
              {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
            </div>

            {/* Overview toggle */}
            <button
              onClick={() => setShowOverview(!showOverview)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              <Grid className="w-3.5 h-3.5" />
              Overview
            </button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 flex-shrink-0">
        <div
          className="h-full bg-[oklch(0.65_0.14_200)] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main exam area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Question header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentQ?.subject === "Mathematics" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {currentQ?.subject}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {currentQ?.contentDomain}
                </span>
              </div>
              <button
                onClick={() => handleToggleFlag(currentQ.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  flagged.has(currentQ.id)
                    ? "bg-amber-100 text-amber-700 border border-amber-300"
                    : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {flagged.has(currentQ.id) ? "Flagged" : "Flag for Review"}
              </button>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
              {/* Question text */}
              <div className="p-8 border-b border-gray-100">
                <div className="text-base leading-relaxed text-gray-900 font-medium">
                  {currentQ?.questionText}
                </div>
                {currentQ?.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={currentQ.imageUrl}
                      alt="Question diagram"
                      className="max-w-full rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Answer area */}
              <div className="p-8">
                {currentQ?.questionType === "multiple_choice" && options ? (
                  <div className="space-y-3">
                    {options.map((opt) => {
                      const isSelected = answers[currentQ.id] === opt.label;
                      return (
                        <label
                          key={opt.label}
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-[oklch(0.42_0.14_240)] bg-[oklch(0.42_0.14_240)]/5"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${currentQ.id}`}
                            value={opt.label}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(currentQ.id, opt.label)}
                            className="mt-0.5 w-4 h-4 accent-[oklch(0.42_0.14_240)] flex-shrink-0"
                          />
                          <div className="flex items-start gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                              isSelected ? "bg-[oklch(0.42_0.14_240)] text-white" : "bg-gray-100 text-gray-600"
                            }`}>
                              {opt.label}
                            </span>
                            <span className="text-gray-800 leading-relaxed pt-0.5">{opt.text}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer:
                    </label>
                    <textarea
                      value={answers[currentQ?.id ?? 0] ?? ""}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      placeholder="Type your answer here..."
                      rows={4}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[oklch(0.42_0.14_240)] resize-none text-sm leading-relaxed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Write your complete answer. Show your working where applicable.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="text-sm text-gray-500">
                {answeredCount}/{questions.length} answered
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[oklch(0.42_0.14_240)] text-white rounded-xl font-medium text-sm hover:bg-[oklch(0.38_0.14_240)] transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Review & Submit
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Overview panel */}
        {showOverview && (
          <aside className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Question Overview</h3>
              <button onClick={() => setShowOverview(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isFlaggedQ = flagged.has(q.id);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => { setCurrentIndex(idx); setShowOverview(false); }}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        isCurrent ? "ring-2 ring-[oklch(0.42_0.14_240)] ring-offset-1" : ""
                      } ${
                        isFlaggedQ ? "bg-amber-100 text-amber-700 border border-amber-300" :
                        isAnswered ? "bg-[oklch(0.42_0.14_240)] text-white" :
                        "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[oklch(0.42_0.14_240)]" />
                  <span className="text-gray-600">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
                  <span className="text-gray-600">Flagged ({flagged.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100" />
                  <span className="text-gray-600">Not answered ({questions.length - answeredCount})</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Exam
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Submit confirmation modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Submit Your Exam?</h2>
              <p className="text-gray-500 text-sm mt-2">
                Once submitted, you cannot change your answers.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total questions</span>
                <span className="font-semibold">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Answered</span>
                <span className="font-semibold text-green-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unanswered</span>
                <span className={`font-semibold ${questions.length - answeredCount > 0 ? "text-amber-600" : "text-green-600"}`}>
                  {questions.length - answeredCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Flagged</span>
                <span className="font-semibold text-amber-600">{flagged.size}</span>
              </div>
            </div>

            {questions.length - answeredCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-amber-700">You have {questions.length - answeredCount} unanswered question(s). These will be marked as incorrect.</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200"
              >
                Continue Review
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
