import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { parseGrade } from "@shared/grades";
import { ChevronRight, Play, Square, Users } from "lucide-react";

type ClassItem = { id: number; name: string; grade: string; teacherId: number | null; studentCount?: number };

export default function TeacherClasses() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const utils = trpc.useUtils();
  const { data: rawClasses } = trpc.teacher.myClasses.useQuery(undefined, { enabled: isAuth });
  const classes = (rawClasses as ClassItem[] | undefined) ?? [];
  const { data: allExams } = trpc.teacher.listAllExams.useQuery(undefined, { enabled: isAuth });
  const activateExam = trpc.teacher.activateExam.useMutation({ onSuccess: () => utils.teacher.classExams.invalidate() });
  const deactivateExam = trpc.teacher.deactivateExam.useMutation({ onSuccess: () => utils.teacher.classExams.invalidate() });

  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState("");

  const { data: classExams } = trpc.teacher.classExams.useQuery(
    { classId: selectedClass! },
    { enabled: !!selectedClass }
  );

  const activeExam = classExams?.find((e) => e.isActive);

  const handleActivate = async () => {
    if (!selectedClass || !selectedExamId) { toast.error("Select a class and exam"); return; }
    try {
      await activateExam.mutateAsync({ classId: selectedClass, examId: Number(selectedExamId) });
      toast.success("Exam activated for class");
      setSelectedExamId("");
    } catch (e: unknown) {
      toast.error((e as Error).message || "Could not activate the exam");
    }
  };

  const handleDeactivate = async (examId: number) => {
    if (!selectedClass) return;
    await deactivateExam.mutateAsync({ classId: selectedClass, examId });
    toast.success("Exam deactivated");
  };

  return (
    <PlatformLayout title="My Classes">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Classes</h2>
          <p className="text-sm text-gray-500 mt-0.5">Select a class to manage exam activation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classes list */}
          <div className="space-y-3">
            {classes.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400 text-sm">
                No classes assigned to you yet.
              </div>
            ) : (
              classes.map((c) => (
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
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Users className="w-3 h-3" />
                        {(c as ClassItem).studentCount ?? 0} students
                      </div>
                    </div>
                    <Link href={`/teacher/classes/${c.id}`} onClick={(e) => e.stopPropagation()}>
                      <ChevronRight className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Exam activation panel */}
          {selectedClass && (
            <div className="lg:col-span-2 space-y-4">
              {/* Active exam status */}
              <div className={`rounded-xl border-2 p-5 ${activeExam ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Currently Active Exam</div>
                    {activeExam ? (
                      <div className="text-base font-bold text-green-700 mt-0.5">{activeExam.examName}</div>
                    ) : (
                      <div className="text-sm text-gray-400 mt-0.5">No exam is currently active</div>
                    )}
                  </div>
                  {activeExam && (
                    <button
                      onClick={() => handleDeactivate(activeExam.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                    >
                      <Square className="w-3.5 h-3.5" />
                      Deactivate
                    </button>
                  )}
                </div>
              </div>

              {/* Activate exam */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Activate a Mock Exam</h4>
                <div className="flex gap-2">
                  <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select exam to activate...</option>
                    {allExams?.filter((e) => { const g = parseGrade(classes.find((c) => c.id === selectedClass)?.grade); return e.isPublished && (g === null || e.grade === g); }).map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleActivate}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Activate
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Only published exams can be activated. Students will see the active exam on their dashboard.</p>
              </div>

              {/* All class exams */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900">Exam History</h4>
                </div>
                <div className="divide-y divide-gray-50">
                  {classExams?.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">No exams assigned to this class yet.</div>
                  ) : (
                    classExams?.map((e) => (
                      <div key={e.id} className="px-5 py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{e.examName}</div>
                          <div className="text-xs text-gray-500">{e.examDuration} minutes</div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          e.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {e.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
