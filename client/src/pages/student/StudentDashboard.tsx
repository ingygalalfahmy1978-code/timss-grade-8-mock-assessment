import { trpc } from "@/lib/trpc";
import { BrandStripe, SchoolCrest } from "@/components/SchoolBrand";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BookOpen, Clock, LogOut, AlertCircle, BarChart2, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user, logout } = usePlatformAuth();

  const {
    data: availableExams,
    isLoading: examsLoading,
    isError,
    error,
  } = trpc.student.availableExams.useQuery(undefined, {
    retry: false,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: false,
  });

  const grades = Array.from(new Set((availableExams ?? []).map((e) => e.exam.grade)));
  const headerGrade = grades.length === 1 ? `Grade ${grades[0]}` : "TIMSS";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-navy-deep text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SchoolCrest />
            <div className="min-w-0">
              <div className="font-brand text-sm uppercase tracking-wide leading-tight">American School of Creative Science</div>
              <div className="text-white/60 text-xs">{headerGrade} TIMSS Mock Assessment · Mathematics &amp; Science</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-white/50 text-xs font-mono">{(user as any)?.username}</div>
            </div>
            <Link href="/student/progress">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors">
                <TrendingUp className="w-3.5 h-3.5" />
                My Progress
              </button>
            </Link>
            <Link href="/student/results">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                My Results
              </button>
            </Link>
            <button
              onClick={logout}
              className="p-2 text-white/60 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      <BrandStripe />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name?.split(" ")[0] ?? "Student"}
          </h1>
          <p className="text-gray-500 mt-1">Your available assessments are shown below.</p>
        </div>

        {examsLoading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p>Loading your exams...</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl border border-red-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Could not load exams</h3>
            <p className="text-gray-400 text-sm mt-2">
              {(error as any)?.message ?? "An error occurred. Please refresh the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : !availableExams || availableExams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No Exams Available</h3>
            <p className="text-gray-400 text-sm mt-2">
              Your teacher has not activated any exams yet. Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableExams.map((item) => (
              <div
                key={`${item.exam.id}-${item.classId}`}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{item.exam.name}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{item.className}</p>
                        {item.exam.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.exam.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {item.exam.durationMinutes} minutes
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            Grade {item.exam.grade} · Math &amp; Science
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {item.attemptStatus === "submitted" ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          ✓ Submitted
                        </span>
                      ) : item.attemptStatus === "in_progress" ? (
                        <Link href={`/student/exam/${item.exam.id}/${item.classId}`}>
                          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-colors">
                            Continue Exam
                          </button>
                        </Link>
                      ) : (
                        <Link href={`/student/exam/${item.exam.id}/${item.classId}/instructions`}>
                          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors">
                            Start Exam
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
