import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BookOpen, ChevronRight, Edit2, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminExams() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const utils = trpc.useUtils();
  const { data: exams, isLoading } = trpc.admin.listExams.useQuery(undefined, { enabled: isAuth });
  const createExam = trpc.admin.createExam.useMutation({ onSuccess: () => utils.admin.listExams.invalidate() });
  const updateExam = trpc.admin.updateExam.useMutation({ onSuccess: () => utils.admin.listExams.invalidate() });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", durationMinutes: 90 });

  const handleCreate = async () => {
    if (!form.name) { toast.error("Exam name is required"); return; }
    await createExam.mutateAsync(form);
    toast.success("Exam created");
    setShowAdd(false);
    setForm({ name: "", description: "", durationMinutes: 90 });
  };

  const togglePublish = async (id: number, current: boolean) => {
    await updateExam.mutateAsync({ id, isPublished: !current });
    toast.success(current ? "Exam unpublished" : "Exam published");
  };

  return (
    <PlatformLayout title="Manage Exams">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mock Exams</h2>
            <p className="text-sm text-gray-500 mt-0.5">Create and manage Grade 8 mock assessments</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[oklch(0.42_0.14_240)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[oklch(0.38_0.14_240)]"
          >
            <Plus className="w-4 h-4" />
            New Exam
          </button>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Create New Exam</h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mock Exam 7" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Optional description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} min={10} max={240} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 text-sm bg-[oklch(0.42_0.14_240)] text-white rounded-lg font-medium">Create Exam</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-3 text-center py-8 text-gray-400">Loading...</div>
          ) : (
            exams?.map((exam) => (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[oklch(0.42_0.14_240)]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[oklch(0.42_0.14_240)]" />
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      exam.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {exam.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                  {exam.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{exam.description}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">{exam.durationMinutes} minutes</div>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <Link href={`/admin/exams/${exam.id}`} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                    <Edit2 className="w-3 h-3" />
                    Edit Questions
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => togglePublish(exam.id, exam.isPublished)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                      exam.isPublished
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {exam.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
