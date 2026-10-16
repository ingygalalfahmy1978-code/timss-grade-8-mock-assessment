import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BookOpen, BarChart3, ClipboardList, GraduationCap, Users, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

function ResetStudentDataButton() {
  const [confirming, setConfirming] = useState(false);
  const resetMutation = trpc.admin.resetAllStudentData.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setConfirming(false);
    },
    onError: (err) => {
      toast.error(`Reset failed: ${err.message}`);
      setConfirming(false);
    },
  });

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-700 font-medium">Are you sure? This cannot be undone.</span>
        <button
          onClick={() => resetMutation.mutate()}
          disabled={resetMutation.isPending}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {resetMutation.isPending ? "Resetting..." : "Yes, Reset All"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-lg transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Reset All Student Data
    </button>
  );
}

export default function AdminDashboard() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { data: users } = trpc.admin.listUsers.useQuery(undefined, { enabled: isAuth });
  const { data: classes } = trpc.admin.listClasses.useQuery(undefined, { enabled: isAuth });
  const { data: questions } = trpc.admin.listQuestions.useQuery(undefined, { enabled: isAuth });
  const { data: exams } = trpc.admin.listExams.useQuery(undefined, { enabled: isAuth });

  const students = users?.filter((u) => u.role === "student") ?? [];
  const teachers = users?.filter((u) => u.role === "teacher") ?? [];

  const stats = [
    { label: "Students", value: students.length, icon: <GraduationCap className="w-6 h-6" />, href: "/admin/students", color: "bg-blue-500" },
    { label: "Teachers", value: teachers.length, icon: <Users className="w-6 h-6" />, href: "/admin/teachers", color: "bg-indigo-500" },
    { label: "Classes", value: classes?.length ?? 0, icon: <BookOpen className="w-6 h-6" />, href: "/admin/classes", color: "bg-violet-500" },
    { label: "Questions", value: questions?.length ?? 0, icon: <ClipboardList className="w-6 h-6" />, href: "/admin/questions", color: "bg-sky-500" },
  ];

  return (
    <PlatformLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-navy-dark rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold">Welcome to the Assessment Platform</h2>
          <p className="text-white/80 mt-1 text-sm">
            Manage students, teachers, question banks, and mock exams from this dashboard.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}>
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer group">
                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Exams Overview */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Mock Exams</h3>
            <Link href="/admin/exams" className="text-sm text-blue-600 hover:underline">
              Manage Exams →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {exams?.map((exam) => (
              <div key={exam.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{exam.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{exam.durationMinutes} minutes</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    exam.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {exam.isPublished ? "Published" : "Draft"}
                  </span>
                  <Link href={`/admin/exams/${exam.id}`} className="text-xs text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone: Reset All Student Data */}
        <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-100 bg-red-50">
            <h3 className="font-semibold text-red-800 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Danger Zone</h3>
          </div>
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 text-sm">Reset All Student Exam Data</div>
              <div className="text-xs text-gray-500 mt-0.5">Deletes all attempts, answers, reports, and questionnaire responses. This cannot be undone.</div>
            </div>
            <ResetStudentDataButton />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Link href="/admin/students">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
              <GraduationCap className="w-8 h-8 text-blue-500 mb-3" />
              <div className="font-semibold text-gray-900">Manage Students</div>
              <div className="text-sm text-gray-500 mt-1">Add, edit, and generate credentials</div>
            </div>
          </Link>
          <Link href="/admin/questions">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
              <ClipboardList className="w-8 h-8 text-indigo-500 mb-3" />
              <div className="font-semibold text-gray-900">Question Bank</div>
              <div className="text-sm text-gray-500 mt-1">Add and tag assessment questions</div>
            </div>
          </Link>
          <Link href="/admin/exams">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
              <BookOpen className="w-8 h-8 text-violet-500 mb-3" />
              <div className="font-semibold text-gray-900">Manage Exams</div>
              <div className="text-sm text-gray-500 mt-1">Create and assign mock exams</div>
            </div>
          </Link>
          <Link href="/admin/analytics">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
              <BarChart3 className="w-8 h-8 text-green-500 mb-3" />
              <div className="font-semibold text-gray-900">Analytics</div>
              <div className="text-sm text-gray-500 mt-1">Class performance & insights</div>
            </div>
          </Link>
        </div>
      </div>
    </PlatformLayout>
  );
}
