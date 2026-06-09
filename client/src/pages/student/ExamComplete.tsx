import { BookOpen, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function ExamComplete() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_240)] flex flex-col">
      {/* Header */}
      <header className="bg-[oklch(0.20_0.06_240)] text-white px-6 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[oklch(0.42_0.14_240)] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Grade 8 Assessment Platform</div>
            <div className="text-white/50 text-xs">Exam Submission</div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Exam Submitted Successfully
            </h1>

            <p className="text-gray-600 leading-relaxed mb-8">
              Your answers have been recorded. Your teacher will review your results and provide feedback.
            </p>

            <button
              onClick={() => navigate("/student")}
              className="px-8 py-3 bg-[oklch(0.42_0.14_240)] hover:bg-[oklch(0.38_0.14_240)] text-white rounded-xl font-semibold transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
