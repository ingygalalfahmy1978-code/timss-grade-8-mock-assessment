import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

export default function AdminExamDetail() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { id } = useParams<{ id: string }>();
  const examId = Number(id);
  const utils = trpc.useUtils();

  const { data: exam } = trpc.admin.getExamWithQuestions.useQuery({ examId });
  const { data: allQuestions } = trpc.admin.listQuestions.useQuery(undefined, { enabled: isAuth });
  const setExamQuestions = trpc.admin.setExamQuestions.useMutation({ onSuccess: () => utils.admin.getExamWithQuestions.invalidate() });
  const updateExam = trpc.admin.updateExam.useMutation({ onSuccess: () => utils.admin.getExamWithQuestions.invalidate() });

  const [filterSubject, setFilterSubject] = useState("All");
  const [filterDomain, setFilterDomain] = useState("All");
  const [showBank, setShowBank] = useState(false);

  const examQuestions: Array<{ id: number; questionText: string; subject: string; contentDomain: string; cognitiveDomain: string; difficulty: string; questionType: string }> = (exam?.questions as Array<{ id: number; questionText: string; subject: string; contentDomain: string; cognitiveDomain: string; difficulty: string; questionType: string }>) ?? [];
  const examQuestionIds = new Set(examQuestions.map((q) => q.id));

  const availableQuestions = (allQuestions ?? []).filter((q) => {
    if (examQuestionIds.has(q.id)) return false;
    if (filterSubject !== "All" && q.subject !== filterSubject) return false;
    if (filterDomain !== "All" && q.contentDomain !== filterDomain) return false;
    return true;
  }) ?? [];

  if (!exam) return (
    <PlatformLayout title="Loading...">
      <div className="text-center py-16 text-gray-400">Loading exam...</div>
    </PlatformLayout>
  );

  return (
    <PlatformLayout title={exam.name}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/exams" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Exams
          </Link>
        </div>

        {/* Exam info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{exam.name}</h2>
              {exam.description && <p className="text-gray-500 text-sm mt-1">{exam.description}</p>}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{exam.durationMinutes} minutes</span>
                <span>              {examQuestions.length} questions</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${exam.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {(exam as { isPublished: boolean }).isPublished ? "Published" : "Draft"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateExam.mutateAsync({ id: examId, isPublished: !(exam as { isPublished: boolean }).isPublished })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  exam.isPublished ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {(exam as { isPublished: boolean }).isPublished ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => setShowBank(!showBank)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[oklch(0.42_0.14_240)] text-white rounded-lg text-sm font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Questions
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current exam questions */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Questions in This Exam ({exam.questions?.length ?? 0})</h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
              {examQuestions.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No questions added yet. Use the bank on the right.</div>
              ) : (
                examQuestions.map((q, idx) => (
                  <div key={q.id} className="px-5 py-3 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 line-clamp-2">{q.questionText}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${q.subject === "Math" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>{q.subject}</span>
                        <span className="text-xs text-gray-500">{q.contentDomain}</span>
                        <span className="text-xs text-gray-500">{q.cognitiveDomain}</span>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        const newIds = examQuestions.filter((eq) => eq.id !== q.id).map((eq) => eq.id);
                        await setExamQuestions.mutateAsync({ examId, questionIds: newIds });
                        toast.success("Question removed");
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Question bank */}
          {showBank && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2">Question Bank</h3>
                <div className="flex gap-2">
                  <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs">
                    <option value="All">All Subjects</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                  </select>
                  <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs">
                    <option value="All">All Domains</option>
                    {["Number", "Algebra", "Geometry", "Data and Probability", "Biology", "Chemistry", "Physics", "Earth Science"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                {availableQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">No more questions available</div>
                ) : (
                  availableQuestions.map((q) => (
                    <div key={q.id} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 line-clamp-2">{q.questionText}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${q.subject === "Math" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>{q.subject}</span>
                          <span className="text-xs text-gray-500">{q.contentDomain}</span>
                          <span className="text-xs text-gray-500">{q.difficulty}</span>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const newIds = [...examQuestions.map((eq) => eq.id), q.id];
                          await setExamQuestions.mutateAsync({ examId, questionIds: newIds });
                          toast.success("Question added to exam");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-medium flex-shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
