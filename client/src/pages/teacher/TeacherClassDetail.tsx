import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, Eye, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

type ReportData = {
  studentName: string;
  className: string;
  examName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  mathScore: number;
  scienceScore: number;
  contentDomainBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  cognitiveDomainBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  strengths: string[];
  weaknesses: string[];
  misconceptionNotes: string[];
  recommendedInterventionGroup: string;
  nextPracticeTargets: string[];
  timeSpentSeconds: number;
};

export default function TeacherClassDetail() {
  const { id } = useParams<{ id: string }>();
  const classId = Number(id);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [assignStudentId, setAssignStudentId] = useState<number | null>(null);

  const { data: students } = trpc.teacher.classStudents.useQuery({ classId });
  const { data: classExams } = trpc.teacher.classExams.useQuery({ classId });
  const { data: classAssignments, refetch: refetchAssignments } = trpc.teacher.getClassStudentAssignments.useQuery({ classId });

  const utils = trpc.useUtils();

  const assignMutation = trpc.teacher.assignExamToStudent.useMutation({
    onSuccess: () => { toast.success("Exam assigned to student"); refetchAssignments(); utils.teacher.getClassStudentAssignments.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const removeMutation = trpc.teacher.removeExamFromStudent.useMutation({
    onSuccess: () => { toast.success("Assignment removed"); refetchAssignments(); utils.teacher.getClassStudentAssignments.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const { data: classProgress } = trpc.teacher.classProgress.useQuery(
    { classId, examId: selectedExamId! },
    { enabled: !!selectedExamId }
  );

  const { data: rawReport } = trpc.teacher.getStudentReport.useQuery(
    { attemptId: selectedAttemptId! },
    { enabled: !!selectedAttemptId }
  );

  const report = rawReport ? (rawReport.reportData as unknown as ReportData) : null;

  const handleDownloadReport = (studentId: number, studentName: string) => {
    toast.info(`Generating PDF report for ${studentName}...`);
    window.open(`/api/reports/student/${studentId}/${classId}/pdf`, "_blank");
  };

  const handleDownloadClassReport = () => {
    toast.info("Generating class report PDF...");
    window.open(`/api/reports/class/${classId}/pdf`, "_blank");
  };

  return (
    <PlatformLayout title="Class Progress & Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/teacher/classes" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Classes
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAssignPanel((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50"
            >
              <UserCheck className="w-4 h-4" />
              Assign Exams
            </button>
            <button
              onClick={handleDownloadClassReport}
              className="flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.42_0.14_240)] text-white rounded-lg text-sm font-medium hover:bg-[oklch(0.38_0.14_240)]"
            >
              <Download className="w-4 h-4" />
              Download Class Report
            </button>
          </div>
        </div>

        {/* Exam selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">View Progress for Exam:</label>
          <select
            value={selectedExamId ?? ""}
            onChange={(e) => setSelectedExamId(e.target.value ? Number(e.target.value) : null)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-w-[200px]"
          >
            <option value="">Select exam...</option>
            {classExams?.map((e) => (
              <option key={e.id} value={e.examId}>{e.examName}</option>
            ))}
          </select>
        </div>

        {/* Per-student exam assignment panel */}
        {showAssignPanel && (
          <div className="bg-white rounded-xl border border-blue-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><UserCheck className="w-4 h-4 text-blue-600" /> Assign Exam to Individual Student</h3>
              <button onClick={() => setShowAssignPanel(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-gray-500">When a student has individual assignments, they will <strong>only</strong> see those exams on their dashboard. Students with no individual assignments see all active class exams.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Select Student</label>
                <select value={assignStudentId ?? ""} onChange={(e) => setAssignStudentId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option value="">Choose student...</option>
                  {students?.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.username})</option>)}
                </select>
              </div>
            </div> {/* end grid */}
            {assignStudentId && (
              <div>
                <div className="text-xs font-medium text-gray-700 mb-2">Available Exams — click to assign or remove:</div>
                <div className="flex flex-wrap gap-2">
                  {classExams?.map((ce) => {
                    const isAssigned = classAssignments?.some(
                      (a) => a.studentId === assignStudentId && a.examId === ce.examId
                    );
                    return (
                      <button key={ce.examId}
                        onClick={() => {
                          if (isAssigned) {
                            removeMutation.mutate({ studentId: assignStudentId, examId: ce.examId, classId });
                          } else {
                            assignMutation.mutate({ studentId: assignStudentId, examId: ce.examId, classId });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${
                          isAssigned
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        {isAssigned ? "✓ " : ""}{ce.examName}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-2">Blue = assigned to this student. Click to toggle.</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student list with progress */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Students ({students?.length ?? 0})</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {students?.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No students in this class.</div>
              ) : (
                students?.map((s) => {
                  const progress = classProgress?.find((p) => p.studentId === s.id);
                  return (
                    <div
                      key={s.id}
                      className={`px-5 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedAttemptId === progress?.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => progress?.id && setSelectedAttemptId(progress.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                          {s.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{s.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{s.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {progress ? (
                          <>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">{progress.percentage ?? 0}%</div>
                              <div className="text-xs text-gray-500">{progress.totalScore ?? 0} pts</div>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              (progress.percentage ?? 0) >= 70 ? "bg-green-100 text-green-700" :
                              (progress.percentage ?? 0) >= 50 ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {(progress.percentage ?? 0) >= 70 ? "Pass" : (progress.percentage ?? 0) >= 50 ? "Near" : "Needs Help"}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDownloadReport(s.id, s.name ?? ""); }}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Download report"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not submitted</span>
                        )}
                        <Eye className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Student report panel */}
          {selectedAttemptId && report && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">Student Report</h3>
                <button
                  onClick={() => {
                    const prog = classProgress?.find((p) => p.id === selectedAttemptId);
                    if (prog) handleDownloadReport(prog.studentId, report.studentName);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-600"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-5 space-y-4 text-sm overflow-y-auto max-h-[600px]">
                <div>
                  <div className="font-semibold text-gray-900 text-base">{report.studentName}</div>
                  <div className="text-gray-500 text-xs">{report.examName}</div>
                </div>

                {/* Score summary */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-700">{report.percentage}%</div>
                    <div className="text-xs text-blue-600">Overall</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-700">{report.totalScore}/{report.maxScore}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-indigo-700">{report.mathScore}%</div>
                    <div className="text-xs text-indigo-600">Math</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-emerald-700">{report.scienceScore}%</div>
                    <div className="text-xs text-emerald-600">Science</div>
                  </div>
                </div>

                {/* Content Domain */}
                <div>
                  <div className="font-semibold text-gray-700 mb-2">Content Domain Breakdown</div>
                  <div className="space-y-1.5">
                    {Object.entries(report.contentDomainBreakdown ?? {}).map(([domain, data]) => (
                      <div key={domain}>
                        <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                          <span>{domain}</span>
                          <span>{data.correct}/{data.total} ({data.percentage}%)</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Strengths</div>
                  <ul className="space-y-0.5">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-green-700 flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Weaknesses</div>
                  <ul className="space-y-0.5">
                    {report.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-red-700 flex items-start gap-1">
                        <span className="text-red-400 mt-0.5">!</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Intervention */}
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Intervention Group</div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    report.recommendedInterventionGroup?.includes("Advanced") ? "bg-green-100 text-green-700" :
                    report.recommendedInterventionGroup?.includes("Consolidation") ? "bg-blue-100 text-blue-700" :
                    report.recommendedInterventionGroup?.includes("Targeted") ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {report.recommendedInterventionGroup}
                  </span>
                </div>

                {/* Next Targets */}
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Next Practice Targets</div>
                  <ul className="space-y-0.5">
                    {report.nextPracticeTargets?.map((t, i) => (
                      <li key={i} className="text-xs text-gray-600">• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
