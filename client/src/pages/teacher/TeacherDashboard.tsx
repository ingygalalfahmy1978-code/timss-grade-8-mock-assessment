import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BookOpen, ChevronRight, Users } from "lucide-react";
import { Link } from "wouter";

export default function TeacherDashboard() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { data: rawClasses } = trpc.teacher.myClasses.useQuery(undefined, { enabled: isAuth });
  const classes = rawClasses as Array<{ id: number; name: string; grade: string; teacherId: number | null; studentCount?: number }> | undefined;
  const { data: allExams } = trpc.teacher.listAllExams.useQuery(undefined, { enabled: isAuth });

  return (
    <PlatformLayout title="Teacher Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-[oklch(0.42_0.14_240)] to-[oklch(0.35_0.12_240)] rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>
          <p className="text-white/80 mt-1 text-sm">
            Manage your classes, activate exams, and track student progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{classes?.length ?? 0}</div>
            <div className="text-sm text-gray-500 mt-0.5">My Classes</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {classes?.reduce((sum, c) => sum + ((c as { studentCount?: number }).studentCount ?? 0), 0) ?? 0}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">Total Students</div>
          </div>
        </div>

        {/* My Classes */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">My Classes</h3>
            <Link href="/teacher/classes" className="text-sm text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {classes?.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No classes assigned yet.</div>
            ) : (
              classes?.map((c) => (
                <Link key={c.id} href={`/teacher/classes/${c.id}`}>
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{(c as { studentCount?: number }).studentCount ?? 0} students</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Available Exams */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Available Mock Exams</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {allExams?.map((exam) => (
              <div key={exam.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{exam.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{exam.durationMinutes} minutes</div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  exam.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {exam.isPublished ? "Available" : "Not Published"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
