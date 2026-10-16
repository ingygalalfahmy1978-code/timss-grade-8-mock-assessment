import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GRADES, GRADE_LABEL, parseGrade } from "@shared/grades";

export default function AdminClasses() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const utils = trpc.useUtils();
  const { data: classes, isLoading } = trpc.admin.listClasses.useQuery(undefined, { enabled: isAuth });
  const { data: users } = trpc.admin.listUsers.useQuery(undefined, { enabled: isAuth });
  const { data: exams } = trpc.admin.listExams.useQuery(undefined, { enabled: isAuth });
  const createClass = trpc.admin.createClass.useMutation({ onSuccess: () => utils.admin.listClasses.invalidate() });
  const updateClass = trpc.admin.updateClass.useMutation({ onSuccess: () => utils.admin.listClasses.invalidate() });
  const deleteClass = trpc.admin.deleteClass.useMutation({ onSuccess: () => utils.admin.listClasses.invalidate() });
  const enrollStudent = trpc.admin.enrollStudent.useMutation({ onSuccess: () => utils.admin.listClasses.invalidate() });
  const removeStudent = trpc.admin.removeStudentFromClass.useMutation({ onSuccess: () => utils.admin.listClasses.invalidate() });
  const assignExam = trpc.admin.assignExamToClass.useMutation({ onSuccess: () => utils.admin.listClasses.invalidate() });

  const [showAdd, setShowAdd] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", teacherId: "", grade: GRADE_LABEL[8] });
  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [assignExamId, setAssignExamId] = useState("");

  const teachers = users?.filter((u) => u.role === "teacher") ?? [];
  const students = users?.filter((u) => u.role === "student") ?? [];

  const { data: classStudents } = trpc.admin.getClassStudents.useQuery(
    { classId: selectedClass! },
    { enabled: !!selectedClass }
  );

  const handleCreate = async () => {
    if (!form.name) { toast.error("Class name is required"); return; }
    await createClass.mutateAsync({ name: form.name, grade: form.grade, teacherId: form.teacherId ? Number(form.teacherId) : undefined });
    toast.success("Class created");
    setShowAdd(false);
    setForm({ name: "", teacherId: "", grade: GRADE_LABEL[8] });
  };

  return (
    <PlatformLayout title="Manage Classes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Classes</h2>
            <p className="text-sm text-gray-500 mt-0.5">{classes?.length ?? 0} classes</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-navy-dark"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Create New Class</h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={form.grade === GRADE_LABEL[4] ? "e.g. Class 4A" : "e.g. Class 8C"} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
                  <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    {GRADES.map((g) => <option key={g} value={GRADE_LABEL[g]}>{GRADE_LABEL[g]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign Teacher</label>
                  <select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="">— No teacher —</option>
                    {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 text-sm bg-brand-navy text-white rounded-lg font-medium">Create</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classes list */}
          <div className="lg:col-span-1 space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              classes?.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedClass(c.id)}
                  className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedClass === c.id ? "border-brand-navy shadow-md" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.grade}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        {c.studentCount}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm("Delete this class?")) deleteClass.mutateAsync({ id: c.id }); }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {c.teacherName && (
                    <div className="text-xs text-blue-600 mt-1.5">Teacher: {c.teacherName}</div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Class detail */}
          {selectedClass && (
            <div className="lg:col-span-2 space-y-4">
              {/* Class grade */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Class grade</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Students in this class only see exams for this grade.</p>
                </div>
                <select
                  value={parseGrade(classes?.find((c) => c.id === selectedClass)?.grade) ?? 8}
                  onChange={async (e) => {
                    await updateClass.mutateAsync({ id: selectedClass, grade: GRADE_LABEL[Number(e.target.value) as 4 | 8] });
                    toast.success("Class grade updated");
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {GRADES.map((g) => <option key={g} value={g}>{GRADE_LABEL[g]}</option>)}
                </select>
              </div>

              {/* Enroll student */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Enroll Student</h4>
                <div className="flex gap-2">
                  <select
                    value={enrollStudentId}
                    onChange={(e) => setEnrollStudentId(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select student...</option>
                    {students.filter((s) => !classStudents?.find((cs) => cs.id === s.id)).map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                    ))}
                  </select>
                  <button
                    onClick={async () => {
                      if (!enrollStudentId) return;
                      await enrollStudent.mutateAsync({ studentId: Number(enrollStudentId), classId: selectedClass });
                      setEnrollStudentId("");
                      toast.success("Student enrolled");
                    }}
                    className="px-4 py-2 bg-brand-navy text-white rounded-lg text-sm font-medium"
                  >
                    Enroll
                  </button>
                </div>
              </div>

              {/* Students in class */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900">Students in Class ({classStudents?.length ?? 0})</h4>
                </div>
                <div className="divide-y divide-gray-50">
                  {classStudents?.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">No students enrolled yet</div>
                  ) : (
                    classStudents?.map((s) => (
                      <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{s.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{s.username}</div>
                        </div>
                        <button
                          onClick={async () => {
                            await removeStudent.mutateAsync({ studentId: s.id, classId: selectedClass });
                            toast.success("Student removed from class");
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Assign exam */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Assign Exam to Class</h4>
                <div className="flex gap-2">
                  <select
                    value={assignExamId}
                    onChange={(e) => setAssignExamId(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select exam...</option>
                    {exams
                      ?.filter((e) => {
                        const g = parseGrade(classes?.find((c) => c.id === selectedClass)?.grade);
                        return g === null || e.grade === g;
                      })
                      .map((e) => <option key={e.id} value={e.id}>{e.name} (Grade {e.grade})</option>)}
                  </select>
                  <button
                    onClick={async () => {
                      if (!assignExamId) return;
                      try {
                        await assignExam.mutateAsync({ classId: selectedClass, examId: Number(assignExamId) });
                        setAssignExamId("");
                        toast.success("Exam assigned and activated");
                      } catch (e: unknown) {
                        toast.error((e as Error).message || "Could not assign the exam");
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
                  >
                    Assign & Activate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
