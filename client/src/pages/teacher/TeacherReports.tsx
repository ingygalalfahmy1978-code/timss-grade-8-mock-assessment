import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { Download, Pencil, Eye, EyeOff, CheckCircle, FileSpreadsheet } from "lucide-react";
import { exportClassResults, exportQuestionAnalysis, type ClassExport } from "@/lib/excelExport";
import { finiteNumber, getReportMaxScore, normalizeSubjectScore } from "@shared/reportData";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type ReportData = {
  studentName: string;
  className: string;
  examName: string;
  totalScore: number;
  maxScore?: number;
  totalMaxPoints?: number;
  percentage: number;
  mathScore: number;
  mathTotal?: number;
  mathMaxPoints?: number;
  scienceScore: number;
  scienceTotal?: number;
  scienceMaxPoints?: number;
  strengths: string[];
  weaknesses: string[];
  recommendedInterventionGroup: string;
};

type Report = {
  id: number;
  attemptId: number;
  studentId: number;
  examId: number;
  classId: number;
  reportData: unknown;
  resultsPublished?: boolean;
};

export default function TeacherReports() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { data: rawClasses } = trpc.teacher.myClasses.useQuery(undefined, { enabled: isAuth });
  const classes = (rawClasses as Array<{ id: number; name: string }> | undefined) ?? [];
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data: classReports } = trpc.teacher.getClassReports.useQuery(
    { classId: selectedClassId! },
    { enabled: !!selectedClassId }
  );

  const publishOne = trpc.teacher.publishResults.useMutation({
    onSuccess: () => {
      utils.teacher.getClassReports.invalidate();
      toast.success("Results published — student can now view them.");
    },
    onError: () => toast.error("Failed to publish results."),
  });

  const unpublishOne = trpc.teacher.unpublishResults.useMutation({
    onSuccess: () => {
      utils.teacher.getClassReports.invalidate();
      toast.success("Results hidden from student.");
    },
    onError: () => toast.error("Failed to unpublish results."),
  });

  const publishAll = trpc.teacher.publishAllResults.useMutation({
    onSuccess: () => {
      utils.teacher.getClassReports.invalidate();
      toast.success("All results published for this class and exam.");
    },
    onError: () => toast.error("Failed to publish all results."),
  });

  const handleDownloadClassReport = () => {
    if (!selectedClassId) return;
    toast.info("Generating class report PDF...");
    window.open(`/api/reports/class/${selectedClassId}/pdf`, "_blank");
  };

  const [, navigate] = useLocation();
  const [exportExamId, setExportExamId] = useState<string>("all");
  const [exporting, setExporting] = useState(false);

  const handleExport = async (kind: "results" | "questions") => {
    if (!selectedClassId) return;
    setExporting(true);
    try {
      const examId = exportExamId === "all" ? undefined : Number(exportExamId);
      const data = (await utils.teacher.exportClassResults.fetch({ classId: selectedClassId, examId })) as unknown as ClassExport;
      if (!data.rows.length) { toast.info("No submitted results to export yet."); return; }
      const examLabel = examId ? (examGroups.find((e) => e.examId === examId)?.examName ?? "Exam") : "All exams";
      if (kind === "results") exportClassResults(data, examLabel);
      else exportQuestionAnalysis(data, examLabel);
      toast.success("Excel file downloaded.");
    } catch (e: unknown) {
      toast.error((e as Error).message || "Could not export the results.");
    } finally {
      setExporting(false);
    }
  };

  // Group reports by exam for the "Publish All" button
  const examGroups = classReports
    ? Array.from(
        classReports.reduce((map, r) => {
          const data = r.reportData as unknown as ReportData;
          const key = `${r.examId}`;
          if (!map.has(key)) map.set(key, { examId: r.examId, examName: data.examName, classId: r.classId });
          return map;
        }, new Map<string, { examId: number; examName: string; classId: number }>())
      ).map(([, v]) => v)
    : [];

  return (
    <PlatformLayout title="Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Student Reports</h2>
            <p className="text-sm text-gray-500 mt-0.5">View, publish, and download detailed assessment reports</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate("/teacher/answer-review")}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Review Answers
            </button>
            {selectedClassId && (
              <button
                onClick={handleDownloadClassReport}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-navy text-white rounded-lg text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download Class Report
              </button>
            )}
          </div>
        </div>

        {/* Class selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class:</label>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedClassId === c.id
                    ? "bg-brand-navy text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Export to Excel */}
        {selectedClassId && examGroups.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-green-700" /> Export to Excel</h3>
            <p className="text-xs text-gray-500 mb-3">Every student's score, Maths and Science scores, each content domain and thinking level, the class average, and who has not submitted yet. Opens in Excel or Google Sheets.</p>
            <div className="flex flex-wrap items-center gap-2">
              <select value={exportExamId} onChange={(e) => setExportExamId(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                <option value="all">All exams</option>
                {examGroups.map((eg) => <option key={eg.examId} value={eg.examId}>{eg.examName}</option>)}
              </select>
              <button
                onClick={() => handleExport("results")}
                disabled={exporting}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4" />
                {exporting ? "Preparing..." : "Export class results"}
              </button>
              <button
                onClick={() => handleExport("questions")}
                disabled={exporting}
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Export question analysis
              </button>
            </div>
          </div>
        )}

        {/* Bulk Publish by Exam */}
        {selectedClassId && examGroups.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Publish All Results by Exam</h3>
            <div className="flex flex-wrap gap-2">
              {examGroups.map((eg) => (
                <button
                  key={eg.examId}
                  onClick={() => publishAll.mutate({ classId: eg.classId, examId: eg.examId })}
                  disabled={publishAll.isPending}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Publish All — {eg.examName}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Clicking "Publish All" makes all submitted results for that exam visible to students immediately.</p>
          </div>
        )}

        {/* Reports table */}
        {selectedClassId && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Reports ({classReports?.length ?? 0})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Student</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Exam</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Score</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Math</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Science</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Group</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Published</th>
                    <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {classReports?.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-8 text-gray-400">No reports yet. Students must submit exams first.</td></tr>
                  ) : (
                    (classReports as Report[] | undefined)?.map((r) => {
                      const data = r.reportData as unknown as ReportData;
                      const isPublished = !!(r as Report).resultsPublished;
                      const percentage = finiteNumber(data.percentage);
                      const math = normalizeSubjectScore(data.mathScore, data.mathTotal, data.mathMaxPoints);
                      const science = normalizeSubjectScore(data.scienceScore, data.scienceTotal, data.scienceMaxPoints);
                      return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-900">{data.studentName}</td>
                          <td className="px-5 py-3 text-gray-600">{data.examName}</td>
                          <td className="px-5 py-3">
                            <span className={`font-semibold ${
                              percentage >= 70 ? "text-green-600" :
                              percentage >= 50 ? "text-amber-600" : "text-red-600"
                            }`}>{percentage}%</span>
                            <span className="text-gray-400 text-xs ml-1">({data.totalScore}/{getReportMaxScore(data)})</span>
                          </td>
                          <td className="px-5 py-3 text-gray-600">{math.percentage}%</td>
                          <td className="px-5 py-3 text-gray-600">{science.percentage}%</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              data.recommendedInterventionGroup?.includes("Advanced") ? "bg-green-100 text-green-700" :
                              data.recommendedInterventionGroup?.includes("Consolidation") ? "bg-blue-100 text-blue-700" :
                              data.recommendedInterventionGroup?.includes("Targeted") ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {data.recommendedInterventionGroup?.replace("Group ", "").split(" – ")[0]}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            {isPublished ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                <Eye className="w-3.5 h-3.5" /> Visible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                                <EyeOff className="w-3.5 h-3.5" /> Hidden
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-1.5">
                              {isPublished ? (
                                <button
                                  onClick={() => unpublishOne.mutate({ attemptId: r.attemptId })}
                                  disabled={unpublishOne.isPending}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200 disabled:opacity-50"
                                >
                                  <EyeOff className="w-3 h-3" />
                                  Hide
                                </button>
                              ) : (
                                <button
                                  onClick={() => publishOne.mutate({ attemptId: r.attemptId })}
                                  disabled={publishOne.isPending}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50"
                                >
                                  <Eye className="w-3 h-3" />
                                  Publish
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  toast.info("Generating PDF...");
                                  window.open(`/api/reports/attempt/${r.attemptId}/pdf`, "_blank");
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                              >
                                <Download className="w-3 h-3" />
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
