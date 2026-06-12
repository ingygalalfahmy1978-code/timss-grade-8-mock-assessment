import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, Clock, Image, AlertCircle } from "lucide-react";

export default function DrawingReview() {
  const [, navigate] = useLocation();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  // Load classes and exams
  const { data: classes, isLoading: classesLoading } = trpc.teacher.myClasses.useQuery();
  const { data: exams, isLoading: examsLoading } = trpc.teacher.listAllExams.useQuery();

  // Load drawing answers when class+exam selected
  const { data: drawingAnswers, isLoading: answersLoading, refetch } = trpc.teacher.getDrawingAnswers.useQuery(
    { classId: selectedClassId!, examId: selectedExamId! },
    { enabled: !!selectedClassId && !!selectedExamId }
  );

  const reviewMutation = trpc.teacher.reviewDrawingAnswer.useMutation({
    onSuccess: () => {
      toast.success("Score saved successfully");
      refetch();
    },
    onError: (err) => toast.error(`Failed to save: ${err.message}`),
  });

  // Group answers by student
  const grouped = useMemo(() => {
    if (!drawingAnswers) return [];
    const map = new Map<string, typeof drawingAnswers>();
    for (const ans of drawingAnswers) {
      const key = `${ans.studentId}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ans);
    }
    return Array.from(map.entries()).map(([, answers]) => ({
      studentName: answers[0].studentName,
      studentId: answers[0].studentId,
      answers,
    }));
  }, [drawingAnswers]);

  const totalAnswers = drawingAnswers?.length ?? 0;
  const reviewedAnswers = drawingAnswers?.filter((a) => a.pointsEarned > 0 || a.reviewedAt).length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/reports")} className="gap-1.5">
              <ArrowLeft size={15} /> Back to Reports
            </Button>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <h1 className="text-lg font-bold text-slate-900">Drawing Canvas Review</h1>
              <p className="text-xs text-slate-500">Score student drawing responses (0, 1, or 2 points)</p>
            </div>
          </div>
          {totalAnswers > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant={reviewedAnswers === totalAnswers ? "default" : "secondary"}>
                {reviewedAnswers}/{totalAnswers} reviewed
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Class &amp; Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Class</label>
                {classesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={selectedClassId?.toString() ?? ""}
                    onValueChange={(v) => { setSelectedClassId(Number(v)); setSelectedExamId(null); }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(classes ?? []).map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Exam</label>
                {examsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={selectedExamId?.toString() ?? ""}
                    onValueChange={(v) => setSelectedExamId(Number(v))}
                    disabled={!selectedClassId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(exams ?? []).map((exam) => (
                        <SelectItem key={exam.id} value={exam.id.toString()}>{exam.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading state */}
        {answersLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No data states */}
        {!answersLoading && selectedClassId && selectedExamId && drawingAnswers?.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Image size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No drawing answers found</p>
              <p className="text-slate-400 text-sm mt-1">No students have submitted drawing canvas responses for this exam yet.</p>
            </CardContent>
          </Card>
        )}

        {!selectedClassId && (
          <Card>
            <CardContent className="py-16 text-center">
              <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Select a class and exam to begin reviewing</p>
            </CardContent>
          </Card>
        )}

        {/* Student groups */}
        {!answersLoading && grouped.map((group) => (
          <Card key={group.studentId} className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-800">{group.studentName}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {group.answers.length} drawing{group.answers.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-8">
              {group.answers.map((ans) => (
                <DrawingAnswerCard
                  key={ans.answerId}
                  answer={ans}
                  onScore={(points) =>
                    reviewMutation.mutate({
                      answerId: ans.answerId,
                      attemptId: ans.attemptId,
                      pointsEarned: points,
                    })
                  }
                  isSaving={reviewMutation.isPending}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Individual drawing answer card ──────────────────────────────────────────

interface DrawingAnswerCardProps {
  answer: {
    answerId: number;
    questionText: string;
    maxPoints: number;
    answerGiven: string | null;
    pointsEarned: number;
    reviewedAt: Date | null;
  };
  onScore: (points: number) => void;
  isSaving: boolean;
}

function DrawingAnswerCard({ answer, onScore, isSaving }: DrawingAnswerCardProps) {
  const [localScore, setLocalScore] = useState<number>(answer.pointsEarned);

  const scoreOptions = answer.maxPoints >= 2
    ? [0, 1, 2]
    : [0, 1];

  const scoreLabels: Record<number, string> = {
    0: "0 — No credit",
    1: "1 — Partial credit",
    2: "2 — Full credit",
  };

  const scoreColors: Record<number, string> = {
    0: "border-red-300 bg-red-50 text-red-700",
    1: "border-amber-300 bg-amber-50 text-amber-700",
    2: "border-green-300 bg-green-50 text-green-700",
  };

  const handleSave = () => onScore(localScore);

  return (
    <div className="space-y-4">
      {/* Question text */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Question</p>
        <p className="text-sm text-slate-800 leading-relaxed">{answer.questionText}</p>
        <p className="text-xs text-slate-500 mt-2">Max points: {answer.maxPoints}</p>
      </div>

      {/* Canvas image */}
      {answer.answerGiven ? (
        answer.answerGiven.startsWith("data:image") ? (
          <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
            <img
              src={answer.answerGiven}
              alt="Student drawing"
              className="w-full object-contain max-h-[500px]"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <Image size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Drawing data not in image format</p>
          </div>
        )
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
          <Clock size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No drawing submitted</p>
        </div>
      )}

      {/* Scoring controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm font-semibold text-slate-700 mr-1">Award points:</p>
        {scoreOptions.map((pts) => (
          <button
            key={pts}
            onClick={() => setLocalScore(pts)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
              localScore === pts
                ? scoreColors[pts] + " shadow-sm scale-105"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {scoreLabels[pts]}
          </button>
        ))}
        <Button
          onClick={handleSave}
          disabled={isSaving || localScore === answer.pointsEarned}
          size="sm"
          className="ml-auto gap-1.5"
        >
          <CheckCircle2 size={14} />
          {isSaving ? "Saving..." : "Save Score"}
        </Button>
      </div>

      {answer.reviewedAt && (
        <p className="text-xs text-slate-400">
          Last reviewed: {new Date(answer.reviewedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
