import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { usePlatformAuth } from "@/hooks/usePlatformAuth";
import { Download } from "lucide-react";
import { useState } from "react";
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
  strengths: string[];
  weaknesses: string[];
  recommendedInterventionGroup: string;
};

export default function TeacherReports() {
  const { user } = usePlatformAuth();
  const isAuth = !!user;
  const { data: rawClasses } = trpc.teacher.myClasses.useQuery(undefined, { enabled: isAuth });
  const classes = (rawClasses as Array<{ id: number; name: string }> | undefined) ?? [];
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const { data: classReports } = trpc.teacher.getClassReports.useQuery(
    { classId: selectedClassId! },
    { enabled: !!selectedClassId }
  );

  const handleDownloadClassReport = () => {
    if (!selectedClassId) return;
    toast.info("Generating class report PDF...");
    window.open(`/api/reports/class/${selectedClassId}/pdf`, "_blank");
  };

  return (
    <PlatformLayout title="Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Student Reports</h2>
            <p className="text-sm text-gray-500 mt-0.5">View and download detailed assessment reports</p>
          </div>
          {selectedClassId && (
            <button
              onClick={handleDownloadClassReport}
              className="flex items-center gap-2 px-3 py-1.5 bg-[oklch(0.42_0.14_240)] text-white rounded-lg text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download Class Report
            </button>
          )}
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
                    ? "bg-[oklch(0.42_0.14_240)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

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
                    <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {classReports?.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-400">No reports yet. Students must submit exams first.</td></tr>
                  ) : (
                    classReports?.map((r) => {
                      const data = r.reportData as unknown as ReportData;
                      return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-900">{data.studentName}</td>
                          <td className="px-5 py-3 text-gray-600">{data.examName}</td>
                          <td className="px-5 py-3">
                            <span className={`font-semibold ${
                              data.percentage >= 70 ? "text-green-600" :
                              data.percentage >= 50 ? "text-amber-600" : "text-red-600"
                            }`}>{data.percentage}%</span>
                            <span className="text-gray-400 text-xs ml-1">({data.totalScore}/{data.maxScore})</span>
                          </td>
                          <td className="px-5 py-3 text-gray-600">{data.mathScore}%</td>
                          <td className="px-5 py-3 text-gray-600">{data.scienceScore}%</td>
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
                            <div className="flex justify-end">
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
