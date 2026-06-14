import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { BookOpen, ChevronRight, Edit2, Plus, Users, CheckCircle, AlertCircle, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminExams() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const utils = trpc.useUtils();
  const { data: exams, isLoading } = trpc.admin.listExams.useQuery(undefined, { enabled: isAuth });
  const { data: classes } = trpc.admin.listClasses.useQuery(undefined, { enabled: isAuth });
  const createExam = trpc.admin.createExam.useMutation({ onSuccess: () => utils.admin.listExams.invalidate() });
  const updateExam = trpc.admin.updateExam.useMutation({ onSuccess: () => utils.admin.listExams.invalidate() });
  const assignExam = trpc.admin.assignExamToClass.useMutation({
    onSuccess: () => {
      utils.admin.getExamAssignments.invalidate();
      utils.admin.listExams.invalidate();
    },
  });
  const deactivateExam = trpc.admin.deactivateExamFromClass.useMutation({
    onSuccess: () => {
      utils.admin.getExamAssignments.invalidate();
      utils.admin.listExams.invalidate();
    },
  });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", durationMinutes: 90 });
  const [assignExamId, setAssignExamId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const deleteExam = trpc.admin.deleteExam.useMutation({
    onSuccess: () => {
      utils.admin.listExams.invalidate();
      setDeleteConfirmId(null);
      toast.success("Exam deleted successfully.");
    },
    onError: () => toast.error("Failed to delete exam."),
  });
  const examToDelete = exams?.find((e) => e.id === deleteConfirmId);

  // Fetch assignments for the currently selected exam
  const { data: examAssignments } = trpc.admin.getExamAssignments.useQuery(
    { examId: assignExamId! },
    { enabled: assignExamId !== null }
  );

  const handleCreate = async () => {
    if (!form.name) { toast.error("Exam name is required"); return; }
    await createExam.mutateAsync(form);
    toast.success("Exam created — add questions then publish and assign it to classes.");
    setShowAdd(false);
    setForm({ name: "", description: "", durationMinutes: 90 });
  };

  const togglePublish = async (id: number, current: boolean) => {
    await updateExam.mutateAsync({ id, isPublished: !current });
    if (!current) {
      toast.success("Exam published! Now assign it to classes so students can see it.");
    } else {
      toast.success("Exam unpublished.");
    }
  };

  const handleToggleClass = async (classId: number, examId: number, isCurrentlyActive: boolean) => {
    if (isCurrentlyActive) {
      await deactivateExam.mutateAsync({ classId, examId });
      toast.success("Exam removed from class — students in this class can no longer see it.");
    } else {
      await assignExam.mutateAsync({ classId, examId });
      toast.success("Exam assigned to class — students can now see and take this exam!");
    }
  };

  const selectedExam = exams?.find((e) => e.id === assignExamId);

  return (
    <PlatformLayout title="Manage Exams">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mock Exams</h2>
            <p className="text-sm text-gray-500 mt-0.5">Create, publish, and assign exams to classes</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[oklch(0.42_0.14_240)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[oklch(0.38_0.14_240)]"
          >
            <Plus className="w-4 h-4" />
            New Exam
          </button>
        </div>

        {/* Workflow guide banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">How to make an exam visible to students:</p>
          <div className="flex items-center gap-2 text-sm text-blue-700 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span> Create exam &amp; add questions</span>
            <ChevronRight className="w-4 h-4 text-blue-400" />
            <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span> Click <strong>Publish</strong></span>
            <ChevronRight className="w-4 h-4 text-blue-400" />
            <span className="flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span> Click <strong>Assign to Classes</strong> and select which classes can take it</span>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId !== null && examToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
              <div className="px-6 py-5">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Delete Exam?</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Are you sure you want to delete <strong>{examToDelete.name}</strong>? This will permanently remove the exam, all its questions, class assignments, and any student attempts and reports. This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => deleteExam.mutate({ examId: deleteConfirmId })}
                  disabled={deleteExam.isPending}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteExam.isPending ? "Deleting..." : "Delete Exam"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Exam Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Create New Exam</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
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

        {/* Assign to Classes Modal */}
        {assignExamId !== null && selectedExam && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Assign to Classes</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedExam.name} — toggle classes to make this exam visible to their students</p>
                </div>
                <button onClick={() => setAssignExamId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="px-6 py-4 space-y-2 max-h-80 overflow-y-auto">
                {!classes || classes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No classes found. Create a class first.</p>
                ) : (
                  classes.map((cls) => {
                    const assignment = examAssignments?.find((a) => a.classId === cls.id);
                    const isActive = assignment?.isActive ?? false;
                    return (
                      <div key={cls.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isActive ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
                        <div className="flex items-center gap-3">
                          {isActive ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                            {isActive && <p className="text-xs text-green-600">Students can see this exam</p>}
                            {!isActive && <p className="text-xs text-gray-400">Not assigned</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleClass(cls.id, assignExamId, isActive)}
                          disabled={assignExam.isPending || deactivateExam.isPending}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {isActive ? "Remove" : "Assign"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button onClick={() => setAssignExamId(null)} className="px-4 py-2 text-sm bg-[oklch(0.42_0.14_240)] text-white rounded-lg font-medium">Done</button>
              </div>
            </div>
          </div>
        )}

        {/* Exam Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-3 text-center py-8 text-gray-400">Loading...</div>
          ) : (
            exams?.map((exam) => {
              return (
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

                    {/* Warning if published but not assigned */}
                    {exam.isPublished && (
                      <div className="mt-3 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-2">
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>Click <strong>Assign to Classes</strong> below so students can see this exam.</span>
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                    <Link href={`/admin/exams/${exam.id}`} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                      <Edit2 className="w-3 h-3" />
                      Edit Questions
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAssignExamId(exam.id)}
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        Assign to Classes
                      </button>
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
                      <button
                        onClick={() => setDeleteConfirmId(exam.id)}
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        title="Delete exam"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
