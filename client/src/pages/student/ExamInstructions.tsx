import { trpc } from "@/lib/trpc";
import { AlertCircle, BookOpen, CheckCircle, Clock, Flag, Monitor } from "lucide-react";
import { useParams, useLocation } from "wouter";

export default function ExamInstructions() {
  const { examId, classId } = useParams<{ examId: string; classId: string }>();
  const [, navigate] = useLocation();

  const { data: availableExams } = trpc.student.availableExams.useQuery();
  const examItem = availableExams?.find(
    (e) => e.exam.id === Number(examId) && e.classId === Number(classId)
  );
  const examData = examItem ? { name: examItem.exam.name, durationMinutes: examItem.exam.durationMinutes, questionCount: 0 } : null;

  const startExam = trpc.student.startExam.useMutation({
    onSuccess: () => {
      navigate(`/student/exam/${examId}/${classId}`);
    },
  });

  const handleStart = () => {
    startExam.mutate({ examId: Number(examId), classId: Number(classId) });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[oklch(0.20_0.06_240)] text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[oklch(0.42_0.14_240)] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Grade 8 Assessment Platform</div>
            <div className="text-white/50 text-xs">Exam Instructions</div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {/* Exam title */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-[oklch(0.42_0.14_240)] px-8 py-6 text-white">
            <h1 className="text-2xl font-bold">{examData?.name ?? "Loading..."}</h1>
            <p className="text-white/80 mt-1">Grade 8 Mathematics & Science Assessment</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {examData?.durationMinutes ?? 90} minutes
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {examData?.questionCount ?? 0} questions
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Important Instructions
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Time Limit</div>
                <div className="text-sm text-gray-600 mt-0.5">
                  You have <strong>{examData?.durationMinutes ?? 90} minutes</strong> to complete this exam. A countdown timer will be displayed throughout. When time expires, your answers will be submitted automatically.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Monitor className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Navigation</div>
                <div className="text-sm text-gray-600 mt-0.5">
                  Questions are displayed <strong>one at a time</strong>. Use the <strong>Next</strong> and <strong>Previous</strong> buttons to move between questions. You can also click any question number in the overview panel to jump directly to it.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Flag className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Flagging Questions</div>
                <div className="text-sm text-gray-600 mt-0.5">
                  If you are unsure about a question, click the <strong>Flag for Review</strong> button to mark it. You can return to flagged questions before submitting.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Submission</div>
                <div className="text-sm text-gray-600 mt-0.5">
                  Once you click <strong>Submit Exam</strong>, your answers will be recorded and <strong>you cannot make changes</strong>. Review all your answers before submitting. You will see a confirmation message after submission.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Question Types</div>
                <div className="text-sm text-gray-600 mt-0.5">
                  This exam includes <strong>multiple choice</strong> questions (select one answer) and <strong>short answer</strong> questions (type your answer). Read each question carefully before answering.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic integrity notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-800">Academic Integrity Notice</div>
              <div className="text-sm text-amber-700 mt-1">
                This is an individual assessment. You must complete this exam independently without assistance from others. The use of unauthorized materials or communication with other students during the exam is strictly prohibited.
              </div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={startExam.isPending || !examData}
            className="px-10 py-4 bg-[oklch(0.42_0.14_240)] hover:bg-[oklch(0.38_0.14_240)] text-white rounded-xl font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {startExam.isPending ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Starting Exam...
              </span>
            ) : (
              "Begin Exam →"
            )}
          </button>
          <p className="text-sm text-gray-400 mt-3">
            By clicking "Begin Exam", you confirm that you have read and understood the instructions above.
          </p>
        </div>
      </main>
    </div>
  );
}
