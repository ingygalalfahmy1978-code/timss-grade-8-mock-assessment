import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BookOpen, Clock, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user, logout } = usePlatformAuth();
  const { data: availableExams, isLoading } = trpc.student.availableExams.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[oklch(0.20_0.06_240)] text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[oklch(0.42_0.14_240)] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Grade 8 Assessment Platform</div>
              <div className="text-white/50 text-xs">Mathematics & Science</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-white/50 text-xs font-mono">{user?.username}</div>
            </div>
            <button onClick={logout} className="p-2 text-white/60 hover:text-white transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(" ")[0]}</h1>
          <p className="text-gray-500 mt-1">Your available assessments are shown below.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading your exams...
          </div>
        ) : availableExams?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No Exams Available</h3>
            <p className="text-gray-400 text-sm mt-2">
              Your teacher has not activated any exams yet. Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableExams?.map((item) => (
              <div key={`${item.exam.id}-${item.classId}`} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[oklch(0.42_0.14_240)]/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-[oklch(0.42_0.14_240)]" />
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
                            Grade 8 · Math & Science
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {item.attemptStatus === "submitted" ? (
                        <div className="text-center">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            ✓ Submitted
                          </span>
                        </div>
                      ) : item.attemptStatus === "in_progress" ? (
                        <Link href={`/student/exam/${item.exam.id}/${item.classId}`}>
                          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-colors">
                            Continue Exam
                          </button>
                        </Link>
                      ) : (
                        <Link href={`/student/exam/${item.exam.id}/${item.classId}/instructions`}>
                          <button className="px-5 py-2.5 bg-[oklch(0.42_0.14_240)] hover:bg-[oklch(0.38_0.14_240)] text-white rounded-xl font-semibold text-sm transition-colors">
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
